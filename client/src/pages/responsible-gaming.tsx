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
  CardTitle 
} from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { 
  ThumbsUp, 
  Clock, 
  Ban, 
  Shield, 
  HelpCircle, 
  AlertTriangle 
} from "lucide-react";

export default function ResponsibleGamingPage() {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isLoggedIn={!!user} onLogout={handleLogout} />
      <MobileMenu />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">দায়িত্বশীল গেমিং</h1>
          <p className="text-muted-foreground">আমরা সকল ব্যবহারকারীদের জন্য একটি নিরাপদ এবং দায়িত্বশীল গেমিং পরিবেশ প্রদান করতে প্রতিশ্রুতিবদ্ধ</p>
        </div>
        
        {/* প্রধান কার্ড */}
        <Card className="bg-card border-accent/20 mb-8">
          <CardContent className="pt-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-bold mb-4 text-center">আমাদের অঙ্গীকার</h2>
              <p className="mb-4 text-muted-foreground">
                TK999 এ, আমরা বিশ্বাস করি যে গেমিং এবং বেটিং শুধুমাত্র মনোরঞ্জনের জন্য হওয়া উচিত। আমরা আমাদের ব্যবহারকারীদের দায়িত্বশীল উপায়ে খেলতে উৎসাহিত করি এবং নিম্নলিখিত টুলস ও সহায়তা প্রদান করি:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-3">
                    <ThumbsUp className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-1">আত্ম-মূল্যায়ন</h3>
                  <p className="text-xs text-muted-foreground">আপনার গেমিং আচরণ পরীক্ষা করুন</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-3">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-1">সময় সীমা</h3>
                  <p className="text-xs text-muted-foreground">আপনার গেমিং সময় নিয়ন্ত্রণ করুন</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-3">
                    <Ban className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-1">সীমাবদ্ধতা সেট</h3>
                  <p className="text-xs text-muted-foreground">আর্থিক সীমাবদ্ধতা নির্ধারণ করুন</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* দায়িত্বশীল গেমিং টিপস */}
        <h2 className="text-2xl font-bold mb-5">দায়িত্বশীল গেমিং টিপস</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Card className="bg-card border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Shield className="mr-2 h-5 w-5 text-accent" />
                নিরাপদ গেমিং নিয়ম
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                ✓ শুধুমাত্র মনোরঞ্জনের জন্য খেলুন, আয়ের উৎস হিসেবে নয়
              </p>
              <p className="text-sm text-muted-foreground">
                ✓ আপনি যতটুকু হারাতে সক্ষম, শুধুমাত্র সেই অর্থ বাজি রাখুন
              </p>
              <p className="text-sm text-muted-foreground">
                ✓ নিয়মিত বিরতি নিন এবং খেলার সময় সীমিত রাখুন
              </p>
              <p className="text-sm text-muted-foreground">
                ✓ হারানো অর্থ "চেজ" করবেন না বা "ফিরে পাওয়ার" চেষ্টা করবেন না
              </p>
              <p className="text-sm text-muted-foreground">
                ✓ কোন চাপ অনুভব করলে খেলা বন্ধ করুন
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <AlertTriangle className="mr-2 h-5 w-5 text-accent" />
                সতর্কতার লক্ষণ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                ⚠️ গেমিং অধিক সময় ব্যয় করা
              </p>
              <p className="text-sm text-muted-foreground">
                ⚠️ গেমিং এর জন্য দৈনন্দিন কার্যকলাপ উপেক্ষা করা
              </p>
              <p className="text-sm text-muted-foreground">
                ⚠️ হারানো অর্থ ফিরে পাওয়ার জন্য বারবার প্রচেষ্টা করা
              </p>
              <p className="text-sm text-muted-foreground">
                ⚠️ পরিবার বা বন্ধুদের থেকে গেমিং লুকানো
              </p>
              <p className="text-sm text-muted-foreground">
                ⚠️ গেমিং এর জন্য ঋণ নেয়া বা সম্পত্তি বিক্রি করা
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* বিশেষ বৈশিষ্ট্য */}
        <h2 className="text-2xl font-bold mb-5">আমাদের দায়িত্বশীল গেমিং বৈশিষ্ট্য</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Card className="bg-card border-accent/20">
            <CardHeader>
              <CardTitle className="text-lg">ডিপোজিট লিমিট</CardTitle>
              <CardDescription>আপনার আর্থিক সীমা নির্ধারণ করুন</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                আপনি দৈনিক, সাপ্তাহিক বা মাসিক ডিপোজিট লিমিট সেট করতে পারেন। এটি আপনাকে আর্থিকভাবে দায়িত্বশীল থাকতে সাহায্য করবে।
              </p>
              <Button variant="outline" className="w-full border-accent text-accent">
                লিমিট সেট করুন
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-accent/20">
            <CardHeader>
              <CardTitle className="text-lg">খেলার সময় সীমাবদ্ধকরণ</CardTitle>
              <CardDescription>আপনার গেমিং সময় নিয়ন্ত্রণ করুন</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                আপনি দৈনিক খেলার সময়সীমা নির্ধারণ করতে পারেন। নির্ধারিত সময় শেষ হলে আপনাকে সতর্ক করা হবে এবং বিরতি নেয়ার পরামর্শ দেয়া হবে।
              </p>
              <Button variant="outline" className="w-full border-accent text-accent">
                সময় সেট করুন
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-accent/20">
            <CardHeader>
              <CardTitle className="text-lg">সেলফ-এক্সক্লুশন</CardTitle>
              <CardDescription>নিজে থেকে বিরতি নিন</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                আপনি আপনার একাউন্ট সাময়িকভাবে বা স্থায়ীভাবে নিষ্ক্রিয় করার অপশন বেছে নিতে পারেন, যা আপনাকে বিরতি নিতে সাহায্য করবে।
              </p>
              <Button variant="outline" className="w-full border-accent text-accent">
                একাউন্ট বিরতি নিন
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* সচরাচর জিজ্ঞাসিত প্রশ্ন */}
        <h2 className="text-2xl font-bold mb-5">সচরাচর জিজ্ঞাসিত প্রশ্ন</h2>
        <Accordion type="single" collapsible className="mb-10">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              দায়িত্বশীল গেমিং কি?
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                দায়িত্বশীল গেমিং হল এমন একটি অভ্যাস যখন একজন ব্যক্তি গেমিং এবং বেটিংকে শুধুমাত্র মনোরঞ্জন হিসেবে দেখেন এবং তাদের আর্থিক সামর্থ্যের মধ্যে সীমাবদ্ধ রাখেন। এটি ব্যবহারকারীদের জ্ঞাত সিদ্ধান্ত নিতে এবং গেমিংকে নিয়ন্ত্রণে রাখতে সাহায্য করে।
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger>
              আমি কিভাবে আমার গেমিং সীমা নির্ধারণ করতে পারি?
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                আপনি আপনার অ্যাকাউন্ট সেটিংসে গিয়ে "দায়িত্বশীল গেমিং" বিভাগে ডিপোজিট লিমিট, বেটিং লিমিট, সময় লিমিট এবং অন্যান্য সীমাবদ্ধতা নির্ধারণ করতে পারেন। এই সীমাগুলি দৈনিক, সাপ্তাহিক বা মাসিক ভিত্তিতে সেট করা যেতে পারে।
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger>
              আমি যদি আমার গেমিং অভ্যাস নিয়ে উদ্বিগ্ন হই, তাহলে কি করব?
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                আপনি যদি আপনার গেমিং অভ্যাস নিয়ে উদ্বিগ্ন হন, তাহলে আমাদের 24/7 কাস্টমার সাপোর্ট টিমের সাথে যোগাযোগ করুন অথবা আমাদের "সেলফ-এক্সক্লুশন" বৈশিষ্ট্য ব্যবহার করুন। আমরা আপনাকে পেশাদার সাহায্য এবং সহায়তা প্রদানের জন্য বিভিন্ন সংস্থার সাথে সংযোগ করতে পারি।
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger>
              সেলফ-এক্সক্লুশন কি এবং এটি কিভাবে কাজ করে?
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                সেলফ-এক্সক্লুশন হল একটি প্রক্রিয়া যা আপনাকে আপনার অ্যাকাউন্ট সাময়িকভাবে বা স্থায়ীভাবে নিষ্ক্রিয় করতে দেয়। এটি আপনাকে গেমিং থেকে বিরতি নিতে সাহায্য করে। আপনি আপনার প্রোফাইল সেটিংসে "সেলফ-এক্সক্লুশন" অপশনে ক্লিক করে এই প্রক্রিয়া শুরু করতে পারেন।
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger>
              অল্পবয়সী গেমিং প্রতিরোধে আপনারা কি করেন?
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                আমরা কঠোর বয়স যাচাইকরণ প্রক্রিয়া অনুসরণ করি এবং ১৮ বছরের কম বয়সীদের আমাদের প্ল্যাটফর্মে অ্যাকাউন্ট খুলতে দেই না। অভিভাবকদের জন্য আমরা প্যারেন্টাল কন্ট্রোল টুলস প্রদান করি যাতে তারা তাদের সন্তানদের অনলাইন অ্যাক্টিভিটি নিয়ন্ত্রণ করতে পারেন।
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* সাহায্য এবং সহযোগিতা */}
        <Card className="bg-card border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <HelpCircle className="mr-2 h-5 w-5 text-accent" />
              সাহায্য এবং সহযোগিতা
            </CardTitle>
            <CardDescription>
              আপনি যদি মনে করেন আপনার বা আপনার কোন প্রিয়জনের গেমিং সমস্যা আছে, তাহলে নিচের রিসোর্সগুলি সাহায্য করতে পারে
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">সহায়তা হেল্পলাইন</h3>
                <p className="text-sm text-muted-foreground mb-1">ন্যাশনাল গেমিং হেল্পলাইন: ০১৮০০-৮৮৮-৮৮৮</p>
                <p className="text-sm text-muted-foreground mb-1">মানসিক স্বাস্থ্য হেল্পলাইন: ০১৬১৬-৭৯৭৯৭৯</p>
                <p className="text-sm text-muted-foreground">TK999 সাপোর্ট: ০১৭০০-০০০০০০</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">সহায়ক সংস্থা</h3>
                <p className="text-sm text-muted-foreground mb-1">গ্যাম্বলার্স অ্যানোনিমাস বাংলাদেশ</p>
                <p className="text-sm text-muted-foreground mb-1">রেস্পন্সিবল গেমিং ফাউন্ডেশন</p>
                <p className="text-sm text-muted-foreground">ন্যাশনাল কাউন্সিল অন প্রবলেম গ্যাম্বলিং</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}