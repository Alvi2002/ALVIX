import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileMenu from "@/components/layout/mobile-menu";
import MobileNav from "@/components/layout/mobile-nav";
import { 
  Card, 
  CardContent,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Zap, 
  Filter, 
  ChevronDown,
  Gamepad2,
  Rocket,
  TrendingUp,
  Trophy,
  Clock,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

// আর্কেড গেমের জন্য একটি ইন্টারফেস তৈরি করছি
interface ArcadeGame {
  id: number;
  name: string;
  image: string;
  category: string;
  provider: string;
  minBet: number;
  maxBet: number;
  maxWin: number;
  description?: string;
  isPopular?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
}

export default function ArcadePage() {
  const { user, logoutMutation } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // আর্কেড গেম ডেটা (বাস্তবিক অ্যাপ্লিকেশনে এগুলি API থেকে লোড করা উচিত)
  const arcadeGames: ArcadeGame[] = [
    {
      id: 1,
      name: "ক্র্যাশ",
      image: "https://via.placeholder.com/300x200",
      category: "ক্র্যাশ গেমস",
      provider: "এভিয়েটর",
      minBet: 100,
      maxBet: 50000,
      maxWin: 10000000,
      description: "দ্রুত বাড়তে থাকা মাল্টিপ্লায়ার সহ এই উত্তেজনাপূর্ণ ক্র্যাশ গেম খেলুন।",
      isPopular: true,
      isFeatured: true
    },
    {
      id: 2,
      name: "পাওয়ার ডিস",
      image: "https://via.placeholder.com/300x200",
      category: "ক্র্যাশ গেমস",
      provider: "প্রাগমাটিক প্লে",
      minBet: 200,
      maxBet: 100000,
      maxWin: 5000000,
      description: "স্পিনিং ডিস্কে আপনার লাকি নাম্বার বাছাই করুন।",
      isPopular: true
    },
    {
      id: 3,
      name: "ড্রাগন টাইগার",
      image: "https://via.placeholder.com/300x200",
      category: "কার্ড গেমস",
      provider: "এভোলিউশন গেমিং",
      minBet: 500,
      maxBet: 100000,
      maxWin: 2000000,
      description: "সিম্পল এবং দ্রুত খেলার এই জনপ্রিয় কার্ড গেম।",
      isPopular: true
    },
    {
      id: 4,
      name: "মাইন ফিল্ড",
      image: "https://via.placeholder.com/300x200",
      category: "মাইন্স গেমস",
      provider: "স্পরিব",
      minBet: 100,
      maxBet: 20000,
      maxWin: 1000000,
      description: "মাইন এড়িয়ে জেমস সংগ্রহ করুন এই উত্তেজনাপূর্ণ গেমে।",
      isPopular: true,
      isFeatured: true
    },
    {
      id: 5,
      name: "হাই-লো",
      image: "https://via.placeholder.com/300x200",
      category: "কার্ড গেমস",
      provider: "বেটসফট",
      minBet: 200,
      maxBet: 50000,
      maxWin: 500000,
      description: "পরবর্তী কার্ড হাই নাকি লো হবে অনুমান করুন।",
      isNew: true
    },
    {
      id: 6,
      name: "কয়েন ফ্লিপ",
      image: "https://via.placeholder.com/300x200",
      category: "ক্র্যাশ গেমস",
      provider: "গেমিং কর্প",
      minBet: 100,
      maxBet: 10000,
      maxWin: 20000,
      description: "হেড বা টেইল? সঠিক অনুমান করে জিতুন।",
      isNew: true
    },
    {
      id: 7,
      name: "ডাইস ক্র্যাশ",
      image: "https://via.placeholder.com/300x200",
      category: "ক্র্যাশ গেমস",
      provider: "স্পিনবুকাস",
      minBet: 100,
      maxBet: 50000,
      maxWin: 1000000,
      description: "শুরু হওয়ার আগে ক্র্যাশ অনুমান করুন।",
      isNew: true,
      isFeatured: true
    },
    {
      id: 8,
      name: "ড্রপিং বম্ব",
      image: "https://via.placeholder.com/300x200",
      category: "মাইন্স গেমস",
      provider: "ওয়ানেক্স",
      minBet: 200,
      maxBet: 20000,
      maxWin: 500000,
      description: "নিচে ফেলা বোমা এড়িয়ে টপে পৌঁছান।",
      isNew: true
    },
    {
      id: 9,
      name: "লিমবো",
      image: "https://via.placeholder.com/300x200",
      category: "ক্র্যাশ গেমস",
      provider: "এভিয়েটর",
      minBet: 300,
      maxBet: 100000,
      maxWin: 2000000,
      description: "লিমিট বের করে দেখুন কতটা নিচে যেতে পারেন।",
      isPopular: true
    },
    {
      id: 10,
      name: "পোকার গেম",
      image: "https://via.placeholder.com/300x200",
      category: "কার্ড গেমস",
      provider: "এভোলিউশন গেমিং",
      minBet: 500,
      maxBet: 100000,
      maxWin: 5000000,
      description: "সেরা পোকার হ্যান্ড নিয়ে জিতুন।",
      isPopular: true,
      isFeatured: true
    },
    {
      id: 11,
      name: "লাকি হুইল",
      image: "https://via.placeholder.com/300x200",
      category: "হুইল গেমস",
      provider: "প্রাগমাটিক প্লে",
      minBet: 100,
      maxBet: 10000,
      maxWin: 1000000,
      description: "আপনার লাকি নাম্বারে হুইল স্পিন করুন।",
      isNew: true
    },
    {
      id: 12,
      name: "কিনো টাইম",
      image: "https://via.placeholder.com/300x200",
      category: "লটারি গেমস",
      provider: "বেটসফট",
      minBet: 100,
      maxBet: 5000,
      maxWin: 1000000,
      description: "আপনার নাম্বার চয়ন করে কিনো টাইম জিতুন।",
      isPopular: true,
      isFeatured: true
    }
  ];

  // গেম ক্যাটেগরি গুলো পাওয়া
  const categories = [...new Set(arcadeGames.map(game => game.category))];

  // গেম ফিল্টারিং ফাংশন
  const filterGames = (games: ArcadeGame[], category: string = 'all') => {
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
        return filterGames(arcadeGames.filter(game => game.isPopular));
      case "new":
        return filterGames(arcadeGames.filter(game => game.isNew));
      case "featured":
        return filterGames(arcadeGames.filter(game => game.isFeatured));
      case "all":
      default:
        return filterGames(arcadeGames);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isLoggedIn={!!user} onLogout={handleLogout} />
      <MobileMenu />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">আর্কেড গেমস</h1>
            <p className="text-muted-foreground">
              দ্রুত খেলা, দ্রুত জেতা - আর্কেড এবং ক্র্যাশ গেমস
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
                  <Rocket className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">ক্র্যাশ গেমস</h3>
                  <p className="text-xs text-muted-foreground">দ্রুত গতির উত্তেজনা</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-accent/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-accent/10 rounded-full p-3">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">মাল্টিপ্লায়ার</h3>
                  <p className="text-xs text-muted-foreground">উচ্চ মাল্টিপ্লায়ার জয়</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-accent/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-accent/10 rounded-full p-3">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">ইনস্ট্যান্ট রেজাল্ট</h3>
                  <p className="text-xs text-muted-foreground">তাৎক্ষণিক জয়ের ফলাফল</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-accent/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-accent/10 rounded-full p-3">
                  <Trophy className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">বড় জয়</h3>
                  <p className="text-xs text-muted-foreground">বড় বড় জয়ের সুযোগ</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* ট্যাব সেকশন */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all" className="gap-2">
              <Gamepad2 className="h-4 w-4" />
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
              <Trophy className="h-4 w-4" />
              <span>ফিচার্ড</span>
            </TabsTrigger>
          </TabsList>
          
          {/* ট্যাব বিষয়বস্তু */}
          {["all", "popular", "new", "featured"].map(category => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {getGamesByCategory(category).map((game) => (
                  <ArcadeGameCard key={game.id} game={game} />
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
          <h2 className="text-xl font-bold mb-6">সেরা ক্র্যাশ গেমস</h2>
          
          <div className="relative rounded-lg overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10"></div>
            <div className="absolute inset-y-0 left-0 z-20 flex flex-col justify-center px-6 md:px-10 max-w-lg">
              <Badge className="bg-accent mb-2 w-fit">সবচেয়ে জনপ্রিয়</Badge>
              <h3 className="text-xl md:text-3xl font-bold text-white mb-2">এভিয়েটর</h3>
              <p className="text-white/80 text-sm md:text-base mb-4">
                আকাশে উড়ছে একটি বিমান, প্লেন ক্র্যাশ হওয়ার আগে ক্যাশ আউট করুন। যত উপরে যায় মাল্টিপ্লায়ার তত বাড়ে, কিন্তু ঝুঁকিও বাড়ে।
              </p>
              <div className="flex flex-col xs:flex-row gap-3">
                <Button>
                  খেলা শুরু করুন
                </Button>
                <Button variant="outline" className="bg-white/10 border-white/20 text-white">
                  আরও জানুন
                </Button>
              </div>
            </div>
            <div className="h-64 md:h-80 w-full bg-gradient-to-r from-accent/30 to-black/50"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {arcadeGames
              .filter(game => game.category === "ক্র্যাশ গেমস")
              .slice(0, 3)
              .map(game => (
                <Card key={game.id} className="overflow-hidden group hover:shadow-lg transition-all">
                  <div className="relative overflow-hidden h-48">
                    <div className="bg-gradient-to-br from-accent/30 to-black/60 absolute inset-0 flex items-center justify-center">
                      <Rocket className="h-16 w-16 text-white/30" />
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
                      <span>ম্যাক্স. বেট: ৳{game.maxBet}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/30 px-4 py-3">
                    <Button variant="accent" className="w-full">খেলুন</Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </section>
        
        {/* রিসেন্ট বিগ উইনারস */}
        <section>
          <h2 className="text-xl font-bold mb-6">সাম্প্রতিক বিগ উইনারস</h2>
          <Card className="bg-card border-accent/20">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3">প্লেয়ার</th>
                      <th className="text-left px-4 py-3">গেম</th>
                      <th className="text-left px-4 py-3">বেট</th>
                      <th className="text-left px-4 py-3">মাল্টিপ্লায়ার</th>
                      <th className="text-left px-4 py-3">জয়</th>
                      <th className="text-left px-4 py-3">সময়</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { player: "Player***123", game: "ক্র্যাশ", bet: "৳1,000", multiplier: "15.2x", win: "৳15,200", time: "3 মিনিট আগে" },
                      { player: "Lucky***789", game: "পাওয়ার ডিস", bet: "৳500", multiplier: "8.9x", win: "৳4,450", time: "11 মিনিট আগে" },
                      { player: "Winner***567", game: "ক্র্যাশ", bet: "৳2,000", multiplier: "5.3x", win: "৳10,600", time: "15 মিনিট আগে" },
                      { player: "Player***892", game: "মাইন ফিল্ড", bet: "৳300", multiplier: "25.0x", win: "৳7,500", time: "26 মিনিট আগে" },
                      { player: "Gaming***445", game: "লিমবো", bet: "৳5,000", multiplier: "12.6x", win: "৳63,000", time: "32 মিনিট আগে" }
                    ].map((win, idx) => (
                      <tr key={idx} className="border-b border-border hover:bg-muted/20">
                        <td className="px-4 py-3">{win.player}</td>
                        <td className="px-4 py-3">{win.game}</td>
                        <td className="px-4 py-3">{win.bet}</td>
                        <td className="px-4 py-3 text-accent font-semibold">{win.multiplier}</td>
                        <td className="px-4 py-3 font-semibold">{win.win}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {win.time}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}

// আর্কেড গেম কার্ড কম্পোনেন্ট
function ArcadeGameCard({ game }: { game: ArcadeGame }) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all">
      <div className="relative overflow-hidden h-48">
        <div className="bg-gradient-to-br from-accent/30 to-black/60 absolute inset-0 flex items-center justify-center">
          <Gamepad2 className="h-16 w-16 text-white/30" />
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
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>বেট: ৳{game.minBet} - ৳{game.maxBet}</span>
          <span>ম্যাক্স উইন: ৳{game.maxWin.toLocaleString()}</span>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 px-4 py-3">
        <Button variant="accent" className="w-full">খেলুন</Button>
      </CardFooter>
    </Card>
  );
}