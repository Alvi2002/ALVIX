import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SlotGame, LiveCasinoGame, SportMatch } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  CardFooter
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
import { Pencil, MoreVertical, Search, Check, X, PlusCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// স্লট গেম যোগ/আপডেট করার স্কিমা
const slotGameSchema = z.object({
  name: z.string().min(2, "গেমের নাম দিন"),
  provider: z.string().min(2, "প্রভাইডারের নাম দিন"),
  image: z.string().min(2, "ইমেজ URL দিন"),
  rtp: z.string().min(2, "RTP দিন"),
  isPopular: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  badgeType: z.string().optional(),
  badgeText: z.string().optional(),
});

// লাইভ ক্যাসিনো গেম যোগ/আপডেট করার স্কিমা
const liveCasinoGameSchema = z.object({
  name: z.string().min(2, "গেমের নাম দিন"),
  provider: z.string().min(2, "প্রভাইডারের নাম দিন"),
  image: z.string().min(2, "ইমেজ URL দিন"),
  category: z.string().min(2, "ক্যাটাগরি দিন"),
  players: z.string().optional(),
  isPopular: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  badgeType: z.string().optional(),
  badgeText: z.string().optional(),
});

// স্পোর্টস ম্যাচ যোগ/আপডেট করার স্কিমা
const sportMatchSchema = z.object({
  homeTeam: z.string().min(2, "হোম টিম দিন"),
  awayTeam: z.string().min(2, "অ্যাওয়ে টিম দিন"),
  league: z.string().min(2, "লিগ দিন"),
  date: z.string().min(2, "তারিখ দিন"),
  time: z.string().min(2, "সময় দিন"),
  isLive: z.boolean().default(false),
  odds: z.any().optional(),
});

type SlotGameFormValues = z.infer<typeof slotGameSchema>;
type LiveCasinoGameFormValues = z.infer<typeof liveCasinoGameSchema>;
type SportMatchFormValues = z.infer<typeof sportMatchSchema>;

export default function GamesPanel() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("slots");
  const [searchQuery, setSearchQuery] = useState("");
  
  // স্লট গেম স্টেট
  const [selectedSlotGame, setSelectedSlotGame] = useState<SlotGame | null>(null);
  const [isSlotGameDialogOpen, setIsSlotGameDialogOpen] = useState(false);
  const [isAddingSlotGame, setIsAddingSlotGame] = useState(false);
  
  // লাইভ ক্যাসিনো গেম স্টেট
  const [selectedLiveCasinoGame, setSelectedLiveCasinoGame] = useState<LiveCasinoGame | null>(null);
  const [isLiveCasinoGameDialogOpen, setIsLiveCasinoGameDialogOpen] = useState(false);
  const [isAddingLiveCasinoGame, setIsAddingLiveCasinoGame] = useState(false);
  
  // স্পোর্টস ম্যাচ স্টেট
  const [selectedSportMatch, setSelectedSportMatch] = useState<SportMatch | null>(null);
  const [isSportMatchDialogOpen, setIsSportMatchDialogOpen] = useState(false);
  const [isAddingSportMatch, setIsAddingSportMatch] = useState(false);

  // স্লট গেম ফর্ম
  const slotGameForm = useForm<SlotGameFormValues>({
    resolver: zodResolver(slotGameSchema),
    defaultValues: {
      name: "",
      provider: "",
      image: "",
      rtp: "0",
      isPopular: false,
      isFeatured: false,
      badgeType: "",
      badgeText: "",
    },
  });

  // লাইভ ক্যাসিনো গেম ফর্ম
  const liveCasinoGameForm = useForm<LiveCasinoGameFormValues>({
    resolver: zodResolver(liveCasinoGameSchema),
    defaultValues: {
      name: "",
      provider: "",
      image: "",
      category: "",
      players: "",
      isPopular: false,
      isFeatured: false,
      badgeType: "",
      badgeText: "",
    },
  });

  // স্পোর্টস ম্যাচ ফর্ম
  const sportMatchForm = useForm<SportMatchFormValues>({
    resolver: zodResolver(sportMatchSchema),
    defaultValues: {
      homeTeam: "",
      awayTeam: "",
      league: "",
      date: "",
      time: "",
      isLive: false,
      odds: { home: 1.5, draw: 3.5, away: 4.5 }
    },
  });

  // স্লট গেম লোড করা
  const { data: slotGames = [], isLoading: isLoadingSlotGames } = useQuery<SlotGame[]>({
    queryKey: ["/api/slots"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/slots");
        return await res.json();
      } catch (error) {
        console.error("স্লট গেম লোড করতে সমস্যা হয়েছে:", error);
        return [];
      }
    },
  });

  // লাইভ ক্যাসিনো গেম লোড করা
  const { data: liveCasinoGames = [], isLoading: isLoadingLiveCasinoGames } = useQuery<LiveCasinoGame[]>({
    queryKey: ["/api/live-casino"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/live-casino");
        return await res.json();
      } catch (error) {
        console.error("লাইভ ক্যাসিনো গেম লোড করতে সমস্যা হয়েছে:", error);
        return [];
      }
    },
  });

  // স্পোর্টস ম্যাচ লোড করা
  const { data: sportMatches = [], isLoading: isLoadingSportMatches } = useQuery<SportMatch[]>({
    queryKey: ["/api/sports"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/sports");
        return await res.json();
      } catch (error) {
        console.error("স্পোর্টস ম্যাচ লোড করতে সমস্যা হয়েছে:", error);
        return [];
      }
    },
  });

  // স্লট গেম যোগ করার মিউটেশন
  const addSlotGameMutation = useMutation({
    mutationFn: async (data: SlotGameFormValues) => {
      const res = await apiRequest("POST", "/api/slots", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/slots"] });
      toast({
        title: "গেম যোগ সফল",
        description: "স্লট গেম সফলভাবে যোগ করা হয়েছে।",
      });
      setIsSlotGameDialogOpen(false);
      slotGameForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "গেম যোগ ব্যর্থ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // স্লট গেম আপডেট করার মিউটেশন
  const updateSlotGameMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: SlotGameFormValues }) => {
      const res = await apiRequest("PATCH", `/api/slots/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/slots"] });
      toast({
        title: "গেম আপডেট সফল",
        description: "স্লট গেম সফলভাবে আপডেট করা হয়েছে।",
      });
      setIsSlotGameDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "গেম আপডেট ব্যর্থ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // লাইভ ক্যাসিনো গেম যোগ করার মিউটেশন
  const addLiveCasinoGameMutation = useMutation({
    mutationFn: async (data: LiveCasinoGameFormValues) => {
      const res = await apiRequest("POST", "/api/live-casino", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/live-casino"] });
      toast({
        title: "গেম যোগ সফল",
        description: "লাইভ ক্যাসিনো গেম সফলভাবে যোগ করা হয়েছে।",
      });
      setIsLiveCasinoGameDialogOpen(false);
      liveCasinoGameForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "গেম যোগ ব্যর্থ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // স্পোর্টস ম্যাচ যোগ করার মিউটেশন
  const addSportMatchMutation = useMutation({
    mutationFn: async (data: SportMatchFormValues) => {
      const res = await apiRequest("POST", "/api/sports", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sports"] });
      toast({
        title: "ম্যাচ যোগ সফল",
        description: "স্পোর্টস ম্যাচ সফলভাবে যোগ করা হয়েছে।",
      });
      setIsSportMatchDialogOpen(false);
      sportMatchForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "ম্যাচ যোগ ব্যর্থ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // একটি স্লট গেম এডিট করা
  function onEditSlotGame(game: SlotGame) {
    setSelectedSlotGame(game);
    setIsAddingSlotGame(false);
    slotGameForm.reset({
      name: game.name,
      provider: game.provider,
      image: game.image,
      rtp: game.rtp,
      isPopular: Boolean(game.isPopular),
      isFeatured: Boolean(game.isFeatured),
      badgeType: game.badgeType || "",
      badgeText: game.badgeText || "",
    });
    setIsSlotGameDialogOpen(true);
  }

  // একটি লাইভ ক্যাসিনো গেম এডিট করা
  function onEditLiveCasinoGame(game: LiveCasinoGame) {
    setSelectedLiveCasinoGame(game);
    setIsAddingLiveCasinoGame(false);
    liveCasinoGameForm.reset({
      name: game.name,
      provider: game.provider,
      image: game.image,
      category: game.category,
      players: game.players || "",
      isPopular: Boolean(game.isPopular),
      isFeatured: Boolean(game.isFeatured),
      badgeType: game.badgeType || "",
      badgeText: game.badgeText || "",
    });
    setIsLiveCasinoGameDialogOpen(true);
  }

  // একটি স্পোর্টস ম্যাচ এডিট করা
  function onEditSportMatch(match: SportMatch) {
    setSelectedSportMatch(match);
    setIsAddingSportMatch(false);
    sportMatchForm.reset({
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      league: match.league,
      date: match.date,
      time: match.time,
      isLive: Boolean(match.isLive),
      odds: match.odds
    });
    setIsSportMatchDialogOpen(true);
  }

  // স্লট গেম ফর্ম সাবমিট
  function onSubmitSlotGame(data: SlotGameFormValues) {
    if (isAddingSlotGame) {
      addSlotGameMutation.mutate(data);
    } else if (selectedSlotGame) {
      updateSlotGameMutation.mutate({ id: selectedSlotGame.id, data });
    }
  }

  // লাইভ ক্যাসিনো গেম ফর্ম সাবমিট
  function onSubmitLiveCasinoGame(data: LiveCasinoGameFormValues) {
    if (isAddingLiveCasinoGame) {
      addLiveCasinoGameMutation.mutate(data);
    } 
    // এখানে আপডেট মিউটেশন যোগ করা যেতে পারে
  }

  // স্পোর্টস ম্যাচ ফর্ম সাবমিট
  function onSubmitSportMatch(data: SportMatchFormValues) {
    if (isAddingSportMatch) {
      addSportMatchMutation.mutate(data);
    }
    // এখানে আপডেট মিউটেশন যোগ করা যেতে পারে
  }

  // নতুন স্লট গেম যোগ
  function addNewSlotGame() {
    setSelectedSlotGame(null);
    setIsAddingSlotGame(true);
    slotGameForm.reset({
      name: "",
      provider: "",
      image: "",
      rtp: "0",
      isPopular: false,
      isFeatured: false,
      badgeType: "",
      badgeText: "",
    });
    setIsSlotGameDialogOpen(true);
  }

  // নতুন লাইভ ক্যাসিনো গেম যোগ
  function addNewLiveCasinoGame() {
    setSelectedLiveCasinoGame(null);
    setIsAddingLiveCasinoGame(true);
    liveCasinoGameForm.reset({
      name: "",
      provider: "",
      image: "",
      category: "",
      players: "",
      isPopular: false,
      isFeatured: false,
      badgeType: "",
      badgeText: "",
    });
    setIsLiveCasinoGameDialogOpen(true);
  }

  // নতুন স্পোর্টস ম্যাচ যোগ
  function addNewSportMatch() {
    setSelectedSportMatch(null);
    setIsAddingSportMatch(true);
    sportMatchForm.reset({
      homeTeam: "",
      awayTeam: "",
      league: "",
      date: "",
      time: "",
      isLive: false,
      odds: { home: 1.5, draw: 3.5, away: 4.5 }
    });
    setIsSportMatchDialogOpen(true);
  }

  // সার্চ ফিল্টার ফাংশন - ট্যাব অনুযায়ী অন্য অন্য টেবিলের জন্য
  const filteredSlotGames = slotGames.filter(game => 
    game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLiveCasinoGames = liveCasinoGames.filter(game => 
    game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSportMatches = sportMatches.filter(match => 
    match.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.league.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">গেম ম্যানেজমেন্ট</h2>
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

      <Tabs defaultValue="slots" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="slots">স্লট গেমস</TabsTrigger>
          <TabsTrigger value="live-casino">লাইভ ক্যাসিনো</TabsTrigger>
          <TabsTrigger value="sports">স্পোর্টস</TabsTrigger>
        </TabsList>

        {/* স্লট গেমস ট্যাব */}
        <TabsContent value="slots">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>স্লট গেমস</CardTitle>
                <CardDescription>
                  সাইটে উপলব্ধ সকল স্লট গেমস ({filteredSlotGames.length})
                </CardDescription>
              </div>
              <Button onClick={addNewSlotGame}>
                <PlusCircle className="mr-2 h-4 w-4" />
                নতুন যোগ করুন
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>আইডি</TableHead>
                    <TableHead>নাম</TableHead>
                    <TableHead>প্রভাইডার</TableHead>
                    <TableHead>RTP</TableHead>
                    <TableHead>স্ট্যাটাস</TableHead>
                    <TableHead>অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSlotGames.map((game) => (
                    <TableRow key={game.id}>
                      <TableCell>{game.id}</TableCell>
                      <TableCell className="font-medium">{game.name}</TableCell>
                      <TableCell>{game.provider}</TableCell>
                      <TableCell>{game.rtp}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {game.isPopular && <Badge>জনপ্রিয়</Badge>}
                          {game.isFeatured && <Badge variant="secondary">ফিচারড</Badge>}
                          {game.badgeText && <Badge variant="outline">{game.badgeText}</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => onEditSlotGame(game)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* লাইভ ক্যাসিনো ট্যাব */}
        <TabsContent value="live-casino">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>লাইভ ক্যাসিনো গেমস</CardTitle>
                <CardDescription>
                  সাইটে উপলব্ধ সকল লাইভ ক্যাসিনো গেমস ({filteredLiveCasinoGames.length})
                </CardDescription>
              </div>
              <Button onClick={addNewLiveCasinoGame}>
                <PlusCircle className="mr-2 h-4 w-4" />
                নতুন যোগ করুন
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>আইডি</TableHead>
                    <TableHead>নাম</TableHead>
                    <TableHead>প্রভাইডার</TableHead>
                    <TableHead>ক্যাটাগরি</TableHead>
                    <TableHead>প্লেয়ার্স</TableHead>
                    <TableHead>স্ট্যাটাস</TableHead>
                    <TableHead>অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLiveCasinoGames.map((game) => (
                    <TableRow key={game.id}>
                      <TableCell>{game.id}</TableCell>
                      <TableCell className="font-medium">{game.name}</TableCell>
                      <TableCell>{game.provider}</TableCell>
                      <TableCell>{game.category}</TableCell>
                      <TableCell>{game.players || "-"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {game.isPopular && <Badge>জনপ্রিয়</Badge>}
                          {game.isFeatured && <Badge variant="secondary">ফিচারড</Badge>}
                          {game.badgeText && <Badge variant="outline">{game.badgeText}</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => onEditLiveCasinoGame(game)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* স্পোর্টস ট্যাব */}
        <TabsContent value="sports">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>স্পোর্টস ম্যাচ</CardTitle>
                <CardDescription>
                  সকল স্পোর্টস ম্যাচ ({filteredSportMatches.length})
                </CardDescription>
              </div>
              <Button onClick={addNewSportMatch}>
                <PlusCircle className="mr-2 h-4 w-4" />
                নতুন যোগ করুন
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>আইডি</TableHead>
                    <TableHead>ম্যাচ</TableHead>
                    <TableHead>লিগ</TableHead>
                    <TableHead>তারিখ</TableHead>
                    <TableHead>সময়</TableHead>
                    <TableHead>স্ট্যাটাস</TableHead>
                    <TableHead>অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSportMatches.map((match) => (
                    <TableRow key={match.id}>
                      <TableCell>{match.id}</TableCell>
                      <TableCell className="font-medium">
                        {match.homeTeam} vs {match.awayTeam}
                      </TableCell>
                      <TableCell>{match.league}</TableCell>
                      <TableCell>{match.date}</TableCell>
                      <TableCell>{match.time}</TableCell>
                      <TableCell>
                        {match.isLive ? (
                          <Badge variant="destructive">লাইভ</Badge>
                        ) : (
                          <Badge variant="outline">আপকামিং</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => onEditSportMatch(match)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* স্লট গেম এডিট/অ্যাড ডায়ালগ */}
      <Dialog open={isSlotGameDialogOpen} onOpenChange={setIsSlotGameDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isAddingSlotGame ? "নতুন স্লট গেম যোগ করুন" : "স্লট গেম এডিট করুন"}
            </DialogTitle>
            <DialogDescription>
              {isAddingSlotGame
                ? "নতুন স্লট গেম তৈরি করতে ফর্ম পূরণ করুন।"
                : "গেমের তথ্য পরিবর্তন করুন।"}
            </DialogDescription>
          </DialogHeader>
          <Form {...slotGameForm}>
            <form onSubmit={slotGameForm.handleSubmit(onSubmitSlotGame)} className="space-y-4">
              <FormField
                control={slotGameForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>গেমের নাম</FormLabel>
                    <FormControl>
                      <Input placeholder="গেমের নাম" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={slotGameForm.control}
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>প্রভাইডার</FormLabel>
                    <FormControl>
                      <Input placeholder="প্রভাইডার" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={slotGameForm.control}
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
              <FormField
                control={slotGameForm.control}
                name="rtp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RTP (Return to Player)</FormLabel>
                    <FormControl>
                      <Input placeholder="RTP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row space-x-8">
                <FormField
                  control={slotGameForm.control}
                  name="isPopular"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>জনপ্রিয়</FormLabel>
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
                  control={slotGameForm.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>ফিচারড</FormLabel>
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
              <div className="flex space-x-4">
                <FormField
                  control={slotGameForm.control}
                  name="badgeType"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>ব্যাজ টাইপ</FormLabel>
                      <FormControl>
                        <Input placeholder="ব্যাজ টাইপ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={slotGameForm.control}
                  name="badgeText"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>ব্যাজ টেক্সট</FormLabel>
                      <FormControl>
                        <Input placeholder="ব্যাজ টেক্সট" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit">
                  <Check className="mr-2 h-4 w-4" />
                  {isAddingSlotGame ? "যোগ করুন" : "আপডেট করুন"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* লাইভ ক্যাসিনো গেম এডিট/অ্যাড ডায়ালগ */}
      <Dialog open={isLiveCasinoGameDialogOpen} onOpenChange={setIsLiveCasinoGameDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isAddingLiveCasinoGame ? "নতুন লাইভ ক্যাসিনো গেম যোগ করুন" : "লাইভ ক্যাসিনো গেম এডিট করুন"}
            </DialogTitle>
            <DialogDescription>
              {isAddingLiveCasinoGame
                ? "নতুন লাইভ ক্যাসিনো গেম তৈরি করতে ফর্ম পূরণ করুন।"
                : "গেমের তথ্য পরিবর্তন করুন।"}
            </DialogDescription>
          </DialogHeader>
          <Form {...liveCasinoGameForm}>
            <form onSubmit={liveCasinoGameForm.handleSubmit(onSubmitLiveCasinoGame)} className="space-y-4">
              <FormField
                control={liveCasinoGameForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>গেমের নাম</FormLabel>
                    <FormControl>
                      <Input placeholder="গেমের নাম" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={liveCasinoGameForm.control}
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>প্রভাইডার</FormLabel>
                    <FormControl>
                      <Input placeholder="প্রভাইডার" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={liveCasinoGameForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ক্যাটাগরি</FormLabel>
                    <FormControl>
                      <Input placeholder="ক্যাটাগরি" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={liveCasinoGameForm.control}
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
              <FormField
                control={liveCasinoGameForm.control}
                name="players"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>প্লেয়ার্স</FormLabel>
                    <FormControl>
                      <Input placeholder="প্লেয়ার্স" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row space-x-8">
                <FormField
                  control={liveCasinoGameForm.control}
                  name="isPopular"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>জনপ্রিয়</FormLabel>
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
                  control={liveCasinoGameForm.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>ফিচারড</FormLabel>
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
                  {isAddingLiveCasinoGame ? "যোগ করুন" : "আপডেট করুন"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* স্পোর্টস ম্যাচ এডিট/অ্যাড ডায়ালগ */}
      <Dialog open={isSportMatchDialogOpen} onOpenChange={setIsSportMatchDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isAddingSportMatch ? "নতুন স্পোর্টস ম্যাচ যোগ করুন" : "স্পোর্টস ম্যাচ এডিট করুন"}
            </DialogTitle>
            <DialogDescription>
              {isAddingSportMatch
                ? "নতুন স্পোর্টস ম্যাচ তৈরি করতে ফর্ম পূরণ করুন।"
                : "ম্যাচের তথ্য পরিবর্তন করুন।"}
            </DialogDescription>
          </DialogHeader>
          <Form {...sportMatchForm}>
            <form onSubmit={sportMatchForm.handleSubmit(onSubmitSportMatch)} className="space-y-4">
              <FormField
                control={sportMatchForm.control}
                name="homeTeam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>হোম টিম</FormLabel>
                    <FormControl>
                      <Input placeholder="হোম টিম" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={sportMatchForm.control}
                name="awayTeam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>অ্যাওয়ে টিম</FormLabel>
                    <FormControl>
                      <Input placeholder="অ্যাওয়ে টিম" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={sportMatchForm.control}
                name="league"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>লিগ</FormLabel>
                    <FormControl>
                      <Input placeholder="লিগ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex space-x-4">
                <FormField
                  control={sportMatchForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>তারিখ</FormLabel>
                      <FormControl>
                        <Input placeholder="তারিখ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={sportMatchForm.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>সময়</FormLabel>
                      <FormControl>
                        <Input placeholder="সময়" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={sportMatchForm.control}
                name="isLive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>লাইভ ম্যাচ</FormLabel>
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
                  {isAddingSportMatch ? "যোগ করুন" : "আপডেট করুন"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}