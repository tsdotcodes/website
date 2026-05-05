import { motion } from "framer-motion";
import { Star, Plus, Check, Heart } from "lucide-react";
import { useState } from "react";
import type { Product } from "@workspace/api-client-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ProductModal } from "./ProductModal";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useToast } from "@/hooks/use-toast";

export function ProductCard({ product }: { product: Product }) {
  const { addItem, items } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const { addViewed } = useRecentlyViewed();
  const { toast } = useToast();
  
  const [justAdded, setJustAdded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const cartItem = items.find((i) => i.product.id === product.id);
  const quantity = cartItem?.quantity ?? 0;
  const wishlisted = isWishlisted(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    toast({ description: "Added to cart" });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggle(product);
  };

  const handleOpenModal = () => {
    addViewed(product.id);
    setModalOpen(true);
  };

  return (
    <>
      <div
        data-testid={`card-product-${product.id}`}
        onClick={handleOpenModal}
        className="group relative flex flex-col h-full bg-card rounded-2xl border border-white/5 overflow-hidden transition-all hover:border-white/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] cursor-pointer"
      >
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 left-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            wishlisted 
              ? "bg-pink-500/20 text-pink-500 border border-pink-500/30 shadow-[0_0_10px_rgba(236,72,153,0.3)]" 
              : "bg-black/20 text-white/50 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-black/50"
          }`}
        >
          <Heart className="w-4 h-4" fill={wishlisted ? "currentColor" : "none"} />
        </button>

        {product.discount && (
          <div className="absolute top-12 left-3 z-10 px-2 py-1 bg-destructive text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-lg">
            {product.discount}% OFF
          </div>
        )}

        <div className="absolute top-3 right-3 z-10 px-3 py-1 glass-panel text-white/90 text-xs font-medium rounded-full pointer-events-none">
          {product.source}
        </div>

        {quantity > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full shadow-[0_0_12px_hsl(var(--primary)/0.6)] pointer-events-none"
            data-testid={`badge-quantity-${product.id}`}
          >
            {quantity} in cart
          </motion.div>
        )}

        <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/50">
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent z-10 opacity-80 pointer-events-none" />
          <img
            src={product.image || `https://source.unsplash.com/random/400x300/?${product.category}`}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
            loading="lazy"
          />
        </div>

        <div className="flex flex-col flex-1 p-5 relative z-20 -mt-12">
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="text-sm font-medium text-white">{product.rating}</span>
            <span className="text-sm text-white/40">({product.reviews.toLocaleString()})</span>
          </div>

          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <div className="flex-1" />

          <div className="flex items-end justify-between mt-4">
            <div>
              {product.originalPrice && (
                <span className="text-sm text-white/40 line-through block">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-2xl font-bold text-white font-mono">
                ${product.price.toFixed(2)}
              </span>
            </div>

            <motion.button
              onClick={handleAdd}
              data-testid={`button-add-to-cart-${product.id}`}
              whileTap={{ scale: 0.9 }}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                justAdded
                  ? "bg-green-500/20 text-green-400 border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                  : "bg-primary/20 text-primary border-primary/30 hover:bg-primary hover:text-white hover:scale-110 hover:shadow-[0_0_20px_hsl(var(--primary)/0.5)]"
              }`}
            >
              <motion.div
                key={justAdded ? "check" : "plus"}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                {justAdded ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>
      
      <ProductModal product={product} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}