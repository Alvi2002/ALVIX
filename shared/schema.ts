import { pgTable, text, serial, integer, boolean, timestamp, numeric, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ইউজার টেবিল
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  phone: text("phone"),
  fullName: text("full_name"),
  balance: numeric("balance").default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isVip: boolean("is_vip").default(false),
  avatarUrl: text("avatar_url"),
  isAdmin: boolean("is_admin").default(false),
});

// স্লটস গেম টেবিল
export const slotGames = pgTable("slot_games", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  provider: text("provider").notNull(),
  image: text("image").notNull(),
  rtp: text("rtp").notNull(),
  isPopular: boolean("is_popular").default(false),
  isFeatured: boolean("is_featured").default(false),
  badgeType: text("badge_type"),
  badgeText: text("badge_text"),
});

// লাইভ ক্যাসিনো গেম টেবিল
export const liveCasinoGames = pgTable("live_casino_games", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  provider: text("provider").notNull(),
  image: text("image").notNull(),
  players: text("players"),
  category: text("category").notNull(),
  isPopular: boolean("is_popular").default(false),
  isFeatured: boolean("is_featured").default(false),
  badgeType: text("badge_type"),
  badgeText: text("badge_text"),
});

// স্পোর্টস ম্যাচ টেবিল
export const sportMatches = pgTable("sport_matches", {
  id: serial("id").primaryKey(),
  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),
  league: text("league").notNull(),
  time: text("time").notNull(),
  date: text("date").notNull(),
  isLive: boolean("is_live").default(false),
  odds: jsonb("odds").notNull(), // { home: number, draw: number, away: number }
  statistics: jsonb("statistics"), // { possession: { home: number, away: number }, shots: { home: number, away: number } }
  score: jsonb("score"), // { home: number, away: number }
});

// ট্রানজেকশন টেবিল
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: numeric("amount").notNull(),
  type: text("type").notNull(), // "deposit", "withdraw", "bonus", "win", "lose"
  date: timestamp("date").defaultNow().notNull(),
  status: text("status").notNull(), // "success", "pending", "failed"
  method: text("method"),
  details: text("details"),
});

// প্রোমোশন টেবিল
export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  phone: true,
  fullName: true,
});

export const insertSlotGameSchema = createInsertSchema(slotGames);
export const insertLiveCasinoGameSchema = createInsertSchema(liveCasinoGames);
export const insertSportMatchSchema = createInsertSchema(sportMatches);
export const insertTransactionSchema = createInsertSchema(transactions);
export const insertPromotionSchema = createInsertSchema(promotions);

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSlotGame = z.infer<typeof insertSlotGameSchema>;
export type SlotGame = typeof slotGames.$inferSelect;

export type InsertLiveCasinoGame = z.infer<typeof insertLiveCasinoGameSchema>;
export type LiveCasinoGame = typeof liveCasinoGames.$inferSelect;

export type InsertSportMatch = z.infer<typeof insertSportMatchSchema>;
export type SportMatch = typeof sportMatches.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export type InsertPromotion = z.infer<typeof insertPromotionSchema>;
export type Promotion = typeof promotions.$inferSelect;
