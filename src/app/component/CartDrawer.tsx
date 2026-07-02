"use client";

import { useCart } from "@/context/CartContext";
import { CHAIR_MODELS } from "@/utils/chairModels";
import { ShoppingCart, X, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter();
  const { cart, updateCartQuantity, removeFromCart } = useCart();

  const cartSubtotal = cart.reduce((sum, item) => {
    const details = CHAIR_MODELS[item.chairId];
    return sum + (details ? details.price * item.quantity : 0);
  }, 0);

  return (
    <div className={`fixed inset-0 z-100 flex justify-end transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onClose} />
      {/* Panel */}
      <div className={`relative w-[85vw] sm:w-[50vw] md:w-[40vw] lg:w-[30vw] min-w-[280px] max-w-[400px] bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-650" />
            <span>Shopping Cart</span>
          </h3>
          <button onClick={onClose} aria-label="Close cart drawer" className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <ShoppingCart className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4 stroke-1" />
              <p className="text-slate-500 font-semibold mb-6">Your shopping cart is empty.</p>
              <button
                onClick={() => { onClose(); router.push("/"); }}
                className="bg-emerald-700 text-white font-bold text-sm px-6 py-2.5 rounded-full hover:bg-emerald-800 transition cursor-pointer"
              >
                Shop Now
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const details = CHAIR_MODELS[item.chairId];
              if (!details) return null;
              return (
                <div key={item.chairId} className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                    <Image src={details.image} alt={details.name} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{details.name}</h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold mt-1">{details.priceStr}</p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-md py-0.5 px-2 bg-white dark:bg-slate-900">
                        <button onClick={() => updateCartQuantity(item.chairId, item.quantity - 1)} aria-label="Decrease quantity" className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer">
                          <Minus className="w-3 h-3 text-slate-500" />
                        </button>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 w-5 text-center">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.chairId, item.quantity + 1)} aria-label="Increase quantity" className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer">
                          <Plus className="w-3 h-3 text-slate-500" />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.chairId)} className="text-rose-600 hover:text-rose-700 p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 font-semibold text-sm">Subtotal:</span>
              <span className="text-xl font-black text-slate-900 dark:text-white">{cartSubtotal.toLocaleString()} VND</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-6">Redirection to payment gateway requires a 20% deposit of the subtotal.</p>
            <Link
              href="/booking?checkout=cart"
              onClick={onClose}
              className="block text-center w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
