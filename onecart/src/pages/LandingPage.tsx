import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Sparkles, Zap, Package, MapPin, Quote } from "lucide-react";
import { useGetFeaturedProducts } from "@workspace/api-client-react";
import { ProductCard } from "../components/ProductCard";
import { useRef } from "react";

function AnimatedNumber({ value, suffix = "" }: { value: number, suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const stepTime = duration / steps;
      let step = 0;
      
      const timer = setInterval(() => {
        step++;
        setCurrent(Math.min(Math.round((value / steps) * step), value));
        if (step >= steps) clearInterval(timer);
      }, stepTime);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{current}{suffix}</span>;
}

function Particles() {
  const [particles, setParticles] = useState<{id: number, x: number, y: number, size: number, duration: number, delay: number}[]>([]);

  useEffect(() => {
    const arr = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5
    }));
    setParticles(arr);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/20 blur-[1px]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: ["0%", "-50%", "-100%"],
            x: ["0%", "5%", "-5%", "0%"],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}

export function LandingPage() {
  const { data: featuredData, isLoading } = useGetFeaturedProducts();

  return (
    <div className="w-full flex flex-col pt-24 pb-20">
      <section className="relative container mx-auto px-4 min-h-[80vh] flex flex-col items-center justify-center text-center">
        <Particles />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 relative z-10"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-medium text-accent uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4" /> The Future of Commerce
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 leading-tight">
            Everything you need.<br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-fuchsia-500 to-accent">
              In one portal.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto font-light">
            Food delivery, groceries, and premium electronics. Curated, cinematic, and impossibly fast.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md relative z-10"
        >
          <Link href="/explore" className="group relative flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-full font-semibold text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            <span className="relative z-10 flex items-center gap-2">Start Exploring <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
          </Link>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard title="Products" value={18} suffix="+" delay={0.1} />
          <StatCard title="Sources" value={4} delay={0.2} />
          <StatCard title="Avg Rating" value={4.6} suffix="★" isFloat delay={0.3} />
          <StatCard title="Free Delivery" value={100} suffix="%" delay={0.4} />
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <Zap className="text-primary" /> Featured Drops
          </h2>
          <Link href="/explore" className="text-white/60 hover:text-accent transition-colors flex items-center gap-1 font-medium">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[400px] rounded-2xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredData?.products.slice(0, 4).map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Social Proof Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by early adopters</h2>
          <p className="text-white/50 max-w-2xl mx-auto">Don't just take our word for it. Here's what people are saying about the OneCart experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TestimonialCard 
            quote="Best food ordering experience I've had. The interface is impossibly fast and the dark mode is gorgeous."
            name="Sarah J."
            city="San Francisco"
            initials="SJ"
            color="bg-primary/20 text-primary border-primary/30"
            delay={0.1}
          />
          <TestimonialCard 
            quote="I used to switch between 3 different apps for groceries and dinner. Now it's all in one place. Game changer."
            name="Mike T."
            city="New York"
            initials="MT"
            color="bg-accent/20 text-accent border-accent/30"
            delay={0.2}
          />
          <TestimonialCard 
            quote="The UI feels like something out of a sci-fi movie. Plus the electronics section has amazing tech drops."
            name="Elena R."
            city="London"
            initials="ER"
            color="bg-pink-500/20 text-pink-400 border-pink-500/30"
            delay={0.3}
          />
        </div>
      </section>
      
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CategoryCard title="Hot Food" icon={<Zap className="w-8 h-8 text-orange-500" />} href="/explore?category=food" bg="from-orange-500/20 to-transparent" />
          <CategoryCard title="Fresh Groceries" icon={<Package className="w-8 h-8 text-green-500" />} href="/explore?category=groceries" bg="from-green-500/20 to-transparent" />
          <CategoryCard title="Pro Electronics" icon={<Sparkles className="w-8 h-8 text-blue-500" />} href="/explore?category=electronics" bg="from-blue-500/20 to-transparent" />
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, suffix = "", isFloat = false, delay = 0 }: { title: string, value: number, suffix?: string, isFloat?: boolean, delay?: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-colors duration-500"
    >
      <div className="text-4xl md:text-5xl font-bold font-mono neon-text mb-2 text-white">
        {isFloat ? <span className="tracking-tighter">{value}{suffix}</span> : <AnimatedNumber value={value} suffix={suffix} />}
      </div>
      <div className="text-white/60 text-sm font-medium tracking-wide uppercase">{title}</div>
    </motion.div>
  );
}

function TestimonialCard({ quote, name, city, initials, color, delay }: { quote: string, name: string, city: string, initials: string, color: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="glass-panel p-8 rounded-3xl relative flex flex-col h-full group hover:-translate-y-2 transition-transform duration-500"
    >
      <Quote className="absolute top-6 right-6 w-8 h-8 text-white/5 group-hover:text-white/10 transition-colors" />
      <p className="text-lg text-white/80 mb-8 flex-1 italic leading-relaxed">"{quote}"</p>
      <div className="flex items-center gap-4 mt-auto">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border ${color}`}>
          {initials}
        </div>
        <div>
          <h4 className="font-bold text-white">{name}</h4>
          <p className="text-sm text-white/40 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {city}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function CategoryCard({ title, icon, href, bg }: { title: string, icon: React.ReactNode, href: string, bg: string }) {
  return (
    <Link href={href} className={`group relative h-64 rounded-3xl overflow-hidden glass-panel border border-white/10 flex flex-col items-center justify-center p-8 transition-transform hover:scale-[1.02]`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${bg} opacity-50 group-hover:opacity-100 transition-opacity`} />
      <div className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center mb-4 border border-white/10 shadow-xl">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white relative z-10">{title}</h3>
    </Link>
  );
}