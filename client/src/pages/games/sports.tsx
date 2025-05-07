import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileMenu from "@/components/layout/mobile-menu";
import MobileNav from "@/components/layout/mobile-nav";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Star, 
  Zap, 
  Calendar, 
  Filter, 
  ChevronDown,
  Trophy,
  Timer,
  FootballIcon,
  TrendingUp,
  CircleDot,
  Clock
} from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { SportMatch } from "@shared/schema";

export default function SportsPage() {
  const { user, logoutMutation } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLeague, setFilterLeague] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // স্পোর্টস ম্যাচ ডেটা ফেচ করা
  const { data: sportMatches, isLoading } = useQuery({
    queryKey: ["/api/sport-matches"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/sport-matches");
      return response.json();
    },
  });

  // লীগগুলোর লিস্ট (ডুপ্লিকেট বাদ দিয়ে)
  const leagues = sportMatches 
    ? [...new Set(sportMatches.map((match: SportMatch) => match.league))]
    : [];

  // ম্যাচ ফিল্টারিং ফাংশন
  const filterMatches = (matches: SportMatch[]) => {
    if (!matches) return [];
    
    return matches.filter(match => {
      // সার্চ কোয়েরি ফিল্টার
      const matchesSearch = 
        match.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.league.toLowerCase().includes(searchQuery.toLowerCase());
      
      // লীগ ফিল্টার
      const matchesLeague = !filterLeague || match.league === filterLeague;
      
      return matchesSearch && matchesLeague;
    });
  };

  // লাইভ ও আপকামিং ম্যাচ ফিল্টারিং
  const getLiveMatches = () => {
    if (!sportMatches) return [];
    return filterMatches(sportMatches.filter(match => match.isLive));
  };
  
  const getUpcomingMatches = () => {
    if (!sportMatches) return [];
    return filterMatches(sportMatches.filter(match => !match.isLive));
  };

  // ম্যাচ সোর্টিং (সময় অনুযায়ী)
  const sortedUpcomingMatches = () => {
    return getUpcomingMatches().sort((a, b) => {
      // তারিখ এবং সময় একত্রিত করে সোর্ট
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isLoggedIn={!!user} onLogout={handleLogout} />
      <MobileMenu />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">স্পোর্টস বেটিং</h1>
            <p className="text-muted-foreground">
              আপনার প্রিয় স্পোর্টস ইভেন্টগুলিতে বাজি ধরুন
            </p>
          </div>
          
          {/* সার্চ এবং ফিল্টার সেকশন */}
          <div className="w-full md:w-auto mt-4 md:mt-0">
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="টিম বা লীগ খুঁজুন..."
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
                <h3 className="text-sm font-medium mb-2">লীগ:</h3>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={filterLeague === null ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setFilterLeague(null)}
                  >
                    সবগুলো
                  </Button>
                  {leagues.map(league => (
                    <Button
                      key={league}
                      variant={filterLeague === league ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterLeague(league)}
                    >
                      {league}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* স্পোর্টস ইনফো কার্ডস */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <Card className="bg-card border-accent/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-accent/10 rounded-full p-3">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">লাইভ বেটিং</h3>
                  <p className="text-xs text-muted-foreground">রিয়েল-টাইম স্কোর ও অডস</p>
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
                  <h3 className="font-semibold">বুস্টেড অডস</h3>
                  <p className="text-xs text-muted-foreground">উন্নত অডস ও স্পেশাল অফার</p>
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
                  <h3 className="font-semibold">সকল স্পোর্টস</h3>
                  <p className="text-xs text-muted-foreground">২০+ স্পোর্টসে বাজি ধরুন</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-accent/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-accent/10 rounded-full p-3">
                  <Star className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">ক্যাশ আউট</h3>
                  <p className="text-xs text-muted-foreground">আর্লি ক্যাশ আউট সুবিধা</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* ট্যাব সেকশন */}
        <Tabs defaultValue="live" className="mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="live" className="gap-2">
              <CircleDot className="h-4 w-4 text-red-500 animate-pulse" />
              <span>লাইভ ম্যাচ</span>
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span>আপকামিং ম্যাচ</span>
            </TabsTrigger>
          </TabsList>
          
          {/* লাইভ ম্যাচ ট্যাব */}
          <TabsContent value="live" className="mt-6">
            {isLoading ? (
              // লোডিং স্কেলেটন
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="rounded-lg bg-card/50 animate-pulse p-4">
                    <div className="flex justify-between mb-4">
                      <div className="h-5 bg-muted rounded w-1/4"></div>
                      <div className="h-5 bg-muted rounded w-1/6"></div>
                    </div>
                    <div className="h-16 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            ) : getLiveMatches().length > 0 ? (
              // লাইভ ম্যাচ লিস্ট
              <div className="space-y-4">
                {getLiveMatches().map((match: SportMatch) => (
                  <LiveMatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              // কোন লাইভ ম্যাচ না থাকলে
              <div className="text-center py-10">
                <Timer className="h-10 w-10 mx-auto text-muted-foreground opacity-20 mb-4" />
                <h3 className="font-medium mb-1">কোন লাইভ ম্যাচ নেই</h3>
                <p className="text-sm text-muted-foreground">
                  বর্তমানে কোন ম্যাচ লাইভে চলছে না। পরে আবার চেক করুন।
                </p>
              </div>
            )}
          </TabsContent>
          
          {/* আপকামিং ম্যাচ ট্যাব */}
          <TabsContent value="upcoming" className="mt-6">
            {isLoading ? (
              // লোডিং স্কেলেটন
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="rounded-lg bg-card/50 animate-pulse p-4">
                    <div className="flex justify-between mb-4">
                      <div className="h-5 bg-muted rounded w-1/4"></div>
                      <div className="h-5 bg-muted rounded w-1/6"></div>
                    </div>
                    <div className="h-16 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            ) : sortedUpcomingMatches().length > 0 ? (
              // আপকামিং ম্যাচ
              <div>
                {/* তারিখ অনুসারে গ্রুপ করা */}
                {[...new Set(sortedUpcomingMatches().map(match => match.date))].map(date => (
                  <div key={date} className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-accent" />
                      {date}
                    </h3>
                    <div className="space-y-4">
                      {sortedUpcomingMatches()
                        .filter(match => match.date === date)
                        .map((match: SportMatch) => (
                          <UpcomingMatchCard key={match.id} match={match} />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // কোন আপকামিং ম্যাচ না থাকলে
              <div className="text-center py-10">
                <Calendar className="h-10 w-10 mx-auto text-muted-foreground opacity-20 mb-4" />
                <h3 className="font-medium mb-1">কোন আপকামিং ম্যাচ নেই</h3>
                <p className="text-sm text-muted-foreground">
                  বর্তমানে কোন আপকামিং ম্যাচ শিডিউল করা নেই। পরে আবার চেক করুন।
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* টপ লীগ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">টপ লীগ</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['প্রিমিয়ার লীগ', 'লা লিগা', 'সিরি আ', 'বুন্দেসলিগা', 'লিগ ১', 'চ্যাম্পিয়নস লীগ'].map(league => (
              <Card 
                key={league} 
                className="overflow-hidden text-center hover:border-accent/50 cursor-pointer transition-all"
                onClick={() => setFilterLeague(league)}
              >
                <CardContent className="p-6">
                  <div className="bg-accent/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <FootballIcon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-medium text-sm">{league}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {sortedUpcomingMatches().filter(match => match.league === league).length} ম্যাচ
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        {/* বেটিং স্লাইডার */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">আজকের টপ বেট</h2>
            <Button variant="link" className="text-accent">
              সব দেখুন <ChevronDown className="h-4 w-4 ml-1 rotate-[-90deg]" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['প্রিমিয়ার লীগ উইনার', 'গোল্ডেন বুট উইনার', 'চ্যাম্পিয়নস লীগ উইনার'].map((title, idx) => (
              <Card key={idx} className="bg-card border-accent/20 overflow-hidden">
                <CardHeader className="bg-muted/30 pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-accent" />
                    {title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center text-xs font-medium text-accent">
                            {i + 1}
                          </div>
                          <span className="text-sm">টিম/প্লেয়ার {i + 1}</span>
                        </div>
                        <Badge 
                          className="cursor-pointer hover:bg-accent" 
                          variant="outline"
                        >
                          {(1 + i * 0.5).toFixed(2)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        {/* বেটিং টিপস */}
        <section>
          <h2 className="text-xl font-bold mb-4">বেটিং টিপস</h2>
          <Card className="bg-card border-accent/20">
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">আজকের বেটিং টিপস</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FootballIcon className="h-5 w-5 text-accent" />
                      <h4 className="font-medium">ম্যাচ উইনার</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      আর্সেনাল vs চেলসি
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">পরামর্শ: আর্সেনাল</span>
                      <Badge>1.75</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FootballIcon className="h-5 w-5 text-accent" />
                      <h4 className="font-medium">ওভার/আন্ডার</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      বার্সেলোনা vs রিয়াল মাদ্রিদ
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">পরামর্শ: ওভার 2.5</span>
                      <Badge>1.90</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FootballIcon className="h-5 w-5 text-accent" />
                      <h4 className="font-medium">উভয় দল গোল</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      লিভারপুল vs ম্যান সিটি
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">পরামর্শ: হ্যাঁ</span>
                      <Badge>1.65</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="bg-accent/10 p-4 rounded-lg mt-4">
                  <div className="flex items-center gap-2 text-accent font-semibold mb-2">
                    <Star className="h-5 w-5" />
                    <h4>আজকের টপ পরামর্শ</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    বায়ার্ন মিউনিখ vs বরুসিয়া ডর্টমুন্ড - বায়ার্ন মিউনিখ জিতবে এবং উভয় দল গোল করবে।
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium">অডস:</span>
                    <Badge className="bg-accent">2.25</Badge>
                  </div>
                </div>
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

// লাইভ ম্যাচ কার্ড কম্পোনেন্ট
function LiveMatchCard({ match }: { match: SportMatch }) {
  const statistics = match.statistics ? JSON.parse(JSON.stringify(match.statistics)) : null;
  const score = match.score ? JSON.parse(JSON.stringify(match.score)) : { home: 0, away: 0 };
  const odds = JSON.parse(JSON.stringify(match.odds));
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30 py-3 flex flex-row justify-between items-center space-y-0">
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="gap-1">
            <CircleDot className="h-2 w-2 animate-pulse" />
            <span>লাইভ</span>
          </Badge>
          <h3 className="font-medium text-sm">{match.league}</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{match.time}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* টিম ইনফো */}
          <div className="flex flex-col md:flex-row items-center md:gap-10 mb-4 md:mb-0">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h3 className="font-semibold">{match.homeTeam}</h3>
              {statistics && (
                <div className="text-xs text-muted-foreground mt-1">
                  পজেশন: {statistics.possession.home}%
                </div>
              )}
            </div>
            
            {/* স্কোর */}
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-center min-w-[80px]">
                <span className={score.home > score.away ? 'text-accent' : ''}>{score.home}</span>
                <span className="mx-2">-</span>
                <span className={score.away > score.home ? 'text-accent' : ''}>{score.away}</span>
              </div>
            </div>
            
            <div className="text-center md:text-right mt-4 md:mt-0">
              <h3 className="font-semibold">{match.awayTeam}</h3>
              {statistics && (
                <div className="text-xs text-muted-foreground mt-1">
                  পজেশন: {statistics.possession.away}%
                </div>
              )}
            </div>
          </div>
          
          {/* বেটিং অডস */}
          <div className="flex gap-2 md:gap-3">
            <Button variant="outline" className="flex-1" size="sm">
              <div className="text-center w-full">
                <div className="text-xs mb-1">১</div>
                <div className="font-semibold">{odds.home}</div>
              </div>
            </Button>
            <Button variant="outline" className="flex-1" size="sm">
              <div className="text-center w-full">
                <div className="text-xs mb-1">X</div>
                <div className="font-semibold">{odds.draw}</div>
              </div>
            </Button>
            <Button variant="outline" className="flex-1" size="sm">
              <div className="text-center w-full">
                <div className="text-xs mb-1">২</div>
                <div className="font-semibold">{odds.away}</div>
              </div>
            </Button>
            <Button variant="accent" size="sm">+</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// আপকামিং ম্যাচ কার্ড কম্পোনেন্ট
function UpcomingMatchCard({ match }: { match: SportMatch }) {
  const odds = JSON.parse(JSON.stringify(match.odds));
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30 py-3 flex flex-row justify-between items-center space-y-0">
        <h3 className="font-medium text-sm">{match.league}</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{match.time}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col md:flex-row items-center md:gap-10 mb-4 md:mb-0">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h3 className="font-semibold">{match.homeTeam}</h3>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground font-medium">
              vs
            </div>
            
            <div className="text-center md:text-right mt-4 md:mt-0">
              <h3 className="font-semibold">{match.awayTeam}</h3>
            </div>
          </div>
          
          <div className="flex gap-2 md:gap-3">
            <Button variant="outline" className="flex-1" size="sm">
              <div className="text-center w-full">
                <div className="text-xs mb-1">১</div>
                <div className="font-semibold">{odds.home}</div>
              </div>
            </Button>
            <Button variant="outline" className="flex-1" size="sm">
              <div className="text-center w-full">
                <div className="text-xs mb-1">X</div>
                <div className="font-semibold">{odds.draw}</div>
              </div>
            </Button>
            <Button variant="outline" className="flex-1" size="sm">
              <div className="text-center w-full">
                <div className="text-xs mb-1">২</div>
                <div className="font-semibold">{odds.away}</div>
              </div>
            </Button>
            <Button variant="accent" size="sm">+</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}