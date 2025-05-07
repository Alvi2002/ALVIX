import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

export function MakeAdmin() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const makeAdmin = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // ডিরেক্টলি স্টোরেজে এক্সেস করে যেহেতু আমরা মেমরি স্টোরেজ ব্যবহার করছি
      const response = await fetch("/api/make-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });
      
      if (!response.ok) throw new Error("অ্যাডমিন বানাতে সমস্যা হয়েছে");
      
      await queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      toast({
        title: "সফল!",
        description: "আপনি এখন অ্যাডমিন হয়েছেন। পেজ রিফ্রেশ করুন।",
      });
      
      // 2 সেকেন্ড পর পেজ রিফ্রেশ
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error(error);
      toast({
        title: "সমস্যা হয়েছে",
        description: "অ্যাডমিন বানাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-muted/30 border rounded-md mt-6">
      <h2 className="text-lg font-medium mb-2">অ্যাডমিন অ্যাক্সেস</h2>
      <p className="text-sm text-muted-foreground mb-4">
        আপনি বর্তমানে অ্যাডমিন নন। অ্যাডমিন প্যানেল দেখার জন্য প্রথমে আপনাকে অ্যাডমিন হতে হবে।
      </p>
      <Button onClick={makeAdmin} disabled={isLoading}>
        {isLoading ? "প্রসেসিং..." : "অ্যাডমিন হন"}
      </Button>
    </div>
  );
}