import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Search, RefreshCcw, ShieldAlert, Shield, Ban, Wallet, Check, X } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { User } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function UsersPanel() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // ইউজার লিস্ট লোড করা
  const { data: users = [], isLoading, refetch } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("ইউজার লিস্ট লোড করতে সমস্যা হয়েছে");
      return res.json();
    }
  });
  
  // ইউজার আপডেট করার মিউটেশন
  const updateUserMutation = useMutation({
    mutationFn: async (userData: Partial<User> & { id: number }) => {
      const { id, ...rest } = userData;
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(rest)
      });
      
      if (!res.ok) throw new Error("ইউজার আপডেট করতে সমস্যা হয়েছে");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "সফল",
        description: "ইউজার সফলভাবে আপডেট করা হয়েছে",
      });
      setIsUpdateDialogOpen(false);
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
  
  // অ্যাডমিন ও সাধারণ ইউজার
  const adminUsers = filteredUsers.filter(user => user.isAdmin);
  const regularUsers = filteredUsers.filter(user => !user.isAdmin);
  const vipUsers = filteredUsers.filter(user => user.isVip);
  
  // ইউজার আপডেট করার হ্যান্ডলার
  const handleUpdateUser = () => {
    if (!selectedUser) return;
    updateUserMutation.mutate(selectedUser);
  };
  
  // ফরম্যাট ডেট
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
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
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">সব ইউজার ({filteredUsers.length})</TabsTrigger>
          <TabsTrigger value="regular">সাধারণ ({regularUsers.length})</TabsTrigger>
          <TabsTrigger value="vip">VIP ({vipUsers.length})</TabsTrigger>
          <TabsTrigger value="admin">অ্যাডমিন ({adminUsers.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <UserTable 
            users={filteredUsers}
            onUpdate={(user) => { setSelectedUser(user); setIsUpdateDialogOpen(true); }}
            formatDate={formatDate}
          />
        </TabsContent>
        
        <TabsContent value="regular" className="mt-6">
          <UserTable 
            users={regularUsers}
            onUpdate={(user) => { setSelectedUser(user); setIsUpdateDialogOpen(true); }}
            formatDate={formatDate}
          />
        </TabsContent>
        
        <TabsContent value="vip" className="mt-6">
          <UserTable 
            users={vipUsers}
            onUpdate={(user) => { setSelectedUser(user); setIsUpdateDialogOpen(true); }}
            formatDate={formatDate}
          />
        </TabsContent>
        
        <TabsContent value="admin" className="mt-6">
          <UserTable 
            users={adminUsers}
            onUpdate={(user) => { setSelectedUser(user); setIsUpdateDialogOpen(true); }}
            formatDate={formatDate}
          />
        </TabsContent>
      </Tabs>
      
      {/* ইউজার আপডেট ডায়ালগ */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>ইউজার আপডেট করুন</DialogTitle>
            <DialogDescription>
              ইউজারের তথ্য ও স্ট্যাটাস পরিবর্তন করুন
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  ইউজারনেম
                </Label>
                <Input
                  id="username"
                  value={selectedUser.username}
                  className="col-span-3"
                  disabled
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="balance" className="text-right">
                  ব্যালেন্স
                </Label>
                <Input
                  id="balance"
                  value={selectedUser.balance}
                  onChange={(e) => setSelectedUser({...selectedUser, balance: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right">VIP</div>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch 
                    id="vip-status" 
                    checked={selectedUser.isVip === true}
                    onCheckedChange={(checked) => setSelectedUser({...selectedUser, isVip: checked})}
                  />
                  <Label htmlFor="vip-status">VIP স্ট্যাটাস</Label>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right">অ্যাডমিন</div>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch 
                    id="admin-status" 
                    checked={selectedUser.isAdmin === true}
                    onCheckedChange={(checked) => setSelectedUser({...selectedUser, isAdmin: checked})}
                  />
                  <Label htmlFor="admin-status">অ্যাডমিন স্ট্যাটাস</Label>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsUpdateDialogOpen(false)}
            >
              বাতিল
            </Button>
            <Button 
              onClick={handleUpdateUser}
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? "আপডেট হচ্ছে..." : "আপডেট করুন"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ইউজার টেবিল কম্পোনেন্ট
interface UserTableProps {
  users: User[];
  onUpdate: (user: User) => void;
  formatDate: (date: Date | string) => string;
}

function UserTable({ users, onUpdate, formatDate }: UserTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>আইডি</TableHead>
              <TableHead>ইউজারনেম</TableHead>
              <TableHead>তথ্য</TableHead>
              <TableHead>ব্যালেন্স</TableHead>
              <TableHead>স্ট্যাটাস</TableHead>
              <TableHead>যোগ হয়েছেন</TableHead>
              <TableHead>অ্যাকশন</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  কোন ইউজার পাওয়া যায়নি
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {user.fullName && <div className="text-sm">{user.fullName}</div>}
                      {user.email && <div className="text-xs text-muted-foreground">{user.email}</div>}
                      {user.phone && <div className="text-xs text-muted-foreground">{user.phone}</div>}
                    </div>
                  </TableCell>
                  <TableCell>৳{parseFloat(user.balance).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {user.isAdmin && (
                        <Badge className="bg-blue-500 hover:bg-blue-600 w-fit">
                          <ShieldAlert className="h-3 w-3 mr-1" />
                          অ্যাডমিন
                        </Badge>
                      )}
                      {user.isVip && (
                        <Badge className="bg-amber-500 hover:bg-amber-600 w-fit">
                          <Shield className="h-3 w-3 mr-1" />
                          VIP
                        </Badge>
                      )}
                      {!user.isAdmin && !user.isVip && (
                        <Badge variant="outline" className="w-fit">সাধারণ</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onUpdate(user)}
                    >
                      <Wallet className="h-4 w-4 mr-1" />
                      ম্যানেজ
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