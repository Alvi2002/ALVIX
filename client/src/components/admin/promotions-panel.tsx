import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Pencil, Trash2, CalendarIcon, Upload } from "lucide-react";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type Promotion = {
  id: number;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  category: string;
  isActive: boolean;
  details?: string;
  termsAndConditions?: string;
  bonusAmount?: number;
  bonusType?: string;
  minimumDeposit?: number;
  wageringRequirements?: number;
  applicableGames?: string[];
};

// প্রমোশন ফর্ম স্কিমা
const promotionSchema = z.object({
  title: z.string().min(1, { message: "টাইটেল পূরণ করা আবশ্যক" }),
  description: z.string().min(1, { message: "বিবরণ পূরণ করা আবশ্যক" }),
  image: z.string().min(1, { message: "ছবির URL দিন" }),
  startDate: z.date({ required_error: "শুরুর তারিখ নির্বাচন করুন" }),
  endDate: z.date({ required_error: "শেষের তারিখ নির্বাচন করুন" }),
  category: z.string().min(1, { message: "ক্যাটাগরি পূরণ করা আবশ্যক" }),
  isActive: z.boolean().default(true),
  details: z.string().optional(),
  termsAndConditions: z.string().optional(),
  bonusAmount: z.number().positive().optional(),
  bonusType: z.string().optional(),
  minimumDeposit: z.number().positive().optional(),
  wageringRequirements: z.number().positive().optional(),
  applicableGames: z.array(z.string()).optional(),
});

type PromotionFormValues = z.infer<typeof promotionSchema>;

export default function PromotionsPanel() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const queryClient = useQueryClient();

  // প্রমোশন লিস্ট লোড করা
  const { data: promotions, isLoading, error } = useQuery<Promotion[]>({
    queryKey: ['/api/admin/promotions'],
  });

  // ফর্ম প্রস্তুত করা
  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      category: "deposit",
      isActive: true,
      details: "",
      termsAndConditions: "",
    },
  });

  // প্রমোশন যোগ করা/আপডেট করা
  const promotionMutation = useMutation({
    mutationFn: async (data: PromotionFormValues) => {
      if (editingPromotion) {
        return apiRequest(`/api/admin/promotions/${editingPromotion.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } else {
        return apiRequest('/api/admin/promotions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/promotions'] });
      toast({
        title: "সফল!",
        description: editingPromotion 
          ? "প্রমোশন আপডেট করা হয়েছে।" 
          : "নতুন প্রমোশন যোগ করা হয়েছে।",
      });
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "সমস্যা হয়েছে",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // প্রমোশন ডিলিট করা
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/promotions/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/promotions'] });
      toast({
        title: "সফল!",
        description: "প্রমোশন ডিলিট করা হয়েছে।",
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

  // ফর্ম সাবমিট করা
  const onSubmit = (data: PromotionFormValues) => {
    promotionMutation.mutate(data);
  };

  // ফর্ম রিসেট করা
  const resetForm = () => {
    setEditingPromotion(null);
    form.reset({
      title: "",
      description: "",
      image: "",
      category: "deposit",
      isActive: true,
      details: "",
      termsAndConditions: "",
    });
    setOpenDialog(false);
  };

  // প্রমোশন এডিট মোড শুরু করা
  const editPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    
    form.reset({
      title: promotion.title,
      description: promotion.description,
      image: promotion.image,
      startDate: new Date(promotion.startDate),
      endDate: new Date(promotion.endDate),
      category: promotion.category,
      isActive: promotion.isActive,
      details: promotion.details || "",
      termsAndConditions: promotion.termsAndConditions || "",
      bonusAmount: promotion.bonusAmount,
      bonusType: promotion.bonusType || "",
      minimumDeposit: promotion.minimumDeposit,
      wageringRequirements: promotion.wageringRequirements,
    });
    
    setOpenDialog(true);
  };

  // প্রমোশন ডিলিট করা
  const deletePromotion = (id: number) => {
    if (window.confirm("আপনি কি এই প্রমোশন ডিলিট করতে চান?")) {
      deleteMutation.mutate(id);
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
        <h2 className="text-2xl font-bold">প্রমোশন ম্যানেজমেন্ট</h2>
        <Button 
          onClick={() => {
            resetForm();
            setOpenDialog(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> নতুন প্রমোশন
        </Button>
      </div>
      
      {/* প্রমোশন টেবিল */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>আইডি</TableHead>
                  <TableHead>টাইটেল</TableHead>
                  <TableHead>ক্যাটাগরি</TableHead>
                  <TableHead>শুরুর তারিখ</TableHead>
                  <TableHead>শেষের তারিখ</TableHead>
                  <TableHead className="text-center">অ্যাক্টিভ</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotions?.map((promo) => (
                  <TableRow key={promo.id}>
                    <TableCell className="font-medium">{promo.id}</TableCell>
                    <TableCell>{promo.title}</TableCell>
                    <TableCell>{promo.category}</TableCell>
                    <TableCell>{new Date(promo.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(promo.endDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-center">
                      {promo.isActive ? 
                        <div className="w-3 h-3 bg-green-500 rounded-full mx-auto" /> : 
                        <div className="w-3 h-3 bg-gray-300 rounded-full mx-auto" />
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => editPromotion(promo)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deletePromotion(promo.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {promotions?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      কোন প্রমোশন পাওয়া যায়নি
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* প্রমোশন ফর্ম ডায়ালগ */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingPromotion ? "প্রমোশন এডিট করুন" : "নতুন প্রমোশন যোগ করুন"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>টাইটেল</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="প্রমোশন টাইটেল"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>সংক্ষিপ্ত বিবরণ</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="প্রমোশনের সংক্ষিপ্ত বিবরণ"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ছবির URL</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input 
                              placeholder="ছবির URL"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="shrink-0"
                            >
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ক্যাটাগরি</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="প্রমোশন ক্যাটাগরি"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>শুরুর তারিখ</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="w-full pl-3 text-left font-normal"
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>তারিখ বাছাই করুন</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>শেষের তারিখ</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="w-full pl-3 text-left font-normal"
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>তারিখ বাছাই করুন</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>অ্যাক্টিভ স্ট্যাটাস</FormLabel>
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
                
                {/* ডান দিকের কলাম */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="details"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>বিস্তারিত বিবরণ</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="প্রমোশনের বিস্তারিত বিবরণ"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="termsAndConditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>শর্তাবলী</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="প্রমোশনের শর্তাবলী"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="bonusAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>বোনাস পরিমাণ</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              placeholder="5000"
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bonusType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>বোনাস টাইপ</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="fixed/percentage"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="minimumDeposit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>সর্বনিম্ন ডিপোজিট</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              placeholder="500"
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="wageringRequirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ওয়েজারিং শর্ত</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              placeholder="10"
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                >
                  বাতিল
                </Button>
                <Button 
                  type="submit" 
                  disabled={promotionMutation.isPending}
                >
                  {promotionMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingPromotion ? "আপডেট করুন" : "যোগ করুন"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}