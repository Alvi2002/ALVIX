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
                          <span>ডিপোজিট বোনাস: আপনার রেফারেল প্লেয়ারের প্রথম ডিপোজিটের উপর আপনি এই শতাংশ বোনাস পাবেন।</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-accent/10 text-accent p-1 rounded mt-0.5">
                            <Check className="h-3 w-3" />
                          </span>
                          <span>সক্রিয় রেফারেল: যারা গত ৩০ দিনে কমপক্ষে ১টি ডিপোজিট করেছেন।</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-accent/10 text-accent p-1 rounded mt-0.5">
                            <Check className="h-3 w-3" />
                          </span>
                          <span>কমিশন প্রতি মাসের ১ তারিখে ক্যালকুলেট করা হয় এবং ৫ তারিখের মধ্যে পেমেন্ট করা হয়।</span>
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
                      আপনার অর্জিত কমিশন উত্তোলন করুন
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <div className="bg-muted/30 p-4 rounded-lg mb-6">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm">বর্তমান ব্যালেন্স:</span>
                            <span className="font-bold text-lg">{affiliateData.balance}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">ন্যূনতম উত্তোলন:</span>
                            <span className="text-sm">৳৫০০</span>
                          </div>
                        </div>
                        
                        <form className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">উত্তোলন পরিমাণ</label>
                            <Input type="number" placeholder="৳১০০০" />
                            <p className="text-xs text-muted-foreground">ন্যূনতম ৳৫০০ উত্তোলন করতে হবে</p>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">পেমেন্ট পদ্ধতি</label>
                            <select className="w-full px-3 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent">
                              <option value="bkash">বিকাশ</option>
                              <option value="nagad">নগদ</option>
                              <option value="rocket">রকেট</option>
                              <option value="bank">ব্যাংক ট্রান্সফার</option>
                            </select>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">একাউন্ট নম্বর/বিবরণ</label>
                            <Input type="text" placeholder="০১৭xxxxxxxx" />
                          </div>
                          
                          <Button type="submit" className="w-full bg-accent text-white hover:bg-accent/90">
                            উত্তোলন অনুরোধ
                          </Button>
                        </form>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-4">উত্তোলন হিস্টোরি</h3>
                        <div className="bg-muted/30 p-4 rounded-lg text-center py-8">
                          <p className="text-muted-foreground">কোন উত্তোলন হিস্টোরি নেই</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            {/* মার্কেটিং রিসোর্সেস */}
            <section>
              <h2 className="text-2xl font-bold mb-6">মার্কেটিং রিসোর্সেস</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-card border-accent/20">
                  <CardHeader>
                    <CardTitle>ব্যানার</CardTitle>
                    <CardDescription>
                      আকর্ষণীয় ব্যানার ব্যবহার করুন আপনার ওয়েবসাইটে
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center p-4">
                    <div className="w-full h-32 bg-muted/50 rounded flex items-center justify-center border border-dashed border-muted-foreground/20">
                      <p className="text-sm text-muted-foreground">ব্যানার প্রিভিউ</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      ব্যানার ডাউনলোড করুন
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="bg-card border-accent/20">
                  <CardHeader>
                    <CardTitle>প্রমোশনাল টেক্সট</CardTitle>
                    <CardDescription>
                      আপনার সোশ্যাল মিডিয়াতে শেয়ার করার জন্য
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      readOnly 
                      value="TK999-এ জয়েন করুন, বাংলাদেশের সবচেয়ে বিশ্বস্ত অনলাইন গেমিং প্ল্যাটফর্ম! ৫০০ টাকার স্বাগতম বোনাস পান এখনই! [আপনার রেফারেল লিংক]"
                      className="min-h-24"
                    />
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      কপি করুন
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="bg-card border-accent/20">
                  <CardHeader>
                    <CardTitle>স্পেশাল অফার</CardTitle>
                    <CardDescription>
                      আপনার রেফারেলদের জন্য বিশেষ অফার
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border border-dashed border-accent p-3 rounded-lg">
                      <h4 className="font-semibold text-sm mb-1">এক্সক্লুসিভ কোড: TKSPECIAL</h4>
                      <p className="text-xs text-muted-foreground">
                        আপনার রেফারেলরা এই কোড ব্যবহার করে অতিরিক্ত ১০% বোনাস পাবে
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      বিস্তারিত দেখুন
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </section>
          </>
        ) : (
          // লগড আউট অবস্থা - এফিলিয়েট সাইনআপ
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">আমাদের এফিলিয়েট প্রোগ্রামে যোগ দিন</h2>
                <p className="text-muted-foreground">
                  TK999 এফিলিয়েট প্রোগ্রাম আপনাকে আপনার ওয়েবসাইট, সোশ্যাল মিডিয়া, বা অন্যান্য মার্কেটিং চ্যানেলের মাধ্যমে আয় করার সুযোগ দেয়। আমাদের প্ল্যাটফর্মে নতুন প্লেয়ার নিয়ে আসুন এবং আকর্ষণীয় কমিশন পান।
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-card/50 border-accent/20">
                    <CardContent className="pt-6">
                      <div className="mb-3 p-2 bg-accent/10 w-10 h-10 rounded-full flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-accent" />
                      </div>
                      <h3 className="font-bold mb-2">উচ্চ কমিশন রেট</h3>
                      <p className="text-sm text-muted-foreground">
                        ৪৫% পর্যন্ত রেভিনিউ শেয়ার এবং আকর্ষণীয় বোনাস প্রোগ্রাম
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card/50 border-accent/20">
                    <CardContent className="pt-6">
                      <div className="mb-3 p-2 bg-accent/10 w-10 h-10 rounded-full flex items-center justify-center">
                        <LineChart className="h-5 w-5 text-accent" />
                      </div>
                      <h3 className="font-bold mb-2">দ্রুত পেমেন্ট</h3>
                      <p className="text-sm text-muted-foreground">
                        প্রতি মাসের ৫ তারিখের মধ্যে নিয়মিত পেমেন্ট, ন্যূনতম ৫০০ টাকা
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card/50 border-accent/20">
                    <CardContent className="pt-6">
                      <div className="mb-3 p-2 bg-accent/10 w-10 h-10 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-accent" />
                      </div>
                      <h3 className="font-bold mb-2">আজীবন কমিশন</h3>
                      <p className="text-sm text-muted-foreground">
                        আপনার রেফারের আজীবন কার্যকলাপের উপর কমিশন পান
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card/50 border-accent/20">
                    <CardContent className="pt-6">
                      <div className="mb-3 p-2 bg-accent/10 w-10 h-10 rounded-full flex items-center justify-center">
                        <Gift className="h-5 w-5 text-accent" />
                      </div>
                      <h3 className="font-bold mb-2">বিশেষ বোনাস</h3>
                      <p className="text-sm text-muted-foreground">
                        নিয়মিত প্রমোশন এবং উৎস্বের সময় স্পেশাল বোনাস
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="bg-muted/30 border-accent/20">
                  <CardContent className="pt-6">
                    <h3 className="font-bold mb-3 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-accent" />
                      <span>কিভাবে শুরু করবেন</span>
                    </h3>
                    <ol className="space-y-3 pl-6 list-decimal">
                      <li className="text-sm text-muted-foreground">
                        TK999 এ রেজিস্ট্রেশন করুন বা লগইন করুন
                      </li>
                      <li className="text-sm text-muted-foreground">
                        আপনার অ্যাকাউন্টে "এফিলিয়েট" সেকশনে যান
                      </li>
                      <li className="text-sm text-muted-foreground">
                        এফিলিয়েট এগ্রিমেন্ট পড়ুন এবং সাইন আপ করুন
                      </li>
                      <li className="text-sm text-muted-foreground">
                        আপনার ইউনিক রেফারেল লিংক পান এবং শেয়ার করা শুরু করুন
                      </li>
                      <li className="text-sm text-muted-foreground">
                        যত বেশি প্লেয়ার আপনি রেফার করবেন, তত বেশি কমিশন পাবেন!
                      </li>
                    </ol>
                  </CardContent>
                </Card>
                
                <div className="text-center pt-6">
                  <Button variant="accent" size="lg" className="px-8">
                    এখনই জয়েন করুন
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-muted/30 rounded-lg p-6 space-y-6">
                  <h3 className="text-xl font-bold">আয় উদাহরণ</h3>
                  <p className="text-muted-foreground text-sm">
                    আমাদের এফিলিয়েট প্রোগ্রাম কিভাবে আপনাকে আয় করতে সাহায্য করবে:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-card rounded-lg p-4 border border-border">
                      <h4 className="font-semibold mb-2">উদাহরণ ১: মাসিক ৫ জন রেফারেল</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">মাসিক রেফারেল:</span>
                          <span>৫ জন</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">গড় ডিপোজিট:</span>
                          <span>৳২,০০০ প্রতি ব্যক্তি</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">প্লেয়ার নেট লস:</span>
                          <span>১০-২০% (ডিপোজিটের)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">কমিশন রেট:</span>
                          <span>৩০% (সিলভার লেভেল)</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-semibold">
                          <span>মাসিক আয়:</span>
                          <span className="text-accent">৳৩,০০০-৬,০০০</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span>বার্ষিক আয়:</span>
                          <span className="text-accent">৳৩৬,০০০-৭২,০০০</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-card rounded-lg p-4 border border-border">
                      <h4 className="font-semibold mb-2">উদাহরণ ২: মাসিক ২০ জন রেফারেল</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">মাসিক রেফারেল:</span>
                          <span>২০ জন</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">গড় ডিপোজিট:</span>
                          <span>৳২,০০০ প্রতি ব্যক্তি</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">প্লেয়ার নেট লস:</span>
                          <span>১০-২০% (ডিপোজিটের)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">কমিশন রেট:</span>
                          <span>৩৫% (গোল্ড লেভেল)</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-semibold">
                          <span>মাসিক আয়:</span>
                          <span className="text-accent">৳১৪,০০০-২৮,০০০</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span>বার্ষিক আয়:</span>
                          <span className="text-accent">৳১৬৮,০০০-৩৩৬,০০০</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground italic">
                    * উপরের হিসাবগুলো একটি প্রাথমিক অনুমান। প্রকৃত আয় রেফারেল প্লেয়ারদের কার্যকলাপের উপর নির্ভর করে।
                  </p>
                </div>
                
                <Card className="border-accent/20">
                  <CardHeader>
                    <CardTitle>টেস্টিমোনিয়াল</CardTitle>
                    <CardDescription>আমাদের সফল এফিলিয়েটদের অভিজ্ঞতা জানুন</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm italic mb-3">
                          "আমি গত ১ বছর ধরে TK999 এর এফিলিয়েট হিসেবে কাজ করছি। প্রথম মাসে আমি মাত্র ৳৩,০০০ আয় করেছিলাম, কিন্তু এখন প্রতি মাসে ৳২০,০০০+ আয় করি। দ্রুত পেমেন্ট এবং ভাল সাপোর্ট পাওয়া যায়।"
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">- রাহুল (এফিলিয়েট সিনিয়র)</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map(star => (
                              <svg key={star} className="h-4 w-4 fill-accent" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : (
          // নন-লগইন অবস্থা - এফিলিয়েট সাইন-আপ পেজ
          <>
            {/* ইন্ট্রো হিরো সেকশন */}
            <section className="mb-10 relative overflow-hidden rounded-xl border border-accent/20 bg-gradient-to-r from-black to-slate-900">
              <div className="flex flex-col md:flex-row">
                <div className="p-8 md:p-10 md:w-3/5 z-10">
                  <Badge className="bg-accent mb-4">নতুন প্রোগ্রাম</Badge>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">অর্থ উপার্জন করুন আমাদের এফিলিয়েট প্রোগ্রামে</h2>
                  <p className="text-lg text-gray-300 mb-6">
                    বন্ধুদের রেফার করুন এবং তাদের প্রতিটি বেট এবং ডিপোজিটের জন্য উচ্চ কমিশন পান। আমাদের এফিলিয়েট প্রোগ্রামে যোগ দিন এবং শুরু করুন আজই!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="flex items-center gap-2">
                      শুরু করুন <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button size="lg" variant="outline" className="text-white border-white/20 bg-white/5">
                      আরও জানুন
                    </Button>
                  </div>
                  <div className="mt-6 flex items-center gap-6">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold">৪৫%</span>
                      <span className="text-xs text-gray-400">রেভিনিউ শেয়ার</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold">১৫%</span>
                      <span className="text-xs text-gray-400">ডিপোজিট বোনাস</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold">৳১০,০০০+</span>
                      <span className="text-xs text-gray-400">মাসিক আয়</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block md:w-2/5 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-full bg-accent/20"></div>
                </div>
              </div>
            </section>
            
            {/* বৈশিষ্ট্য সেকশন */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-center">কেন আমাদের এফিলিয়েট প্রোগ্রাম বেছে নেবেন</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="bg-card border-accent/20">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center mb-2">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                        <DollarSign className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">উচ্চ কমিশন রেট</h3>
                      <p className="text-muted-foreground text-sm">
                        শিল্পের মধ্যে সর্বোচ্চ ৪৫% রেভিনিউ শেয়ার এবং ১৫% ডিপোজিট বোনাস পান
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-accent/20">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center mb-2">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                        <Zap className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">দ্রুত পেমেন্ট</h3>
                      <p className="text-muted-foreground text-sm">
                        নির্ভরযোগ্য এবং সময়মত পেমেন্ট - মাসিক বা অনুরোধ অনুযায়ী উত্তোলন করুন
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-accent/20">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center mb-2">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                        <Shield className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">আজীবন কমিশন</h3>
                      <p className="text-muted-foreground text-sm">
                        আপনার রেফারেল ব্যবহারকারীদের আজীবন কার্যকলাপের উপর কমিশন পান
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
            
            {/* কাজের প্রক্রিয়া */}
            <section className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">কিভাবে শুরু করবেন</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  মাত্র তিনটি সহজ ধাপে আমাদের এফিলিয়েট প্রোগ্রামে যোগ দিন এবং আয় শুরু করুন
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="relative">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                      <span className="text-2xl font-bold text-accent">১</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">সাইন আপ করুন</h3>
                    <p className="text-muted-foreground text-sm">
                      একটি ফ্রি অ্যাকাউন্ট তৈরি করুন এবং এফিলিয়েট প্রোগ্রামে যোগ দিন
                    </p>
                  </div>
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-accent/20"></div>
                </div>
                
                <div className="relative">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                      <span className="text-2xl font-bold text-accent">২</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">প্রমোট করুন</h3>
                    <p className="text-muted-foreground text-sm">
                      আপনার অনন্য রেফারেল লিংক ব্যবহার করে আমাদের সাইট প্রমোট করুন
                    </p>
                  </div>
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-accent/20"></div>
                </div>
                
                <div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-accent">৩</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">আয় করুন</h3>
                    <p className="text-muted-foreground text-sm">
                      আপনার রেফারেল ব্যবহারকারীদের কার্যকলাপের উপর কমিশন পান
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-8">
                <Button className="gap-2">
                  <Users className="h-4 w-4" />
                  রেজিষ্ট্রেশন করুন
                </Button>
              </div>
            </section>
            
            {/* কমিশন স্ট্রাকচার */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">আমাদের কমিশন স্ট্রাকচার</h2>
              <Card className="bg-card border-accent/20">
                <CardContent className="p-0">
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
                </CardContent>
              </Card>
            </section>
            
            {/* মার্কেটিং টুলস */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">এফিলিয়েট মার্কেটিং টুলস</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-card border-accent/20">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                        <FileText className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="font-semibold mb-2">ব্যানার</h3>
                      <p className="text-xs text-muted-foreground">
                        আকর্ষণীয় ব্যানার এবং ক্রিয়েটিভ
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-accent/20">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                        <LineChart className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="font-semibold mb-2">ট্র্যাকিং</h3>
                      <p className="text-xs text-muted-foreground">
                        রিয়েল-টাইম পারফরম্যান্স ট্র্যাকিং
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-accent/20">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                        <Smartphone className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="font-semibold mb-2">মোবাইল অপ্টিমাইজড</h3>
                      <p className="text-xs text-muted-foreground">
                        মোবাইল-ফ্রেন্ডলি প্রমোশন টুলস
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-card border-accent/20">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                        <Share2 className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="font-semibold mb-2">সোশ্যাল শেয়ারিং</h3>
                      <p className="text-xs text-muted-foreground">
                        সোশ্যাল মিডিয়া ইন্টিগ্রেশন টুলস
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
            
            {/* রেজিস্ট্রেশন সেকশন */}
            <section className="mb-8">
              <Card className="bg-card border-accent/20">
                <CardHeader>
                  <CardTitle>এফিলিয়েট প্রোগ্রামে যোগ দিন</CardTitle>
                  <CardDescription>
                    একটি অ্যাকাউন্ট তৈরি করুন এবং আজই আমাদের এফিলিয়েট প্রোগ্রামে যোগ দিন
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <form className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">আপনার নাম</label>
                          <Input type="text" placeholder="নাম লিখুন" />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">ইমেইল</label>
                          <Input type="email" placeholder="email@example.com" />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">ফোন নম্বর</label>
                          <Input type="tel" placeholder="01xxxxxxxxx" />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">আপনি কিভাবে প্রমোট করবেন?</label>
                          <Textarea placeholder="আপনার মার্কেটিং স্ট্র্যাটেজি সম্পর্কে সংক্ষেপে লিখুন" />
                        </div>
                        
                        <Button type="submit" className="w-full">রেজিস্ট্রেশন করুন</Button>
                      </form>
                    </div>
                    
                    <div className="bg-muted/30 p-6 rounded-lg space-y-4">
                      <h3 className="text-lg font-semibold mb-2">এফিলিয়েট সুবিধা</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <span className="bg-accent/10 text-accent p-1 rounded mt-0.5">
                            <Check className="h-3 w-3" />
                          </span>
                          <span className="text-sm">উচ্চ কমিশন রেট - ৪৫% পর্যন্ত রেভিনিউ শেয়ার</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-accent/10 text-accent p-1 rounded mt-0.5">
                            <Check className="h-3 w-3" />
                          </span>
                          <span className="text-sm">দ্রুত এবং নিয়মিত পেমেন্ট</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-accent/10 text-accent p-1 rounded mt-0.5">
                            <Check className="h-3 w-3" />
                          </span>
                          <span className="text-sm">ব্যক্তিগত এফিলিয়েট ম্যানেজার</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-accent/10 text-accent p-1 rounded mt-0.5">
                            <Check className="h-3 w-3" />
                          </span>
                          <span className="text-sm">আকর্ষণীয় মার্কেটিং উপকরণ</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-accent/10 text-accent p-1 rounded mt-0.5">
                            <Check className="h-3 w-3" />
                          </span>
                          <span className="text-sm">আজীবন রেফারেল ট্র্যাকিং</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-accent/10 text-accent p-1 rounded mt-0.5">
                            <Check className="h-3 w-3" />
                          </span>
                          <span className="text-sm">24/7 সাপোর্ট</span>
                        </li>
                      </ul>
                      
                      <div className="pt-4">
                        <p className="text-sm text-muted-foreground">
                          ইতিমধ্যে একটি অ্যাকাউন্ট আছে? <a href="/auth" className="text-accent hover:underline">লগইন করুন</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
            
            {/* FAQ সেকশন */}
            <section>
              <h2 className="text-2xl font-bold mb-6">সচরাচর জিজ্ঞাসিত প্রশ্ন</h2>
              <Accordion type="single" collapsible className="mb-4">
                <AccordionItem value="item-1">
                  <AccordionTrigger>কিভাবে আমি এফিলিয়েট হিসেবে সাইন আপ করব?</AccordionTrigger>
                  <AccordionContent>
                    আপনি উপরের ফর্মটি পূরণ করে সহজেই সাইন আপ করতে পারেন। আমাদের টিম আপনার আবেদন পর্যালোচনা করবে এবং 24 ঘন্টার মধ্যে আপনাকে অবহিত করবে।
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>আমি কিভাবে এফিলিয়েট কমিশন পাব?</AccordionTrigger>
                  <AccordionContent>
                    আপনি আপনার রেফারেল ব্যবহারকারীদের কার্যকলাপের উপর কমিশন পাবেন। আপনি তাদের নেট লসের উপর রেভিনিউ শেয়ার এবং তাদের প্রথম ডিপোজিটের উপর বোনাস পাবেন। কমিশন প্রতি মাসে ক্যালকুলেট করা হয় এবং আপনার এফিলিয়েট অ্যাকাউন্টে যোগ করা হয়।
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>কি ধরনের মার্কেটিং উপকরণ আপনারা প্রদান করেন?</AccordionTrigger>
                  <AccordionContent>
                    আমরা বিভিন্ন আকারের ব্যানার, লোগো, ল্যান্ডিং পেজ, টেক্সট লিংক, এবং প্রমোশনাল কন্টেন্ট প্রদান করি। এছাড়াও, আপনার ক্যাম্পেইন সাফল্যের জন্য রিয়েল-টাইম ট্র্যাকিং এবং রিপোর্টিং টুলস রয়েছে।
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>কিভাবে আমি আমার কমিশন উত্তোলন করব?</AccordionTrigger>
                  <AccordionContent>
                    আপনি আপনার পছন্দের পেমেন্ট পদ্ধতি ব্যবহার করে কমিশন উত্তোলন করতে পারেন, যেমন ব্যাংক ট্রান্সফার, বিকাশ, নগদ, বা রকেট। ন্যূনতম উত্তোলনের পরিমাণ হল ৳৫০০।
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>কোন ধরনের ওয়েবসাইট বা সোশ্যাল মিডিয়া অ্যাকাউন্ট প্রমোশনের জন্য অনুমোদিত?</AccordionTrigger>
                  <AccordionContent>
                    আমরা বেশিরভাগ ওয়েবসাইট এবং সোশ্যাল মিডিয়া প্ল্যাটফর্ম অনুমোদন করি, তবে সেগুলি অবশ্যই আমাদের নীতিমালা অনুসরণ করতে হবে। স্প্যাম, অবৈধ কন্টেন্ট, বা অপ্রাপ্তবয়স্কদের লক্ষ্য করা ওয়েবসাইট/প্ল্যাটফর্ম অনুমোদিত নয়।
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