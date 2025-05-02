import { pgTable, text, serial, integer, timestamp, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  age: integer("age"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Books table
export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  description: text("description").notNull(),
  coverImage: text("cover_image").notNull(),
  ageRange: text("age_range").notNull(), // "8-10", "11-13", "14-16"
  genre: text("genre").notNull(), // "adventure", "fantasy", "mystery", "scifi", etc.
  rating: integer("rating").default(0), // Average rating from reviews
  reviewCount: integer("review_count").default(0), // Number of reviews
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User Books (Reading List) table
export const userBooks = pgTable("user_books", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  bookId: integer("book_id").references(() => books.id).notNull(),
  progress: integer("progress").default(0).notNull(), // Reading progress in %
  startDate: timestamp("start_date").notNull(),
  completionDate: timestamp("completion_date"),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

// Book Reviews table
export const bookReviews = pgTable("book_reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  bookId: integer("book_id").references(() => books.id).notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  review: text("review").notNull(),
  favoriteCharacter: text("favorite_character"),
  likes: integer("likes").default(0).notNull(),
  comments: integer("comments").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reading Activities table (for tracking reading sessions and streak)
export const readingActivities = pgTable("reading_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  bookId: integer("book_id").references(() => books.id).notNull(),
  date: date("date").notNull(),
  minutes: integer("minutes").notNull(), // Minutes spent reading
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Subscriptions table
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  planId: text("plan_id").notNull(), // e.g., "three_month_premium"
  price: integer("price").notNull(), // Price in INR
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").notNull(), // "active", "cancelled", "expired"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define relations
export const usersRelations = relations(users, ({ many, one }) => ({
  userBooks: many(userBooks),
  bookReviews: many(bookReviews),
  readingActivities: many(readingActivities),
  subscription: one(subscriptions),
}));

export const booksRelations = relations(books, ({ many }) => ({
  userBooks: many(userBooks),
  bookReviews: many(bookReviews),
  readingActivities: many(readingActivities),
}));

export const userBooksRelations = relations(userBooks, ({ one }) => ({
  user: one(users, { fields: [userBooks.userId], references: [users.id] }),
  book: one(books, { fields: [userBooks.bookId], references: [books.id] }),
}));

export const bookReviewsRelations = relations(bookReviews, ({ one }) => ({
  user: one(users, { fields: [bookReviews.userId], references: [users.id] }),
  book: one(books, { fields: [bookReviews.bookId], references: [books.id] }),
}));

export const readingActivitiesRelations = relations(readingActivities, ({ one }) => ({
  user: one(users, { fields: [readingActivities.userId], references: [users.id] }),
  book: one(books, { fields: [readingActivities.bookId], references: [books.id] }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));

// Export types
export type User = typeof users.$inferSelect & {
  subscription: typeof subscriptions.$inferSelect | null;
};
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Book = typeof books.$inferSelect;
export type UserBook = typeof userBooks.$inferSelect & {
  book: Book;
};
export type BookReview = typeof bookReviews.$inferSelect & {
  book: Book;
  user: {
    id: number;
    username: string;
  };
};
export type ReadingActivity = typeof readingActivities.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
