import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

// Schemas for login and registration
const loginSchema = z.object({
  username: z.string().min(3, "ইউজারনেম কমপক্ষে ৩ অক্ষর হতে হবে"),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে"),
});

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে"),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "আপনাকে শর্তাবলী মেনে নিতে হবে",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "পাসওয়ার্ড মিলছে না",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    const { confirmPassword, termsAccepted, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-5xl">
        {/* Auth Forms */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="font-header text-center text-2xl">
              <span className="text-white">TK</span>
              <span className="text-accent">999</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login">লগইন</TabsTrigger>
                <TabsTrigger value="register">রেজিস্ট্রেশন</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ইউজারনেম</FormLabel>
                          <FormControl>
                            <Input placeholder="আপনার ইউজারনেম লিখুন" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>পাসওয়ার্ড</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="আপনার পাসওয়ার্ড লিখুন" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" />
                        <label htmlFor="remember" className="text-sm cursor-pointer">
                          আমাকে মনে রাখুন
                        </label>
                      </div>
                      <Link href="/password-reset" className="text-accent text-sm hover:underline">
                        পাসওয়ার্ড ভুলে গেছেন?
                      </Link>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                      {loginMutation.isPending ? "লগইন হচ্ছে..." : "লগইন করুন"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ইউজারনেম</FormLabel>
                          <FormControl>
                            <Input placeholder="আপনার ইউজারনেম লিখুন" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>পাসওয়ার্ড</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="আপনার পাসওয়ার্ড লিখুন" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>পাসওয়ার্ড নিশ্চিত করুন</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="পাসওয়ার্ড আবার লিখুন" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="termsAccepted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm">
                              আমি <Link href="/terms" className="text-accent hover:underline">নিয়ম ও শর্তাবলী</Link> এবং{" "}
                              <Link href="/privacy" className="text-accent hover:underline">গোপনীয়তা নীতি</Link> পড়েছি এবং সম্মত
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                      {registerMutation.isPending ? "রেজিস্ট্রেশন হচ্ছে..." : "রেজিস্ট্রেশন করুন"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Hero Section */}
        <div className="hidden md:flex flex-col justify-center rounded-lg overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-transparent opacity-40"></div>
          <div className="bg-accent/10 p-8 rounded-lg backdrop-blur-sm relative z-10 shadow-xl">
            <h1 className="text-4xl font-bold mb-6 font-header text-white">
              <span className="text-white">TK</span>
              <span className="text-accent">999</span> - গেমিং প্ল্যাটফর্ম
            </h1>
            <div className="space-y-4 text-foreground">
              <p className="mb-4">
                আমাদের প্ল্যাটফর্মে আপনাকে স্বাগতম! আমরা আপনাকে অফার করি:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-accent text-black flex items-center justify-center mr-2">✓</div>
                  <span>শীর্ষ মানের স্লট গেমস</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-accent text-black flex items-center justify-center mr-2">✓</div>
                  <span>লাইভ ক্যাসিনো সহ দক্ষ ডিলার</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-accent text-black flex items-center justify-center mr-2">✓</div>
                  <span>২৪/৭ গ্রাহক সহায়তা</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-accent text-black flex items-center justify-center mr-2">✓</div>
                  <span>দ্রুত এবং নিরাপদ লেনদেন</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-accent text-black flex items-center justify-center mr-2">✓</div>
                  <span>আকর্ষণীয় বোনাস এবং প্রমোশন</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
