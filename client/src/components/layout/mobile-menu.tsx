import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";

export default function MobileMenu() {
  const { user, logoutMutation } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const closeMenu = () => setIsOpen(false);
  
  const handleLogout = () => {
    logoutMutation.mutate();
    closeMenu();
  };
  
  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-accent/10 flex justify-between items-center">
              <Link href="/" onClick={closeMenu}>
                <a className="font-bold text-xl text-accent">ALVIX</a>
              </Link>
              <Button variant="ghost" size="icon" onClick={closeMenu}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            
            <nav className="flex-grow overflow-auto">
              <div className="p-4">
                {user ? (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-white">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{user.username}</div>
                        <div className="text-xs text-muted-foreground">
                          {user.isAdmin ? 'অ্যাডমিন' : 'সদস্য'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href="/wallet" onClick={closeMenu}>
                          <a>ওয়ালেট</a>
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href="/profile" onClick={closeMenu}>
                          <a>প্রোফাইল</a>
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 grid grid-cols-2 gap-2">
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/auth" onClick={closeMenu}>
                        <a>লগইন</a>
                      </Link>
                    </Button>
                    <Button asChild size="sm" className="w-full bg-accent hover:bg-accent/90">
                      <Link href="/auth" onClick={closeMenu}>
                        <a>রেজিস্টার</a>
                      </Link>
                    </Button>
                  </div>
                )}
                
                <div className="space-y-1">
                  <Link href="/games/slots" onClick={closeMenu}>
                    <a className="flex items-center py-2 px-3 rounded-md hover:bg-accent/10 transition-colors">
                      স্লট গেমস
                    </a>
                  </Link>
                  <Link href="/games/live-casino" onClick={closeMenu}>
                    <a className="flex items-center py-2 px-3 rounded-md hover:bg-accent/10 transition-colors">
                      লাইভ ক্যাসিনো
                    </a>
                  </Link>
                  <Link href="/games/sports" onClick={closeMenu}>
                    <a className="flex items-center py-2 px-3 rounded-md hover:bg-accent/10 transition-colors">
                      স্পোর্টস বেটিং
                    </a>
                  </Link>
                  <Link href="/games/card" onClick={closeMenu}>
                    <a className="flex items-center py-2 px-3 rounded-md hover:bg-accent/10 transition-colors">
                      কার্ড গেমস
                    </a>
                  </Link>
                  <Link href="/games/arcade" onClick={closeMenu}>
                    <a className="flex items-center py-2 px-3 rounded-md hover:bg-accent/10 transition-colors">
                      আর্কেড গেমস
                    </a>
                  </Link>
                  <Link href="/promotions" onClick={closeMenu}>
                    <a className="flex items-center py-2 px-3 rounded-md hover:bg-accent/10 transition-colors">
                      প্রমোশন
                    </a>
                  </Link>
                  <Link href="/payments" onClick={closeMenu}>
                    <a className="flex items-center py-2 px-3 rounded-md hover:bg-accent/10 transition-colors">
                      পেমেন্ট পদ্ধতি
                    </a>
                  </Link>
                </div>
                
                {user?.isAdmin && (
                  <div className="mt-4 pt-3 border-t border-accent/10">
                    <Link href="/admin" onClick={closeMenu}>
                      <a className="flex items-center py-2 px-3 rounded-md hover:bg-accent/10 transition-colors text-accent">
                        অ্যাডমিন প্যানেল
                      </a>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
            
            {user && (
              <div className="p-4 border-t border-accent/10">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  লগআউট
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}