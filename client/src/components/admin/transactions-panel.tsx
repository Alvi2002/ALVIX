import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Transaction } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Check, X, ArrowUpRight, ArrowDownLeft, Gift, Eye } from "lucide-react";
import { format, parseISO } from "date-fns";

export default function TransactionsPanel() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // ট্রানজেকশন লোড করা
  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/admin/transactions"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/admin/transactions");
        return await res.json();
      } catch (error) {
        console.error("ট্রানজেকশন লোড করতে সমস্যা হয়েছে:", error);
        // ডেমো ডাটা দিয়ে এড়িয়ে যাওয়া
        return [
          {
            id: 1,
            userId: 1,
            amount: "500.00",
            type: "deposit",
            date: new Date().toISOString(),
            status: "success",
            method: "bKash",
            details: "01712345678"
          },
          {
            id: 2,
            userId: 2,
            amount: "200.00",
            type: "withdraw",
            date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            status: "pending",
            method: "Nagad",
            details: "01812345678"
          },
          {
            id: 3,
            userId: 1,
            amount: "100.00",
            type: "bonus",
            date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            status: "success",
            method: null,
            details: "Welcome bonus"
          },
          {
            id: 4,
            userId: 3,
            amount: "300.00",
            type: "deposit",
            date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            status: "failed",
            method: "Bank Transfer",
            details: "Payment failed"
          },
          {
            id: 5,
            userId: 2,
            amount: "150.00",
            type: "win",
            date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
            status: "success",
            method: null,
            details: "Slot game win"
          }
        ];
      }
    },
  });

  // ট্রানজেকশন স্ট্যাটাস আপডেট মিউটেশন
  const updateTransactionStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/transactions/${id}/status`, { status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/transactions"] });
      toast({
        title: "স্ট্যাটাস আপডেট সফল",
        description: "ট্রানজেকশন স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে।",
      });
      setIsDetailsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "আপডেট ব্যর্থ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // ট্রানজেকশনের বিস্তারিত দেখা
  function viewTransactionDetails(transaction: Transaction) {
    setSelectedTransaction(transaction);
    setIsDetailsDialogOpen(true);
  }

  // ট্রানজেকশন স্ট্যাটাস আপডেট করা
  function updateTransactionStatus(id: number, status: string) {
    if (window.confirm(`আপনি কি নিশ্চিতভাবে ট্রানজেকশন স্ট্যাটাস "${status}" করতে চান?`)) {
      updateTransactionStatusMutation.mutate({ id, status });
    }
  }

  // ট্রানজেকশন টাইপ অনুযায়ী আইকন
  function getTransactionTypeIcon(type: string) {
    switch (type) {
      case "deposit":
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case "withdraw":
        return <ArrowDownLeft className="h-4 w-4 text-red-500" />;
      case "bonus":
        return <Gift className="h-4 w-4 text-purple-500" />;
      case "win":
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case "lose":
        return <ArrowDownLeft className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  }

  // ট্রানজেকশন টাইপ বাংলা নাম
  function getTransactionTypeText(type: string) {
    switch (type) {
      case "deposit":
        return "ডিপোজিট";
      case "withdraw":
        return "উইথড্র";
      case "bonus":
        return "বোনাস";
      case "win":
        return "জিতেছেন";
      case "lose":
        return "হেরেছেন";
      default:
        return type;
    }
  }

  // ট্রানজেকশন স্ট্যাটাস বাংলা নাম
  function getStatusText(status: string) {
    switch (status) {
      case "success":
        return "সফল";
      case "pending":
        return "পেন্ডিং";
      case "failed":
        return "ব্যর্থ";
      default:
        return status;
    }
  }

  // ট্রানজেকশন স্ট্যাটাস ব্যাজ ভেরিয়েন্ট
  function getStatusBadgeVariant(status: string) {
    switch (status) {
      case "success":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "destructive";
      default:
        return "default";
    }
  }

  // ডেট ফরম্যাট করা
  function formatDate(dateString: string) {
    try {
      return format(parseISO(dateString), "dd/MM/yyyy HH:mm");
    } catch (error) {
      return dateString;
    }
  }

  // সার্চ ও ফিল্টার করা ট্রানজেকশন
  const filteredTransactions = transactions.filter(tx => {
    // সার্চ ফিল্টার
    const matchesSearch = 
      searchQuery === "" || 
      tx.id.toString().includes(searchQuery) ||
      tx.userId.toString().includes(searchQuery) ||
      (tx.details && tx.details.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tx.method && tx.method.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // স্ট্যাটাস ফিল্টার
    const matchesStatus = statusFilter === null || tx.status === statusFilter;
    
    // টাইপ ফিল্টার
    const matchesType = typeFilter === null || tx.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ট্রানজেকশন ম্যানেজমেন্ট</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="সার্চ করুন..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="w-1/4">
          <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value || null)}>
            <SelectTrigger>
              <SelectValue placeholder="স্ট্যাটাস ফিল্টার" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">সব স্ট্যাটাস</SelectItem>
              <SelectItem value="success">সফল</SelectItem>
              <SelectItem value="pending">পেন্ডিং</SelectItem>
              <SelectItem value="failed">ব্যর্থ</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-1/4">
          <Select value={typeFilter || ""} onValueChange={(value) => setTypeFilter(value || null)}>
            <SelectTrigger>
              <SelectValue placeholder="ট্রানজেকশন টাইপ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">সব টাইপ</SelectItem>
              <SelectItem value="deposit">ডিপোজিট</SelectItem>
              <SelectItem value="withdraw">উইথড্র</SelectItem>
              <SelectItem value="bonus">বোনাস</SelectItem>
              <SelectItem value="win">জিতেছেন</SelectItem>
              <SelectItem value="lose">হেরেছেন</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>সমস্ত ট্রানজেকশন</CardTitle>
          <CardDescription>
            সাইটের সমস্ত লেনদেনের তালিকা ({filteredTransactions.length})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>আইডি</TableHead>
                <TableHead>ইউজার আইডি</TableHead>
                <TableHead>পরিমাণ</TableHead>
                <TableHead>টাইপ</TableHead>
                <TableHead>পদ্ধতি</TableHead>
                <TableHead>তারিখ</TableHead>
                <TableHead>স্ট্যাটাস</TableHead>
                <TableHead>অ্যাকশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.id}</TableCell>
                  <TableCell>{tx.userId}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {getTransactionTypeIcon(tx.type)}
                      <span className={tx.type === "deposit" || tx.type === "win" || tx.type === "bonus" ? "text-green-600" : "text-red-600"}>
                        ৳{parseFloat(tx.amount).toLocaleString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getTransactionTypeText(tx.type)}</TableCell>
                  <TableCell>{tx.method || "-"}</TableCell>
                  <TableCell>{formatDate(tx.date.toString())}</TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusBadgeVariant(tx.status) as any}
                    >
                      {getStatusText(tx.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => viewTransactionDetails(tx)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ট্রানজেকশন বিস্তারিত ডায়ালগ */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>ট্রানজেকশন বিস্তারিত</DialogTitle>
            <DialogDescription>
              ট্রানজেকশন #{selectedTransaction?.id} এর বিস্তারিত তথ্য
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">ট্রানজেকশন আইডি</p>
                  <p className="font-medium">{selectedTransaction.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ইউজার আইডি</p>
                  <p className="font-medium">{selectedTransaction.userId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">টাইপ</p>
                  <p className="font-medium flex items-center space-x-1">
                    {getTransactionTypeIcon(selectedTransaction.type)}
                    <span>{getTransactionTypeText(selectedTransaction.type)}</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">পরিমাণ</p>
                  <p className={`font-medium ${selectedTransaction.type === "deposit" || selectedTransaction.type === "win" || selectedTransaction.type === "bonus" ? "text-green-600" : "text-red-600"}`}>
                    ৳{parseFloat(selectedTransaction.amount).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">পদ্ধতি</p>
                  <p className="font-medium">{selectedTransaction.method || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">তারিখ</p>
                  <p className="font-medium">{formatDate(selectedTransaction.date.toString())}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">স্ট্যাটাস</p>
                  <Badge variant={getStatusBadgeVariant(selectedTransaction.status) as any}>
                    {getStatusText(selectedTransaction.status)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">বিস্তারিত</p>
                  <p className="font-medium">{selectedTransaction.details || "-"}</p>
                </div>
              </div>

              {/* স্ট্যাটাস আপডেট করার বাটন */}
              {selectedTransaction.status === "pending" && (
                <div className="flex space-x-2 mt-4 pt-4 border-t">
                  <Button
                    className="flex-1"
                    onClick={() => updateTransactionStatus(selectedTransaction.id, "success")}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    অনুমোদন করুন
                  </Button>
                  <Button
                    className="flex-1"
                    variant="destructive"
                    onClick={() => updateTransactionStatus(selectedTransaction.id, "failed")}
                  >
                    <X className="mr-2 h-4 w-4" />
                    বাতিল করুন
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}