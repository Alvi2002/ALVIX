import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, RefreshCcw, Eye, Check, X } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { Transaction } from "@shared/schema";

export default function TransactionsPanel() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  
  // ট্রানজেকশন লিস্ট ফেচ করা
  const { data: transactions = [], isLoading, refetch } = useQuery<Transaction[]>({
    queryKey: ["/api/admin/transactions"],
    queryFn: async () => {
      const res = await fetch("/api/admin/transactions");
      if (!res.ok) throw new Error("ট্রানজেকশন লিস্ট লোড করতে সমস্যা হয়েছে");
      return res.json();
    }
  });
  
  // ট্রানজেকশন অ্যাপ্রুভ করার মিউটেশন
  const approveTransactionMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/transactions/${id}/approve`, {
        method: "POST"
      });
      
      if (!res.ok) throw new Error("ট্রানজেকশন অ্যাপ্রুভ করতে সমস্যা হয়েছে");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "সফল",
        description: "ট্রানজেকশন সফলভাবে অ্যাপ্রুভ করা হয়েছে",
      });
      setIsApproveDialogOpen(false);
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
  
  // ট্রানজেকশন রিজেক্ট করার মিউটেশন
  const rejectTransactionMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/transactions/${id}/reject`, {
        method: "POST"
      });
      
      if (!res.ok) throw new Error("ট্রানজেকশন রিজেক্ট করতে সমস্যা হয়েছে");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "সফল",
        description: "ট্রানজেকশন সফলভাবে রিজেক্ট করা হয়েছে",
      });
      setIsRejectDialogOpen(false);
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
  const filteredTransactions = transactions.filter(transaction => 
    transaction.id.toString().includes(searchTerm) ||
    transaction.userId.toString().includes(searchTerm) ||
    transaction.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // তারিখ ফরম্যাট করা
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };
  
  // টাকা ফরম্যাট করা
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(Number(amount));
  };
  
  // স্ট্যাটাস ব্যাজ রেন্ডার করা
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">সম্পন্ন</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500 hover:bg-amber-600">অপেক্ষমান</Badge>;
      case 'failed':
      case 'rejected':
        return <Badge variant="destructive">বাতিল</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // ট্রানজেকশন অ্যাপ্রুভ করার হ্যান্ডলার
  const handleApproveTransaction = () => {
    if (!selectedTransaction) return;
    approveTransactionMutation.mutate(selectedTransaction.id);
  };
  
  // ট্রানজেকশন রিজেক্ট করার হ্যান্ডলার
  const handleRejectTransaction = () => {
    if (!selectedTransaction) return;
    rejectTransactionMutation.mutate(selectedTransaction.id);
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
      
      {/* ট্রানজেকশন টেবিল */}
      <TransactionTable 
        transactions={filteredTransactions}
        onViewTransaction={(tx) => { setSelectedTransaction(tx); setIsViewDialogOpen(true); }}
        formatDate={formatDate}
        renderStatusBadge={renderStatusBadge}
      />
      
      {/* ট্রানজেকশন ভিউ ডায়ালগ */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[475px]">
          <DialogHeader>
            <DialogTitle>ট্রানজেকশন বিবরণ</DialogTitle>
            <DialogDescription>
              ট্রানজেকশনের সম্পূর্ণ বিবরণ দেখুন
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="py-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium">
                    {selectedTransaction.type === 'deposit' ? 'ডিপোজিট' : 'উইথড্র'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    আইডি: {selectedTransaction.id}
                  </p>
                </div>
                {renderStatusBadge(selectedTransaction.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground">ইউজার আইডি</p>
                  <p className="font-medium">{selectedTransaction.userId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">পরিমাণ</p>
                  <p className="font-medium">{formatCurrency(selectedTransaction.amount)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">তারিখ</p>
                  <p className="font-medium">{formatDate(selectedTransaction.date)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">পেমেন্ট মেথড</p>
                  <p className="font-medium">{selectedTransaction.method || '-'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">বিবরণ</p>
                  <p className="font-medium">{selectedTransaction.details || '-'}</p>
                </div>
              </div>
              
              {selectedTransaction.status === 'pending' && (
                <div className="flex gap-2 mt-6 justify-end">
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      setIsRejectDialogOpen(true);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    রিজেক্ট
                  </Button>
                  <Button 
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      setIsApproveDialogOpen(true);
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    অ্যাপ্রুভ
                  </Button>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>
              বন্ধ করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* ট্রানজেকশন অ্যাপ্রুভ ডায়ালগ */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>ট্রানজেকশন অ্যাপ্রুভ করুন</DialogTitle>
            <DialogDescription>
              আপনি কি নিশ্চিত যে আপনি এই ট্রানজেকশনটি অ্যাপ্রুভ করতে চান?
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground">টাইপ</p>
                  <p className="font-medium capitalize">
                    {selectedTransaction.type === 'deposit' ? 'ডিপোজিট' : 'উইথড্র'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">ইউজার আইডি</p>
                  <p className="font-medium">{selectedTransaction.userId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">পরিমাণ</p>
                  <p className="font-medium">{formatCurrency(selectedTransaction.amount)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">তারিখ</p>
                  <p className="font-medium">{formatDate(selectedTransaction.date)}</p>
                </div>
              </div>
              
              <div className="rounded-md bg-emerald-500/10 p-3 mt-4">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-emerald-500 mr-2 mt-0.5" />
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    এই ট্রানজেকশনকে অ্যাপ্রুভ করলে ইউজারের ব্যালেন্স আপডেট হবে এবং ট্রানজেকশন সম্পন্ন হিসেবে চিহ্নিত হবে।
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsApproveDialogOpen(false)}
            >
              বাতিল
            </Button>
            <Button 
              onClick={handleApproveTransaction}
              disabled={approveTransactionMutation.isPending}
            >
              {approveTransactionMutation.isPending ? "প্রসেসিং..." : "অ্যাপ্রুভ করুন"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* ট্রানজেকশন রিজেক্ট ডায়ালগ */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>ট্রানজেকশন রিজেক্ট করুন</DialogTitle>
            <DialogDescription>
              আপনি কি নিশ্চিত যে আপনি এই ট্রানজেকশনটি রিজেক্ট করতে চান?
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground">টাইপ</p>
                  <p className="font-medium capitalize">
                    {selectedTransaction.type === 'deposit' ? 'ডিপোজিট' : 'উইথড্র'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">ইউজার আইডি</p>
                  <p className="font-medium">{selectedTransaction.userId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">পরিমাণ</p>
                  <p className="font-medium">{formatCurrency(selectedTransaction.amount)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">তারিখ</p>
                  <p className="font-medium">{formatDate(selectedTransaction.date)}</p>
                </div>
              </div>
              
              <div className="rounded-md bg-destructive/10 p-3 mt-4">
                <div className="flex items-start">
                  <X className="h-5 w-5 text-destructive mr-2 mt-0.5" />
                  <p className="text-sm text-destructive">
                    এই ট্রানজেকশনকে রিজেক্ট করলে এটি বাতিল হিসেবে চিহ্নিত হবে এবং ইউজারের ব্যালেন্স আপডেট হবে না।
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsRejectDialogOpen(false)}
            >
              বাতিল
            </Button>
            <Button 
              variant="destructive"
              onClick={handleRejectTransaction}
              disabled={rejectTransactionMutation.isPending}
            >
              {rejectTransactionMutation.isPending ? "প্রসেসিং..." : "রিজেক্ট করুন"}
            </Button>
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
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(Number(amount));
  };
  
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>আইডি</TableHead>
              <TableHead>ইউজার</TableHead>
              <TableHead>টাইপ</TableHead>
              <TableHead>পরিমাণ</TableHead>
              <TableHead>স্ট্যাটাস</TableHead>
              <TableHead>পেমেন্ট</TableHead>
              <TableHead>তারিখ</TableHead>
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
                  <TableCell>{transaction.userId}</TableCell>
                  <TableCell>
                    {transaction.type === 'deposit' ? 'ডিপোজিট' : 'উইথড্র'}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    {renderStatusBadge(transaction.status)}
                  </TableCell>
                  <TableCell>
                    {transaction.method || '-'}
                  </TableCell>
                  <TableCell>
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onViewTransaction(transaction)}
                    >
                      <Eye className="h-4 w-4" />
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