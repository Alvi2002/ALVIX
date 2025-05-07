import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Search, 
  RefreshCcw, 
  Plus, 
  Trash2, 
  Edit,
  ToggleLeft,
  ToggleRight,
  Phone
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { queryClient } from "@/lib/queryClient";
import { DepositPhone } from "@shared/schema";

export default function DepositPhonesPanel() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPhone, setSelectedPhone] = useState<DepositPhone | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    number: "",
    provider: "bkash",
    name: "",
    isActive: true
  });
  
  // নাম্বার লিস্ট ফেচ করা
  const { data: phones = [], isLoading, refetch } = useQuery<DepositPhone[]>({
    queryKey: ["/api/admin/deposit-phones"],
    queryFn: async () => {
      const res = await fetch("/api/admin/deposit-phones");
      if (!res.ok) throw new Error("ফোন নাম্বার লিস্ট লোড করতে সমস্যা হয়েছে");
      return res.json();
    }
  });
  
  // নতুন নাম্বার যোগ করার মিউটেশন
  const addPhoneMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/admin/deposit-phones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      
      if (!res.ok) throw new Error("ফোন নাম্বার যোগ করতে সমস্যা হয়েছে");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "সফল",
        description: "নতুন ফোন নাম্বার সফলভাবে যোগ করা হয়েছে",
      });
      setIsAddDialogOpen(false);
      setFormData({
        number: "",
        provider: "bkash",
        name: "",
        isActive: true
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/deposit-phones"] });
    },
    onError: (error: Error) => {
      toast({
        title: "সমস্যা হয়েছে",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // নাম্বার এডিট করার মিউটেশন
  const editPhoneMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      const res = await fetch(`/api/admin/deposit-phones/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      
      if (!res.ok) throw new Error("ফোন নাম্বার আপডেট করতে সমস্যা হয়েছে");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "সফল",
        description: "ফোন নাম্বার সফলভাবে আপডেট করা হয়েছে",
      });
      setIsEditDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/deposit-phones"] });
    },
    onError: (error: Error) => {
      toast({
        title: "সমস্যা হয়েছে",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // নাম্বার ডিলিট করার মিউটেশন
  const deletePhoneMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/deposit-phones/${id}`, {
        method: "DELETE"
      });
      
      if (!res.ok) throw new Error("ফোন নাম্বার ডিলিট করতে সমস্যা হয়েছে");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "সফল",
        description: "ফোন নাম্বার সফলভাবে ডিলিট করা হয়েছে",
      });
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/deposit-phones"] });
    },
    onError: (error: Error) => {
      toast({
        title: "সমস্যা হয়েছে",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // নাম্বার স্ট্যাটাস টগল করার মিউটেশন
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number, isActive: boolean }) => {
      const res = await fetch(`/api/admin/deposit-phones/${id}/toggle-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ isActive })
      });
      
      if (!res.ok) throw new Error("ফোন নাম্বার স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "সফল",
        description: "ফোন নাম্বার স্ট্যাটাস সফলভাবে পরিবর্তন করা হয়েছে",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/deposit-phones"] });
    },
    onError: (error: Error) => {
      toast({
        title: "সমস্যা হয়েছে",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // সার্চ করা নাম্বার লিস্ট
  const filteredPhones = phones.filter(phone => 
    phone.phoneNumber.includes(searchTerm) || 
    phone.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    phone.operator.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // নতুন নাম্বার যোগ করার হ্যান্ডলার
  const handleAddPhone = () => {
    addPhoneMutation.mutate(formData);
  };
  
  // নাম্বার এডিট করার হ্যান্ডলার
  const handleEditPhone = () => {
    if (!selectedPhone) return;
    editPhoneMutation.mutate({
      id: selectedPhone.id,
      data: formData
    });
  };
  
  // নাম্বার ডিলিট করার হ্যান্ডলার
  const handleDeletePhone = () => {
    if (!selectedPhone) return;
    deletePhoneMutation.mutate(selectedPhone.id);
  };
  
  // নাম্বার স্ট্যাটাস টগল করার হ্যান্ডলার
  const handleToggleStatus = (phone: DepositPhone) => {
    toggleStatusMutation.mutate({
      id: phone.id,
      isActive: !(phone.isActive || false)
    });
  };
  
  // এডিট ডায়ালগ খোলার হ্যান্ডলার
  const handleOpenEditDialog = (phone: DepositPhone) => {
    setSelectedPhone(phone);
    setFormData({
      number: phone.number,
      provider: phone.provider,
      name: phone.name,
      isActive: phone.isActive || false
    });
    setIsEditDialogOpen(true);
  };
  
  // গেট প্রোভাইডার কালার
  const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'bkash':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'nagad':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'rocket':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'upay':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">ডিপোজিট ফোন নাম্বার</h2>
          <p className="text-sm text-muted-foreground">সাইটের ডিপোজিট ফোন নাম্বারগুলো ম্যানেজ করুন</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="নাম্বার খুঁজুন..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            নতুন নাম্বার
          </Button>
        </div>
      </div>
      
      {/* ফোন নাম্বার টেবিল */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>আইডি</TableHead>
                <TableHead>নাম্বার</TableHead>
                <TableHead>প্রোভাইডার</TableHead>
                <TableHead>নাম</TableHead>
                <TableHead>স্ট্যাটাস</TableHead>
                <TableHead className="text-right">অ্যাকশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPhones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    কোন ফোন নাম্বার পাওয়া যায়নি
                  </TableCell>
                </TableRow>
              ) : (
                filteredPhones.map((phone) => (
                  <TableRow key={phone.id}>
                    <TableCell className="font-medium">{phone.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="font-medium">{phone.number}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getProviderColor(phone.provider)} uppercase`}>
                        {phone.provider}
                      </Badge>
                    </TableCell>
                    <TableCell>{phone.name}</TableCell>
                    <TableCell>
                      <Badge className={phone.isActive ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-700"}>
                        {phone.isActive ? "অ্যাকটিভ" : "ইনঅ্যাকটিভ"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className={phone.isActive ? "text-green-500" : "text-gray-500"}
                          onClick={() => handleToggleStatus(phone)}
                        >
                          {phone.isActive ? (
                            <ToggleRight className="h-5 w-5" />
                          ) : (
                            <ToggleLeft className="h-5 w-5" />
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-blue-500"
                          onClick={() => handleOpenEditDialog(phone)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive"
                          onClick={() => {
                            setSelectedPhone(phone);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* নতুন নাম্বার যোগ করার ডায়ালগ */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>নতুন ডিপোজিট নাম্বার</DialogTitle>
            <DialogDescription>
              নতুন ডিপোজিট ফোন নাম্বার যোগ করুন। সব ফিল্ড ভরা বাধ্যতামূলক।
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="number" className="text-right">
                নাম্বার
              </label>
              <Input
                id="number"
                value={formData.number}
                onChange={(e) => setFormData({...formData, number: e.target.value})}
                className="col-span-3"
                placeholder="01XXXXXXXXX"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="provider" className="text-right">
                প্রোভাইডার
              </label>
              <Select
                value={formData.provider}
                onValueChange={(value) => setFormData({...formData, provider: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="প্রোভাইডার নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bkash">বিকাশ (Bkash)</SelectItem>
                  <SelectItem value="nagad">নগদ (Nagad)</SelectItem>
                  <SelectItem value="rocket">রকেট (Rocket)</SelectItem>
                  <SelectItem value="upay">উপায় (Upay)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                নাম
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="col-span-3"
                placeholder="এজেন্ট নাম"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)}
            >
              বাতিল
            </Button>
            <Button 
              onClick={handleAddPhone}
              disabled={addPhoneMutation.isPending || !formData.number || !formData.name}
            >
              {addPhoneMutation.isPending ? "প্রসেসিং..." : "যোগ করুন"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* নাম্বার এডিট ডায়ালগ */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>ডিপোজিট নাম্বার এডিট</DialogTitle>
            <DialogDescription>
              ডিপোজিট ফোন নাম্বার আপডেট করুন। সব ফিল্ড ভরা বাধ্যতামূলক।
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-number" className="text-right">
                নাম্বার
              </label>
              <Input
                id="edit-number"
                value={formData.number}
                onChange={(e) => setFormData({...formData, number: e.target.value})}
                className="col-span-3"
                placeholder="01XXXXXXXXX"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-provider" className="text-right">
                প্রোভাইডার
              </label>
              <Select
                value={formData.provider}
                onValueChange={(value) => setFormData({...formData, provider: value})}
              >
                <SelectTrigger className="col-span-3" id="edit-provider">
                  <SelectValue placeholder="প্রোভাইডার নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bkash">বিকাশ (Bkash)</SelectItem>
                  <SelectItem value="nagad">নগদ (Nagad)</SelectItem>
                  <SelectItem value="rocket">রকেট (Rocket)</SelectItem>
                  <SelectItem value="upay">উপায় (Upay)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-name" className="text-right">
                নাম
              </label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="col-span-3"
                placeholder="এজেন্ট নাম"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-status" className="text-right">
                স্ট্যাটাস
              </label>
              <Select
                value={formData.isActive ? "active" : "inactive"}
                onValueChange={(value) => setFormData({...formData, isActive: value === "active"})}
              >
                <SelectTrigger className="col-span-3" id="edit-status">
                  <SelectValue placeholder="স্ট্যাটাস নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">অ্যাকটিভ</SelectItem>
                  <SelectItem value="inactive">ইনঅ্যাকটিভ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
            >
              বাতিল
            </Button>
            <Button 
              onClick={handleEditPhone}
              disabled={editPhoneMutation.isPending || !formData.number || !formData.name}
            >
              {editPhoneMutation.isPending ? "আপডেট হচ্ছে..." : "আপডেট করুন"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* নাম্বার ডিলিট ডায়ালগ */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>ডিপোজিট নাম্বার ডিলিট</DialogTitle>
            <DialogDescription>
              আপনি কি নিশ্চিত যে আপনি এই ফোন নাম্বারটি ডিলিট করতে চান?
            </DialogDescription>
          </DialogHeader>
          
          {selectedPhone && (
            <div className="py-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{selectedPhone.number}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedPhone.provider} | {selectedPhone.name}
                  </p>
                </div>
              </div>
              
              <div className="rounded-md bg-destructive/10 p-3 mt-4">
                <div className="flex items-start">
                  <Trash2 className="h-5 w-5 text-destructive mr-2 mt-0.5" />
                  <p className="text-sm text-destructive">
                    এই নাম্বারটি ডিলিট করলে এটি ডিপোজিট নাম্বার লিস্ট থেকে চিরতরে মুছে যাবে।
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              বাতিল
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeletePhone}
              disabled={deletePhoneMutation.isPending}
            >
              {deletePhoneMutation.isPending ? "ডিলিট হচ্ছে..." : "ডিলিট করুন"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}