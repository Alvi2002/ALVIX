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
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/slots" component={SlotsPage} />
      <ProtectedRoute path="/live-casino" component={LiveCasinoPage} />
      <ProtectedRoute path="/sports" component={SportsPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/wallet" component={WalletPage} />
      <ProtectedRoute path="/transactions" component={TransactionsPage} />
      <ProtectedRoute path="/admin" component={AdminPage} />
      <ProtectedRoute path="/make-admin" component={MakeAdminPage} />
      <Route path="/promotions" component={PromotionsPage} />
      <Route path="/games" component={GamesPage} />
      <ProtectedRoute path="/games/card" component={CardGamesPage} />
      <ProtectedRoute path="/games/arcade" component={ArcadeGamesPage} />
      <ProtectedRoute path="/games/tournaments" component={TournamentsPage} />
      <ProtectedRoute path="/games/slots" component={SlotsPage} />
      <ProtectedRoute path="/games/live-casino" component={LiveCasinoPage} />
      <ProtectedRoute path="/games/sports" component={SportsPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/responsible-gaming" component={ResponsibleGamingPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/password-reset" component={PasswordResetPage} />
      <Route path="/faq" component={AboutPage} /> {/* অস্থায়ীভাবে AboutPage দিয়েই দেখাচ্ছি */}
      <Route path="/affiliate" component={AffiliatePage} />
      <Route path="/payments" component={AboutPage} /> {/* অস্থায়ীভাবে AboutPage দিয়েই দেখাচ্ছি */}
      <Route path="/tournament-rules" component={AboutPage} /> {/* অস্থায়ীভাবে AboutPage দিয়েই দেখাচ্ছি */}
      <Route path="/helpdesk" component={ContactPage} /> {/* অস্থায়ীভাবে ContactPage দিয়েই দেখাচ্ছি */}
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
