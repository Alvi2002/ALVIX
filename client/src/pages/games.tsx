import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileMenu from "@/components/layout/mobile-menu";
import MobileNav from "@/components/layout/mobile-nav";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bookmark, Heart, Search, Star, Zap } from "lucide-react";

type Game = {
  id: number;
  name: string;
  image: string;
  provider: string;
  category: string;
  rtp?: string;
  isPopular?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  players?: string;
  badgeType?: string;
  badgeText?: string;
  minBet?: number;
  maxBet?: number;
  description?: string;
};

export default function GamesPage() {
  const { user, logoutMutation } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [provider, setProvider] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [gameCategory, setGameCategory] = useState("all");

  // গেম ডেটা লোড করার জন্য TanStack Query ব্যবহার
  const { data: gamesData = [], isLoading: gamesLoading } = useQuery({
    queryKey: ['/api/games'],
    staleTime: 60 * 1000, // ১ মিনিট
  });
  
  // স্লট গেম ডেটা লোড
  const { data: slotGames = [], isLoading: slotLoading } = useQuery({
    queryKey: ['/api/slot-games'],
    staleTime: 60 * 1000, // ১ মিনিট
  });
  
  // লাইভ ক্যাসিনো গেম ডেটা লোড
  const { data: liveCasinoGames = [], isLoading: casinoLoading } = useQuery({
    queryKey: ['/api/live-casino-games'],
    staleTime: 60 * 1000, // ১ মিনিট
  });

  // সমস্ত গেম একত্রিত করা
  const allGames: Game[] = [...slotGames, ...liveCasinoGames, ...gamesData];
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // গেম প্রোভাইডার থেকে ইউনিক লিস্ট তৈরি করা
  const providers = [...new Set(allGames.map(game => game.provider))];
  
  // সকল ক্যাটাগরি থেকে ইউনিক লিস্ট তৈরি করা
  const categories = [...new Set(allGames.map(game => game.category))];
  
  // গেম ফিল্টার এবং সর্টিং লজিক
  const filteredGames = allGames.filter(game => {
    // সার্চ কোয়েরি
    if (searchQuery && !game.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // প্রোভাইডার ফিল্টার
    if (provider !== "all" && game.provider !== provider) {
      return false;
    }
    
    // ক্যাটাগরি ফিল্টার
    if (gameCategory !== "all" && game.category !== gameCategory) {
      return false;
    }
    
    return true;
  });
  
  // সর্টিং ফাংশন
  const sortedGames = [...filteredGames].sort((a, b) => {
    if (sortBy === "popular") {
      return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
    } else if (sortBy === "new") {
      return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    } else if (sortBy === "a-z") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "z-a") {
      return b.name.localeCompare(a.name);
    }
    return 0;
  });
  
  // গেম সংক্রান্ত ক্যাটাগরি
  const gameTypes = [
    { id: "all", name: "সকল গেম" },
    { id: "slots", name: "স্লট গেম" },
    { id: "live-casino", name: "লাইভ ক্যাসিনো" },
    { id: "table", name: "টেবিল গেমস" },
    { id: "crash", name: "ক্র্যাশ গেমস" },
    { id: "fish", name: "ফিশ গেমস" },
    { id: "lottery", name: "লটারি" },
  ];
  
  // গেম কার্ড কম্পোনেন্ট
  const GameCard = ({ game }: { game: Game }) => {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-all group border-accent/20">
        <div className="relative">
          <img 
            src={game.image} 
            alt={game.name} 
            className="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out" 
          />
          
          {/* ব্যাজ */}
          {game.badgeType && (
            <Badge className={`absolute top-2 left-2 ${
              game.badgeType === 'new' ? 'bg-blue-500' : 
              game.badgeType === 'hot' ? 'bg-red-500' : 
              game.badgeType === 'popular' ? 'bg-amber-500' : 
              'bg-green-500'
            }`}>
              {game.badgeText || game.badgeType}
            </Badge>
          )}
          
          {/* অভারলে কার্যকারিতা */}
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Button className="bg-accent text-secondary hover:bg-accent/90">
              খেলুন
            </Button>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold mb-1 line-clamp-1">{game.name}</h3>
              <p className="text-xs text-muted-foreground">{game.provider}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          
          {game.rtp && (
            <div className="flex items-center mt-2 text-xs text-muted-foreground">
              <span>RTP: {game.rtp}</span>
            </div>
          )}
          
          {game.players && (
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              <span>{game.players} খেলছেন</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };
  
  // জনপ্রিয় প্রোভাইডার
  const featuredProviders = [
    { id: "pragmatic", name: "Pragmatic Play", logo: "https://via.placeholder.com/100x50" },
    { id: "evolution", name: "Evolution Gaming", logo: "https://via.placeholder.com/100x50" },
    { id: "netent", name: "NetEnt", logo: "https://via.placeholder.com/100x50" },
    { id: "playtech", name: "Playtech", logo: "https://via.placeholder.com/100x50" },
    { id: "microgaming", name: "Microgaming", logo: "https://via.placeholder.com/100x50" },
    { id: "pgsoft", name: "PG Soft", logo: "https://via.placeholder.com/100x50" },
  ];

  const isLoading = gamesLoading || slotLoading || casinoLoading;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isLoggedIn={!!user} onLogout={handleLogout} />
      <MobileMenu />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">সকল খেলা</h1>
          <p className="text-muted-foreground">আমাদের সমস্ত আকর্ষণীয় গেম অন্বেষণ করুন</p>
        </div>
        
        {/* প্রোভাইডার লোগো গ্রিড */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
          {featuredProviders.map(provider => (
            <Card key={provider.id} className="flex items-center justify-center p-3 hover:border-accent cursor-pointer">
              <img src={provider.logo} alt={provider.name} className="max-h-10" />
            </Card>
          ))}
        </div>
        
        {/* সার্চ এবং ফিল্টার */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="গেম খুঁজুন"
              className="pl-9 bg-card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={provider} onValueChange={setProvider}>
            <SelectTrigger>
              <SelectValue placeholder="সকল প্রোভাইডার" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সকল প্রোভাইডার</SelectItem>
              {providers.map(p => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={gameCategory} onValueChange={setGameCategory}>
            <SelectTrigger>
              <SelectValue placeholder="সকল ক্যাটাগরি" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সকল ক্যাটাগরি</SelectItem>
              {categories.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="জনপ্রিয়তা অনুযায়ী" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">জনপ্রিয়তা অনুযায়ী</SelectItem>
              <SelectItem value="new">নতুন গেম</SelectItem>
              <SelectItem value="a-z">A-Z</SelectItem>
              <SelectItem value="z-a">Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* গেম ক্যাটাগরি ট্যাব */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="w-full flex overflow-x-auto pb-1 scrollbar-hide">
            {gameTypes.map(type => (
              <TabsTrigger 
                key={type.id} 
                value={type.id}
                className="flex-shrink-0"
              >
                {type.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : sortedGames.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">কোন গেম পাওয়া যায়নি</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {sortedGames.map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* অন্যান্য ট্যাব কন্টেন্ট - স্লট, ক্যাসিনো, টেবিল, ইত্যাদি */}
          {gameTypes.slice(1).map(type => (
            <TabsContent key={type.id} value={type.id} className="mt-6">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {sortedGames
                    .filter(game => {
                      if (type.id === "slots") return game.category.includes("slot");
                      if (type.id === "live-casino") return game.category.includes("live");
                      if (type.id === "table") return game.category.includes("table");
                      if (type.id === "crash") return game.category.includes("crash");
                      if (type.id === "fish") return game.category.includes("fish");
                      if (type.id === "lottery") return game.category.includes("lottery");
                      return true;
                    })
                    .map(game => (
                      <GameCard key={game.id} game={game} />
                    ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
        
        {/* জনপ্রিয় গেম বিভাগ */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Star className="mr-2 h-5 w-5 text-yellow-500" />
            জনপ্রিয় গেম
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {sortedGames
              .filter(game => game.isPopular)
              .slice(0, 6)
              .map(game => (
                <GameCard key={game.id} game={game} />
              ))}
          </div>
        </div>
        
        {/* নতুন গেম বিভাগ */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Zap className="mr-2 h-5 w-5 text-blue-500" />
            নতুন গেম
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {sortedGames
              .filter(game => game.isNew)
              .slice(0, 6)
              .map(game => (
                <GameCard key={game.id} game={game} />
              ))}
          </div>
        </div>
        
        {/* আকর্ষণীয় গেম বিভাগ */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Bookmark className="mr-2 h-5 w-5 text-accent" />
            বিশেষ গেম
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {sortedGames
              .filter(game => game.isFeatured)
              .slice(0, 12)
              .map(game => (
                <GameCard key={game.id} game={game} />
              ))}
          </div>
        </div>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}