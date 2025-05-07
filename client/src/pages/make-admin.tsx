import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileMenu from "@/components/layout/mobile-menu";
import MobileNav from "@/components/layout/mobile-nav";
import { MakeAdmin } from "@/components/make-admin";
import { useLocation } from "wouter";

export default function MakeAdminPage() {
  const { user, logoutMutation } = useAuth();
  const [, navigate] = useLocation();

  // যদি ইউজার লগইন না থাকে তাহলে লগইন পেইজে পাঠাই
  if (!user) {
    navigate("/auth");
    return null;
  }

  // যদি ইউজার ইতিমধ্যে এডমিন হয়ে থাকে তাহলে এডমিন প্যানেলে পাঠাই
  if (user.isAdmin) {
    navigate("/admin");
    return null;
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isLoggedIn={!!user} onLogout={handleLogout} />
      <MobileMenu />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6 text-center">অ্যাডমিন প্যানেল অ্যাক্সেস</h1>
            <MakeAdmin />
          </div>
        </div>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}