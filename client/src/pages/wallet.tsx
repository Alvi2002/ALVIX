import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileMenu from "@/components/layout/mobile-menu";
import MobileNav from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Copy, 
  Clock, 
  Banknote,
  Download,
  Upload,
  Search,
  FilterX,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Transaction = {
  id: string;
  type: "deposit" | "withdraw" | "bonus" | "win" | "lose";
  amount: number;
  date: string;
  status: "success" | "pending" | "failed";
  method?: string;
  details?: string;
};

export default function WalletPage() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [balance, setBalance] = useState(5000);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositMethod, setDepositMethod] = useState("bkash");
  const [withdrawMethod, setWithdrawMethod] = useState("bkash");
  const [withdrawAccount, setWithdrawAccount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState("all");

  // ওয়ালেট ব্যালেন্স লোড করা
  const { data: userData, isLoading: userDataLoading } = useQuery({
    queryKey: ['/api/user'],
    staleTime: 60 * 1000, // ১ মিনিট
    enabled: !!user,
  });
  
  // টাকার লেনদেনের তথ্য লোড করা
  const { data: txData, isLoading: txLoading } = useQuery({
    queryKey: ['/api/transactions'],
    staleTime: 30 * 1000, // ৩০ সেকেন্ড
    enabled: !!user,
  });
  
  // টাকা জমা করার মিউটেশন
  const depositMutation = useMutation({
    mutationFn: async (data: { amount: number, method: string }) => {
      const response = await fetch('/api/transactions/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('টাকা জমা করতে সমস্যা হয়েছে');
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      setDepositAmount("");
      toast({
        title: "অনুরোধ গৃহীত হয়েছে",
        description: `${depositAmount} টাকা জমা করার অনুরোধ গৃহীত হয়েছে`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "দুঃখিত",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // টাকা উত্তোলনের মিউটেশন
  const withdrawMutation = useMutation({
    mutationFn: async (data: { amount: number, method: string, account: string }) => {
      const response = await fetch('/api/transactions/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('টাকা উত্তোলন করতে সমস্যা হয়েছে');
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      setWithdrawAmount("");
      setWithdrawAccount("");
      toast({
        title: "অনুরোধ গৃহীত হয়েছে",
        description: `${withdrawAmount} টাকা উত্তোলনের অনুরোধ গৃহীত হয়েছে`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "দুঃখিত",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // ইউজার ডেটা এবং ট্রানজেকশন ডেটা আপডেট
  useEffect(() => {
    // ইউজার ডেটা থেকে ব্যালেন্স আপডেট
    if (userData) {
      setBalance(parseFloat(userData.balance));
    }
    
    // ট্রানজেকশন ডেটা আপডেট
    if (txData) {
      setTransactions(txData);
      setFilteredTransactions(txData);
    }
  }, [userData, txData]);

  useEffect(() => {
    if (filter === "all") {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(transactions.filter(tx => tx.type === filter));
    }
  }, [filter, transactions]);

  const handleDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({
        title: "দুঃখিত",
        description: "সঠিক পরিমাণ দিন",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    // API কল করা
    const amount = parseFloat(depositAmount);
    depositMutation.mutate(
      { 
        amount, 
        method: depositMethod 
      }, 
      {
        onSettled: () => {
          setIsSubmitting(false);
        }
      }
    );
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast({
        title: "দুঃখিত",
        description: "সঠিক পরিমাণ দিন",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(withdrawAmount) > balance) {
      toast({
        title: "দুঃখিত",
        description: "আপনার ব্যালেন্সে পর্যাপ্ত পরিমাণ নেই",
        variant: "destructive",
      });
      return;
    }

    if (!withdrawAccount) {
      toast({
        title: "দুঃখিত",
        description: "অ্যাকাউন্ট নম্বর দিন",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    // অসল API কল এখানে হবে
    setTimeout(() => {
      const amount = parseFloat(withdrawAmount);
      setBalance(prev => prev - amount);
      
      const newTransaction: Transaction = {
        id: `TX${Math.floor(Math.random() * 1000000)}`,
        type: "withdraw",
        amount: amount,
        date: new Date().toLocaleString(),
        status: "pending",
        method: withdrawMethod === "bkash" ? "বিকাশ" : 
                withdrawMethod === "rocket" ? "রকেট" : 
                withdrawMethod === "nagad" ? "নগদ" : "ব্যাংক",
        details: withdrawAccount,
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      setFilteredTransactions(prev => [newTransaction, ...prev]);
      
      toast({
        title: "অনুরোধ গৃহীত হয়েছে",
        description: `${amount} টাকা উত্তোলনের অনুরোধ গৃহীত হয়েছে`,
      });
      
      setWithdrawAmount("");
      setWithdrawAccount("");
      setIsSubmitting(false);
    }, 1500);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "কপি করা হয়েছে",
      description: "তথ্য ক্লিপবোর্ডে কপি করা হয়েছে"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500">সফল</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">প্রক্রিয়াধীন</Badge>;
      case "failed":
        return <Badge className="bg-red-500">ব্যর্থ</Badge>;
      default:
        return <Badge className="bg-gray-500">অজানা</Badge>;
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4 text-green-400" />;
      case "withdraw":
        return <ArrowUpRight className="h-4 w-4 text-red-400" />;
      case "bonus":
        return <Download className="h-4 w-4 text-blue-400" />;
      case "win":
        return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case "lose":
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTransactionTypeText = (type: string) => {
    switch (type) {
      case "deposit":
        return "জমা";
      case "withdraw":
        return "উত্তোলন";
      case "bonus":
        return "বোনাস";
      case "win":
        return "জয়";
      case "lose":
        return "হার";
      default:
        return "অন্যান্য";
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isLoggedIn={!!user} onLogout={handleLogout} />
      <MobileMenu />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-white font-header mb-6 flex items-center">
            <Wallet className="text-accent mr-2 h-6 w-6" />
            আমার ওয়ালেট
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-card border-secondary text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Banknote className="text-accent mr-2 h-5 w-5" />
                  বর্তমান ব্যালেন্স
                </CardTitle>
                <CardDescription className="text-muted-foreground">আপনার বর্তমান ওয়ালেট ব্যালেন্স</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-accent font-header">{balance.toLocaleString()} ৳</p>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  আপডেটেড জাস্ট নাউ
                </div>
              </CardFooter>
            </Card>

            <Card className="bg-card border-secondary text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <ArrowDownLeft className="text-green-400 mr-2 h-5 w-5" />
                  মোট জমা
                </CardTitle>
                <CardDescription className="text-muted-foreground">আপনার মোট জমাকৃত টাকা</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-400 font-header">3,000 ৳</p>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  সর্বশেষ জমা: 5 দিন আগে
                </div>
              </CardFooter>
            </Card>

            <Card className="bg-card border-secondary text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <ArrowUpRight className="text-red-400 mr-2 h-5 w-5" />
                  মোট উত্তোলন
                </CardTitle>
                <CardDescription className="text-muted-foreground">আপনার মোট উত্তোলিত টাকা</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-400 font-header">1,500 ৳</p>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  সর্বশেষ উত্তোলন: 10 দিন আগে
                </div>
              </CardFooter>
            </Card>
          </div>

          <Tabs defaultValue="deposit" className="mb-8">
            <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
              <TabsTrigger 
                value="deposit"
                className="data-[state=active]:bg-accent data-[state=active]:text-secondary"
              >
                টাকা জমা করুন
              </TabsTrigger>
              <TabsTrigger 
                value="withdraw"
                className="data-[state=active]:bg-accent data-[state=active]:text-secondary"
              >
                টাকা তুলুন
              </TabsTrigger>
            </TabsList>

            <TabsContent value="deposit">
              <Card className="bg-card border-secondary text-white">
                <CardHeader>
                  <CardTitle>টাকা জমা করুন</CardTitle>
                  <CardDescription className="text-muted-foreground">আপনার পছন্দের পেমেন্ট পদ্ধতি দিয়ে টাকা জমা করুন</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="amount" className="text-sm font-medium">পরিমাণ (৳)</label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="জমা করার পরিমাণ লিখুন"
                      className="bg-secondary border-secondary"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="method" className="text-sm font-medium">পেমেন্ট পদ্ধতি</label>
                    <Select defaultValue="bkash" onValueChange={setDepositMethod}>
                      <SelectTrigger className="bg-secondary border-secondary">
                        <SelectValue placeholder="পেমেন্ট পদ্ধতি নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-secondary">
                        <SelectItem value="bkash">বিকাশ</SelectItem>
                        <SelectItem value="rocket">রকেট</SelectItem>
                        <SelectItem value="nagad">নগদ</SelectItem>
                        <SelectItem value="bank">ব্যাংক ট্রান্সফার</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 bg-secondary/30 rounded-lg mt-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      <span className="bg-accent text-secondary h-5 w-5 inline-flex items-center justify-center rounded-full mr-2 text-xs">1</span>
                      নিম্নলিখিত নম্বরে টাকা পাঠান
                    </h4>
                    
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="p-2 bg-secondary rounded-md">
                        <span className="text-white font-medium">01712345678</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => handleCopyToClipboard("01712345678")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <h4 className="font-medium mb-2 flex items-center">
                      <span className="bg-accent text-secondary h-5 w-5 inline-flex items-center justify-center rounded-full mr-2 text-xs">2</span>
                      ফর্ম পূরণ করে সাবমিট করুন
                    </h4>
                    
                    <p className="text-muted-foreground text-sm mb-2">
                      আপনার ট্রানজেকশন আইডি দিয়ে জমা নিশ্চিত করুন
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-accent text-secondary hover:bg-accent/90"
                    onClick={handleDeposit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "প্রক্রিয়াধীন..." : "জমা করুন"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="withdraw">
              <Card className="bg-card border-secondary text-white">
                <CardHeader>
                  <CardTitle>টাকা তুলুন</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    আপনার পছন্দের পেমেন্ট পদ্ধতি দিয়ে টাকা তুলুন
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="withdraw-amount" className="text-sm font-medium">পরিমাণ (৳)</label>
                    <Input
                      id="withdraw-amount"
                      type="number"
                      placeholder="উত্তোলনের পরিমাণ লিখুন"
                      className="bg-secondary border-secondary"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="withdraw-method" className="text-sm font-medium">পেমেন্ট পদ্ধতি</label>
                    <Select defaultValue="bkash" onValueChange={setWithdrawMethod}>
                      <SelectTrigger className="bg-secondary border-secondary">
                        <SelectValue placeholder="পেমেন্ট পদ্ধতি নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-secondary">
                        <SelectItem value="bkash">বিকাশ</SelectItem>
                        <SelectItem value="rocket">রকেট</SelectItem>
                        <SelectItem value="nagad">নগদ</SelectItem>
                        <SelectItem value="bank">ব্যাংক ট্রান্সফার</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="account-number" className="text-sm font-medium">মোবাইল/ব্যাংক অ্যাকাউন্ট নম্বর</label>
                    <Input
                      id="account-number"
                      placeholder="আপনার নম্বর লিখুন"
                      className="bg-secondary border-secondary"
                      value={withdrawAccount}
                      onChange={(e) => setWithdrawAccount(e.target.value)}
                    />
                  </div>

                  <div className="p-4 bg-secondary/30 rounded-lg mt-4">
                    <h4 className="font-medium mb-2">উত্তোলনের নিয়মাবলী</h4>
                    <ul className="text-muted-foreground text-sm space-y-1 list-disc list-inside">
                      <li>সর্বনিম্ন উত্তোলনের পরিমাণ ৫০০ টাকা</li>
                      <li>প্রতিদিন সর্বোচ্চ ৫০,০০০ টাকা উত্তোলন করা যাবে</li>
                      <li>উত্তোলনের সময় ১-৩ ঘন্টা</li>
                      <li>কোনো চার্জ প্রযোজ্য নয়</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-accent text-secondary hover:bg-accent/90"
                    onClick={handleWithdraw}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "প্রক্রিয়াধীন..." : "উত্তোলন করুন"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white font-header">
                লেনদেনের ইতিহাস
              </h2>
              <div className="flex items-center gap-2">
                <div className="relative w-40 md:w-60">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="সার্চ..." 
                    className="bg-secondary border-secondary pl-9"
                  />
                </div>
                <Select defaultValue="all" onValueChange={setFilter}>
                  <SelectTrigger className="bg-secondary border-secondary w-36">
                    <SelectValue placeholder="ফিল্টার করুন" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-secondary">
                    <SelectItem value="all">সব লেনদেন</SelectItem>
                    <SelectItem value="deposit">জমা</SelectItem>
                    <SelectItem value="withdraw">উত্তোলন</SelectItem>
                    <SelectItem value="bonus">বোনাস</SelectItem>
                    <SelectItem value="win">জয়</SelectItem>
                    <SelectItem value="lose">হার</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="border-accent text-accent">
                  <FilterX className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-card rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-secondary/50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">আইডি</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">তারিখ</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">বিবরণ</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">ধরন</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">পরিমাণ</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white">স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary">
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-secondary/20">
                        <td className="px-4 py-3 text-sm">{tx.id}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{tx.date}</td>
                        <td className="px-4 py-3 text-sm">
                          {tx.method ? `${tx.method}: ${tx.details}` : tx.details}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-1">
                            {getTransactionTypeIcon(tx.type)}
                            {getTransactionTypeText(tx.type)}
                          </div>
                        </td>
                        <td className={`px-4 py-3 text-sm font-medium ${
                          tx.type === 'deposit' || tx.type === 'bonus' || tx.type === 'win' 
                            ? 'text-green-400' 
                            : 'text-red-400'
                        }`}>
                          {tx.type === 'deposit' || tx.type === 'bonus' || tx.type === 'win' 
                            ? '+ ' 
                            : '- '}
                          {tx.amount} ৳
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {getStatusBadge(tx.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredTransactions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">কোন লেনদেন পাওয়া যায়নি</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}