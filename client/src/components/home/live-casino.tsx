import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const liveCasinoGames = [
  {
    id: 1,
    name: "লাইভ রুলেট",
    image: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    players: "১০০+ প্লেয়ার",
    link: "/games/live-roulette"
  },
  {
    id: 2,
    name: "ব্ল্যাকজ্যাক",
    image: "https://pixabay.com/get/g7033623a2b3d2510f315f6ad7b55ce8c57f72231fe7a776c4bf29c38234ac393446b538684087e4e77955455737b8e35559d9a29527f9dd95e08d63713da9720_1280.jpg",
    players: "৫০+ প্লেয়ার",
    link: "/games/blackjack"
  },
  {
    id: 3,
    name: "টেক্সাস হোল্ডেম",
    image: "https://images.unsplash.com/photo-1505247964246-1f0a90443c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    players: "২৫+ টেবিল",
    link: "/games/texas-holdem"
  },
  {
    id: 4,
    name: "বাকারাত",
    image: "https://images.unsplash.com/photo-1611867967135-0faab97d1530?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    players: "৩০+ প্লেয়ার",
    link: "/games/baccarat"
  }
];

export default function LiveCasino() {
  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white font-header flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-accent mr-2 h-5 w-5">
            <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
          </svg>
          লাইভ ক্যাসিনো
        </h2>
        <Link href="/live-casino" className="text-accent text-sm hover:underline flex items-center">
          সব দেখুন
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-3 w-3">
            <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {liveCasinoGames.map((game) => (
          <div key={game.id} className="game-card bg-card rounded-lg overflow-hidden shadow-lg">
            <div className="relative">
              <img src={game.image} alt={game.name} className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition duration-300">
                <Button className="bg-accent text-secondary px-5 py-2 rounded-full hover:bg-accent/90 flex items-center">
                  <Play className="h-4 w-4 mr-2" />
                  লাইভ খেলুন
                </Button>
              </div>
              <div className="absolute top-3 left-3">
                <div className="bg-[#ff4757] px-2 py-1 rounded text-xs text-white font-medium flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
                  লাইভ
                </div>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex justify-between items-center">
                  <span className="text-white font-accent text-sm bg-black bg-opacity-70 px-2 py-1 rounded">
                    {game.name}
                  </span>
                  <span className="text-accent text-xs bg-black bg-opacity-70 px-2 py-1 rounded">
                    {game.players}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
