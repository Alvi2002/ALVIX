import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuIcon, Search, User } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AuthPage from "@/pages/auth-page";

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

export default function Header({ isLoggedIn, onLogout }: HeaderProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  // Close auth dialog if user is logged in or navigated to auth page
  if ((isLoggedIn || location === "/auth") && authDialogOpen) {
    setAuthDialogOpen(false);
  }

  const toggleMobileMenu = () => {
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileMenu) {
      if (mobileMenuOpen) {
        mobileMenu.classList.add("-translate-x-full");
      } else {
        mobileMenu.classList.remove("-translate-x-full");
      }
      setMobileMenuOpen(!mobileMenuOpen);
    }
  };

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Mobile Menu Toggle */}
          <div className="flex items-center">
            <button
              className="mr-3 lg:hidden text-accent text-2xl"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <MenuIcon />
            </button>
            <Link href="/" className="text-2xl font-bold font-header">
              <span className="text-white">TK</span>
              <span className="text-accent">999</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link
              href="/"
              className="text-white hover:text-accent font-medium transition duration-200 font-body"
            >
              হোম
            </Link>
            <Link
              href="/slots"
              className="text-white hover:text-accent font-medium transition duration-200 font-body"
            >
              স্লট গেমস
            </Link>
            <Link
              href="/live-casino"
              className="text-white hover:text-accent font-medium transition duration-200 font-body"
            >
              লাইভ ক্যাসিনো
            </Link>
            <Link
              href="/sports"
              className="text-white hover:text-accent font-medium transition duration-200 font-body"
            >
              স্পোর্টস
            </Link>
            <Link
              href="/promotions"
              className="text-white hover:text-accent font-medium transition duration-200 font-body"
            >
              প্রমোশন
            </Link>
            <Link
              href="/contact"
              className="text-white hover:text-accent font-medium transition duration-200 font-body"
            >
              যোগাযোগ
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="খেলা অনুসন্ধান করুন"
                className="bg-secondary text-white pl-9 pr-4 py-2 rounded-full text-sm w-40 lg:w-56 focus:ring-accent"
              />
            </div>

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0 overflow-hidden">
                    <User className="h-5 w-5 text-accent" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>আমার অ্যাকাউন্ট</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">প্রোফাইল</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wallet">ওয়ালেট</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/transactions">লেনদেন</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>লগআউট</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                {location !== "/auth" ? (
                  <>
                    <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="bg-transparent border border-accent text-accent hover:bg-accent hover:text-background">
                          লগইন
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-card">
                        <AuthPage />
                      </DialogContent>
                    </Dialog>
                    
                    <Link href="/auth">
                      <Button className="bg-accent text-secondary hover:bg-accent/90">
                        রেজিস্ট্রেশন
                      </Button>
                    </Link>
                  </>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
