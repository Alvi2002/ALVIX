import { Link, useLocation } from "wouter";
import { Home, Gamepad2, Trophy, Wallet, User } from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();
  
  const navItems = [
    {
      name: "হোম",
      href: "/",
      icon: <Home className="h-5 w-5" />,
      active: location === "/"
    },
    {
      name: "গেমস",
      href: "/games",
      icon: <Gamepad2 className="h-5 w-5" />,
      active: location.startsWith("/games")
    },
    {
      name: "প্রমোশন",
      href: "/promotions",
      icon: <Trophy className="h-5 w-5" />,
      active: location === "/promotions"
    },
    {
      name: "ওয়ালেট",
      href: "/wallet",
      icon: <Wallet className="h-5 w-5" />,
      active: location === "/wallet" || location === "/transactions"
    },
    {
      name: "প্রোফাইল",
      href: "/profile",
      icon: <User className="h-5 w-5" />,
      active: location === "/profile"
    }
  ];
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-accent/10 z-50">
      <div className="flex justify-between">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <a className={`flex flex-col items-center py-2 px-3 flex-1 ${
              item.active 
                ? "text-accent" 
                : "text-muted-foreground hover:text-foreground"
            }`}>
              {item.icon}
              <span className="text-xs mt-1">{item.name}</span>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}