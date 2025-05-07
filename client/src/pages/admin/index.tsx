import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Loader2, LayoutDashboard, Users, CreditCard, GanttChart } from "lucide-react";

import UsersPanel from "@/components/admin/users-panel";
import TransactionsPanel from "@/components/admin/transactions-panel";
import PromotionsPanel from "@/components/admin/promotions-panel";
import StatsPanel from "@/components/admin/stats-panel";
import { Layout, LayoutContent, LayoutHeader } from "@/components/layout";

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
  
  const [, navigate] = useLocation();
  
  if (!user) {
    navigate("/auth");
    return null;
  }
  
  // যদি ইউজার এডমিন না হয় তাহলে হোম পেইজে রিডিরেক্ট করব
  if (!user.isAdmin) {
    navigate("/");
    return null;
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
        <div className="mt-4 flex space-x-4 border-b">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`pb-2 px-2 flex items-center ${activeTab === 'dashboard' ? 'border-b-2 border-primary text-primary font-medium' : 'text-muted-foreground'}`}
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            ড্যাশবোর্ড
          </button>
          <button 
            onClick={() => setActiveTab('users')} 
            className={`pb-2 px-2 flex items-center ${activeTab === 'users' ? 'border-b-2 border-primary text-primary font-medium' : 'text-muted-foreground'}`}
          >
            <Users className="h-4 w-4 mr-2" />
            ইউজার ম্যানেজমেন্ট
          </button>
          <button 
            onClick={() => setActiveTab('transactions')} 
            className={`pb-2 px-2 flex items-center ${activeTab === 'transactions' ? 'border-b-2 border-primary text-primary font-medium' : 'text-muted-foreground'}`}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            ট্রানজেকশন ম্যানেজমেন্ট
          </button>
          <button 
            onClick={() => setActiveTab('promotions')} 
            className={`pb-2 px-2 flex items-center ${activeTab === 'promotions' ? 'border-b-2 border-primary text-primary font-medium' : 'text-muted-foreground'}`}
          >
            <GanttChart className="h-4 w-4 mr-2" />
            প্রমোশন ম্যানেজমেন্ট
          </button>
        </div>
      </LayoutHeader>
      
      <LayoutContent className="p-6">
        {activeTab === 'dashboard' && <StatsPanel />}
        {activeTab === 'users' && <UsersPanel />}
        {activeTab === 'transactions' && <TransactionsPanel />}
        {activeTab === 'promotions' && <PromotionsPanel />}
      </LayoutContent>
    </Layout>
  );
}