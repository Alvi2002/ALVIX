import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileMenu from "@/components/layout/mobile-menu";
import { BetSlip, BetConfirmDialog } from "@/components/bet-slip";
import { BetButton, BetNowButton } from "@/components/bet-button";
import { BetNowFooter } from "@/components/bet-now-footer";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Timer,
  Star,
  TrendingUp,
  ChevronRight,
  X,
  DollarSign,
  Check
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// ম্যাচ টাইপ
type Match = {
  id: number;
  homeTeam: string;
  awayTeam: string;
  league: string;
  time: string;
  date: string;
  isLive: boolean;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
  statistics?: {
    possession: {
      home: number;
      away: number;
    };
    shots: {
      home: number;
      away: number;
    };
  };
  score?: {
    home: number;
    away: number;
  };
};

// বেট সিলেকশন টাইপ
type BetSelection = {
  id: string;
  matchId: number;
  match: string;
  betType: string;
  betName: string;
  odds: number;
};

// বেট স্লিপ টাইপ
type BetSlip = {
  selections: BetSelection[];
  stake: number;
  potentialWin: number;
};

export default function BetSlipSystem() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSport, setActiveSport] = useState("ফুটবল");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isBetSlipOpen, setIsBetSlipOpen] = useState(false);
  const [isPlaceBetDialogOpen, setIsPlaceBetDialogOpen] = useState(false);
  
  // বেট স্লিপ এবং বেট স্টেট
  const [betSlip, setBetSlip] = useState<BetSlip>({
    selections: [],
    stake: 100, // ডিফল্ট স্টেক
    potentialWin: 0
  });

  // স্পোর্টস ম্যাচ ডেটা লোড করার জন্য TanStack Query ব্যবহার
  const { data: apiMatches, isLoading } = useQuery<Match[]>({
    queryKey: ['/api/sports'],
    staleTime: 30 * 1000, // ৩০ সেকেন্ড
  });

  // ওয়েবসকেট কানেকশন সেটআপ
  useEffect(() => {
    setLoading(isLoading);
    if (apiMatches && Array.isArray(apiMatches)) {
      setMatches(apiMatches);
    }

    // ওয়েবসকেট কানেকশন সেটআপ (লাইভ স্কোর আপডেটের জন্য)
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.addEventListener('open', () => {
      console.log('ওয়েবসকেট কানেকশন স্থাপিত হয়েছে');
    });

    socket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // লাইভ স্কোর আপডেট প্রসেস করা
        if (data.type === 'liveScore') {
          setMatches(prevMatches => {
            const updatedMatches = [...prevMatches];
            
            // প্রাপ্ত ম্যাচগুলির স্কোর আপডেট করা
            data.matches.forEach((liveMatch: {
              id: number;
              score?: { home: number; away: number };
              statistics?: { 
                possession: { home: number; away: number },
                shots: { home: number; away: number }
              };
              time: string;
            }) => {
              const index = updatedMatches.findIndex(m => m.id === liveMatch.id);
              if (index !== -1) {
                updatedMatches[index] = {
                  ...updatedMatches[index],
                  score: liveMatch.score,
                  statistics: liveMatch.statistics,
                  time: liveMatch.time
                };
              }
            });
            
            return updatedMatches;
          });
        }
      } catch (err) {
        console.error('ওয়েবসকেট মেসেজ পার্স করতে সমস্যা:', err);
      }
    });

    socket.addEventListener('close', () => {
      console.log('ওয়েবসকেট কানেকশন বন্ধ হয়েছে');
    });

    // ক্লিনআপ ফাংশন
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [apiMatches, isLoading]);

  // বেট সিলেকশন জোগ করার ফাংশন
  const addBetSelection = (match: Match, betType: string) => {
    if (!user) {
      toast({
        title: "বেট করতে লগইন করুন",
        description: "বেট করার জন্য আপনাকে অবশ্যই লগইন করতে হবে।",
        variant: "destructive",
      });
      return;
    }

    const matchName = `${match.homeTeam} vs ${match.awayTeam}`;
    let betName = "";
    let odds = 0;

    // বেট এর টাইপ অনুযায়ী নাম এবং অডস সেট করা
    if (betType === "home") {
      betName = `${match.homeTeam} জিতবে`;
      odds = match.odds.home;
    } else if (betType === "draw") {
      betName = "ড্র হবে";
      odds = match.odds.draw;
    } else if (betType === "away") {
      betName = `${match.awayTeam} জিতবে`;
      odds = match.odds.away;
    }

    const betId = `${match.id}-${betType}`;
    
    // চেক করা যে আগে থেকে এই বেট সিলেক্ট করা আছে কিনা
    const existingBetIndex = betSlip.selections.findIndex(
      (bet) => bet.id === betId
    );

    if (existingBetIndex !== -1) {
      // আগে থেকে সিলেক্ট করা থাকলে বাদ দেওয়া
      const newSelections = [...betSlip.selections];
      newSelections.splice(existingBetIndex, 1);
      
      const newBetSlip = {
        ...betSlip,
        selections: newSelections
      };
      
      // পোটেনশিয়াল উইন ক্যালকুলেট করা
      const potentialWin = calculatePotentialWin(newBetSlip.selections, betSlip.stake);
      
      setBetSlip({
        ...newBetSlip,
        potentialWin
      });
      
      toast({
        title: "বেট বাদ দেওয়া হয়েছে",
        description: `${betName} বেট বাদ দেওয়া হয়েছে।`,
      });
    } else {
      // নতুন বেট যোগ করা
      const newSelection: BetSelection = {
        id: betId,
        matchId: match.id,
        match: matchName,
        betType,
        betName,
        odds
      };
      
      const newSelections = [...betSlip.selections, newSelection];
      
      // পোটেনশিয়াল উইন ক্যালকুলেট করা
      const potentialWin = calculatePotentialWin(newSelections, betSlip.stake);
      
      setBetSlip({
        ...betSlip,
        selections: newSelections,
        potentialWin
      });
      
      setIsBetSlipOpen(true);
      
      toast({
        title: "বেট যোগ করা হয়েছে",
        description: `${betName} (${odds}) বেট স্লিপে যোগ করা হয়েছে।`,
      });
    }
  };
  
  // বেট স্লিপ থেকে একটি নির্দিষ্ট বেট বাদ দেওয়ার ফাংশন
  const removeBetSelection = (betId: string) => {
    const newSelections = betSlip.selections.filter(bet => bet.id !== betId);
    const potentialWin = calculatePotentialWin(newSelections, betSlip.stake);
    
    setBetSlip({
      ...betSlip,
      selections: newSelections,
      potentialWin
    });
    
    toast({
      title: "বেট সরানো হয়েছে",
      description: "বেট স্লিপ থেকে বেট সরানো হয়েছে",
    });
  };
  
  // স্টেক পরিবর্তন করার ফাংশন
  const handleStakeChange = (newStake: number) => {
    const potentialWin = calculatePotentialWin(betSlip.selections, newStake);
    
    setBetSlip({
      ...betSlip,
      stake: newStake,
      potentialWin
    });
  };
  
  // পোটেনশিয়াল উইন ক্যালকুলেট করার ফাংশন
  const calculatePotentialWin = (selections: BetSelection[], stake: number): number => {
    if (selections.length === 0) return 0;
    
    // সব অডস গুণ করে টোটাল অডস বের করা
    const totalOdds = selections.reduce((acc, bet) => acc * bet.odds, 1);
    
    // বাজি (স্টেক) দিয়ে গুণ করে পোটেনশিয়াল উইন বের করা
    return parseFloat((totalOdds * stake).toFixed(2));
  };
  
  // বেট করার ফাংশন
  const placeBet = () => {
    if (!user) {
      toast({
        title: "বেট করতে লগইন করুন",
        description: "বেট করার জন্য আপনাকে অবশ্যই লগইন করতে হবে।",
        variant: "destructive",
      });
      return;
    }
    
    if (betSlip.selections.length === 0) {
      toast({
        title: "বেট সিলেকশন খালি",
        description: "অন্তত একটি বেট সিলেকশন করুন।",
        variant: "destructive",
      });
      return;
    }
    
    // স্টেক চেক করা
    if (betSlip.stake <= 0) {
      toast({
        title: "অবৈধ স্টেক",
        description: "স্টেক পরিমাণ ইতিবাচক হতে হবে।",
        variant: "destructive",
      });
      return;
    }
    
    // Place Bet ডায়ালগ দেখানো
    setIsPlaceBetDialogOpen(true);
  };
  
  // বেট নিশ্চিত করার ফাংশন 
  const confirmBet = () => {
    // এখানে API কল করে বেট প্লেস করার কোড যোগ করা হবে
    toast({
      title: "বেট সফলভাবে করা হয়েছে",
      description: `${betSlip.selections.length}টি বেট সফলভাবে করা হয়েছে। সম্ভাব্য জিতের পরিমাণ: ৳${betSlip.potentialWin}`,
    });
    
    // বেট স্লিপ রিসেট করা
    setBetSlip({
      selections: [],
      stake: 100,
      potentialWin: 0
    });
    
    // ডায়ালগ বন্ধ করা
    setIsPlaceBetDialogOpen(false);
    setIsBetSlipOpen(false);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // উপরে আসন্ন ম্যাচ, লাইভ ম্যাচ ফিল্টার করা
  const liveMatches = matches.filter(match => match.isLive);
  const upcomingMatches = matches.filter(match => !match.isLive);

  const displayMatches = activeTab === "live" ? liveMatches : 
                         activeTab === "upcoming" ? upcomingMatches : 
                         matches;

  // সব বেট মুছে ফেলার ফাংশন
  const clearAllBets = () => {
    setBetSlip({
      selections: [],
      stake: 100,
      potentialWin: 0
    });
    
    toast({
      title: "সব বেট মুছে ফেলা হয়েছে",
      description: "বেট স্লিপ খালি করা হয়েছে",
    });
  };

  // যদি ডেটা লোড হচ্ছে তাহলে লোডিং স্পিনার দেখাবো
  if (loading && matches.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header isLoggedIn={!!user} onLogout={handleLogout} />
        <MobileMenu />
        
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </main>
        
        <Footer />
        <MobileMenu />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isLoggedIn={!!user} onLogout={handleLogout} />
      <MobileMenu />
      
      {/* বেট স্লিপ */}
      <BetSlip 
        isOpen={isBetSlipOpen}
        betSlip={betSlip}
        onClose={() => setIsBetSlipOpen(false)}
        onRemoveBet={removeBetSelection}
        onStakeChange={handleStakeChange}
        onPlaceBet={placeBet}
        onClearAll={clearAllBets}
      />
      
      {/* বেট কনফার্ম ডায়ালগ */}
      <BetConfirmDialog
        isOpen={isPlaceBetDialogOpen}
        onClose={() => setIsPlaceBetDialogOpen(false)}
        onConfirm={confirmBet}
        betSlip={betSlip}
      />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">স্পোর্টস বেটিং</h1>
          
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="mb-4 bg-background border rounded-md p-1">
              <TabsTrigger 
                value="live"
                onClick={() => setActiveTab("live")}
                className={activeTab === "live" ? "bg-accent text-white" : ""}
              >
                <Timer className="h-4 w-4 mr-1" />
                লাইভ ম্যাচ
                <Badge variant="secondary" className="ml-2 bg-red-500 text-white">
                  {liveMatches.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="upcoming"
                onClick={() => setActiveTab("upcoming")}
                className={activeTab === "upcoming" ? "bg-accent text-white" : ""}
              >
                উপরে আসন্ন
                <Badge variant="secondary" className="ml-2">
                  {upcomingMatches.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="popular"
                onClick={() => setActiveTab("popular")}
                className={activeTab === "popular" ? "bg-accent text-white" : ""}
              >
                <Star className="h-4 w-4 mr-1" />
                জনপ্রিয়
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="live" className="pt-2">
              <div className="space-y-4">
                {loading ? (
                  <>
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="bg-card rounded-lg overflow-hidden shadow animate-pulse p-4">
                        <div className="h-6 bg-muted rounded w-1/3 mb-3"></div>
                        <div className="h-10 bg-muted rounded mb-3"></div>
                        <div className="h-8 bg-muted rounded w-2/3"></div>
                      </div>
                    ))}
                  </>
                ) : liveMatches.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">এই মুহূর্তে কোন লাইভ ম্যাচ নেই।</p>
                  </div>
                ) : (
                  liveMatches.map((match) => (
                    <div key={match.id} className="bg-card rounded-lg overflow-hidden shadow">
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <Badge variant="outline" className="bg-red-500 text-white mr-2">
                              লাইভ
                            </Badge>
                            <span className="text-sm text-muted-foreground">{match.league}</span>
                          </div>
                          <span className="text-sm text-red-500 animate-pulse">{match.time}</span>
                        </div>
                        
                        <div className="flex justify-between items-center mb-4">
                          <div className="text-xl font-bold">{match.homeTeam}</div>
                          {match.score && (
                            <div className="flex items-center bg-accent/10 rounded-md px-2 py-1">
                              <span className="text-xl font-bold mr-1">{match.score.home}</span>
                              <span className="text-sm">-</span>
                              <span className="text-xl font-bold ml-1">{match.score.away}</span>
                            </div>
                          )}
                          <div className="text-xl font-bold">{match.awayTeam}</div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <BetButton match={match} betType="home" onBetSelect={addBetSelection} />
                          <BetButton match={match} betType="draw" onBetSelect={addBetSelection} />
                          <BetButton match={match} betType="away" onBetSelect={addBetSelection} />
                        </div>
                        
                        {match.statistics && (
                          <div className="bg-secondary/30 p-2 rounded-md mb-4">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-muted-foreground">পসেশন</span>
                              <div className="flex gap-2">
                                <span className="text-white">{match.statistics.possession.home}%</span>
                                <span className="text-white">{match.statistics.possession.away}%</span>
                              </div>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">শট</span>
                              <div className="flex gap-2">
                                <span className="text-white">{match.statistics.shots.home}</span>
                                <span className="text-white">{match.statistics.shots.away}</span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <BetNowFooter
                          match={match}
                          onViewDetails={() => window.alert(`${match.homeTeam} vs ${match.awayTeam} বিস্তারিত দেখুন`)}
                          onBetNow={() => { 
                            addBetSelection(match, "home");
                            setIsBetSlipOpen(true);
                          }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="upcoming" className="pt-2">
              <div className="space-y-4">
                {loading ? (
                  <>
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="bg-card rounded-lg overflow-hidden shadow animate-pulse p-4">
                        <div className="h-6 bg-muted rounded w-1/3 mb-3"></div>
                        <div className="h-10 bg-muted rounded mb-3"></div>
                        <div className="h-8 bg-muted rounded w-2/3"></div>
                      </div>
                    ))}
                  </>
                ) : upcomingMatches.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">এই মুহূর্তে কোন আসন্ন ম্যাচ নেই।</p>
                  </div>
                ) : (
                  upcomingMatches.map((match) => (
                    <div key={match.id} className="bg-card rounded-lg overflow-hidden shadow">
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">{match.league}</span>
                          <div className="flex items-center">
                            <span className="text-sm text-muted-foreground mr-2">{match.date}</span>
                            <span className="text-sm text-accent">{match.time}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mb-4">
                          <div className="text-xl font-bold">{match.homeTeam}</div>
                          <div className="text-xl font-bold">VS</div>
                          <div className="text-xl font-bold">{match.awayTeam}</div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <BetButton match={match} betType="home" onBetSelect={addBetSelection} />
                          <BetButton match={match} betType="draw" onBetSelect={addBetSelection} />
                          <BetButton match={match} betType="away" onBetSelect={addBetSelection} />
                        </div>
                        
                        <BetNowFooter
                          match={match}
                          onViewDetails={() => window.alert(`${match.homeTeam} vs ${match.awayTeam} বিস্তারিত দেখুন`)}
                          onBetNow={() => {
                            addBetSelection(match, "home");
                            setIsBetSlipOpen(true);
                          }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="popular" className="pt-2">
              <div className="space-y-4">
                <div className="bg-card rounded-lg overflow-hidden shadow">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">উচ্চ অডস বেট</span>
                      <div className="flex items-center">
                        <span className="text-sm text-accent">জনপ্রিয়</span>
                        <TrendingUp className="h-4 w-4 ml-1 text-accent" />
                      </div>
                    </div>
                    
                    <div className="space-y-3 mt-4">
                      {matches.slice(0, 3).map((match) => (
                        <div key={`popular-${match.id}`} className="border border-border rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted-foreground">{match.league}</span>
                            <div className="flex items-center">
                              <span className="text-sm text-muted-foreground mr-2">{match.date}</span>
                              <span className="text-sm text-accent">{match.time}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mb-3">
                            <div className="text-base font-bold">{match.homeTeam}</div>
                            <div className="text-xs text-muted-foreground">VS</div>
                            <div className="text-base font-bold">{match.awayTeam}</div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              <span className="text-muted-foreground">{match.homeTeam} জিতবে</span>
                              <div className="font-bold text-accent mt-1">{match.odds.home}</div>
                            </div>
                            
                            <BetNowButton 
                              match={match}
                              betType="home"
                              onBetSelect={addBetSelection}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}