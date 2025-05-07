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
  Filter, 
  ChevronDown,
  PlaySquare,
  Users,
  ShieldCheck,
  DollarSign,
  Clock,
  BarChart
} from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { LiveCasinoGame } from "@shared/schema";

export default function LiveCasinoPage() {
  const { user, logoutMutation } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProvider, setFilterProvider] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // লাইভ ক্যাসিনো গেম ডেটা ফেচ করা
  const { data: liveCasinoGames, isLoading } = useQuery({
    queryKey: ["/api/live-casino-games"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/live-casino-games");
      return response.json();
    },
  });

  // গেম প্রোভাইডারদের লিস্ট (ডুপ্লিকেট বাদ দিয়ে)
  const providers = liveCasinoGames 
    ? [...new Set(liveCasinoGames.map((game: LiveCasinoGame) => game.provider))]
    : [];

  // গেম ক্যাটেগরিগুলো (ডুপ্লিকেট বাদ দিয়ে)
  const categories = liveCasinoGames 
    ? [...new Set(liveCasinoGames.map((game: LiveCasinoGame) => game.category))]
    : [];

  // গেম ফিল্টারিং ফাংশন
  const filterGames = (games: LiveCasinoGame[], category: string = 'all') => {
    if (!games) return [];
    
    return games.filter(game => {
      // সার্চ কোয়েরি ফিল্টার
      const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // প্রোভাইডার ফিল্টার
      const matchesProvider = !filterProvider || game.provider === filterProvider;
      
      // ক্যাটেগরি ফিল্টার
      const matchesCategory = category === 'all' || game.category === category;
      
      return matchesSearch && matchesProvider && matchesCategory;
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isLoggedIn={!!user} onLogout={handleLogout} />
      <MobileMenu />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">লাইভ ক্যাসিনো</h1>
            <p className="text-muted-foreground">
              বাস্তব ডিলারদের সাথে সরাসরি খেলুন - দুর্দান্ত অভিজ্ঞতা
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
        
        {/* ইনফো কার্ডস */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <Card className="bg-card border-accent/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-accent/10 rounded-full p-3">
                  <PlaySquare className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">লাইভ স্ট্রিমিং</h3>
                  <p className="text-xs text-muted-foreground">এইচডি কোয়ালিটি লাইভ ভিডিও</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-accent/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-accent/10 rounded-full p-3">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">প্রফেশনাল ডিলারস</h3>
                  <p className="text-xs text-muted-foreground">অভিজ্ঞ এবং দক্ষ লাইভ ডিলারস</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-accent/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-accent/10 rounded-full p-3">
                  <ShieldCheck className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">নিরাপদ ও ন্যায্য</h3>
                  <p className="text-xs text-muted-foreground">লাইসেন্সযুক্ত এবং নিয়ন্ত্রিত</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-accent/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-accent/10 rounded-full p-3">
                  <DollarSign className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">বিভিন্ন বাজি সীমা</h3>
                  <p className="text-xs text-muted-foreground">নিজের বাজেট অনুযায়ী বাজি</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* ট্যাব সেকশন */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="w-full overflow-x-auto flex whitespace-nowrap">
            <TabsTrigger value="all">সবগুলো</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {/* ট্যাব বিষয়বস্তু */}
          <TabsContent value="all" className="mt-6">
            {isLoading ? (
              // লোডিং স্কেলেটন
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="rounded-lg bg-card/50 animate-pulse">
                    <div className="h-44 rounded-t-lg bg-muted"></div>
                    <div className="p-4">
                      <div className="h-5 bg-muted rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filterGames(liveCasinoGames).length > 0 ? (
              // গেম গ্রিড
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filterGames(liveCasinoGames).map((game: LiveCasinoGame) => (
                  <LiveCasinoGameCard key={game.id} game={game} />
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
          
          {/* আলাদা আলাদা ক্যাটেগরি ট্যাব */}
          {categories.map(category => (
            <TabsContent key={category} value={category} className="mt-6">
              {isLoading ? (
                // লোডিং স্কেলেটন
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, index) => (
                    <div key={index} className="rounded-lg bg-card/50 animate-pulse">
                      <div className="h-44 rounded-t-lg bg-muted"></div>
                      <div className="p-4">
                        <div className="h-5 bg-muted rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filterGames(liveCasinoGames, category).length > 0 ? (
                // গেম গ্রিড
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filterGames(liveCasinoGames, category).map((game: LiveCasinoGame) => (
                    <LiveCasinoGameCard key={game.id} game={game} />
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
        
        {/* জনপ্রিয় ডিলারস সেকশন */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-6">জনপ্রিয় ডিলারস</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, index) => (
              <Card key={index} className="bg-card border-accent/20 text-center overflow-hidden group transition-all hover:shadow-lg">
                <div className="relative overflow-hidden h-52">
                  <div className="w-full h-full bg-gradient-to-b from-accent/30 to-card/90 flex items-center justify-center">
                    <Users className="h-16 w-16 text-accent/40" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white">
                    <h3 className="font-medium text-sm">ডিলার {index + 1}</h3>
                    <p className="text-xs opacity-80">রুলেট / ব্ল্যাকজ্যাক</p>
                  </div>
                </div>
                <CardFooter className="p-3">
                  <Button variant="outline" className="w-full text-xs">প্রোফাইল দেখুন</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
        
        {/* লাইভ টেবল স্ট্যাটস */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-6">লাইভ টেবল স্ট্যাটস</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card border-accent/20 overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-accent" />
                    রুলেট নাম্বার স্ট্যাটস
                  </h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-6 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(num => (
                      <div 
                        key={num} 
                        className={`w-full aspect-square rounded-full flex items-center justify-center text-xs font-semibold ${
                          num % 2 === 0 ? 'bg-black text-white' : 'bg-red-600 text-white'
                        }`}
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                    <span>লাস্ট আপডেট: 2 মিনিট আগে</span>
                    <Button variant="link" size="sm" className="text-xs h-auto p-0">
                      আরো দেখুন
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-accent/20 overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4 text-accent" />
                    ব্যাকারাট স্কোর বোর্ড
                  </h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-8 gap-1">
                    {[...Array(24)].map((_, index) => (
                      <div 
                        key={index} 
                        className={`w-full aspect-square rounded flex items-center justify-center text-xs font-semibold ${
                          index % 3 === 0 ? 'bg-blue-500 text-white' : 
                          index % 3 === 1 ? 'bg-red-500 text-white' : 
                          'bg-green-500 text-white'
                        }`}
                      >
                        {index % 3 === 0 ? 'P' : index % 3 === 1 ? 'B' : 'T'}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                    <span>টেবল: ব্যাকারাট A</span>
                    <Button variant="link" size="sm" className="text-xs h-auto p-0">
                      টেবলে যান
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-accent/20 overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-accent" />
                    হট টেবল স্ট্যাটস
                  </h3>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {[
                      { name: 'লাইটনিং রুলেট', players: '১২৮', winRate: '৯৬%' },
                      { name: 'স্পিড ব্ল্যাকজ্যাক', players: '৯৫', winRate: '৯৮%' },
                      { name: 'ক্র্যাজি টাইম', players: '৮৭', winRate: '৯৭%' },
                      { name: 'মানি হুইল', players: '৭৬', winRate: '৯৭%' }
                    ].map((table, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 rounded bg-muted/30">
                        <span className="font-medium text-sm">{table.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {table.players}
                          </span>
                          <Button size="sm" variant="accent" className="text-xs h-7">
                            জয়েন
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* VIP টেবল */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">VIP টেবলস</h2>
            <Button variant="outline" className="gap-2">
              <Crown className="h-4 w-4" />
              <span>VIP প্রোগ্রাম দেখুন</span>
            </Button>
          </div>
          
          <div className="relative rounded-lg overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10"></div>
            <div className="absolute inset-y-0 left-0 z-20 flex flex-col justify-center px-6 md:px-10 max-w-lg">
              <Badge className="bg-accent mb-2 w-fit">এক্সক্লুসিভ</Badge>
              <h3 className="text-xl md:text-3xl font-bold text-white mb-2">VIP লাইভ ক্যাসিনো টেবল</h3>
              <p className="text-white/80 text-sm md:text-base mb-4">
                আমাদের VIP লাইভ ক্যাসিনো টেবলে জয়েন করুন উচ্চ মূল্যের বাজি, একান্ত পরিবেশ এবং বিশেষ বোনাস উপভোগ করতে।
              </p>
              <Button className="w-fit">
                VIP সদস্য হোন
              </Button>
            </div>
            <div className="h-64 md:h-80 w-full bg-gradient-to-r from-accent/30 to-black/50">
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}

// লাইভ ক্যাসিনো গেম কার্ড কম্পোনেন্ট
function LiveCasinoGameCard({ game }: { game: LiveCasinoGame }) {
  return (
    <Card className="overflow-hidden group transition-all hover:shadow-lg">
      <div className="relative overflow-hidden h-48">
        <img 
          src={game.image} 
          alt={game.name} 
          className="w-full h-full object-cover transition-transform group-hover:scale-110"
        />
        {game.isPopular && (
          <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600">
            জনপ্রিয়
          </Badge>
        )}
        {game.badgeText && (
          <Badge 
            className={`absolute top-2 right-2 ${
              game.badgeType === 'new' ? 'bg-green-500 hover:bg-green-600' : 
              game.badgeType === 'vip' ? 'bg-purple-500 hover:bg-purple-600' : 
              'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {game.badgeText}
          </Badge>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-white text-sm">{game.name}</h3>
              <p className="text-white/70 text-xs">{game.provider}</p>
            </div>
            {game.players && (
              <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                <Users className="h-3 w-3 mr-1" />
                {game.players}
              </Badge>
            )}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
          <div className="w-full space-y-2">
            <Button variant="accent" size="sm" className="w-full">
              লাইভ খেলা
            </Button>
            <Button variant="outline" size="sm" className="w-full bg-white/10 border-white/20 text-white">
              ডেমো
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

// এটি যোগ করতে ভুলে গেছি
function Crown(props: any) {
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
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}