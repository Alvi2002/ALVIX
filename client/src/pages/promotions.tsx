import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileMenu from "@/components/layout/mobile-menu";
import MobileNav from "@/components/layout/mobile-nav";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock, Globe, Tag, Trophy, Users } from "lucide-react";
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

  // প্রমোশন ডেটা লোড করা
  const { data: promotions = [], isLoading } = useQuery({
    queryKey: ['/api/promotions'],
    staleTime: 60 * 1000, // ১ মিনিট
  });

  const handleLogout = () => {
    logoutMutation.mutate();
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