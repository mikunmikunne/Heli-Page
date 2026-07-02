"use client";

import { useState } from "react";

export const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMsg("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setStatus("idle");
    setMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus("success");
        setMsg("Subscription successful! Thank you for your interest in Heli.");
        setEmail("");
      } else {
        setStatus("error");
        setMsg(data.error || "An error occurred. Please try again later.");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMsg("Network connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <span className="text-emerald-700 dark:text-emerald-400 font-extrabold tracking-widest uppercase text-xs mb-4 block">Newsletter</span>
        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
          Stay Informed on Wellness Tech
        </h2>
        <p className="text-slate-650 dark:text-slate-400 mb-8 max-w-xl mx-auto text-sm">
          Subscribe to get exclusive product offers, chiropractic advice, and updates directly from the Heli engineering team.
        </p>

        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address..."
            className="flex-grow px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white text-sm"
            required
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 py-4 rounded-2xl transition shadow-lg disabled:opacity-50 text-sm cursor-pointer shrink-0"
            disabled={loading}
          >
            {loading ? "Sending..." : "Subscribe"}
          </button>
        </form>

        {status !== "idle" && (
          <p className={`mt-4 text-sm font-semibold ${status === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"}`}>
            {msg}
          </p>
        )}
      </div>
    </section>
  );
};
