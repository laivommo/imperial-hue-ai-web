import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import RoomDetail from "./pages/RoomDetail";
import Booking from "./pages/Booking";
import Amenities from "./pages/Amenities";
import Offers from "./pages/Offers";
import Explore from "./pages/Explore";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminCRM from "./pages/AdminCRM";
import LoyaltyPage from "./pages/Loyalty";
import AdminPricing from "./pages/AdminPricing";
import AdminGuard from "./components/AdminGuard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/rooms" component={Rooms} />
      <Route path="/room/:id" component={RoomDetail} />
      <Route path="/booking/:roomId" component={Booking} />
      <Route path="/amenities" component={Amenities} />
      <Route path="/offers" component={Offers} />
      <Route path="/explore" component={Explore} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin/crm">
        <AdminGuard><AdminCRM /></AdminGuard>
      </Route>
      <Route path="/admin/pricing">
        <AdminGuard><AdminPricing /></AdminGuard>
      </Route>
      <Route path="/loyalty" component={LoyaltyPage} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
