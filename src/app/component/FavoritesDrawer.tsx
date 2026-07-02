"use client";

import { useCart } from "@/context/CartContext";
import { CHAIR_MODELS } from "@/utils/chairModels";
import { Heart, X, Trash2 } from "lucide-react";
import Image from "next/image";

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCart: () => void;
}

export default function FavoritesDrawer({ isOpen, onClose, onOpenCart }: FavoritesDrawerProps) {
  const { favorites, toggleFavorite, addToCart } = useCart();

  return (
    <div className={`fixed inset-0 z-100 flex justify-end transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onClose} />
      {/* Panel */}
      <div className={`relative w-[85vw] sm:w-[50vw] md:w-[40vw] lg:w-[30vw] min-w-[280px] max-w-[400px] bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span>My Favorites</span>
          </h3>
          <button onClick={onClose} aria-label="Close favorites drawer" className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {favorites.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <Heart className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4 stroke-1" />
              <p className="text-slate-500 font-semibold">You have no favorites yet.</p>
            </div>
          ) : (
            favorites.map((chairId) => {
              const details = CHAIR_MODELS[chairId];
              if (!details) return null;
              return (
                <div key={chairId} className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                    <Image src={details.image} alt={details.name} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{details.name}</h4>
                      <p className="text-xs text-emerald-750 dark:text-emerald-400 font-bold mt-1">{details.priceStr}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <button
                        onClick={async () => {
                          await addToCart(chairId, 1);
                          onClose();
                          onOpenCart();
                        }}
                        className="bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-emerald-800 transition cursor-pointer"
                      >
                        Add to Cart
                      </button>
                      <button onClick={() => toggleFavorite(chairId)} className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
