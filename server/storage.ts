import session from "express-session";
import connectPg from "connect-pg-simple";
import { eq, and } from "drizzle-orm";
import { pool, db } from "@db";
import * as schema from "@shared/schema";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<schema.User>;
  getUserByUsername(username: string): Promise<schema.User | undefined>;
  createUser(user: schema.InsertUser): Promise<schema.User>;
  
  // Book methods
  getAllBooks(): Promise<schema.Book[]>;
  getBookById(id: number): Promise<schema.Book | undefined>;
  
  // UserBook methods
  getUserBooks(userId: number): Promise<schema.UserBook[]>;
  getUserBookByBookId(userId: number, bookId: number): Promise<schema.UserBook | undefined>;
  addBookToUser(userId: number, bookId: number): Promise<schema.UserBook>;
  updateReadingProgress(userId: number, bookId: number, progress: number): Promise<schema.UserBook>;
  
  // Reading stats
  getReadingStats(userId: number): Promise<{
    booksRead: number;
    readingStreak: number;
    hoursRead: number;
    readingLevel: string;
    yearlyGoal: number;
    yearlyProgress: number;
  }>;
  
  // Review methods
  getAllReviews(): Promise<schema.BookReview[]>;
  getUserReviewForBook(userId: number, bookId: number): Promise<schema.BookReview | undefined>;
  createReview(
    userId: number,
    bookId: number,
    rating: number,
    review: string,
    favoriteCharacter?: string
  ): Promise<schema.BookReview>;
  
  // Subscription methods
  createSubscription(userId: number, planId: string, price: number): Promise<schema.Subscription>;
  
  // Session store
  sessionStore: session.Store;
}

class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // User methods
  async getUser(id: number): Promise<schema.User> {
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .leftJoin(schema.subscriptions, eq(schema.subscriptions.userId, schema.users.id));
    
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    return {
      ...user.users,
      subscription: user.subscriptions || null,
    };
  }

  async getUserByUsername(username: string): Promise<schema.User | undefined> {
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.username, username))
      .leftJoin(schema.subscriptions, eq(schema.subscriptions.userId, schema.users.id));
    
    if (!user) {
      return undefined;
    }
    
    return {
      ...user.users,
      subscription: user.subscriptions || null,
    };
  }

  async createUser(user: schema.InsertUser): Promise<schema.User> {
    const [newUser] = await db
      .insert(schema.users)
      .values(user)
      .returning();
    
    return {
      ...newUser,
      subscription: null,
    };
  }

  // Book methods
  async getAllBooks(): Promise<schema.Book[]> {
    return await db.select().from(schema.books);
  }

  async getBookById(id: number): Promise<schema.Book | undefined> {
    const [book] = await db
      .select()
      .from(schema.books)
      .where(eq(schema.books.id, id));
    
    return book;
  }

  // UserBook methods
  async getUserBooks(userId: number): Promise<schema.UserBook[]> {
    const userBooks = await db
      .select()
      .from(schema.userBooks)
      .where(eq(schema.userBooks.userId, userId))
      .leftJoin(schema.books, eq(schema.books.id, schema.userBooks.bookId));
    
    return userBooks.map(ub => ({
      ...ub.user_books,
      book: ub.books!,
    }));
  }

  async getUserBookByBookId(userId: number, bookId: number): Promise<schema.UserBook | undefined> {
    const [userBook] = await db
      .select()
      .from(schema.userBooks)
      .where(
        and(
          eq(schema.userBooks.userId, userId),
          eq(schema.userBooks.bookId, bookId)
        )
      )
      .leftJoin(schema.books, eq(schema.books.id, schema.userBooks.bookId));
    
    if (!userBook) {
      return undefined;
    }
    
    return {
      ...userBook.user_books,
      book: userBook.books!,
    };
  }

  async addBookToUser(userId: number, bookId: number): Promise<schema.UserBook> {
    const [userBook] = await db
      .insert(schema.userBooks)
      .values({
        userId,
        bookId,
        progress: 0,
        startDate: new Date(),
      })
      .returning();
    
    const book = await this.getBookById(bookId);
    
    return {
      ...userBook,
      book: book!,
    };
  }

  async updateReadingProgress(userId: number, bookId: number, progress: number): Promise<schema.UserBook> {
    const [userBook] = await db
      .update(schema.userBooks)
      .set({
        progress,
        lastUpdated: new Date(),
        ...(progress === 100 ? { completionDate: new Date() } : {}),
      })
      .where(
        and(
          eq(schema.userBooks.userId, userId),
          eq(schema.userBooks.bookId, bookId)
        )
      )
      .returning();
    
    const book = await this.getBookById(bookId);
    
    return {
      ...userBook,
      book: book!,
    };
  }

  // Reading stats
  async getReadingStats(userId: number): Promise<{
    booksRead: number;
    readingStreak: number;
    hoursRead: number;
    readingLevel: string;
    yearlyGoal: number;
    yearlyProgress: number;
  }> {
    // Get completed books
    const completedBooks = await db
      .select()
      .from(schema.userBooks)
      .where(
        and(
          eq(schema.userBooks.userId, userId),
          eq(schema.userBooks.progress, 100)
        )
      );
    
    // Calculate reading streak (in a real app, would be more complex)
    // For demo purposes, we're using a simplified approach
    const userActivities = await db
      .select()
      .from(schema.readingActivities)
      .where(eq(schema.readingActivities.userId, userId))
      .orderBy(schema.readingActivities.date);
    
    // Simple algorithm for consecutive days
    let streak = 0;
    if (userActivities.length > 0) {
      const sortedDates = userActivities.map(a => new Date(a.date).toISOString().split('T')[0]);
      const uniqueDates = [...new Set(sortedDates)].sort();
      
      let currentStreak = 1;
      
      for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = new Date(uniqueDates[i - 1]);
        const currDate = new Date(uniqueDates[i]);
        const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
      }
      
      streak = currentStreak;
    }
    
    // Calculate total reading hours
    const totalMinutes = userActivities.reduce((sum, activity) => sum + activity.minutes, 0);
    const hoursRead = Math.round(totalMinutes / 60);
    
    // Determine reading level based on books read
    let readingLevel = "Beginner";
    if (completedBooks.length >= 5) readingLevel = "Explorer";
    if (completedBooks.length >= 10) readingLevel = "Adventurer";
    if (completedBooks.length >= 20) readingLevel = "Scholar";
    if (completedBooks.length >= 30) readingLevel = "Bookworm";
    if (completedBooks.length >= 50) readingLevel = "Maestro";
    
    // Get yearly goal (in a real app, would come from user settings)
    const yearlyGoal = 20;
    
    return {
      booksRead: completedBooks.length,
      readingStreak: streak,
      hoursRead,
      readingLevel,
      yearlyGoal,
      yearlyProgress: completedBooks.length,
    };
  }

  // Review methods
  async getAllReviews(): Promise<schema.BookReview[]> {
    const reviews = await db
      .select()
      .from(schema.bookReviews)
      .leftJoin(schema.books, eq(schema.books.id, schema.bookReviews.bookId))
      .leftJoin(schema.users, eq(schema.users.id, schema.bookReviews.userId))
      .orderBy(schema.bookReviews.createdAt);
    
    return reviews.map(r => ({
      ...r.book_reviews,
      book: r.books!,
      user: {
        id: r.users!.id,
        username: r.users!.username,
      },
    }));
  }

  async getUserReviewForBook(userId: number, bookId: number): Promise<schema.BookReview | undefined> {
    const [review] = await db
      .select()
      .from(schema.bookReviews)
      .where(
        and(
          eq(schema.bookReviews.userId, userId),
          eq(schema.bookReviews.bookId, bookId)
        )
      )
      .leftJoin(schema.books, eq(schema.books.id, schema.bookReviews.bookId))
      .leftJoin(schema.users, eq(schema.users.id, schema.bookReviews.userId));
    
    if (!review) {
      return undefined;
    }
    
    return {
      ...review.book_reviews,
      book: review.books!,
      user: {
        id: review.users!.id,
        username: review.users!.username,
      },
    };
  }

  async createReview(
    userId: number,
    bookId: number,
    rating: number,
    review: string,
    favoriteCharacter?: string
  ): Promise<schema.BookReview> {
    const [newReview] = await db
      .insert(schema.bookReviews)
      .values({
        userId,
        bookId,
        rating,
        review,
        favoriteCharacter,
        likes: 0,
        comments: 0,
        createdAt: new Date(),
      })
      .returning();
    
    const book = await this.getBookById(bookId);
    const user = await this.getUser(userId);
    
    return {
      ...newReview,
      book: book!,
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  // Subscription methods
  async createSubscription(userId: number, planId: string, price: number): Promise<schema.Subscription> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 3); // 3 month subscription
    
    const [subscription] = await db
      .insert(schema.subscriptions)
      .values({
        userId,
        planId,
        price,
        startDate,
        endDate,
        status: "active",
      })
      .returning();
    
    return subscription;
  }
}

export const storage = new DatabaseStorage();
