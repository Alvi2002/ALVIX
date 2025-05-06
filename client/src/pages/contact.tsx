import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileMenu from "@/components/layout/mobile-menu";
import MobileNav from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "নাম অবশ্যই ২ অক্ষরের বেশি হতে হবে" }),
  email: z.string().email({ message: "একটি বৈধ ইমেইল ঠিকানা দিন" }),
  subject: z.string().min(5, { message: "বিষয় অবশ্যই ৫ অক্ষরের বেশি হতে হবে" }),
  message: z.string().min(10, { message: "বার্তা অবশ্যই ১০ অক্ষরের বেশি হতে হবে" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSending(true);
    
    // অসল API কল আসলে এখানে করা হবে
    setTimeout(() => {
      toast({
        title: "বার্তা পাঠানো হয়েছে",
        description: "আমরা আপনার সাথে যোগাযোগ করব",
      });
      form.reset();
      setIsSending(false);
    }, 1500);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const socialLinks = [
    { name: "Facebook", icon: <Facebook />, link: "https://facebook.com" },
    { name: "Instagram", icon: <Instagram />, link: "https://instagram.com" },
    { name: "Twitter", icon: <Twitter />, link: "https://twitter.com" },
    { name: "Youtube", icon: <Youtube />, link: "https://youtube.com" },
    { name: "Telegram", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-12 10-5-4"/><path d="m22 8-17 4 10 2z"/></svg>, link: "https://telegram.org" },
  ];

  const contactMethods = [
    {
      icon: <Phone className="h-10 w-10 text-accent" />,
      title: "ফোন",
      description: "আমাদের কাস্টমার সাপোর্টে কল করুন, ২৪/৭ সেবা পাবেন",
      info: "+৮৮০ ১৭১২-৩৪৫৬৭৮",
    },
    {
      icon: <Mail className="h-10 w-10 text-accent" />,
      title: "ইমেইল",
      description: "আমাদের ইমেইলে মেসেজ পাঠান, ৪৮ ঘণ্টার মধ্যে উত্তর পাবেন",
      info: "support@tk999.org",
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-accent" />,
      title: "লাইভ চ্যাট",
      description: "আমাদের লাইভ চ্যাট সুবিধা ব্যবহার করুন, সাথে সাথে সমাধান পাবেন",
      info: "অনলাইন বাটনে ক্লিক করুন",
    },
    {
      icon: <MapPin className="h-10 w-10 text-accent" />,
      title: "ঠিকানা",
      description: "আমাদের অফিসে ভিজিট করুন",
      info: "১২৩ গুলশান এভিনিউ, ঢাকা-১২১২, বাংলাদেশ",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isLoggedIn={!!user} onLogout={handleLogout} />
      <MobileMenu />
      
      <main className="flex-grow">
        {/* Hero Banner */}
        <div className="w-full bg-gradient-to-r from-card via-cyan-900 to-card py-12 px-4">
          <div className="container mx-auto">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold text-white font-header mb-3">
                আমাদের সাথে <span className="text-accent">যোগাযোগ করুন</span>
              </h1>
              <p className="text-muted-foreground mb-6">
                আপনার যেকোনো প্রশ্ন, মতামত বা সমস্যা আমাদের জানান। আমাদের দক্ষ সাপোর্ট টিম সবসময় আপনাকে সাহায্য করতে প্রস্তুত।
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* যোগাযোগ ফর্ম */}
            <div>
              <h2 className="text-2xl font-bold text-white font-header mb-6">আমাদের মেসেজ পাঠান</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">আপনার নাম</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="আপনার নাম লিখুন" 
                            className="bg-card border-secondary"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">ইমেইল</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="আপনার ইমেইল লিখুন" 
                            className="bg-card border-secondary"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">বিষয়</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="মেসেজের বিষয় লিখুন" 
                            className="bg-card border-secondary"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">আপনার বার্তা</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="আপনার বার্তা বিস্তারিত লিখুন" 
                            className="bg-card border-secondary min-h-[150px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-accent text-secondary hover:bg-accent/90"
                    disabled={isSending}
                  >
                    {isSending ? "পাঠানো হচ্ছে..." : "বার্তা পাঠান"}
                  </Button>
                </form>
              </Form>
            </div>
            
            {/* যোগাযোগের বিবরণ */}
            <div>
              <h2 className="text-2xl font-bold text-white font-header mb-6">যোগাযোগের বিবরণ</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactMethods.map((method, index) => (
                  <div key={index} className="bg-card p-5 rounded-lg">
                    <div className="mb-4 flex justify-center">
                      {method.icon}
                    </div>
                    <h3 className="text-lg font-medium text-white text-center mb-2">{method.title}</h3>
                    <p className="text-muted-foreground text-sm text-center mb-2">{method.description}</p>
                    <p className="text-accent font-medium text-center">{method.info}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-bold text-white font-header mb-4">আমাদের সোশ্যাল মিডিয়াতে যোগ দিন</h3>
                
                <div className="flex gap-4 flex-wrap">
                  {socialLinks.map((social, index) => (
                    <a 
                      key={index} 
                      href={social.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-card p-3 rounded-full hover:bg-accent transition-colors"
                    >
                      <span className="text-white hover:text-secondary">{social.icon}</span>
                    </a>
                  ))}
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-bold text-white font-header mb-4">সচরাচর জিজ্ঞাসিত প্রশ্ন</h3>
                
                <div className="space-y-4">
                  <div className="bg-card p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">কীভাবে অ্যাকাউন্ট খুলব?</h4>
                    <p className="text-muted-foreground text-sm">রেজিস্ট্রেশন পেজে গিয়ে প্রয়োজনীয় তথ্য দিয়ে সহজেই অ্যাকাউন্ট খুলুন</p>
                  </div>
                  
                  <div className="bg-card p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">কীভাবে টাকা জমা দিব?</h4>
                    <p className="text-muted-foreground text-sm">ওয়ালেট সেকশনে গিয়ে বিভিন্ন পেমেন্ট পদ্ধতি ব্যবহার করে টাকা জমা দিন</p>
                  </div>
                  
                  <div className="bg-card p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">কীভাবে টাকা তুলব?</h4>
                    <p className="text-muted-foreground text-sm">ওয়ালেট সেকশন থেকে উইথড্র অপশনে গিয়ে টাকা তোলার আবেদন করুন</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}