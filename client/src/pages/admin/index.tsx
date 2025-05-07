import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Loader2, LayoutDashboard, Users, CreditCard, GanttChart } from "lucide-react";

import UsersPanel from "@/components/admin/users-panel";
import TransactionsPanel from "@/components/admin/users-panel";
import PromotionsPanel from "@/components/admin/promotions-panel";
import StatsPanel from "@/components/admin/stats-panel";

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  
  // যদি ইউজার লগডইন না হয় তাহলে অথ পেইজে রিডিরেক্ট করব
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  // যদি ইউজার এডমিন না হয় তাহলে হোম পেইজে রিডিরেক্ট করব
  if (!user.isAdmin) {
    return <Navigate to="/" />;
  }
  
  return (
    <Layout>
      <LayoutHeader className="px-6 py-4 border-b">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">এডমিন প্যানেল</h1>
          <div className="ml-auto flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              স্বাগতম, {user.fullName || user.username}
            </span>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList>
            <TabsTrigger value="dashboard" className="flex items-center">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              ড্যাশবোর্ড
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              ইউজার ম্যানেজমেন্ট
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              ট্রানজেকশন ম্যানেজমেন্ট
            </TabsTrigger>
            <TabsTrigger value="promotions" className="flex items-center">
              <GanttChart className="h-4 w-4 mr-2" />
              প্রমোশন ম্যানেজমেন্ট
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </LayoutHeader>
      
      <LayoutContent className="p-6">
        <TabsContent value="dashboard" className="mt-0">
          <StatsPanel />
        </TabsContent>
        
        <TabsContent value="users" className="mt-0">
          <UsersPanel />
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-0">
          <TransactionsPanel />
        </TabsContent>
        
        <TabsContent value="promotions" className="mt-0">
          <PromotionsPanel />
        </TabsContent>
      </LayoutContent>
    </Layout>
  );
}