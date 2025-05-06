import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileMenu from "@/components/layout/mobile-menu";
import MobileNav from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Play, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";

type SlotGame = {
  id: number;
  name: string;
  image: string;
  provider: string;
  rtp: string;
  isPopular: boolean | null;
  isFeatured: boolean | null;
  badgeType: string | null;
  badgeText: string | null;
};

export default function SlotsPage() {
  const { user, logoutMutation } = useAuth();
  const [activeCategory, setActiveCategory] = useState("সব");
  const [searchTerm, setSearchTerm] = useState("");

  // API থেকে স্লট গেম ডাটা লোড করি
  const { 
    data: games = [], 
    isLoading: loading 
  } = useQuery({ 
    queryKey: ['/api/slots'],
    staleTime: 60 * 1000, // ১ মিনিট
  });

  // জনপ্রিয় স্লট গেম লোড করি
  const { 
    data: popularGames = [] 
  } = useQuery({ 
    queryKey: ['/api/slots/popular'],
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
    "জনপ্রিয়",
    "নতুন",
    "জ্যাকপট",
    "ফল",
    "মিশরীয়",
    "চীনা",
    "মিষ্টি",
    "এডভেঞ্চার",
  ];

  // গেমগুলি ফিল্টার করা (ক্যাটাগরি এবং সার্চ টার্ম অনুযায়ী)
  const filteredGames = games
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
      } else if (activeCategory === "নতুন") {
        return game.badgeText === "নিউ" || game.badgeText === "নতুন";
      } else if (activeCategory === "জ্যাকপট") {
        return game.badgeText === "জ্যাকপট";
      }
      
      // অন্যান্য ক্যাটাগরি ফিল্টার বাস্তবায়ন করা হবে
      return true;
    });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isLoggedIn={!!user} onLogout={handleLogout} />
      <MobileMenu />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-white font-header flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-accent mr-2 h-6 w-6">
                  <path d="M21.721 12.752a9.711 9.711 0 00-.945-5.003 12.754 12.754 0 01-4.339 2.708 18.991 18.991 0 01-.214 4.772 17.165 17.165 0 005.498-2.477zM14.634 15.55a17.324 17.324 0 00.332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 00.332 4.647 17.385 17.385 0 005.268 0zM9.772 17.119a18.963 18.963 0 004.456 0A17.182 17.182 0 0112 21.724a17.18 17.18 0 01-2.228-4.605zM7.777 15.23a18.87 18.87 0 01-.214-4.774 12.753 12.753 0 01-4.34-2.708 9.711 9.711 0 00-.944 5.004 17.165 17.165 0 005.498 2.477zM21.356 14.752a9.765 9.765 0 01-7.478 6.817 18.64 18.64 0 001.988-4.718 18.627 18.627 0 005.49-2.098zM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 001.988 4.718 9.765 9.765 0 01-7.478-6.816zM13.878 2.43a9.755 9.755 0 016.116 3.986 11.267 11.267 0 01-3.746 2.504 18.63 18.63 0 00-2.37-6.49zM12 2.276a17.152 17.152 0 012.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0112 2.276zM10.122 2.43a18.629 18.629 0 00-2.37 6.49 11.266 11.266 0 01-3.746-2.504 9.754 9.754 0 016.116-3.985z" />
                </svg>
                স্লট গেমস
              </h1>
              
              <div className="w-full sm:w-auto flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Input
                    placeholder="গেম খুঁজুন..."
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
                    সর্বাধিক জনপ্রিয়
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-accent text-accent hover:bg-accent hover:text-background"
                    onClick={handleNewClick}
                  >
                    নতুন গেমস
                  </Button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto pb-2 custom-scrollbar">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(12)].map((_, index) => (
                  <div key={index} className="bg-card rounded-lg overflow-hidden shadow-lg animate-pulse">
                    <div className="w-full h-36 bg-muted"></div>
                    <div className="p-3">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredGames.map((game) => (
                  <div key={game.id} className="game-card bg-card rounded-lg overflow-hidden shadow-lg">
                    <div className="relative">
                      <img src={game.image} alt={game.name} className="w-full h-36 object-cover" />
                      {game.badgeText && (
                        <div className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded-full ${
                          game.badgeType === "highlight" ? "bg-[#ff4757]" : 
                          game.badgeType === "accent" ? "bg-accent text-secondary" :
                          "bg-blue-500"
                        }`}>
                          {game.badgeText}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition duration-300">
                        <Button className="bg-accent text-secondary px-5 py-2 rounded-full hover:bg-accent/90 flex items-center">
                          <Play className="h-4 w-4 mr-2" />
                          খেলুন
                        </Button>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-white font-medium text-sm font-accent truncate">{game.name}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-muted-foreground text-xs">{game.provider}</span>
                        <span className="text-accent text-xs font-semibold">RTP: {game.rtp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}