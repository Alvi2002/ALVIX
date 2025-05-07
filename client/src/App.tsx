import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import SlotsPage from "@/pages/slots";
import LiveCasinoPage from "@/pages/live-casino";
import SportsPage from "@/pages/sports";
import ProfilePage from "@/pages/profile";
import WalletPage from "@/pages/wallet";
import ContactPage from "@/pages/contact";
import TransactionsPage from "@/pages/transactions";
import PromotionsPage from "@/pages/promotions";
import GamesPage from "@/pages/games";
import AboutPage from "@/pages/about";
import ResponsibleGamingPage from "@/pages/responsible-gaming";
import AffiliatePage from "@/pages/affiliate";
import AdminPage from "@/pages/admin";
import MakeAdminPage from "@/pages/make-admin";
import PasswordResetPage from "@/pages/password-reset";
import TermsPage from "@/pages/terms";
import PrivacyPage from "@/pages/privacy";
// গেম ক্যাটাগরি পেজগুলো ইমপোর্ট করছি
import CardGamesPage from "@/pages/games/card";
import ArcadeGamesPage from "@/pages/games/arcade";
import TournamentsPage from "@/pages/games/tournaments";
import BetSlipSystem from "@/pages/games/betslip";
import PaymentMethodsPage from "@/pages/payment-methods";
import PaymentsFixedPage from "@/pages/payments-fixed";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";

function Router() {
  return (
    <Switch>
      {/* পাবলিক রাউট */}
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/promotions" component={PromotionsPage} />
      <Route path="/games" component={GamesPage} />
      <Route path="/slots" component={SlotsPage} />
      <Route path="/live-casino" component={LiveCasinoPage} />
      <Route path="/sports" component={SportsPage} />
      <Route path="/games/card" component={CardGamesPage} />
      <Route path="/games/arcade" component={ArcadeGamesPage} />
      <Route path="/games/tournaments" component={TournamentsPage} />
      <Route path="/games/slots" component={SlotsPage} />
      <Route path="/games/live-casino" component={LiveCasinoPage} />
      <Route path="/games/sports" component={SportsPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/responsible-gaming" component={ResponsibleGamingPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/password-reset" component={PasswordResetPage} />
      <Route path="/faq" component={AboutPage} /> {/* অস্থায়ীভাবে AboutPage দিয়েই দেখাচ্ছি */}
      <Route path="/affiliate" component={AffiliatePage} />
      <Route path="/payments" component={PaymentsFixedPage} />
      <Route path="/tournament-rules" component={AboutPage} /> {/* অস্থায়ীভাবে AboutPage দিয়েই দেখাচ্ছি */}
      <Route path="/helpdesk" component={ContactPage} /> {/* অস্থায়ীভাবে ContactPage দিয়েই দেখাচ্ছি */}
      
      {/* প্রাইভেট রাউট - লগইন আবশ্যক */}
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/wallet" component={WalletPage} />
      <ProtectedRoute path="/transactions" component={TransactionsPage} />
      <ProtectedRoute path="/admin" component={AdminPage} />
      <ProtectedRoute path="/make-admin" component={MakeAdminPage} />
      <ProtectedRoute path="/games/betslip" component={BetSlipSystem} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
