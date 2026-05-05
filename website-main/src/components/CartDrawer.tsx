import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const [checkoutState, setCheckoutState] = useState<"idle" | "processing" | "success">("idle");
  const { toast } = useToast();

  const handleCheckout = () => {
    setCheckoutState("processing");
    setTimeout(() => {
      setCheckoutState("success");
      toast({ description: "Order placed! 🎉", duration: 3000 });
      setTimeout(() => {
        clearCart();
        closeCart();
        setCheckoutState("idle");
      }, 2200);
    }, 1800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
            data-testid="cart-overlay"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-[100] flex flex-col"
            data-testid="cart-drawer"
          >
            <div className="flex flex-col h-full bg-[#0d0d14] border-l border-white/10 shadow-[−20px_0_60px_rgba(0,0,0,0.8)]">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Your Cart</h2>
                    <p className="text-xs text-white/40">{totalItems} {totalItems === 1 ? "item" : "items"}</p>
                  </div>
                </div>
                <button
                  onClick={closeCart}
                  data-testid="button-close-cart"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {checkoutState === "processing" && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-20">
                    <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-6" />
                    <h3 className="text-xl font-bold text-white mb-2">Placing Your Order</h3>
                    <p className="text-white/50">Connecting to fulfillment partners...</p>
                  </div>
                )}

                {checkoutState === "success" && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-20">
                    <motion.div
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-24 h-24 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.2)]"
                    >
                      <svg className="w-12 h-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h3>
                    <p className="text-white/50 text-sm max-w-xs">
                      Your {totalItems} {totalItems === 1 ? "item" : "items"} will arrive soon. Thanks for shopping with OneCart.
                    </p>
                  </div>
                )}

                {checkoutState === "idle" && items.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-20">
                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                      <ShoppingBag className="w-9 h-9 text-white/20" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Cart is empty</h3>
                    <p className="text-white/40 text-sm">Add some products to get started.</p>
                  </div>
                )}

                {checkoutState === "idle" && items.map((item, index) => (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.04 }}
                    layout
                    data-testid={`cart-item-${item.product.id}`}
                    className="flex gap-3 p-3 rounded-2xl bg-white/5 border border-white/8 hover:border-white/15 transition-colors group"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-black/30">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white line-clamp-1 mb-0.5">{item.product.name}</p>
                      <p className="text-xs text-white/40 mb-2">{item.product.source}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white font-mono">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            data-testid={`button-decrease-${item.product.id}`}
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full bg-white/10 hover:bg-primary/30 text-white flex items-center justify-center transition-all hover:scale-110"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-white" data-testid={`text-quantity-${item.product.id}`}>
                            {item.quantity}
                          </span>
                          <button
                            data-testid={`button-increase-${item.product.id}`}
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full bg-white/10 hover:bg-primary/30 text-white flex items-center justify-center transition-all hover:scale-110"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            data-testid={`button-remove-${item.product.id}`}
                            onClick={() => removeItem(item.product.id)}
                            className="ml-1 w-7 h-7 rounded-full bg-white/5 hover:bg-red-500/20 text-white/30 hover:text-red-400 flex items-center justify-center transition-all"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              {checkoutState === "idle" && items.length > 0 && (
                <div className="px-6 py-5 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Subtotal</span>
                    <span className="text-white font-mono font-bold text-xl">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-white/30">
                    <span>Delivery & taxes</span>
                    <span>Calculated at checkout</span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    data-testid="button-checkout"
                    className="w-full py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-2xl text-base flex items-center justify-center gap-2 hover:opacity-90 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-[0_0_30px_hsl(var(--primary)/0.4)]"
                  >
                    <Sparkles className="w-4 h-4" />
                    Checkout · ${totalPrice.toFixed(2)}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={clearCart}
                    data-testid="button-clear-cart"
                    className="w-full py-2.5 text-white/30 hover:text-white/60 text-sm transition-colors"
                  >
                    Clear cart
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}