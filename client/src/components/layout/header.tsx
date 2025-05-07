import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";

type HeaderProps = {
  isLoggedIn: boolean;
  onLogout: () => void;
};

export default function Header({ isLoggedIn, onLogout }: HeaderProps) {
  const { user } = useAuth();
  
  return (
    <header className="bg-card border-b border-accent/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <a className="font-bold text-xl mr-6 text-accent">ALVIX</a>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link href="/games/slots">
              <a className="text-foreground hover:text-accent transition-colors">স্লট</a>
            </Link>
            <Link href="/games/live-casino">
              <a className="text-foreground hover:text-accent transition-colors">লাইভ ক্যাসিনো</a>
            </Link>
            <Link href="/games/sports">
              <a className="text-foreground hover:text-accent transition-colors">স্পোর্টস</a>
            </Link>
            <Link href="/promotions">
              <a className="text-foreground hover:text-accent transition-colors">প্রমোশন</a>
            </Link>
            <Link href="/payments">
              <a className="text-foreground hover:text-accent transition-colors">পেমেন্ট</a>
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{user?.username || 'ইউজার'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>আমার অ্যাকাউন্ট</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile"><a className="w-full">প্রোফাইল</a></Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wallet"><a className="w-full">ওয়ালেট</a></Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/transactions"><a className="w-full">ট্রানজেকশন</a></Link>
                </DropdownMenuItem>
                {user?.isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin"><a className="w-full">অ্যাডমিন প্যানেল</a></Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  লগআউট
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex space-x-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/auth"><a>লগইন</a></Link>
              </Button>
              <Button asChild size="sm" className="bg-accent hover:bg-accent/90">
                <Link href="/auth"><a>রেজিস্টার</a></Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}