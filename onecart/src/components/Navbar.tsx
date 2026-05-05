import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X, Zap, ShoppingBag, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { totalItems, openCart } = useCart();
  const { count: wishlistCount, openWishlist } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-panel py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)] group-hover:scale-105 transition-transform">
            <Zap className="text-white w-6 h-6" fill="currentColor" />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            OneCart
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/explore"
            className={`text-sm font-medium transition-colors hover:text-white ${location.startsWith("/explore") ? "text-white" : "text-white/60"}`}
          >
            Explore
          </Link>
          <Link href="/explore?category=food" className="text-sm font-medium text-white/60 transition-colors hover:text-white">
            Food
          </Link>
          <Link href="/explore?category=groceries" className="text-sm font-medium text-white/60 transition-colors hover:text-white">
            Groceries
          </Link>
          <Link href="/explore?category=electronics" className="text-sm font-medium text-white/60 transition-colors hover:text-white">
            Electronics
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/explore" className="text-white/80 hover:text-white transition-colors" data-testid="link-search">
            <Search className="w-5 h-5" />
          </Link>

          <button
            onClick={openWishlist}
            className="relative text-white/80 hover:text-white transition-colors p-2"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-0 w-3.5 h-3.5 rounded-full bg-pink-500 text-white text-[9px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          <motion.button
            onClick={openCart}
            data-testid="button-open-cart"
            whileTap={{ scale: 0.92 }}
            className="relative flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all neon-glow"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <AnimatePresence mode="wait">
              <motion.span
                key={totalItems}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="text-sm font-bold text-white tabular-nums"
                data-testid="text-cart-count"
              >
                {totalItems}
              </motion.span>
            </AnimatePresence>
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_8px_hsl(var(--primary)/0.8)]"
              >
                {totalItems > 9 ? "9+" : totalItems}
              </motion.span>
            )}
          </motion.button>
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="button-mobile-menu"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full glass-panel border-t border-white/10 py-4 px-4 flex flex-col gap-4 md:hidden shadow-xl"
          >
            <Link href="/explore" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium p-2 rounded-lg hover:bg-white/5">
              Explore Everything
            </Link>
            <Link href="/explore?category=food" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium p-2 rounded-lg hover:bg-white/5">
              Food Delivery
            </Link>
            <Link href="/explore?category=groceries" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium p-2 rounded-lg hover:bg-white/5">
              Groceries
            </Link>
            <Link href="/explore?category=electronics" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium p-2 rounded-lg hover:bg-white/5">
              Electronics
            </Link>
            <button
              onClick={() => { setMobileMenuOpen(false); openWishlist(); }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 text-lg font-medium"
            >
              <Heart className="w-5 h-5" /> Saved Items ({wishlistCount})
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); openCart(); }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 text-lg font-medium"
              data-testid="button-open-cart-mobile"
            >
              <ShoppingBag className="w-5 h-5" /> Cart ({totalItems})
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}