import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Mail, Home, GamepadIcon, Gift, Wallet, User } from "lucide-react";

export default function Footer() {
  return (
    <>
      <footer className="bg-card py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-4 font-header">TK999</h3>
              <p className="text-muted-foreground text-sm mb-4">
                আমাদের গেমিং প্ল্যাটফর্মে আপনাকে স্বাগতম। নিরাপদ এবং আনন্দদায়ক গেমিং অভিজ্ঞতার জন্য আমাদের সাথে থাকুন।
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-accent">
                  <Facebook size={18} />
                </a>
                <a href="#" className="text-white hover:text-accent">
                  <Twitter size={18} />
                </a>
                <a href="#" className="text-white hover:text-accent">
                  <Instagram size={18} />
                </a>
                <a href="#" className="text-white hover:text-accent">
                  <Mail size={18} />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-4 font-header">দ্রুত লিঙ্ক</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-accent text-sm">
                    আমাদের সম্পর্কে
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-accent text-sm">
                    যোগাযোগ করুন
                  </Link>
                </li>
                <li>
                  <Link href="/affiliate" className="text-muted-foreground hover:text-accent text-sm">
                    এফিলিয়েট প্রোগ্রাম
                  </Link>
                </li>
                <li>
                  <Link href="/responsible-gaming" className="text-muted-foreground hover:text-accent text-sm">
                    দায়িত্বশীল গেমিং
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-accent text-sm">
                    নিয়ম ও শর্তাবলী
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-4 font-header">সহায়তা</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/faq" className="text-muted-foreground hover:text-accent text-sm">
                    সাধারণ প্রশ্নোত্তর
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-accent text-sm">
                    গোপনীয়তা নীতি
                  </Link>
                </li>
                <li>
                  <Link href="/payments" className="text-muted-foreground hover:text-accent text-sm">
                    অর্থ প্রদান পদ্ধতি
                  </Link>
                </li>
                <li>
                  <Link href="/tournament-rules" className="text-muted-foreground hover:text-accent text-sm">
                    টুর্নামেন্ট নিয়মাবলী
                  </Link>
                </li>
                <li>
                  <Link href="/helpdesk" className="text-muted-foreground hover:text-accent text-sm">
                    হেল্পডেস্ক
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700 text-center">
            <p className="text-muted-foreground text-xs">© ২০২৩ TK999। সর্বস্বত্ব সংরক্ষিত। ১৮+ বয়সের জন্য। দায়িত্বশীল গেমিং অনুশীলন করুন।</p>
          </div>
        </div>
      </footer>
      
      {/* বাটন নেভিগেশন বার (মোবাইল ডিভাইসের জন্য) */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-accent/20 z-50 md:hidden">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex flex-col items-center py-2 px-1 w-1/5">
            <Home className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground mt-1">হোম</span>
          </Link>
          <Link href="/games" className="flex flex-col items-center py-2 px-1 w-1/5">
            <GamepadIcon className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground mt-1">গেমস</span>
          </Link>
          <Link href="/promotions" className="flex flex-col items-center py-2 px-1 w-1/5">
            <Gift className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground mt-1">প্রমোশন</span>
          </Link>
          <Link href="/wallet" className="flex flex-col items-center py-2 px-1 w-1/5">
            <Wallet className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground mt-1">ওয়ালেট</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center py-2 px-1 w-1/5">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground mt-1">প্রোফাইল</span>
          </Link>
        </div>
      </div>
    </>
  );
}
