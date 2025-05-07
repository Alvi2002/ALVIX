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
  Star, 
  Fire, 
  Clock, 
  Filter, 
  ChevronDown,
  Sparkles,
  Gamepad2
} from "lucide-react";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { SlotGame } from "@shared/schema";

export default function SlotsPage() {
  const { user, logoutMutation } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProvider, setFilterProvider] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // স্লট গেম ডেটা ফেচ করা
  const { data: slotGames, isLoading } = useQuery({
    queryKey: ["/api/slot-games"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/slot-games");
      return response.json();
    },
  });

  // গেম প্রোভাইডারদের লিস্ট (ডুপ্লিকেট বাদ দিয়ে)
  const providers = slotGames 
    ? [...new Set(slotGames.map((game: SlotGame) => game.provider))]
    : [];

  // গেম ফিল্টারিং ফাংশন
  const filterGames = (games: SlotGame[]) => {
    if (!games) return [];
    
    return games.filter(game => {
      // সার্চ কোয়েরি ফিল্টার
      const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // প্রোভাইডার ফিল্টার
      const matchesProvider = !filterProvider || game.provider === filterProvider;
      
      return matchesSearch && matchesProvider;
    });
  };

  // ক্যাটেগরি অনুযায়ী গেম ফিল্টারিং
  const getGamesByCategory = (category: string) => {
    if (!slotGames) return [];
    
    switch(category) {
      case "popular":
        return filterGames(slotGames.filter(game => game.isPopular));
      case "new":
        // নতুন গেম হিসেবে লাস্ট ২০ গেম নেওয়া হচ্ছে
        return filterGames(slotGames.slice(-20));
      case "jackpot":
        // জ্যাকপট গেম ফিল্টারিং (এখানে যেগুলোর নামে "jackpot" আছে)
        return filterGames(slotGames.filter(game => 
          game.name.toLowerCase().includes('jackpot')));
      case "all":
      default:
        return filterGames(slotGames);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isLoggedIn={!!user} onLogout={handleLogout} />
      <MobileMenu />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">স্লট গেমস</h1>
            <p className="text-muted-foreground">
              সেরা এবং আধুনিক স্লট গেমস কালেকশন
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
                <h3 className="text-sm font-medium mb-2">প্রোভাইডার:</h3>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={filterProvider === null ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setFilterProvider(null)}
                  >
                    সবগুলো
                  </Button>
                  {providers.map(provider => (
                    <Button
                      key={provider}
                      variant={filterProvider === provider ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterProvider(provider)}
                    >
                      {provider}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* ট্যাব সেকশন */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="all" className="gap-2">
              <Gamepad2 className="h-4 w-4" />
              <span>সবগুলো</span>
            </TabsTrigger>
            <TabsTrigger value="popular" className="gap-2">
              <Fire className="h-4 w-4" />
              <span>জনপ্রিয়</span>
            </TabsTrigger>
            <TabsTrigger value="new" className="gap-2">
              <Sparkles className="h-4 w-4" />
              <span>নতুন</span>
            </TabsTrigger>
            <TabsTrigger value="jackpot" className="gap-2">
              <Star className="h-4 w-4" />
              <span>জ্যাকপট</span>
            </TabsTrigger>
          </TabsList>
          
          {/* ট্যাব বিষয়বস্তু */}
          {["all", "popular", "new", "jackpot"].map(category => (
            <TabsContent key={category} value={category} className="mt-6">
              {isLoading ? (
                // লোডিং স্কেলেটন
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {[...Array(15)].map((_, index) => (
                    <div key={index} className="rounded-lg bg-card/50 animate-pulse">
                      <div className="h-40 rounded-t-lg bg-muted"></div>
                      <div className="p-3">
                        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : getGamesByCategory(category).length > 0 ? (
                // গেম গ্রিড
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {getGamesByCategory(category).map((game: SlotGame) => (
                    <Card key={game.id} className="overflow-hidden group transition-all hover:shadow-lg">
                      <div className="relative overflow-hidden h-40">
                        <img 
                          src={game.image} 
                          alt={game.name} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                        {game.isPopular && (
                          <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600">
                            <Fire className="h-3 w-3 mr-1" />
                            হট
                          </Badge>
                        )}
                        {game.badgeText && (
                          <Badge 
                            className={`absolute top-2 right-2 ${
                              game.badgeType === 'new' ? 'bg-green-500 hover:bg-green-600' : 
                              game.badgeType === 'jackpot' ? 'bg-purple-500 hover:bg-purple-600' : 
                              'bg-blue-500 hover:bg-blue-600'
                            }`}
                          >
                            {game.badgeText}
                          </Badge>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                          <Button variant="accent" size="sm" className="w-full">
                            খেলুন
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-semibold text-sm truncate">{game.name}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <span>{game.provider}</span>
                          {game.rtp && (
                            <>
                              <span className="mx-1">•</span>
                              <span>RTP {game.rtp}</span>
                            </>
                          )}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                // রেজাল্ট না পাওয়া গেলে
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
        
        {/* ফিচার্ড গেমস সেকশন */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">ফিচার্ড গেমস</h2>
            <Button variant="link" className="text-accent">
              সবগুলো দেখুন <ChevronDown className="h-4 w-4 ml-1 rotate-[-90deg]" />
            </Button>
          </div>
          
          {isLoading ? (
            // লোডিং স্কেলেটন
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="rounded-lg bg-card/50 animate-pulse">
                  <div className="h-60 rounded-t-lg bg-muted"></div>
                  <div className="p-4">
                    <div className="h-5 bg-muted rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {slotGames && slotGames
                .filter((game: SlotGame) => game.isFeatured)
                .slice(0, 4)
                .map((game: SlotGame) => (
                  <Card key={game.id} className="overflow-hidden group transition-all hover:shadow-lg">
                    <div className="relative overflow-hidden h-60">
                      <img 
                        src={game.image} 
                        alt={game.name} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                        <Button variant="accent" className="w-full">
                          খেলুন
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1">{game.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <span>{game.provider}</span>
                        {game.rtp && (
                          <>
                            <span className="mx-1">•</span>
                            <span>RTP {game.rtp}</span>
                          </>
                        )}
                      </p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </section>
        
        {/* প্রোভাইডার সেকশন */}
        <section>
          <h2 className="text-xl font-bold mb-4">টপ প্রোভাইডার</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {providers.slice(0, 6).map(provider => (
              <Card key={provider} className="overflow-hidden text-center hover:border-accent/50 cursor-pointer transition-all">
                <CardContent className="p-6">
                  <div className="bg-accent/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <Gamepad2 className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-medium text-sm">{provider}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {slotGames?.filter((game: SlotGame) => game.provider === provider).length || 0} গেম
                  </p>
                </CardContent>
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