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
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  Users, 
  LineChart, 
  Gift, 
  AlertCircle, 
  Check, 
  Copy,
  ArrowRight,
  Share2,
  ChevronRight,
  Facebook,
  Mail,
  Smartphone,
  FileText,
  Shield,
  Zap
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function AffiliatePage() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  // এফিলিয়েট ডেটা - বাস্তব অ্যাপ্লিকেশনে এটি API থেকে আসবে
  const affiliateData = {
    referralLink: "https://tk999.com/?ref=aff123456",
    referralCode: "aff123456",
    balance: "৳১৫,০০০",
    totalReferrals: "২৫",
    activeReferrals: "১২",
    totalEarnings: "৳৮৫,০০০",
    pendingCommission: "৳৩,৫০০"
  };
  
  const commissionRates = [
    { level: "ব্রোঞ্জ", requirement: "০-৪ সক্রিয় রেফারেল", revenueShare: "২৫%", depositBonus: "৫%" },
    { level: "সিলভার", requirement: "৫-১৯ সক্রিয় রেফারেল", revenueShare: "৩০%", depositBonus: "৭%" },
    { level: "গোল্ড", requirement: "২০-৪৯ সক্রিয় রেফারেল", revenueShare: "৩৫%", depositBonus: "১০%" },
    { level: "প্লাটিনাম", requirement: "৫০-৯৯ সক্রিয় রেফারেল", revenueShare: "৪০%", depositBonus: "১২%" },
    { level: "ডায়মন্ড", requirement: "১০০+ সক্রিয় রেফারেল", revenueShare: "৪৫%", depositBonus: "১৫%" }
  ];
  
  const recentReferrals = [
    { id: "REF-001", username: "user123", date: "২০২৫-০৫-০১", status: "সক্রিয়", deposits: "৳১২,০০০", commission: "৳৩,০০০" },
    { id: "REF-002", username: "gamer456", date: "২০২৫-০৪-২৮", status: "সক্রিয়", deposits: "৳৮,০০০", commission: "৳২,০০০" },
    { id: "REF-003", username: "player789", date: "২০২৫-০৪-২৫", status: "নিষ্ক্রিয়", deposits: "৳৫,০০০", commission: "৳১,২৫০" },
    { id: "REF-004", username: "better101", date: "২০২৫-০৪-২০", status: "সক্রিয়", deposits: "৳২০,০০০", commission: "৳৫,০০০" },
    { id: "REF-005", username: "gambler55", date: "২০২৫-০৪-১৫", status: "নিষ্ক্রিয়", deposits: "৳৩,০০০", commission: "৳৭৫০" }
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "কপি করা হয়েছে!",
      description: "রেফারেল লিংক কপি করা হয়েছে।",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isLoggedIn={!!user} onLogout={handleLogout} />
      <MobileMenu />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">এফিলিয়েট প্রোগ্রাম</h1>
          <p className="text-muted-foreground">
            আমাদের এফিলিয়েট প্রোগ্রামে যোগ দিন এবং আয় করুন আমাদের সাথে
          </p>
        </div>
        
        {user ? (
          // লগড ইন অবস্থা - এফিলিয়েট ড্যাশবোর্ড
          <>
            {/* এফিলিয়েট স্ট্যাটস */}
            <section className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-card border-accent/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      মোট রেফারেল
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{affiliateData.totalReferrals}</div>
                      <div className="p-2 bg-accent/10 rounded-full">
                        <Users className="h-4 w-4 text-accent" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      সক্রিয় রেফারেল: {affiliateData.activeReferrals}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-accent/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      মোট আয়
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{affiliateData.totalEarnings}</div>
                      <div className="p-2 bg-accent/10 rounded-full">
                        <DollarSign className="h-4 w-4 text-accent" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      সর্বসময়
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-accent/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      বর্তমান ব্যালেন্স
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{affiliateData.balance}</div>
                      <div className="p-2 bg-accent/10 rounded-full">
                        <LineChart className="h-4 w-4 text-accent" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      পেন্ডিং: {affiliateData.pendingCommission}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-accent/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      কমিশন রেট
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">৩০%</div>
                      <div className="p-2 bg-accent/10 rounded-full">
                        <Gift className="h-4 w-4 text-accent" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      বর্তমান লেভেল: সিলভার
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>
            
            {/* রেফারেল লিংক সেকশন */}
            <section className="mb-8">
              <Card className="bg-card border-accent/20">
                <CardHeader>
                  <CardTitle>আপনার রেফারেল লিংক</CardTitle>
                  <CardDescription>
                    এই লিংক শেয়ার করে আপনার রেফারেলদের আমন্ত্রণ জানান
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                      <Input 
                        value={affiliateData.referralLink} 
                        readOnly 
                        className="pr-10"
                      />
                      <button
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-accent"
                        onClick={() => copyToClipboard(affiliateData.referralLink)}
                      >
                        {copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => copyToClipboard(affiliateData.referralLink)}>
                        লিংক কপি করুন
                      </Button>
                      <Button variant="default" className="bg-accent text-white hover:bg-accent/90">
                        শেয়ার করুন
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      রেফারেল কোড:
                    </p>
                    <div className="bg-muted p-2 rounded inline-flex items-center gap-2">
                      <code className="font-mono">{affiliateData.referralCode}</code>
                      <button 
                        className="text-muted-foreground hover:text-accent"
                        onClick={() => copyToClipboard(affiliateData.referralCode)}
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
            
            {/* ট্যাবস ভিউ */}
            <Tabs defaultValue="referrals" className="mb-8">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
                <TabsTrigger value="referrals">রেফারেল হিস্টোরি</TabsTrigger>
                <TabsTrigger value="commission">কমিশন স্ট্রাকচার</TabsTrigger>
                <TabsTrigger value="withdraw">উত্তোলন</TabsTrigger>
              </TabsList>
              
              {/* রেফারেল ট্যাব */}
              <TabsContent value="referrals" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>আপনার রেফারেল সমূহ</CardTitle>
                    <CardDescription>
                      আপনার রেফারেল এবং তাদের কার্যকলাপ দেখুন
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentReferrals.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>আইডি</TableHead>
                              <TableHead>ইউজারনেম</TableHead>
                              <TableHead>যোগদানের তারিখ</TableHead>
                              <TableHead>স্ট্যাটাস</TableHead>
                              <TableHead>মোট ডিপোজিট</TableHead>
                              <TableHead>আপনার কমিশন</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {recentReferrals.map((referral) => (
                              <TableRow key={referral.id}>
                                <TableCell className="font-medium">{referral.id}</TableCell>
                                <TableCell>{referral.username}</TableCell>
                                <TableCell>{referral.date}</TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    referral.status === 'সক্রিয়' 
                                      ? 'bg-green-500/10 text-green-500' 
                                      : 'bg-amber-500/10 text-amber-500'
                                  }`}>
                                    {referral.status}
                                  </span>
                                </TableCell>
                                <TableCell>{referral.deposits}</TableCell>
                                <TableCell className="text-accent font-semibold">{referral.commission}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-3" />
                        <p className="text-muted-foreground">কোন রেফারেল নেই</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          আপনার রেফারেল লিংক শেয়ার করুন বন্ধুদের সাথে!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* কমিশন ট্যাব */}
              <TabsContent value="commission" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>কমিশন স্ট্রাকচার</CardTitle>
                    <CardDescription>
                      আমাদের এফিলিয়েট প্রোগ্রামের কমিশন রেট দেখুন
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>লেভেল</TableHead>
                            <TableHead>প্রয়োজনীয়তা</TableHead>
                            <TableHead>রেভিনিউ শেয়ার</TableHead>
                            <TableHead>ডিপোজিট বোনাস</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {commissionRates.map((rate) => (
                            <TableRow key={rate.level}>
                              <TableCell className="font-medium">{rate.level}</TableCell>
                              <TableCell>{rate.requirement}</TableCell>
                              <TableCell className="font-semibold">{rate.revenueShare}</TableCell>
                              <TableCell>{rate.depositBonus}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="mt-6 bg-muted/30 p-4 rounded-lg">
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-accent" />
                        কমিশন কিভাবে কাজ করে
                      </h3>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="bg-accent/10 text-accent p-1 rounded mt-0.5">
                            <Check className="h-3 w-3" />
                          </span>
                          <span>রেভিনিউ শেয়ার: আপনার রেফারেল প্লেয়ারের নেট লস থেকে আপনি আপনার লেভেল অনুযায়ী শতাংশ কমিশন পাবেন।</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-accent/10 text-accent p-1 rounded mt-0.5">
                            <Check className="h-3 w-3" />
                          </span>
                          <span>ডিপোজিট বোনাস: আপনার রেফারেল প্লেয়ারের প্রথম ডিপোজিটের উপর আপনি আপনার লেভেল অনুযায়ী শতাংশ বোনাস পাবেন।</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-accent/10 text-accent p-1 rounded mt-0.5">
                            <Check className="h-3 w-3" />
                          </span>
                          <span>পেমেন্ট: কমিশন পেমেন্ট প্রতি সপ্তাহের শেষে করা হয়। নূন্যতম পেমেন্ট অ্যামাউন্ট ৫০০ টাকা।</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* উত্তোলন ট্যাব */}
              <TabsContent value="withdraw" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>কমিশন উত্তোলন</CardTitle>
                    <CardDescription>
                      আপনার উপার্জিত কমিশন উত্তোলন করুন
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6 bg-accent/10 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">ব্যালেন্স</h3>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <p className="text-3xl font-bold">{affiliateData.balance}</p>
                          <p className="text-sm text-muted-foreground">
                            নূন্যতম উত্তোলন: ৫০০ টাকা
                          </p>
                        </div>
                        <Button className="bg-accent text-white hover:bg-accent/90">
                          উত্তোলন করুন
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3">উত্তোলন পদ্ধতি নির্বাচন করুন</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="border rounded-lg p-4 hover:border-accent cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-accent/10 rounded-full">
                                <Smartphone className="h-5 w-5 text-accent" />
                              </div>
                              <div>
                                <p className="font-medium">মোবাইল ব্যাংকিং</p>
                                <p className="text-xs text-muted-foreground">
                                  বিকাশ, নগদ, রকেট
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-4 hover:border-accent cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-accent/10 rounded-full">
                                <DollarSign className="h-5 w-5 text-accent" />
                              </div>
                              <div>
                                <p className="font-medium">ব্যাংক ট্রান্সফার</p>
                                <p className="text-xs text-muted-foreground">
                                  সকল ব্যাংক অ্যাকাউন্ট
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-4 hover:border-accent cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-accent/10 rounded-full">
                                <Gift className="h-5 w-5 text-accent" />
                              </div>
                              <div>
                                <p className="font-medium">সাইট ক্রেডিট</p>
                                <p className="text-xs text-muted-foreground">
                                  আপনার প্লেয়ার অ্যাকাউন্টে
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <h3 className="text-lg font-medium mb-3">উত্তোলন ফর্ম</h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium" htmlFor="amount">
                                উত্তোলনের পরিমাণ
                              </label>
                              <Input id="amount" placeholder="পরিমাণ লিখুন" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium" htmlFor="method">
                                পেমেন্ট মেথড
                              </label>
                              <Input id="method" placeholder="যেমন: বিকাশ, ব্যাংক ট্রান্সফার" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="details">
                              পেমেন্ট ডিটেইলস
                            </label>
                            <Textarea id="details" placeholder="আপনার মোবাইল নাম্বার/অ্যাকাউন্ট নাম্বার লিখুন" className="min-h-[100px]" />
                          </div>
                          <Button className="w-full bg-accent text-white hover:bg-accent/90">
                            উত্তোলন অনুরোধ জমা দিন
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          // লগইন করা নেই - এফিলিয়েট প্রোগ্রামের বিবরণ
          <>
            <section className="mb-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-4">এফিলিয়েট হিসেবে আয় করুন</h2>
                  <p className="text-muted-foreground mb-6">
                    আমাদের এফিলিয়েট প্রোগ্রাম আপনাকে আপনার বন্ধুদের, পরিবারের সদস্যদের এবং অনলাইন অনুসরণকারীদের রেফার করে অর্থ উপার্জন করতে দেয়। আপনি আপনার বন্ধুদের রেফারেল লিংক শেয়ার করে এবং আপনার রেফারালগুলি জুয়া খেলায় অংশ নেওয়ার মাধ্যমে সহজেই উপার্জন করতে পারেন।
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-accent/10 rounded-full mt-1">
                        <DollarSign className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">৪৫% পর্যন্ত রেভেনিউ শেয়ার</p>
                        <p className="text-sm text-muted-foreground">
                          আপনার রেফারেলের নেট লস থেকে আপনি ৪৫% পর্যন্ত কমিশন পাবেন।
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-accent/10 rounded-full mt-1">
                        <Gift className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">১৫% পর্যন্ত ডিপোজিট বোনাস</p>
                        <p className="text-sm text-muted-foreground">
                          আপনার রেফারালের প্রথম ডিপোজিটে আপনি ১৫% পর্যন্ত বোনাস পাবেন।
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-accent/10 rounded-full mt-1">
                        <Shield className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">লাইফটাইম কমিশন</p>
                        <p className="text-sm text-muted-foreground">
                          রেফারেল যতদিন আমাদের সাইটে থাকবে, আপনি ততদিন কমিশন পাবেন।
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button className="mt-6 bg-accent text-white hover:bg-accent/90">
                    এখনই রেজিস্ট্রেশন করুন
                  </Button>
                </div>
                
                <div className="bg-card border-accent/20 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">আপনার কমিশন ক্যালকুলেট করুন</h3>
                  <p className="text-muted-foreground mb-6">
                    আমাদের এফিলিয়েট প্রোগ্রামে যোগ দেওয়ার পরে আপনি কত আয় করতে পারেন তা দেখুন।
                  </p>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        আপনি কতজন প্লেয়ার আনতে পারবেন?
                      </label>
                      <Input type="number" placeholder="25" min="1" defaultValue="10" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        গড় নেট লস প্রতি প্লেয়ার (মাসিক)
                      </label>
                      <Input type="number" placeholder="10000" min="1" defaultValue="5000" />
                    </div>
                    <div className="p-4 bg-accent/10 rounded-lg">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">আপনার সম্ভাব্য মাসিক আয়:</p>
                        <p className="text-2xl font-bold">৳১৫,০০০</p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm font-medium">আপনার সম্ভাব্য বার্ষিক আয়:</p>
                        <p className="text-xl font-bold">৳১,৮০,০০০</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-6 text-center">কিভাবে শুরু করবেন</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border-accent/20 rounded-lg p-6 text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <p className="text-xl font-bold text-accent">১</p>
                  </div>
                  <h3 className="text-lg font-bold mb-2">অ্যাকাউন্ট খুলুন</h3>
                  <p className="text-sm text-muted-foreground">
                    আমাদের ওয়েবসাইটে একটি অ্যাকাউন্ট খুলুন এবং এফিলিয়েট প্রোগ্রামে যোগ দিন।
                  </p>
                </div>
                
                <div className="bg-card border-accent/20 rounded-lg p-6 text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <p className="text-xl font-bold text-accent">২</p>
                  </div>
                  <h3 className="text-lg font-bold mb-2">লিংক শেয়ার করুন</h3>
                  <p className="text-sm text-muted-foreground">
                    আপনার রেফারেল লিংক শেয়ার করুন সোশ্যাল মিডিয়া, ইমেইল বা ব্লগের মাধ্যমে।
                  </p>
                </div>
                
                <div className="bg-card border-accent/20 rounded-lg p-6 text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <p className="text-xl font-bold text-accent">৩</p>
                  </div>
                  <h3 className="text-lg font-bold mb-2">কমিশন পান</h3>
                  <p className="text-sm text-muted-foreground">
                    আপনার রেফারালগুলি সাইনআপ করলে এবং গেম খেললে আপনি কমিশন পাবেন।
                  </p>
                </div>
              </div>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-6">সাধারণ প্রশ্নাবলী</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>এফিলিয়েট প্রোগ্রামে যোগ দেওয়ার জন্য কোন ফি আছে কি?</AccordionTrigger>
                  <AccordionContent>
                    না, আমাদের এফিলিয়েট প্রোগ্রামে যোগ দেওয়ার জন্য কোন ফি নেই। এটি সম্পূর্ণ বিনামূল্যে এবং আপনি শুধুমাত্র আমাদের সাইটে একটি অ্যাকাউন্ট খুলে এফিলিয়েট প্রোগ্রামে যোগ দিতে পারেন।
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>আমি কীভাবে কমিশন পাব?</AccordionTrigger>
                  <AccordionContent>
                    আপনি আপনার রেফারেলের নেট লস থেকে কমিশন পাবেন। এছাড়াও, আপনার রেফারালের প্রথম ডিপোজিটে আপনি ডিপোজিট বোনাস পাবেন। কমিশন রেট আপনার এফিলিয়েট লেভেলের উপর নির্ভর করে ভিন্ন হবে।
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>কীভাবে কমিশন পেমেন্ট করা হয়?</AccordionTrigger>
                  <AccordionContent>
                    কমিশন পেমেন্ট প্রতি সপ্তাহে করা হয়। আপনি বিকাশ, নগদ, রকেট, ব্যাংক ট্রান্সফার বা সাইট ক্রেডিটের মাধ্যমে আপনার কমিশন পেতে পারেন। নূন্যতম পেমেন্ট অ্যামাউন্ট ৫০০ টাকা।
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>আমি কি আমার নিজের অ্যাকাউন্টের জন্য রেফারেল বোনাস পাব?</AccordionTrigger>
                  <AccordionContent>
                    না, আপনি আপনার নিজের অ্যাকাউন্টের জন্য রেফারেল বোনাস পাবেন না। এফিলিয়েট রেফারেল প্রোগ্রাম শুধুমাত্র নতুন প্লেয়ারদের জন্য যারা আপনার রেফারেল লিংকের মাধ্যমে সাইন আপ করেছে।
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>আমি কি একাধিক রেফারেল লিংক পেতে পারি?</AccordionTrigger>
                  <AccordionContent>
                    না, প্রতিটি এফিলিয়েট অ্যাকাউন্টের জন্য একটি অনন্য রেফারেল লিংক বরাদ্দ করা হয়। তবে, আপনি আপনার রেফারেল লিংক বিভিন্ন চ্যানেলে শেয়ার করতে পারেন, যেমন সোশ্যাল মিডিয়া, ইমেল, ব্লগ ইত্যাদি।
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>
          </>
        )}
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}