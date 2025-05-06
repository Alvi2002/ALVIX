import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const topGames = [
  {
    id: 1,
    name: "গোল্ডেন ড্রাগন",
    image: "https://images.unsplash.com/photo-1605870445919-838d190e8e1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    payout: "৯৮% পেআউট",
    badge: { text: "হট", type: "highlight" } as const,
    link: "/games/golden-dragon"
  },
  {
    id: 2,
    name: "টেক্সাস হোল্ডেম",
    image: "https://pixabay.com/get/g399dfa334d6403b151b44f3011655c8e42bb78bbbecee91b9481b1aa30f06ed1c47ae2d604a0fbc2a4d3a1b749fe94e89ac9bdcd76f29fdd8326019e25f40307_1280.jpg",
    payout: "৫০+ টেবিল",
    badge: { text: "লাইভ", type: "accent" } as const,
    link: "/games/texas-holdem"
  },
  {
    id: 3,
    name: "প্রিমিয়াম রুলেট",
    image: "https://pixabay.com/get/g479b99e0f6cf346fb715895ac156bd0aa064e6f32c627a19a26b957e3c5eaa97ffe67ab19e0256e05c9a354b367766aaa0bed33f3eab6211f12d234a313e782e_1280.jpg",
    payout: "লাইভ ডিলার",
    badge: null,
    link: "/games/premium-roulette"
  },
  {
    id: 4,
    name: "ফুটবল বেটিং",
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    payout: "২০+ লাইভ ম্যাচ",
    badge: { text: "লাইভ", type: "highlight" } as const,
    link: "/games/football-betting"
  },
  {
    id: 5,
    name: "স্পিড ব্যাকার্যাট",
    image: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    payout: "দ্রুত রাউন্ড",
    badge: null,
    link: "/games/speed-baccarat"
  },
  {
    id: 6,
    name: "মেগা জ্যাকপট",
    image: "https://images.unsplash.com/photo-1518893883800-45cd0954574b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    payout: "১০লক্ষ+ জ্যাকপট",
    badge: { text: "নতুন", type: "accent" } as const,
    link: "/games/mega-jackpot"
  }
];

export default function TopGames() {
  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white font-header flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-accent mr-2 h-5 w-5">
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
          </svg>
          টপ গেমস
        </h2>
        <Link href="/games" className="text-accent text-sm hover:underline flex items-center">
          সব দেখুন
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-3 w-3">
            <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {topGames.map((game) => (
          <div key={game.id} className="game-card bg-card rounded-lg overflow-hidden shadow-lg">
            <div className="relative">
              <img src={game.image} alt={game.name} className="w-full h-36 object-cover" />
              {game.badge && (
                <div className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded-full ${
                  game.badge.type === "highlight" ? "bg-[#ff4757]" : "bg-accent text-secondary"
                }`}>
                  {game.badge.text}
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-white font-medium text-sm font-accent">{game.name}</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-accent text-xs">{game.payout}</span>
                <Button variant="default" size="sm" className="text-xs px-3 py-1 h-auto rounded-full bg-accent text-secondary hover:bg-accent/90">
                  খেলুন
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
