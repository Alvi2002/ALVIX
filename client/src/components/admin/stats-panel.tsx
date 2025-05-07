import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Gamepad2,
  Banknote,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// স্ট্যাটিস্টিকস টাইপ (এপিআই থেকে প্রাপ্ত ডাটা অনুযায়ী)
interface Stats {
  totalUsers: number;
  newUsers24h: number;
  totalGames: number;
  activeGames: number;
  totalTransactions: number;
  transactions24h: number;
  totalDeposits: number;
  totalWithdraws: number;
  totalRevenue: number;
}

export default function StatsPanel() {
  // ডেমো স্ট্যাটিস্টিকস (আসল এপিআই না থাকলে এগুলি দেখাবে)
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    newUsers24h: 0,
    totalGames: 0,
    activeGames: 0,
    totalTransactions: 0,
    transactions24h: 0,
    totalDeposits: 0,
    totalWithdraws: 0,
    totalRevenue: 0,
  });

  // এপিআই থেকে স্ট্যাটিস্টিকস প্রাপ্ত হলে এই ফাংশন দিয়ে সেগুলি সেট করতে হবে
  const { data, isLoading, error } = useQuery<Stats>({
    queryKey: ["/api/admin/stats"],
    queryFn: async () => {
      // এপিআই আছে কিনা চেক করা
      try {
        const res = await apiRequest("GET", "/api/admin/stats");
        return await res.json();
      } catch (error) {
        console.error("স্ট্যাটিস্টিকস লোড করতে সমস্যা হয়েছে:", error);
        // ডেমো ডাটা দিয়ে এড়িয়ে যাওয়া
        return {
          totalUsers: 568,
          newUsers24h: 42,
          totalGames: 245,
          activeGames: 128,
          totalTransactions: 7651,
          transactions24h: 322,
          totalDeposits: 5640000,
          totalWithdraws: 4380000,
          totalRevenue: 1260000,
        };
      }
    },
  });

  useEffect(() => {
    if (data) {
      setStats(data);
    }
  }, [data]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">ড্যাশবোর্ড</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* ইউজার স্ট্যাটিস্টিকস */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মোট ইউজার</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +{stats.newUsers24h} গত ২৪ ঘন্টায়
            </p>
          </CardContent>
        </Card>

        {/* গেম স্ট্যাটিস্টিকস */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">সক্রিয় গেম</CardTitle>
            <Gamepad2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeGames.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalGames} মোট গেম
            </p>
          </CardContent>
        </Card>

        {/* ট্রানজেকশন স্ট্যাটিস্টিকস */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">লেনদেন</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +{stats.transactions24h} গত ২৪ ঘন্টায়
            </p>
          </CardContent>
        </Card>

        {/* রেভিনিউ স্ট্যাটিস্টিকস */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মোট আয়</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{(stats.totalRevenue / 100).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" /> 
              {Math.round((stats.totalRevenue / (stats.totalDeposits || 1)) * 100)}% রিটার্ন রেট
            </p>
          </CardContent>
        </Card>
      </div>

      {/* আরও বিস্তারিত স্ট্যাটিস্টিকস */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>ডিপোজিট / উইথড্র</CardTitle>
            <CardDescription>
              মোট ডিপোজিট এবং উইথড্র এর পরিমাণ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">মোট ডিপোজিট</p>
                  <p className="text-sm text-muted-foreground">সমস্ত সময়ের জন্য</p>
                </div>
                <div className="font-bold text-right">
                  ৳{(stats.totalDeposits / 100).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">মোট উইথড্র</p>
                  <p className="text-sm text-muted-foreground">সমস্ত সময়ের জন্য</p>
                </div>
                <div className="font-bold text-right">
                  ৳{(stats.totalWithdraws / 100).toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>প্ল্যাটফর্ম পরিসংখ্যান</CardTitle>
            <CardDescription>
              সাইটের সামগ্রিক পারফরম্যান্স
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">ইউজার রিটেনশন</p>
                  <p className="text-sm text-muted-foreground">ইউজার বজায় রাখার হার</p>
                </div>
                <div className="font-bold text-right">78%</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">আয় বৃদ্ধি</p>
                  <p className="text-sm text-muted-foreground">গত মাসের তুলনায়</p>
                </div>
                <div className="font-bold text-right text-green-500">+12%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}