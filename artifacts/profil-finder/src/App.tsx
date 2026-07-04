import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

import Home from "@/pages/home";
import ProfileList from "@/pages/profile/index";
import ProfileDetail from "@/pages/profile/[id]";
import CreateProfile from "@/pages/create-profile";
import MyProfile from "@/pages/my-profile";
import EditProfile from "@/pages/edit-profile";
import AdminDashboard from "@/pages/admin/index";
import AdminProfileDetail from "@/pages/admin/profile/[id]";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Impressum from "@/pages/impressum";
import Datenschutz from "@/pages/datenschutz";
import FAQ from "@/pages/faq";
import HowItWorks from "@/pages/how-it-works";
import Contact from "@/pages/contact";
import ForCompanies from "@/pages/for-companies";

const queryClient = new QueryClient();

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [location]);

  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/profile" component={ProfileList} />
        <Route path="/profile/:id" component={ProfileDetail} />
        <Route path="/profile-erstellen" component={CreateProfile} />
        <Route path="/create-profile" component={CreateProfile} />
        <Route path="/profil-bearbeiten" component={EditProfile} />
        <Route path="/edit-profile" component={EditProfile} />
        <Route path="/mein-profil" component={MyProfile} />
        <Route path="/my-profile" component={MyProfile} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/profile/:id" component={AdminProfileDetail} />
        <Route path="/login" component={Login} />
        <Route path="/anmelden" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/registrieren" component={Register} />
        <Route path="/impressum" component={Impressum} />
        <Route path="/datenschutz" component={Datenschutz} />
        <Route path="/faq" component={FAQ} />
        <Route path="/so-funktioniert-es" component={HowItWorks} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/kontakt" component={Contact} />
        <Route path="/contact" component={Contact} />
        <Route path="/fuer-unternehmen" component={ForCompanies} />
        <Route path="/für-unternehmen" component={ForCompanies} />
        <Route path="/for-companies" component={ForCompanies} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
