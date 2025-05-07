import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileMenu from "@/components/layout/mobile-menu";
import MobileNav from "@/components/layout/mobile-nav";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Clock, 
  Users, 
  CalendarDays, 
  Check, 
  X, 
  Info, 
  Coins,
  Table as TableIcon
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
import { Badge } from "@/components/ui/badge";

export default function TournamentRulesPage() {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // টুর্নামেন্ট টাইপ ডেটা
  const tournamentTypes = [
    {
      id: "slots",
      title: "স্লট টুর্নামেন্ট",
      description: "স্পিন এবং জিতুন! স্লট গেমে আপনার দক্ষতা দেখান।",
      icon: <TableIcon className="h-5 w-5" />,
      rules: [
        "স্লট টুর্নামেন্টগুলো নির্দিষ্ট স্লট গেমে খেলা হয়।",
        "পয়েন্ট বিভিন্ন ভাবে অর্জন করা যায়: সর্বমোট বাজি, সর্বোচ্চ মাল্টিপ্লায়ার, বা বাজির শতাংশ হিসাবে সর্বাধিক জয়।",
        "খেলোয়াড়দের অবশ্যই ন্যূনতম স্পিন সংখ্যা বা ন্যূনতম বাজি পরিমাণ পূরণ করতে হবে টুর্নামেন্টের জন্য যোগ্য হওয়ার জন্য।",
        "টুর্নামেন্টের সময়সীমার মধ্যে সর্বাধিক পয়েন্ট অর্জনকারী খেলোয়াড়রা পুরস্কার জিতবেন।",
        "সমান পয়েন্টের ক্ষেত্রে, যে খেলোয়াড় প্রথম সেই পয়েন্টে পৌঁছেছে তিনি উচ্চতর র‍্যাঙ্কিং পাবেন।"
      ],
      features: [
        "লাইভ লিডারবোর্ড",
        "দৈনিক, সাপ্তাহিক, এবং মাসিক ইভেন্ট",
        "নিরাপদ ও স্বচ্ছ প্রতিযোগিতা",
        "বড় পুরস্কার ফান্ড"
      ]
    },
    {
      id: "live",
      title: "লাইভ ক্যাসিনো টুর্নামেন্ট",
      description: "বাস্তব ডিলারদের বিরুদ্ধে আপনার দক্ষতা পরীক্ষা করুন এবং চ্যাম্পিয়ন হওয়ার জন্য প্রতিযোগিতা করুন।",
      icon: <Users className="h-5 w-5" />,
      rules: [
        "লাইভ ক্যাসিনো টুর্নামেন্টগুলো রুলেট, ব্ল্যাকজ্যাক, বাকারাত, বা পোকার সহ বিভিন্ন টেবিল গেমে হোস্ট করা হয়।",
        "খেলোয়াড়দের অবশ্যই সরাসরি টুর্নামেন্টের জন্য চিহ্নিত টেবিলে খেলতে হবে।",
        "পয়েন্ট গণনা করা হয় জয়, স্ট্রিক, চিপ স্ট্যাক বৃদ্ধি, বা টুর্নামেন্ট-নির্দিষ্ট প্রতিযোগিতার উপর ভিত্তি করে।",
        "খেলোয়াড়দের অবশ্যই নির্ধারিত ন্যূনতম টেবিল সময় বা হাত সংখ্যা খেলতে হবে।",
        "বহিষ্কার-ভিত্তিক টুর্নামেন্টের ক্ষেত্রে, খেলোয়াড়রা যখন তাদের চিপ শেষ হয়ে যায় তখন বাদ পড়ে যায়; শেষ টিকে থাকা খেলোয়াড় জয়ী হয়।"
      ],
      features: [
        "উচ্চ মানের লাইভ স্ট্রিমিং",
        "প্রফেশনাল ডিলারস",
        "VIP টুর্নামেন্ট",
        "ইন্টারঅ্যাকটিভ চ্যাট ফিচার"
      ]
    },
    {
      id: "sports",
      title: "স্পোর্টস বেটিং টুর্নামেন্ট",
      description: "স্পোর্টস বেটিং এর জ্ঞান ব্যবহার করে আপনার বিশ্লেষণাত্মক দক্ষতা দেখান এবং পুরস্কার জিতুন।",
      icon: <Trophy className="h-5 w-5" />,
      rules: [
        "খেলোয়াড়রা নির্দিষ্ট স্পোর্টস ইভেন্ট, লীগ, বা চ্যাম্পিয়নশিপের উপর বাজি ধরে।",
        "সাধারণত একটি ভার্চুয়াল বাজেট বা পয়েন্ট সিস্টেম ব্যবহার করা হয়।",
        "সাফল্য গণনা করা হয় অর্জিত লাভ, সঠিক প্রেডিকশন হার, বা উভয়ের সংমিশ্রণ দ্বারা।",
        "অধিকাংশ টুর্নামেন্টে অবশ্যই ন্যূনতম সংখ্যক বাজি ধরতে হবে যোগ্য হওয়ার জন্য।",
        "কিছু টুর্নামেন্ট নির্দিষ্ট বাজি ধরন, যেমন অ্যাকুমুলেটর বা সিঙ্গল বেট-এর প্রয়োজন করে।"
      ],
      features: [
        "রিয়েল-টাইম লিডারবোর্ড",
        "বিস্তৃত স্পোর্টস কভারেজ",
        "স্পেশাল হ্যান্ডিক্যাপ বাজি",
        "জাতীয় ও আন্তর্জাতিক প্রতিযোগিতা"
      ]
    },
    {
      id: "vip",
      title: "VIP এক্সক্লুসিভ টুর্নামেন্ট",
      description: "শুধুমাত্র আমাদের সবচেয়ে মূল্যবান প্লেয়ারদের জন্য পরিচালিত এক্সক্লুসিভ টুর্নামেন্ট।",
      icon: <Coins className="h-5 w-5" />,
      rules: [
        "শুধুমাত্র আমন্ত্রিত VIP খেলোয়াড়রা বা নির্দিষ্ট লয়্যালটি স্তরের খেলোয়াড়রা এই টুর্নামেন্টে অংশগ্রহণ করতে পারবেন।",
        "প্রবেশ ফি সাধারণত উচ্চতর, কিন্তু প্রতিযোগীদের সংখ্যা কম এবং পুরস্কার অনেক বেশি।",
        "টুর্নামেন্টগুলো বিশেষ গেম, বাজি সীমা, বা স্পেশাল প্লে ফরম্যাটের বৈশিষ্ট্যযুক্ত হতে পারে।",
        "পার্সোনালাইজড কাস্টমার সাপোর্ট এবং VIP হোস্ট সহ।",
        "অনেক সময় অতিরিক্ত পুরস্কার যেমন ভ্রমণ প্যাকেজ, লাক্সারি আইটেম, বা সীমিত-এডিশন মার্চেন্ডাইজ অন্তর্ভুক্ত থাকে।"
      ],
      features: [
        "ব্যক্তিগত আমন্ত্রণ",
        "উচ্চ মূল্যের পুরস্কার",
        "কম প্লেয়ার-টু-পুরস্কার অনুপাত",
        "এক্সক্লুসিভ ইভেন্ট এবং অভিজ্ঞতা"
      ]
    }
  ];

  // কমন টুর্নামেন্ট রুলস
  const commonRules = [
    {
      title: "১. যোগ্যতা",
      rules: [
        "অংশগ্রহণকারীদের অবশ্যই TK999 এ রেজিস্টার্ড ব্যবহারকারী হতে হবে।",
        "অংশগ্রহণকারীদের অবশ্যই ১৮ বছর বা তার বেশি বয়সী হতে হবে।",
        "কোম্পানির কর্মচারী, তাদের পরিবারের সদস্য, এবং সংশ্লিষ্ট ব্যক্তিরা অংশগ্রহণ করতে পারবেন না।",
        "টুর্নামেন্টে অংশগ্রহণ করার জন্য অ্যাকাউন্ট যাচাইকরণ (KYC) প্রয়োজন হতে পারে।"
      ]
    },
    {
      title: "২. রেজিস্ট্রেশন",
      rules: [
        "টুর্নামেন্টে অংশগ্রহণের জন্য খেলোয়াড়দের বিশেষভাবে নির্ধারিত টুর্নামেন্ট পৃষ্ঠার মাধ্যমে রেজিস্ট্রেশন করতে হবে।",
        "কিছু টুর্নামেন্টের প্রবেশ ফি থাকতে পারে, অন্যগুলো বিনামূল্যে হতে পারে। এটি রেজিস্ট্রেশন পৃষ্ঠায় স্পষ্টভাবে উল্লেখ করা হবে।",
        "টুর্নামেন্ট শুরুর আগে রেজিস্ট্রেশন শেষ হতে পারে। খেলোয়াড়দের যথাসময়ে রেজিস্ট্রেশন করতে উৎসাহিত করা হয়।",
        "রেজিস্ট্রেশন সম্পূর্ণ হওয়ার পর খেলোয়াড়রা সিস্টেম থেকে নিশ্চিতকরণ প্রাপ্ত হবেন।"
      ]
    },
    {
      title: "৩. গেমপ্লে এবং স্কোরিং",
      rules: [
        "প্রতিটি টুর্নামেন্টের নিজস্ব স্কোরিং সিস্টেম থাকবে, যা টুর্নামেন্টের শুরুতে স্পষ্টভাবে ব্যাখ্যা করা হবে।",
        "পয়েন্ট অর্জনের পদ্ধতি টুর্নামেন্ট অনুসারে পরিবর্তিত হতে পারে (উদাহরণস্বরূপ, সর্বাধিক জয়, উচ্চতম মাল্টিপ্লায়ার, সর্বাধিক চিপ স্ট্যাক, ইত্যাদি)।",
        "খেলোয়াড়দের মধ্যে কোন সহযোগিতা, ম্যাচ ফিক্সিং, বা আঁতাত সহ্য করা হবে না এবং অযোগ্যতায় পরিণত হবে।",
        "গেমপ্লে নির্দিষ্ট সময়সীমার মধ্যে অবশ্যই সম্পূর্ণ করতে হবে। দেরিতে জমা দেওয়া স্কোর গ্রহণ করা হবে না।"
      ]
    },
    {
      title: "৪. পুরস্কার এবং বিতরণ",
      rules: [
        "পুরস্কার স্ট্রাকচার টুর্নামেন্ট শুরুর আগে ঘোষণা করা হবে এবং সাধারণত অংশগ্রহণকারীদের সংখ্যার উপর নির্ভর করে।",
        "পুরস্কার সাধারণত টুর্নামেন্ট শেষ হওয়ার ২৪ ঘন্টার মধ্যে বিতরণ করা হবে।",
        "পুরস্কার বোনাস ব্যালেন্স বা রিয়েল মানি ব্যালেন্স হিসাবে ক্রেডিট করা হতে পারে, টুর্নামেন্ট শর্তাবলী অনুসারে।",
        "পুরস্কার হিসাবে দেওয়া বোনাস বা ফ্রি স্পিন নির্দিষ্ট ওয়েজারিং প্রয়োজনীয়তা সাপেক্ষে হতে পারে।"
      ]
    },
    {
      title: "৫. টাইব্রেকার নিয়ম",
      rules: [
        "যদি দুই বা ততোধিক খেলোয়াড় একই পয়েন্ট নিয়ে টুর্নামেন্ট শেষ করেন, তাহলে নির্দিষ্ট টাইব্রেকার নিয়ম প্রয়োগ করা হবে।",
        "সাধারণ টাইব্রেকার মানদণ্ড: সেই পয়েন্টে সবার আগে পৌঁছানো, সবচেয়ে বড় একক জয়, সর্বোচ্চ RTP, বা সবচেয়ে কম বাজি সহ সাফল্য।",
        "বিশেষ ক্ষেত্রে, টাইব্রেকার রাউন্ড আয়োজন করা হতে পারে বা পুরস্কার সমানভাবে ভাগ করা হতে পারে।",
        "টাইব্রেকার সিদ্ধান্ত চূড়ান্ত এবং বাধ্যতামূলক।"
      ]
    },
    {
      title: "৬. সাধারণ শর্তাবলী",
      rules: [
        "TK999 যে কোন সময় টুর্নামেন্টের ফরম্যাট, নিয়ম, বা পুরস্কার পরিবর্তন করার অধিকার সংরক্ষণ করে।",
        "প্রযুক্তিগত সমস্যা, সিস্টেম ত্রুটি, বা তৃতীয় পক্ষের সমস্যার ক্ষেত্রে, TK999 টুর্নামেন্ট বন্ধ, স্থগিত, বা পুনরায় শেডিউল করার অধিকার সংরক্ষণ করে।",
        "কোন বিরোধ বা বিতর্কের ক্ষেত্রে, TK999 এর সিদ্ধান্ত চূড়ান্ত এবং বাধ্যতামূলক।",
        "যে কোন ধরনের অনিয়ম বা জালিয়াতি অবিলম্বে অ্যাকাউন্ট বাতিল এবং পুরস্কার বাজেয়াপ্ত করতে পারে।"
      ]
    }
  ];

  // উপকমিং টুর্নামেন্ট ডেটা (টেস্ট ডেটা)
  const upcomingTournaments = [
    {
      id: 1,
      title: "মেগা স্লট চ্যাম্পিয়নশিপ",
      type: "slots",
      startDate: "২০২৫-০৫-১০",
      endDate: "২০২৫-০৫-১৫",
      prizePool: "৳১,০০০,০০০",
      entryFee: "৳৫০০",
      participants: "২৫০+",
      status: "upcoming"
    },
    {
      id: 2,
      title: "রয়্যাল পোকার টুর্নামেন্ট",
      type: "live",
      startDate: "২০২৫-০৫-১২",
      endDate: "২০২৫-০৫-১৩",
      prizePool: "৳৫০০,০০০",
      entryFee: "৳১,০০০",
      participants: "১০০+",
      status: "upcoming"
    },
    {
      id: 3,
      title: "ফুটবল ওয়ার্ল্ড কাপ স্পেশাল",
      type: "sports",
      startDate: "২০২৫-০৫-২০",
      endDate: "২০২৫-০৬-২০",
      prizePool: "৳২,০০০,০০০",
      entryFee: "৳২০০",
      participants: "৫০০+",
      status: "upcoming"
    },
    {
      id: 4,
      title: "ডায়মন্ড VIP এক্সক্লুসিভ",
      type: "vip",
      startDate: "২০২৫-০৫-২৫",
      endDate: "২০২৫-০৫-২৬",
      prizePool: "৳১,৫০০,০০০",
      entryFee: "শুধুমাত্র আমন্ত্রণে",
      participants: "৫০",
      status: "upcoming"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isLoggedIn={!!user} onLogout={handleLogout} />
      <MobileMenu />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">টুর্নামেন্ট নিয়মাবলী</h1>
          <p className="text-muted-foreground">
            বিভিন্ন ধরনের টুর্নামেন্টের নিয়মাবলী এবং শর্তাবলী
          </p>
        </div>
        
        {/* মূল নিয়মাবলী সেকশন */}
        <section className="mb-10">
          <Card className="bg-card border-accent/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-full">
                  <Trophy className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <CardTitle>টুর্নামেন্ট ভূমিকা</CardTitle>
                  <CardDescription>
                    TK999 এর টুর্নামেন্ট সম্পর্কে মৌলিক তথ্য এবং নিয়মাবলী
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
              <p>
                TK999 এ আমরা নিয়মিত বিভিন্ন ধরনের টুর্নামেন্ট আয়োজন করি, যা আমাদের প্লেয়ারদের জন্য উত্তেজনাপূর্ণ প্রতিযোগিতা এবং বড় পুরস্কার জেতার সুযোগ তৈরি করে। আমাদের টুর্নামেন্টগুলি স্লট গেমস, লাইভ ক্যাসিনো, স্পোর্টস বেটিং, এবং VIP খেলোয়াড়দের জন্য বিশেষ ইভেন্ট অন্তর্ভুক্ত করে।
              </p>
              <p>
                প্রতিটি টুর্নামেন্টের নিজস্ব ফরম্যাট, নিয়ম, এবং পুরস্কার স্ট্রাকচার রয়েছে, তবে কিছু মৌলিক নিয়ম এবং নীতি সব টুর্নামেন্টের জন্য প্রযোজ্য। সব সময় বিশেষ টুর্নামেন্টের জন্য নির্দিষ্ট নিয়মাবলী পড়ুন যেগুলি টুর্নামেন্ট পৃষ্ঠায় পাওয়া যাবে।
              </p>
              <p>
                টুর্নামেন্টগুলো সাধারণত প্রতিদিন, সাপ্তাহিক, এবং মাসিক ভিত্তিতে আয়োজন করা হয়, বিশেষ ইভেন্ট এবং প্রমোশনাল টুর্নামেন্ট সহ, যেমন ঋতুভিত্তিক টুর্নামেন্ট, হলিডে স্পেশাল, এবং বড় স্পোর্টিং ইভেন্টের সাথে সম্পর্কিত টুর্নামেন্ট।
              </p>
              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <Button variant="accent" className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>উপকমিং টুর্নামেন্ট দেখুন</span>
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  <span>পিছনের বিজয়ীদের দেখুন</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* ট্যাব সিস্টেমে টুর্নামেন্ট প্রকার */}
        <Tabs defaultValue="common" className="mb-10">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-5">
            <TabsTrigger value="common" className="gap-2">
              <Info className="h-4 w-4" />
              <span>সাধারণ নিয়মাবলী</span>
            </TabsTrigger>
            <TabsTrigger value="slots" className="gap-2">
              <TableIcon className="h-4 w-4" />
              <span>স্লট টুর্নামেন্ট</span>
            </TabsTrigger>
            <TabsTrigger value="live" className="gap-2">
              <Users className="h-4 w-4" />
              <span>লাইভ ক্যাসিনো</span>
            </TabsTrigger>
            <TabsTrigger value="sports" className="gap-2">
              <Trophy className="h-4 w-4" />
              <span>স্পোর্টস বেটিং</span>
            </TabsTrigger>
            <TabsTrigger value="vip" className="gap-2">
              <Coins className="h-4 w-4" />
              <span>VIP টুর্নামেন্ট</span>
            </TabsTrigger>
          </TabsList>
          
          {/* সাধারণ নিয়মাবলী */}
          <TabsContent value="common" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>সাধারণ টুর্নামেন্ট নিয়মাবলী</CardTitle>
                <CardDescription>সমস্ত টুর্নামেন্টের জন্য প্রযোজ্য সাধারণ নিয়মাবলী এবং শর্তাবলী</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {commonRules.map((section, index) => (
                  <div key={index} className="pb-4 border-b border-border last:border-0 last:pb-0">
                    <h3 className="font-bold mb-3 text-lg">{section.title}</h3>
                    <ul className="space-y-2">
                      {section.rules.map((rule, ruleIndex) => (
                        <li key={ruleIndex} className="flex items-start gap-2 text-muted-foreground">
                          <span className="bg-accent/10 text-accent p-1 rounded mt-0.5 flex-shrink-0">
                            <Check className="h-3 w-3" />
                          </span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* টুর্নামেন্ট টাইপ ট্যাবগুলো */}
          {tournamentTypes.map((type) => (
            <TabsContent key={type.id} value={type.id} className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-full">
                      {type.icon}
                    </div>
                    <div>
                      <CardTitle>{type.title}</CardTitle>
                      <CardDescription>{type.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="pb-4 border-b border-border">
                    <h3 className="font-bold mb-3 text-lg">বিশেষ নিয়মাবলী</h3>
                    <ul className="space-y-2">
                      {type.rules.map((rule, ruleIndex) => (
                        <li key={ruleIndex} className="flex items-start gap-2 text-muted-foreground">
                          <span className="bg-accent/10 text-accent p-1 rounded mt-0.5 flex-shrink-0">
                            <Check className="h-3 w-3" />
                          </span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-bold mb-3 text-lg">বৈশিষ্ট্য</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {type.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="bg-muted/30 p-3 rounded-lg flex items-center gap-2">
                          <span className="bg-accent/10 text-accent p-1 rounded flex-shrink-0">
                            <Check className="h-3 w-3" />
                          </span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
        
        {/* উপকমিং টুর্নামেন্ট সেকশন */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <CalendarDays className="mr-2 h-5 w-5 text-accent" />
            উপকমিং টুর্নামেন্ট
          </h2>
          
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>টুর্নামেন্ট</TableHead>
                  <TableHead>ধরন</TableHead>
                  <TableHead>তারিখ</TableHead>
                  <TableHead>পুরস্কার ফান্ড</TableHead>
                  <TableHead>প্রবেশ ফি</TableHead>
                  <TableHead>অংশগ্রহণকারী</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingTournaments.map(tournament => (
                  <TableRow key={tournament.id}>
                    <TableCell className="font-medium">{tournament.title}</TableCell>
                    <TableCell>
                      <Badge className={`${
                        tournament.type === 'slots' ? 'bg-blue-500' :
                        tournament.type === 'live' ? 'bg-green-500' :
                        tournament.type === 'sports' ? 'bg-orange-500' :
                        'bg-purple-500'
                      }`}>
                        {tournament.type === 'slots' ? 'স্লট' :
                         tournament.type === 'live' ? 'লাইভ ক্যাসিনো' :
                         tournament.type === 'sports' ? 'স্পোর্টস' :
                         'VIP'
                        }
                      </Badge>
                    </TableCell>
                    <TableCell>{tournament.startDate} থেকে {tournament.endDate}</TableCell>
                    <TableCell className="font-semibold text-accent">{tournament.prizePool}</TableCell>
                    <TableCell>{tournament.entryFee}</TableCell>
                    <TableCell>{tournament.participants}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="accent">
                        রেজিস্টার
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
        
        {/* অন্যান্য গুরুত্বপূর্ণ তথ্য */}
        <section>
          <h2 className="text-2xl font-bold mb-6">অন্যান্য গুরুত্বপূর্ণ তথ্য</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <X className="h-5 w-5 text-red-500" />
                  <span>নিষিদ্ধ আচরণ</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  নিম্নলিখিত আচরণগুলো টুর্নামেন্টে কঠোরভাবে নিষিদ্ধ এবং অযোগ্যতা, অ্যাকাউন্ট সসপেনশন, বা স্থায়ী বহিষ্কারের কারণ হতে পারে:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-muted-foreground text-sm">
                    <span className="bg-red-500/10 text-red-500 p-1 rounded mt-0.5">
                      <X className="h-3 w-3" />
                    </span>
                    <span>কোন ধরনের কোলিউশন বা খেলোয়াড়দের মধ্যে সহযোগিতা</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground text-sm">
                    <span className="bg-red-500/10 text-red-500 p-1 rounded mt-0.5">
                      <X className="h-3 w-3" />
                    </span>
                    <span>বট, স্ক্রিপ্ট, বা অটোমেশন টুল ব্যবহার করা</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground text-sm">
                    <span className="bg-red-500/10 text-red-500 p-1 rounded mt-0.5">
                      <X className="h-3 w-3" />
                    </span>
                    <span>একাধিক অ্যাকাউন্ট ব্যবহার করা বা অ্যাকাউন্ট শেয়ারিং</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground text-sm">
                    <span className="bg-red-500/10 text-red-500 p-1 rounded mt-0.5">
                      <X className="h-3 w-3" />
                    </span>
                    <span>ম্যাচ ফিক্সিং বা ফলাফল ম্যানিপুলেশন</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground text-sm">
                    <span className="bg-red-500/10 text-red-500 p-1 rounded mt-0.5">
                      <X className="h-3 w-3" />
                    </span>
                    <span>অভদ্র আচরণ, হয়রানি, বা অপমানজনক মন্তব্য</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  <span>টুর্নামেন্ট টাইমলাইন</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="bg-accent/10 text-accent p-1 rounded-full">
                        <Check className="h-4 w-4" />
                      </div>
                      <div className="bg-border w-px h-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">টুর্নামেন্ট ঘোষণা</h4>
                      <p className="text-xs text-muted-foreground">টুর্নামেন্ট শুরুর অন্তত ৭ দিন আগে প্রকাশিত হয়</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="bg-accent/10 text-accent p-1 rounded-full">
                        <Check className="h-4 w-4" />
                      </div>
                      <div className="bg-border w-px h-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">রেজিস্ট্রেশন পিরিয়ড</h4>
                      <p className="text-xs text-muted-foreground">টুর্নামেন্ট শুরুর আগে পর্যন্ত খোলা থাকে (কখনও কখনও টুর্নামেন্ট চলাকালীন)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="bg-accent/10 text-accent p-1 rounded-full">
                        <Check className="h-4 w-4" />
                      </div>
                      <div className="bg-border w-px h-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">টুর্নামেন্ট পিরিয়ড</h4>
                      <p className="text-xs text-muted-foreground">টুর্নামেন্টের ধরন অনুসারে ভিন্ন (কয়েক ঘন্টা থেকে কয়েক সপ্তাহ)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="bg-accent/10 text-accent p-1 rounded-full">
                        <Check className="h-4 w-4" />
                      </div>
                      <div className="bg-border w-px h-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">ফলাফল ঘোষণা</h4>
                      <p className="text-xs text-muted-foreground">টুর্নামেন্ট শেষ হওয়ার ২৪ ঘন্টার মধ্যে</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="bg-accent/10 text-accent p-1 rounded-full">
                        <Check className="h-4 w-4" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">পুরস্কার বিতরণ</h4>
                      <p className="text-xs text-muted-foreground">ফলাফল ঘোষণার ২৪ ঘন্টার মধ্যে পুরস্কার বিতরণ করা হয়</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}