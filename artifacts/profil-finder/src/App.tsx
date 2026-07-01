import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/profile" component={ProfileList} />
      <Route path="/profile/:id" component={ProfileDetail} />
      <Route path="/create-profile" component={CreateProfile} />
      <Route path="/edit-profile" component={EditProfile} />
      <Route path="/my-profile" component={MyProfile} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/profile/:id" component={AdminProfileDetail} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/impressum" component={Impressum} />
      <Route path="/datenschutz" component={Datenschutz} />
      <Route path="/faq" component={FAQ} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/contact" component={Contact} />
      <Route path="/for-companies" component={ForCompanies} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
