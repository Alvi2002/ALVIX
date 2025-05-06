import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileMenu from "@/components/layout/mobile-menu";
import MobileNav from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useEffect, useState } from "react";

type SlotGame = {
  id: number;
  name: string;
  image: string;
  provider: string;
  rtp: string;
  badge: { text: string; type: "highlight" | "accent" | "blue" } | null;
};

export default function SlotsPage() {
  const { user, logoutMutation } = useAuth();
  const [games, setGames] = useState<SlotGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("সব");

  useEffect(() => {
    // এখানে অসল API কল করা হবে, এখন নমুনা ডাটা দেখাচ্ছি
    setTimeout(() => {
      setGames([
        {
          id: 1,
          name: "গোল্ডেন ড্রাগন",
          image: "https://images.unsplash.com/photo-1605870445919-838d190e8e1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
          provider: "প্রগমেটিক প্লে",
          rtp: "৯৮%",
          badge: { text: "হট", type: "highlight" },
        },
        {
          id: 2,
          name: "বুক অফ রা",
          image: "https://pixabay.com/get/g87e401b23aa0e5d7ced4cbf70e35f9f3c70c9dc2a293adab45c8dfb4f3e1dad9b4a92de8ae74f64be8b5c52cacc1e7b5_1280.jpg",
          provider: "নোভোমেটিক",
          rtp: "৯৬%",
          badge: { text: "জনপ্রিয়", type: "accent" },
        },
        {
          id: 3,
          name: "স্টারবার্স্ট",
          image: "https://pixabay.com/get/g91c0cb3f293af12c1b5a47b9ef9a3e0ee6a8fa5cdb2c7dfac06a0c64a9e4e8dd59a15aa38b0c5732b8a50a5fee9f1dbdc81fb7bdf21ea97fc1a49883b6c91b20_1280.jpg",
          provider: "নেটএন্ট",
          rtp: "৯৭%",
          badge: { text: "নতুন", type: "blue" },
        },
        {
          id: 4,
          name: "মেগা জ্যাকপট",
          image: "https://pixabay.com/get/g60e5eb3bc6f5075a2e4b0ed7d9f5c40e5b39f0d05cfeed18cd3e0f89c5e767e1e19d07e3bffa89fd7f58a58a52c61a5b_1280.jpg",
          provider: "মাইক্রোগেমিং",
          rtp: "৯৫%",
          badge: { text: "জ্যাকপট", type: "highlight" },
        },
        {
          id: 5,
          name: "বিগ ব্যাড উলফ",
          image: "https://pixabay.com/get/g0c8aaf6dc05ab0304b53ec27eba5e6c51af8a6f3e38e9a172a0f7aee7a2694ef21f7b32d2ae8d83bbbb6fed64b7a75dda6f0c06de0adb72f4cc8cd26f32d7d5d_1280.jpg",
          provider: "কুইকস্পিন",
          rtp: "৯৭.৪%",
          badge: null,
        },
        {
          id: 6,
          name: "ফ্রুট ফিভার",
          image: "https://pixabay.com/get/g9cbb24e0cc0caeed4ccfc37e27edc5dd4c8e74a0ac12db12d74c91f14e89d8d8a0a6e2387e6b92e1ba387ea2af53cd6c_1280.jpg",
          provider: "প্লেন্টি",
          rtp: "৯৬.৩%",
          badge: null,
        },
        {
          id: 7,
          name: "ড্রাগনস ফায়ার",
          image: "https://pixabay.com/get/gd06b9a0fa81a1ce53e98d7ff7dc1f0e6a56a21bdfe9fc5c0cde3d9ac61a1d7d72c88ba2cdeacd1ba9d583f2c47d40f4ad4e5f2e5b9ccafc93b39e83c16a3e85e_1280.jpg",
          provider: "পুশ গেমিং",
          rtp: "৯৬.৫%",
          badge: { text: "নতুন", type: "blue" },
        },
        {
          id: 8,
          name: "কানডি ড্রিমস",
          image: "https://pixabay.com/get/g57abad3ec6bbf69ea83fef28a63bdb04cc7a3c1ce27ec0d10c05ff3f3b3e1e61a12afdcd559daa1a9daf59fc0e1e9f4cb4bfc29a21c2b9de0c86fa11b67bf5e1_1280.jpg",
          provider: "হবান",
          rtp: "৯৫.৮%",
          badge: null,
        },
        {
          id: 9,
          name: "ম্যাজিক্যাল জঙ্গল",
          image: "https://pixabay.com/get/gd33d41dedd5a3a3d3c2f6db6b95aee1d0c1d67da4baba214ada77de304ba9f8f8841e9aad6ddf52d15b2774cd1fc73d3fc4e27ccc7e3f0c2ab70664c14037e66_1280.jpg",
          provider: "আইজুগি",
          rtp: "৯৬.৭%",
          badge: null,
        },
        {
          id: 10,
          name: "এজটেক প্রিন্স",
          image: "https://pixabay.com/get/gb42a60a6ebff18ee7d6b93b2bc80ab4b2b9b0a91f2fa3faa3db64f89b33e3e56e1c4c1ab14f3b5eda7c5dabbef81e11a9d89c0e7d63b7dc12a09f8dd18cecd00_1280.jpg",
          provider: "প্রেমেটিক",
          rtp: "৯৬.১%",
          badge: { text: "সুপার", type: "accent" },
        },
        {
          id: 11,
          name: "ড্রাগন কিংডম",
          image: "https://pixabay.com/get/g1ebbc151cb2b43a0d91ed5bf5dcb92b5c4ca37e1e2d2e5c50be3c64b0d73fcbf9ea2b4f28f07444cb2ca1d1389b9e1b1ea33e4d85775dbcf5f9fe6a5fb84d86a_1280.jpg",
          provider: "ড্রিম গেমিং",
          rtp: "৯৭.২%",
          badge: null,
        },
        {
          id: 12,
          name: "থান্ডার স্টার্স",
          image: "https://pixabay.com/get/g00d1e54ddef36c2e18b82b68e3be0a7d2a0af2de0a38c3de6cef3e06c4a5ab9ffced3ff38fdcebc6f4a83dc56dc05ffcbf94de0f8b68a37c23d1e4c29cdadbc3_1280.jpg",
          provider: "প্লে'এন'গো",
          rtp: "৯৬.৬%",
          badge: { text: "হট", type: "highlight" },
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleLogout = () => {
    logoutMutation.mutate();
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

  const filteredGames = activeCategory === "সব"
    ? games
    : activeCategory === "জনপ্রিয়"
      ? games.filter(game => game.badge?.text === "জনপ্রিয়" || game.badge?.text === "হট")
      : activeCategory === "নতুন"
        ? games.filter(game => game.badge?.text === "নতুন")
        : activeCategory === "জ্যাকপট"
          ? games.filter(game => game.badge?.text === "জ্যাকপট")
          : games;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isLoggedIn={!!user} onLogout={handleLogout} />
      <MobileMenu />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white font-header flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-accent mr-2 h-6 w-6">
                  <path d="M21.721 12.752a9.711 9.711 0 00-.945-5.003 12.754 12.754 0 01-4.339 2.708 18.991 18.991 0 01-.214 4.772 17.165 17.165 0 005.498-2.477zM14.634 15.55a17.324 17.324 0 00.332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 00.332 4.647 17.385 17.385 0 005.268 0zM9.772 17.119a18.963 18.963 0 004.456 0A17.182 17.182 0 0112 21.724a17.18 17.18 0 01-2.228-4.605zM7.777 15.23a18.87 18.87 0 01-.214-4.774 12.753 12.753 0 01-4.34-2.708 9.711 9.711 0 00-.944 5.004 17.165 17.165 0 005.498 2.477zM21.356 14.752a9.765 9.765 0 01-7.478 6.817 18.64 18.64 0 001.988-4.718 18.627 18.627 0 005.49-2.098zM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 001.988 4.718 9.765 9.765 0 01-7.478-6.816zM13.878 2.43a9.755 9.755 0 016.116 3.986 11.267 11.267 0 01-3.746 2.504 18.63 18.63 0 00-2.37-6.49zM12 2.276a17.152 17.152 0 012.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0112 2.276zM10.122 2.43a18.629 18.629 0 00-2.37 6.49 11.266 11.266 0 01-3.746-2.504 9.754 9.754 0 016.116-3.985z" />
                </svg>
                স্লট গেমস
              </h1>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-background">
                  সর্বাধিক জনপ্রিয়
                </Button>
                <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-background">
                  নতুন গেমস
                </Button>
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
                      {game.badge && (
                        <div className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded-full ${
                          game.badge.type === "highlight" ? "bg-[#ff4757]" : 
                          game.badge.type === "accent" ? "bg-accent text-secondary" :
                          "bg-blue-500"
                        }`}>
                          {game.badge.text}
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