import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export function WishlistDrawer() {
  const { items, isOpen, closeWishlist, removeItem } = useWishlist();
  const { addItem } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeWishlist}
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
            data-testid="wishlist-overlay"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-[100] flex flex-col"
            data-testid="wishlist-drawer"
          >
            <div className="flex flex-col h-full bg-[#0d0d14] border-l border-white/10 shadow-[−20px_0_60px_rgba(0,0,0,0.8)]">

              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-pink-500" fill="currentColor" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Saved Items</h2>
                    <p className="text-xs text-white/40">{items.length} {items.length === 1 ? "item" : "items"}</p>
                  </div>
                </div>
                <button
                  onClick={closeWishlist}
                  data-testid="button-close-wishlist"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-20">
                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                      <Heart className="w-9 h-9 text-white/20" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Wishlist is empty</h3>
                    <p className="text-white/40 text-sm">Save your favorite items for later.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex flex-col bg-white/5 rounded-2xl border border-white/8 overflow-hidden group"
                      >
                        <div className="relative aspect-square bg-black/30">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/60 hover:text-red-400 hover:bg-red-500/20 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="p-3 flex flex-col flex-1">
                          <p className="text-sm font-semibold text-white line-clamp-1 mb-1">{item.product.name}</p>
                          <div className="flex items-center justify-between mt-auto pt-2">
                            <span className="text-sm font-bold text-white font-mono">
                              ${item.product.price.toFixed(2)}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              addItem(item.product);
                              removeItem(item.product.id);
                            }}
                            className="mt-3 w-full py-2 bg-primary/20 text-primary hover:bg-primary hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all"
                          >
                            <ShoppingBag className="w-3 h-3" /> Add
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}