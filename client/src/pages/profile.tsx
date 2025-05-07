import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileMenu from "@/components/layout/mobile-menu";
import MobileNav from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  User, 
  Settings,
  Shield,
  Bell,
  Trophy,
  LogOut,
  Check,
  Lock,
  Smartphone,
  Mail
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLocation } from "wouter";

const profileFormSchema = z.object({
  username: z.string().min(3, { message: "ইউজারনেম কমপক্ষে ৩ অক্ষর হতে হবে" }),
  email: z.string().email({ message: "একটি বৈধ ইমেইল ঠিকানা দিন" }),
  phone: z.string().min(11, { message: "একটি বৈধ ফোন নম্বর দিন" }),
  fullName: z.string().min(3, { message: "নাম কমপক্ষে ৩ অক্ষর হতে হবে" }),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(8, { message: "বর্তমান পাসওয়ার্ড দিন" }),
  newPassword: z.string().min(8, { message: "পাসওয়ার্ড কমপক্ষে ৮ অক্ষর হতে হবে" }),
  confirmPassword: z.string().min(8, { message: "পাসওয়ার্ড নিশ্চিত করুন" }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "পাসওয়ার্ড মিলছে না",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function ProfilePage() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [, setLocation] = useLocation();

  // নোট: পূর্বে এখানে লগইন চেক ছিল, কিন্তু এখন protected-route এর মাধ্যমে হচ্ছে
  // রিডাইরেক্ট করার প্রয়োজন নেই কারণ ProtectedRoute কম্পোনেন্ট এটি হ্যান্ডেল করবে

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user?.username || "",
      email: "user@example.com",
      phone: "01712345678",
      fullName: "ইউজার নাম",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleUpdateProfile = async (data: ProfileFormValues) => {
    setIsUpdating(true);
    
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'প্রোফাইল আপডেট করতে সমস্যা হয়েছে');
      }
      
      const updatedUser = await response.json();
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      
      toast({
        title: "প্রোফাইল আপডেট হয়েছে",
        description: "আপনার তথ্য সফলভাবে আপডেট করা হয়েছে"
      });
    } catch (error) {
      toast({
        title: "আপডেট ব্যর্থ হয়েছে",
        description: error instanceof Error ? error.message : 'একটি ত্রুটি ঘটেছে',
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async (data: PasswordFormValues) => {
    setIsUpdating(true);
    
    try {
      if (data.newPassword !== data.confirmPassword) {
        throw new Error("নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না");
      }
      
      const response = await fetch('/api/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'পাসওয়ার্ড আপডেট করতে সমস্যা হয়েছে');
      }
      
      toast({
        title: "পাসওয়ার্ড আপডেট হয়েছে",
        description: "আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে"
      });
      passwordForm.reset();
    } catch (error) {
      toast({
        title: "আপডেট ব্যর্থ হয়েছে",
        description: error instanceof Error ? error.message : 'একটি ত্রুটি ঘটেছে',
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const achievements = [
    { name: "নতুন সদস্য", description: "সাইনআপ করার জন্য", acquired: true },
    { name: "প্রথম জমা", description: "প্রথমবার টাকা জমা করার জন্য", acquired: true },
    { name: "প্রথম বেট", description: "প্রথমবার বাজি ধরার জন্য", acquired: true },
    { name: "প্রথম জয়", description: "প্রথমবার বাজি জেতার জন্য", acquired: false },
    { name: "বড় জয়", description: "একবারে ৫০০০+ টাকা জেতার জন্য", acquired: false },
    { name: "লয়াল প্লেয়ার", description: "৩০ দিন ক্রমাগত লগইন করার জন্য", acquired: false },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isLoggedIn={!!user} onLogout={handleLogout} />
      <MobileMenu />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-white font-header mb-6 flex items-center">
            <User className="text-accent mr-2 h-6 w-6" />
            প্রোফাইল
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* সাইডবার নেভিগেশন */}
            <div className="md:col-span-1">
              <div className="bg-card rounded-lg overflow-hidden shadow p-6 text-center mb-4">
                <div className="relative mx-auto w-24 h-24 mb-4">
                  <Avatar className="w-24 h-24 border-2 border-accent">
                    <AvatarImage src={avatar || undefined} />
                    <AvatarFallback className="bg-secondary text-white text-xl">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-accent text-secondary flex items-center justify-center cursor-pointer">
                    <input type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                  </label>
                </div>
                <h2 className="text-lg font-bold text-white mb-1">{user?.username}</h2>
                <p className="text-muted-foreground text-sm mb-3">সদস্য সিন্স: জুলাই ২০২৩</p>
                <Badge className="bg-accent text-secondary">ভিআইপি সদস্য</Badge>
              </div>

              <div className="bg-card rounded-lg overflow-hidden shadow">
                <button 
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 ${activeTab === "profile" ? "bg-accent text-secondary" : "text-white hover:bg-secondary"}`}
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="h-5 w-5" />
                  <span>প্রোফাইল তথ্য</span>
                </button>
                <button 
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 ${activeTab === "security" ? "bg-accent text-secondary" : "text-white hover:bg-secondary"}`}
                  onClick={() => setActiveTab("security")}
                >
                  <Shield className="h-5 w-5" />
                  <span>সিকিউরিটি</span>
                </button>
                <button 
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 ${activeTab === "notifications" ? "bg-accent text-secondary" : "text-white hover:bg-secondary"}`}
                  onClick={() => setActiveTab("notifications")}
                >
                  <Bell className="h-5 w-5" />
                  <span>নোটিফিকেশন</span>
                </button>
                <button 
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 ${activeTab === "achievements" ? "bg-accent text-secondary" : "text-white hover:bg-secondary"}`}
                  onClick={() => setActiveTab("achievements")}
                >
                  <Trophy className="h-5 w-5" />
                  <span>অর্জন</span>
                </button>
                <button 
                  className="w-full text-left px-4 py-3 flex items-center gap-3 text-red-400 hover:bg-secondary"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  <span>লগআউট</span>
                </button>
              </div>
            </div>

            {/* মূল কন্টেন্ট */}
            <div className="md:col-span-3">
              {activeTab === "profile" && (
                <Card className="bg-card border-secondary text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="text-accent mr-2 h-5 w-5" />
                      প্রোফাইল সেটিংস
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      আপনার ব্যক্তিগত তথ্য আপডেট করুন
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(handleUpdateProfile)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={profileForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">ইউজারনেম</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="আপনার ইউজারনেম লিখুন" 
                                    className="bg-secondary border-secondary"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">পুরো নাম</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="আপনার পুরো নাম লিখুন" 
                                    className="bg-secondary border-secondary"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">ইমেইল</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="আপনার ইমেইল লিখুন" 
                                    className="bg-secondary border-secondary"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">ফোন নম্বর</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="আপনার ফোন নম্বর লিখুন" 
                                    className="bg-secondary border-secondary"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="bg-accent text-secondary hover:bg-accent/90"
                          disabled={isUpdating}
                        >
                          {isUpdating ? "আপডেট হচ্ছে..." : "প্রোফাইল আপডেট করুন"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}

              {activeTab === "security" && (
                <Card className="bg-card border-secondary text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="text-accent mr-2 h-5 w-5" />
                      সিকিউরিটি সেটিংস
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      আপনার অ্যাকাউন্টের সিকিউরিটি আপডেট করুন
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(handleUpdatePassword)} className="space-y-6">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">বর্তমান পাসওয়ার্ড</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password"
                                  placeholder="আপনার বর্তমান পাসওয়ার্ড লিখুন" 
                                  className="bg-secondary border-secondary"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">নতুন পাসওয়ার্ড</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password"
                                  placeholder="নতুন পাসওয়ার্ড লিখুন" 
                                  className="bg-secondary border-secondary"
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription className="text-muted-foreground">
                                কমপক্ষে ৮ অক্ষর, ১টি বড় হাতের অক্ষর, ১টি নম্বর
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">পাসওয়ার্ড নিশ্চিত করুন</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password"
                                  placeholder="পাসওয়ার্ড আবার লিখুন" 
                                  className="bg-secondary border-secondary"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="bg-accent text-secondary hover:bg-accent/90"
                          disabled={isUpdating}
                        >
                          {isUpdating ? "আপডেট হচ্ছে..." : "পাসওয়ার্ড পরিবর্তন করুন"}
                        </Button>
                      </form>
                    </Form>

                    <div className="mt-8 pt-6 border-t border-secondary">
                      <h3 className="text-lg font-medium mb-4">টু-ফ্যাক্টর অথেনটিকেশন</h3>
                      
                      <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg mb-4">
                        <div className="flex items-center gap-3">
                          <Lock className="text-accent h-5 w-5" />
                          <div>
                            <p className="text-white font-medium">এসএমএস ভেরিফিকেশন</p>
                            <p className="text-muted-foreground text-sm">লগইন করার সময় এসএমএস কোড দিয়ে ভেরিফিকেশন</p>
                          </div>
                        </div>
                        <Switch />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Smartphone className="text-accent h-5 w-5" />
                          <div>
                            <p className="text-white font-medium">ইমেইল ভেরিফিকেশন</p>
                            <p className="text-muted-foreground text-sm">লগইন করার সময় ইমেইল কোড দিয়ে ভেরিফিকেশন</p>
                          </div>
                        </div>
                        <Switch checked={true} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "notifications" && (
                <Card className="bg-card border-secondary text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="text-accent mr-2 h-5 w-5" />
                      নোটিফিকেশন সেটিংস
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      নোটিফিকেশন প্রেফারেন্স কনফিগার করুন
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                      <div>
                        <p className="text-white font-medium">প্রমোশন নোটিফিকেশন</p>
                        <p className="text-muted-foreground text-sm">নতুন অফার ও প্রমোশন সম্পর্কে জানুন</p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                      <div>
                        <p className="text-white font-medium">লেনদেন আপডেট</p>
                        <p className="text-muted-foreground text-sm">জমা, উত্তোলন ও বেট স্টেটাস আপডেট</p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                      <div>
                        <p className="text-white font-medium">নতুন গেম আপডেট</p>
                        <p className="text-muted-foreground text-sm">নতুন গেম যোগ হলে জানুন</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                      <div>
                        <p className="text-white font-medium">ইমেইল নোটিফিকেশন</p>
                        <p className="text-muted-foreground text-sm">গুরুত্বপূর্ণ বিষয়ে ইমেইল পান</p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                      <div>
                        <p className="text-white font-medium">এসএমএস নোটিফিকেশন</p>
                        <p className="text-muted-foreground text-sm">গুরুত্বপূর্ণ বিষয়ে এসএমএস পান</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="bg-accent text-secondary hover:bg-accent/90 w-full">
                      সেটিংস সেভ করুন
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {activeTab === "achievements" && (
                <Card className="bg-card border-secondary text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Trophy className="text-accent mr-2 h-5 w-5" />
                      অর্জন সমূহ
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      আপনার প্লেয়িং অর্জন দেখুন
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {achievements.map((achievement, index) => (
                        <div 
                          key={index} 
                          className={`p-4 rounded-lg border ${
                            achievement.acquired 
                              ? "border-accent bg-secondary/30" 
                              : "border-secondary/50 bg-secondary/10 opacity-60"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {achievement.acquired ? (
                              <div className="w-10 h-10 rounded-full bg-accent text-secondary flex items-center justify-center">
                                <Check className="h-6 w-6" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-secondary text-muted-foreground flex items-center justify-center">
                                <Trophy className="h-6 w-6" />
                              </div>
                            )}
                            <div>
                              <h4 className="text-white font-medium">{achievement.name}</h4>
                              <p className="text-muted-foreground text-sm">{achievement.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}