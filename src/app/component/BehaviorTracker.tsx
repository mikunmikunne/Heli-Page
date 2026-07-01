"use client";

import { useEffect, useState } from "react";

interface TrackedEvent {
  id: string;
  type: "scroll" | "click";
  label: string;
  timestamp: string;
}

export default function BehaviorTracker() {
  const [toasts, setToasts] = useState<TrackedEvent[]>([]);

  // Show Toast helper
  const addToast = (type: "scroll" | "click", label: string) => {
    const newEvent: TrackedEvent = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      label,
      timestamp: new Date().toLocaleTimeString(),
    };
    
    // Add toast
    setToasts((prev) => [...prev, newEvent].slice(-3)); // Show maximum of 3 toasts at once

    // Auto remove after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newEvent.id));
    }, 3500);

    // POST tracking payload to API
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        label,
        url: window.location.href,
        path: window.location.pathname,
        referrer: document.referrer,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
      }),
    }).catch((err) => console.error("[Tracker] Failed to send event to webhook:", err));
  };

  useEffect(() => {
    // 1. SCROLL DEPTH TRACKING
    const trackedDepths = new Set<number>();
    
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (docHeight <= 0) return;
      
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      // Define thresholds
      const thresholds = [25, 50, 75, 100];
      for (const threshold of thresholds) {
        if (scrollPercent >= threshold && !trackedDepths.has(threshold)) {
          trackedDepths.add(threshold);
          addToast("scroll", `Cuộn trang đạt ${threshold}%`);
        }
      }
    };

    // 2. CLICK EVENT TRACKING
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Find closest interactive element
      const interactiveEl = target.closest("button, a") as HTMLElement | null;
      if (!interactiveEl) return;

      const elementText = interactiveEl.innerText?.trim() || interactiveEl.getAttribute("aria-label") || "";
      const elementId = interactiveEl.id ? `#${interactiveEl.id}` : "";
      
      // Extract track info
      const eventLabel = elementText 
        ? `Click nút: "${elementText}"` 
        : `Click phần tử ${interactiveEl.tagName.toLowerCase()}${elementId}`;

      addToast("click", eventLabel);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-100 flex flex-col gap-3 pointer-events-none max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-center gap-3 px-5 py-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-emerald-500/30 rounded-2xl shadow-xl shadow-emerald-500/5 animate-slideIn pointer-events-auto transition-all duration-300"
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
            {toast.type === "scroll" ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.303-.053-1.593 1.593M21.75 12h-2.25m-.053 5.303-1.593-1.593M12 19.5v2.25m-5.303-.053 1.593-1.593M2.25 12h2.25m.053-5.303 1.593 1.593" />
              </svg>
            )}
          </div>
          <div>
            <p className="text-[10px] uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400">
              {toast.type === "scroll" ? "Scroll Tracking" : "Click Tracking"}
            </p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {toast.label}
            </p>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold ml-auto shrink-0 self-end">
            {toast.timestamp}
          </span>
        </div>
      ))}
    </div>
  );
}
