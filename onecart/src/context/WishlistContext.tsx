import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Product } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export interface WishlistItem {
  product: Product;
}

interface WishlistContextValue {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggle: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  count: number;
  isOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    try {
      const stored = localStorage.getItem("onecart_wishlist");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("onecart_wishlist", JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      if (prev.some((i) => i.product.id === product.id)) return prev;
      return [...prev, { product }];
    });
    toast({ description: "Saved to wishlist ♥" });
  }, [toast]);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const toggle = useCallback((product: Product) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.product.id === product.id);
      if (exists) {
        return prev.filter((i) => i.product.id !== product.id);
      }
      toast({ description: "Saved to wishlist ♥" });
      return [...prev, { product }];
    });
  }, [toast]);

  const isWishlisted = useCallback((productId: string) => {
    return items.some((i) => i.product.id === productId);
  }, [items]);

  const openWishlist = useCallback(() => setIsOpen(true), []);
  const closeWishlist = useCallback(() => setIsOpen(false), []);

  return (
    <WishlistContext.Provider value={{
      items,
      addItem,
      removeItem,
      toggle,
      isWishlisted,
      count: items.length,
      isOpen,
      openWishlist,
      closeWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}