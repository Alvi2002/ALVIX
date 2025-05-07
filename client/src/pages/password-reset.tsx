import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

// Schema for password reset request
const requestResetSchema = z.object({
  email: z.string().email("সঠিক ইমেইল অ্যাড্রেস দিন"),
});

// Schema for password reset confirmation
const resetPasswordSchema = z.object({
  code: z.string().min(6, "কোডটি সঠিক নয়"),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে"),
  confirmPassword: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "পাসওয়ার্ড মিলছে না",
  path: ["confirmPassword"],
});

type RequestResetFormValues = z.infer<typeof requestResetSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function PasswordResetPage() {
  const [step, setStep] = useState<"request" | "reset">("request");
  const [requestEmail, setRequestEmail] = useState<string>("");
  const { toast } = useToast();

  // Request reset form
  const requestForm = useForm<RequestResetFormValues>({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      email: "",
    },
  });

  // Reset password form
  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onRequestSubmit = (data: RequestResetFormValues) => {
    // এখানে backend API কল করতে হবে পাসওয়ার্ড রিসেট রিকোয়েস্ট পাঠানোর জন্য
    toast({
      title: "পাসওয়ার্ড রিসেট রিকোয়েস্ট সফল",
      description: `${data.email} এ একটি রিসেট কোড পাঠানো হয়েছে। দয়া করে আপনার ইমেইল চেক করুন।`,
    });
    setRequestEmail(data.email);
    setStep("reset");
  };

  const onResetSubmit = (data: ResetPasswordFormValues) => {
    // এখানে backend API কল করতে হবে পাসওয়ার্ড আপডেট করার জন্য
    toast({
      title: "পাসওয়ার্ড রিসেট সফল",
      description: "আপনার পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে। এখন আপনি লগইন করতে পারবেন।",
    });
    // রিসেট সফল হলে লগইন পেজে রিডাইরেক্ট করব
    window.location.href = "/auth";
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Link to="/auth" className="flex items-center text-sm text-muted-foreground mb-4 hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            লগইন পেজে ফিরে যান
          </Link>
          <CardTitle className="text-2xl font-bold">
            {step === "request" ? "পাসওয়ার্ড রিসেট করুন" : "নতুন পাসওয়ার্ড সেট করুন"}
          </CardTitle>
          <CardDescription>
            {step === "request" 
              ? "আপনার ইমেইল অ্যাড্রেস দিন, আমরা আপনাকে একটি রিসেট কোড পাঠাব।" 
              : "আপনার ইমেইলে পাঠানো কোডটি এবং আপনার নতুন পাসওয়ার্ড দিন।"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "request" ? (
            <Form {...requestForm}>
              <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="space-y-4">
                <FormField
                  control={requestForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ইমেইল অ্যাড্রেস</FormLabel>
                      <FormControl>
                        <Input placeholder="আপনার ইমেইল লিখুন" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">
                  রিসেট কোড পাঠান
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...resetForm}>
              <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
                <div className="text-sm mb-4 p-3 bg-muted rounded-md">
                  <span className="font-medium">{requestEmail}</span> ঠিকানায় একটি রিসেট কোড পাঠানো হয়েছে
                </div>
                
                <FormField
                  control={resetForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>রিসেট কোড</FormLabel>
                      <FormControl>
                        <Input placeholder="আপনার রিসেট কোড লিখুন" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={resetForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>নতুন পাসওয়ার্ড</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="নতুন পাসওয়ার্ড লিখুন" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={resetForm.control}
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
                
                <div className="flex gap-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep("request")}>
                    পেছনে যান
                  </Button>
                  <Button type="submit" className="flex-1">
                    পাসওয়ার্ড রিসেট করুন
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}