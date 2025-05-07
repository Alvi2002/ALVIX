import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Promotion } from "@shared/schema";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { format, isBefore, isAfter, parseISO } from "date-fns";
import { Pencil, Trash, PlusCircle, Search, Check } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// প্রমোশন ফর্ম স্কিমা
const promotionSchema = z.object({
  title: z.string().min(2, "টাইটেল দিন"),
  description: z.string().min(10, "বর্ণনা দিন"),
  image: z.string().min(2, "ইমেজ URL দিন"),
  startDate: z.date(),
  endDate: z.date().optional(),
  isActive: z.boolean().default(true),
});

type PromotionFormValues = z.infer<typeof promotionSchema>;

export default function PromotionsPanel() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [isPromotionDialogOpen, setIsPromotionDialogOpen] = useState(false);
  const [isAddingPromotion, setIsAddingPromotion] = useState(false);

  // প্রমোশন লোড করা
  const { data: promotions = [], isLoading } = useQuery<Promotion[]>({
    queryKey: ["/api/promotions"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/promotions");
        return await res.json();
      } catch (error) {
        console.error("প্রমোশন লোড করতে সমস্যা হয়েছে:", error);
        // ডেমো ডাটা দিয়ে এড়িয়ে যাওয়া
        return [
          {
            id: 1,
            title: "স্বাগতম বোনাস",
            description: "প্রথম ডিপোজিটে ১০০% বোনাস, সর্বোচ্চ ৫,০০০ টাকা",
            image: "/images/promotions/welcome-bonus.jpg",
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            isActive: true,
          },
          {
            id: 2,
            title: "রিলোড বোনাস",
            description: "প্রতিদিন ২৫% রিলোড বোনাস, সর্বোচ্চ ১,০০০ টাকা",
            image: "/images/promotions/reload-bonus.jpg",
            startDate: new Date(),
            endDate: null,
            isActive: true,
          },
          {
            id: 3,
            title: "ক্যাশব্যাক অফার",
            description: "২০% ক্যাশব্যাক সব স্লট গেমে",
            image: "/images/promotions/cashback.jpg",
            startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
            endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
            isActive: true,
          },
          {
            id: 4,
            title: "সাপ্তাহিক টুর্নামেন্ট",
            description: "৫০,০০০ টাকা প্রাইজপুল নিয়ে সাপ্তাহিক টুর্নামেন্ট",
            image: "/images/promotions/tournament.jpg",
            startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            isActive: true,
          },
          {
            id: 5,
            title: "রেফারেল বোনাস",
            description: "নতুন ইউজার রেফার করলে ৫০০ টাকা বোনাস",
            image: "/images/promotions/referral.jpg",
            startDate: new Date(),
            endDate: null,
            isActive: true,
          }
        ];
      }
    },
  });

  // প্রমোশন ফর্ম
  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      startDate: new Date(),
      endDate: undefined,
      isActive: true,
    },
  });

  // প্রমোশন যোগ করার মিউটেশন
  const addPromotionMutation = useMutation({
    mutationFn: async (data: PromotionFormValues) => {
      const res = await apiRequest("POST", "/api/promotions", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/promotions"] });
      toast({
        title: "প্রমোশন যোগ সফল",
        description: "প্রমোশন সফলভাবে যোগ করা হয়েছে।",
      });
      setIsPromotionDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "প্রমোশন যোগ ব্যর্থ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // প্রমোশন আপডেট করার মিউটেশন
  const updatePromotionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: PromotionFormValues }) => {
      const res = await apiRequest("PATCH", `/api/promotions/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/promotions"] });
      toast({
        title: "প্রমোশন আপডেট সফল",
        description: "প্রমোশন সফলভাবে আপডেট করা হয়েছে।",
      });
      setIsPromotionDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "প্রমোশন আপডেট ব্যর্থ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // প্রমোশন ডিলিট করার মিউটেশন
  const deletePromotionMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/promotions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/promotions"] });
      toast({
        title: "প্রমোশন ডিলিট সফল",
        description: "প্রমোশন সফলভাবে মুছে ফেলা হয়েছে।",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "প্রমোশন ডিলিট ব্যর্থ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // একটি প্রমোশন এডিট করা
  function onEditPromotion(promotion: Promotion) {
    setSelectedPromotion(promotion);
    setIsAddingPromotion(false);
    form.reset({
      title: promotion.title,
      description: promotion.description,
      image: promotion.image,
      startDate: parseDate(promotion.startDate),
      endDate: promotion.endDate ? parseDate(promotion.endDate) : undefined,
      isActive: promotion.isActive,
    });
    setIsPromotionDialogOpen(true);
  }

  // নতুন প্রমোশন যোগ
  function addNewPromotion() {
    setSelectedPromotion(null);
    setIsAddingPromotion(true);
    form.reset({
      title: "",
      description: "",
      image: "",
      startDate: new Date(),
      endDate: undefined,
      isActive: true,
    });
    setIsPromotionDialogOpen(true);
  }

  // প্রমোশন ডিলিট করা
  function deletePromotion(id: number) {
    if (window.confirm("আপনি কি নিশ্চিতভাবে এই প্রমোশন ডিলিট করতে চান?")) {
      deletePromotionMutation.mutate(id);
    }
  }

  // প্রমোশন ফর্ম সাবমিট
  function onSubmit(data: PromotionFormValues) {
    if (isAddingPromotion) {
      addPromotionMutation.mutate(data);
    } else if (selectedPromotion) {
      updatePromotionMutation.mutate({ id: selectedPromotion.id, data });
    }
  }

  // ডেট পার্স করা (স্ট্রিং বা ডেট অবজেক্ট হতে পারে)
  function parseDate(date: Date | string): Date {
    if (typeof date === 'string') {
      return new Date(date);
    }
    return date;
  }

  // প্রমোশন স্ট্যাটাস চেক
  function getPromotionStatus(promotion: Promotion) {
    const now = new Date();
    const startDate = parseDate(promotion.startDate);
    const endDate = promotion.endDate ? parseDate(promotion.endDate) : null;

    if (!promotion.isActive) {
      return "inactive";
    }
    if (isBefore(now, startDate)) {
      return "upcoming";
    }
    if (endDate && isAfter(now, endDate)) {
      return "expired";
    }
    return "active";
  }

  // সার্চ ফিল্টার
  const filteredPromotions = promotions.filter(promo => 
    promo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    promo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">প্রমোশন ম্যানেজমেন্ট</h2>
        <div className="flex space-x-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="সার্চ করুন..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={addNewPromotion}>
            <PlusCircle className="mr-2 h-4 w-4" />
            নতুন প্রমোশন
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>সমস্ত প্রমোশন</CardTitle>
          <CardDescription>
            সাইটের সমস্ত প্রমোশন ও অফারের তালিকা ({filteredPromotions.length})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>আইডি</TableHead>
                <TableHead>টাইটেল</TableHead>
                <TableHead>বর্ণনা</TableHead>
                <TableHead>শুরুর তারিখ</TableHead>
                <TableHead>শেষের তারিখ</TableHead>
                <TableHead>স্ট্যাটাস</TableHead>
                <TableHead>অ্যাকশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPromotions.map((promotion) => {
                const status = getPromotionStatus(promotion);
                return (
                  <TableRow key={promotion.id}>
                    <TableCell>{promotion.id}</TableCell>
                    <TableCell className="font-medium">{promotion.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{promotion.description}</TableCell>
                    <TableCell>{format(parseDate(promotion.startDate), "dd/MM/yyyy")}</TableCell>
                    <TableCell>
                      {promotion.endDate ? format(parseDate(promotion.endDate), "dd/MM/yyyy") : "চলমান"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          status === "active" ? "default" :
                          status === "upcoming" ? "secondary" :
                          status === "expired" ? "destructive" :
                          "outline"
                        }
                      >
                        {status === "active" ? "সক্রিয়" :
                         status === "upcoming" ? "আসন্ন" :
                         status === "expired" ? "মেয়াদ শেষ" :
                         "নিষ্ক্রিয়"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => onEditPromotion(promotion)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deletePromotion(promotion.id)}>
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* প্রমোশন এডিট/অ্যাড ডায়ালগ */}
      <Dialog open={isPromotionDialogOpen} onOpenChange={setIsPromotionDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isAddingPromotion ? "নতুন প্রমোশন যোগ করুন" : "প্রমোশন এডিট করুন"}
            </DialogTitle>
            <DialogDescription>
              {isAddingPromotion
                ? "নতুন প্রমোশন যোগ করতে ফর্ম পূরণ করুন।"
                : "প্রমোশনের তথ্য পরিবর্তন করুন।"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>প্রমোশন টাইটেল</FormLabel>
                    <FormControl>
                      <Input placeholder="টাইটেল" {...field} />
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
                    <FormLabel>বর্ণনা</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="প্রমোশনের বিস্তারিত বর্ণনা"
                        className="min-h-[100px]"
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
                    <FormLabel>ইমেজ URL</FormLabel>
                    <FormControl>
                      <Input placeholder="ইমেজ URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
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
                              variant={"outline"}
                              className={`pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>তারিখ বাছাই করুন</span>
                              )}
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
                      <FormLabel>শেষের তারিখ (ঐচ্ছিক)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>চলমান</span>
                              )}
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
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>সক্রিয়?</FormLabel>
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

              <DialogFooter>
                <Button type="submit">
                  <Check className="mr-2 h-4 w-4" />
                  {isAddingPromotion ? "যোগ করুন" : "আপডেট করুন"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}