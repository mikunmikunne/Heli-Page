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

  // Render nothing visually to users (runs completely silently in the background while logging to database & console)
  return null;
}
