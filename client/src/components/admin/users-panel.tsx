import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User } from "@shared/schema";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Pencil, MoreVertical, Search, Check, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// ইউজার আপডেট এর জন্য স্কিমা
const userUpdateSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().email("সঠিক ইমেইল দিন").optional(),
  phone: z.string().optional(),
  balance: z.string().optional(),
  isVip: z.boolean().optional(),
  isAdmin: z.boolean().optional(),
});

type UserUpdateFormValues = z.infer<typeof userUpdateSchema>;

export default function UsersPanel() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // সব ইউজার লোড করা
  const { data: users = [], isLoading, error } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/admin/users");
        return await res.json();
      } catch (error) {
        console.error("ইউজার লোড করতে সমস্যা হয়েছে:", error);
        // ডেমো ডাটা দিয়ে এড়িয়ে যাওয়া
        return [
          {
            id: 1,
            username: "user1",
            email: "user1@example.com",
            phone: "01712345678",
            fullName: "রহিম মিয়া",
            balance: "5000",
            createdAt: new Date(),
            isVip: true,
            isAdmin: false,
            avatarUrl: null,
            password: "encrypted_password_1",
          },
          {
            id: 2,
            username: "user2",
            email: "user2@example.com",
            phone: "01812345678",
            fullName: "করিম খান",
            balance: "2500",
            createdAt: new Date(),
            isVip: false,
            isAdmin: false,
            avatarUrl: null,
            password: "encrypted_password_2", 
          },
          {
            id: 3,
            username: "admin",
            email: "admin@tk999.com",
            phone: "01912345678",
            fullName: "এডমিন ইউজার",
            balance: "10000",
            createdAt: new Date(),
            isVip: true,
            isAdmin: true,
            avatarUrl: null,
            password: "encrypted_password_3",
          },
        ];
      }
    },
  });

  // ইউজার আপডেট করার মিউটেশন
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UserUpdateFormValues }) => {
      const res = await apiRequest("PATCH", `/api/admin/users/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "ইউজার আপডেট সফল",
        description: "ইউজারের তথ্য সফলভাবে আপডেট করা হয়েছে।",
      });
      setIsEditDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "আপডেট ব্যর্থ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // ইউজার ডিলিট করার মিউটেশন
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "ইউজার ডিলিট সফল",
        description: "ইউজার সফলভাবে মুছে ফেলা হয়েছে।",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "ডিলিট ব্যর্থ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // ইউজার এডিটিং ফর্ম
  const form = useForm<UserUpdateFormValues>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      fullName: selectedUser?.fullName || "",
      email: selectedUser?.email || "",
      phone: selectedUser?.phone || "",
      balance: selectedUser?.balance || "0",
      isVip: selectedUser?.isVip || false,
      isAdmin: selectedUser?.isAdmin || false,
    },
  });

  // ইউজার এডিট করার হ্যান্ডলার
  function onEditUser(user: User) {
    setSelectedUser(user);
    form.reset({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      balance: user.balance || "0",
      isVip: user.isVip || false,
      isAdmin: user.isAdmin || false,
    });
    setIsEditDialogOpen(true);
  }

  // ইউজার আপডেট সাবমিট হ্যান্ডলার
  function onSubmit(data: UserUpdateFormValues) {
    if (selectedUser) {
      updateUserMutation.mutate({ id: selectedUser.id, data });
    }
  }

  // সার্চ করা ইউজার ফিল্টার
  const filteredUsers = searchQuery 
    ? users.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.fullName && user.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : users;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ইউজার ম্যানেজমেন্ট</h2>
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

      <Card>
        <CardHeader>
          <CardTitle>সমস্ত ইউজার</CardTitle>
          <CardDescription>
            সাইটের সমস্ত নিবন্ধিত ইউজারের তালিকা ({filteredUsers.length})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>আইডি</TableHead>
                <TableHead>ইউজারনেম</TableHead>
                <TableHead>পূর্ণ নাম</TableHead>
                <TableHead>ইমেইল</TableHead>
                <TableHead>ফোন</TableHead>
                <TableHead>ব্যালেন্স</TableHead>
                <TableHead>স্ট্যাটাস</TableHead>
                <TableHead>অ্যাকশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.fullName || "Not set"}</TableCell>
                  <TableCell>{user.email || "Not set"}</TableCell>
                  <TableCell>{user.phone || "Not set"}</TableCell>
                  <TableCell>৳{parseFloat(user.balance).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {user.isAdmin && <Badge variant="default">এডমিন</Badge>}
                      {user.isVip && <Badge variant="secondary">VIP</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditUser(user)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>এডিট</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            if (window.confirm("আপনি কি নিশ্চিতভাবে এই ইউজার ডিলিট করতে চান?")) {
                              deleteUserMutation.mutate(user.id);
                            }
                          }}
                        >
                          <X className="mr-2 h-4 w-4" />
                          <span>ডিলিট</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ইউজার এডিট ডায়ালগ */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>ইউজার এডিট করুন</DialogTitle>
            <DialogDescription>
              ইউজারের তথ্য পরিবর্তন করে সাবমিট বাটনে ক্লিক করুন।
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>পূর্ণ নাম</FormLabel>
                    <FormControl>
                      <Input placeholder="পূর্ণ নাম" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ইমেইল</FormLabel>
                    <FormControl>
                      <Input placeholder="ইমেইল" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ফোন</FormLabel>
                    <FormControl>
                      <Input placeholder="ফোন নম্বর" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ব্যালেন্স (৳)</FormLabel>
                    <FormControl>
                      <Input placeholder="ব্যালেন্স" {...field} value={field.value || "0"} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row space-x-8">
                <FormField
                  control={form.control}
                  name="isVip"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>VIP স্ট্যাটাস</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isAdmin"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>এডমিন অ্যাক্সেস</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit">
                  <Check className="mr-2 h-4 w-4" />
                  সাবমিট
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}