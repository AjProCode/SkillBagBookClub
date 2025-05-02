import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, requireAuth, requireSubscription } from "./auth";

// Simple middleware to check if user is admin
// In a real app, you would have proper role-based authorization
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  // For demo purposes, user with id=1 is admin
  if (req.user?.id !== 1) {
    return res.status(403).json({ message: "Admin access required" });
  }
  
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Books API - Restricted for subscribers for full content
  app.get("/api/books", requireAuth, async (req, res) => {
    try {
      const books = await storage.getAllBooks();
      
      // If user is not subscribed, just return limited preview data
      if (!req.user.subscription) {
        const limitedBooks = books.map(book => ({
          id: book.id,
          title: book.title,
          author: book.author,
          coverImage: book.coverImage,
          isPreview: true,
          previewDescription: book.description 
            ? book.description.substring(0, 100) + "... (Subscribe to read more)"
            : "Subscribe to access full book details."
        }));
        return res.json(limitedBooks);
      }
      
      // For subscribers, return full data
      res.json(books);
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ message: "Failed to fetch books" });
    }
  });

  app.get("/api/books/:id", requireAuth, async (req, res) => {
    try {
      const book = await storage.getBookById(parseInt(req.params.id));
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      // If user is not subscribed, just return limited preview data
      if (!req.user.subscription) {
        return res.json({
          id: book.id,
          title: book.title,
          author: book.author,
          coverImage: book.coverImage,
          isPreview: true,
          previewDescription: book.description 
            ? book.description.substring(0, 100) + "... (Subscribe to read more)"
            : "Subscribe to access full book details."
        });
      }
      
      // For subscribers, return full data
      res.json(book);
    } catch (error) {
      console.error("Error fetching book:", error);
      res.status(500).json({ message: "Failed to fetch book" });
    }
  });

  // User's books (reading list) API - Subscribers Only
  app.get("/api/my-books", requireSubscription, async (req, res) => {
    try {
      const userBooks = await storage.getUserBooks(req.user!.id);
      res.json(userBooks);
    } catch (error) {
      console.error("Error fetching user books:", error);
      res.status(500).json({ message: "Failed to fetch your books" });
    }
  });

  app.post("/api/my-books", requireSubscription, async (req, res) => {
    try {
      const { bookId } = req.body;
      if (!bookId) {
        return res.status(400).json({ message: "Book ID is required" });
      }

      const existingUserBook = await storage.getUserBookByBookId(req.user!.id, parseInt(bookId));
      if (existingUserBook) {
        return res.status(409).json({ message: "Book already in your reading list" });
      }

      const userBook = await storage.addBookToUser(req.user!.id, parseInt(bookId));
      res.status(201).json(userBook);
    } catch (error) {
      console.error("Error adding book to user:", error);
      res.status(500).json({ message: "Failed to add book to your list" });
    }
  });

  app.patch("/api/my-books/progress", requireSubscription, async (req, res) => {
    try {
      const { bookId, progress } = req.body;
      if (!bookId || progress === undefined) {
        return res.status(400).json({ message: "Book ID and progress are required" });
      }

      const userBook = await storage.updateReadingProgress(
        req.user!.id,
        parseInt(bookId),
        parseInt(progress)
      );
      res.json(userBook);
    } catch (error) {
      console.error("Error updating reading progress:", error);
      res.status(500).json({ message: "Failed to update reading progress" });
    }
  });

  // Reading stats API - Subscribers Only
  app.get("/api/reading-stats", requireSubscription, async (req, res) => {
    try {
      const stats = await storage.getReadingStats(req.user!.id);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching reading stats:", error);
      res.status(500).json({ message: "Failed to fetch reading statistics" });
    }
  });
  
  // Reading activity API - Subscribers Only
  app.get("/api/reading-activities/:bookId", requireSubscription, async (req, res) => {
    try {
      const bookId = parseInt(req.params.bookId);
      if (isNaN(bookId)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }
      
      const activities = await storage.getReadingActivitiesForBook(req.user!.id, bookId);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching reading activities:", error);
      res.status(500).json({ message: "Failed to fetch reading activities" });
    }
  });
  
  app.post("/api/reading-activities", requireSubscription, async (req, res) => {
    try {
      const { bookId, minutes, date, notes } = req.body;
      
      if (!bookId || !minutes || !date) {
        return res.status(400).json({ message: "Book ID, minutes, and date are required" });
      }
      
      // Validate that user has this book in their reading list
      const userBook = await storage.getUserBookByBookId(req.user!.id, parseInt(bookId));
      if (!userBook) {
        return res.status(400).json({ message: "Book not found in your reading list" });
      }
      
      const activity = await storage.createReadingActivity(
        req.user!.id,
        parseInt(bookId),
        parseInt(minutes),
        new Date(date),
        notes
      );
      
      res.status(201).json(activity);
    } catch (error) {
      console.error("Error creating reading activity:", error);
      res.status(500).json({ message: "Failed to log reading activity" });
    }
  });

  // Reviews API
  app.get("/api/reviews", requireAuth, async (req, res) => {
    try {
      const reviews = await storage.getAllReviews();
      
      // If user is not subscribed, just return limited data
      if (!req.user.subscription) {
        const limitedReviews = reviews
          .slice(0, 2) // Only return 2 reviews for non-subscribers
          .map(review => ({
            id: review.id,
            rating: review.rating,
            review: review.review.substring(0, 50) + "... (Subscribe to see full reviews)",
            bookId: review.bookId,
            userId: review.userId,
            isPreview: true,
          }));
        return res.json(limitedReviews);
      }
      
      // For subscribers, return all reviews
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", requireSubscription, async (req, res) => {
    try {
      const { bookId, rating, review, favoriteCharacter } = req.body;
      if (!bookId || !rating || !review) {
        return res.status(400).json({ message: "Book ID, rating, and review are required" });
      }

      // Check if user has the book marked as completed (100% progress)
      const userBook = await storage.getUserBookByBookId(req.user!.id, parseInt(bookId));
      if (!userBook) {
        return res.status(400).json({ message: "You must add this book to your reading list first" });
      }

      if (userBook.progress < 100) {
        return res.status(400).json({ message: "You must finish reading the book before reviewing it" });
      }

      // Check if user has already reviewed this book
      const existingReview = await storage.getUserReviewForBook(req.user!.id, parseInt(bookId));
      if (existingReview) {
        return res.status(409).json({ message: "You have already reviewed this book" });
      }

      const newReview = await storage.createReview(
        req.user!.id,
        parseInt(bookId),
        parseInt(rating),
        review,
        favoriteCharacter
      );
      res.status(201).json(newReview);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Subscription API
  app.post("/api/subscribe", requireAuth, async (req, res) => {
    try {
      const { planId, price } = req.body;
      if (!planId || !price) {
        return res.status(400).json({ message: "Plan ID and price are required" });
      }

      // Check if user already has an active subscription
      if (req.user!.subscription) {
        return res.status(409).json({ message: "You already have an active subscription" });
      }

      // In a real app, this would integrate with a payment gateway
      // For demo purposes, we'll just create a subscription record
      const subscription = await storage.createSubscription(req.user!.id, planId, price);
      res.status(201).json({ 
        message: "Subscription created successfully", 
        subscriptionId: subscription.id 
      });
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  // Admin API endpoints - Admin Only
  // Get all users
  app.get("/api/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Get all user books
  app.get("/api/all-user-books", requireAdmin, async (req, res) => {
    try {
      const allUserBooks = await storage.getAllUserBooks();
      res.json(allUserBooks);
    } catch (error) {
      console.error("Error fetching all user books:", error);
      res.status(500).json({ message: "Failed to fetch all user books" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
