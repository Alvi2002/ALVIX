import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileMenu from "@/components/layout/mobile-menu";
import MobileNav from "@/components/layout/mobile-nav";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ট্রানজেকশন টাইপ
type Transaction = {
  id: string;
  type: "deposit" | "withdraw" | "bonus" | "win" | "lose";
  amount: number;
  date: string;
  status: "success" | "pending" | "failed";
  method?: string;
  details?: string;
};

export default function TransactionsPage() {
  const { user, logoutMutation } = useAuth();
  const [filter, setFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // টাকার লেনদেনের তথ্য লোড করা
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['/api/transactions'],
    staleTime: 30 * 1000, // ৩০ সেকেন্ড
    enabled: !!user,
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // ট্রানজেকশন ফিল্টার করা
  const filteredTransactions = transactions.filter((tx: Transaction) => {
    // টাইপ ফিল্টার
    if (filter !== "all" && tx.type !== filter) return false;
    
    // সার্চ কোয়েরি
    if (searchQuery && !tx.id.includes(searchQuery) && 
        !(tx.details && tx.details.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    
    // তারিখ ফিল্টার
    if (dateRange !== "all") {
      const txDate = new Date(tx.date);
      const now = new Date();
      
      if (dateRange === "today") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (txDate < today) return false;
      } else if (dateRange === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        if (txDate < weekAgo) return false;
      } else if (dateRange === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        if (txDate < monthAgo) return false;
      }
    }
    
    return true;
  });

  // ট্রানজেকশন স্ট্যাটাস ব্যাজ রেন্ডার করা
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500">সফল</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">অপেক্ষমান</Badge>;
      case "failed":
        return <Badge className="bg-red-500">ব্যর্থ</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // ট্রানজেকশন টাইপ ব্যাজ রেন্ডার করা
  const renderTypeBadge = (type: string) => {
    switch (type) {
      case "deposit":
        return <Badge className="bg-blue-500">জমা</Badge>;
      case "withdraw":
        return <Badge className="bg-purple-500">উত্তোলন</Badge>;
      case "bonus":
        return <Badge className="bg-green-500">বোনাস</Badge>;
      case "win":
        return <Badge className="bg-emerald-500">জয়</Badge>;
      case "lose":
        return <Badge className="bg-red-500">হার</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isLoggedIn={!!user} onLogout={handleLogout} />
      <MobileMenu />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">আমার লেনদেন</h1>
          <p className="text-muted-foreground">আপনার সমস্ত আর্থিক লেনদেনের বিবরণ এখানে দেখুন</p>
        </div>
        
        {/* ফিল্টার এবং সার্চ সেকশন */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="লেনদেন আইডি খুঁজুন"
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="সকল লেনদেন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সকল লেনদেন</SelectItem>
                  <SelectItem value="deposit">জমা</SelectItem>
                  <SelectItem value="withdraw">উত্তোলন</SelectItem>
                  <SelectItem value="bonus">বোনাস</SelectItem>
                  <SelectItem value="win">জয়</SelectItem>
                  <SelectItem value="lose">হার</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="সময়কাল" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সবসময়</SelectItem>
                  <SelectItem value="today">আজ</SelectItem>
                  <SelectItem value="week">গত সপ্তাহ</SelectItem>
                  <SelectItem value="month">গত মাস</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                রিপোর্ট ডাউনলোড করুন
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* ট্রানজেকশন টেবিল */}
        <Card>
          <CardHeader>
            <CardTitle>লেনদেন হিস্টোরি</CardTitle>
            <CardDescription>মোট {filteredTransactions.length}টি লেনদেন পাওয়া গেছে</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">কোন লেনদেন পাওয়া যায়নি</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>আইডি</TableHead>
                      <TableHead>তারিখ</TableHead>
                      <TableHead>ধরন</TableHead>
                      <TableHead>পরিমাণ (৳)</TableHead>
                      <TableHead>পদ্ধতি</TableHead>
                      <TableHead>অবস্থা</TableHead>
                      <TableHead>বিবরণ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((tx: Transaction) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-mono">{tx.id}</TableCell>
                        <TableCell>
                          {new Date(tx.date).toLocaleDateString('bn-BD', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </TableCell>
                        <TableCell>{renderTypeBadge(tx.type)}</TableCell>
                        <TableCell className={`font-medium ${tx.type === 'deposit' || tx.type === 'win' || tx.type === 'bonus' ? 'text-green-500' : 'text-red-500'}`}>
                          {tx.type === 'deposit' || tx.type === 'win' || tx.type === 'bonus' ? '+' : '-'}
                          {tx.amount.toLocaleString('bn-BD')}
                        </TableCell>
                        <TableCell>{tx.method || '-'}</TableCell>
                        <TableCell>{renderStatusBadge(tx.status)}</TableCell>
                        <TableCell className="max-w-xs truncate">{tx.details || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}