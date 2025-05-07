import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Eye, Search, RefreshCcw, CheckCircle, XCircle, Clock, Filter } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ট্রানজেকশন টাইপ
interface Transaction {
  id: number;
  userId: number;
  username?: string;
  type: string;
  method: string | null;
  amount: string;
  status: string;
  date: string;
  details: string | null;
}

export default function TransactionsPanel() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewTransaction, setViewTransaction] = useState<Transaction | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  // ট্রানজেকশন লিস্ট লোড করা
  const { data: transactions = [], isLoading, refetch } = useQuery<Transaction[]>({
    queryKey: ["/api/admin/transactions"],
    queryFn: async () => {
      const res = await fetch("/api/admin/transactions");
      if (!res.ok) throw new Error("ট্রানজেকশন লিস্ট লোড করতে সমস্যা হয়েছে");
      return res.json();
    }
  });
  
  // ট্রানজেকশন স্ট্যাটাস আপডেট করার মিউটেশন
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await fetch(`/api/admin/transactions/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });
      
      if (!res.ok) throw new Error("ট্রানজেকশন স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "সফল",
        description: "ট্রানজেকশন স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/transactions"] });
    },
    onError: (error: Error) => {
      toast({
        title: "সমস্যা হয়েছে",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // ফিল্টার করা ট্রানজেকশন
  const filteredTransactions = transactions.filter(transaction => {
    // সার্চ ফিল্টার
    const searchMatch = searchTerm === "" || 
      transaction.id.toString().includes(searchTerm) ||
      (transaction.username && transaction.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      transaction.userId.toString().includes(searchTerm) ||
      (transaction.method && transaction.method.toLowerCase().includes(searchTerm.toLowerCase())) ||
      transaction.amount.toString().includes(searchTerm);
    
    // স্ট্যাটাস ফিল্টার
    const statusMatch = statusFilter === "all" || transaction.status === statusFilter;
    
    // টাইপ ফিল্টার
    const typeMatch = typeFilter === "all" || transaction.type === typeFilter;
    
    return searchMatch && statusMatch && typeMatch;
  });
  
  // ট্রানজেকশন টাইপ অনুযায়ী ফিল্টার করি
  const depositTransactions = filteredTransactions.filter(tx => tx.type === "deposit");
  const withdrawTransactions = filteredTransactions.filter(tx => tx.type === "withdraw");
  const bonusTransactions = filteredTransactions.filter(tx => tx.type === "bonus");
  
  // ট্রানজেকশন দেখার ফাংশন
  const handleViewTransaction = (transaction: Transaction) => {
    setViewTransaction(transaction);
    setIsViewDialogOpen(true);
  };
  
  // স্ট্যাটাস আপডেট ফাংশন
  const handleUpdateStatus = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">ট্রানজেকশন ম্যানেজমেন্ট</h2>
          <p className="text-sm text-muted-foreground">সাইটের সমস্ত আর্থিক লেনদেন দেখুন ও ম্যানেজ করুন</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="সার্চ করুন..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">ফিল্টার:</span>
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="সব স্ট্যাটাস" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">সব স্ট্যাটাস</SelectItem>
            <SelectItem value="success">সফল</SelectItem>
            <SelectItem value="pending">পেন্ডিং</SelectItem>
            <SelectItem value="failed">ব্যর্থ</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="সব টাইপ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">সব টাইপ</SelectItem>
            <SelectItem value="deposit">ডিপোজিট</SelectItem>
            <SelectItem value="withdraw">উইথড্র</SelectItem>
            <SelectItem value="bonus">বোনাস</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">সব ট্রানজেকশন ({filteredTransactions.length})</TabsTrigger>
          <TabsTrigger value="deposit">ডিপোজিট ({depositTransactions.length})</TabsTrigger>
          <TabsTrigger value="withdraw">উইথড্র ({withdrawTransactions.length})</TabsTrigger>
          <TabsTrigger value="bonus">বোনাস ({bonusTransactions.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <TransactionTable 
            transactions={filteredTransactions} 
            onView={handleViewTransaction}
            onUpdateStatus={handleUpdateStatus}
          />
        </TabsContent>
        
        <TabsContent value="deposit" className="mt-6">
          <TransactionTable 
            transactions={depositTransactions} 
            onView={handleViewTransaction}
            onUpdateStatus={handleUpdateStatus}
          />
        </TabsContent>
        
        <TabsContent value="withdraw" className="mt-6">
          <TransactionTable 
            transactions={withdrawTransactions} 
            onView={handleViewTransaction}
            onUpdateStatus={handleUpdateStatus}
          />
        </TabsContent>
        
        <TabsContent value="bonus" className="mt-6">
          <TransactionTable 
            transactions={bonusTransactions} 
            onView={handleViewTransaction}
            onUpdateStatus={handleUpdateStatus}
          />
        </TabsContent>
      </Tabs>
      
      {/* ট্রানজেকশন ডিটেইলস ডায়ালগ */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>ট্রানজেকশন ডিটেইলস</DialogTitle>
            <DialogDescription>
              ট্রানজেকশন সম্পর্কে বিস্তারিত তথ্য
            </DialogDescription>
          </DialogHeader>
          
          {viewTransaction && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="mb-1 text-sm font-medium">ট্রানজেকশন আইডি</h4>
                  <p className="text-sm">{viewTransaction.id}</p>
                </div>
                <div>
                  <h4 className="mb-1 text-sm font-medium">ইউজার আইডি</h4>
                  <p className="text-sm">{viewTransaction.userId}</p>
                </div>
                <div>
                  <h4 className="mb-1 text-sm font-medium">ইউজারনেম</h4>
                  <p className="text-sm">{viewTransaction.username || "অজানা"}</p>
                </div>
                <div>
                  <h4 className="mb-1 text-sm font-medium">পরিমাণ</h4>
                  <p className="text-sm font-semibold">৳{parseInt(viewTransaction.amount).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="mb-1 text-sm font-medium">টাইপ</h4>
                  <p className="text-sm">
                    <Badge variant="outline">
                      {viewTransaction.type === "deposit" && "ডিপোজিট"}
                      {viewTransaction.type === "withdraw" && "উইথড্র"}
                      {viewTransaction.type === "bonus" && "বোনাস"}
                    </Badge>
                  </p>
                </div>
                <div>
                  <h4 className="mb-1 text-sm font-medium">স্ট্যাটাস</h4>
                  <p className="text-sm">
                    {viewTransaction.status === "success" && (
                      <Badge className="bg-emerald-500 hover:bg-emerald-600">সফল</Badge>
                    )}
                    {viewTransaction.status === "pending" && (
                      <Badge variant="outline" className="text-amber-500 border-amber-500">পেন্ডিং</Badge>
                    )}
                    {viewTransaction.status === "failed" && (
                      <Badge variant="destructive">ব্যর্থ</Badge>
                    )}
                  </p>
                </div>
                <div>
                  <h4 className="mb-1 text-sm font-medium">পেমেন্ট মেথড</h4>
                  <p className="text-sm">{viewTransaction.method || "উল্লেখ করা হয়নি"}</p>
                </div>
                <div>
                  <h4 className="mb-1 text-sm font-medium">তারিখ</h4>
                  <p className="text-sm">
                    {new Date(viewTransaction.date).toLocaleString("bn-BD", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>
              
              {viewTransaction.details && (
                <div>
                  <h4 className="mb-1 text-sm font-medium">বিস্তারিত</h4>
                  <p className="text-sm p-3 bg-muted rounded-md">{viewTransaction.details}</p>
                </div>
              )}
              
              {viewTransaction.status === "pending" && (
                <div className="mt-4">
                  <h4 className="mb-3 text-sm font-medium">স্ট্যাটাস আপডেট করুন</h4>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20 hover:text-emerald-600"
                      onClick={() => handleUpdateStatus(viewTransaction.id, "success")}
                      disabled={updateStatusMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      অনুমোদন করুন
                    </Button>
                    <Button 
                      variant="outline"
                      className="bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20 hover:text-rose-600"
                      onClick={() => handleUpdateStatus(viewTransaction.id, "failed")}
                      disabled={updateStatusMutation.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      বাতিল করুন
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ট্রানজেকশন টেবিল কম্পোনেন্ট
interface TransactionTableProps {
  transactions: Transaction[];
  onView: (transaction: Transaction) => void;
  onUpdateStatus: (id: number, status: string) => void;
}

function TransactionTable({ transactions, onView, onUpdateStatus }: TransactionTableProps) {
  // ট্রানজেকশনের তারিখ ফরম্যাট করার ফাংশন
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('bn-BD', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>আইডি</TableHead>
              <TableHead>ইউজার</TableHead>
              <TableHead>ধরণ</TableHead>
              <TableHead>পরিমাণ</TableHead>
              <TableHead>পেমেন্ট মেথড</TableHead>
              <TableHead>তারিখ</TableHead>
              <TableHead>স্ট্যাটাস</TableHead>
              <TableHead className="text-right">অ্যাকশন</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  কোন ট্রানজেকশন পাওয়া যায়নি
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{transaction.username || "ইউজার #" + transaction.userId}</span>
                      <span className="text-xs text-muted-foreground">ID: {transaction.userId}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {transaction.type === "deposit" && "ডিপোজিট"}
                    {transaction.type === "withdraw" && "উইথড্র"}
                    {transaction.type === "bonus" && "বোনাস"}
                  </TableCell>
                  <TableCell className="font-medium">
                    ৳{parseInt(transaction.amount).toLocaleString()}
                  </TableCell>
                  <TableCell>{transaction.method || "-"}</TableCell>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>
                    {transaction.status === "success" && (
                      <Badge className="bg-emerald-500 hover:bg-emerald-600">সফল</Badge>
                    )}
                    {transaction.status === "pending" && (
                      <Badge variant="outline" className="text-amber-500 border-amber-500">পেন্ডিং</Badge>
                    )}
                    {transaction.status === "failed" && (
                      <Badge variant="destructive">ব্যর্থ</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>অ্যাকশন</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onView(transaction)}>
                          <Eye className="h-4 w-4 mr-2" />
                          বিস্তারিত দেখুন
                        </DropdownMenuItem>
                        
                        {transaction.status === "pending" && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onUpdateStatus(transaction.id, "success")}
                              className="text-emerald-500 focus:text-emerald-500">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              অনুমোদন করুন
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onUpdateStatus(transaction.id, "failed")}
                              className="text-rose-500 focus:text-rose-500">
                              <XCircle className="h-4 w-4 mr-2" />
                              বাতিল করুন
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}