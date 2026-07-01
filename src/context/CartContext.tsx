"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/utils/supabaseClient";

export interface CartItem {
  chairId: string; // 'comfort' | 'balance' | 'luxe'
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  favorites: string[]; // array of chairId
  viewed: string[]; // array of chairId
  addToCart: (chairId: string, quantity?: number) => Promise<void>;
  removeFromCart: (chairId: string) => Promise<void>;
  updateCartQuantity: (chairId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleFavorite: (chairId: string) => Promise<void>;
  addToViewed: (chairId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewed, setViewed] = useState<string[]>([]);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "warning" } | null>(null);
  
  // Rate-limiting / spam prevention state (chairId -> last clicked timestamp)
  const [lastToggleTime, setLastToggleTime] = useState<Record<string, number>>({});

  const showToast = (message: string, type: "success" | "info" | "warning" = "success") => {
    setToast({ message, type });
  };

  // Clear toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // 1. Initial Load: Recently Viewed (always local storage)
  useEffect(() => {
    const savedViewed = localStorage.getItem("heli_recently_viewed");
    if (savedViewed) {
      try {
        setViewed(JSON.parse(savedViewed));
      } catch (e) {
        console.error("Failed to parse viewed items", e);
      }
    }
  }, []);

  // 2. Load Cart & Favorites from Supabase or Local Fallback
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          // Load Cart from DB
          const { data: dbCart, error: cartError } = await supabase
            .from("cart_items")
            .select("chair_id, quantity")
            .eq("user_id", user.id);

          if (cartError) {
            console.warn("Failed to load cart from Supabase, loading local fallback:", cartError.message);
            loadLocalCart();
          } else {
            setCart((dbCart || []).map((item: any) => ({ chairId: item.chair_id, quantity: item.quantity })));
          }

          // Load Favorites from DB
          const { data: dbFavs, error: favsError } = await supabase
            .from("favorites")
            .select("chair_id")
            .eq("user_id", user.id);

          if (favsError) {
            console.warn("Failed to load favorites from Supabase, loading local fallback:", favsError.message);
            loadLocalFavorites();
          } else {
            setFavorites((dbFavs || []).map((item: any) => item.chair_id));
          }

        } catch (err) {
          console.warn("Database connection issue. Using local storage fallbacks.", err);
          loadLocalFavorites();
          loadLocalCart();
        }
      } else {
        // Guest: load from localStorage
        loadLocalFavorites();
        loadLocalCart();
      }
    };

    const loadLocalFavorites = () => {
      const savedFavs = localStorage.getItem("heli_favorites");
      if (savedFavs) {
        try { setFavorites(JSON.parse(savedFavs)); } catch (e) { console.error(e); }
      } else {
        setFavorites([]);
      }
    };

    const loadLocalCart = () => {
      const savedCart = localStorage.getItem("heli_cart");
      if (savedCart) {
        try { setCart(JSON.parse(savedCart)); } catch (e) { console.error(e); }
      } else {
        setCart([]);
      }
    };

    loadData();
  }, [user]);

  // Helper to save local cart
  const saveLocalCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("heli_cart", JSON.stringify(newCart));
  };

  // Helper to save local favorites
  const saveLocalFavorites = (newFavs: string[]) => {
    setFavorites(newFavs);
    localStorage.setItem("heli_favorites", JSON.stringify(newFavs));
  };

  // 3. Add to Cart
  const addToCart = async (chairId: string, quantity = 1) => {
    const existing = cart.find((item) => item.chairId === chairId);
    let updatedCart: CartItem[] = [];

    if (existing) {
      updatedCart = cart.map((item) =>
        item.chairId === chairId ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      updatedCart = [...cart, { chairId, quantity }];
    }

    if (user) {
      try {
        const { error } = await supabase
          .from("cart_items")
          .upsert(
            { user_id: user.id, chair_id: chairId, quantity: (existing?.quantity || 0) + quantity },
            { onConflict: "user_id,chair_id" }
          );

        if (error) {
          console.warn("Failed to sync cart item with database, using local storage:", error.message);
          saveLocalCart(updatedCart);
        } else {
          setCart(updatedCart);
        }
      } catch (err) {
        saveLocalCart(updatedCart);
      }
    } else {
      saveLocalCart(updatedCart);
    }
    showToast("Đã thêm sản phẩm vào giỏ hàng thành công!", "success");
  };

  // 4. Remove from Cart
  const removeFromCart = async (chairId: string) => {
    const updatedCart = cart.filter((item) => item.chairId !== chairId);

    if (user) {
      try {
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", user.id)
          .eq("chair_id", chairId);

        if (error) {
          console.warn("Failed to sync cart delete with database, using local storage:", error.message);
          saveLocalCart(updatedCart);
        } else {
          setCart(updatedCart);
        }
      } catch (err) {
        saveLocalCart(updatedCart);
      }
    } else {
      saveLocalCart(updatedCart);
    }
    showToast("Đã xóa sản phẩm khỏi giỏ hàng.", "info");
  };

  // 5. Update Cart Quantity
  const updateCartQuantity = async (chairId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(chairId);
      return;
    }

    const updatedCart = cart.map((item) =>
      item.chairId === chairId ? { ...item, quantity } : item
    );

    if (user) {
      try {
        const { error } = await supabase
          .from("cart_items")
          .upsert(
            { user_id: user.id, chair_id: chairId, quantity },
            { onConflict: "user_id,chair_id" }
          );

        if (error) {
          console.warn("Failed to update quantity in database, using local storage:", error.message);
          saveLocalCart(updatedCart);
        } else {
          setCart(updatedCart);
        }
      } catch (err) {
        saveLocalCart(updatedCart);
      }
    } else {
      saveLocalCart(updatedCart);
    }
  };

  // 6. Clear Cart
  const clearCart = async () => {
    if (user) {
      try {
        await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", user.id);
      } catch (err) {
        console.error(err);
      }
    }
    saveLocalCart([]);
  };

  // 7. Toggle Favorite (with Spam Protection & Toast Feedbacks)
  const toggleFavorite = async (chairId: string) => {
    // Spam protection check (1.5 seconds cooldown)
    const now = Date.now();
    const lastTime = lastToggleTime[chairId] || 0;
    if (now - lastTime < 1500) {
      showToast("Thao tác quá nhanh! Vui lòng đợi một lát.", "warning");
      return;
    }
    setLastToggleTime((prev) => ({ ...prev, [chairId]: now }));

    const isFav = favorites.includes(chairId);
    let updatedFavs: string[] = [];

    if (isFav) {
      updatedFavs = favorites.filter((id) => id !== chairId);
    } else {
      updatedFavs = [...favorites, chairId];
    }

    if (user) {
      try {
        if (isFav) {
          // Delete
          const { error } = await supabase
            .from("favorites")
            .delete()
            .eq("user_id", user.id)
            .eq("chair_id", chairId);

          if (error) {
            console.warn("Failed to remove favorite in database, using local storage:", error.message);
            saveLocalFavorites(updatedFavs);
          } else {
            setFavorites(updatedFavs);
          }
          showToast("Đã xóa khỏi danh sách yêu thích.", "info");
        } else {
          // Insert
          const { error } = await supabase
            .from("favorites")
            .insert({ user_id: user.id, chair_id: chairId });

          if (error) {
            console.warn("Failed to add favorite in database, using local storage:", error.message);
            saveLocalFavorites(updatedFavs);
          } else {
            setFavorites(updatedFavs);
          }
          showToast("Đã thêm vào danh sách yêu thích thành công!", "success");
        }
      } catch (err) {
        saveLocalFavorites(updatedFavs);
        showToast(isFav ? "Đã xóa khỏi danh sách yêu thích." : "Đã thêm vào danh sách yêu thích thành công!", "success");
      }
    } else {
      saveLocalFavorites(updatedFavs);
      showToast(isFav ? "Đã xóa khỏi danh sách yêu thích." : "Đã thêm vào danh sách yêu thích thành công!", "success");
    }
  };

  // 8. Add to Viewed (always local storage)
  const addToViewed = (chairId: string) => {
    setViewed((prev) => {
      const filtered = prev.filter((id) => id !== chairId);
      const newViewed = [chairId, ...filtered].slice(0, 3); // keep top 3
      localStorage.setItem("heli_recently_viewed", JSON.stringify(newViewed));
      return newViewed;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        favorites,
        viewed,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleFavorite,
        addToViewed,
      }}
    >
      {children}

      {/* Modern floating toast notification */}
      {toast && (
        <div className={`fixed bottom-24 right-6 z-100 flex items-center gap-2 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-md transition-all duration-300 animate-bounce ${
          toast.type === "success" 
            ? "bg-emerald-600/90 text-white border-emerald-500/50" 
            : toast.type === "warning"
            ? "bg-amber-500/90 text-white border-amber-400/50"
            : "bg-slate-800/95 text-white border-slate-700/50"
        }`}>
          {toast.type === "success" && (
            <svg className="w-4 h-4 shrink-0 text-white animate-pulse" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
          {toast.type === "warning" && (
            <svg className="w-4 h-4 shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          <span className="text-xs font-black tracking-wide font-sans">{toast.message}</span>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
