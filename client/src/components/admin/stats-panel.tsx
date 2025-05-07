import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, WalletIcon, Wallet, CreditCard, Activity, ArrowUpRight, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell, Legend } from "recharts";
import { useState } from "react";

interface Stats {
  totalUsers: number;
  totalBalance: string;
  totalDeposits: string;
  totalWithdrawals: string;
  transactionsToday: number;
  newUsersToday: number;
  depositChart: {
    date: string;
    amount: number;
  }[];
  withdrawalChart: {
    date: string;
    amount: number;
  }[];
  transactionStats: {
    name: string;
    value: number;
    fill: string;
  }[];
  userStats: {
    name: string;
    value: number;
    fill: string;
  }[];
}

export default function StatsPanel() {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  
  // স্ট্যাটস লোড করা
  const { data: stats, isLoading, refetch } = useQuery<Stats>({
    queryKey: ["/api/admin/stats", timeRange],
    queryFn: async () => {
      const res = await fetch(`/api/admin/stats?timeRange=${timeRange}`);
      if (!res.ok) throw new Error("স্ট্যাটস লোড করতে সমস্যা হয়েছে");
      
      // কারণ এন্ডপয়েন্ট এখনো বাস্তবায়িত হয় নি, এর ফলে আমরা ডেমো ডাটা রিটার্ন করছি
      // প্রডাকশনে এন্ডপয়েন্টটি বাস্তবায়ন করা হবে
      return {
        totalUsers: 1285,
        totalBalance: "42500000",
        totalDeposits: "85000000",
        totalWithdrawals: "42500000",
        transactionsToday: 348,
        newUsersToday: 57,
        depositChart: [
          { date: "Jan", amount: 4000 },
          { date: "Feb", amount: 3000 },
          { date: "Mar", amount: 5000 },
          { date: "Apr", amount: 8000 },
          { date: "May", amount: 7000 },
          { date: "Jun", amount: 9000 },
          { date: "Jul", amount: 11000 },
        ],
        withdrawalChart: [
          { date: "Jan", amount: 2000 },
          { date: "Feb", amount: 1500 },
          { date: "Mar", amount: 3000 },
          { date: "Apr", amount: 4500 },
          { date: "May", amount: 3500 },
          { date: "Jun", amount: 5000 },
          { date: "Jul", amount: 6500 },
        ],
        transactionStats: [
          { name: "ডিপোজিট", value: 65, fill: "#10b981" },
          { name: "উইথড্র", value: 30, fill: "#f97316" },
          { name: "বোনাস", value: 5, fill: "#8b5cf6" },
        ],
        userStats: [
          { name: "সাধারণ", value: 85, fill: "#6b7280" },
          { name: "VIP", value: 10, fill: "#f59e0b" },
          { name: "এডমিন", value: 5, fill: "#3b82f6" },
        ],
      };
    },
    // ডেমো ডাটা দেখানোর জন্য staleTime বাড়িয়ে দেওয়া হয়েছে
    staleTime: 1000 * 60 * 5, // 5 মিনিট
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">ড্যাশবোর্ড</h2>
          <p className="text-sm text-muted-foreground">সাইটের সামগ্রিক পরিসংখ্যান এবং তথ্য</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex rounded-md border">
            <Button 
              variant={timeRange === 'day' ? "default" : "ghost"}
              size="sm" 
              className="rounded-r-none"
              onClick={() => setTimeRange('day')}
            >
              আজ
            </Button>
            <Button 
              variant={timeRange === 'week' ? "default" : "ghost"}
              size="sm" 
              className="rounded-none border-x"
              onClick={() => setTimeRange('week')}
            >
              সপ্তাহ
            </Button>
            <Button 
              variant={timeRange === 'month' ? "default" : "ghost"}
              size="sm" 
              className="rounded-l-none"
              onClick={() => setTimeRange('month')}
            >
              মাস
            </Button>
          </div>
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* কার্ড রো - ১ */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* মোট ইউজার */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              মোট ইউজার
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "লোড হচ্ছে..." : stats?.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500 font-medium">+{stats?.newUsersToday || 0}</span> <span className="ml-1">আজ</span>
            </p>
          </CardContent>
        </Card>
        
        {/* মোট ব্যালেন্স */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              মোট ব্যালেন্স
            </CardTitle>
            <WalletIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "লোড হচ্ছে..." : `৳${parseInt(stats?.totalBalance || "0").toLocaleString()}`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              সকল ইউজারের মোট ব্যালেন্স
            </p>
          </CardContent>
        </Card>
        
        {/* মোট ডিপোজিট */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              মোট ডিপোজিট
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "লোড হচ্ছে..." : `৳${parseInt(stats?.totalDeposits || "0").toLocaleString()}`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              সর্বকালের মোট ডিপোজিট
            </p>
          </CardContent>
        </Card>
        
        {/* মোট উইথড্র */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              মোট উইথড্র
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "লোড হচ্ছে..." : `৳${parseInt(stats?.totalWithdrawals || "0").toLocaleString()}`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              সর্বকালের মোট উইথড্র
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* ট্রানজেকশন চার্ট */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>ট্রানজেকশন হিস্ট্রি</CardTitle>
            <CardDescription>সময়ের সাথে ডিপোজিট এবং উইথড্র</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart
                data={stats?.depositChart}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`৳${value.toLocaleString()}`, undefined]}
                  labelFormatter={(label) => `তারিখ: ${label}`}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  name="ডিপোজিট"
                  stroke="#10b981" 
                  fill="#10b98150" 
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  name="উইথড্র"
                  data={stats?.withdrawalChart}
                  stroke="#f97316" 
                  fill="#f9731650" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* ট্রানজেকশন এবং ইউজার স্ট্যাটিস্টিক্স */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>স্ট্যাটিস্টিক্স</CardTitle>
            <CardDescription>ট্রানজেকশন এবং ইউজার</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div>
                <h4 className="text-sm font-semibold mb-2">ট্রানজেকশন টাইপ</h4>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart width={500} height={300} data={stats?.transactionStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, undefined]}
                      labelFormatter={(label) => `টাইপ: ${label}`}
                    />
                    <Bar dataKey="value" name="শতাংশ">
                      {stats?.transactionStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-2">ইউজার ধরণ</h4>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart width={500} height={300} data={stats?.userStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, undefined]}
                      labelFormatter={(label) => `ধরণ: ${label}`}
                    />
                    <Bar dataKey="value" name="শতাংশ">
                      {stats?.userStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* আজকের ট্রানজেকশন - অপশনাল */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* আজকের মোট ট্রানজেকশন */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              আজকের ট্রানজেকশন
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "লোড হচ্ছে..." : stats?.transactionsToday}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              সকল ট্রানজেকশনের সংখ্যা
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}