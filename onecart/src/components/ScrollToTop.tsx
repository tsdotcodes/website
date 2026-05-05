import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-40 w-12 h-12 rounded-full glass-panel border border-white/10 flex items-center justify-center text-white hover:text-primary transition-colors shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] group"
          data-testid="scroll-to-top"
        >
          <ChevronUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/50 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}