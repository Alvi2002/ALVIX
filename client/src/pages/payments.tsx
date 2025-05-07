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
  CreditCard,
  Landmark,
  Smartphone,
  Wallet,
  Clock,
  BadgeHelp,
  PiggyBank,
  ShieldCheck,
  ArrowUpRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PaymentsPage() {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // পেমেন্ট পদ্ধতি ডেটা
  const paymentMethods = {
    deposit: [
      {
        id: 'bkash',
        name: 'বিকাশ',
        type: 'mobile',
        icon: <Smartphone className="h-5 w-5" />,
        minAmount: 500,
        maxAmount: 50000,
        processingTime: 'তাৎক্ষণিক',
        fee: '0%',
        popular: true,
        steps: [
          'আপনার TK999 অ্যাকাউন্টে লগইন করুন এবং "ডিপোজিট" বিকল্পে ক্লিক করুন',
          'পেমেন্ট পদ্ধতি হিসাবে "বিকাশ" সিলেক্ট করুন',
          'আপনার ডিপোজিট পরিমাণ এবং বিকাশ নম্বর দিন',
          'আপনার বিকাশ অ্যাপ খুলুন এবং পেমেন্ট করুন',
          'প্রক্রিয়া সম্পূর্ণ হওয়ার পর, আপনার TK999 অ্যাকাউন্টে টাকা দেখাবে'
        ]
      },
      {
        id: 'rocket',
        name: 'রকেট',
        type: 'mobile',
        icon: <Smartphone className="h-5 w-5" />,
        minAmount: 500,
        maxAmount: 30000,
        processingTime: 'তাৎক্ষণিক থেকে ৩০ মিনিট',
        fee: '0%',
        popular: false,
        steps: [
          'আপনার TK999 অ্যাকাউন্টে লগইন করুন এবং "ডিপোজিট" বিকল্পে ক্লিক করুন',
          'পেমেন্ট পদ্ধতি হিসাবে "রকেট" সিলেক্ট করুন',
          'আপনার ডিপোজিট পরিমাণ এবং রকেট নম্বর দিন',
          'আপনার রকেট মোবাইল মেনু ব্যবহার করে পেমেন্ট করুন',
          'প্রক্রিয়া সম্পূর্ণ হওয়ার পর, আপনার TK999 অ্যাকাউন্টে টাকা দেখাবে'
        ]
      },
      {
        id: 'nagad',
        name: 'নগদ',
        type: 'mobile',
        icon: <Smartphone className="h-5 w-5" />,
        minAmount: 500,
        maxAmount: 50000,
        processingTime: 'তাৎক্ষণিক',
        fee: '0%',
        popular: true,
        steps: [
          'আপনার TK999 অ্যাকাউন্টে লগইন করুন এবং "ডিপোজিট" বিকল্পে ক্লিক করুন',
          'পেমেন্ট পদ্ধতি হিসাবে "নগদ" সিলেক্ট করুন',
          'আপনার ডিপোজিট পরিমাণ এবং নগদ নম্বর দিন',
          'আপনার নগদ অ্যাপ খুলুন এবং পেমেন্ট করুন',
          'প্রক্রিয়া সম্পূর্ণ হওয়ার পর, আপনার TK999 অ্যাকাউন্টে টাকা দেখাবে'
        ]
      },
      {
        id: 'bank-transfer',
        name: 'ব্যাংক ট্রান্সফার',
        type: 'bank',
        icon: <Landmark className="h-5 w-5" />,
        minAmount: 1000,
        maxAmount: 1000000,
        processingTime: '১-২৪ ঘন্টা',
        fee: '0%',
        popular: false,
        steps: [
          'আপনার TK999 অ্যাকাউন্টে লগইন করুন এবং "ডিপোজিট" বিকল্পে ক্লিক করুন',
          'পেমেন্ট পদ্ধতি হিসাবে "ব্যাংক ট্রান্সফার" সিলেক্ট করুন',
          'আমাদের ব্যাংক অ্যাকাউন্ট বিবরণ নোট করুন',
          'আপনার ব্যাংক অ্যাপ বা ব্যাংক ব্রাঞ্চ থেকে ট্রান্সফার করুন',
          'ট্রানজেকশন আইডি/রেফারেন্স সহ ট্রান্সফারের প্রমাণ আপলোড করুন',
          'আমাদের টিম এটি যাচাই করবে এবং আপনার অ্যাকাউন্টে টাকা যোগ করবে'
        ]
      },
      {
        id: 'card',
        name: 'ক্রেডিট/ডেবিট কার্ড',
        type: 'card',
        icon: <CreditCard className="h-5 w-5" />,
        minAmount: 1000,
        maxAmount: 100000,
        processingTime: 'তাৎক্ষণিক',
        fee: '2%',
        popular: false,
        steps: [
          'আপনার TK999 অ্যাকাউন্টে লগইন করুন এবং "ডিপোজিট" বিকল্পে ক্লিক করুন',
          'পেমেন্ট পদ্ধতি হিসাবে "ক্রেডিট/ডেবিট কার্ড" সিলেক্ট করুন',
          'আপনার ডিপোজিট পরিমাণ লিখুন',
          'আপনার কার্ড বিবরণ দিন এবং "পেমেন্ট করুন" বাটনে ক্লিক করুন',
          'প্রক্রিয়া সম্পূর্ণ হওয়ার পর, আপনার TK999 অ্যাকাউন্টে টাকা দেখাবে'
        ]
      },
      {
        id: 'crypto',
        name: 'ক্রিপ্টোকারেন্সি',
        type: 'crypto',
        icon: <Wallet className="h-5 w-5" />,
        minAmount: 1000,
        maxAmount: 1000000,
        processingTime: '১-৬ নিশ্চিতকরণ',
        fee: '0%',
        popular: false,
        steps: [
          'আপনার TK999 অ্যাকাউন্টে লগইন করুন এবং "ডিপোজিট" বিকল্পে ক্লিক করুন',
          'পেমেন্ট পদ্ধতি হিসাবে "ক্রিপ্টোকারেন্সি" সিলেক্ট করুন',
          'আপনার পছন্দের ক্রিপ্টোকারেন্সি চয়ন করুন (BTC, ETH, USDT, ইত্যাদি)',
          'আমাদের ওয়ালেট ঠিকানায় ট্রান্সফার করুন',
          'নিশ্চিতকরণের পর, আপনার অ্যাকাউন্টে ব্যালেন্স যোগ করা হবে'
        ]
      }
    ],
    withdraw: [
      {
        id: 'bkash-withdraw',
        name: 'বিকাশ',
        type: 'mobile',
        icon: <Smartphone className="h-5 w-5" />,
        minAmount: 500,
        maxAmount: 25000,
        processingTime: '১-২৪ ঘন্টা',
        fee: '1.5%',
        popular: true,
        steps: [
          'আপনার TK999 অ্যাকাউন্টে লগইন করুন এবং "উত্তোলন" বিকল্পে ক্লিক করুন',
          'পেমেন্ট পদ্ধতি হিসাবে "বিকাশ" সিলেক্ট করুন',
          'আপনার উত্তোলন পরিমাণ এবং বিকাশ নম্বর দিন',
          'আপনার উত্তোলন অনুরোধ নিশ্চিত করুন',
          'আমাদের টিম এটি প্রক্রিয়া করবে এবং আপনার বিকাশ অ্যাকাউন্টে টাকা পাঠাবে'
        ]
      },
      {
        id: 'nagad-withdraw',
        name: 'নগদ',
        type: 'mobile',
        icon: <Smartphone className="h-5 w-5" />,
        minAmount: 500,
        maxAmount: 25000,
        processingTime: '১-২৪ ঘন্টা',
        fee: '1.5%',
        popular: true,
        steps: [
          'আপনার TK999 অ্যাকাউন্টে লগইন করুন এবং "উত্তোলন" বিকল্পে ক্লিক করুন',
          'পেমেন্ট পদ্ধতি হিসাবে "নগদ" সিলেক্ট করুন',
          'আপনার উত্তোলন পরিমাণ এবং নগদ নম্বর দিন',
          'আপনার উত্তোলন অনুরোধ নিশ্চিত করুন',
          'আমাদের টিম এটি প্রক্রিয়া করবে এবং আপনার নগদ অ্যাকাউন্টে টাকা পাঠাবে'
        ]
      },
      {
        id: 'rocket-withdraw',
        name: 'রকেট',
        type: 'mobile',
        icon: <Smartphone className="h-5 w-5" />,
        minAmount: 500,
        maxAmount: 20000,
        processingTime: '১-২৪ ঘন্টা',
        fee: '1.5%',
        popular: false,
        steps: [
          'আপনার TK999 অ্যাকাউন্টে লগইন করুন এবং "উত্তোলন" বিকল্পে ক্লিক করুন',
          'পেমেন্ট পদ্ধতি হিসাবে "রকেট" সিলেক্ট করুন',
          'আপনার উত্তোলন পরিমাণ এবং রকেট নম্বর দিন',
          'আপনার উত্তোলন অনুরোধ নিশ্চিত করুন',
          'আমাদের টিম এটি প্রক্রিয়া করবে এবং আপনার রকেট অ্যাকাউন্টে টাকা পাঠাবে'
        ]
      },
      {
        id: 'bank-withdraw',
        name: 'ব্যাংক ট্রান্সফার',
        type: 'bank',
        icon: <Landmark className="h-5 w-5" />,
        minAmount: 1000,
        maxAmount: 500000,
        processingTime: '১-৩ কার্যদিবস',
        fee: '0.5%',
        popular: false,
        steps: [
          'আপনার TK999 অ্যাকাউন্টে লগইন করুন এবং "উত্তোলন" বিকল্পে ক্লিক করুন',
          'পেমেন্ট পদ্ধতি হিসাবে "ব্যাংক ট্রান্সফার" সিলেক্ট করুন',
          'আপনার ব্যাংক অ্যাকাউন্ট বিবরণ সম্পূর্ণ করুন (ব্যাংকের নাম, ব্রাঞ্চ, অ্যাকাউন্ট নম্বর)',
          'আপনার উত্তোলন পরিমাণ দিন',
          'আপনার উত্তোলন অনুরোধ নিশ্চিত করুন',
          'আমাদের টিম এটি প্রক্রিয়া করবে এবং আপনার ব্যাংক অ্যাকাউন্টে টাকা পাঠাবে'
        ]
      },
      {
        id: 'crypto-withdraw',
        name: 'ক্রিপ্টোকারেন্সি',
        type: 'crypto',
        icon: <Wallet className="h-5 w-5" />,
        minAmount: 2000,
        maxAmount: 1000000,
        processingTime: '১-২৪ ঘন্টা',
        fee: '1%',
        popular: false,
        steps: [
          'আপনার TK999 অ্যাকাউন্টে লগইন করুন এবং "উত্তোলন" বিকল্পে ক্লিক করুন',
          'পেমেন্ট পদ্ধতি হিসাবে "ক্রিপ্টোকারেন্সি" সিলেক্ট করুন',
          'আপনার পছন্দের ক্রিপ্টোকারেন্সি চয়ন করুন (BTC, ETH, USDT, ইত্যাদি)',
          'আপনার ক্রিপ্টো ওয়ালেট ঠিকানা দিন',
          'আপনার উত্তোলন পরিমাণ দিন',
          'আপনার উত্তোলন অনুরোধ নিশ্চিত করুন',
          'আমাদের টিম এটি প্রক্রিয়া করবে এবং আপনার ওয়ালেট ঠিকানায় ক্রিপ্টো পাঠাবে'
        ]
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isLoggedIn={!!user} onLogout={handleLogout} />
      <MobileMenu />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">পেমেন্ট পদ্ধতি</h1>
          <p className="text-muted-foreground">
            TK999 এ আমরা বিভিন্ন পেমেন্ট পদ্ধতি সমর্থন করি। আপনার সুবিধামত যেকোনো পদ্ধতি বেছে নিন।
          </p>
        </div>
        
        <Tabs defaultValue="deposit" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deposit" className="gap-2">
              <PiggyBank className="h-4 w-4" />
              <span>ডিপোজিট পদ্ধতি</span>
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="gap-2">
              <Wallet className="h-4 w-4" />
              <span>উত্তোলন পদ্ধতি</span>
            </TabsTrigger>
          </TabsList>
          
          {/* ডিপোজিট পদ্ধতি */}
          <TabsContent value="deposit" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paymentMethods.deposit.map((method) => (
                <Card key={method.id} className="bg-card border-accent/20 overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent/10 rounded-full">
                          {method.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{method.name}</CardTitle>
                          <CardDescription>
                            {method.type === 'mobile' ? 'মোবাইল ব্যাংকিং' : 
                             method.type === 'bank' ? 'ব্যাংকিং' : 
                             method.type === 'card' ? 'কার্ড পেমেন্ট' : 
                             'ক্রিপ্টোকারেন্সি'}
                          </CardDescription>
                        </div>
                      </div>
                      {method.popular && (
                        <Badge className="bg-accent text-secondary">জনপ্রিয়</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-muted-foreground">ন্যূনতম পরিমাণ</div>
                        <div className="font-semibold">৳ {method.minAmount.toLocaleString('bn-BD')}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">সর্বোচ্চ পরিমাণ</div>
                        <div className="font-semibold">৳ {method.maxAmount.toLocaleString('bn-BD')}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">প্রক্রিয়াকরণ সময়</div>
                        <div className="font-semibold flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                          {method.processingTime}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">ফি</div>
                        <div className="font-semibold">{method.fee}</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/10 pt-4">
                    <Button variant="accent" className="w-full">ডিপোজিট করুন</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* উত্তোলন পদ্ধতি */}
          <TabsContent value="withdraw" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paymentMethods.withdraw.map((method) => (
                <Card key={method.id} className="bg-card border-accent/20 overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent/10 rounded-full">
                          {method.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{method.name}</CardTitle>
                          <CardDescription>
                            {method.type === 'mobile' ? 'মোবাইল ব্যাংকিং' : 
                             method.type === 'bank' ? 'ব্যাংকিং' : 
                             method.type === 'card' ? 'কার্ড পেমেন্ট' : 
                             'ক্রিপ্টোকারেন্সি'}
                          </CardDescription>
                        </div>
                      </div>
                      {method.popular && (
                        <Badge className="bg-accent text-secondary">জনপ্রিয়</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-muted-foreground">ন্যূনতম পরিমাণ</div>
                        <div className="font-semibold">৳ {method.minAmount.toLocaleString('bn-BD')}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">সর্বোচ্চ পরিমাণ</div>
                        <div className="font-semibold">৳ {method.maxAmount.toLocaleString('bn-BD')}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">প্রক্রিয়াকরণ সময়</div>
                        <div className="font-semibold flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                          {method.processingTime}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">ফি</div>
                        <div className="font-semibold">{method.fee}</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/10 pt-4">
                    <Button variant="accent" className="w-full">উত্তোলন করুন</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* দ্রুত নির্দেশিকা */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">দ্রুত নির্দেশিকা</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="h-5 w-5 text-accent" />
                  <span>কিভাবে ডিপোজিট করবেন</span>
                </CardTitle>
                <CardDescription>TK999 অ্যাকাউন্টে টাকা জমা করার সহজ পদ্ধতি</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="bg-accent/10 text-accent rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                  <p className="text-sm text-muted-foreground">আপনার TK999 অ্যাকাউন্টে লগইন করুন</p>
                </div>
                <div className="flex gap-3">
                  <div className="bg-accent/10 text-accent rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                  <p className="text-sm text-muted-foreground">ওয়ালেট মেনুতে ক্লিক করুন এবং "ডিপোজিট" অপশন সিলেক্ট করুন</p>
                </div>
                <div className="flex gap-3">
                  <div className="bg-accent/10 text-accent rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                  <p className="text-sm text-muted-foreground">আপনার পছন্দের পেমেন্ট পদ্ধতি সিলেক্ট করুন</p>
                </div>
                <div className="flex gap-3">
                  <div className="bg-accent/10 text-accent rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
                  <p className="text-sm text-muted-foreground">আপনার ডিপোজিট পরিমাণ এবং অন্যান্য প্রয়োজনীয় তথ্য পূরণ করুন</p>
                </div>
                <div className="flex gap-3">
                  <div className="bg-accent/10 text-accent rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">5</div>
                  <p className="text-sm text-muted-foreground">পেমেন্ট সম্পূর্ণ করুন এবং নিশ্চিতকরণ অপেক্ষা করুন</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-accent" />
                  <span>কিভাবে উত্তোলন করবেন</span>
                </CardTitle>
                <CardDescription>TK999 অ্যাকাউন্ট থেকে টাকা উত্তোলন করার সহজ পদ্ধতি</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="bg-accent/10 text-accent rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                  <p className="text-sm text-muted-foreground">আপনার TK999 অ্যাকাউন্টে লগইন করুন</p>
                </div>
                <div className="flex gap-3">
                  <div className="bg-accent/10 text-accent rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                  <p className="text-sm text-muted-foreground">ওয়ালেট মেনুতে ক্লিক করুন এবং "উত্তোলন" অপশন সিলেক্ট করুন</p>
                </div>
                <div className="flex gap-3">
                  <div className="bg-accent/10 text-accent rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                  <p className="text-sm text-muted-foreground">আপনার পছন্দের উত্তোলন পদ্ধতি সিলেক্ট করুন</p>
                </div>
                <div className="flex gap-3">
                  <div className="bg-accent/10 text-accent rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
                  <p className="text-sm text-muted-foreground">উত্তোলন পরিমাণ এবং আপনার পেমেন্ট বিবরণ পূরণ করুন</p>
                </div>
                <div className="flex gap-3">
                  <div className="bg-accent/10 text-accent rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">5</div>
                  <p className="text-sm text-muted-foreground">উত্তোলন অনুরোধ নিশ্চিত করুন এবং প্রক্রিয়া সম্পূর্ণ হওয়ার জন্য অপেক্ষা করুন</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* প্রায়শই জিজ্ঞাসিত প্রশ্ন */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">পেমেন্ট সংক্রান্ত প্রশ্নোত্তর</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BadgeHelp className="h-5 w-5 text-accent" />
                  <span>আমার ডিপোজিট কতক্ষণে প্রসেস হবে?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  মোবাইল ব্যাংকিং পদ্ধতি (বিকাশ, নগদ, রকেট) দিয়ে ডিপোজিট সাধারণত তাৎক্ষণিক থেকে ৩০ মিনিটের মধ্যে প্রসেস হয়। ব্যাংক ট্রান্সফার ১-২৪ ঘন্টা এবং ক্রিপ্টোকারেন্সি ১-৬ নিশ্চিতকরণ সময় নিতে পারে। প্রতিটি পেমেন্ট পদ্ধতির জন্য সঠিক প্রক্রিয়াকরণ সময় আমাদের পেমেন্ট পৃষ্ঠায় দেওয়া আছে।
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BadgeHelp className="h-5 w-5 text-accent" />
                  <span>উত্তোলনে কি কোন ফি আছে?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  হ্যাঁ, উত্তোলনে কিছু ফি প্রযোজ্য হতে পারে। মোবাইল ব্যাংকিং পদ্ধতির জন্য ১.৫%, ব্যাংক ট্রান্সফারের জন্য ০.৫%, এবং ক্রিপ্টোকারেন্সি উত্তোলনের জন্য ১% ফি রয়েছে। সঠিক ফি এবং চার্জ জানতে আমাদের পেমেন্ট পৃষ্ঠা দেখুন।
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BadgeHelp className="h-5 w-5 text-accent" />
                  <span>কেন আমার উত্তোলন অনুরোধ বাতিল হয়েছে?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  উত্তোলন অনুরোধ বাতিল হওয়ার কারণগুলি হতে পারে: অনুরোধে ভুল তথ্য দেওয়া, অপর্যাপ্ত অ্যাকাউন্ট যাচাইকরণ (KYC), ওয়েজারিং প্রয়োজনীয়তা পূরণ না করা, বা অপর্যাপ্ত ব্যালেন্স। বিস্তারিত জানতে অনুগ্রহ করে আমাদের কাস্টমার সাপোর্টের সাথে যোগাযোগ করুন।
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BadgeHelp className="h-5 w-5 text-accent" />
                  <span>কেন আমাকে KYC দিতে হবে?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  KYC (Know Your Customer) যাচাইকরণ আপনার অ্যাকাউন্টের সুরক্ষা নিশ্চিত করতে এবং জালিয়াতি ও অর্থ পাচার প্রতিরোধের জন্য প্রয়োজন। নিয়ন্ত্রক প্রয়োজনীয়তা অনুসারে, আমাদের অবশ্যই আমাদের ব্যবহারকারীদের পরিচয় যাচাই করতে হবে। KYC সম্পূর্ণ করা উচ্চ মূল্যের উত্তোলনের জন্য বিশেষভাবে প্রয়োজনীয়।
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* সিকিউরিটি ও প্রাইভেসি */}
        <div>
          <Card className="bg-card border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-accent" />
                <span>আপনার পেমেন্ট সিকিউরিটি</span>
              </CardTitle>
              <CardDescription>TK999 এ আমরা আপনার অর্থ এবং ব্যক্তিগত তথ্যের সুরক্ষাকে সর্বোচ্চ গুরুত্ব দেই</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">SSL এনক্রিপশন</h3>
                <p className="text-sm text-muted-foreground">
                  আমরা আপনার সমস্ত লেনদেন সুরক্ষিত রাখতে 256-বিট SSL এনক্রিপশন ব্যবহার করি।
                </p>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">PCI DSS সম্মতি</h3>
                <p className="text-sm text-muted-foreground">
                  আমরা পেমেন্ট কার্ড ইন্ডাস্ট্রি ডেটা সিকিউরিটি স্ট্যান্ডার্ড (PCI DSS) অনুসরণ করি যাতে আপনার কার্ড ডেটা সুরক্ষিত থাকে।
                </p>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">ফ্রড মনিটরিং</h3>
                <p className="text-sm text-muted-foreground">
                  আমাদের সিস্টেম 24/7 সন্দেহজনক লেনদেনের জন্য আপনার অ্যাকাউন্ট পর্যবেক্ষণ করে।
                </p>
              </div>
              
              <div className="flex justify-center mt-4">
                <Button variant="outline" className="gap-2">
                  আরও জানুন
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}