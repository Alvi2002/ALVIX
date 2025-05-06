import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { InsertSlotGame, InsertLiveCasinoGame, InsertSportMatch, InsertTransaction, InsertPromotion, insertSlotGameSchema, insertLiveCasinoGameSchema, insertSportMatchSchema, insertTransactionSchema, insertPromotionSchema } from "@shared/schema";
import { ZodError } from "zod";
import { createId } from "@paralleldrive/cuid2";
import { WebSocketServer, WebSocket } from "ws";

// ফাংশান যেটি Zod ভ্যালিডেশন ব্যবহার করে
function validateBody<T>(schema: any, body: any): T {
  return schema.parse(body);
}

// এক্সপ্রেস রিকুয়েস্ট হ্যান্ডলারে এরর হ্যান্ডলিং
function asyncHandler(fn: (req: Request, res: Response) => Promise<void>) {
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
    
    const { amount, method } = req.body;
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "সঠিক পরিমাণ দিন" });
    }
    
    const transaction: InsertTransaction = {
      type: "deposit",
      amount: amount.toString(),
      date: new Date(),
      status: "pending",
      userId: req.user!.id,
      method: method || null,
      details: "ডিপোজিট অনুরোধ গৃহীত হয়েছে।",
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
