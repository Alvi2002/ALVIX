import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, RefreshCcw, Eye, Ban, ShieldCheck, ShieldAlert, UserCog } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { User } from "@shared/schema";

export default function UsersPanel() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [isUnbanDialogOpen, setIsUnbanDialogOpen] = useState(false);
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    balance: "",
  });
  
  // ইউজার লিস্ট ফেচ করা
  const { data: users = [], isLoading, refetch } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("ইউজার লিস্ট লোড করতে সমস্যা হয়েছে");
      return res.json();
    }
  });
  
  // ইউজার ব্যান করার মিউটেশন
  const banUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await fetch(`/api/admin/users/${userId}/ban`, {
        method: "POST"
      });
      
      if (!res.ok) throw new Error("ইউজার ব্যান করতে সমস্যা হয়েছে");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "সফল",
        description: "ইউজার সফলভাবে ব্যান করা হয়েছে",
      });
      setIsBanDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "সমস্যা হয়েছে",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // ইউজারকে অ্যাডমিন করার মিউটেশন
  const makeAdminMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await fetch(`/api/admin/users/${userId}/make-admin`, {
        method: "POST"
      });
      
      if (!res.ok) throw new Error("ইউজারকে অ্যাডমিন করতে সমস্যা হয়েছে");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "সফল",
        description: "ইউজারকে সফলভাবে অ্যাডমিন করা হয়েছে",
      });
      setIsAdminDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "সমস্যা হয়েছে",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // ইউজার আনব্যান করার মিউটেশন
  const unbanUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await fetch(`/api/admin/users/${userId}/unban`, {
        method: "POST"
      });
      
      if (!res.ok) throw new Error("ইউজার আনব্যান করতে সমস্যা হয়েছে");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "সফল",
        description: "ইউজার সফলভাবে আনব্যান করা হয়েছে",
      });
      setIsUnbanDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "সমস্যা হয়েছে",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // ইউজার এডিট করার মিউটেশন
  const editUserMutation = useMutation({
    mutationFn: async ({ userId, userData }: { userId: number, userData: any }) => {
      const res = await fetch(`/api/admin/users/${userId}/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });
      
      if (!res.ok) throw new Error("ইউজার এডিট করতে সমস্যা হয়েছে");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "সফল",
        description: "ইউজার সফলভাবে আপডেট করা হয়েছে",
      });
      setIsEditDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "সমস্যা হয়েছে",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // সার্চ করা ইউজার লিস্ট
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // তারিখ ফরম্যাট করা
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
  
  // ইউজার ব্যান করার হ্যান্ডলার
  const handleBanUser = () => {
    if (!selectedUser) return;
    banUserMutation.mutate(selectedUser.id);
  };
  
  // ইউজারকে অ্যাডমিন করার হ্যান্ডলার
  const handleMakeAdmin = () => {
    if (!selectedUser) return;
    makeAdminMutation.mutate(selectedUser.id);
  };
  
  // ইউজার আনব্যান করার হ্যান্ডলার
  const handleUnbanUser = () => {
    if (!selectedUser) return;
    unbanUserMutation.mutate(selectedUser.id);
  };
  
  // ইউজার এডিট করার হ্যান্ডলার
  const handleEditUser = () => {
    if (!selectedUser) return;
    editUserMutation.mutate({
      userId: selectedUser.id,
      userData: editFormData
    });
  };
  
  // ইউজার এডিট ডায়ালগ খোলার হ্যান্ডলার
  const handleOpenEditDialog = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      balance: user.balance,
    });
    setIsEditDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">ইউজার ম্যানেজমেন্ট</h2>
          <p className="text-sm text-muted-foreground">সাইটের সমস্ত ইউজার ম্যানেজ করুন</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="ইউজার খুঁজুন..."
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
      
      {/* ইউজার টেবিল */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>আইডি</TableHead>
                <TableHead>ইউজারনেম</TableHead>
                <TableHead>নাম/ইমেইল</TableHead>
                <TableHead>ব্যালেন্স</TableHead>
                <TableHead>স্ট্যাটাস</TableHead>
                <TableHead>রেজিস্ট্রেশন</TableHead>
                <TableHead className="text-right">অ্যাকশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    কোন ইউজার পাওয়া যায়নি
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user.avatarUrl ? (
                          <div className="h-8 w-8 rounded-full overflow-hidden">
                            <img 
                              src={user.avatarUrl} 
                              alt={user.username} 
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://i.ibb.co/6RJbFkN/default-avatar.png";
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-xs font-medium text-muted-foreground">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span className="font-medium">{user.username}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[220px]">
                        {user.fullName && (
                          <p className="font-medium truncate">{user.fullName}</p>
                        )}
                        {user.email && (
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(user.balance)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {user.isAdmin && (
                          <Badge className="bg-indigo-500 text-white hover:bg-indigo-600">অ্যাডমিন</Badge>
                        )}
                        {user.isVip && (
                          <Badge className="bg-amber-500 text-white hover:bg-amber-600">VIP</Badge>
                        )}
                        {!user.isAdmin && !user.isVip && (
                          <Badge variant="outline">রেগুলার</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsViewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-blue-500 hover:text-blue-600"
                          onClick={() => handleOpenEditDialog(user)}
                        >
                          <UserCog className="h-4 w-4" />
                        </Button>
                        
                        {!user.isAdmin && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-indigo-500 hover:text-indigo-600"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsAdminDialogOpen(true);
                            }}
                          >
                            <ShieldCheck className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {user.isBanned ? (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-green-500 hover:text-green-600"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsUnbanDialogOpen(true);
                            }}
                          >
                            <ShieldAlert className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsBanDialogOpen(true);
                            }}
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* ইউজার ভিউ ডায়ালগ */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[475px]">
          <DialogHeader>
            <DialogTitle>ইউজার বিবরণ</DialogTitle>
            <DialogDescription>
              ইউজারের সম্পূর্ণ বিবরণ দেখুন
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="py-4">
              <div className="flex flex-col items-center mb-4">
                <div className="h-20 w-20 rounded-full overflow-hidden mb-2 bg-muted">
                  {selectedUser.avatarUrl ? (
                    <img 
                      src={selectedUser.avatarUrl} 
                      alt={selectedUser.username} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://i.ibb.co/6RJbFkN/default-avatar.png";
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <span className="text-3xl font-medium text-muted-foreground">
                        {selectedUser.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-medium">{selectedUser.username}</h3>
                <div className="flex gap-2 mt-1">
                  {selectedUser.isAdmin && (
                    <Badge className="bg-indigo-500 text-white hover:bg-indigo-600">অ্যাডমিন</Badge>
                  )}
                  {selectedUser.isVip && (
                    <Badge className="bg-amber-500 text-white hover:bg-amber-600">VIP</Badge>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground">পুরো নাম</p>
                  <p className="font-medium">{selectedUser.fullName || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">ইমেইল</p>
                  <p className="font-medium">{selectedUser.email || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">ফোন</p>
                  <p className="font-medium">{selectedUser.phone || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">ব্যালেন্স</p>
                  <p className="font-medium">{formatCurrency(selectedUser.balance)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">রেজিস্ট্রেশন তারিখ</p>
                  <p className="font-medium">{formatDate(selectedUser.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">স্ট্যাটাস</p>
                  <p className="font-medium">
                    {selectedUser.isAdmin 
                      ? "অ্যাডমিন"
                      : selectedUser.isVip
                      ? "VIP ইউজার"
                      : "রেগুলার ইউজার"}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>
              বন্ধ করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* ইউজার ব্যান ডায়ালগ */}
      <Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>ইউজার ব্যান করুন</DialogTitle>
            <DialogDescription>
              আপনি কি নিশ্চিত যে আপনি এই ইউজারকে ব্যান করতে চান? এই অ্যাকশন অপরিবর্তনীয়।
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-muted">
                  {selectedUser.avatarUrl ? (
                    <img 
                      src={selectedUser.avatarUrl} 
                      alt={selectedUser.username} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://i.ibb.co/6RJbFkN/default-avatar.png";
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <span className="text-lg font-medium text-muted-foreground">
                        {selectedUser.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium">{selectedUser.username}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedUser.email || selectedUser.fullName || `আইডি: ${selectedUser.id}`}
                  </p>
                </div>
              </div>
              
              <div className="rounded-md bg-destructive/10 p-3 mt-4">
                <div className="flex items-start">
                  <ShieldAlert className="h-5 w-5 text-destructive mr-2 mt-0.5" />
                  <p className="text-sm text-destructive">
                    এই ইউজারকে ব্যান করলে ইউজার আর লগইন করতে পারবে না এবং সাইটের কোন ফিচার ব্যবহার করতে পারবে না।
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsBanDialogOpen(false)}
            >
              বাতিল
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleBanUser}
              disabled={banUserMutation.isPending}
            >
              {banUserMutation.isPending ? "ব্যান করা হচ্ছে..." : "ব্যান করুন"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* ইউজারকে অ্যাডমিন করার ডায়ালগ */}
      <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>অ্যাডমিন করুন</DialogTitle>
            <DialogDescription>
              আপনি কি নিশ্চিত যে আপনি এই ইউজারকে অ্যাডমিন করতে চান? এই ইউজার সম্পূর্ণ অ্যাডমিন প্যানেল অ্যাক্সেস পাবে।
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-muted">
                  {selectedUser.avatarUrl ? (
                    <img 
                      src={selectedUser.avatarUrl} 
                      alt={selectedUser.username} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://i.ibb.co/6RJbFkN/default-avatar.png";
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <span className="text-lg font-medium text-muted-foreground">
                        {selectedUser.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium">{selectedUser.username}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedUser.email || selectedUser.fullName || `আইডি: ${selectedUser.id}`}
                  </p>
                </div>
              </div>
              
              <div className="rounded-md bg-indigo-500/10 p-3 mt-4">
                <div className="flex items-start">
                  <ShieldCheck className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" />
                  <p className="text-sm text-indigo-600 dark:text-indigo-400">
                    এই ইউজারকে অ্যাডমিন করলে ইউজার সাইটের সমস্ত ফিচার এবং অ্যাডমিন প্যানেল অ্যাক্সেস পাবে।
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAdminDialogOpen(false)}
            >
              বাতিল
            </Button>
            <Button 
              variant="default" 
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={handleMakeAdmin}
              disabled={makeAdminMutation.isPending}
            >
              {makeAdminMutation.isPending ? "প্রসেসিং..." : "অ্যাডমিন করুন"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}