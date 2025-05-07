import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export function MakeAdmin() {
  const [secretKey, setSecretKey] = useState("");
  const { toast } = useToast();
  
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
        const errorData = await res.json();
        throw new Error(errorData.message || "অ্যাডমিন বানাতে সমস্যা হয়েছে");
      }
      
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "অভিনন্দন!",
        description: "আপনি সফলভাবে অ্যাডমিন হিসেবে যোগ হয়েছেন। পেইজটি রিফ্রেশ করুন।",
      });
      setSecretKey("");
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "সমস্যা হয়েছে",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretKey.trim()) {
      toast({
        title: "সমস্যা হয়েছে",
        description: "গোপন কোড দিতে হবে",
        variant: "destructive",
      });
      return;
    }
    
    makeAdminMutation.mutate(secretKey);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
          অ্যাডমিন অ্যাক্সেস
        </CardTitle>
        <CardDescription>অ্যাডমিন প্যানেল অ্যাক্সেস করতে গোপন কোড দিন</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="secretKey">গোপন কোড</Label>
              <Input 
                id="secretKey" 
                placeholder="গোপন কোড দিন" 
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            type="submit" 
            disabled={makeAdminMutation.isPending}
          >
            {makeAdminMutation.isPending ? "প্রসেসিং..." : "অ্যাডমিন হোন"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}