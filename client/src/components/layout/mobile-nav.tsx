import { Link, useLocation } from "wouter";
import { Home, Dice5, Gift, Wallet, User } from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card shadow-lg z-40 lg:hidden">
      <div className="flex justify-around">
        <Link href="/">
          <div className={`flex flex-col items-center p-3 ${location === "/" ? "text-accent" : "text-white hover:text-accent"}`}>
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">হোম</span>
          </div>
        </Link>
        
        <Link href="/games">
          <div className={`flex flex-col items-center p-3 ${location === "/games" ? "text-accent" : "text-white hover:text-accent"}`}>
            <Dice5 className="h-5 w-5" />
            <span className="text-xs mt-1">গেমস</span>
          </div>
        </Link>
        
        <Link href="/promotions">
          <div className={`flex flex-col items-center p-3 ${location === "/promotions" ? "text-accent" : "text-white hover:text-accent"}`}>
            <Gift className="h-5 w-5" />
            <span className="text-xs mt-1">প্রমোশন</span>
          </div>
        </Link>
        
        <Link href="/wallet">
          <div className={`flex flex-col items-center p-3 ${location === "/wallet" ? "text-accent" : "text-white hover:text-accent"}`}>
            <Wallet className="h-5 w-5" />
            <span className="text-xs mt-1">ওয়ালেট</span>
          </div>
        </Link>
        
        <Link href="/profile">
          <div className={`flex flex-col items-center p-3 ${location === "/profile" ? "text-accent" : "text-white hover:text-accent"}`}>
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">প্রোফাইল</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
