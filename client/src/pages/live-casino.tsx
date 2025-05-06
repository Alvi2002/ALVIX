import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileMenu from "@/components/layout/mobile-menu";
import MobileNav from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useEffect, useState } from "react";

type LiveCasinoGame = {
  id: number;
  name: string;
  image: string;
  players: string;
  provider: string;
  category: string;
  badge: { text: string; type: "highlight" | "accent" | "blue" } | null;
};

export default function LiveCasinoPage() {
  const { user, logoutMutation } = useAuth();
  const [games, setGames] = useState<LiveCasinoGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("সব");

  useEffect(() => {
    // এখানে অসল API কল করা হবে, এখন নমুনা ডাটা দেখাচ্ছি
    setTimeout(() => {
      setGames([
        {
          id: 1,
          name: "লাইভ রুলেট",
          image: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          players: "১০০+ প্লেয়ার",
          provider: "এভোলুশন",
          category: "রুলেট",
          badge: { text: "জনপ্রিয়", type: "highlight" },
        },
        {
          id: 2,
          name: "ব্ল্যাকজ্যাক",
          image: "https://pixabay.com/get/g7033623a2b3d2510f315f6ad7b55ce8c57f72231fe7a776c4bf29c38234ac393446b538684087e4e77955455737b8e35559d9a29527f9dd95e08d63713da9720_1280.jpg",
          players: "৫০+ প্লেয়ার",
          provider: "প্রাগমেটিক",
          category: "কার্ড",
          badge: { text: "হট", type: "highlight" },
        },
        {
          id: 3,
          name: "টেক্সাস হোল্ডেম",
          image: "https://images.unsplash.com/photo-1505247964246-1f0a90443c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          players: "২৫+ টেবিল",
          provider: "এজিবিটি",
          category: "পোকার",
          badge: { text: "টুর্নামেন্ট", type: "accent" },
        },
        {
          id: 4,
          name: "বাকারাত",
          image: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          players: "৩০+ প্লেয়ার",
          provider: "এভোলুশন",
          category: "কার্ড",
          badge: null,
        },
        {
          id: 5,
          name: "ড্রাগন টাইগার",
          image: "https://pixabay.com/get/gc19ec2ec17a6ef9cfe2ebd7bcc0267c2ffce3e865a2cd4bc8a4a17b8c7c7c2f42883df8683cf1ad5723398db0e2bfeeac932d3b752bc90aebbcc5cdf6c5d33d4_1280.jpg",
          players: "৪০+ প্লেয়ার",
          provider: "এভোলুশন",
          category: "কার্ড",
          badge: { text: "নতুন", type: "blue" },
        },
        {
          id: 6,
          name: "ক্ষতিপূরণ রুলেট",
          image: "https://pixabay.com/get/g82f54f2aa4effa8d8b99ad3577f2d6da9e3d0d6bb84ba7b2e3ddc3ad3d9d00bae38e22e5b9dcae8b1f7a8b257c4c4ddab74de8a1e9c89ac9a5fbff8a04d5e46c_1280.jpg",
          players: "৬০+ প্লেয়ার",
          provider: "প্লেটেক",
          category: "রুলেট",
          badge: { text: "VIP", type: "accent" },
        },
        {
          id: 7,
          name: "ক্যারিবিয়ান স্টাড",
          image: "https://pixabay.com/get/g8f9a37c1e953c1a923764e17292b3cc53a39347f79e80f16c57d414ceadfb1da93c8f80f7a20ca7dbe41ff4b5e4d61a64cd1bcb9c0dbe075ab98c2c5f7c6cb06_1280.jpg",
          players: "২০+ টেবিল",
          provider: "এভোলুশন",
          category: "পোকার",
          badge: null,
        },
        {
          id: 8,
          name: "ডিল অর নো ডিল",
          image: "https://pixabay.com/get/g1bd071fe02e8c0b6e20e4d7d40ebb5e21a7fac9bd2213bc5cd3e4444ba5f71d4e661c02cab0b5dabc3a2aba7b1a7e09d417af8abf0a75ec34fb25b0ca35c21ce_1280.jpg",
          players: "৪৫+ প্লেয়ার",
          provider: "প্লেটেক",
          category: "সেলিব্রিটি",
          badge: { text: "শো", type: "blue" },
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
    "রুলেট",
    "কার্ড",
    "পোকার",
    "বাকারাত",
    "সেলিব্রিটি",
    "VIP",
  ];

  const filteredGames = activeCategory === "সব"
    ? games
    : games.filter(game => game.category === activeCategory || 
      (activeCategory === "VIP" && game.badge?.text === "VIP"));

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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white font-header flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-accent mr-2 h-6 w-6">
                <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
              </svg>
              লাইভ ক্যাসিনো গেমস
            </h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-background">
                এখন জনপ্রিয়
              </Button>
              <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-background">
                নতুন টেবিল
              </Button>
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
                    {game.badge && (
                      <div className={`absolute top-3 left-3 text-white text-xs px-2 py-1 rounded-full ${
                        game.badge.type === "highlight" ? "bg-[#ff4757]" : 
                        game.badge.type === "accent" ? "bg-accent text-secondary" :
                        "bg-blue-500"
                      }`}>
                        {game.badge.text}
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-accent text-sm bg-black bg-opacity-70 px-2 py-1 rounded">
                          {game.players}
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