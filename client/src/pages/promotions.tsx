import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileMenu from "@/components/layout/mobile-menu";
import MobileNav from "@/components/layout/mobile-nav";
import { useQuery } from "@tanstack/react-query";
import { 
  CalendarDays, 
  Clock, 
  Copy, 
  Gift, 
  Globe, 
  Share2, 
  Shield, 
  Tag, 
  Trophy, 
  Users 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

type Promotion = {
  id: number;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  category: string;
  isActive: boolean;
  details?: string;
  termsAndConditions?: string;
  bonusAmount?: number;
  bonusType?: string;
  minimumDeposit?: number;
  wageringRequirements?: number;
  applicableGames?: string[];
};

export default function PromotionsPage() {
  const { user, logoutMutation } = useAuth();
  const [referralCode, setReferralCode] = useState("TK999REF" + (user?.id || "123456"));
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  // প্রমোশন ডেটা লোড করা
  const { data: promotions = [], isLoading } = useQuery({
    queryKey: ['/api/promotions'],
    staleTime: 60 * 1000, // ১ মিনিট
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  // রেফারেল লিংক কপি করার জন্য ফাংশন
  const copyReferralLink = () => {
    const referralLink = `https://tk999.org/register?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setShowCopiedMessage(true);
    
    toast({
      title: "কপি করা হয়েছে!",
      description: "রেফারেল লিংক কপি করা হয়েছে। আপনি এখন এটি শেয়ার করতে পারেন।",
    });
    
    setTimeout(() => {
      setShowCopiedMessage(false);
    }, 3000);
  };

  // প্রমোশন ক্যাটাগরি অনুযায়ী ফিল্টার করা
  const welcomePromotions = promotions.filter((promo: Promotion) => promo.category === 'welcome');
  const depositPromotions = promotions.filter((promo: Promotion) => promo.category === 'deposit');
  const casinoPromotions = promotions.filter((promo: Promotion) => promo.category === 'casino');
  const sportsPromotions = promotions.filter((promo: Promotion) => promo.category === 'sports');
  const specialPromotions = promotions.filter((promo: Promotion) => 
    !['welcome', 'deposit', 'casino', 'sports'].includes(promo.category));

  // প্রমোশন কার্ড রেন্ডার করার জন্য ফাংশন
  const renderPromotionCard = (promotion: Promotion) => {
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);
    
    return (
      <Card key={promotion.id} className="overflow-hidden hover:shadow-lg transition-shadow border-accent/20">
        <div className="relative">
          <img 
            src={promotion.image} 
            alt={promotion.title} 
            className="w-full h-48 object-cover" 
          />
          {promotion.isActive && (
            <Badge className="absolute top-3 right-3 bg-green-500">
              সক্রিয়
            </Badge>
          )}
        </div>
        
        <CardHeader>
          <CardTitle className="text-xl">{promotion.title}</CardTitle>
          <CardDescription>{promotion.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>
              {startDate.toLocaleDateString('bn-BD')} - {endDate.toLocaleDateString('bn-BD')}
            </span>
          </div>
          
          {promotion.bonusAmount && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">বোনাস পরিমাণ:</span>
              <span className="font-semibold text-green-500">
                {promotion.bonusType === 'percentage' ? `${promotion.bonusAmount}%` : `৳${promotion.bonusAmount}`}
              </span>
            </div>
          )}
          
          {promotion.minimumDeposit && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">ন্যূনতম জমা:</span>
              <span className="font-semibold">৳{promotion.minimumDeposit}</span>
            </div>
          )}
          
          {promotion.wageringRequirements && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">ওয়েজারিং প্রয়োজন:</span>
              <span className="font-semibold">{promotion.wageringRequirements}x</span>
            </div>
          )}
          
          {promotion.details && (
            <>
              <Separator />
              <div className="pt-2">
                <p className="text-sm">{promotion.details}</p>
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="bg-background/10 pt-4">
          <Button className="w-full bg-accent text-secondary hover:bg-accent/90">
            বিস্তারিত দেখুন
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isLoggedIn={!!user} onLogout={handleLogout} />
      <MobileMenu />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">প্রমোশন এবং বোনাস</h1>
          <p className="text-muted-foreground">সর্বশেষ বোনাস, ক্যাশব্যাক, এবং বিশেষ অফারগুলি দেখুন</p>
        </div>
        
        {/* বিশেষ প্রমোশন ব্যানার */}
        {specialPromotions.length > 0 && (
          <div className="mb-8">
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src={specialPromotions[0].image}
                alt="বিশেষ প্রমোশন" 
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <Badge className="mb-2 bg-accent text-secondary">বিশেষ অফার</Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{specialPromotions[0].title}</h2>
                <p className="mb-4 max-w-2xl">{specialPromotions[0].description}</p>
                <Button className="bg-accent text-secondary hover:bg-accent/90">
                  অফার নিন
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* প্রমোশন ক্যাটাগরি ট্যাব */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 h-auto p-1">
            <TabsTrigger value="all" className="py-2">সকল</TabsTrigger>
            <TabsTrigger value="welcome" className="py-2">স্বাগতম</TabsTrigger>
            <TabsTrigger value="deposit" className="py-2">ডিপোজিট</TabsTrigger>
            <TabsTrigger value="casino" className="py-2">ক্যাসিনো</TabsTrigger>
            <TabsTrigger value="sports" className="py-2">স্পোর্টস</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : promotions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">কোন প্রমোশন পাওয়া যায়নি</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promotions.map((promo: Promotion) => renderPromotionCard(promo))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="welcome" className="mt-6">
            {welcomePromotions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">কোন স্বাগতম প্রমোশন পাওয়া যায়নি</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {welcomePromotions.map((promo: Promotion) => renderPromotionCard(promo))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="deposit" className="mt-6">
            {depositPromotions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">কোন ডিপোজিট প্রমোশন পাওয়া যায়নি</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {depositPromotions.map((promo: Promotion) => renderPromotionCard(promo))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="casino" className="mt-6">
            {casinoPromotions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">কোন ক্যাসিনো প্রমোশন পাওয়া যায়নি</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {casinoPromotions.map((promo: Promotion) => renderPromotionCard(promo))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="sports" className="mt-6">
            {sportsPromotions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">কোন স্পোর্টস প্রমোশন পাওয়া যায়নি</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sportsPromotions.map((promo: Promotion) => renderPromotionCard(promo))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* জনপ্রিয় প্রমোশন কিভাবে ব্যবহার করবেন */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>প্রমোশন কিভাবে ব্যবহার করবেন</CardTitle>
            <CardDescription>আমাদের বোনাস এবং প্রমোশন থেকে সর্বাধিক সুবিধা পাওয়ার জন্য নীচের পদক্ষেপগুলি অনুসরণ করুন</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4 bg-card rounded-lg">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-accent/10 text-accent mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">১. রেজিস্টার করুন</h3>
                <p className="text-muted-foreground text-sm">আমাদের ওয়েবসাইটে একটি অ্যাকাউন্ট খুলুন এবং স্বাগতম বোনাস পান</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 bg-card rounded-lg">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-accent/10 text-accent mb-4">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">২. প্রমোশন পৃষ্ঠা অনুসন্ধান করুন</h3>
                <p className="text-muted-foreground text-sm">আপনার পছন্দের প্রমোশন খুঁজে বের করুন এবং শর্তাবলী পড়ুন</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 bg-card rounded-lg">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-accent/10 text-accent mb-4">
                  <Trophy className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">৩. বোনাস উপভোগ করুন</h3>
                <p className="text-muted-foreground text-sm">আপনার বোনাস দিয়ে খেলুন এবং জিতুন</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* রেফারেল সেকশন */}
        <Card className="mb-8 border-accent/30">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-accent" />
              রেফারেল প্রোগ্রাম
            </CardTitle>
            <CardDescription>
              বন্ধুদের রেফার করুন এবং উভয়ে বোনাস উপভোগ করুন
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">কিভাবে কাজ করে</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-accent/10 text-accent p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">1</div>
                    <div>
                      <p className="font-medium">আপনার অনন্য রেফারেল লিংক শেয়ার করুন</p>
                      <p className="text-sm text-muted-foreground">সোশ্যাল মিডিয়া, মেসেজিং অ্যাপ বা ইমেইলের মাধ্যমে বন্ধুদের সাথে শেয়ার করুন</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-accent/10 text-accent p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">2</div>
                    <div>
                      <p className="font-medium">বন্ধুরা যখন সাইন আপ করে</p>
                      <p className="text-sm text-muted-foreground">আপনার রেফারেল কোড ব্যবহার করে তারা একটি ৳৫০০ স্বাগতম বোনাস পাবে</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-accent/10 text-accent p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">3</div>
                    <div>
                      <p className="font-medium">আপনি পুরস্কার পান</p>
                      <p className="text-sm text-muted-foreground">প্রতি সক্রিয় রেফারেলের জন্য আপনি ৳৫০০ বোনাস + তাদের প্রথম ডিপোজিটের ১০% পাবেন</p>
                    </div>
                  </div>
                </div>
                
                {user ? (
                  <div className="mt-6 space-y-3">
                    <h4 className="font-medium">আপনার রেফারেল প্রোগ্রেস</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-card rounded-lg">
                        <p className="text-2xl font-bold text-accent">০</p>
                        <p className="text-xs text-muted-foreground">মোট রেফারেল</p>
                      </div>
                      <div className="p-3 bg-card rounded-lg">
                        <p className="text-2xl font-bold text-accent">৳০</p>
                        <p className="text-xs text-muted-foreground">অর্জিত বোনাস</p>
                      </div>
                      <div className="p-3 bg-card rounded-lg">
                        <p className="text-2xl font-bold text-accent">০</p>
                        <p className="text-xs text-muted-foreground">সক্রিয় রেফারেল</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6">
                    <Button className="w-full">
                      শুরু করতে লগইন করুন
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">আপনার রেফারেল লিংক</h3>
                <div className="border p-4 rounded-lg bg-card space-y-4">
                  {user ? (
                    <>
                      <p className="text-sm text-muted-foreground">
                        নীচের লিংক বা কোড কপি করে আপনার বন্ধুদের সাথে শেয়ার করুন
                      </p>
                      
                      <div className="relative">
                        <Input
                          value={`https://tk999.org/register?ref=${referralCode}`}
                          readOnly
                          className="pr-12"
                        />
                        <Button 
                          className="absolute right-1 top-1 h-7 w-8 p-0"
                          onClick={copyReferralLink}
                          variant="secondary"
                        >
                          {showCopiedMessage ? (
                            <span className="text-green-500 text-xs">✓</span>
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm">আপনার রেফারেল কোড:</span>
                        <Badge variant="secondary" className="font-mono">
                          {referralCode}
                        </Badge>
                      </div>
                      
                      <div className="pt-2 space-y-2">
                        <h4 className="text-sm font-medium">শেয়ার করুন</h4>
                        <div className="flex items-center gap-3">
                          <Button variant="outline" size="sm" className="rounded-full h-9 w-9 p-0">
                            <Share2 className="h-4 w-4" />
                            <span className="sr-only">জেনারেল শেয়ার</span>
                          </Button>
                          
                          <Button variant="outline" size="sm" className="rounded-full h-9 w-9 p-0 bg-[#25D366]/10 border-[#25D366]/20 text-[#25D366]">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                            </svg>
                            <span className="sr-only">ওয়াটসঅ্যাপ শেয়ার</span>
                          </Button>
                          
                          <Button variant="outline" size="sm" className="rounded-full h-9 w-9 p-0 bg-[#1877F2]/10 border-[#1877F2]/20 text-[#1877F2]">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            <span className="sr-only">ফেসবুক শেয়ার</span>
                          </Button>
                          
                          <Button variant="outline" size="sm" className="rounded-full h-9 w-9 p-0 bg-[#1DA1F2]/10 border-[#1DA1F2]/20 text-[#1DA1F2]">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                            <span className="sr-only">টুইটার শেয়ার</span>
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-6 text-center space-y-3">
                      <Shield className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                      <h3 className="font-medium">রেফারেল লিংক পেতে লগইন করুন</h3>
                      <p className="text-sm text-muted-foreground">আপনার অনন্য রেফারেল লিংক পেতে আপনাকে অবশ্যই একটি অ্যাকাউন্ট তৈরি করতে হবে বা লগইন করতে হবে</p>
                      <Button className="mt-2">
                        লগইন / রেজিস্টার
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="bg-accent/10 p-4 rounded-lg">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <Gift className="h-4 w-4 text-accent" />
                    বোনাস শর্তাবলী
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-5">
                    <li>রেফারেল বোনাস পেতে আপনার বন্ধুকে অবশ্যই নতুন ব্যবহারকারী হতে হবে</li>
                    <li>রেফারেল বোনাস 1x ওয়েজারিং প্রয়োজন সাপেক্ষে ক্যাশ হিসেবে গণ্য হবে</li>
                    <li>প্রতি ব্যবহারকারীর জন্য সর্বোচ্চ ১০টি সফল রেফারেল বোনাস প্রযোজ্য</li>
                    <li>ডিপোজিট বোনাস পেতে রেফারেল করা ব্যবহারকারীকে অবশ্যই ন্যূনতম ৳১০০০ জমা করতে হবে</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* নিয়ম ও শর্তাবলী */}
        <Card>
          <CardHeader>
            <CardTitle>সাধারণ নিয়ম ও শর্তাবলী</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="bg-accent/10 text-accent p-1 rounded mt-0.5"><Tag className="h-3 w-3" /></span>
                <span>সমস্ত প্রমোশন শুধুমাত্র একাউন্ট প্রতি একবার প্রযোজ্য।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-accent/10 text-accent p-1 rounded mt-0.5"><Tag className="h-3 w-3" /></span>
                <span>TK999 যেকোনো সময় প্রমোশনের শর্তাবলী পরিবর্তন করার অধিকার সংরক্ষণ করে।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-accent/10 text-accent p-1 rounded mt-0.5"><Tag className="h-3 w-3" /></span>
                <span>বোনাস পাওয়ার জন্য আপনাকে অবশ্যই পূর্ণ বয়স্ক (১৮+) হতে হবে।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-accent/10 text-accent p-1 rounded mt-0.5"><Tag className="h-3 w-3" /></span>
                <span>কোন প্রমোশনের সন্দেহজনক বা অপব্যবহার দেখা গেলে TK999 অ্যাকাউন্ট বাতিল করার অধিকার রাখে।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-accent/10 text-accent p-1 rounded mt-0.5"><Tag className="h-3 w-3" /></span>
                <span>সব সময় পূর্ণ টার্মস এন্ড কন্ডিশন প্রযোজ্য।</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}