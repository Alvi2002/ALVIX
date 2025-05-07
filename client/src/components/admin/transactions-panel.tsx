import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, RefreshCcw, Filter, Check, X, CalendarIcon } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

type Transaction = {
  id: number;
  userId: number;
  type: string;
  amount: string;
  status: string;
  date: string;
  method: string | null;
  details: string | null;
};

type User = {
  id: number;
  username: string;
};

export default function TransactionsPanel() {
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    userId: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
  });
  const queryClient = useQueryClient();

  // ট্রানজেকশন লিস্ট লোড করা
  const { data: transactions, isLoading, error } = useQuery<Transaction[]>({
    queryKey: ['/api/admin/transactions'],
  });

  // ইউজার লিস্ট লোড করা (দ্রুত রেফারেন্সের জন্য)
  const { data: users } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
  });

  // ট্রানজেকশন স্ট্যাটাস আপডেট করা
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      return apiRequest(`/api/admin/transactions/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/transactions'] });
      toast({
        title: "সফল!",
        description: "ট্রানজেকশন স্ট্যাটাস আপডেট করা হয়েছে।",
      });
      setStatusDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "সমস্যা হয়েছে",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // ট্রানজেকশন স্ট্যাটাস পরিবর্তন করা
  const openStatusDialog = (tx: Transaction) => {
    setSelectedTx(tx);
    setNewStatus(tx.status);
    setStatusDialogOpen(true);
  };

  // স্ট্যাটাস আপডেট সাবমিট করা
  const handleStatusUpdate = () => {
    if (!selectedTx || !newStatus) return;
    statusMutation.mutate({ id: selectedTx.id, status: newStatus });
  };

  // ফিল্টার পরিবর্তন করা
  const handleFilterChange = (field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // ফিল্টার রিসেট করা
  const resetFilters = () => {
    setFilters({
      type: "",
      status: "",
      userId: "",
      startDate: null,
      endDate: null,
    });
  };

  // ট্রানজেকশন ফিল্টার করা
  const filteredTransactions = transactions?.filter(tx => {
    // টাইপ ফিল্টার
    if (filters.type && tx.type !== filters.type) {
      return false;
    }
    
    // স্ট্যাটাস ফিল্টার
    if (filters.status && tx.status !== filters.status) {
      return false;
    }
    
    // ইউজার আইডি ফিল্টার
    if (filters.userId && tx.userId !== parseInt(filters.userId)) {
      return false;
    }
    
    // ডেট রেঞ্জ ফিল্টার
    const txDate = new Date(tx.date);
    if (filters.startDate && txDate < filters.startDate) {
      return false;
    }
    if (filters.endDate) {
      // আজকের তারিখে 23:59:59 সেট করি যাতে সম্পুর্ণ দিন অন্তর্ভুক্ত হয়
      const endOfDay = new Date(filters.endDate);
      endOfDay.setHours(23, 59, 59, 999);
      if (txDate > endOfDay) {
        return false;
      }
    }
    
    return true;
  });

  // ইউজারনেম পাওয়া
  const getUsernameById = (userId: number) => {
    const user = users?.find(u => u.id === userId);
    return user ? user.username : `ইউজার #${userId}`;
  };

  // স্ট্যাটাস ব্যাজ রেন্ডার করা
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500">{status}</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">{status}</Badge>;
      case "failed":
        return <Badge className="bg-red-500">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // টাইপ ব্যাজ রেন্ডার করা
  const renderTypeBadge = (type: string) => {
    switch (type) {
      case "deposit":
        return <Badge className="bg-blue-500">জমা</Badge>;
      case "withdraw":
        return <Badge className="bg-orange-500">উত্তোলন</Badge>;
      case "bonus":
        return <Badge className="bg-purple-500">বোনাস</Badge>;
      case "win":
        return <Badge className="bg-green-500">উইন</Badge>;
      case "lose":
        return <Badge className="bg-red-500">লস</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive p-4 bg-destructive/10 rounded-lg">
        ডাটা লোড করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">ট্রানজেকশন ম্যানেজমেন্ট</h2>
        <Button 
          size="sm" 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/admin/transactions'] })}
          variant="outline"
        >
          <RefreshCcw className="h-4 w-4 mr-2" /> রিফ্রেশ
        </Button>
      </div>
      
      {/* ফিল্টার সেকশন */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">টাইপ</label>
              <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="সবগুলো টাইপ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">সবগুলো</SelectItem>
                  <SelectItem value="deposit">জমা</SelectItem>
                  <SelectItem value="withdraw">উত্তোলন</SelectItem>
                  <SelectItem value="bonus">বোনাস</SelectItem>
                  <SelectItem value="win">উইন</SelectItem>
                  <SelectItem value="lose">লস</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">স্ট্যাটাস</label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="সবগুলো স্ট্যাটাস" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">সবগুলো</SelectItem>
                  <SelectItem value="success">সফল</SelectItem>
                  <SelectItem value="pending">পেন্ডিং</SelectItem>
                  <SelectItem value="failed">ব্যর্থ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">ইউজার</label>
              <Select value={filters.userId.toString()} onValueChange={(value) => handleFilterChange('userId', parseInt(value) || "")}>
                <SelectTrigger>
                  <SelectValue placeholder="সব ইউজার" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">সব ইউজার</SelectItem>
                  {users?.map(user => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">শুরুর তারিখ</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.startDate ? (
                        format(filters.startDate, "PPP")
                      ) : (
                        <span>তারিখ বাছাই করুন</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.startDate || undefined}
                      onSelect={(date) => handleFilterChange('startDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">শেষ তারিখ</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.endDate ? (
                        format(filters.endDate, "PPP")
                      ) : (
                        <span>তারিখ বাছাই করুন</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.endDate || undefined}
                      onSelect={(date) => handleFilterChange('endDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="flex items-end md:col-span-4 space-x-2">
              <Button onClick={resetFilters} variant="outline" size="sm" className="w-24">
                রিসেট
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* ট্রানজেকশন টেবিল */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>আইডি</TableHead>
                  <TableHead>ইউজার</TableHead>
                  <TableHead>টাইপ</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                  <TableHead className="text-right">পরিমাণ (৳)</TableHead>
                  <TableHead>পদ্ধতি</TableHead>
                  <TableHead>তারিখ</TableHead>
                  <TableHead>বিবরণ</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions?.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-medium">{tx.id}</TableCell>
                    <TableCell>{getUsernameById(tx.userId)}</TableCell>
                    <TableCell>{renderTypeBadge(tx.type)}</TableCell>
                    <TableCell>{renderStatusBadge(tx.status)}</TableCell>
                    <TableCell className="text-right">{parseFloat(tx.amount).toLocaleString('bn-BD')}</TableCell>
                    <TableCell>{tx.method || "-"}</TableCell>
                    <TableCell>{new Date(tx.date).toLocaleString()}</TableCell>
                    <TableCell className="max-w-xs truncate">{tx.details || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => openStatusDialog(tx)}
                      >
                        স্ট্যাটাস
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredTransactions?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                      কোন ট্রানজেকশন পাওয়া যায়নি
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* স্ট্যাটাস আপডেট ডায়ালগ */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ট্রানজেকশন স্ট্যাটাস আপডেট করুন</DialogTitle>
          </DialogHeader>
          
          {selectedTx && (
            <div className="space-y-4 py-4">
              <div className="grid gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">ট্রানজেকশন আইডি</p>
                  <p>{selectedTx.id}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">ইউজার</p>
                  <p>{getUsernameById(selectedTx.userId)}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">টাইপ</p>
                  <p>{selectedTx.type}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">পরিমাণ</p>
                  <p>{parseFloat(selectedTx.amount).toLocaleString('bn-BD')} ৳</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">বর্তমান স্ট্যাটাস</p>
                  <p>{renderStatusBadge(selectedTx.status)}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">নতুন স্ট্যাটাস</p>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="স্ট্যাটাস বাছাই করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="success">সফল</SelectItem>
                      <SelectItem value="pending">পেন্ডিং</SelectItem>
                      <SelectItem value="failed">ব্যর্থ</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="pt-4 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">নোট:</p>
                    <p>
                      "সফল" স্ট্যাটাসে পরিবর্তন করলে ইউজারের ব্যালেন্স অটোমেটিক আপডেট হবে।
                      সতর্কতার সাথে স্ট্যাটাস পরিবর্তন করুন।
                    </p>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStatusDialogOpen(false)}
                >
                  বাতিল
                </Button>
                <Button 
                  onClick={handleStatusUpdate}
                  disabled={statusMutation.isPending || newStatus === selectedTx.status}
                >
                  {statusMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  আপডেট করুন
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}