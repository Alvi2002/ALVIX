import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Search, RefreshCcw, Check, X } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { Transaction } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TransactionsPanel() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
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
  const updateTransactionMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await fetch(`/api/admin/transactions/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });
      
      if (!res.ok) throw new Error("ট্রানজেকশন আপডেট করতে সমস্যা হয়েছে");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "সফল",
        description: "ট্রানজেকশন সফলভাবে আপডেট করা হয়েছে",
      });
      setIsUpdateDialogOpen(false);
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
  
  // সার্চ করা ট্রানজেকশন লিস্ট
  const filteredTransactions = transactions.filter(tx => 
    tx.id.toString().includes(searchTerm.toLowerCase()) ||
    tx.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // ট্রানজেকশন টাইপ অনুযায়ী ফিল্টার
  const depositTransactions = filteredTransactions.filter(tx => tx.type === "deposit");
  const withdrawTransactions = filteredTransactions.filter(tx => tx.type === "withdraw");
  
  // ট্রানজেকশন স্ট্যাটাস আপডেট করার হ্যান্ডলার
  const handleApproveTransaction = () => {
    if (!selectedTransaction) return;
    updateTransactionMutation.mutate({ id: selectedTransaction.id, status: "completed" });
  };
  
  const handleRejectTransaction = () => {
    if (!selectedTransaction) return;
    updateTransactionMutation.mutate({ id: selectedTransaction.id, status: "rejected" });
  };
  
  // ফরম্যাট ডেট
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  // স্ট্যাটাস ব্যাজ রেন্ডার করা
  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">সম্পন্ন</Badge>;
      case "pending":
        return <Badge variant="outline">অপেক্ষমান</Badge>;
      case "rejected":
        return <Badge variant="destructive">বাতিল</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">ট্রানজেকশন ম্যানেজমেন্ট</h2>
          <p className="text-sm text-muted-foreground">সাইটের সমস্ত ট্রানজেকশন ম্যানেজ করুন</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="ট্রানজেকশন খুঁজুন..."
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
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">সব ট্রানজেকশন ({filteredTransactions.length})</TabsTrigger>
          <TabsTrigger value="deposit">ডিপোজিট ({depositTransactions.length})</TabsTrigger>
          <TabsTrigger value="withdraw">উইথড্র ({withdrawTransactions.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <TransactionTable 
            transactions={filteredTransactions}
            onViewTransaction={(tx) => { setSelectedTransaction(tx); setIsUpdateDialogOpen(true); }}
            formatDate={formatDate}
            renderStatusBadge={renderStatusBadge}
          />
        </TabsContent>
        
        <TabsContent value="deposit" className="mt-6">
          <TransactionTable 
            transactions={depositTransactions}
            onViewTransaction={(tx) => { setSelectedTransaction(tx); setIsUpdateDialogOpen(true); }}
            formatDate={formatDate}
            renderStatusBadge={renderStatusBadge}
          />
        </TabsContent>
        
        <TabsContent value="withdraw" className="mt-6">
          <TransactionTable 
            transactions={withdrawTransactions}
            onViewTransaction={(tx) => { setSelectedTransaction(tx); setIsUpdateDialogOpen(true); }}
            formatDate={formatDate}
            renderStatusBadge={renderStatusBadge}
          />
        </TabsContent>
      </Tabs>
      
      {/* ট্রানজেকশন আপডেট ডায়ালগ */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>ট্রানজেকশন আপডেট করুন</DialogTitle>
            <DialogDescription>
              {selectedTransaction?.type === "deposit" ? "ডিপোজিট" : "উইথড্র"} রিকোয়েস্ট {selectedTransaction?.status === "pending" ? "অনুমোদন বা বাতিল করুন" : "দেখুন"}
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">ট্রানজেকশন আইডি</div>
                  <div className="text-sm">{selectedTransaction.id}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">টাইপ</div>
                  <div className="text-sm capitalize">{selectedTransaction.type}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">পরিমাণ</div>
                  <div className="text-sm">৳{parseFloat(selectedTransaction.amount).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">মেথড</div>
                  <div className="text-sm">{selectedTransaction.method || "N/A"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">তারিখ</div>
                  <div className="text-sm">{formatDate(selectedTransaction.date)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">ইউজার আইডি</div>
                  <div className="text-sm">{selectedTransaction.userId}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm font-medium">বিবরণ</div>
                  <div className="text-sm">{selectedTransaction.details || "কোন বিবরণ নেই"}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm font-medium">স্ট্যাটাস</div>
                  <div className="text-sm mt-1">{renderStatusBadge(selectedTransaction.status)}</div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            {selectedTransaction?.status === "pending" && (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleRejectTransaction}
                  disabled={updateTransactionMutation.isPending}
                  className="flex items-center"
                >
                  <X className="h-4 w-4 mr-1" />
                  বাতিল
                </Button>
                <Button 
                  onClick={handleApproveTransaction}
                  disabled={updateTransactionMutation.isPending}
                  className="flex items-center"
                >
                  <Check className="h-4 w-4 mr-1" />
                  অনুমোদন
                </Button>
              </>
            )}
            {selectedTransaction?.status !== "pending" && (
              <Button onClick={() => setIsUpdateDialogOpen(false)}>ঠিক আছে</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ট্রানজেকশন টেবিল কম্পোনেন্ট
interface TransactionTableProps {
  transactions: Transaction[];
  onViewTransaction: (tx: Transaction) => void;
  formatDate: (date: Date | string) => string;
  renderStatusBadge: (status: string) => JSX.Element;
}

function TransactionTable({ transactions, onViewTransaction, formatDate, renderStatusBadge }: TransactionTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>আইডি</TableHead>
              <TableHead>টাইপ</TableHead>
              <TableHead>পরিমাণ</TableHead>
              <TableHead>ইউজার</TableHead>
              <TableHead>বিবরণ</TableHead>
              <TableHead>তারিখ</TableHead>
              <TableHead>স্ট্যাটাস</TableHead>
              <TableHead>অ্যাকশন</TableHead>
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
              transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium">{tx.id}</TableCell>
                  <TableCell className="capitalize">{tx.type}</TableCell>
                  <TableCell>৳{parseFloat(tx.amount).toLocaleString()}</TableCell>
                  <TableCell>{tx.userId}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{tx.details || "N/A"}</TableCell>
                  <TableCell>{formatDate(tx.date)}</TableCell>
                  <TableCell>{renderStatusBadge(tx.status)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onViewTransaction(tx)}
                    >
                      দেখুন
                    </Button>
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