import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, Link } from "wouter";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import UsersPanel from "@/components/admin/users-panel";
import GamesPanel from "@/components/admin/games-panel";
import TransactionsPanel from "@/components/admin/transactions-panel";
import PromotionsPanel from "@/components/admin/promotions-panel";
import StatsPanel from "@/components/admin/stats-panel";

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  // অ্যাডমিন না হলে রিডাইরেক্ট করা
  if (!user) {
    return <Redirect to="/auth" />;
  }

  if (!user.isAdmin) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header isLoggedIn={!!user} onLogout={() => {}} />
        <main className="flex-grow flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-primary">অননুমোদিত অ্যাক্সেস</CardTitle>
              <CardDescription className="text-center">
                আপনার এই পৃষ্ঠাটি দেখার অনুমতি নেই।
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Link href="/">
                <Button>হোম পেইজে ফিরে যান</Button>
              </Link>
            </CardFooter>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isLoggedIn={!!user} onLogout={() => {}} />
      
      <main className="flex-grow p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6">এডমিন প্যানেল</h1>
          
          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="dashboard">ড্যাশবোর্ড</TabsTrigger>
              <TabsTrigger value="users">ইউজার</TabsTrigger>
              <TabsTrigger value="games">গেমস</TabsTrigger>
              <TabsTrigger value="transactions">লেনদেন</TabsTrigger>
              <TabsTrigger value="promotions">প্রমোশন</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <StatsPanel />
            </TabsContent>
            
            <TabsContent value="users">
              <UsersPanel />
            </TabsContent>
            
            <TabsContent value="games">
              <GamesPanel />
            </TabsContent>
            
            <TabsContent value="transactions">
              <TransactionsPanel />
            </TabsContent>
            
            <TabsContent value="promotions">
              <PromotionsPanel />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}