import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { PlusCircle, Search, RefreshCcw, Eye, Pencil, Trash, Calendar } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

// প্রমোশন টাইপ
interface Promotion {
  id: number;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string | null;
  isActive: boolean | null;
}

// নতুন প্রমোশন অ্যাড করার ফর্ম টাইপ
interface NewPromotion {
  title: string;
  description: string;
  image: string;
  startDate: Date;
  endDate: Date | null;
  isActive: boolean;
}

export default function PromotionsPanel() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [newPromotion, setNewPromotion] = useState<NewPromotion>({
    title: "",
    description: "",
    image: "https://i.ibb.co/kMYRMH1/promotion-default.jpg", // ডিফল্ট ইমেজ
    startDate: new Date(),
    endDate: null,
    isActive: true,
  });
  
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [deletingPromotion, setDeletingPromotion] = useState<Promotion | null>(null);
  
  // প্রমোশন লিস্ট লোড করা
  const { data: promotions = [], isLoading, refetch } = useQuery<Promotion[]>({
    queryKey: ["/api/admin/promotions"],
    queryFn: async () => {
      const res = await fetch("/api/admin/promotions");
      if (!res.ok) throw new Error("প্রমোশন লিস্ট লোড করতে সমস্যা হয়েছে");
      return res.json();
    }
  });
  
  // নতুন প্রমোশন যোগ করার মিউটেশন
  const addPromotionMutation = useMutation({
    mutationFn: async (promotion: NewPromotion) => {
      const res = await fetch("/api/admin/promotions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(promotion)
      });
      
      if (!res.ok) throw new Error("প্রমোশন যোগ করতে সমস্যা হয়েছে");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "সফল",
        description: "প্রমোশন সফলভাবে যোগ করা হয়েছে",
      });
      setIsAddDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promotions"] });
      
      // ফর্ম রিসেট
      setNewPromotion({
        title: "",
        description: "",
        image: "https://i.ibb.co/kMYRMH1/promotion-default.jpg",
        startDate: new Date(),
        endDate: null,
        isActive: true,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "সমস্যা হয়েছে",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // প্রমোশন এডিট করার মিউটেশন
  const editPromotionMutation = useMutation({
    mutationFn: async (promotion: Promotion) => {
      const res = await fetch(`/api/admin/promotions/${promotion.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(promotion)
      });
      
      if (!res.ok) throw new Error("প্রমোশন আপডেট করতে সমস্যা হয়েছে");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "সফল",
        description: "প্রমোশন সফলভাবে আপডেট করা হয়েছে",
      });
      setIsEditDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promotions"] });
    },
    onError: (error: Error) => {
      toast({
        title: "সমস্যা হয়েছে",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // প্রমোশন ডিলিট করার মিউটেশন
  const deletePromotionMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/promotions/${id}`, {
        method: "DELETE"
      });
      
      if (!res.ok) throw new Error("প্রমোশন ডিলিট করতে সমস্যা হয়েছে");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "সফল",
        description: "প্রমোশন সফলভাবে ডিলিট করা হয়েছে",
      });
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promotions"] });
    },
    onError: (error: Error) => {
      toast({
        title: "সমস্যা হয়েছে",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // সার্চ করা প্রমোশন লিস্ট
  const filteredPromotions = promotions.filter(promo => 
    promo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promo.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // অ্যাক্টিভ ও অ্যাক্টিভ নয় এমন প্রমোশন
  const activePromotions = filteredPromotions.filter(promo => promo.isActive);
  const inactivePromotions = filteredPromotions.filter(promo => !promo.isActive);
  
  // প্রমোশন অ্যাড করার হ্যান্ডলার
  const handleAddPromotion = (e: React.FormEvent) => {
    e.preventDefault();
    addPromotionMutation.mutate(newPromotion);
  };
  
  // প্রমোশন এডিট করার হ্যান্ডলার
  const handleEditPromotion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPromotion) return;
    editPromotionMutation.mutate(editingPromotion);
  };
  
  // প্রমোশন ডিলিট করার হ্যান্ডলার
  const handleDeletePromotion = () => {
    if (!deletingPromotion) return;
    deletePromotionMutation.mutate(deletingPromotion.id);
  };
  
  // তারিখ ফরম্যাট করার ফাংশন
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('bn-BD', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    } catch (e) {
      return "অবৈধ তারিখ";
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">প্রমোশন ম্যানেজমেন্ট</h2>
          <p className="text-sm text-muted-foreground">সাইটের সমস্ত প্রমোশন ও অফার ম্যানেজ করুন</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="প্রমোশন খুঁজুন..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            নতুন প্রমোশন
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">সব প্রমোশন ({filteredPromotions.length})</TabsTrigger>
          <TabsTrigger value="active">অ্যাক্টিভ ({activePromotions.length})</TabsTrigger>
          <TabsTrigger value="inactive">ইনঅ্যাক্টিভ ({inactivePromotions.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <PromotionTable 
            promotions={filteredPromotions} 
            onEdit={(promo) => { setEditingPromotion(promo); setIsEditDialogOpen(true); }}
            onDelete={(promo) => { setDeletingPromotion(promo); setIsDeleteDialogOpen(true); }}
            formatDate={formatDate}
          />
        </TabsContent>
        
        <TabsContent value="active" className="mt-6">
          <PromotionTable 
            promotions={activePromotions} 
            onEdit={(promo) => { setEditingPromotion(promo); setIsEditDialogOpen(true); }}
            onDelete={(promo) => { setDeletingPromotion(promo); setIsDeleteDialogOpen(true); }}
            formatDate={formatDate}
          />
        </TabsContent>
        
        <TabsContent value="inactive" className="mt-6">
          <PromotionTable 
            promotions={inactivePromotions} 
            onEdit={(promo) => { setEditingPromotion(promo); setIsEditDialogOpen(true); }}
            onDelete={(promo) => { setDeletingPromotion(promo); setIsDeleteDialogOpen(true); }}
            formatDate={formatDate}
          />
        </TabsContent>
      </Tabs>
      
      {/* প্রমোশন অ্যাড করার ডায়ালগ */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>নতুন প্রমোশন যোগ করুন</DialogTitle>
            <DialogDescription>
              সাইটে নতুন অফার বা প্রমোশন যোগ করতে নিচের ফর্মটি পূরণ করুন
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddPromotion}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  শিরোনাম
                </Label>
                <Input
                  id="title"
                  placeholder="প্রমোশনের শিরোনাম"
                  value={newPromotion.title}
                  onChange={(e) => setNewPromotion({...newPromotion, title: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  ছবি URL
                </Label>
                <Input
                  id="image"
                  placeholder="ছবির URL"
                  value={newPromotion.image}
                  onChange={(e) => setNewPromotion({...newPromotion, image: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  বিবরণ
                </Label>
                <Textarea
                  id="description"
                  placeholder="প্রমোশনের বিস্তারিত বিবরণ"
                  value={newPromotion.description}
                  onChange={(e) => setNewPromotion({...newPromotion, description: e.target.value})}
                  className="col-span-3"
                  rows={4}
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start-date" className="text-right">
                  শুরুর তারিখ
                </Label>
                <Input
                  id="start-date"
                  type="date"
                  className="col-span-3"
                  value={newPromotion.startDate.toISOString().split('T')[0]}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    if (!isNaN(date.getTime())) {
                      setNewPromotion({...newPromotion, startDate: date});
                    }
                  }}
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end-date" className="text-right">
                  শেষের তারিখ
                </Label>
                <Input
                  id="end-date"
                  type="date"
                  className="col-span-3"
                  value={newPromotion.endDate ? newPromotion.endDate.toISOString().split('T')[0] : ""}
                  onChange={(e) => {
                    if (e.target.value) {
                      const date = new Date(e.target.value);
                      if (!isNaN(date.getTime())) {
                        setNewPromotion({...newPromotion, endDate: date});
                      }
                    } else {
                      setNewPromotion({...newPromotion, endDate: null});
                    }
                  }}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">অ্যাক্টিভ</Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch 
                    id="active-status" 
                    checked={newPromotion.isActive}
                    onCheckedChange={(checked) => setNewPromotion({...newPromotion, isActive: checked})}
                  />
                  <Label htmlFor="active-status">প্রমোশন অ্যাক্টিভ করুন</Label>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="submit" disabled={addPromotionMutation.isPending}>
                {addPromotionMutation.isPending ? "যোগ করা হচ্ছে..." : "যোগ করুন"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* প্রমোশন এডিট করার ডায়ালগ */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>প্রমোশন এডিট করুন</DialogTitle>
            <DialogDescription>
              প্রমোশনের বিবরণ পরিবর্তন করতে নিচের ফর্মটি ব্যবহার করুন
            </DialogDescription>
          </DialogHeader>
          
          {editingPromotion && (
            <form onSubmit={handleEditPromotion}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-title" className="text-right">
                    শিরোনাম
                  </Label>
                  <Input
                    id="edit-title"
                    value={editingPromotion.title}
                    onChange={(e) => setEditingPromotion({...editingPromotion, title: e.target.value})}
                    className="col-span-3"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-image" className="text-right">
                    ছবি URL
                  </Label>
                  <Input
                    id="edit-image"
                    value={editingPromotion.image}
                    onChange={(e) => setEditingPromotion({...editingPromotion, image: e.target.value})}
                    className="col-span-3"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="edit-description" className="text-right pt-2">
                    বিবরণ
                  </Label>
                  <Textarea
                    id="edit-description"
                    value={editingPromotion.description}
                    onChange={(e) => setEditingPromotion({...editingPromotion, description: e.target.value})}
                    className="col-span-3"
                    rows={4}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">অ্যাক্টিভ</Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch 
                      id="edit-active-status" 
                      checked={editingPromotion.isActive === true}
                      onCheckedChange={(checked) => setEditingPromotion({...editingPromotion, isActive: checked})}
                    />
                    <Label htmlFor="edit-active-status">প্রমোশন অ্যাক্টিভ করুন</Label>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit" disabled={editPromotionMutation.isPending}>
                  {editPromotionMutation.isPending ? "আপডেট হচ্ছে..." : "আপডেট করুন"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      
      {/* প্রমোশন ডিলিট করার ডায়ালগ */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>প্রমোশন ডিলিট করুন</DialogTitle>
            <DialogDescription>
              আপনি কি নিশ্চিত যে আপনি এই প্রমোশনটি ডিলিট করতে চান? এই অ্যাকশন অপরিবর্তনীয়।
            </DialogDescription>
          </DialogHeader>
          
          {deletingPromotion && (
            <div className="py-4">
              <p className="mb-2 font-medium">{deletingPromotion.title}</p>
              <p className="text-sm text-muted-foreground">{deletingPromotion.description.substring(0, 100)}...</p>
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
              onClick={handleDeletePromotion}
              disabled={deletePromotionMutation.isPending}
            >
              {deletePromotionMutation.isPending ? "ডিলিট হচ্ছে..." : "ডিলিট করুন"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// প্রমোশন টেবিল কম্পোনেন্ট
interface PromotionTableProps {
  promotions: Promotion[];
  onEdit: (promotion: Promotion) => void;
  onDelete: (promotion: Promotion) => void;
  formatDate: (dateString: string) => string;
}

function PromotionTable({ promotions, onEdit, onDelete, formatDate }: PromotionTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>আইডি</TableHead>
              <TableHead>ছবি</TableHead>
              <TableHead>শিরোনাম</TableHead>
              <TableHead>তারিখ</TableHead>
              <TableHead>স্ট্যাটাস</TableHead>
              <TableHead className="text-right">অ্যাকশন</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  কোন প্রমোশন পাওয়া যায়নি
                </TableCell>
              </TableRow>
            ) : (
              promotions.map((promotion) => (
                <TableRow key={promotion.id}>
                  <TableCell className="font-medium">{promotion.id}</TableCell>
                  <TableCell>
                    <div className="h-10 w-16 overflow-hidden rounded">
                      <img 
                        src={promotion.image} 
                        alt={promotion.title} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://i.ibb.co/kMYRMH1/promotion-default.jpg";
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[300px]">
                      <p className="font-medium truncate">{promotion.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {promotion.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <div className="flex items-center mb-1">
                        <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span>শুরু: {formatDate(promotion.startDate)}</span>
                      </div>
                      {promotion.endDate && (
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>শেষ: {formatDate(promotion.endDate)}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {promotion.isActive ? (
                      <Badge className="bg-emerald-500 hover:bg-emerald-600">অ্যাক্টিভ</Badge>
                    ) : (
                      <Badge variant="outline">ইনঅ্যাক্টিভ</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onEdit(promotion)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => onDelete(promotion)}
                      >
                        <Trash className="h-4 w-4" />
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
  );
}