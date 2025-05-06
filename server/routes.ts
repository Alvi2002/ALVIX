import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Game data endpoints
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

  app.get("/api/games/live", (req, res) => {
    res.json([
      { id: 1, name: "লাইভ রুলেট", type: "casino", players: 100 },
      { id: 2, name: "ব্ল্যাকজ্যাক", type: "cards", players: 50 },
      { id: 3, name: "টেক্সাস হোল্ডেম", type: "poker", tables: 25 },
      { id: 4, name: "বাকারাত", type: "casino", players: 30 }
    ]);
  });

  app.get("/api/promotions", (req, res) => {
    res.json([
      { 
        id: 1, 
        title: "স্বাগতম বোনাস", 
        description: "নতুন সদস্যদের জন্য ১০০% বোনাস। ৫,০০০ টাকা পর্যন্ত পাবেন!",
        color: "accent" 
      },
      { 
        id: 2, 
        title: "দৈনিক ক্যাশব্যাক", 
        description: "প্রতিদিন আপনার লসের ১০% ফেরত পান। কোনো শর্ত নেই!",
        color: "blue" 
      }
    ]);
  });

  const httpServer = createServer(app);

  return httpServer;
}
