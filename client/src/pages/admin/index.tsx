import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

import UsersPanel from "@/components/admin/users-panel";
import TransactionsPanel from "@/components/admin/transactions-panel";
import PromotionsPanel from "@/components/admin/promotions-panel";
import StatsPanel from "@/components/admin/stats-panel";

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  // অ্যাডমিন আছে কিনা যাচাই
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // ইউজার না থাকলে বা এডমিন না হলে লগইন পেজে রিডাইরেক্ট
  if (!user || !user.isAdmin) {
    return <Redirect to="/auth" />;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">অ্যাডমিন প্যানেল</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="dashboard">ড্যাশবোর্ড</TabsTrigger>
          <TabsTrigger value="users">ইউজারস</TabsTrigger>
          <TabsTrigger value="transactions">ট্রানজেকশন</TabsTrigger>
          <TabsTrigger value="promotions">প্রমোশন</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <StatsPanel />
        </TabsContent>
        
        <TabsContent value="users" className="space-y-6">
          <UsersPanel />
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-6">
          <TransactionsPanel />
        </TabsContent>
        
        <TabsContent value="promotions" className="space-y-6">
          <PromotionsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}