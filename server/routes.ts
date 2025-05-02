import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, requireAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Books API
  app.get("/api/books", async (req, res) => {
    try {
      const books = await storage.getAllBooks();
      res.json(books);
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ message: "Failed to fetch books" });
    }
  });

  app.get("/api/books/:id", async (req, res) => {
    try {
      const book = await storage.getBookById(parseInt(req.params.id));
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      res.json(book);
    } catch (error) {
      console.error("Error fetching book:", error);
      res.status(500).json({ message: "Failed to fetch book" });
    }
  });

  // User's books (reading list) API
  app.get("/api/my-books", requireAuth, async (req, res) => {
    try {
      const userBooks = await storage.getUserBooks(req.user!.id);
      res.json(userBooks);
    } catch (error) {
      console.error("Error fetching user books:", error);
      res.status(500).json({ message: "Failed to fetch your books" });
    }
  });

  app.post("/api/my-books", requireAuth, async (req, res) => {
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

  app.patch("/api/my-books/progress", requireAuth, async (req, res) => {
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

  // Reading stats API
  app.get("/api/reading-stats", requireAuth, async (req, res) => {
    try {
      const stats = await storage.getReadingStats(req.user!.id);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching reading stats:", error);
      res.status(500).json({ message: "Failed to fetch reading statistics" });
    }
  });

  // Reviews API
  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = await storage.getAllReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", requireAuth, async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
