"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { CHAIR_MODELS } from "@/utils/chairModels";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Heart, ShoppingCart, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Benefits = () => {
  const { cart, favorites, addToCart, toggleFavorite, addToViewed } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleProductAction = (chairId: string, action: "cart" | "order" | "detail") => {
    addToViewed(chairId);
    
    if (action === "cart") {
      addToCart(chairId, 1);
    } else if (action === "order") {
      router.push(`/booking?chair=${chairId}`);
    }
  };

  return (
    <section id="products" className="py-20 bg-white dark:bg-slate-950 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-emerald-700 dark:text-emerald-400 font-extrabold tracking-widest uppercase text-xs mb-4 block">Heli Smart Series</span>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Compare Our Models</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-xl mx-auto">
            Choose the model that fits your lifestyle. Get custom biosensor scanning, smart app support, or advanced graphene heat therapy.
          </p>
        </div>

        {/* 3 models cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {Object.entries(CHAIR_MODELS).map(([id, details]) => {
            const isFav = favorites.includes(id);
            return (
              <motion.div 
                key={id}
                whileHover={{ y: -8 }}
                onClick={() => addToViewed(id)}
                className="group rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-8 hover:shadow-xl hover:shadow-emerald-600/5 transition-all flex flex-col justify-between overflow-hidden relative"
              >
                {/* Favorite Heart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!user) {
                      router.push("/login");
                    } else {
                      toggleFavorite(id);
                    }
                  }}
                  className="absolute top-6 right-6 z-20 p-2.5 rounded-full bg-white dark:bg-slate-800 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  aria-label="Add to favorites"
                >
                  <Heart className={`w-5 h-5 transition-colors ${isFav ? "text-rose-500 fill-rose-500" : "text-slate-400 dark:text-slate-500 hover:text-rose-500"}`} />
                </button>

                <div>
                  {/* Image */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-slate-100 dark:bg-slate-800/40 flex items-center justify-center p-4">
                    <Image 
                      src={details.image} 
                      alt={details.name} 
                      fill 
                      sizes="(max-width: 640px) 240px, (max-width: 768px) 300px, 360px"
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>

                  {/* Title & Price */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">{details.name}</h3>
                  </div>
                  <p className="text-xs text-slate-650 dark:text-slate-400 font-bold uppercase tracking-wider mb-4">{details.desc}</p>
                  
                  <div className="mb-6">
                    <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{details.priceStr}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">Pre-order deposit 20%: {details.depositStr}</p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5 border-t border-slate-200 dark:border-slate-800 pt-6 mb-8">
                    {details.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Buy Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => handleProductAction(id, "cart")}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-700 text-white py-3.5 rounded-xl font-bold hover:bg-emerald-800 transition active:scale-98 shadow-md cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={() => handleProductAction(id, "order")}
                    className="w-full py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl transition active:scale-98 cursor-pointer"
                  >
                    Pre-order Now
                  </button>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Recently Viewed Products */}
        <RecentlyViewed />

      </div>
    </section>
  );
};

const RecentlyViewed = () => {
  const { viewed } = useCart();
  
  if (viewed.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-t border-slate-200 dark:border-slate-800 pt-16 mt-16"
    >
      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Recently Viewed Products</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {viewed.map((id) => {
          const details = CHAIR_MODELS[id];
          if (!details) return null;
          return (
            <Link key={id} href="#products" className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 hover:brightness-95 transition-all">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                <Image src={details.image} alt={details.name} fill sizes="64px" className="object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{details.name}</h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">{details.priceStr}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
};
