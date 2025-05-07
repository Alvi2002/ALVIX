import { 
  users, type User, type InsertUser,
  slotGames, type SlotGame, type InsertSlotGame,
  liveCasinoGames, type LiveCasinoGame, type InsertLiveCasinoGame,
  sportMatches, type SportMatch, type InsertSportMatch,
  transactions, type Transaction, type InsertTransaction,
  promotions, type Promotion, type InsertPromotion,
  depositPhones, type DepositPhone, type InsertDepositPhone
} from "@shared/schema";
import session from "express-session";

type ExpressSessionStore = session.Store;
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // ইউজার মেথডস
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // স্লট গেম মেথডস
  getSlotGames(): Promise<SlotGame[]>;
  getSlotGameById(id: number): Promise<SlotGame | undefined>;
  getPopularSlotGames(limit?: number): Promise<SlotGame[]>;
  createSlotGame(game: InsertSlotGame): Promise<SlotGame>;
  
  // লাইভ ক্যাসিনো গেম মেথডস
  getLiveCasinoGames(): Promise<LiveCasinoGame[]>;
  getLiveCasinoGameById(id: number): Promise<LiveCasinoGame | undefined>;
  getLiveCasinoGamesByCategory(category: string): Promise<LiveCasinoGame[]>;
  createLiveCasinoGame(game: InsertLiveCasinoGame): Promise<LiveCasinoGame>;
  
  // স্পোর্টস ম্যাচ মেথডস
  getSportMatches(): Promise<SportMatch[]>;
  getLiveMatches(): Promise<SportMatch[]>;
  getSportMatchById(id: number): Promise<SportMatch | undefined>;
  createSportMatch(match: InsertSportMatch): Promise<SportMatch>;
  updateMatchScore(id: number, score: any): Promise<SportMatch | undefined>;
  
  // ট্রানজেকশন মেথডস
  getUserTransactions(userId: number): Promise<Transaction[]>;
  getAllTransactions(): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined>;
  
  // প্রোমোশন মেথডস
  getActivePromotions(): Promise<Promotion[]>;
  getPromotionById(id: number): Promise<Promotion | undefined>;
  createPromotion(promotion: InsertPromotion): Promise<Promotion>;
  
  // ডিপোজিট ফোন নাম্বার মেথডস
  getDepositPhones(): Promise<DepositPhone[]>;
  getDepositPhoneById(id: number): Promise<DepositPhone | undefined>;
  createDepositPhone(phone: InsertDepositPhone): Promise<DepositPhone>;
  updateDepositPhone(id: number, phoneData: Partial<DepositPhone>): Promise<DepositPhone | undefined>;
  deleteDepositPhone(id: number): Promise<boolean>;
  toggleDepositPhoneStatus(id: number, isActive: boolean): Promise<DepositPhone | undefined>;
  
  sessionStore: ExpressSessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private slotGames: Map<number, SlotGame>;
  private liveCasinoGames: Map<number, LiveCasinoGame>;
  private sportMatches: Map<number, SportMatch>;
  private transactions: Map<number, Transaction>;
  private promotions: Map<number, Promotion>;
  private depositPhones: Map<number, DepositPhone>;
  
  private userIdCounter: number;
  private slotGameIdCounter: number;
  private liveCasinoGameIdCounter: number;
  private sportMatchIdCounter: number;
  private transactionIdCounter: number;
  private promotionIdCounter: number;
  private depositPhoneIdCounter: number;
  
  sessionStore: ExpressSessionStore;

  constructor() {
    this.users = new Map();
    this.slotGames = new Map();
    this.liveCasinoGames = new Map();
    this.sportMatches = new Map();
    this.transactions = new Map();
    this.promotions = new Map();
    this.depositPhones = new Map();
    
    this.userIdCounter = 1;
    this.slotGameIdCounter = 1;
    this.liveCasinoGameIdCounter = 1;
    this.sportMatchIdCounter = 1;
    this.transactionIdCounter = 1;
    this.promotionIdCounter = 1;
    this.depositPhoneIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
    
    // ডাটা সীড করা (আপনি যদি ডেমো ডাটা চান)
    this.seedData();
  }

  // ইউজার মেথডস
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      balance: "0",
      createdAt: now,
      isVip: false,
      isAdmin: false,
      isBanned: false,
      avatarUrl: null,
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  // স্লট গেম মেথডস
  async getSlotGames(): Promise<SlotGame[]> {
    return Array.from(this.slotGames.values());
  }
  
  async getSlotGameById(id: number): Promise<SlotGame | undefined> {
    return this.slotGames.get(id);
  }
  
  async getPopularSlotGames(limit = 10): Promise<SlotGame[]> {
    return Array.from(this.slotGames.values())
      .filter(game => game.isPopular)
      .slice(0, limit);
  }
  
  async createSlotGame(game: InsertSlotGame): Promise<SlotGame> {
    const id = this.slotGameIdCounter++;
    const slotGame: SlotGame = { ...game, id };
    this.slotGames.set(id, slotGame);
    return slotGame;
  }
  
  // লাইভ ক্যাসিনো গেম মেথডস
  async getLiveCasinoGames(): Promise<LiveCasinoGame[]> {
    return Array.from(this.liveCasinoGames.values());
  }
  
  async getLiveCasinoGameById(id: number): Promise<LiveCasinoGame | undefined> {
    return this.liveCasinoGames.get(id);
  }
  
  async getLiveCasinoGamesByCategory(category: string): Promise<LiveCasinoGame[]> {
    return Array.from(this.liveCasinoGames.values())
      .filter(game => game.category === category);
  }
  
  async createLiveCasinoGame(game: InsertLiveCasinoGame): Promise<LiveCasinoGame> {
    const id = this.liveCasinoGameIdCounter++;
    const liveCasinoGame: LiveCasinoGame = { ...game, id };
    this.liveCasinoGames.set(id, liveCasinoGame);
    return liveCasinoGame;
  }
  
  // স্পোর্টস ম্যাচ মেথডস
  async getSportMatches(): Promise<SportMatch[]> {
    return Array.from(this.sportMatches.values());
  }
  
  async getLiveMatches(): Promise<SportMatch[]> {
    return Array.from(this.sportMatches.values())
      .filter(match => match.isLive);
  }
  
  async getSportMatchById(id: number): Promise<SportMatch | undefined> {
    return this.sportMatches.get(id);
  }
  
  async createSportMatch(match: InsertSportMatch): Promise<SportMatch> {
    const id = this.sportMatchIdCounter++;
    const sportMatch: SportMatch = { ...match, id };
    this.sportMatches.set(id, sportMatch);
    return sportMatch;
  }
  
  async updateMatchScore(id: number, score: any): Promise<SportMatch | undefined> {
    const match = this.sportMatches.get(id);
    if (!match) return undefined;
    
    const updatedMatch = { ...match, score };
    this.sportMatches.set(id, updatedMatch);
    return updatedMatch;
  }
  
  // ট্রানজেকশন মেথডস
  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(tx => tx.userId === userId);
  }
  
  async getAllTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }
  
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const now = new Date();
    const tx: Transaction = { ...transaction, id, date: now };
    this.transactions.set(id, tx);
    
    // Balance update
    if (transaction.status === "success") {
      const user = this.users.get(transaction.userId);
      if (user) {
        const currentBalance = parseFloat(user.balance || "0");
        const amount = parseFloat(transaction.amount.toString());
        
        let newBalance = currentBalance;
        if (transaction.type === "deposit" || transaction.type === "win" || transaction.type === "bonus") {
          newBalance += amount;
        } else if (transaction.type === "withdraw" || transaction.type === "lose") {
          newBalance -= amount;
        }
        
        this.users.set(user.id, {
          ...user,
          balance: newBalance.toString()
        });
      }
    }
    
    return tx;
  }
  
  async updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined> {
    const tx = this.transactions.get(id);
    if (!tx) return undefined;
    
    const oldStatus = tx.status;
    const updatedTx = { ...tx, status };
    this.transactions.set(id, updatedTx);
    
    // Update balance if status changed to success
    if (oldStatus !== "success" && status === "success") {
      const user = this.users.get(tx.userId);
      if (user) {
        const currentBalance = parseFloat(user.balance || "0");
        const amount = parseFloat(tx.amount.toString());
        
        let newBalance = currentBalance;
        if (tx.type === "deposit" || tx.type === "win" || tx.type === "bonus") {
          newBalance += amount;
        } else if (tx.type === "withdraw" || tx.type === "lose") {
          newBalance -= amount;
        }
        
        this.users.set(user.id, {
          ...user,
          balance: newBalance.toString()
        });
      }
    }
    
    return updatedTx;
  }
  
  // প্রোমোশন মেথডস
  async getActivePromotions(): Promise<Promotion[]> {
    const now = new Date();
    return Array.from(this.promotions.values())
      .filter(promo => promo.isActive && 
        promo.startDate <= now && 
        (!promo.endDate || promo.endDate >= now));
  }
  
  async getPromotionById(id: number): Promise<Promotion | undefined> {
    return this.promotions.get(id);
  }
  
  async createPromotion(promotion: InsertPromotion): Promise<Promotion> {
    const id = this.promotionIdCounter++;
    const promo: Promotion = { ...promotion, id };
    this.promotions.set(id, promo);
    return promo;
  }
  
  // ডিপোজিট ফোন নাম্বার মেথডস
  async getDepositPhones(): Promise<DepositPhone[]> {
    return Array.from(this.depositPhones.values());
  }
  
  async getDepositPhoneById(id: number): Promise<DepositPhone | undefined> {
    return this.depositPhones.get(id);
  }
  
  async createDepositPhone(phone: InsertDepositPhone): Promise<DepositPhone> {
    const id = this.depositPhoneIdCounter++;
    const now = new Date();
    const depositPhone: DepositPhone = { 
      ...phone, 
      id,
      createdAt: now,
      isActive: phone.isActive ?? true
    };
    this.depositPhones.set(id, depositPhone);
    return depositPhone;
  }
  
  async updateDepositPhone(id: number, phoneData: Partial<DepositPhone>): Promise<DepositPhone | undefined> {
    const phone = this.depositPhones.get(id);
    if (!phone) return undefined;
    
    const updatedPhone = { ...phone, ...phoneData };
    this.depositPhones.set(id, updatedPhone);
    return updatedPhone;
  }
  
  async deleteDepositPhone(id: number): Promise<boolean> {
    return this.depositPhones.delete(id);
  }
  
  async toggleDepositPhoneStatus(id: number, isActive: boolean): Promise<DepositPhone | undefined> {
    const phone = this.depositPhones.get(id);
    if (!phone) return undefined;
    
    const updatedPhone = { ...phone, isActive };
    this.depositPhones.set(id, updatedPhone);
    return updatedPhone;
  }
  
  // ডেমো ডাটা সীড মেথড
  private seedData() {
    // স্লট গেম ডাটা
    this.createSlotGame({
      name: "গোল্ডেন ড্রাগন",
      provider: "প্রাগমেটিক প্লে",
      image: "/images/slots/golden-dragon.jpg",
      rtp: "96.5%",
      isPopular: true,
      isFeatured: true,
      badgeType: "highlight",
      badgeText: "হট"
    });
    
    this.createSlotGame({
      name: "বুক অফ ডেড",
      provider: "প্লে এন গো",
      image: "/images/slots/book-of-dead.jpg",
      rtp: "95.5%",
      isPopular: true,
      isFeatured: false,
      badgeType: "blue",
      badgeText: "নিউ"
    });
    
    this.createSlotGame({
      name: "সুইট বোনানজা",
      provider: "প্রাগমেটিক প্লে",
      image: "/images/slots/sweet-bonanza.jpg",
      rtp: "97.5%",
      isPopular: true,
      isFeatured: true,
      badgeType: "highlight",
      badgeText: "হট"
    });
    
    this.createSlotGame({
      name: "স্টারবার্স্ট",
      provider: "নেটেন্ট",
      image: "/images/slots/starburst.jpg",
      rtp: "96.5%",
      isPopular: true,
      isFeatured: false
    });
    
    this.createSlotGame({
      name: "গনিজো",
      provider: "এভোলিউশন গেমিং",
      image: "/images/slots/gonzo.jpg",
      rtp: "96.0%",
      isPopular: true,
      isFeatured: false
    });
    
    this.createSlotGame({
      name: "ওলফ গোল্ড",
      provider: "প্রাগমেটিক প্লে",
      image: "/images/slots/wolf-gold.jpg",
      rtp: "96.5%",
      isPopular: false,
      isFeatured: true
    });
    
    // লাইভ ক্যাসিনো গেম
    this.createLiveCasinoGame({
      name: "লাইভ রুলেট",
      provider: "এভোলিউশন গেমিং",
      image: "/images/casino/roulette.jpg",
      players: "১৫২ জন",
      category: "রুলেট",
      isPopular: true,
      isFeatured: true,
      badgeType: "highlight",
      badgeText: "হট"
    });
    
    this.createLiveCasinoGame({
      name: "ব্ল্যাকজ্যাক",
      provider: "এভোলিউশন গেমিং",
      image: "/images/casino/blackjack.jpg",
      players: "৯৮ জন",
      category: "কার্ড",
      isPopular: true,
      isFeatured: true
    });
    
    this.createLiveCasinoGame({
      name: "বাকারাট",
      provider: "এজিবি",
      image: "/images/casino/baccarat.jpg",
      players: "১১০ জন",
      category: "কার্ড",
      isPopular: true,
      isFeatured: false,
      badgeType: "blue",
      badgeText: "নিউ"
    });
    
    this.createLiveCasinoGame({
      name: "টেক্সাস হোল্ডেম",
      provider: "এভোলিউশন গেমিং",
      image: "/images/casino/texas-holdem.jpg",
      players: "৬৪ জন",
      category: "পোকার",
      isPopular: true,
      isFeatured: true
    });
    
    this.createLiveCasinoGame({
      name: "দ্রাগন টাইগার",
      provider: "এজিবি",
      image: "/images/casino/dragon-tiger.jpg",
      players: "৯৫ জন",
      category: "কার্ড",
      isPopular: false,
      isFeatured: false
    });
    
    // স্পোর্টস ম্যাচ
    this.createSportMatch({
      homeTeam: "বার্সেলোনা",
      awayTeam: "রিয়াল মাদ্রিদ",
      league: "লা লিগা",
      time: "৯:৩০ PM",
      date: "আজ",
      isLive: true,
      odds: {
        home: 2.1,
        draw: 3.5,
        away: 2.8
      },
      statistics: {
        possession: {
          home: 55,
          away: 45
        },
        shots: {
          home: 8,
          away: 6
        }
      },
      score: {
        home: 2,
        away: 1
      }
    });
    
    this.createSportMatch({
      homeTeam: "ম্যানচেস্টার সিটি",
      awayTeam: "লিভারপুল",
      league: "প্রিমিয়ার লিগ",
      time: "৭:০০ PM",
      date: "আজ",
      isLive: true,
      odds: {
        home: 1.9,
        draw: 3.5,
        away: 3.1
      },
      statistics: {
        possession: {
          home: 60,
          away: 40
        },
        shots: {
          home: 10,
          away: 5
        }
      },
      score: {
        home: 1,
        away: 0
      }
    });
    
    this.createSportMatch({
      homeTeam: "বায়ার্ন মিউনিখ",
      awayTeam: "বরুসিয়া ডর্টমুন্ড",
      league: "বুন্দেসলিগা",
      time: "৮:০০ PM",
      date: "আগামীকাল",
      isLive: false,
      odds: {
        home: 1.7,
        draw: 4.0,
        away: 3.5
      }
    });
    
    this.createSportMatch({
      homeTeam: "পিএসজি",
      awayTeam: "মার্সেইল",
      league: "লিগ ১",
      time: "১০:০০ PM",
      date: "আগামীকাল",
      isLive: false,
      odds: {
        home: 1.6,
        draw: 3.8,
        away: 4.2
      }
    });
    
    // প্রোমোশন
    const now = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    this.createPromotion({
      title: "স্বাগতম বোনাস",
      description: "প্রথম ডিপোজিটে ১০০% বোনাস পান, সর্বোচ্চ ৫,০০০ টাকা",
      image: "/images/promotions/welcome-bonus.jpg",
      startDate: now,
      endDate: nextMonth,
      isActive: true
    });
    
    this.createPromotion({
      title: "ক্যাশব্যাক অফার",
      description: "প্রতিদিন ১০% ক্যাশব্যাক, কোনো শর্ত নেই",
      image: "/images/promotions/cashback.jpg",
      startDate: now,
      endDate: nextMonth,
      isActive: true
    });
    
    this.createPromotion({
      title: "রেফারেল বোনাস",
      description: "বন্ধুদের রেফার করে ৫০০ টাকা বোনাস পান",
      image: "/images/promotions/referral.jpg",
      startDate: now,
      endDate: nextMonth,
      isActive: true
    });
  }
}

export const storage = new MemStorage();
