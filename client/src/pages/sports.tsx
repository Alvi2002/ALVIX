import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileMenu from "@/components/layout/mobile-menu";
import MobileNav from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Timer, 
  Star, 
  TrendingUp, 
  ChevronRight,
  ArrowRightLeft,
  ArrowUp,
  ChevronDown,
  X,
  Trash2,
  DollarSign,
  Check,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { BetSlip, BetConfirmDialog } from "@/components/bet-slip";
import { BetButton, BetNowButton } from "@/components/bet-button";
import { BetNowFooter } from "@/components/bet-now-footer";

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

type BetSelection = {
  id: string; // ইউনিক আইডি (ম্যাচআইডি + বেট টাইপ)
  matchId: number;
  match: string; // ম্যাচের নাম (HomeTeam vs AwayTeam)
  betType: string; // "home" | "draw" | "away" | "other"
  betName: string; // বাংলায় বেট এর নাম
  odds: number;
};

type BetSlip = {
  selections: BetSelection[];
  stake: number;
  potentialWin: number;
};

export default function SportsPage() {
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

  const sports = [
    {
      id: "football",
      name: "ফুটবল",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a9.96 9.96 0 0 0-6.3 2.254 10.095 10.095 0 0 0-3.4 6M12 2c2.366 0 4.64.84 6.45 2.448 1.81 1.61 3 3.872 3.4 6.452"/><path d="m5 19.5 7-4 7 4"/><path d="m5 4.5 7 4 7-4"/></svg>,
    },
    {
      id: "cricket",
      name: "ক্রিকেট",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-7l-4 4-4-4"/><path d="M16 2c-2.1 5.7-7.5 8.9-13.3 7.1 1.6 4.3 5.7 7.2 10.3 7.2 2.5 0 4.9-.8 6.8-2.2"/><path d="M20 2 12 10"/></svg>,
    },
    {
      id: "tennis",
      name: "টেনিস",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M15.2 12a3.3 3.3 0 0 1 1-2.2 3.3 3.3 0 0 0 0-4.6 3.3 3.3 0 0 0-4.6 0 3.3 3.3 0 0 1-2.2 1 3.3 3.3 0 0 1-2.2-1 3.3 3.3 0 0 0-4.6 0 3.3 3.3 0 0 0 0 4.6 3.3 3.3 0 0 1 1 2.2 3.3 3.3 0 0 1-1 2.2 3.3 3.3 0 0 0 0 4.6 3.3 3.3 0 0 0 4.6 0 3.3 3.3 0 0 1 2.2-1 3.3 3.3 0 0 1 2.2 1 3.3 3.3 0 0 0 4.6 0 3.3 3.3 0 0 0 0-4.6 3.3 3.3 0 0 1-1-2.2z"/></svg>,
    },
    {
      id: "basketball",
      name: "বাস্কেটবল",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93C6.62 2.5 9.16 1 12 1c3.35 0 6.47 1.46 8.66 4.57"/><path d="M13.5 6.5a25.59 25.59 0 0 0-1.79-4.93"/><path d="M8.5 6.5A25.59 25.59 0 0 1 10.29 1"/><path d="M18.2 18.2a25.81 25.81 0 0 1-1.79-12.2"/><path d="M18.2 18.2C15.5 20.5 13 21.5 10 21.5c-2.25 0-4.34-.8-6.33-2.5"/><path d="M10.5 18.2a25.59 25.59 0 0 1-1.8 4.3"/><path d="M5.8 13.5A25.59 25.59 0 0 0 1.5 11.8"/></svg>,
    },
    {
      id: "volleyball",
      name: "ভলিবল",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 12c-2 0-4.8-.5-4.8-2.5s2.8-5 4.8-5c3.1 0 4.8 1.5 4.8 2.5 0 1.5-3 2-4.8 2"/><path d="M12 12c0 2.5 1.8 4 3.5 4 2.2 0 3-1.5 3.5-3.5.5-2.5-1-7.5-3-12.5"/><path d="M12 12c-2.5 2 1 4.5-2.5 8.5-1.5 2-2 2.5-4 3"/></svg>,
    },
    {
      id: "rugby",
      name: "রাগবি",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 6c.5 0 .7.3.9.5.13.16.4.38.9.5.16 0 .26-.13.41-.27C9.5 6.44 10 6 12 6s2.5.44 2.81.73c.15.14.25.27.41.27.5-.13.76-.34.9-.5C16.32 6.28 16.5 6 17 6c1 0 1 1 1 1s-1 1.6-1 4c0 1.1.6 2.3 1.2 3.2-1 1.8-1.8 2-4.2 2-2 0-2.5.44-2.81.73-.15.14-.25.27-.41.27s-.26-.13-.41-.27C9.5 16.44 9 16 7 16c-2.4 0-3.2-.2-4.2-2C3.4 13.3 4 12.1 4 11c0-2.4-1-4-1-4s0-1 1-1c.5 0 .7.3.9.5.13.16.4.38.9.5.16 0 .26-.13.41-.27C6.5 6.44 7 6 9 6"/></svg>,
    },
  ];

  const popularLeagues = [
    "প্রিমিয়ার লীগ",
    "লা লিগা",
    "বুন্দেসলিগা",
    "সেরি আ",
    "লিগ ১",
    "চ্যাম্পিয়ন্স লীগ",
    "ইউরোপা লীগ",
    "ওয়ার্ল্ড কাপ",
    "এশিয়া কাপ",
  ];
  
  // ডামি ম্যাচ ডেটা জনপ্রিয় বেট বাটনের জন্য
  const dummyMatches = {
    barca: {
      id: 999,
      homeTeam: "বার্সেলোনা",
      awayTeam: "রিয়াল মাদ্রিদ",
      league: "লা লিগা",
      time: "21:45",
      date: "আজ",
      isLive: false,
      odds: {
        home: 2.50,
        draw: 3.25,
        away: 2.75
      }
    },
    bothTeams: {
      id: 998,
      homeTeam: "ম্যানচেস্টার সিটি",
      awayTeam: "লিভারপুল",
      league: "প্রিমিয়ার লীগ",
      time: "20:30",
      date: "আজ",
      isLive: false,
      odds: {
        home: 1.95,
        draw: 3.50,
        away: 2.85
      }
    },
    overGoals: {
      id: 997,
      homeTeam: "আর্সেনাল",
      awayTeam: "চেলসি",
      league: "প্রিমিয়ার লীগ",
      time: "22:00",
      date: "আজ",
      isLive: false,
      odds: {
        home: 1.75,
        draw: 3.40,
        away: 2.90
      }
    }
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
          {/* স্পোর্টস বার */}
          <div className="overflow-x-auto pb-4 custom-scrollbar">
            <div className="flex space-x-4 mb-6">
              {sports.map((sport) => (
                <button
                  key={sport.id}
                  className={`flex flex-col items-center px-4 py-3 rounded-lg transition-all ${
                    activeSport === sport.name
                      ? "bg-accent text-secondary"
                      : "bg-card text-white hover:bg-secondary"
                  }`}
                  onClick={() => setActiveSport(sport.name)}
                >
                  <span className="text-current mb-1">{sport.icon}</span>
                  <span className="text-sm font-medium">{sport.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* সাইডবার লীগ ও বেটিং অপশন */}
            <div className="md:col-span-1">
              <div className="bg-card rounded-lg overflow-hidden shadow mb-4">
                <div className="bg-secondary p-3">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <Star className="h-4 w-4 text-accent" />
                    জনপ্রিয় লীগ
                  </h3>
                </div>
                <div className="p-2">
                  {popularLeagues.map((league, index) => (
                    <button 
                      key={index} 
                      className="w-full text-left p-2 text-sm text-white hover:bg-secondary rounded flex justify-between items-center"
                      onClick={() => window.alert(`${league} লীগ সিলেক্ট করা হয়েছে`)}
                    >
                      {league}
                      <ChevronRight className="h-4 w-4 text-accent" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-lg overflow-hidden shadow">
                <div className="bg-secondary p-3">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-accent" />
                    জনপ্রিয় বেট
                  </h3>
                </div>
                <div className="p-3 space-y-3">
                  <div className="bg-secondary/50 p-3 rounded">
                    <p className="text-white text-sm mb-2">বার্সেলোনা ২+ গোলে জিতবে</p>
                    <div className="flex justify-between items-center">
                      <span className="text-accent font-semibold">@2.50</span>
                      <BetNowButton
                        match={dummyMatches.barca}
                        betType="home"
                        onBetSelect={addBetSelection}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-secondary/50 p-3 rounded">
                    <p className="text-white text-sm mb-2">উভয় দল গোল করবে</p>
                    <div className="flex justify-between items-center">
                      <span className="text-accent font-semibold">@1.95</span>
                      <BetNowButton
                        match={dummyMatches.bothTeams}
                        betType="home"
                        onBetSelect={addBetSelection}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-secondary/50 p-3 rounded">
                    <p className="text-white text-sm mb-2">২.৫+ গোল হবে</p>
                    <div className="flex justify-between items-center">
                      <span className="text-accent font-semibold">@1.75</span>
                      <BetNowButton
                        match={dummyMatches.overGoals}
                        betType="home"
                        onBetSelect={addBetSelection}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* মূল ম্যাচ কন্টেন্ট */}
            <div className="md:col-span-3">
              <Tabs defaultValue="upcoming" className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <TabsList className="grid w-full max-w-xs grid-cols-3">
                    <TabsTrigger 
                      value="live" 
                      onClick={() => setActiveTab("live")}
                      className="data-[state=active]:bg-accent data-[state=active]:text-secondary"
                    >
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        লাইভ ({liveMatches.length})
                      </span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="upcoming" 
                      onClick={() => setActiveTab("upcoming")}
                      className="data-[state=active]:bg-accent data-[state=active]:text-secondary"
                    >
                      আসন্ন
                    </TabsTrigger>
                    <TabsTrigger 
                      value="all" 
                      onClick={() => setActiveTab("all")}
                      className="data-[state=active]:bg-accent data-[state=active]:text-secondary"
                    >
                      সব
                    </TabsTrigger>
                  </TabsList>
                  <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-background">
                    <ArrowRightLeft className="h-4 w-4 mr-2" />
                    ভিউ চেঞ্জ
                  </Button>
                </div>

                <TabsContent value="live">
                  <div className="space-y-3">
                    {loading ? (
                      <>
                        {[...Array(3)].map((_, index) => (
                          <div key={index} className="bg-card rounded-lg overflow-hidden shadow animate-pulse p-4">
                            <div className="h-6 bg-muted rounded w-1/3 mb-3"></div>
                            <div className="h-8 bg-muted rounded w-full mb-3"></div>
                            <div className="h-6 bg-muted rounded w-2/3"></div>
                          </div>
                        ))}
                      </>
                    ) : liveMatches.length === 0 ? (
                      <div className="bg-card rounded-lg p-8 text-center">
                        <p className="text-muted-foreground">বর্তমানে কোন লাইভ ম্যাচ নেই।</p>
                      </div>
                    ) : (
                      liveMatches.map((match) => (
                        <div key={match.id} className="bg-card rounded-lg overflow-hidden shadow">
                          <div className="bg-secondary/30 p-3 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-[#ff4757] text-white">লাইভ</Badge>
                              <span className="text-accent text-sm">{match.league}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-white text-sm font-bold">{match.time}</span>
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex-1">
                                <p className="text-white font-medium">{match.homeTeam}</p>
                              </div>
                              <div className="flex items-center gap-3 mx-4">
                                <span className="text-xl font-bold text-white">{match.score?.home}</span>
                                <span className="text-muted-foreground">-</span>
                                <span className="text-xl font-bold text-white">{match.score?.away}</span>
                              </div>
                              <div className="flex-1 text-right">
                                <p className="text-white font-medium">{match.awayTeam}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-3 mt-4">
                              <BetButton
                                match={match}
                                betType="home"
                                onBetSelect={addBetSelection}
                              />
                              <BetButton
                                match={match}
                                betType="draw"
                                onBetSelect={addBetSelection}
                              />
                              <BetButton
                                match={match}
                                betType="away"
                                onBetSelect={addBetSelection}
                              />
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-secondary">
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-muted-foreground">বল দখল</span>
                                <div className="flex gap-2">
                                  <span className="text-white">{match.statistics?.possession.home}%</span>
                                  <span className="text-white">{match.statistics?.possession.away}%</span>
                                </div>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">শট</span>
                                <div className="flex gap-2">
                                  <span className="text-white">{match.statistics?.shots.home}</span>
                                  <span className="text-white">{match.statistics?.shots.away}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4 flex justify-between items-center">
                              <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
                                বিস্তারিত দেখুন
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                              
                              <Button variant="default" size="sm" className="bg-accent hover:bg-accent/90 text-white">
                                বেট করুন
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="upcoming">
                  <div className="space-y-3">
                    {loading ? (
                      <>
                        {[...Array(3)].map((_, index) => (
                          <div key={index} className="bg-card rounded-lg overflow-hidden shadow animate-pulse p-4">
                            <div className="h-6 bg-muted rounded w-1/3 mb-3"></div>
                            <div className="h-8 bg-muted rounded w-full mb-3"></div>
                            <div className="h-6 bg-muted rounded w-2/3"></div>
                          </div>
                        ))}
                      </>
                    ) : upcomingMatches.length === 0 ? (
                      <div className="bg-card rounded-lg p-8 text-center">
                        <p className="text-muted-foreground">কোন আসন্ন ম্যাচ নেই।</p>
                      </div>
                    ) : (
                      upcomingMatches.map((match) => (
                        <div key={match.id} className="bg-card rounded-lg overflow-hidden shadow">
                          <div className="bg-secondary/30 p-3 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-accent text-sm">{match.league}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Timer className="h-4 w-4 text-accent" />
                              <span className="text-white text-sm">{match.date} • {match.time}</span>
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex-1">
                                <p className="text-white font-medium">{match.homeTeam}</p>
                              </div>
                              <div className="flex-1 text-right">
                                <p className="text-white font-medium">{match.awayTeam}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-3 mt-4">
                              <BetButton
                                match={match}
                                betType="home"
                                onBetSelect={addBetSelection}
                              />
                              <BetButton
                                match={match}
                                betType="draw"
                                onBetSelect={addBetSelection}
                              />
                              <BetButton
                                match={match}
                                betType="away"
                                onBetSelect={addBetSelection}
                              />
                            </div>
                            
                            <div className="mt-4 flex justify-between items-center">
                              <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
                                বিস্তারিত দেখুন
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                              
                              <Button variant="default" size="sm" className="bg-accent hover:bg-accent/90 text-white">
                                বেট করুন
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="all">
                  <div className="space-y-3">
                    {loading ? (
                      <>
                        {[...Array(3)].map((_, index) => (
                          <div key={index} className="bg-card rounded-lg overflow-hidden shadow animate-pulse p-4">
                            <div className="h-6 bg-muted rounded w-1/3 mb-3"></div>
                            <div className="h-8 bg-muted rounded w-full mb-3"></div>
                            <div className="h-6 bg-muted rounded w-2/3"></div>
                          </div>
                        ))}
                      </>
                    ) : (
                      matches.map((match) => (
                        <div key={match.id} className="bg-card rounded-lg overflow-hidden shadow">
                          <div className="bg-secondary/30 p-3 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              {match.isLive && <Badge className="bg-[#ff4757] text-white">লাইভ</Badge>}
                              <span className="text-accent text-sm">{match.league}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {!match.isLive && <Timer className="h-4 w-4 text-accent" />}
                              <span className="text-white text-sm">{match.date} • {match.time}</span>
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex-1">
                                <p className="text-white font-medium">{match.homeTeam}</p>
                              </div>
                              {match.isLive && (
                                <div className="flex items-center gap-3 mx-4">
                                  <span className="text-xl font-bold text-white">{match.score?.home}</span>
                                  <span className="text-muted-foreground">-</span>
                                  <span className="text-xl font-bold text-white">{match.score?.away}</span>
                                </div>
                              )}
                              <div className="flex-1 text-right">
                                <p className="text-white font-medium">{match.awayTeam}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-3 mt-4">
                              <BetButton
                                match={match}
                                betType="home"
                                onBetSelect={addBetSelection}
                              />
                              <BetButton
                                match={match}
                                betType="draw"
                                onBetSelect={addBetSelection}
                              />
                              <BetButton
                                match={match}
                                betType="away"
                                onBetSelect={addBetSelection}
                              />
                            </div>
                            
                            {match.isLive ? (
                              <div className="mt-4 pt-4 border-t border-secondary">
                                <div className="flex justify-between text-sm mb-2">
                                  <span className="text-muted-foreground">বল দখল</span>
                                  <div className="flex gap-2">
                                    <span className="text-white">{match.statistics?.possession.home}%</span>
                                    <span className="text-white">{match.statistics?.possession.away}%</span>
                                  </div>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">শট</span>
                                  <div className="flex gap-2">
                                    <span className="text-white">{match.statistics?.shots.home}</span>
                                    <span className="text-white">{match.statistics?.shots.away}</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="mt-4 flex justify-between items-center">
                                <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
                                  বিস্তারিত দেখুন
                                  <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                                
                                <Button variant="default" size="sm" className="bg-accent hover:bg-accent/90 text-white">
                                  বেট করুন
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="mt-12 mb-8">
            <div className="bg-card p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white font-header mb-4">স্পোর্টস বেটিং সম্পর্কে</h3>
              <p className="text-muted-foreground mb-4">
                আমাদের TK999 স্পোর্টস বেটিং প্ল্যাটফর্মে আপনি সারা বিশ্বের বিভিন্ন স্পোর্টস ইভেন্টে বাজি ধরতে পারেন। আমরা ফুটবল, ক্রিকেট, টেনিস, বাস্কেটবল, ভলিবল, রাগবি সহ প্রায় সমস্ত জনপ্রিয় খেলাধুলায় বাজি ধরার সুযোগ দিয়ে থাকি।
              </p>
              <p className="text-muted-foreground">
                আমাদের প্ল্যাটফর্মে আপনি বিভিন্ন ধরনের বেট যেমন - ম্যাচ জিতবে, টোটাল গোল/রান, হ্যান্ডিক্যাপ, ডাবল চান্স, কর্নার, কার্ড সংখ্যা ইত্যাদি অসংখ্য বিকল্পে বাজি ধরতে পারেন। লাইভ বেটিং সুবিধার মাধ্যমে ম্যাচ চলাকালীন যেকোনো সময় আকর্ষণীয় অডসে বাজি ধরুন।
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}