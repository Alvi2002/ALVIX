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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  FileText, 
  ShieldCheck, 
  Scale, 
  Clock
} from "lucide-react";

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold mb-2">নিয়ম ও শর্তাবলী</h1>
          <p className="text-muted-foreground">
            TK999 ব্যবহার করার জন্য দয়া করে নিম্নলিখিত নিয়ম ও শর্তাবলী পড়ুন এবং মেনে চলুন
          </p>
          <div className="flex items-center gap-2 mt-2 text-amber-500">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-sm font-medium">
              শেষ আপডেট: ৭ মে, ২০২৫
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="terms" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="terms" className="gap-2">
              <FileText className="h-4 w-4" />
              <span>সাধারণ শর্তাবলী</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span>গোপনীয়তা নীতি</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2">
              <Scale className="h-4 w-4" />
              <span>পেমেন্ট নীতিমালা</span>
            </TabsTrigger>
            <TabsTrigger value="bonuses" className="gap-2">
              <Clock className="h-4 w-4" />
              <span>বোনাস শর্তাবলী</span>
            </TabsTrigger>
          </TabsList>
          
          {/* সাধারণ শর্তাবলী */}
          <TabsContent value="terms" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>সাধারণ শর্তাবলী</CardTitle>
                <CardDescription>TK999 এর সাধারণ নিয়ম ও শর্তাবলী</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">১. পরিচিতি</h3>
                  <p className="text-sm text-muted-foreground">
                    ১.১ TK999.com ওয়েবসাইট ("সাইট") এবং এর সমস্ত সেবা TK999 Ltd দ্বারা পরিচালিত এবং নিয়ন্ত্রিত হয়।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ১.২ এই নিয়ম ও শর্তাবলী আপনার এবং TK999 এর মধ্যে আইনি চুক্তি গঠন করে। আমাদের সাইট ব্যবহার করে, আপনি নিশ্চিত করছেন যে আপনি এই শর্তাবলী পড়েছেন, বুঝেছেন এবং মেনে চলতে সম্মত হয়েছেন।
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">২. অ্যাকাউন্ট</h3>
                  <p className="text-sm text-muted-foreground">
                    ২.১ TK999 ব্যবহার করতে হলে আপনাকে অবশ্যই একটি অ্যাকাউন্ট তৈরি করতে হবে এবং আপনার সম্পর্কে সঠিক, সম্পূর্ণ এবং হালনাগাদ তথ্য প্রদান করতে হবে।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ২.২ আপনাকে অবশ্যই ১৮ বছর বা তার বেশি বয়সী হতে হবে এবং আপনার দেশ/অঞ্চলে আইনি বয়স্ক হতে হবে যেখানে অনলাইন গেমিং বৈধ।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ২.৩ আপনি আপনার অ্যাকাউন্টের লগইন বিবরণ গোপন রাখতে এবং অন্য কারও সাথে শেয়ার না করতে সম্মত হচ্ছেন।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ২.৪ আপনি প্রতি ব্যক্তি/পরিবার/ঠিকানা/ইমেইল ঠিকানা/IP ঠিকানা/ডিভাইসে শুধুমাত্র একটি অ্যাকাউন্ট খুলতে পারবেন। একাধিক অ্যাকাউন্ট আমাদের দ্বারা বন্ধ করা হতে পারে।
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">৩. জমা এবং উত্তোলন</h3>
                  <p className="text-sm text-muted-foreground">
                    ৩.১ আপনি শুধুমাত্র নিজের অর্থ ব্যবহার করতে এবং নিজের ব্যাংক অ্যাকাউন্ট/পেমেন্ট পদ্ধতি ব্যবহার করতে সম্মত হচ্ছেন।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৩.২ আমরা যে কোন সময় আপনার পরিচয় যাচাই করার অধিকার সংরক্ষণ করি এবং প্রয়োজনে কেওয়াইসি (KYC) নথি চাইতে পারি।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৩.৩ সর্বনিম্ন জমা এবং উত্তোলনের পরিমাণ আপনার পেমেন্ট পদ্ধতির উপর নির্ভর করে।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৩.৪ উত্তোলন প্রক্রিয়া করতে আমাদের কিছু সময় লাগতে পারে, সাধারণত ২৪-৭২ ঘন্টা, যা আপনার পেমেন্ট পদ্ধতির উপর নির্ভর করে।
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">৪. বেটিং নিয়ম</h3>
                  <p className="text-sm text-muted-foreground">
                    ৪.১ আমরা যে কোন বাজি বাতিল করার অধিকার সংরক্ষণ করি যদি আমরা সন্দেহ করি যে জালিয়াতি, কারচুপি বা অন্যান্য অনিয়ম হয়েছে।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৪.২ নির্দিষ্ট ইভেন্ট বা গেমের নিজস্ব নিয়ম-কানুন থাকতে পারে, যা আপনাকে বাজি ধরার আগে পড়তে হবে।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৪.৩ একবার গৃহীত বাজি বাতিল করা যাবে না, যদি না বিশেষ পরিস্থিতিতে আমরা এটি করার সিদ্ধান্ত নেই।
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">৫. অনিয়ম এবং দুর্নীতি</h3>
                  <p className="text-sm text-muted-foreground">
                    ৫.১ আমরা যে কোন ধরনের জালিয়াতি, কারচুপি বা অবৈধ কার্যকলাপ সহ্য করি না এবং এ ধরনের কার্যকলাপে জড়িত ব্যবহারকারীদের অ্যাকাউন্ট স্থায়ীভাবে বন্ধ করার অধিকার সংরক্ষণ করি।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৫.২ নিষিদ্ধ কার্যকলাপের মধ্যে রয়েছে, কিন্তু এতেই সীমাবদ্ধ নয়: ম্যাচ ফিক্সিং, ধারাবাহিক অ্যাকাউন্ট তৈরি, অন্যের অ্যাকাউন্ট ব্যবহার, বট ব্যবহার, এবং অন্যান্য যেকোনো অনুচিত সুবিধা নেওয়ার চেষ্টা।
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">৬. দায়মুক্তি এবং দায়বদ্ধতার সীমাবদ্ধতা</h3>
                  <p className="text-sm text-muted-foreground">
                    ৬.১ TK999 "যেমন আছে" এবং "যেমন পাওয়া যায়" ভিত্তিতে প্রদান করা হয়, কোন প্রকার ওয়ারেন্টি ছাড়া।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৬.২ আমরা কোন প্রকার প্রত্যক্ষ, পরোক্ষ, আকস্মিক, বিশেষ বা পরিণতিমূলক ক্ষতির জন্য দায়ী থাকব না, যার মধ্যে রয়েছে আয় হারানো, ডেটা হারানো বা ব্যবসায়িক ক্ষতি।
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">৭. শর্তাবলী পরিবর্তন</h3>
                  <p className="text-sm text-muted-foreground">
                    ৭.১ আমরা যে কোন সময় এই শর্তাবলী পরিবর্তন করার অধিকার সংরক্ষণ করি। পরিবর্তনগুলি ওয়েবসাইটে প্রকাশের পরে কার্যকর হবে।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৭.২ পরিবর্তন করার পরে সাইট ব্যবহার করা চালিয়ে গেলে আপনি পরিবর্তিত শর্তাবলী মেনে নিতে সম্মত হচ্ছেন।
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">৮. যোগাযোগ</h3>
                  <p className="text-sm text-muted-foreground">
                    ৮.১ আপনার যদি প্রশ্ন বা উদ্বেগ থাকে, দয়া করে আমাদের সাথে support@tk999.com এ যোগাযোগ করুন।
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* গোপনীয়তা নীতি */}
          <TabsContent value="privacy" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>গোপনীয়তা নীতি</CardTitle>
                <CardDescription>TK999 এর ব্যবহারকারীদের গোপনীয়তা রক্ষার নীতিমালা</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">১. ভূমিকা</h3>
                  <p className="text-sm text-muted-foreground">
                    ১.১ TK999 ("আমরা", "আমাদের") আপনার গোপনীয়তা রক্ষায় প্রতিশ্রুতিবদ্ধ। এই গোপনীয়তা নীতি ব্যাখ্যা করে যে কীভাবে আমরা আপনার ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার এবং প্রকাশ করি।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ১.২ আমাদের সাইট ব্যবহার করে, আপনি এই গোপনীয়তা নীতি অনুযায়ী আপনার ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার এবং প্রকাশ করতে সম্মত হচ্ছেন।
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">২. আমরা যে তথ্য সংগ্রহ করি</h3>
                  <p className="text-sm text-muted-foreground">
                    ২.১ ব্যক্তিগত তথ্য: আমরা নিম্নলিখিত ব্যক্তিগত তথ্য সংগ্রহ করি যখন আপনি একটি অ্যাকাউন্ট তৈরি করেন বা আমাদের সাথে যোগাযোগ করেন:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mt-2 space-y-1">
                    <li>নাম এবং পদবি</li>
                    <li>ইমেইল ঠিকানা</li>
                    <li>ফোন নম্বর</li>
                    <li>জন্ম তারিখ</li>
                    <li>ঠিকানা (শহর, দেশ, জিপ/পোস্ট কোড)</li>
                    <li>পেমেন্ট তথ্য</li>
                    <li>আইডি প্রমাণীকরণ নথি (কেওয়াইসি উদ্দেশ্যে)</li>
                  </ul>
                  
                  <p className="text-sm text-muted-foreground mt-4">
                    ২.২ ব্যবহারের তথ্য: আমরা স্বয়ংক্রিয়ভাবে নিম্নলিখিত ব্যবহারের তথ্য সংগ্রহ করি:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mt-2 space-y-1">
                    <li>IP ঠিকানা</li>
                    <li>ব্রাউজার এবং ডিভাইস তথ্য</li>
                    <li>কুকিজ এবং ট্র্যাকিং প্রযুক্তি</li>
                    <li>ওয়েবসাইট ব্যবহার এবং ক্রিয়াকলাপ</li>
                    <li>লগইন এবং গেমিং ইতিহাস</li>
                    <li>বাজি ধরা এবং লেনদেন সংক্রান্ত তথ্য</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">৩. আমরা কীভাবে আপনার তথ্য ব্যবহার করি</h3>
                  <p className="text-sm text-muted-foreground">
                    আমরা আপনার ব্যক্তিগত তথ্য নিম্নলিখিত উদ্দেশ্যে ব্যবহার করি:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mt-2 space-y-1">
                    <li>আপনার অ্যাকাউন্ট সেটআপ এবং পরিচালনা করা</li>
                    <li>আপনার সাথে যোগাযোগ করা</li>
                    <li>আপনার পেমেন্ট প্রক্রিয়া করা</li>
                    <li>আপনাকে কাস্টমার সাপোর্ট প্রদান করা</li>
                    <li>আমাদের সেবা উন্নত করা</li>
                    <li>জালিয়াতি শনাক্ত এবং প্রতিরোধ করা</li>
                    <li>আইনি বাধ্যবাধকতা মেনে চলা</li>
                    <li>আপনার সম্মতিতে অন্যান্য উদ্দেশ্যে</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">৪. কুকিজ এবং ট্র্যাকিং প্রযুক্তি</h3>
                  <p className="text-sm text-muted-foreground">
                    আমরা কুকিজ এবং অনুরূপ ট্র্যাকিং প্রযুক্তি ব্যবহার করি আমাদের ওয়েবসাইট এবং পরিষেবার কার্যকারিতা বৃদ্ধি করতে। আপনি আপনার ব্রাউজার সেটিংসে কুকিজ বন্ধ করতে পারেন, তবে এটি আমাদের সাইটের কিছু বৈশিষ্ট্য সীমিত করতে পারে।
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">৫. তথ্য প্রকাশ</h3>
                  <p className="text-sm text-muted-foreground">
                    আমরা আপনার ব্যক্তিগত তথ্য নিম্নলিখিত পরিস্থিতিতে শেয়ার করতে পারি:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mt-2 space-y-1">
                    <li>আমাদের পরিষেবা প্রদানকারী এবং ব্যবসায়িক অংশীদারদের সাথে যারা এই গোপনীয়তা নীতি মেনে চলতে বাধ্য</li>
                    <li>আইনি প্রয়োজনীয়তা মেটাতে, যেমন আদালতের আদেশ বা নিয়ন্ত্রক প্রয়োজনীয়তা</li>
                    <li>জালিয়াতি প্রতিরোধ বা আমাদের অধিকার রক্ষা করতে</li>
                    <li>কোম্পানির মালিকানা পরিবর্তনের ক্ষেত্রে, যেমন একত্রীকরণ বা অধিগ্রহণ</li>
                    <li>আপনার সম্মতিতে</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">৬. ডেটা সুরক্ষা</h3>
                  <p className="text-sm text-muted-foreground">
                    আমরা উচ্চ মানের সুরক্ষা ব্যবস্থা ব্যবহার করি আপনার ব্যক্তিগত তথ্য অনধিকৃত অ্যাক্সেস, প্রকাশ, পরিবর্তন বা ধ্বংস থেকে রক্ষা করতে। তবে, কোন অনলাইন পদ্ধতি ১০০% নিরাপদ নয়, তাই আমরা পূর্ণ নিরাপত্তার গ্যারান্টি দিতে পারি না।
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">৭. আপনার অধিকার</h3>
                  <p className="text-sm text-muted-foreground">
                    আপনার অধিকার আছে:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mt-2 space-y-1">
                    <li>আপনার ব্যক্তিগত তথ্যের অ্যাক্সেস চাওয়া</li>
                    <li>আপনার তথ্য সংশোধন বা আপডেট করা</li>
                    <li>আপনার তথ্য মুছে ফেলার অনুরোধ করা</li>
                    <li>কিছু পরিস্থিতিতে আপনার তথ্য প্রক্রিয়াকরণে আপত্তি করা</li>
                    <li>তথ্য সংক্রান্ত মার্কেটিং থেকে অপ্ট-আউট করা</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-4">
                    আপনার অধিকার প্রয়োগ করতে, দয়া করে আমাদের সাথে privacy@tk999.com এ যোগাযোগ করুন।
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">৮. শিশুদের গোপনীয়তা</h3>
                  <p className="text-sm text-muted-foreground">
                    আমাদের পরিষেবা ১৮ বছরের কম বয়সী ব্যক্তিদের জন্য উদ্দেশ্য নয়। আমরা জেনেশুনে ১৮ বছরের কম বয়সী কারও কাছ থেকে ব্যক্তিগত তথ্য সংগ্রহ করি না।
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">৯. গোপনীয়তা নীতি পরিবর্তন</h3>
                  <p className="text-sm text-muted-foreground">
                    আমরা সময়ে সময়ে এই গোপনীয়তা নীতি আপডেট করতে পারি। যেকোন পরিবর্তন এই পৃষ্ঠায় প্রকাশিত হবে এবং, যদি উল্লেখযোগ্য হয়, তাহলে আমরা আপনাকে ইমেইলের মাধ্যমে জানাব।
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">১০. যোগাযোগ</h3>
                  <p className="text-sm text-muted-foreground">
                    গোপনীয়তা-সম্পর্কিত প্রশ্ন বা উদ্বেগের জন্য, দয়া করে আমাদের সাথে privacy@tk999.com এ যোগাযোগ করুন।
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* পেমেন্ট নীতিমালা */}
          <TabsContent value="payments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>পেমেন্ট নীতিমালা</CardTitle>
                <CardDescription>TK999 এর অর্থ জমা ও উত্তোলন সংক্রান্ত নীতিমালা</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">১. পেমেন্ট পদ্ধতি</h3>
                  <p className="text-sm text-muted-foreground">
                    TK999 নিম্নলিখিত পেমেন্ট পদ্ধতিগুলি গ্রহণ করে:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mt-2 space-y-1">
                    <li>বিকাশ</li>
                    <li>নগদ</li>
                    <li>রকেট</li>
                    <li>ব্যাংক ট্রান্সফার</li>
                    <li>ভিসা/মাস্টারকার্ড</li>
                    <li>নেটেলার</li>
                    <li>স্ক্রিল</li>
                    <li>ক্রিপ্টোকারেন্সি (বিটকয়েন, ইথেরিয়াম)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">২. ন্যূনতম এবং সর্বোচ্চ সীমা</h3>
                  <p className="text-sm text-muted-foreground">
                    ২.১ ন্যূনতম জমা:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mt-2 space-y-1">
                    <li>মোবাইল ব্যাংকিং: ৫০০ টাকা</li>
                    <li>ব্যাংক ট্রান্সফার: ১০০০ টাকা</li>
                    <li>ক্রেডিট/ডেবিট কার্ড: ১০০০ টাকা</li>
                    <li>ই-ওয়ালেট: ৫০০ টাকা</li>
                    <li>ক্রিপ্টোকারেন্সি: ১০০০ টাকা সমতুল্য</li>
                  </ul>
                  
                  <p className="text-sm text-muted-foreground mt-4">
                    ২.২ ন্যূনতম উত্তোলন:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mt-2 space-y-1">
                    <li>মোবাইল ব্যাংকিং: ৫০০ টাকা</li>
                    <li>ব্যাংক ট্রান্সফার: ১০০০ টাকা</li>
                    <li>ই-ওয়ালেট: ৫০০ টাকা</li>
                    <li>ক্রিপ্টোকারেন্সি: ২০০০ টাকা সমতুল্য</li>
                  </ul>
                  
                  <p className="text-sm text-muted-foreground mt-4">
                    ২.৩ সর্বোচ্চ জমা এবং উত্তোলনের সীমা আপনার অ্যাকাউন্টের স্তর, ব্যবহৃত পেমেন্ট পদ্ধতি এবং আপনার অ্যাকাউন্টের যাচাইকরণ স্তরের উপর নির্ভর করে। বিস্তারিত জানতে অ্যাকাউন্ট সেটিংস দেখুন।
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">৩. প্রক্রিয়াকরণের সময়</h3>
                  <p className="text-sm text-muted-foreground">
                    ৩.১ জমা:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mt-2 space-y-1">
                    <li>মোবাইল ব্যাংকিং: তাৎক্ষণিক থেকে ৩০ মিনিট</li>
                    <li>ব্যাংক ট্রান্সফার: ১-২৪ ঘন্টা</li>
                    <li>ক্রেডিট/ডেবিট কার্ড: তাৎক্ষণিক</li>
                    <li>ই-ওয়ালেট: তাৎক্ষণিক</li>
                    <li>ক্রিপ্টোকারেন্সি: ১-৬ নিশ্চিতকরণ, পদ্ধতির উপর নির্ভর করে</li>
                  </ul>
                  
                  <p className="text-sm text-muted-foreground mt-4">
                    ৩.২ উত্তোলন:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mt-2 space-y-1">
                    <li>মোবাইল ব্যাংকিং: ১-২৪ ঘন্টা</li>
                    <li>ব্যাংক ট্রান্সফার: ১-৩ কার্যদিবস</li>
                    <li>ই-ওয়ালেট: ১-২৪ ঘন্টা</li>
                    <li>ক্রিপ্টোকারেন্সি: ১-২৪ ঘন্টা</li>
                  </ul>
                  
                  <p className="text-sm text-muted-foreground mt-4">
                    ৩.৩ উত্তোলন রিভিউ সময়: সমস্ত উত্তোলন অনুরোধ প্রক্রিয়া করার আগে ম্যানুয়ালি পর্যালোচনা করা হয়। এটি অতিরিক্ত ১-২৪ ঘন্টা সময় নিতে পারে।
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">৪. ফি এবং চার্জ</h3>
                  <p className="text-sm text-muted-foreground">
                    ৪.১ জমা: TK999 জমা করার জন্য কোন ফি চার্জ করে না। তবে, আপনি যে পেমেন্ট পদ্ধতি ব্যবহার করেন তার নিজস্ব ফি থাকতে পারে।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৪.২ উত্তোলন: উত্তোলন ফি পেমেন্ট পদ্ধতির উপর নির্ভর করে:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mt-2 space-y-1">
                    <li>মোবাইল ব্যাংকিং: ১.৫% (ন্যূনতম ১০ টাকা)</li>
                    <li>ব্যাংক ট্রান্সফার: ০.৫% (ন্যূনতম ৫০ টাকা)</li>
                    <li>ই-ওয়ালেট: ২%</li>
                    <li>ক্রিপ্টোকারেন্সি: ০-১% (নেটওয়ার্ক ফি আলাদা)</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৪.৩ অব্যবহৃত ফি: আপনি যদি আপনার অ্যাকাউন্টে জমাকৃত অর্থ গেমিং বা বেটিং এর জন্য ব্যবহার না করেন, বা আপনি যদি জমাকৃত অর্থ উত্তোলন করতে চান, তবে ৫% প্রশাসনিক ফি প্রযোজ্য হতে পারে।
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">৫. কেওয়াইসি (KYC) নীতি</h3>
                  <p className="text-sm text-muted-foreground">
                    ৫.১ আমরা নিম্নলিখিত পরিস্থিতিতে কেওয়াইসি যাচাইকরণ প্রয়োজন করি:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mt-2 space-y-1">
                    <li>উচ্চ মূল্যের উত্তোলন (১০,০০০ টাকা বা তার বেশি)</li>
                    <li>সন্দেহজনক লেনদেন শনাক্ত হলে</li>
                    <li>একটি নির্দিষ্ট জমা বা উত্তোলন পরিমাণে পৌঁছালে</li>
                    <li>অ্যাকাউন্ট তথ্য আপডেট করার সময়</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-4">
                    ৫.২ কেওয়াইসি যাচাইকরণের জন্য প্রয়োজনীয় নথি:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mt-2 space-y-1">
                    <li>বৈধ পরিচয়পত্র (জাতীয় পরিচয়পত্র, পাসপোর্ট, ড্রাইভিং লাইসেন্স)</li>
                    <li>ঠিকানার প্রমাণ (৩ মাসের মধ্যে ইউটিলিটি বিল)</li>
                    <li>লেনদেনের প্রমাণ (প্রয়োজন হলে)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">৬. রিফান্ড এবং বাতিলকরণ</h3>
                  <p className="text-sm text-muted-foreground">
                    ৬.১ একবার একটি জমা আপনার অ্যাকাউন্টে প্রক্রিয়া করা হলে, সাধারণত তা ফেরতযোগ্য নয়।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৬.২ আপনি যদি ভুল লেনদেনের বা জালিয়াতির শিকার হন, তাহলে অনুগ্রহ করে অবিলম্বে আমাদের কাস্টমার সাপোর্টের সাথে যোগাযোগ করুন।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৬.৩ আমরা আমাদের বিবেচনায় রিফান্ড অনুমোদন করতে পারি, কিন্তু ফি এবং চার্জ প্রয়োজ্য হতে পারে।
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">৭. অ্যান্টি-মানি লন্ডারিং</h3>
                  <p className="text-sm text-muted-foreground">
                    ৭.১ TK999 কঠোর অ্যান্টি-মানি লন্ডারিং (AML) নীতি অনুসরণ করে। আমরা সমস্ত সন্দেহজনক লেনদেন পর্যবেক্ষণ করি এবং প্রয়োজনে উপযুক্ত কর্তৃপক্ষকে রিপোর্ট করি।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৭.২ আপনি সম্মত হন যে আপনি শুধুমাত্র আপনার নিজের অর্থ ব্যবহার করবেন এবং সমস্ত পেমেন্ট আপনার নিজের নামে হবে।
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">৮. অতিরিক্ত তথ্য</h3>
                  <p className="text-sm text-muted-foreground">
                    ৮.১ সমস্ত লেনদেন বাংলাদেশী টাকা (BDT) বা ইউরো (EUR) তে প্রক্রিয়া করা হয়। অন্যান্য মুদ্রার রূপান্তর প্রয়োজন হলে, বর্তমান বিনিময় হার প্রয়োগ করা হবে।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৮.২ আপনি যে কোন সময় আপনার অ্যাকাউন্ট সেটিংসে জমা এবং উত্তোলন সীমা সেট করতে পারেন।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৮.৩ কোন প্রশ্ন বা সমস্যার জন্য, দয়া করে আমাদের সাথে payments@tk999.com এ যোগাযোগ করুন।
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* বোনাস শর্তাবলী */}
          <TabsContent value="bonuses" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>বোনাস শর্তাবলী</CardTitle>
                <CardDescription>TK999 এর প্রমোশন এবং বোনাস সংক্রান্ত নিয়মাবলী</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">১. সাধারণ শর্তাবলী</h3>
                  <p className="text-sm text-muted-foreground">
                    ১.১ এই নিয়ম ও শর্তাবলী TK999 এর সমস্ত প্রমোশন এবং বোনাসের জন্য প্রযোজ্য, যদি না নির্দিষ্ট প্রমোশনের জন্য ভিন্ন শর্তাবলী উল্লেখ করা হয়।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ১.২ TK999 যে কোন সময় কোন কারণ না দেখিয়ে যে কোন প্রমোশন পরিবর্তন, সংশোধন বা বাতিল করার অধিকার সংরক্ষণ করে।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ১.৩ বোনাস অফার শুধুমাত্র একবার এবং প্রতি ব্যক্তি/পরিবার/ঠিকানা/ইমেইল/IP ঠিকানা/পেমেন্ট পদ্ধতি প্রতি একটি অ্যাকাউন্টের জন্য প্রযোজ্য।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ১.৪ TK999 কর্মীরা, তাদের পরিবারের সদস্যরা, এবং TK999 এর সাথে সম্পর্কিত ব্যক্তিরা বোনাসের জন্য যোগ্য নন।
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">২. স্বাগতম বোনাস</h3>
                  <p className="text-sm text-muted-foreground">
                    ২.১ স্বাগতম বোনাস শুধুমাত্র নতুন ব্যবহারকারীদের জন্য উপলব্ধ যারা প্রথমবার রেজিস্টার করেছেন এবং তাদের প্রথম জমা করেছেন।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ২.২ স্বাগতম বোনাস উত্তোলনযোগ্য হতে প্রথম জমার পরিমাণ ওয়েজারিং প্রয়োজনীয়তা পূরণ করতে হবে।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ২.৩ স্বাগতম বোনাস পেতে ন্যূনতম জমার পরিমাণ ৫০০ টাকা।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ২.৪ স্বাগতম বোনাস প্রথম জমার ১০০% পর্যন্ত, সর্বোচ্চ ১০,০০০ টাকা।
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">৩. ওয়েজারিং প্রয়োজনীয়তা</h3>
                  <p className="text-sm text-muted-foreground">
                    ৩.১ বোনাস এবং যে কোন জয় উত্তোলনযোগ্য হওয়ার আগে, আপনাকে অবশ্যই বোনাস পরিমাণের নির্দিষ্ট গুণিতক বাজি ধরতে হবে (ওয়েজারিং প্রয়োজনীয়তা)।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৩.২ বিভিন্ন গেম ক্যাটাগরি বিভিন্ন হারে ওয়েজারিং প্রয়োজনীয়তায় অবদান রাখে:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mt-2 space-y-1">
                    <li>স্লট গেমস: ১০০%</li>
                    <li>টেবিল গেমস: ১০%</li>
                    <li>লাইভ ক্যাসিনো: ১০%</li>
                    <li>স্পোর্টস বেটিং: ২০%</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-4">
                    ৩.৩ স্বাগতম বোনাসের জন্য স্ট্যান্ডার্ড ওয়েজারিং প্রয়োজনীয়তা ২০x (বোনাস পরিমাণ)।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৩.৪ রিলোড বোনাসের জন্য স্ট্যান্ডার্ড ওয়েজারিং প্রয়োজনীয়তা ১৫x (বোনাস পরিমাণ)।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৩.৫ ফ্রি স্পিন থেকে প্রাপ্ত জয় শুধুমাত্র কোন ওয়েজারিং প্রয়োজনীয়তা পূরণ করার পরে উত্তোলনযোগ্য।
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">৪. ফ্রি স্পিন</h3>
                  <p className="text-sm text-muted-foreground">
                    ৪.১ ফ্রি স্পিন শুধুমাত্র নির্দিষ্ট স্লট গেমে ব্যবহার করা যাবে, যা প্রমোশনের বিবরণে উল্লেখ করা থাকবে।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৪.২ ফ্রি স্পিনগুলি সাধারণত ২৪ ঘন্টার মধ্যে আপনার অ্যাকাউন্টে যোগ করা হবে, তবে কিছু পরিস্থিতিতে এটি ৭২ ঘন্টা পর্যন্ত সময় নিতে পারে।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৪.৩ ফ্রি স্পিনগুলি সাধারণত প্রদানের তারিখ থেকে ৭ দিনের জন্য বৈধ থাকে, তারপর মেয়াদ শেষ হয়ে যায়।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৪.৪ ফ্রি স্পিন থেকে প্রাপ্ত জয় বোনাস অর্থ হিসাবে গণ্য করা হয় এবং ওয়েজারিং প্রয়োজনীয়তা সাপেক্ষে।
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">৫. ক্যাশব্যাক</h3>
                  <p className="text-sm text-muted-foreground">
                    ৫.১ ক্যাশব্যাক বোনাসগুলি নির্দিষ্ট সময়কাল (সাধারণত সাপ্তাহিক বা মাসিক) জুড়ে আপনার নেট ক্ষতির একটি শতাংশ ফেরত দেয়।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৫.২ ক্যাশব্যাক অর্থ সাধারণত বোনাস ব্যালেন্সে যোগ করা হয় এবং ওয়েজারিং প্রয়োজনীয়তা সাপেক্ষে, তবে কিছু ক্ষেত্রে এটি সরাসরি নগদে যোগ করা হতে পারে।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৫.৩ ক্যাশব্যাক লভ্যতা এবং হার আপনার VIP স্তরের উপর নির্ভর করে ভিন্ন হতে পারে।
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">৬. রেফারেল বোনাস</h3>
                  <p className="text-sm text-muted-foreground">
                    ৬.১ যখন আপনি একজন বন্ধুকে রেফার করেন এবং তারা সাইনআপ করে এবং যোগ্য জমা করে, আপনি একটি রেফারেল বোনাস পাবেন।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৬.২ রেফারেল বোনাস পেতে, আপনার রেফারিকে অবশ্যই সাইনআপের সময় আপনার রেফারেল কোড ব্যবহার করতে হবে।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৬.৩ রেফারেল বোনাস সাধারণত বন্ধুর প্রথম জমার ১০% হয়, সর্বোচ্চ ১০০০ টাকা।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৬.৪ রেফারেল প্রোগ্রামের সম্পূর্ণ বিবরণ আমাদের রেফারেল/এফিলিয়েট পৃষ্ঠায় পাওয়া যাবে।
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">৭. VIP ও লয়্যালটি প্রোগ্রাম</h3>
                  <p className="text-sm text-muted-foreground">
                    ৭.১ TK999 একটি স্তরযুক্ত VIP প্রোগ্রাম অফার করে, যেখানে আপনি যত বেশি খেলবেন, তত বেশি পয়েন্ট এবং সুবিধা অর্জন করবেন।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৭.২ লয়্যালটি পয়েন্টগুলি নিম্নলিখিত হারে অর্জন করা যায়:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mt-2 space-y-1">
                    <li>স্লট গেমস: প্রতি ১০০ টাকা বাজির জন্য ১ পয়েন্ট</li>
                    <li>টেবিল গেমস: প্রতি ২০০ টাকা বাজির জন্য ১ পয়েন্ট</li>
                    <li>লাইভ ক্যাসিনো: প্রতি ২০০ টাকা বাজির জন্য ১ পয়েন্ট</li>
                    <li>স্পোর্টস বেটিং: প্রতি ২০০ টাকা বাজির জন্য ১ পয়েন্ট</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-4">
                    ৭.৩ লয়্যালটি পয়েন্টগুলি নগদে রূপান্তর করা যেতে পারে, বোনাস অফারে ব্যবহার করা যেতে পারে, বা বিশেষ পণ্য বা পুরস্কারের জন্য বিনিময় করা যেতে পারে।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৭.৪ VIP স্তর এবং সুবিধাগুলির সম্পূর্ণ বিবরণ VIP পৃষ্ঠায় পাওয়া যাবে।
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">৮. স্পেশাল এবং সীমিত সময়ের প্রমোশন</h3>
                  <p className="text-sm text-muted-foreground">
                    ৮.১ TK999 সময়ে সময়ে বিশেষ এবং সীমিত সময়ের প্রমোশন অফার করে, যেমন টুর্নামেন্ট, প্রাইজ ড্র, এবং হলিডে স্পেশাল।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৮.২ এই বিশেষ প্রমোশনগুলির নিজস্ব নির্দিষ্ট শর্তাবলী থাকতে পারে, যা প্রমোশনের পৃষ্ঠায় উল্লেখ করা থাকবে।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৮.৩ সর্বাধিক আপ-টু-ডেট প্রমোশন জানতে, "প্রমোশন" পৃষ্ঠা দেখুন বা আমাদের নিউজলেটারের জন্য সাইন আপ করুন।
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">৯. অপব্যবহার এবং অনিয়ম</h3>
                  <p className="text-sm text-muted-foreground">
                    ৯.১ TK999 যে কোন ধরনের বোনাস এবং প্রমোশন অপব্যবহার বা জালিয়াতি সহ্য করে না।
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ৯.২ বোনাস অপব্যবহারের উদাহরণের মধ্যে রয়েছে, কিন্তু এতেই সীমাবদ্ধ নয়:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mt-2 space-y-1">
                    <li>একাধিক অ্যাকাউন্ট তৈরি করা</li>
                    <li>ওয়েজারিং প্রয়োজনীয়তা এড়াতে বেটিং কৌশল (যেমন লো-রিস্ক বেটিং)</li>
                    <li>টিম বেটিং</li>
                    <li>অনির্দিষ্ট লেনদেন (যেমন ক্রেডিট কার্ড চার্জব্যাক)</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-4">
                    ৯.৩ যদি কোন অপব্যবহার বা অনিয়ম শনাক্ত করা হয়, TK999 নিম্নলিখিত কার্যক্রম নিতে পারে:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mt-2 space-y-1">
                    <li>বোনাস এবং সম্পর্কিত জয় বাতিল করা</li>
                    <li>অ্যাকাউন্ট সাময়িক বা স্থায়ীভাবে সসপেন্ড করা</li>
                    <li>ভবিষ্যত প্রমোশন থেকে বাদ দেওয়া</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">১০. যোগাযোগ</h3>
                  <p className="text-sm text-muted-foreground">
                    ১০.১ বোনাস বা প্রমোশন সম্পর্কিত কোন প্রশ্ন বা উদ্বেগের জন্য, দয়া করে আমাদের সাথে promotions@tk999.com এ যোগাযোগ করুন।
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}