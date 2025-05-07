import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { InsertSlotGame, InsertLiveCasinoGame, InsertSportMatch, InsertTransaction, InsertPromotion, InsertDepositPhone, User, insertSlotGameSchema, insertLiveCasinoGameSchema, insertSportMatchSchema, insertTransactionSchema, insertPromotionSchema, insertDepositPhoneSchema } from "@shared/schema";
import { ZodError } from "zod";
import { createId } from "@paralleldrive/cuid2";
import { WebSocketServer, WebSocket } from "ws";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

// Auth-related functions
const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// ফাংশান যেটি Zod ভ্যালিডেশন ব্যবহার করে
function validateBody<T>(schema: any, body: any): T {
  return schema.parse(body);
}

// এক্সপ্রেস রিকুয়েস্ট হ্যান্ডলারে এরর হ্যান্ডলিং
function asyncHandler(fn: (req: Request, res: Response) => Promise<any>) {
  return async (req: Request, res: Response) => {
    try {
      await fn(req, res);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ errors: err.errors });
      }
      console.error("API Error:", err);
      res.status(500).json({ error: "Server error" });
    }
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);
  
  // অ্যাডমিন একসেস এন্ডপয়েন্ট - এটি বাদ দিই কারণ auth.ts এ আছে
  // app.post("/api/make-admin", asyncHandler(async (req, res) => {
  //   ...
  // }));
  
  // এডমিন মিডলওয়্যার - এডমিন পাথ যাচাই
  const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "অনুগ্রহ করে লগইন করুন" });
    }
    
    const user = req.user as User;
    if (!user.isAdmin) {
      return res.status(403).json({ error: "এডমিন অ্যাক্সেস নেই" });
    }
    
    next();
  };

  // --------------------------------
  // স্লট গেম API এন্ডপয়েন্ট
  // --------------------------------
  
  // সব স্লট গেম
  app.get("/api/slots", asyncHandler(async (req, res) => {
    const games = await storage.getSlotGames();
    res.json(games);
  }));
  
  // জনপ্রিয় স্লট গেম
  app.get("/api/slots/popular", asyncHandler(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const games = await storage.getPopularSlotGames(limit);
    res.json(games);
  }));
  
  // --------------------------------
  // ওয়ালেট এবং ট্রানজেকশন API এন্ডপয়েন্ট
  // --------------------------------
  
  // ইউজারের ট্রানজেকশন লিস্ট
  app.get("/api/transactions", asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "অনুগ্রহ করে লগইন করুন" });
    }
    
    const userId = req.user!.id;
    const transactions = await storage.getUserTransactions(userId);
    res.json(transactions);
  }));
  
  // ডিপোজিট ট্রানজেকশন তৈরি
  app.post("/api/transactions/deposit", asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "অনুগ্রহ করে লগইন করুন" });
    }
    
    const { amount, method, transactionId } = req.body;
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "সঠিক পরিমাণ দিন" });
    }
    
    if (!transactionId) {
      return res.status(400).json({ error: "ট্রানজেকশন আইডি দিন" });
    }
    
    const transaction: InsertTransaction = {
      type: "deposit",
      amount: amount.toString(),
      date: new Date(),
      status: "pending",
      userId: req.user!.id,
      method: method || null,
      details: `ট্রানজেকশন আইডি: ${transactionId}`,
    };
    
    const result = await storage.createTransaction(transaction);
    res.status(201).json(result);
  }));
  
  // উইথড্র ট্রানজেকশন তৈরি
  app.post("/api/transactions/withdraw", asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "অনুগ্রহ করে লগইন করুন" });
    }
    
    const { amount, method, account } = req.body;
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "সঠিক পরিমাণ দিন" });
    }
    
    if (!account) {
      return res.status(400).json({ error: "অ্যাকাউন্ট নম্বর দিন" });
    }
    
    // চেক করা যে ইউজারের যথেষ্ট ব্যালেন্স আছে কিনা
    const user = req.user!;
    if (parseFloat(user.balance) < amount) {
      return res.status(400).json({ error: "আপনার ব্যালেন্সে পর্যাপ্ত পরিমাণ নেই" });
    }
    
    const transaction: InsertTransaction = {
      type: "withdraw",
      amount: amount.toString(),
      date: new Date(),
      status: "pending",
      userId: user.id,
      method: method || null,
      details: account,
    };
    
    const result = await storage.createTransaction(transaction);
    res.status(201).json(result);
  }));
  
  // একটি নির্দিষ্ট স্লট গেম
  app.get("/api/slots/:id", asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const game = await storage.getSlotGameById(id);
    
    if (!game) {
      return res.status(404).json({ error: "স্লট গেম পাওয়া যায়নি" });
    }
    
    res.json(game);
  }));
  
  // নতুন স্লট গেম যোগ করা (এডমিন পাথ, অথেনটিকেশন প্রয়োজন)
  app.post("/api/slots", asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "অনুমতি নেই" });
    }
    
    const data = validateBody<InsertSlotGame>(insertSlotGameSchema, req.body);
    const game = await storage.createSlotGame(data);
    res.status(201).json(game);
  }));
  
  // --------------------------------
  // লাইভ ক্যাসিনো API এন্ডপয়েন্ট
  // --------------------------------
  
  // সব লাইভ ক্যাসিনো গেম
  app.get("/api/live-casino", asyncHandler(async (req, res) => {
    const games = await storage.getLiveCasinoGames();
    res.json(games);
  }));
  
  // ক্যাটাগরি অনুযায়ী লাইভ ক্যাসিনো গেম
  app.get("/api/live-casino/category/:category", asyncHandler(async (req, res) => {
    const category = req.params.category;
    const games = await storage.getLiveCasinoGamesByCategory(category);
    res.json(games);
  }));
  
  // একটি নির্দিষ্ট লাইভ ক্যাসিনো গেম
  app.get("/api/live-casino/:id", asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const game = await storage.getLiveCasinoGameById(id);
    
    if (!game) {
      return res.status(404).json({ error: "লাইভ ক্যাসিনো গেম পাওয়া যায়নি" });
    }
    
    res.json(game);
  }));
  
  // নতুন লাইভ ক্যাসিনো গেম যোগ করা (এডমিন পাথ, অথেনটিকেশন প্রয়োজন)
  app.post("/api/live-casino", asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "অনুমতি নেই" });
    }
    
    const data = validateBody<InsertLiveCasinoGame>(insertLiveCasinoGameSchema, req.body);
    const game = await storage.createLiveCasinoGame(data);
    res.status(201).json(game);
  }));
  
  // --------------------------------
  // স্পোর্টস API এন্ডপয়েন্ট
  // --------------------------------
  
  // সব স্পোর্টস ম্যাচ
  app.get("/api/sports", asyncHandler(async (req, res) => {
    const matches = await storage.getSportMatches();
    res.json(matches);
  }));
  
  // লাইভ ম্যাচ
  app.get("/api/sports/live", asyncHandler(async (req, res) => {
    const matches = await storage.getLiveMatches();
    res.json(matches);
  }));
  
  // একটি নির্দিষ্ট স্পোর্টস ম্যাচ
  app.get("/api/sports/:id", asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const match = await storage.getSportMatchById(id);
    
    if (!match) {
      return res.status(404).json({ error: "স্পোর্টস ম্যাচ পাওয়া যায়নি" });
    }
    
    res.json(match);
  }));
  
  // নতুন স্পোর্টস ম্যাচ যোগ করা (এডমিন পাথ, অথেনটিকেশন প্রয়োজন)
  app.post("/api/sports", asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "অনুমতি নেই" });
    }
    
    const data = validateBody<InsertSportMatch>(insertSportMatchSchema, req.body);
    const match = await storage.createSportMatch(data);
    res.status(201).json(match);
  }));
  
  // স্পোর্টস ম্যাচের স্কোর আপডেট (এডমিন পাথ, অথেনটিকেশন প্রয়োজন)
  app.patch("/api/sports/:id/score", asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "অনুমতি নেই" });
    }
    
    const id = parseInt(req.params.id);
    const { score } = req.body;
    
    const updatedMatch = await storage.updateMatchScore(id, score);
    
    if (!updatedMatch) {
      return res.status(404).json({ error: "স্পোর্টস ম্যাচ পাওয়া যায়নি" });
    }
    
    res.json(updatedMatch);
  }));
  
  // এই সেকশন বাদ দিতে হবে, কারণ আমরা /api/transactions/deposit এবং /api/transactions/withdraw এন্ডপয়েন্ট ইতিমধ্যে যোগ করেছি
  
  // --------------------------------
  // প্রোমোশন API এন্ডপয়েন্ট
  // --------------------------------
  
  // সক্রিয় প্রোমোশন
  app.get("/api/promotions", asyncHandler(async (req, res) => {
    const promotions = await storage.getActivePromotions();
    res.json(promotions);
  }));
  
  // একটি নির্দিষ্ট প্রোমোশন
  app.get("/api/promotions/:id", asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const promotion = await storage.getPromotionById(id);
    
    if (!promotion) {
      return res.status(404).json({ error: "প্রোমোশন পাওয়া যায়নি" });
    }
    
    res.json(promotion);
  }));
  
  // নতুন প্রোমোশন যোগ করা (এডমিন পাথ, অথেনটিকেশন প্রয়োজন)
  app.post("/api/promotions", asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "অনুমতি নেই" });
    }
    
    const data = validateBody<InsertPromotion>(insertPromotionSchema, req.body);
    const promotion = await storage.createPromotion(data);
    res.status(201).json(promotion);
  }));
  
  // --------------------------------
  // ইউজার প্রোফাইল API এন্ডপয়েন্ট
  // --------------------------------
  
  // ইউজার প্রোফাইল আপডেট
  app.patch("/api/profile", asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "অনুমতি নেই" });
    }
    
    const userId = req.user!.id;
    const userData = req.body;
    
    // পাসওয়ার্ড আপডেট করতে দেব না এই রাউটে
    if (userData.password) {
      delete userData.password;
    }
    
    const updatedUser = await storage.updateUser(userId, userData);
    
    if (!updatedUser) {
      return res.status(404).json({ error: "ইউজার পাওয়া যায়নি" });
    }
    
    // পাসওয়ার্ড রিটার্ন করব না
    const { password, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  }));
  
  // --------------------------------
  // এডমিন API এন্ডপয়েন্ট
  // --------------------------------
  
  // সব ইউজার
  app.get("/api/admin/users", adminMiddleware, asyncHandler(async (req, res) => {
    const users = [];
    
    // প্রতিটি ইউজার নিই, কিন্তু পাসওয়ার্ড বাদ দিই
    for (const user of await storage.getAllUsers()) {
      const { password, ...userWithoutPassword } = user;
      users.push(userWithoutPassword);
    }
    
    res.json(users);
  }));
  
  // একটি নির্দিষ্ট ইউজার আপডেট (এডমিন)
  app.patch("/api/admin/users/:id", adminMiddleware, asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const userData = req.body;
    
    const updatedUser = await storage.updateUser(id, userData);
    
    if (!updatedUser) {
      return res.status(404).json({ error: "ইউজার পাওয়া যায়নি" });
    }
    
    // পাসওয়ার্ড রিটার্ন করব না
    const { password, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  }));
  
  // এডমিন ড্যাশবোর্ড স্ট্যাটিস্টিকস
  app.get("/api/admin/stats", adminMiddleware, asyncHandler(async (req, res) => {
    const users = await storage.getAllUsers();
    const transactions = await storage.getAllTransactions();
    const slots = await storage.getSlotGames();
    const liveCasinoGames = await storage.getLiveCasinoGames();
    const sportMatches = await storage.getSportMatches();
    
    // ২৪ ঘণ্টার মধ্যে নতুন ইউজার
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newUsers24h = users.filter(user => user.createdAt > oneDayAgo).length;
    
    // ডিপোজিট ও উইথড্র পরিমাণ
    const totalDeposits = transactions
      .filter(tx => tx.type === "deposit" && tx.status === "success")
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
      
    const totalWithdraws = transactions
      .filter(tx => tx.type === "withdraw" && tx.status === "success")
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
    
    // ২৪ ঘণ্টার মধ্যে ট্রানজেকশন
    const transactions24h = transactions.filter(tx => 
      new Date(tx.date) > oneDayAgo
    ).length;
    
    const stats = {
      totalUsers: users.length,
      newUsers24h,
      totalGames: slots.length + liveCasinoGames.length + sportMatches.length,
      activeGames: sportMatches.filter(match => match.isLive).length + liveCasinoGames.length,
      totalTransactions: transactions.length,
      transactions24h,
      totalDeposits: Math.round(totalDeposits * 100), // পয়সায় রূপান্তর
      totalWithdraws: Math.round(totalWithdraws * 100), // পয়সায় রূপান্তর
      totalRevenue: Math.round((totalDeposits - totalWithdraws) * 100) // পয়সায় রূপান্তর
    };
    
    res.json(stats);
  }));
  
  // সব ট্রানজেকশন (এডমিন)
  app.get("/api/admin/transactions", adminMiddleware, asyncHandler(async (req, res) => {
    const transactions = await storage.getAllTransactions();
    res.json(transactions);
  }));
  
  // ট্রানজেকশন স্ট্যাটাস পরিবর্তন (এডমিন)
  app.patch("/api/admin/transactions/:id/status", adminMiddleware, asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    
    if (!status || !["success", "pending", "failed"].includes(status)) {
      return res.status(400).json({ error: "অবৈধ স্ট্যাটাস" });
    }
    
    const updatedTransaction = await storage.updateTransactionStatus(id, status);
    
    if (!updatedTransaction) {
      return res.status(404).json({ error: "ট্রানজেকশন পাওয়া যায়নি" });
    }
    
    res.json(updatedTransaction);
  }));
  
  // পাসওয়ার্ড পরিবর্তন
  app.post("/api/password", asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "অনুমতি নেই" });
    }
    
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "বর্তমান এবং নতুন পাসওয়ার্ড উভয়ই প্রয়োজন" });
    }
    
    // বর্তমান পাসওয়ার্ড যাচাই
    const user = await storage.getUser(req.user!.id);
    
    if (!user) {
      return res.status(404).json({ error: "ইউজার পাওয়া যায়নি" });
    }
    
    // পাসওয়ার্ড মিলিয়ে দেখি
    const isMatch = await comparePasswords(currentPassword, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ error: "বর্তমান পাসওয়ার্ড সঠিক নয়" });
    }
    
    // নতুন পাসওয়ার্ড হ্যাশ করি
    const hashedPassword = await hashPassword(newPassword);
    
    // পাসওয়ার্ড আপডেট করি
    const updatedUser = await storage.updateUser(user.id, {
      password: hashedPassword
    });
    
    if (!updatedUser) {
      return res.status(500).json({ error: "পাসওয়ার্ড আপডেট করতে সমস্যা হয়েছে" });
    }
    
    res.status(200).json({ message: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে" });
  }));
  
  // --------------------------------
  // এডমিন বানানোর জন্য টেম্পোরারি এন্ডপয়েন্ট (ডেভেলপমেন্ট পারপাসে)
  app.post("/api/make-admin", asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "অনুমতি নেই" });
    }
    
    const userId = req.user!.id;
    
    // ইউজারকে এডমিন বানানো
    const updatedUser = await storage.updateUser(userId, { isAdmin: true });
    
    if (!updatedUser) {
      return res.status(500).json({ error: "এডমিন বানাতে সমস্যা হয়েছে" });
    }
    
    res.json({ success: true, message: "আপনি এখন এডমিন" });
  }));
  
  // --------------------------------
  // ডিপোজিট ফোন নাম্বার API এন্ডপয়েন্ট
  // --------------------------------
  
  // সব ডিপোজিট ফোন নাম্বার (পাবলিক)
  app.get("/api/deposit-phones", asyncHandler(async (req, res) => {
    const phones = await storage.getDepositPhones();
    res.json(phones);
  }));
  
  // একটি নির্দিষ্ট ডিপোজিট ফোন নাম্বার
  app.get("/api/deposit-phones/:id", asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const phone = await storage.getDepositPhoneById(id);
    
    if (!phone) {
      return res.status(404).json({ error: "ডিপোজিট ফোন নাম্বার পাওয়া যায়নি" });
    }
    
    res.json(phone);
  }));
  
  // সব ডিপোজিট ফোন নাম্বার পাওয়া (এডমিন পাথ)
  app.get("/api/admin/deposit-phones", adminMiddleware, asyncHandler(async (req, res) => {
    const phones = await storage.getDepositPhones();
    res.json(phones);
  }));

  // নতুন ডিপোজিট ফোন নাম্বার যোগ করা (এডমিন পাথ)
  app.post("/api/admin/deposit-phones", adminMiddleware, asyncHandler(async (req, res) => {
    const data = validateBody<InsertDepositPhone>(insertDepositPhoneSchema, req.body);
    const phone = await storage.createDepositPhone(data);
    res.status(201).json(phone);
  }));
  
  // ডিপোজিট ফোন আপডেট করা (এডমিন পাথ)
  app.patch("/api/admin/deposit-phones/:id", adminMiddleware, asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const phoneData = req.body;
    
    const updatedPhone = await storage.updateDepositPhone(id, phoneData);
    
    if (!updatedPhone) {
      return res.status(404).json({ error: "ডিপোজিট ফোন নাম্বার পাওয়া যায়নি" });
    }
    
    res.json(updatedPhone);
  }));
  
  // ডিপোজিট ফোন ডিলিট করা (এডমিন পাথ)
  app.delete("/api/admin/deposit-phones/:id", adminMiddleware, asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteDepositPhone(id);
    
    if (!success) {
      return res.status(404).json({ error: "ডিপোজিট ফোন নাম্বার পাওয়া যায়নি" });
    }
    
    res.status(204).end();
  }));
  
  // ডিপোজিট ফোন স্ট্যাটাস টগল করা (এডমিন পাথ)
  app.patch("/api/admin/deposit-phones/:id/toggle-status", adminMiddleware, asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const { isActive } = req.body;
    
    if (isActive === undefined) {
      return res.status(400).json({ error: "isActive প্যারামিটার দিতে হবে" });
    }
    
    const updatedPhone = await storage.toggleDepositPhoneStatus(id, isActive);
    
    if (!updatedPhone) {
      return res.status(404).json({ error: "ডিপোজিট ফোন নাম্বার পাওয়া যায়নি" });
    }
    
    res.json(updatedPhone);
  }));
  
  // --------------------------------
  // ডেমো ডাটা API এন্ডপয়েন্ট (টেস্টিং-এর জন্য)
  // --------------------------------
  
  // জনপ্রিয় গেম
  app.get("/api/games/popular", (req, res) => {
    res.json([
      { id: 1, name: "গোল্ডেন ড্রাগন", type: "slot", popularity: "hot" },
      { id: 2, name: "টেক্সাস হোল্ডেম", type: "poker", popularity: "top" },
      { id: 3, name: "লাইভ রুলেট", type: "casino", popularity: "hot" },
      { id: 4, name: "ফুটবল বেটিং", type: "sports", popularity: "live" },
      { id: 5, name: "স্পিড ব্যাকার্যাট", type: "casino", popularity: "new" },
      { id: 6, name: "মেগা জ্যাকপট", type: "slot", popularity: "hot" }
    ]);
  });

  // লাইভ গেম
  app.get("/api/games/live", (req, res) => {
    res.json([
      { id: 1, name: "লাইভ রুলেট", type: "casino", players: 100 },
      { id: 2, name: "ব্ল্যাকজ্যাক", type: "cards", players: 50 },
      { id: 3, name: "টেক্সাস হোল্ডেম", type: "poker", tables: 25 },
      { id: 4, name: "বাকারাত", type: "casino", players: 30 }
    ]);
  });

  // সার্ভার তৈরি
  const httpServer = createServer(app);
  
  // WebSocket সার্ভার সেটআপ (লাইভ আপডেট, চ্যাট, ইত্যাদির জন্য)
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws'
  });
  
  wss.on('connection', (ws) => {
    console.log('WebSocket ক্লায়েন্ট সংযুক্ত হয়েছে');
    
    // ক্লায়েন্টকে স্বাগতম মেসেজ পাঠাই
    ws.send(JSON.stringify({
      type: 'welcome',
      message: 'TK999 লাইভ সার্ভারে স্বাগতম!'
    }));
    
    // ক্লায়েন্ট থেকে মেসেজ রিসিভ করা
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('ক্লায়েন্ট থেকে প্রাপ্ত মেসেজ:', data);
        
        // এখানে ক্লায়েন্টের মেসেজ প্রসেস করা যাবে
        // উদাহরণঃ ইউজার লগইন, বেট প্লেস, ইত্যাদি
        
        // রিস্পন্স পাঠানো
        ws.send(JSON.stringify({
          type: 'ack',
          id: createId(),
          receivedAt: new Date().toISOString()
        }));
      } catch (err) {
        console.error('ম্যাসেজ পার্স করতে সমস্যা:', err);
      }
    });
    
    // কানেকশন বন্ধ হয়ে গেলে
    ws.on('close', () => {
      console.log('WebSocket ক্লায়েন্ট সংযোগ বিচ্ছিন্ন হয়েছে');
    });
  });
  
  // লাইভ স্কোর সিমুলেশন (প্রতি ৩০ সেকেন্ডে আপডেট)
  setInterval(() => {
    const liveMatches = storage.getLiveMatches();
    
    // লাইভ ম্যাচ থাকলে স্কোর আপডেট পাঠাই
    liveMatches.then(matches => {
      if (matches.length > 0) {
        // সব কানেক্টেড ক্লায়েন্টকে পাঠাই
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'liveScore',
              matches: matches.map(match => ({
                id: match.id,
                homeTeam: match.homeTeam,
                awayTeam: match.awayTeam,
                score: match.score,
                time: match.time,
                statistics: match.statistics
              }))
            }));
          }
        });
      }
    });
  }, 30000);

  return httpServer;
}
