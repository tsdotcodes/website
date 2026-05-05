import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Star, ShoppingBag, Plus, Minus } from "lucide-react";
import type { Product } from "@workspace/api-client-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useEffect } from "react";

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { addItem, items, updateQuantity } = useCart();
  const { isWishlisted, toggle } = useWishlist();

  const cartItem = items.find((i) => i.product.id === product.id);
  const quantity = cartItem?.quantity ?? 0;
  const wishlisted = isWishlisted(product.id);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-card border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)] z-10 flex flex-col md:flex-row max-h-[90vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full md:w-1/2 relative bg-black aspect-square md:aspect-auto">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/70 capitalize">
                  {product.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs font-medium text-primary">
                  {product.source}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="text-sm font-bold text-white">{product.rating}</span>
                </div>
                <span className="text-sm text-white/50">({product.reviews.toLocaleString()} reviews)</span>
              </div>

              <p className="text-white/70 text-base leading-relaxed mb-8">
                {product.description || `Experience the best quality with this premium ${product.name}. Carefully sourced and delivered fresh to your door.`}
              </p>

              <div className="mt-auto pt-6 border-t border-white/10">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    {product.originalPrice && (
                      <span className="text-lg text-white/40 line-through block mb-1">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="text-4xl font-bold text-white font-mono neon-text">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.discount && (
                        <span className="px-2 py-1 bg-destructive/20 text-destructive text-xs font-bold rounded-lg border border-destructive/30">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {quantity > 0 && (
                    <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/10">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center font-bold text-white">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => addItem(product)}
                    className="flex-1 py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {quantity > 0 ? "Add Another" : "Add to Cart"}
                  </button>
                  <button
                    onClick={() => toggle(product)}
                    className={`w-16 h-[60px] rounded-xl border flex items-center justify-center transition-all ${
                      wishlisted 
                        ? "bg-pink-500/20 border-pink-500/50 text-pink-500" 
                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Heart className="w-6 h-6" fill={wishlisted ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}