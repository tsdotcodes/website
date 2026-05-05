import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LandingPage } from "./pages/LandingPage";
import { ExplorePage } from "./pages/ExplorePage";
import { Navbar } from "./components/Navbar";
import { CartDrawer } from "./components/CartDrawer";
import { CartProvider, useCart } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { WishlistDrawer } from "./components/WishlistDrawer";
import { ScrollToTop } from "./components/ScrollToTop";
import NotFound from "@/pages/not-found";
import { ShoppingBag } from "lucide-react";

const queryClient = new QueryClient();

function MobileCartButton() {
  const { totalItems, openCart, isOpen } = useCart();
  
  if (totalItems === 0 || isOpen) return null;
  
  return (
    <motion.button
      key={totalItems}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileTap={{ scale: 0.95 }}
      onClick={openCart}
      className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-full shadow-[0_0_30px_hsl(var(--primary)/0.5)] border border-white/20"
    >
      <ShoppingBag className="w-5 h-5" />
      <span>View Cart ({totalItems})</span>
    </motion.button>
  );
}

function AnimatedRoutes() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="flex-1 z-10 w-full"
      >
        <Switch location={location}>
          <Route path="/" component={LandingPage} />
          <Route path="/explore" component={ExplorePage} />
          <Route component={NotFound} />
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <WishlistProvider>
            <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, "")}>
              <div className="min-h-[100dvh] flex flex-col bg-background text-foreground relative overflow-hidden">
                <Navbar />
                <CartDrawer />
                <WishlistDrawer />
                <MobileCartButton />
                <ScrollToTop />
                
                <AnimatedRoutes />
                
                <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                  <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full mix-blend-screen" />
                  <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/20 blur-[150px] rounded-full mix-blend-screen" />
                </div>
              </div>
            </WouterRouter>
            <Toaster />
          </WishlistProvider>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;