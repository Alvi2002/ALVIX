import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, CheckCircle, XCircle, RefreshCcw } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

type User = {
  id: number;
  username: string;
  email: string | null;
  phone: string | null;
  fullName: string | null;
  balance: string;
  createdAt: string;
  isVip: boolean | null;
  isAdmin: boolean | null;
  avatarUrl: string | null;
};

export default function UsersPanel() {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  // ইউজার লিস্ট লোড করা
  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
  });

  // ইউজার আপডেট করা
  const updateMutation = useMutation({
    mutationFn: async (data: { id: number, userData: Partial<User> }) => {
      return apiRequest(`/api/admin/users/${data.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.userData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "সফল!",
        description: "ইউজার আপডেট করা হয়েছে।",
      });
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "সমস্যা হয়েছে",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // ইউজার এডিট করা
  const handleEditUser = (user: User) => {
    setEditingUser({ ...user });
    setIsDialogOpen(true);
  };

  // সাবমিট করা
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const { id, ...userData } = editingUser;
    updateMutation.mutate({ id, userData });
  };

  // ফিল্ড আপডেট করা
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingUser) return;
    
    const { name, value } = e.target;
    setEditingUser({
      ...editingUser,
      [name]: value,
    });
  };

  // চেকবক্স টগল করা
  const toggleCheckbox = (field: 'isVip' | 'isAdmin') => {
    if (!editingUser) return;
    
    setEditingUser({
      ...editingUser,
      [field]: !editingUser[field],
    });
  };

  // সার্চ ফিল্টার
  const filteredUsers = users?.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.phone && user.phone.includes(searchQuery))
  );

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
        <h2 className="text-2xl font-bold">ইউজার ম্যানেজমেন্ট</h2>
        <Button 
          size="sm" 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] })}
          variant="outline"
        >
          <RefreshCcw className="h-4 w-4 mr-2" /> রিফ্রেশ
        </Button>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="w-full max-w-sm">
          <Input
            placeholder="সার্চ করুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          মোট ইউজার: {users?.length || 0}
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>আইডি</TableHead>
                  <TableHead>ইউজারনেম</TableHead>
                  <TableHead>ইমেইল</TableHead>
                  <TableHead>ফোন</TableHead>
                  <TableHead className="text-right">ব্যালেন্স (৳)</TableHead>
                  <TableHead className="text-center">VIP</TableHead>
                  <TableHead className="text-center">এডমিন</TableHead>
                  <TableHead className="text-right">একশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email || "-"}</TableCell>
                    <TableCell>{user.phone || "-"}</TableCell>
                    <TableCell className="text-right">{parseFloat(user.balance).toLocaleString('bn-BD')}</TableCell>
                    <TableCell className="text-center">
                      {user.isVip ? <CheckCircle className="h-5 w-5 text-green-500 mx-auto" /> : <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />}
                    </TableCell>
                    <TableCell className="text-center">
                      {user.isAdmin ? <CheckCircle className="h-5 w-5 text-green-500 mx-auto" /> : <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEditUser(user)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredUsers?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                      কোন ইউজার পাওয়া যায়নি
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* এডিট ডায়ালগ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ইউজার এডিট করুন</DialogTitle>
          </DialogHeader>
          
          {editingUser && (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">ইউজারনেম</Label>
                    <Input
                      id="username"
                      name="username"
                      value={editingUser.username}
                      onChange={handleFieldChange}
                      disabled
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="balance">ব্যালেন্স</Label>
                    <Input
                      id="balance"
                      name="balance"
                      type="number"
                      value={editingUser.balance}
                      onChange={handleFieldChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">ইমেইল</Label>
                    <Input
                      id="email"
                      name="email"
                      value={editingUser.email || ""}
                      onChange={handleFieldChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">ফোন</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={editingUser.phone || ""}
                      onChange={handleFieldChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fullName">পূর্ণ নাম</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={editingUser.fullName || ""}
                    onChange={handleFieldChange}
                  />
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="isVip" 
                      checked={!!editingUser.isVip} 
                      onCheckedChange={() => toggleCheckbox('isVip')}
                    />
                    <Label htmlFor="isVip">VIP ইউজার</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="isAdmin" 
                      checked={!!editingUser.isAdmin} 
                      onCheckedChange={() => toggleCheckbox('isAdmin')}
                    />
                    <Label htmlFor="isAdmin">এডমিন ইউজার</Label>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  বাতিল
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  সংরক্ষণ
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}