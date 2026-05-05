import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation } from "wouter";
import { Search, SlidersHorizontal, ArrowRight, History, Package, Zap, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetProducts, useGetProductsSummary, GetProductsCategory } from "@workspace/api-client-react";
import { ProductCard } from "../components/ProductCard";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useCart } from "@/context/CartContext";

const searchPlaceholders = [
  "Search pizza...",
  "Search wireless headphones...",
  "Search fresh milk...",
  "Search mechanical keyboard...",
  "Search sushi...",
];

type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "discount";

export function ExplorePage() {
  const [location] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const initialCategory = params.get("category") as GetProductsCategory | undefined;
  const initialSearch = params.get("search") || "";

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState<GetProductsCategory | "all">(initialCategory || "all");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [sort, setSort] = useState<SortOption>("featured");
  const [showFilters, setShowFilters] = useState(false);
  
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  const { data, isLoading } = useGetProducts({
    search: search || undefined,
    category: category !== "all" ? category : undefined
  });

  const { data: summary } = useGetProductsSummary();
  const { recentIds } = useRecentlyViewed();
  const { addItem } = useCart();

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
        setSearch("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const allSources = useMemo(() => {
    if (!data?.products) return [];
    return Array.from(new Set(data.products.map(p => p.source)));
  }, [data]);

  const activeFilterCount = (minPrice ? 1 : 0) + (maxPrice ? 1 : 0) + (minRating > 0 ? 1 : 0) + selectedSources.length;

  const processedProducts = useMemo(() => {
    if (!data?.products) return [];
    
    let result = [...data.products];

    // Apply filters
    if (minPrice) result = result.filter(p => p.price >= parseFloat(minPrice));
    if (maxPrice) result = result.filter(p => p.price <= parseFloat(maxPrice));
    if (minRating > 0) result = result.filter(p => p.rating >= minRating);
    if (selectedSources.length > 0) result = result.filter(p => selectedSources.includes(p.source));

    // Apply sort
    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "discount":
        result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case "featured":
      default:
        // Assuming original order is featured
        break;
    }

    return result;
  }, [data, sort, minPrice, maxPrice, minRating, selectedSources]);

  const recentProducts = useMemo(() => {
    if (!data?.products || recentIds.length === 0) return [];
    return recentIds
      .map(id => data.products.find(p => p.id === id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined);
  }, [data, recentIds]);

  const resetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setMinRating(0);
    setSelectedSources([]);
  };

  return (
    <div className="w-full flex flex-col pt-24 pb-20 min-h-screen">
      
      {/* Category Hero Banner */}
      <AnimatePresence mode="wait">
        {category !== "all" && (
          <motion.div
            key={category}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full overflow-hidden"
          >
            <div className={`w-full h-32 md:h-40 relative mb-8 flex items-center justify-center border-b border-white/10`}>
              <div className={`absolute inset-0 bg-gradient-to-r opacity-30
                ${category === 'food' ? 'from-orange-500 to-red-500' : 
                  category === 'groceries' ? 'from-green-500 to-emerald-500' : 
                  'from-blue-500 to-cyan-500'}`} 
              />
              <div className="absolute inset-0 backdrop-blur-sm" />
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full mb-2 flex items-center justify-center border border-white/20 bg-black/40 backdrop-blur-md
                  ${category === 'food' ? 'text-orange-400' : 
                    category === 'groceries' ? 'text-green-400' : 
                    'text-blue-400'}`}
                >
                  {category === 'food' ? <Zap className="w-6 h-6" /> : 
                   category === 'groceries' ? <Package className="w-6 h-6" /> : 
                   <Sparkles className="w-6 h-6" />}
                </div>
                <h1 className="text-3xl font-bold text-white capitalize">{category}</h1>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4">
        
        {/* Search Hero */}
        <div className="max-w-3xl mx-auto mb-8 relative">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur-xl opacity-50 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center glass-panel rounded-2xl overflow-hidden border border-white/10 p-2">
              <div className="pl-4 pr-2 text-white/50">
                <Search className="w-6 h-6" />
              </div>
              <div className="relative flex-1 h-14 flex items-center">
                <AnimatePresence mode="wait">
                  {!search && (
                    <motion.div
                      key={placeholderIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-y-0 left-0 flex items-center text-white/40 text-lg pointer-events-none"
                    >
                      {searchPlaceholders[placeholderIndex]}
                    </motion.div>
                  )}
                </AnimatePresence>
                <input 
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none text-white text-lg z-10"
                />
              </div>
              <div className="hidden md:flex pr-4 items-center opacity-50 text-xs font-mono border border-white/20 px-2 py-1 rounded bg-black/40 mr-2 pointer-events-none">
                Press /
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`pr-4 pl-2 transition-colors relative ${showFilters ? "text-primary" : "text-white/50 hover:text-white"}`}
              >
                <SlidersHorizontal className="w-6 h-6" />
                {activeFilterCount > 0 && (
                  <span className="absolute top-0 right-2 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto pb-4 mb-4 hide-scrollbar gap-3 snap-x">
          <CategoryFilter 
            label="All Items" 
            active={category === "all"} 
            onClick={() => setCategory("all")} 
            count={summary?.totalProducts}
          />
          {summary?.categories.map(c => (
            <CategoryFilter 
              key={c.category}
              label={c.category.charAt(0).toUpperCase() + c.category.slice(1)} 
              active={category === c.category} 
              onClick={() => setCategory(c.category as GetProductsCategory)} 
              count={c.count}
            />
          ))}
        </div>

        {/* Sort & Filter Controls */}
        <div className="flex flex-col mb-8 gap-4">
          <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
            <SortButton label="Featured" active={sort === "featured"} onClick={() => setSort("featured")} />
            <SortButton label="Price ↑" active={sort === "price-asc"} onClick={() => setSort("price-asc")} />
            <SortButton label="Price ↓" active={sort === "price-desc"} onClick={() => setSort("price-desc")} />
            <SortButton label="Rating" active={sort === "rating"} onClick={() => setSort("rating")} />
            <SortButton label="Highest Discount" active={sort === "discount"} onClick={() => setSort("discount")} />
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="glass-panel rounded-2xl p-6 border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Price Filter */}
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-3">Price Range</h4>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">$</span>
                        <input 
                          type="number" 
                          placeholder="Min" 
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-7 pr-3 text-white text-sm focus:border-primary outline-none"
                        />
                      </div>
                      <span className="text-white/40">-</span>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">$</span>
                        <input 
                          type="number" 
                          placeholder="Max" 
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-7 pr-3 text-white text-sm focus:border-primary outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-3">Minimum Rating</h4>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => setMinRating(star === minRating ? 0 : star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <svg 
                            className={`w-6 h-6 ${star <= minRating ? 'text-accent fill-accent' : 'text-white/20 fill-white/10'}`} 
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sources Filter */}
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-3">Sources</h4>
                    <div className="flex flex-wrap gap-2">
                      {allSources.map(source => (
                        <button
                          key={source}
                          onClick={() => {
                            setSelectedSources(prev => 
                              prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]
                            );
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                            selectedSources.includes(source)
                              ? "bg-primary/20 border-primary text-primary"
                              : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                          }`}
                        >
                          {source}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reset Button */}
                  <div className="md:col-span-3 flex justify-end pt-2 border-t border-white/5">
                    <button
                      onClick={resetFilters}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      Reset all filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Recently Viewed */}
        {!isLoading && recentProducts.length > 0 && category === "all" && !search && activeFilterCount === 0 && (
          <div className="mb-12">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-accent" /> Recently Viewed
            </h3>
            <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-4 snap-x">
              {recentProducts.map(product => (
                <div key={`recent-${product.id}`} className="snap-start min-w-[240px] w-[240px] flex-shrink-0 bg-card rounded-2xl border border-white/5 overflow-hidden flex flex-col group">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-black/50 relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-80" />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="text-sm font-semibold text-white line-clamp-1 mb-2">{product.name}</h4>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="font-bold text-white font-mono">${product.price.toFixed(2)}</span>
                      <button 
                        onClick={() => addItem(product)}
                        className="text-xs bg-primary/20 text-primary px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-colors font-medium"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[400px] rounded-2xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : processedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="w-16 h-16 text-white/20 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
            <p className="text-white/60">Try searching for something else or clearing your filters.</p>
            {activeFilterCount > 0 && (
              <button 
                onClick={resetFilters}
                className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-sm font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.05 }
              }
            }}
          >
            {processedProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function CategoryFilter({ label, active, onClick, count }: { label: string, active: boolean, onClick: () => void, count?: number }) {
  return (
    <button
      onClick={onClick}
      className={`snap-start whitespace-nowrap flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300 ${
        active 
          ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]" 
          : "bg-card/50 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
      }`}
    >
      <span className="font-medium text-sm">{label}</span>
      {count !== undefined && (
        <span className={`text-xs px-2 py-0.5 rounded-full ${active ? "bg-black/10" : "bg-white/10"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function SortButton({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
        active
          ? "bg-primary/20 text-primary border-primary shadow-[0_0_10px_hsl(var(--primary)/0.3)]"
          : "bg-transparent text-white/50 border-white/10 hover:bg-white/5 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}