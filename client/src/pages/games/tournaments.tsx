import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileMenu from "@/components/layout/mobile-menu";
import MobileNav from "@/components/layout/mobile-nav";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Trophy, 
  Calendar, 
  Clock, 
  Users, 
  ChevronDown,
  DollarSign,
  Gamepad2,
  Filter,
  Crown,
  Medal,
  Mic,
  Info,
  Layers,
  ShieldCheck,
  GiftIcon
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

// টুর্নামেন্ট ডেটার জন্য ইন্টারফেস
interface Tournament {
  id: number;
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  status: "upcoming" | "ongoing" | "completed";
  prizePool: string;
  entryFee: string;
  participants: {
    current: number;
    max: number;
  };
  description?: string;
  rules?: string[];
  isSpecial?: boolean;
  winnerRewards?: {
    position: string;
    reward: string;
  }[];
}

export default function TournamentsPage() {
  const { user, logoutMutation } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // টুর্নামেন্ট ডেটা (বাস্তবিক অ্যাপ্লিকেশনে এগুলি API থেকে লোড করা উচিত)
  const tournaments: Tournament[] = [
    {
      id: 1,
      title: "গ্র্যান্ড স্লট চ্যাম্পিয়নশিপ",
      type: "স্লট",
      startDate: "২০২৫-০৫-১০",
      endDate: "২০২৫-০৫-১৫",
      registrationDeadline: "২০২৫-০৫-০৯",
      status: "upcoming",
      prizePool: "৳১,০০০,০০০",
      entryFee: "৳৫০০",
      participants: {
        current: 156,
        max: 500
      },
      description: "সবচেয়ে বড় মাসিক স্লট টুর্নামেন্ট, যেখানে স্পিন এবং জিতুন! সর্বোচ্চ পয়েন্ট অর্জনকারী খেলোয়াড়রা জিতবে।",
      rules: [
        "টুর্নামেন্ট স্লট গেমগুলির ১০০+ স্পিন করতে হবে",
        "ন্যূনতম বাজি ৳৫০ প্রতি স্পিন",
        "স্কোরিং: প্রতি ৳১০০ বাজির জন্য ১ পয়েন্ট, প্রতি জয়ের জন্য ১ পয়েন্ট, বড় জয়ের জন্য (১০x+) বোনাস পয়েন্ট"
      ],
      winnerRewards: [
        { position: "১ম", reward: "৳৩০০,০০০" },
        { position: "২য়", reward: "৳১৫০,০০০" },
        { position: "৩য়", reward: "৳১০০,০০০" },
        { position: "৪র্থ-১০ম", reward: "৳৫০,০০০" }
      ]
    },
    {
      id: 2,
      title: "ভিআইপি পোকার টুর্নামেন্ট",
      type: "পোকার",
      startDate: "২০২৫-০৫-১২",
      endDate: "২০২৫-০৫-১৩",
      registrationDeadline: "২০২৫-০৫-১১",
      status: "upcoming",
      prizePool: "৳৫০০,০০০",
      entryFee: "৳১,০০০",
      participants: {
        current: 42,
        max: 100
      },
      description: "এক্সক্লুসিভ টেক্সাস হোল্ডেম পোকার টুর্নামেন্ট, সাবধানে খেলে পকেট এইস দিয়ে সবাইকে হারান।",
      isSpecial: true,
      rules: [
        "নো-লিমিট টেক্সাস হোল্ডেম ফরম্যাট",
        "স্ট্যান্ডার্ড পোকার রুলস অনুসরণ করা হবে",
        "বাইন্ড স্ট্রাকচার প্রতি ১৫ মিনিটে বাড়বে",
        "ফাইনাল টেবিল পর্যন্ত খেলা হবে"
      ],
      winnerRewards: [
        { position: "১ম", reward: "৳২০০,০০০" },
        { position: "২য়", reward: "৳১০০,০০০" },
        { position: "৩য়", reward: "৳৭৫,০০০" },
        { position: "৪র্থ-৬ষ্ঠ", reward: "৳২৫,০০০" },
        { position: "৭ম-১০ম", reward: "৳১০,০০০" }
      ]
    },
    {
      id: 3,
      title: "ফিফা ওয়ার্ল্ড কাপ স্পেশাল",
      type: "স্পোর্টস",
      startDate: "২০২৫-০৫-২০",
      endDate: "২০২৫-০৬-২০",
      registrationDeadline: "২০২৫-০৫-১৯",
      status: "upcoming",
      prizePool: "৳২,০০০,০০০",
      entryFee: "৳২০০",
      participants: {
        current: 378,
        max: 2000
      },
      description: "একমাসব্যাপী ফিফা ওয়ার্ল্ড কাপ প্রেডিকশন টুর্নামেন্ট, আপনার প্রেডিকশন দিয়ে বিশাল পুরস্কার জিতুন।",
      isSpecial: true,
      rules: [
        "প্রতি ম্যাচের আগে প্রেডিকশন জমা দিতে হবে",
        "সঠিক স্কোর প্রেডিকশন: ১০ পয়েন্ট",
        "সঠিক রেজাল্ট প্রেডিকশন (জয়/হার/ড্র): ৫ পয়েন্ট",
        "সঠিক গোলস্কোরার: ৩ পয়েন্ট",
        "নকআউট স্টেজে প্রেডিকশন ডাবল পয়েন্ট"
      ],
      winnerRewards: [
        { position: "১ম", reward: "৳৫০০,০০০" },
        { position: "২য়", reward: "৳৩০০,০০০" },
        { position: "৩য়", reward: "৳২০০,০০০" },
        { position: "৪র্থ-১০ম", reward: "৳১০০,০০০" }
      ]
    },
    {
      id: 4,
      title: "বিগ ক্র্যাশ টুর্নামেন্ট",
      type: "ক্র্যাশ গেমস",
      startDate: "২০২৫-০৫-১৮",
      endDate: "২০২৫-০৫-২০",
      registrationDeadline: "২০২৫-০৫-১৭",
      status: "upcoming",
      prizePool: "৳৮০০,০০০",
      entryFee: "৳৫০০",
      participants: {
        current: 89,
        max: 200
      },
      description: "বিভিন্ন ক্র্যাশ গেম যেমন এভিয়েটর, স্পেসমেন, ডাইস এবং লিমবোতে প্রতিযোগিতা করুন।",
      rules: [
        "ন্যূনতম ১০০টি ক্র্যাশ গেম রাউন্ড খেলতে হবে",
        "ন্যূনতম বাজি ৳১০০ প্রতি রাউন্ড",
        "সর্বাধিক x মাল্টিপ্লায়ার বেসিস অনুযায়ী লিডারবোর্ড নির্ধারিত হবে",
        "শুধুমাত্র সফল ক্যাশআউট গণনা করা হবে"
      ],
      winnerRewards: [
        { position: "১ম", reward: "৳২৫০,০০০" },
        { position: "২য়", reward: "৳১৫০,০০০" },
        { position: "৩য়", reward: "৳১০০,০০০" },
        { position: "৪র্থ-১০ম", reward: "৳৩০,০০০" }
      ]
    },
    {
      id: 5,
      title: "ডায়মন্ড VIP এক্সক্লুসিভ",
      type: "ক্যাসিনো",
      startDate: "২০২৫-০৫-২৫",
      endDate: "২০২৫-০৫-২৬",
      registrationDeadline: "২০২৫-০৫-২৪",
      status: "upcoming",
      prizePool: "৳১,৫০০,০০০",
      entryFee: "শুধুমাত্র আমন্ত্রণে",
      participants: {
        current: 24,
        max: 50
      },
      description: "শুধুমাত্র ডায়মন্ড VIP সদস্যদের জন্য এক্সক্লুসিভ টুর্নামেন্ট। উচ্চ-রোলারদের জন্য বিশেষ ইভেন্ট।",
      isSpecial: true,
      rules: [
        "শুধুমাত্র আমন্ত্রিত ডায়মন্ড VIP সদস্যরা অংশগ্রহণ করতে পারবেন",
        "উচ্চ বাজি সীমা",
        "লাইভ ক্যাসিনো গেমে সর্বোচ্চ টার্নওভার পয়েন্ট অর্জন করুন",
        "৪৮ ঘন্টার মধ্যে ন্যূনতম ১০ ঘন্টা খেলতে হবে"
      ],
      winnerRewards: [
        { position: "১ম", reward: "৳৫০০,০০০" },
        { position: "২য়", reward: "৳৩০০,০০০" },
        { position: "৩য়", reward: "৳২০০,০০০" },
        { position: "৪র্থ-১০ম", reward: "৳৫০,০০০" }
      ]
    },
    {
      id: 6,
      title: "ব্ল্যাকজ্যাক মাস্টারস",
      type: "ক্যাসিনো",
      startDate: "২০২৫-০৫-২২",
      endDate: "২০২৫-০৫-২৩",
      registrationDeadline: "২০২৫-০৫-২১",
      status: "upcoming",
      prizePool: "৳৬০০,০০০",
      entryFee: "৳৮০০",
      participants: {
        current: 56,
        max: 100
      },
      description: "ব্ল্যাকজ্যাক দক্ষতায় আপনার প্রতিভা দেখান এবং সেরা ব্ল্যাকজ্যাক খেলোয়াড় হিসেবে তাজ পরুন।",
      rules: [
        "২১ এর কাছাকাছি পৌঁছাতে কৌশল ব্যবহার করুন",
        "সবচেয়ে বেশি হাত জেতা এবং উচ্চতম ROI গণনা করা হবে",
        "ন্যূনতম ১০০টি হাত খেলতে হবে",
        "বাজি: ৳২০০-৳২০০০ প্রতি হাত"
      ],
      winnerRewards: [
        { position: "১ম", reward: "৳২০০,০০০" },
        { position: "২য়", reward: "৳১০০,০০০" },
        { position: "৩য়", reward: "৳৭৫,০০০" },
        { position: "৪র্থ-১০ম", reward: "৳২৫,০০০" }
      ]
    },
    {
      id: 7,
      title: "লাইভ রুলেট র‍্যাঙ্কিং",
      type: "ক্যাসিনো",
      startDate: "২০২৫-০৫-১৪",
      endDate: "২০২৫-০৫-১৬",
      registrationDeadline: "২০২৫-০৫-১৩",
      status: "upcoming",
      prizePool: "৳৪০০,০০০",
      entryFee: "৳৩০০",
      participants: {
        current: 67,
        max: 150
      },
      description: "লাইভ রুলেট টেবিলে আপনার ভাগ্য পরীক্ষা করুন। সঠিক সংখ্যা অনুমান করে জিতুন।",
      rules: [
        "রুলেট স্ট্র্যাটেজি দিয়ে সর্বাধিক পয়েন্ট অর্জন করুন",
        "ন্যূনতম ৫০টি স্পিন খেলতে হবে",
        "স্পিন প্রতি ন্যূনতম বাজি ৳১০০",
        "সরাসরি লাইভ রুলেট টেবিলে অংশগ্রহণ করতে হবে"
      ],
      winnerRewards: [
        { position: "১ম", reward: "৳১৫০,০০০" },
        { position: "২য়", reward: "৳১০০,০০০" },
        { position: "৩য়", reward: "৳৫০,০০০" },
        { position: "৪র্থ-১০ম", reward: "৳১৫,০০০" }
      ]
    },
    {
      id: 8,
      title: "ক্রিকেট আইপিএল স্পেশাল",
      type: "স্পোর্টস",
      startDate: "২০২৫-০৫-০৮",
      endDate: "২০২৫-০৫-৩০",
      registrationDeadline: "২০২৫-০৫-০৭",
      status: "upcoming",
      prizePool: "৳১,২০০,০০০",
      entryFee: "৳৩০০",
      participants: {
        current: 245,
        max: 1000
      },
      description: "IPL টুর্নামেন্টের সময় ক্রিকেট বেটিং এর মজা নিন, বিজয়ী দল এবং টপ পারফর্মারদের পূর্বাভাস দিন।",
      rules: [
        "প্রতি ম্যাচে বাজি ধরতে হবে",
        "ম্যাচ উইনার, টপ ব্যাটসম্যান, টপ বোলার, ম্যান অফ দ্য ম্যাচ পূর্বাভাস করতে হবে",
        "সঠিক পূর্বাভাসের জন্য পয়েন্ট অর্জন করুন",
        "সর্বোচ্চ পয়েন্ট অর্জনকারীরা পুরস্কার জিতবেন"
      ],
      winnerRewards: [
        { position: "১ম", reward: "৳৩০০,০০০" },
        { position: "২য়", reward: "৳২০০,০০০" },
        { position: "৩য়", reward: "৳১০০,০০০" },
        { position: "৪র্থ-১০ম", reward: "৳৫০,০০০" }
      ]
    }
  ];

  // টুর্নামেন্ট টাইপ গুলো
  const tournamentTypes = [...new Set(tournaments.map(t => t.type))];

  // টুর্নামেন্ট ফিল্টারিং ফাংশন
  const filterTournaments = (tournaments: Tournament[], status: string) => {
    return tournaments.filter(tournament => {
      // সার্চ কোয়েরি ফিল্টার
      const matchesSearch = 
        tournament.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tournament.type.toLowerCase().includes(searchQuery.toLowerCase());
      
      // টাইপ ফিল্টার
      const matchesType = !filterType || tournament.type === filterType;
      
      // স্ট্যাটাস ফিল্টার
      const matchesStatus = tournament.status === status;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isLoggedIn={!!user} onLogout={handleLogout} />
      <MobileMenu />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">টুর্নামেন্ট</h1>
            <p className="text-muted-foreground">
              আমাদের সাপ্তাহিক এবং মাসিক টুর্নামেন্টে যোগ দিয়ে বড় পুরস্কার জিতুন
            </p>
          </div>
          
          {/* সার্চ এবং ফিল্টার সেকশন */}
          <div className="w-full md:w-auto mt-4 md:mt-0">
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="টুর্নামেন্ট খুঁজুন..."
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
                <h3 className="text-sm font-medium mb-2">টুর্নামেন্ট টাইপ:</h3>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={filterType === null ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setFilterType(null)}
                  >
                    সবগুলো
                  </Button>
                  {tournamentTypes.map(type => (
                    <Button
                      key={type}
                      variant={filterType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterType(type)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* টুর্নামেন্ট ইনফো কার্ডস */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <Card className="bg-card border-accent/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-accent/10 rounded-full p-3">
                  <Trophy className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">বিশাল প্রাইজ পুল</h3>
                  <p className="text-xs text-muted-foreground">দশ লক্ষ+ টাকার পুরস্কার</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-accent/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-accent/10 rounded-full p-3">
                  <Gamepad2 className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">সকল গেম ক্যাটেগরি</h3>
                  <p className="text-xs text-muted-foreground">স্লট, পোকার, স্পোর্টস ও আরও</p>
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
                  <h3 className="font-semibold">লাইভ লিডারবোর্ড</h3>
                  <p className="text-xs text-muted-foreground">রিয়েল-টাইম র‍্যাঙ্কিং</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-accent/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-accent/10 rounded-full p-3">
                  <Medal className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">বিশেষ পুরস্কার</h3>
                  <p className="text-xs text-muted-foreground">টপ প্লেয়ারদের জন্য এক্সট্রা</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* ট্যাব সেকশন */}
        <Tabs defaultValue="upcoming" className="mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="upcoming" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span>আপকামিং</span>
            </TabsTrigger>
            <TabsTrigger value="ongoing" className="gap-2">
              <Clock className="h-4 w-4" />
              <span>চলমান</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-2">
              <Trophy className="h-4 w-4" />
              <span>সম্পন্ন</span>
            </TabsTrigger>
          </TabsList>
          
          {/* আপকামিং টুর্নামেন্ট ট্যাব */}
          <TabsContent value="upcoming" className="mt-6">
            <div className="space-y-6">
              {filterTournaments(tournaments, "upcoming").length > 0 ? 
                filterTournaments(tournaments, "upcoming").map(tournament => (
                  <TournamentCard key={tournament.id} tournament={tournament} />
                )) : (
                  <div className="text-center py-10">
                    <Calendar className="h-10 w-10 mx-auto text-muted-foreground opacity-20 mb-4" />
                    <h3 className="font-medium mb-1">কোন আপকামিং টুর্নামেন্ট পাওয়া যায়নি</h3>
                    <p className="text-sm text-muted-foreground">
                      আপনার অনুসন্ধান পরিবর্তন করুন বা পরে আবার চেক করুন
                    </p>
                  </div>
                )
              }
            </div>
          </TabsContent>
          
          {/* চলমান টুর্নামেন্ট ট্যাব */}
          <TabsContent value="ongoing" className="mt-6">
            <div className="space-y-6">
              {filterTournaments(tournaments, "ongoing").length > 0 ? 
                filterTournaments(tournaments, "ongoing").map(tournament => (
                  <TournamentCard key={tournament.id} tournament={tournament} />
                )) : (
                  <div className="text-center py-10">
                    <Clock className="h-10 w-10 mx-auto text-muted-foreground opacity-20 mb-4" />
                    <h3 className="font-medium mb-1">বর্তমানে কোন টুর্নামেন্ট চলছে না</h3>
                    <p className="text-sm text-muted-foreground">
                      আপকামিং টুর্নামেন্টগুলো দেখুন এবং রেজিস্ট্রেশন করুন
                    </p>
                  </div>
                )
              }
            </div>
          </TabsContent>
          
          {/* সম্পন্ন টুর্নামেন্ট ট্যাব */}
          <TabsContent value="completed" className="mt-6">
            <div className="space-y-6">
              {filterTournaments(tournaments, "completed").length > 0 ? 
                filterTournaments(tournaments, "completed").map(tournament => (
                  <TournamentCard key={tournament.id} tournament={tournament} isCompleted />
                )) : (
                  <div className="text-center py-10">
                    <Trophy className="h-10 w-10 mx-auto text-muted-foreground opacity-20 mb-4" />
                    <h3 className="font-medium mb-1">কোন সম্পন্ন টুর্নামেন্ট পাওয়া যায়নি</h3>
                    <p className="text-sm text-muted-foreground">
                      আপনার অনুসন্ধান পরিবর্তন করুন বা পরে আবার চেক করুন
                    </p>
                  </div>
                )
              }
            </div>
          </TabsContent>
        </Tabs>
        
        {/* ফিচার্ড টুর্নামেন্ট */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-6">সুপার টুর্নামেন্ট</h2>
          
          <div className="relative rounded-lg overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10"></div>
            <div className="absolute inset-y-0 left-0 z-20 flex flex-col justify-center px-6 md:px-10 max-w-lg">
              <Badge className="bg-accent mb-2 w-fit">মেগা ইভেন্ট</Badge>
              <h3 className="text-xl md:text-3xl font-bold text-white mb-2">ফিফা ওয়ার্ল্ড কাপ প্রেডিকশন</h3>
              <p className="text-white/80 text-sm md:text-base mb-4">
                একমাসব্যাপী ফিফা ওয়ার্ল্ড কাপ প্রেডিকশন টুর্নামেন্ট। প্রতিটি ম্যাচের ফলাফল অনুমান করুন এবং ২০ লাখ টাকার প্রাইজ পুল থেকে পুরস্কার জিতুন।
              </p>
              <div className="flex flex-col xs:flex-row gap-3">
                <Button className="bg-accent text-white hover:bg-accent/90">
                  রেজিস্ট্রেশন করুন
                </Button>
                <Button variant="outline" className="bg-white/10 border-white/20 text-white">
                  বিস্তারিত দেখুন
                </Button>
              </div>
            </div>
            <div className="h-64 md:h-80 w-full bg-gradient-to-r from-accent/30 to-black/50"></div>
          </div>
        </section>
        
        {/* টুর্নামেন্ট উইনারস */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">টুর্নামেন্ট চ্যাম্পিয়নস</h2>
            <Button variant="link" className="text-accent">
              সব দেখুন <ChevronDown className="h-4 w-4 ml-1 rotate-[-90deg]" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { name: "Player***123", tournament: "স্লট চ্যাম্পিয়নশিপ", prize: "৳৩০০,০০০", position: "১ম", date: "২০২৫-০৪-৩০" },
              { name: "VIP***789", tournament: "পোকার টুর্নামেন্ট", prize: "৳২০০,০০০", position: "১ম", date: "২০২৫-০৪-২৫" },
              { name: "Winner***45", tournament: "রুলেট মাস্টারস", prize: "৳১৫০,০০০", position: "১ম", date: "২০২৫-০৪-২০" },
              { name: "Lucky***007", tournament: "ব্ল্যাকজ্যাক কিং", prize: "৳২০০,০০০", position: "১ম", date: "২০২৫-০৪-১৫" }
            ].map((winner, index) => (
              <Card key={index} className="bg-card border-accent/20 overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Medal className="h-5 w-5 text-yellow-500" />
                      <CardTitle className="text-base">{winner.position} স্থান</CardTitle>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {winner.date}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <h3 className="font-semibold mb-1">{winner.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{winner.tournament}</p>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-accent" />
                    <span className="font-semibold text-accent">{winner.prize}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        {/* কিভাবে টুর্নামেন্টে অংশগ্রহণ করবেন */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-6">কিভাবে টুর্নামেন্টে অংশগ্রহণ করবেন</h2>
          <Card className="bg-card border-accent/20">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-4">
                  <div className="bg-accent/10 rounded-full p-3 w-14 h-14 flex items-center justify-center">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold">১. রেজিস্ট্রেশন করুন</h3>
                  <p className="text-sm text-muted-foreground">
                    আপনার পছন্দের টুর্নামেন্টে রেজিস্ট্রেশন করুন এবং যদি প্রয়োজন হয় এন্ট্রি ফি প্রদান করুন।
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-accent/10 rounded-full p-3 w-14 h-14 flex items-center justify-center">
                    <Layers className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold">২. নিয়ম বুঝুন</h3>
                  <p className="text-sm text-muted-foreground">
                    টুর্নামেন্টের নিয়ম ও শর্তাবলী, স্কোরিং সিস্টেম এবং পুরস্কার কাঠামো বুঝুন।
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-accent/10 rounded-full p-3 w-14 h-14 flex items-center justify-center">
                    <Gamepad2 className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold">৩. খেলুন এবং পয়েন্ট অর্জন করুন</h3>
                  <p className="text-sm text-muted-foreground">
                    টুর্নামেন্টের নির্ধারিত সময়ে অংশগ্রহণ করুন এবং লিডারবোর্ডে উঠার জন্য পয়েন্ট অর্জন করুন।
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-accent/10 rounded-full p-3 w-14 h-14 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold">৪. পুরস্কার জিতুন</h3>
                  <p className="text-sm text-muted-foreground">
                    টুর্নামেন্ট শেষে উচ্চ পজিশন অর্জন করে আকর্ষণীয় পুরস্কার জিতুন।
                  </p>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-accent/10 rounded-lg">
                <div className="flex gap-4 items-start">
                  <Info className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-2">টুর্নামেন্ট টিপস</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
                      <li>টুর্নামেন্টের নির্দিষ্ট সময়সীমা মনে রাখুন</li>
                      <li>আপনার টুর্নামেন্ট প্রোগ্রেস নিয়মিত চেক করুন</li>
                      <li>যোগ্য গেমগুলো সম্পর্কে সচেতন থাকুন</li>
                      <li>ন্যূনতম অংশগ্রহণ প্রয়োজনীয়তা পূরণ করুন (যেমন ন্যূনতম স্পিন বা বাজি)</li>
                      <li>সফল টুর্নামেন্ট খেলোয়াড়দের কৌশল অনুসরণ করুন</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* আপকামিং টুর্নামেন্ট ক্যালেন্ডার */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">টুর্নামেন্ট ক্যালেন্ডার</h2>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span>সম্পূর্ণ ক্যালেন্ডার</span>
            </Button>
          </div>
          
          <Card className="bg-card border-accent/20">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>মে ২০২৫ টুর্নামেন্ট সিডিউল</CardTitle>
                <div className="flex gap-2">
                  <Badge className="gap-1 bg-green-500/80">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <span>স্লট</span>
                  </Badge>
                  <Badge className="gap-1 bg-blue-500/80">
                    <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                    <span>ক্যাসিনো</span>
                  </Badge>
                  <Badge className="gap-1 bg-amber-500/80">
                    <div className="w-2 h-2 bg-amber-300 rounded-full"></div>
                    <span>স্পোর্টস</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>টুর্নামেন্ট</TableHead>
                      <TableHead>টাইপ</TableHead>
                      <TableHead>তারিখ</TableHead>
                      <TableHead>প্রাইজ পুল</TableHead>
                      <TableHead>এন্ট্রি ফি</TableHead>
                      <TableHead className="text-right">অ্যাকশন</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tournaments
                      .filter(t => t.status === "upcoming")
                      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                      .slice(0, 5)
                      .map(tournament => (
                        <TableRow key={tournament.id}>
                          <TableCell className="font-medium">{tournament.title}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                tournament.type === 'স্লট' ? 'bg-green-500/80' :
                                tournament.type === 'ক্যাসিনো' ? 'bg-blue-500/80' :
                                tournament.type === 'পোকার' ? 'bg-purple-500/80' :
                                'bg-amber-500/80'
                              }
                            >
                              {tournament.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{tournament.startDate}</TableCell>
                          <TableCell className="font-semibold">{tournament.prizePool}</TableCell>
                          <TableCell>{tournament.entryFee}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="accent">
                              রেজিস্টার
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
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

// টুর্নামেন্ট কার্ড কম্পোনেন্ট
function TournamentCard({ tournament, isCompleted = false }: { tournament: Tournament, isCompleted?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <Card className="bg-card border-accent/20 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div className="flex items-center gap-2">
            {tournament.isSpecial && (
              <Crown className="h-5 w-5 text-amber-500" />
            )}
            <CardTitle>{tournament.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={
                tournament.type === 'স্লট' ? 'bg-green-500/80' :
                tournament.type === 'ক্যাসিনো' ? 'bg-blue-500/80' :
                tournament.type === 'পোকার' ? 'bg-purple-500/80' :
                tournament.type === 'ক্র্যাশ গেমস' ? 'bg-red-500/80' :
                'bg-amber-500/80'
              }
            >
              {tournament.type}
            </Badge>
            {isCompleted && (
              <Badge variant="outline" className="bg-muted text-foreground">
                সম্পন্ন
              </Badge>
            )}
          </div>
        </div>
        <CardDescription>{tournament.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Calendar className="h-3 w-3" /> তারিখ
            </div>
            <div className="font-medium text-sm">
              {tournament.startDate} থেকে {tournament.endDate}
            </div>
          </div>
          
          <div>
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Trophy className="h-3 w-3" /> প্রাইজ পুল
            </div>
            <div className="font-semibold text-accent">
              {tournament.prizePool}
            </div>
          </div>
          
          <div>
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <DollarSign className="h-3 w-3" /> এন্ট্রি ফি
            </div>
            <div className="font-medium text-sm">
              {tournament.entryFee}
            </div>
          </div>
          
          <div>
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Users className="h-3 w-3" /> অংশগ্রহণকারী
            </div>
            <div className="font-medium text-sm">
              {tournament.participants.current}/{tournament.participants.max}
            </div>
          </div>
        </div>
        
        {expanded && (
          <div className="mt-6 space-y-4">
            {tournament.rules && (
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  নিয়মাবলী
                </h4>
                <ul className="space-y-2 pl-6 list-disc">
                  {tournament.rules.map((rule, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {tournament.winnerRewards && (
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <GiftIcon className="h-4 w-4 text-accent" />
                  পুরস্কার স্ট্রাকচার
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {tournament.winnerRewards.map((reward, idx) => (
                    <div key={idx} className="bg-muted/30 p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">
                        {reward.position} স্থান
                      </div>
                      <div className="font-semibold text-accent">
                        {reward.reward}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-muted/30 py-3 flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setExpanded(!expanded)}
          className="text-muted-foreground"
        >
          {expanded ? "বিবরণ লুকান" : "বিস্তারিত দেখুন"}
          <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </Button>
        
        {isCompleted ? (
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
          >
            <Trophy className="h-4 w-4 text-amber-500" />
            বিজয়ীরা দেখুন
          </Button>
        ) : (
          <Button 
            variant="accent" 
            size="sm"
          >
            রেজিস্ট্রেশন করুন
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

// লুসিড-রিয়েক্ট থেকে GiftIcon ইম্পোর্ট করা হয়েছে, কাস্টম আইকন মুছে ফেলা হয়েছে