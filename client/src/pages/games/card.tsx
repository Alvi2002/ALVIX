import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileMenu from "@/components/layout/mobile-menu";
import MobileNav from "@/components/layout/mobile-nav";
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Diamond, 
  Club, 
  Heart, 
  Spade,
  Filter, 
  ChevronDown,
  User,
  TrendingUp,
  ShieldCheck,
  DollarSign,
  Clock,
  Sparkles,
  Book,
  Zap,
  Trophy
} from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

// কার্ড গেমের জন্য একটি ইন্টারফেস
interface CardGame {
  id: number;
  name: string;
  image: string;
  category: string;
  provider: string;
  minBet: number;
  maxBet: number;
  players?: string;
  description?: string;
  isPopular?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  rules?: string[];
  rtp?: string;
}

export default function CardGamesPage() {
  const { user, logoutMutation } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // কার্ড গেম ডেটা (বাস্তবিক অ্যাপ্লিকেশনে এগুলি API থেকে লোড করা উচিত)
  const cardGames: CardGame[] = [
    {
      id: 1,
      name: "ব্ল্যাকজ্যাক",
      image: "https://via.placeholder.com/300x200",
      category: "ক্লাসিক কার্ড গেমস",
      provider: "এভোলিউশন গেমিং",
      minBet: 500,
      maxBet: 100000,
      players: "সিঙ্গেল প্লেয়ার",
      description: "২১ পয়েন্ট ছাড়িয়ে না যাওয়ার চেষ্টা করুন। ডিলার কে হারাতে হবে।",
      isPopular: true,
      isFeatured: true,
      rules: [
        "ডিলার ১৭ বা তার বেশি হলে স্ট্যান্ড করবে",
        "ব্ল্যাকজ্যাক জয় 3:2 হারে পেমেন্ট করে",
        "ইনস্যুরেন্স বাজি সম্ভব হবে, যা 2:1 হারে পেমেন্ট করে"
      ],
      rtp: "99.5%"
    },
    {
      id: 2,
      name: "পোকার",
      image: "https://via.placeholder.com/300x200",
      category: "পোকার গেমস",
      provider: "পোকার স্টারস",
      minBet: 1000,
      maxBet: 200000,
      players: "মাল্টিপ্লেয়ার",
      description: "টেক্সাস হোল্ডেম পোকার গেম, বাজি ধরে, চাল দিয়ে চূড়ান্ত হ্যান্ড জিতুন।",
      isPopular: true,
      isFeatured: true,
      rules: [
        "টেক্সাস হোল্ডেম রুলস অনুসরণ করা হয়",
        "কমিউনিটি কার্ড ৫টি",
        "প্লেয়ার ২জন থেকে ১০ জন"
      ],
      rtp: "97.3%"
    },
    {
      id: 3,
      name: "বাকারাত",
      image: "https://via.placeholder.com/300x200",
      category: "ক্লাসিক কার্ড গেমস",
      provider: "এভোলিউশন গেমিং",
      minBet: 500,
      maxBet: 100000,
      players: "আনলিমিটেড",
      description: "প্লেয়ার বা ব্যাঙ্কার কে জিতবে অনুমান করে বাজি ধরুন।",
      isPopular: true,
      rules: [
        "প্লেয়ার, ব্যাঙ্কার, বা টাই এর উপর বাজি রাখুন",
        "ব্যাঙ্কার জয় 0.95:1 হারে পেমেন্ট করে (5% কমিশন)",
        "প্লেয়ার জয় 1:1 হারে পেমেন্ট করে",
        "টাই 8:1 হারে পেমেন্ট করে"
      ],
      rtp: "98.9%"
    },
    {
      id: 4,
      name: "থ্রি কার্ড পোকার",
      image: "https://via.placeholder.com/300x200",
      category: "পোকার গেমস",
      provider: "প্লেটেক",
      minBet: 300,
      maxBet: 50000,
      players: "সিঙ্গেল প্লেয়ার",
      description: "তিনটি কার্ড দিয়ে ডিলারকে হারাতে হবে।",
      isNew: true,
      rules: [
        "এন্টি এবং প্লে বাজি",
        "পেয়ার প্লাস এবং ৬ কার্ড বোনাস বাজি অপশন",
        "কুইন হাই বা তার বেশি হলে ডিলার কোয়ালিফাই করে"
      ],
      rtp: "96.6%"
    },
    {
      id: 5,
      name: "কারিবিয়ান স্টাড পোকার",
      image: "https://via.placeholder.com/300x200",
      category: "পোকার গেমস",
      provider: "মাইক্রোগেমিং",
      minBet: 500,
      maxBet: 75000,
      players: "সিঙ্গেল প্লেয়ার",
      description: "ফাইভ কার্ড স্টাড পোকার ভেরিয়েন্ট, যেখানে আপনি ডিলারের বিরুদ্ধে খেলেন।",
      isPopular: true,
      rules: [
        "এক জোড়া বা তার বেশি হলে ডিলার কোয়ালিফাই করে",
        "জ্যাকপট সাইড বেট উপলব্ধ",
        "প্রোগ্রেসিভ জ্যাকপট জেতার সুযোগ"
      ],
      rtp: "94.8%"
    },
    {
      id: 6,
      name: "কাসিনো হোল্ডেম",
      image: "https://via.placeholder.com/300x200",
      category: "পোকার গেমস",
      provider: "এভোলিউশন গেমিং",
      minBet: 1000,
      maxBet: 100000,
      players: "আনলিমিটেড",
      description: "টেক্সাস হোল্ডেমের সরলীকৃত রূপ, যেখানে আপনি হাউসের বিরুদ্ধে খেলেন।",
      isNew: true,
      isFeatured: true,
      rules: [
        "এন্টি এবং কল বেট স্ট্রাকচার",
        "ফাইভ কমিউনিটি কার্ডস",
        "ফ্লাশ বা তার বেশি সেরা পাঁচ কার্ডের হ্যান্ড তৈরি করুন"
      ],
      rtp: "97.8%"
    },
    {
      id: 7,
      name: "রামি",
      image: "https://via.placeholder.com/300x200",
      category: "ট্রেডিশনাল কার্ড গেমস",
      provider: "ওয়ানেক্স",
      minBet: 200,
      maxBet: 20000,
      players: "২-৪ জন",
      description: "সেট এবং রান তৈরি করে মেলডাউন করুন।",
      isNew: true,
      rules: [
        "৫২ কার্ডের ডেক + জোকার",
        "১৩ কার্ড রামি প্লে করা হয়",
        "পিউর সিকোয়েন্স এবং ইমপিউর সিকোয়েন্স মেলডাউন করুন"
      ],
      rtp: "96.2%"
    },
    {
      id: 8,
      name: "টিন পাত্তি",
      image: "https://via.placeholder.com/300x200",
      category: "ট্রেডিশনাল কার্ড গেমস",
      provider: "প্রাগমাটিক প্লে",
      minBet: 100,
      maxBet: 10000,
      players: "সিঙ্গেল প্লেয়ার",
      description: "তিন কার্ডের মধ্যে কোনটি উচ্চ কার্ড খুঁজে বের করতে সক্ষম হন।",
      isPopular: true,
      rules: [
        "তিনটি কার্ডের মধ্যে একটিতে বাজি ধরা হয়",
        "উচ্চ কার্ড জিতে যায়",
        "পেয়ার এবং কালার বেট অপশন উপলব্ধ"
      ],
      rtp: "95.5%"
    },
    {
      id: 9,
      name: "ব্রিজ",
      image: "https://via.placeholder.com/300x200",
      category: "ট্রেডিশনাল কার্ড গেমস",
      provider: "গেমিং কর্প",
      minBet: 500,
      maxBet: 50000,
      players: "৪ জন",
      description: "জোড়ায় খেলা যায় এমন একটি ট্রিক-টেকিং কার্ড গেম।",
      isNew: true,
      rules: [
        "৫২ কার্ডের ডেক",
        "১৩ ট্রিক প্লে করা হয়",
        "বিডিং এবং প্লে ফেজ রয়েছে"
      ],
      rtp: "97.1%"
    },
    {
      id: 10,
      name: "ওয়ার",
      image: "https://via.placeholder.com/300x200",
      category: "ক্লাসিক কার্ড গেমস",
      provider: "বেটসফট",
      minBet: 100,
      maxBet: 10000,
      players: "সিঙ্গেল প্লেয়ার",
      description: "সাধারণ এবং সহজ গেম, উচ্চ কার্ড জিতে যায়।",
      isPopular: true,
      isFeatured: true,
      rules: [
        "স্বয়ংক্রিয়ভাবে প্লেয়ার এবং ডিলার উভয়কেই একটি কার্ড বিতরণ করা হয়",
        "উচ্চ কার্ড জিতে যায়",
        "আপনার কার্ড ডিলারের কার্ডের চেয়ে উচ্চ মানের হলে আপনি জিতবেন"
      ],
      rtp: "97.9%"
    },
    {
      id: 11,
      name: "ক্র্যাজী এইট",
      image: "https://via.placeholder.com/300x200",
      category: "ট্রেডিশনাল কার্ড গেমস",
      provider: "নেটেন্ট",
      minBet: 200,
      maxBet: 20000,
      players: "২-৬ জন",
      description: "আট সংখ্যা বা সুট ম্যাচ করে কার্ড ডিসকার্ড করুন।",
      isNew: true,
      rules: [
        "প্লেয়ারদের সমস্ত কার্ড ডিসকার্ড করাই উদ্দেশ্য",
        "আটের উপর বা সুটের উপর খেলা যায়",
        "জোকার ডিসকার্ড পাইল এর সুট পরিবর্তন করতে পারে"
      ],
      rtp: "96.8%"
    },
    {
      id: 12,
      name: "বিগ ২",
      image: "https://via.placeholder.com/300x200",
      category: "ট্রেডিশনাল কার্ড গেমস",
      provider: "এজিটি",
      minBet: 100,
      maxBet: 10000,
      players: "২-৪ জন",
      description: "সবার আগে নিজের কার্ড শেষ করার চেষ্টা করুন।",
      isPopular: true,
      rules: [
        "ডায়মন্ড ২ দিয়ে গেম শুরু করা হয়",
        "নিয়ম হল সর্বদা আগের কার্ডের চেয়ে বড় মানের কার্ড খেলা হবে",
        "২ সবচেয়ে শক্তিশালী কার্ড, আর এর পরে এস"
      ],
      rtp: "95.7%"
    }
  ];

  // গেম ক্যাটেগরি গুলো পাওয়া
  const categories = [...new Set(cardGames.map(game => game.category))];

  // গেম ফিল্টারিং ফাংশন
  const filterGames = (games: CardGame[], category: string = 'all') => {
    return games.filter(game => {
      // সার্চ কোয়েরি ফিল্টার
      const matchesSearch = 
        game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.provider.toLowerCase().includes(searchQuery.toLowerCase());
      
      // ক্যাটেগরি ফিল্টার
      const matchesCategory = category === 'all' || !filterCategory || game.category === filterCategory;
      
      return matchesSearch && matchesCategory;
    });
  };

  // ক্যাটেগরি অনুযায়ী গেম ফিল্টারিং
  const getGamesByCategory = (category: string) => {
    switch(category) {
      case "popular":
        return filterGames(cardGames.filter(game => game.isPopular));
      case "new":
        return filterGames(cardGames.filter(game => game.isNew));
      case "featured":
        return filterGames(cardGames.filter(game => game.isFeatured));
      case "all":
      default:
        return filterGames(cardGames);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isLoggedIn={!!user} onLogout={handleLogout} />
      <MobileMenu />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">কার্ড গেমস</h1>
            <p className="text-muted-foreground">
              বিভিন্ন ধরনের ক্লাসিক এবং আধুনিক কার্ড গেমস
            </p>
          </div>
          
          {/* সার্চ এবং ফিল্টার সেকশন */}
          <div className="w-full md:w-auto mt-4 md:mt-0">
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="গেম খুঁজুন..."
                  className="pl-10 w-full md:w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                <span className="hidden md:inline">ফিল্টার</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            
            {/* এক্সপান্ডেবল ফিল্টার প্যানেল */}
            {showFilters && (
              <div className="mt-2 p-4 bg-card border border-border rounded-md shadow-sm">
                <h3 className="text-sm font-medium mb-2">ক্যাটেগরি:</h3>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={filterCategory === null ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setFilterCategory(null)}
                  >
                    সবগুলো
                  </Button>
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={filterCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* ইনফো কার্ডস */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <Card className="bg-card border-accent/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-accent/10 rounded-full p-3">
                  <Diamond className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">পোকার গেমস</h3>
                  <p className="text-xs text-muted-foreground">বেস্ট হ্যান্ড জিতে যায়</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-accent/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-accent/10 rounded-full p-3">
                  <Club className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">ব্ল্যাকজ্যাক</h3>
                  <p className="text-xs text-muted-foreground">২১ এর কাছাকাছি পৌঁছান</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-accent/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-accent/10 rounded-full p-3">
                  <Heart className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">বাকারাত</h3>
                  <p className="text-xs text-muted-foreground">সিম্পল এবং দ্রুত</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-accent/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-accent/10 rounded-full p-3">
                  <Spade className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">ট্রেডিশনাল গেমস</h3>
                  <p className="text-xs text-muted-foreground">ক্লাসিক কার্ড গেমস</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* ট্যাব সেকশন */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all" className="gap-2">
              <Diamond className="h-4 w-4" />
              <span>সবগুলো</span>
            </TabsTrigger>
            <TabsTrigger value="popular" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>জনপ্রিয়</span>
            </TabsTrigger>
            <TabsTrigger value="new" className="gap-2">
              <Sparkles className="h-4 w-4" />
              <span>নতুন</span>
            </TabsTrigger>
            <TabsTrigger value="featured" className="gap-2">
              <Zap className="h-4 w-4" />
              <span>ফিচার্ড</span>
            </TabsTrigger>
          </TabsList>
          
          {/* ট্যাব বিষয়বস্তু */}
          {["all", "popular", "new", "featured"].map(category => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {getGamesByCategory(category).map((game) => (
                  <CardGameItem key={game.id} game={game} />
                ))}
              </div>
              
              {getGamesByCategory(category).length === 0 && (
                <div className="text-center py-10">
                  <Search className="h-10 w-10 mx-auto text-muted-foreground opacity-20 mb-4" />
                  <h3 className="font-medium mb-1">কোন গেম পাওয়া যায়নি</h3>
                  <p className="text-sm text-muted-foreground">
                    আপনার অনুসন্ধান বিস্তৃত করুন বা অন্য ফিল্টার চেষ্টা করুন
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
        
        {/* ফিচার্ড সেকশন */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-6">ফিচার্ড কার্ড গেমস</h2>
          
          <div className="relative rounded-lg overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10"></div>
            <div className="absolute inset-y-0 left-0 z-20 flex flex-col justify-center px-6 md:px-10 max-w-lg">
              <Badge className="bg-accent mb-2 w-fit">সর্বাধিক জনপ্রিয়</Badge>
              <h3 className="text-xl md:text-3xl font-bold text-white mb-2">ব্ল্যাকজ্যাক</h3>
              <p className="text-white/80 text-sm md:text-base mb-4">
                ক্লাসিক কার্ড গেম, যেখানে আপনার লক্ষ্য ২১ এর নিকটতম পৌঁছা। ডিলারকে হারিয়ে জিতুন।
              </p>
              <div className="flex flex-col xs:flex-row gap-3">
                <Button>
                  খেলা শুরু করুন
                </Button>
                <Button variant="outline" className="bg-white/10 border-white/20 text-white">
                  নিয়ম জানুন
                </Button>
              </div>
            </div>
            <div className="h-64 md:h-80 w-full bg-gradient-to-r from-accent/30 to-black/50"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cardGames
              .filter(game => game.isFeatured)
              .slice(0, 3)
              .map(game => (
                <Card key={game.id} className="overflow-hidden group hover:shadow-lg transition-all">
                  <div className="relative overflow-hidden h-48">
                    <div className="bg-gradient-to-br from-accent/30 to-black/60 absolute inset-0 flex items-center justify-center">
                      {game.category.includes('পোকার') ? 
                        <Diamond className="h-16 w-16 text-white/30" /> :
                        game.name.includes('ব্ল্যাকজ্যাক') ?
                        <Club className="h-16 w-16 text-white/30" /> :
                        <Spade className="h-16 w-16 text-white/30" />
                      }
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex flex-col justify-end">
                      <h3 className="font-semibold text-white text-lg">{game.name}</h3>
                      <p className="text-white/70 text-sm">{game.provider}</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{game.description}</p>
                    <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                      <span>মিন. বেট: ৳{game.minBet}</span>
                      <span>RTP: {game.rtp}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/30 px-4 py-3">
                    <Button variant="accent" className="w-full">খেলুন</Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </section>
        
        {/* কিভাবে খেলবেন */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-6">কিভাবে কার্ড গেমস খেলবেন</h2>
          <Card className="bg-card border-accent/20">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="bg-accent/10 rounded-full p-3 w-14 h-14 flex items-center justify-center">
                    <User className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold">১. অ্যাকাউন্ট খুলুন</h3>
                  <p className="text-sm text-muted-foreground">
                    TK999 এ নিবন্ধন করুন এবং আপনার অ্যাকাউন্ট যাচাই করুন। এটি দ্রুত এবং সহজ।
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-accent/10 rounded-full p-3 w-14 h-14 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold">২. জমা করুন</h3>
                  <p className="text-sm text-muted-foreground">
                    আপনার পছন্দের পেমেন্ট পদ্ধতি ব্যবহার করে আপনার অ্যাকাউন্টে অর্থ জমা করুন।
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-accent/10 rounded-full p-3 w-14 h-14 flex items-center justify-center">
                    <Diamond className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold">৩. গেম বেছে নিন</h3>
                  <p className="text-sm text-muted-foreground">
                    আপনার পছন্দের কার্ড গেম সিলেক্ট করুন এবং খেলতে শুরু করুন।
                  </p>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-accent/10 rounded-lg">
                <div className="flex gap-4 items-start">
                  <Book className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-2">নতুন খেলোয়াড়দের জন্য টিপস</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
                      <li>খেলা শুরু করার আগে গেমের নিয়ম ভাল করে পড়ুন</li>
                      <li>কম বাজি দিয়ে শুরু করুন এবং ধীরে ধীরে বাড়ান</li>
                      <li>বাজি সীমা সেট করুন এবং সেগুলি মেনে চলুন</li>
                      <li>আপনার যা হারাতে প্রস্তুত নন, তার বেশি বাজি ধরবেন না</li>
                      <li>ফ্রি গেমগুলিতে অনুশীলন করুন যেগুলো বাস্তব অর্থের বাজি ছাড়াই খেলা যায়</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* টুর্নামেন্ট */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">কার্ড গেম টুর্নামেন্ট</h2>
            <Button variant="link" className="text-accent">
              সব দেখুন <ChevronDown className="h-4 w-4 ml-1 rotate-[-90deg]" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                title: 'ব্ল্যাকজ্যাক টুর্নামেন্ট', 
                date: '১৫ মে - ১৮ মে, ২০২৫', 
                prize: '৳৫০০,০০০', 
                entry: '৳১,০০০', 
                players: '৬৪' 
              },
              { 
                title: 'পোকার চ্যাম্পিয়নশিপ', 
                date: '২০ মে - ২৩ মে, ২০২৫', 
                prize: '৳১,০০০,০০০', 
                entry: '৳২,০০০', 
                players: '১২৮' 
              },
              { 
                title: 'বাকারাত মাস্টার্স', 
                date: '২৫ মে - ২৭ মে, ২০২৫', 
                prize: '৳৭৫০,০০০', 
                entry: '৳১,৫০০', 
                players: '৯৬' 
              }
            ].map((tournament, idx) => (
              <Card key={idx} className="bg-card border-accent/20 overflow-hidden">
                <CardHeader className="bg-muted/30 pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-accent" />
                    {tournament.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{tournament.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>প্রাইজ পুল: {tournament.prize}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Ticket className="h-4 w-4 text-muted-foreground" />
                      <span>এন্ট্রি ফি: {tournament.entry}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>প্লেয়ার লিমিট: {tournament.players}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 px-4 py-3">
                  <Button className="w-full">রেজিস্টার করুন</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}

// কার্ড গেম আইটেম কম্পোনেন্ট
function CardGameItem({ game }: { game: CardGame }) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all">
      <div className="relative overflow-hidden h-48">
        <div className="bg-gradient-to-br from-accent/30 to-black/60 absolute inset-0 flex items-center justify-center">
          {game.category.includes('পোকার') ? 
            <Diamond className="h-16 w-16 text-white/30" /> :
            game.name.includes('ব্ল্যাকজ্যাক') ?
            <Club className="h-16 w-16 text-white/30" /> :
            game.name.includes('বাকারাত') ?
            <Heart className="h-16 w-16 text-white/30" /> :
            <Spade className="h-16 w-16 text-white/30" />
          }
        </div>
        {game.isPopular && (
          <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600">
            জনপ্রিয়
          </Badge>
        )}
        {game.isNew && (
          <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
            নতুন
          </Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex flex-col justify-end">
          <h3 className="font-semibold text-white">{game.name}</h3>
          <div className="flex justify-between items-center mt-1">
            <p className="text-white/70 text-xs">{game.provider}</p>
            <Badge variant="outline" className="bg-black/30 text-white/90 border-white/10 text-xs">
              {game.category}
            </Badge>
          </div>
        </div>
      </div>
      <CardContent className="p-3">
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{game.description}</p>
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>মিন. বেট: ৳{game.minBet}</span>
          <div className="flex items-center gap-1">
            {game.rtp && (
              <span>
                <span className="text-green-500">RTP:</span> {game.rtp}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 px-4 py-3">
        <Button variant="accent" className="w-full">খেলুন</Button>
      </CardFooter>
    </Card>
  );
}

// এটি যোগ করতে ভুলে গেছি
function Ticket(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="M3 9V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3" />
      <path d="M13 15V9" />
      <path d="M8 13h.01" />
      <path d="M18 13h.01" />
    </svg>
  );
}