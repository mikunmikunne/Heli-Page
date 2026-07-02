"use client";

import Link from "next/link";

export const CTA = () => {
  return (
    <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900/40">
      <div className="max-w-7xl mx-auto bg-emerald-700 dark:bg-emerald-800/80 rounded-[3rem] p-12 lg:p-24 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-[120px]" />
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 leading-tight tracking-tight">Ready to Elevate Your Wellness?</h2>
          <p className="text-white/95 text-xl mb-12">Pre-order today and secure a 5-year full warranty and free delivery.</p>
          
          <Link href="/booking" className="inline-block bg-white text-emerald-700 hover:scale-105 transition-transform px-10 py-5 rounded-2xl font-black text-xl shadow-xl">
            Book Trial / Buy
          </Link>
        </div>
      </div>
    </section>
  );
};
