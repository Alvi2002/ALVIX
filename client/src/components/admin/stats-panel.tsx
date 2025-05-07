import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { 
  Users, CreditCard, TrendingUp, Activity, 
  Wallet, CreditCard as CreditCardIcon, 
  ArrowDownCircle, ArrowUpCircle 
} from "lucide-react";

export default function StatsPanel() {
  // ইউজার স্ট্যাটস ফেচ করা
  const { data: stats = {
    totalUsers: 0,
    totalTransactions: 0,
    totalDeposits: 0,
    totalWithdraws: 0,
    recentTransactions: [],
    userRegistrationData: [],
    transactionData: []
  }, isLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("স্ট্যাটস লোড করতে সমস্যা হয়েছে");
      return res.json();
    }
  });
  
  // মাস অনুযায়ী ইউজার রেজিস্ট্রেশন (সাম্পল ডাটা)
  const sampleUserRegistrationData = [
    { month: "Jan", users: 65 },
    { month: "Feb", users: 78 },
    { month: "Mar", users: 92 },
    { month: "Apr", users: 110 },
    { month: "May", users: 125 },
    { month: "Jun", users: 143 },
  ];
  
  // মাস অনুযায়ী ট্রানজেকশন (সাম্পল ডাটা)
  const sampleTransactionData = [
    { month: "Jan", deposits: 452000, withdraws: 382000 },
    { month: "Feb", deposits: 478000, withdraws: 412000 },
    { month: "Mar", deposits: 512000, withdraws: 458000 },
    { month: "Apr", deposits: 548000, withdraws: 502000 },
    { month: "May", deposits: 592000, withdraws: 552000 },
    { month: "Jun", deposits: 628000, withdraws: 572000 },
  ];
  
  // ডাটা চেক করা
  const userRegistrationData = stats.userRegistrationData?.length ? 
    stats.userRegistrationData : sampleUserRegistrationData;
  
  const transactionData = stats.transactionData?.length ? 
    stats.transactionData : sampleTransactionData;
  
  // টাকা ফরম্যাট করা
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">ড্যাশবোর্ড</h2>
        <p className="text-sm text-muted-foreground">সাইট স্ট্যাটস এবং অ্যানালিটিক্স</p>
      </div>
      
      {/* স্ট্যাটস কার্ড */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">মোট ইউজার</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              সক্রিয় এবং নিবন্ধিত ইউজার
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">মোট ট্রানজেকশন</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              সমস্ত ট্রানজেকশন
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">মোট ডিপোজিট</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalDeposits)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              সমস্ত ডিপোজিট
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">মোট উইথড্র</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalWithdraws)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              সমস্ত উইথড্র
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* গ্রাফ এবং চার্ট */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">ইউজার রেজিস্ট্রেশন</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userRegistrationData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [`${value} ইউজার`, 'রেজিস্ট্রেশন']}
                    labelFormatter={(month) => `${month} মাস`}
                  />
                  <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">ট্রানজেকশন অভ্র</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transactionData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), '']}
                    labelFormatter={(month) => `${month} মাস`}
                  />
                  <Bar dataKey="deposits" name="ডিপোজিট" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="withdraws" name="উইথড্র" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* সাম্প্রতিক ট্রানজেকশন */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">সাম্প্রতিক ট্রানজেকশন</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium">ট্রানজেকশন আইডি</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">ইউজার</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">টাইপ</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">পরিমাণ</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">স্ট্যাটাস</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">তারিখ</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTransactions?.length ? (
                  stats.recentTransactions.map((tx: any) => (
                    <tr key={tx.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle">{tx.id}</td>
                      <td className="p-4 align-middle">{tx.userId}</td>
                      <td className="p-4 align-middle capitalize">
                        {tx.type === 'deposit' ? 'ডিপোজিট' : 'উইথড্র'}
                      </td>
                      <td className="p-4 align-middle">{formatCurrency(Number(tx.amount))}</td>
                      <td className="p-4 align-middle">
                        <span 
                          className={`px-2 py-1 rounded text-xs capitalize ${
                            tx.status === 'completed' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : tx.status === 'pending' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {tx.status === 'completed' 
                            ? 'সম্পন্ন' 
                            : tx.status === 'pending' 
                            ? 'অপেক্ষমান' 
                            : 'বাতিল'}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        {new Date(tx.date).toLocaleDateString('bn-BD')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="h-24 text-center">
                      কোন ট্রানজেকশন ডাটা নেই
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}