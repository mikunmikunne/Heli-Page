"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Sun, Moon, ShoppingCart, Heart, LogOut, Trash2, X, Plus, Minus, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { CHAIR_MODELS } from "@/utils/chairModels";
import Image from "next/image";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Book / Buy", href: "/booking" },
  { label: "Contact", href: "/contact-us" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  const { cart, favorites, updateCartQuantity, removeFromCart, toggleFavorite, addToCart } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavsOpen, setIsFavsOpen] = useState(false);

  // Read theme on mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Close menu and drawers on pathname change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsCartOpen(false);
    setIsFavsOpen(false);
  }, [pathname]);

  // Prevent scroll when menu or drawers are open
  useEffect(() => {
    if (isMenuOpen || isCartOpen || isFavsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen, isCartOpen, isFavsOpen]);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => {
    const details = CHAIR_MODELS[item.chairId];
    return sum + (details ? details.price * item.quantity : 0);
  }, 0);

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
        <nav className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 py-4">
          
          {/* Logo */}
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center gap-2 text-lg sm:text-2xl font-black text-emerald-950 dark:text-emerald-300 tracking-tight hover:opacity-90 transition-opacity">
              <svg
                className="w-8 h-8 sm:w-9 sm:h-9 text-emerald-600 dark:text-emerald-400 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <span>HELI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 font-semibold text-sm">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    active
                      ? "text-emerald-600 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 dark:border-emerald-400 pb-1"
                      : "text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
            {isAdmin && (
              <Link href="/admin" className="text-amber-600 dark:text-amber-400 hover:opacity-80 transition-opacity font-bold">
                Dashboard
              </Link>
            )}
          </div>

          {/* Actions Block */}
          <div className="flex-1 flex justify-end items-center gap-2 sm:gap-4">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
            </button>

            {/* Favorites Button */}
            <button
              onClick={() => setIsFavsOpen(true)}
              className="relative p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors focus:outline-none cursor-pointer"
              aria-label="Favorites"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors focus:outline-none cursor-pointer"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* User Session Profile / Login */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                {user.user_metadata?.avatar_url ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-emerald-500">
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt="Avatar"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                    {user.email?.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <button
                  onClick={signOut}
                  className="hidden md:flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-semibold"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

          </div>
        </nav>
      </header>

      {/* Side Drawer: Cart */}
      <div className={`fixed inset-0 z-100 flex justify-end transition-opacity duration-300 ${isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
        {/* Panel */}
        <div className={`relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-emerald-600" />
              <span>Shopping Cart</span>
            </h3>
            <button onClick={() => setIsCartOpen(false)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <ShoppingCart className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4 stroke-1" />
                <p className="text-slate-500 font-semibold mb-6">Your shopping cart is empty.</p>
                <button
                  onClick={() => { setIsCartOpen(false); router.push("/"); }}
                  className="bg-emerald-600 text-white font-bold text-sm px-6 py-2.5 rounded-full hover:bg-emerald-700 transition"
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
                      <Image src={details.image} alt={details.name} fill className="object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{details.name}</h4>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">{details.priceStr}</p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-md py-0.5 px-2 bg-white dark:bg-slate-900">
                          <button onClick={() => updateCartQuantity(item.chairId, item.quantity - 1)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                            <Minus className="w-3 h-3 text-slate-500" />
                          </button>
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-200 w-5 text-center">{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.chairId, item.quantity + 1)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                            <Plus className="w-3 h-3 text-slate-500" />
                          </button>
                        </div>
                        <button onClick={() => removeFromCart(item.chairId)} className="text-rose-600 hover:text-rose-700 p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/20">
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
                onClick={() => setIsCartOpen(false)}
                className="block text-center w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95"
              >
                Proceed to Checkout
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Side Drawer: Favorites */}
      <div className={`fixed inset-0 z-100 flex justify-end transition-opacity duration-300 ${isFavsOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setIsFavsOpen(false)} />
        {/* Panel */}
        <div className={`relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isFavsOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <span>My Favorites</span>
            </h3>
            <button onClick={() => setIsFavsOpen(false)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
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
                      <Image src={details.image} alt={details.name} fill className="object-cover" />
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{details.name}</h4>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">{details.priceStr}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <button
                          onClick={async () => {
                            await addToCart(chairId, 1);
                            setIsFavsOpen(false);
                            setIsCartOpen(true);
                          }}
                          className="bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition"
                        >
                          Add to Cart
                        </button>
                        <button onClick={() => toggleFavorite(chairId)} className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
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

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 z-40 bg-white dark:bg-slate-950 lg:hidden flex flex-col pt-24 px-6 transition-all duration-300 ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{
          transform: isMenuOpen ? "translateY(0)" : "translateY(-100%)",
        }}
      >
        <div className="flex flex-col gap-2 font-sans font-semibold text-lg tracking-tight">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`py-4 px-4 rounded-lg transition-colors ${
                  active
                    ? "text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/45"
                    : "text-slate-800 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          {isAdmin && (
            <Link href="/admin" className="py-4 px-4 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-900">
              Dashboard (Admin)
            </Link>
          )}
          {user && (
            <button
              onClick={signOut}
              className="w-full text-left py-4 px-4 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-bold"
            >
              Sign Out
            </button>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <Link href="/booking" className="inline-block text-center w-full bg-emerald-700 text-white py-3 rounded-xl font-bold text-base hover:brightness-105 active:scale-95 transition-all shadow-lg shadow-emerald-700/20">
            Book Showroom / Order
          </Link>
        </div>
      </div>
    </>
  );
}