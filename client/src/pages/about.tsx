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
import { Shield, Users, Trophy, Target, Clock, HeartHandshake } from "lucide-react";

export default function AboutPage() {
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
          <h1 className="text-3xl font-bold mb-2">আমাদের সম্পর্কে</h1>
          <p className="text-muted-foreground">ALVIX - বাংলাদেশের অন্যতম সেরা অনলাইন গেমিং ও বেটিং প্ল্যাটফর্ম</p>
        </div>
        
        {/* কম্পানি পরিচিতি সেকশন */}
        <section className="mb-12">
          <Card className="bg-card border-accent/20">
            <CardContent className="pt-6">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-4 text-center">আমাদের কম্পানি পরিচিতি</h2>
                <p className="mb-4 text-muted-foreground">
                  ALVIX হল বাংলাদেশের অন্যতম প্রধান অনলাইন গেমিং ও বেটিং প্ল্যাটফর্ম, যা ২০২০ সালে প্রতিষ্ঠিত হয়েছিল। আমরা সর্বদা নিরাপদ, আধুনিক, এবং আনন্দদায়ক অনলাইন গেমিং অভিজ্ঞতা প্রদান করার জন্য প্রতিশ্রুতিবদ্ধ।
                </p>
                <p className="mb-4 text-muted-foreground">
                  আমরা বিশ্বের সেরা গেমিং প্রোভাইডারদের সাথে অংশীদারিত্ব করে থাকি যাতে আমাদের ব্যবহারকারীরা সর্বোচ্চ মানের স্লট গেমস, লাইভ ক্যাসিনো, এবং স্পোর্টস বেটিং অপশনগুলি উপভোগ করতে পারেন। আমাদের দক্ষ কাস্টমার সাপোর্ট টিম সপ্তাহে ৭ দিন, দিনে ২৪ ঘন্টা আপনার সেবায় নিয়োজিত রয়েছে।
                </p>
                <p className="text-muted-foreground">
                  TK999 এ, আমরা বিশ্বাস করি যে আমাদের ব্যবহারকারীরা সেরা সেবা পাওয়ার অধিকারী, এবং আমরা সেই লক্ষ্য পূরণের জন্য প্রতিদিন কঠোর পরিশ্রম করি।
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* আমাদের মূল্যবোধ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">আমাদের মূল্যবোধ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-card border-accent/20">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <CardTitle>নিরাপত্তা</CardTitle>
                  <CardDescription>আমাদের প্রথম অগ্রাধিকার</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  আমরা আপনার ব্যক্তিগত তথ্য এবং লেনদেন সুরক্ষিত রাখতে শীর্ষ মানের এনক্রিপশন এবং নিরাপত্তা ব্যবস্থা ব্যবহার করি।
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-accent/20">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <HeartHandshake className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <CardTitle>বিশ্বস্ততা</CardTitle>
                  <CardDescription>আমাদের ভিত্তি</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  আমরা সবসময় স্বচ্ছতা এবং সততার সাথে কাজ করি, আপনার বিশ্বাস অর্জন করাই আমাদের মূল লক্ষ্য।
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-accent/20">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <CardTitle>উৎকর্ষতা</CardTitle>
                  <CardDescription>আমাদের অঙ্গীকার</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  আমরা নিরন্তর উন্নতির দিকে প্রতিশ্রুতিবদ্ধ, আমাদের প্ল্যাটফর্ম এবং সেবাগুলিকে ক্রমাগত আরও ভালো করার জন্য কাজ করি।
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-accent/20">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <CardTitle>সম্প্রদায়</CardTitle>
                  <CardDescription>আমাদের শক্তি</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  আমরা একটি শক্তিশালী গেমিং সম্প্রদায় গড়ে তুলতে বিশ্বাস করি, যেখানে সকল ব্যবহারকারী সম্মানিত এবং মূল্যায়িত বোধ করেন।
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-accent/20">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <CardTitle>দায়িত্বশীলতা</CardTitle>
                  <CardDescription>আমাদের নীতি</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  আমরা দায়িত্বশীল গেমিং অনুশীলনকে উৎসাহিত করি এবং সমস্যাজনক গেমিং প্রতিরোধে বিভিন্ন সরঞ্জাম এবং সহায়তা প্রদান করি।
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-accent/20">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <CardTitle>উদ্ভাবন</CardTitle>
                  <CardDescription>আমাদের ভবিষ্যৎ</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  আমরা সর্বদা নতুন প্রযুক্তি এবং উদ্ভাবনের সাথে তাল মিলিয়ে চলি, যাতে আমাদের ব্যবহারকারীরা সর্বাধুনিক গেমিং অভিজ্ঞতা পান।
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* আমাদের পরিসংখ্যান */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">আমাদের পরিসংখ্যান</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-card border-accent/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">৫৫০,০০০+</div>
                <div className="text-sm text-muted-foreground">সক্রিয় ব্যবহারকারী</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-accent/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">২,০০০+</div>
                <div className="text-sm text-muted-foreground">জনপ্রিয় গেম</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-accent/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">৫৫+</div>
                <div className="text-sm text-muted-foreground">পেমেন্ট বিকল্প</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-accent/20">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">১৫+</div>
                <div className="text-sm text-muted-foreground">বছরের অভিজ্ঞতা</div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* সাহায্য এবং সহযোগিতা */}
        <section>
          <Card className="bg-card border-accent/20">
            <CardHeader>
              <CardTitle className="text-xl">আমাদের সাথে যোগাযোগ করুন</CardTitle>
              <CardDescription>আপনার যেকোনো প্রশ্ন বা সাহায্যের জন্য আমরা এখানে আছি</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">যোগাযোগের ঠিকানা</h3>
                  <p className="text-sm text-muted-foreground mb-1">ইমেইল: support@tk999.com</p>
                  <p className="text-sm text-muted-foreground mb-1">হটলাইন: +৮৮০১৭০০০০০০০০</p>
                  <p className="text-sm text-muted-foreground">লাইভ চ্যাট: ২৪/৭ সাপোর্ট</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">ফলো করুন</h3>
                  <div className="flex space-x-3">
                    <a href="#" className="text-accent hover:text-accent/80">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                    <a href="#" className="text-accent hover:text-accent/80">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                    </a>
                    <a href="#" className="text-accent hover:text-accent/80">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                    </a>
                  </div>
                </div>
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