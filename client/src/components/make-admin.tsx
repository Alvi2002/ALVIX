import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { queryClient } from "@/lib/queryClient";
import { ShieldAlert } from "lucide-react";

export function MakeAdmin() {
  const [secretKey, setSecretKey] = useState("");
  const { toast } = useToast();
  
  // অ্যাডমিন বানানোর মিউটেশন
  const makeAdminMutation = useMutation({
    mutationFn: async (key: string) => {
      const res = await fetch("/api/make-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ secretKey: key })
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "অ্যাডমিন বানাতে সমস্যা হয়েছে");
      }
      
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "সফল!",
        description: data.message || "আপনাকে অ্যাডমিন করা হয়েছে।",
      });
      
      setSecretKey("");
      
      // ইউজার ডাটা রিফ্রেশ করা
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "সমস্যা হয়েছে!",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!secretKey.trim()) {
      toast({
        title: "সমস্যা হয়েছে!",
        description: "গোপন কোড দিন",
        variant: "destructive",
      });
      return;
    }
    
    makeAdminMutation.mutate(secretKey);
  };
  
  return (
    <Card className="border-dashed">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">অ্যাডমিন প্যানেল অ্যাক্সেস</CardTitle>
        </div>
        <CardDescription>
          অ্যাডমিন প্যানেল অ্যাক্সেস পেতে আপনার গোপন কোড দিন
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input
                id="secretKey"
                placeholder="গোপন কোড"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setSecretKey("")}
            type="button"
          >
            মুছুন
          </Button>
          <Button 
            type="submit"
            disabled={makeAdminMutation.isPending || !secretKey.trim()}
          >
            {makeAdminMutation.isPending ? "প্রসেসিং..." : "অ্যাডমিন বানান"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}