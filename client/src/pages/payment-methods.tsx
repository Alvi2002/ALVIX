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

export default function PaymentMethodsPage() {
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
        icon: (
          <div className="bg-pink-600 rounded-full p-2 flex justify-center items-center">
            <span className="text-white font-bold">b</span>
          </div>
        ),
        logo: (
          <div className="w-10 h-10 bg-pink-600 rounded-full p-2 flex justify-center items-center">
            <span className="text-white font-bold text-lg">b</span>
          </div>
        ),
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
        icon: (
          <div className="bg-purple-700 rounded-full p-2 flex justify-center items-center">
            <span className="text-white font-bold">R</span>
          </div>
        ),
        logo: (
          <div className="w-10 h-10 bg-purple-700 rounded-full p-2 flex justify-center items-center">
            <span className="text-white font-bold text-lg">R</span>
          </div>
        ),
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
        icon: (
          <div className="bg-orange-600 rounded-full p-2 flex justify-center items-center">
            <span className="text-white font-bold">ন</span>
          </div>
        ),
        logo: (
          <div className="w-10 h-10 bg-orange-600 rounded-full p-2 flex justify-center items-center">
            <span className="text-white font-bold text-lg">ন</span>
          </div>
        ),
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
        icon: (
          <div className="bg-blue-700 rounded-full p-2 flex justify-center items-center">
            <Landmark className="h-5 w-5 text-white" />
          </div>
        ),
        logo: (
          <div className="w-10 h-10 bg-blue-700 rounded-full p-2 flex justify-center items-center">
            <Landmark className="h-6 w-6 text-white" />
          </div>
        ),
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
        icon: (
          <div className="bg-gray-700 rounded-full p-2 flex justify-center items-center">
            <CreditCard className="h-5 w-5 text-white" />
          </div>
        ),
        logo: (
          <div className="w-10 h-10 bg-gray-700 rounded-full p-2 flex justify-center items-center">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
        ),
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
        icon: (
          <div className="bg-yellow-500 rounded-full p-2 flex justify-center items-center">
            <Wallet className="h-5 w-5 text-white" />
          </div>
        ),
        logo: (
          <div className="w-10 h-10 bg-yellow-500 rounded-full p-2 flex justify-center items-center">
            <Wallet className="h-6 w-6 text-white" />
          </div>
        ),
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
        icon: (
          <div className="bg-pink-600 rounded-full p-2 flex justify-center items-center">
            <span className="text-white font-bold">b</span>
          </div>
        ),
        logo: (
          <div className="w-10 h-10 bg-pink-600 rounded-full p-2 flex justify-center items-center">
            <span className="text-white font-bold text-lg">b</span>
          </div>
        ),
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
        icon: (
          <div className="bg-orange-600 rounded-full p-2 flex justify-center items-center">
            <span className="text-white font-bold">ন</span>
          </div>
        ),
        logo: (
          <div className="w-10 h-10 bg-orange-600 rounded-full p-2 flex justify-center items-center">
            <span className="text-white font-bold text-lg">ন</span>
          </div>
        ),
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
        icon: (
          <div className="bg-purple-700 rounded-full p-2 flex justify-center items-center">
            <span className="text-white font-bold">R</span>
          </div>
        ),
        logo: (
          <div className="w-10 h-10 bg-purple-700 rounded-full p-2 flex justify-center items-center">
            <span className="text-white font-bold text-lg">R</span>
          </div>
        ),
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
        icon: (
          <div className="bg-blue-700 rounded-full p-2 flex justify-center items-center">
            <Landmark className="h-5 w-5 text-white" />
          </div>
        ),
        logo: (
          <div className="w-10 h-10 bg-blue-700 rounded-full p-2 flex justify-center items-center">
            <Landmark className="h-6 w-6 text-white" />
          </div>
        ),
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
        icon: (
          <div className="bg-yellow-500 rounded-full p-2 flex justify-center items-center">
            <Wallet className="h-5 w-5 text-white" />
          </div>
        ),
        logo: (
          <div className="w-10 h-10 bg-yellow-500 rounded-full p-2 flex justify-center items-center">
            <Wallet className="h-6 w-6 text-white" />
          </div>
        ),
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
                        <Badge variant="outline" className="border-accent text-accent">জনপ্রিয়</Badge>
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
                    <Button variant="default" className="w-full">ডিপোজিট করুন</Button>
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
                        <Badge variant="outline" className="border-accent text-accent">জনপ্রিয়</Badge>
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
                    <Button variant="default" className="w-full">উত্তোলন করুন</Button>
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
                  <div>
                    <p className="text-sm text-white">লগইন করুন</p>
                    <p className="text-xs text-muted-foreground">আপনার TK999 অ্যাকাউন্টে লগইন করুন</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-accent/10 text-accent rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                  <div>
                    <p className="text-sm text-white">ওয়ালেট পেজে যান</p>
                    <p className="text-xs text-muted-foreground">প্রোফাইল থেকে ওয়ালেট অপশনে ক্লিক করুন</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-accent/10 text-accent rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                  <div>
                    <p className="text-sm text-white">ডিপোজিট সিলেক্ট করুন</p>
                    <p className="text-xs text-muted-foreground">ডিপোজিট অপশনে ক্লিক করুন</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-accent/10 text-accent rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
                  <div>
                    <p className="text-sm text-white">পেমেন্ট পদ্ধতি বেছে নিন</p>
                    <p className="text-xs text-muted-foreground">আপনার পছন্দের পেমেন্ট পদ্ধতি নির্বাচন করুন</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-accent/10 text-accent rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">5</div>
                  <div>
                    <p className="text-sm text-white">পেমেন্ট সম্পন্ন করুন</p>
                    <p className="text-xs text-muted-foreground">নির্দেশাবলী অনুসরণ করে আপনার পেমেন্ট সম্পন্ন করুন</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-accent" />
                  <span>কিভাবে উত্তোলন করবেন</span>
                </CardTitle>
                <CardDescription>TK999 অ্যাকাউন্ট থেকে টাকা উত্তোলনের সহজ পদ্ধতি</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="bg-accent/10 text-accent rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                  <div>
                    <p className="text-sm text-white">লগইন করুন</p>
                    <p className="text-xs text-muted-foreground">আপনার TK999 অ্যাকাউন্টে লগইন করুন</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-accent/10 text-accent rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                  <div>
                    <p className="text-sm text-white">ওয়ালেট পেজে যান</p>
                    <p className="text-xs text-muted-foreground">প্রোফাইল থেকে ওয়ালেট অপশনে ক্লিক করুন</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-accent/10 text-accent rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                  <div>
                    <p className="text-sm text-white">উত্তোলন সিলেক্ট করুন</p>
                    <p className="text-xs text-muted-foreground">উত্তোলন অপশনে ক্লিক করুন</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-accent/10 text-accent rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
                  <div>
                    <p className="text-sm text-white">উত্তোলন পদ্ধতি বেছে নিন</p>
                    <p className="text-xs text-muted-foreground">আপনার পছন্দের উত্তোলন পদ্ধতি নির্বাচন করুন</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-accent/10 text-accent rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">5</div>
                  <div>
                    <p className="text-sm text-white">অনুরোধ জমা দিন</p>
                    <p className="text-xs text-muted-foreground">নির্দেশাবলী অনুসরণ করে আপনার উত্তোলন অনুরোধ জমা দিন</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* সাধারণ প্রশ্ন */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">সাধারণ প্রশ্ন</h2>
          
          <div className="space-y-4">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BadgeHelp className="h-5 w-5 text-accent" />
                  <span>ডিপোজিট বা উত্তোলনে কত সময় লাগে?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  ডিপোজিট সাধারণত মোবাইল ব্যাংকিংয়ের ক্ষেত্রে তাৎক্ষণিক এবং ব্যাংক ট্রান্সফারের ক্ষেত্রে ১-২৪ ঘন্টা সময় লাগতে পারে।
                  উত্তোলনের ক্ষেত্রে মোবাইল ব্যাংকিংয়ে ১-২৪ ঘন্টা এবং ব্যাংক ট্রান্সফারের ক্ষেত্রে ১-৩ কার্যদিবস সময় লাগতে পারে।
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BadgeHelp className="h-5 w-5 text-accent" />
                  <span>ন্যূনতম এবং সর্বোচ্চ ডিপোজিট/উত্তোলন পরিমাণ কত?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  ন্যূনতম এবং সর্বোচ্চ পরিমাণ পেমেন্ট পদ্ধতির উপর নির্ভর করে। সাধারণত ন্যূনতম ডিপোজিট ৫০০ টাকা 
                  এবং উত্তোলন ৫০০ টাকা থেকে শুরু হয়। সর্বোচ্চ পরিমাণের জন্য, দয়া করে পেমেন্ট পদ্ধতির বিবরণ দেখুন।
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BadgeHelp className="h-5 w-5 text-accent" />
                  <span>ডিপোজিট বা উত্তোলনে কি কোন ফি লাগে?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  ডিপোজিটের ক্ষেত্রে বেশিরভাগ পেমেন্ট পদ্ধতিতে কোন ফি নেই (কার্ড পেমেন্ট ব্যতীত)।
                  উত্তোলনের ক্ষেত্রে পেমেন্ট পদ্ধতি অনুযায়ী ০.৫% থেকে ১.৫% পর্যন্ত ফি লাগতে পারে।
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BadgeHelp className="h-5 w-5 text-accent" />
                  <span>আমার ডিপোজিট বা উত্তোলন সফল না হলে কী করব?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  যদি আপনার ডিপোজিট বা উত্তোলন সফল না হয়, তাহলে অনুগ্রহ করে আমাদের কাস্টমার সাপোর্টের সাথে যোগাযোগ করুন।
                  আমাদের হেল্পডেস্ক ২৪/৭ আপনাকে সাহায্য করার জন্য উপলব্ধ। আপনার ট্রানজেকশন বিবরণ এবং ট্রানজেকশন আইডি প্রদান করুন।
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BadgeHelp className="h-5 w-5 text-accent" />
                  <span>আমার পেমেন্ট পদ্ধতি নিরাপদ কি?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  হ্যাঁ, আমরা সর্বোচ্চ সুরক্ষা মান ব্যবহার করি। সমস্ত পেমেন্ট ডেটা এনক্রিপ্টেড এবং নিরাপদ।
                  আমরা SSL সার্টিফিকেট ব্যবহার করি এবং নিয়মিত সিকিউরিটি অডিট করি।
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  <span className="text-xs text-accent">১০০% নিরাপদ পেমেন্ট</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-6 border border-accent/20">
          <div className="flex gap-4 items-center">
            <div className="bg-accent/10 rounded-full p-4">
              <ArrowUpRight className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">আরও প্রশ্ন আছে?</h3>
              <p className="text-muted-foreground mb-4">
                আপনার যদি আরও কোন প্রশ্ন থাকে, তাহলে আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন।
              </p>
              <Button variant="outline" className="border-accent text-accent">
                সাপোর্টে যোগাযোগ করুন
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}