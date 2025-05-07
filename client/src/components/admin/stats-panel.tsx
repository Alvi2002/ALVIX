import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type Stats = {
  totalUsers: number;
  newUsers24h: number;
  totalGames: number;
  activeGames: number;
  totalTransactions: number;
  transactions24h: number;
  totalDeposits: number;
  totalWithdraws: number;
  totalRevenue: number;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function StatsPanel() {
  const { data: stats, isLoading, error } = useQuery<Stats>({
    queryKey: ['/api/admin/stats'],
  });

  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-destructive p-4 bg-destructive/10 rounded-lg">
        ডাটা লোড করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।
      </div>
    );
  }

  // টাকা কনভার্ট
  const depositsBDT = stats.totalDeposits / 100;
  const withdrawsBDT = stats.totalWithdraws / 100;
  const revenueBDT = stats.totalRevenue / 100;

  // পাই চার্টের জন্য ডাটা
  const transactionData = [
    { name: 'ডিপোজিট', value: depositsBDT },
    { name: 'উইথড্র', value: withdrawsBDT },
  ];

  // বার চার্টের জন্য ডাটা
  const moneyData = [
    { name: 'ডিপোজিট', value: depositsBDT },
    { name: 'উইথড্র', value: withdrawsBDT },
    { name: 'রেভিনিউ', value: revenueBDT },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">এডমিন ড্যাশবোর্ড</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">মোট ইউজার</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              গত ২৪ ঘন্টায়: +{stats.newUsers24h}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">মোট গেম</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGames}</div>
            <p className="text-xs text-muted-foreground mt-1">
              সক্রিয় গেম: {stats.activeGames}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">মোট ট্রানজেকশন</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              গত ২৪ ঘন্টায়: {stats.transactions24h}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">মোট রেভিনিউ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueBDT.toLocaleString('bn-BD')} ৳</div>
            <p className="text-xs text-muted-foreground mt-1">
              ডিপোজিট - উইথড্র
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>ট্রানজেকশন অবস্থা</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={transactionData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {transactionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${value.toLocaleString('bn-BD')} ৳`} 
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>আর্থিক সারাংশ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moneyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value.toLocaleString('bn-BD')} ৳`} />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}