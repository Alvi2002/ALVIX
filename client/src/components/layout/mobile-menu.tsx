import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { X, Search } from "lucide-react";

export default function MobileMenu() {
  const closeMobileMenu = () => {
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileMenu) {
      mobileMenu.classList.add("-translate-x-full");
    }
  };

  return (
    <div
      id="mobile-menu"
      className="fixed inset-0 bg-background bg-opacity-95 z-50 transform -translate-x-full transition-transform duration-300 lg:hidden"
    >
      <div className="flex justify-end p-4">
        <button
          id="close-menu"
          className="text-accent text-2xl"
          onClick={closeMobileMenu}
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
      </div>
      <div className="p-6">
        <div className="mb-8 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="খেলা অনুসন্ধান করুন"
            className="bg-secondary text-white pl-9 pr-4 py-3 rounded-lg text-sm w-full focus:ring-accent"
          />
        </div>
        <nav className="flex flex-col space-y-4">
          <Link
            href="/"
            className="text-white hover:text-accent py-2 border-b border-gray-800 text-lg font-medium font-body"
            onClick={closeMobileMenu}
          >
            হোম
          </Link>
          <Link
            href="/slots"
            className="text-white hover:text-accent py-2 border-b border-gray-800 text-lg font-medium font-body"
            onClick={closeMobileMenu}
          >
            স্লট গেমস
          </Link>
          <Link
            href="/live-casino"
            className="text-white hover:text-accent py-2 border-b border-gray-800 text-lg font-medium font-body"
            onClick={closeMobileMenu}
          >
            লাইভ ক্যাসিনো
          </Link>
          <Link
            href="/sports"
            className="text-white hover:text-accent py-2 border-b border-gray-800 text-lg font-medium font-body"
            onClick={closeMobileMenu}
          >
            স্পোর্টস
          </Link>
          <Link
            href="/promotions"
            className="text-white hover:text-accent py-2 border-b border-gray-800 text-lg font-medium font-body"
            onClick={closeMobileMenu}
          >
            প্রমোশন
          </Link>
          <Link
            href="/contact"
            className="text-white hover:text-accent py-2 border-b border-gray-800 text-lg font-medium font-body"
            onClick={closeMobileMenu}
          >
            যোগাযোগ
          </Link>
        </nav>
      </div>
    </div>
  );
}
