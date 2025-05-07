import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileMenu from "@/components/layout/mobile-menu";
import MobileNav from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Play, Search } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";

type LiveCasinoGame = {
  id: number;
  name: string;
  image: string;
  players: string | null;
  provider: string;
  category: string;
  isPopular: boolean | null;
  isFeatured: boolean | null;
  badgeType: string | null;
  badgeText: string | null;
};

export default function LiveCasinoPage() {
  const { user, logoutMutation } = useAuth();
  const [activeCategory, setActiveCategory] = useState("সব");
  const [searchTerm, setSearchTerm] = useState("");
  
  // লাইভ ক্যাসিনো গেম লোড করার জন্য API কল
  const { 
    data: games = [], 
    isLoading: loading 
  } = useQuery({ 
    queryKey: ['/api/live-casino'],
    staleTime: 60 * 1000, // ১ মিনিট
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const handlePopularClick = () => {
    setActiveCategory("জনপ্রিয়");
  };

  const handleNewClick = () => {
    setActiveCategory("নতুন");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const categories = [
    "সব",
    "রুলেট",
    "কার্ড",
    "পোকার",
    "বাকারাত",
    "সেলিব্রিটি",
    "VIP",
  ];

  // গেমগুলি ফিল্টার করা (ক্যাটাগরি এবং সার্চ টার্ম অনুযায়ী)
  const filteredGames = Array.isArray(games) ? games
    .filter(game => {
      // সার্চ টার্ম দিয়ে ফিল্টার
      if (searchTerm && !game.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // ক্যাটাগরি দিয়ে ফিল্টার
      if (activeCategory === "সব") {
        return true;
      } else if (activeCategory === "জনপ্রিয়") {
        return game.isPopular === true;
      } else if (activeCategory === "VIP") {
        return game.badgeText === "VIP";
      } else if (activeCategory === "নতুন") {
        return game.badgeText === "নিউ" || game.badgeText === "নতুন";
      } else {
        return game.category === activeCategory;
      }
    }) : [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isLoggedIn={!!user} onLogout={handleLogout} />
      <MobileMenu />
      
      <main className="flex-grow">
        {/* Hero Banner */}
        <div className="w-full bg-gradient-to-r from-card via-cyan-900 to-card py-12 px-4">
          <div className="container mx-auto">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold text-white font-header mb-3">
                লাইভ ক্যাসিনো <span className="text-accent">অভিজ্ঞতা</span>
              </h1>
              <p className="text-muted-foreground mb-6">
                আসল ডিলার এবং প্লেয়ারদের সাথে লাইভ ক্যাসিনো গেমস খেলুন। আমাদের HD স্ট্রিমিং সিস্টেম আপনাকে দিবে বাস্তব ক্যাসিনোর মত অনুভূতি৷
              </p>
              <div className="flex gap-4">
                <Button className="bg-accent text-secondary hover:bg-accent/90">
                  গেমস দেখুন
                </Button>
                <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-background">
                  বিস্তারিত জানুন
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-white font-header flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-accent mr-2 h-6 w-6">
                <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
              </svg>
              লাইভ ক্যাসিনো গেমস
            </h2>
            <div className="w-full sm:w-auto flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Input
                  placeholder="টেবিল খুঁজুন..."
                  className="pl-9 w-full sm:w-[200px] bg-card border-accent/50 rounded-full"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-accent text-accent hover:bg-accent hover:text-background"
                  onClick={handlePopularClick}
                >
                  জনপ্রিয়
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-accent text-accent hover:bg-accent hover:text-background"
                  onClick={handleNewClick}
                >
                  নতুন টেবিল
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto pb-4 custom-scrollbar">
            <div className="flex space-x-4">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 whitespace-nowrap text-sm font-medium transition-all ${
                    activeCategory === category
                      ? "text-accent border-b-2 border-accent"
                      : "text-muted-foreground hover:text-white"
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-card rounded-lg overflow-hidden shadow-lg animate-pulse">
                  <div className="w-full h-48 bg-muted"></div>
                  <div className="p-4">
                    <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
              {filteredGames.map((game) => (
                <div key={game.id} className="game-card bg-card rounded-lg overflow-hidden shadow-lg">
                  <div className="relative">
                    <img src={game.image} alt={game.name} className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition duration-300">
                      <Button className="bg-accent text-secondary px-5 py-2 rounded-full hover:bg-accent/90 flex items-center">
                        <Play className="h-4 w-4 mr-2" />
                        লাইভ খেলুন
                      </Button>
                    </div>
                    {game.badgeText && (
                      <div className={`absolute top-3 left-3 text-white text-xs px-2 py-1 rounded-full ${
                        game.badgeType === "highlight" ? "bg-[#ff4757]" : 
                        game.badgeType === "accent" ? "bg-accent text-secondary" :
                        "bg-blue-500"
                      }`}>
                        {game.badgeText}
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-accent text-sm bg-black bg-opacity-70 px-2 py-1 rounded">
                          {game.players || "লাইভ টেবিল"}
                        </span>
                        <span className="text-white bg-accent text-xs font-semibold px-2 py-1 rounded">
                          লাইভ
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-medium text-lg font-accent mb-1">{game.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">{game.provider}</span>
                      <span className="text-accent text-sm font-semibold">{game.category}</span>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-accent hover:text-accent/80 p-0 h-auto"
                      >
                        বিস্তারিত দেখুন
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="bg-accent hover:bg-accent/90 text-white"
                      >
                        খেলুন
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 mb-8">
            <div className="bg-card p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white font-header mb-4">লাইভ ক্যাসিনো সম্পর্কে</h3>
              <p className="text-muted-foreground mb-4">
                আমাদের লাইভ ক্যাসিনো পেশাদার ডিলার এবং আধুনিক প্রযুক্তির মাধ্যমে আপনাকে একটি বাস্তব ক্যাসিনো অভিজ্ঞতা প্রদান করে। HD ক্যামেরা, বিশেষ লাইটিং এবং উন্নত স্ট্রিমিং সিস্টেম ব্যবহার করে আপনি ঘরে বসে আসল ক্যাসিনোর অনুভূতি পেতে পারেন।
              </p>
              <p className="text-muted-foreground">
                আমাদের সমস্ত লাইভ ক্যাসিনো গেম প্রতিদিন ২৪ ঘণ্টা উপলভ্য থাকে। আপনি যেকোনো সময় প্রবেশ করতে পারেন এবং বিভিন্ন স্টেক সীমার টেবিলে খেলতে পারেন। আমরা প্রমোশনাল অফার এবং ক্যাশব্যাকও প্রদান করি।
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}