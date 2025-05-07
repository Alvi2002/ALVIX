import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileMenu from "@/components/layout/mobile-menu";
import MobileNav from "@/components/layout/mobile-nav";
import HeroSlider from "@/components/home/hero-slider";
import Categories from "@/components/home/categories";
import TopGames from "@/components/home/top-games";
import LiveCasino from "@/components/home/live-casino";
import Promotions from "@/components/home/promotions";
import GameCategories from "@/components/home/game-categories";
import PaymentMethods from "@/components/home/payment-methods";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isLoggedIn={!!user} onLogout={handleLogout} />
      <MobileMenu />
      
      <main className="flex-grow">
        <HeroSlider />
        <Categories />
        
        <div className="container mx-auto px-4 py-6">
          <TopGames />
          <LiveCasino />
          <Promotions />
          <GameCategories />
          <PaymentMethods />
        </div>
      </main>
      
      <Footer />
      <MobileNav />
    </div>
  );
}
