"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative pt-28 pb-12 sm:pt-36 sm:pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100/80 dark:bg-emerald-950/40 rounded-full text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Wellness Technology</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6 text-balance tracking-tight">
            The Future of <span className="text-emerald-700 dark:text-emerald-400">Intelligent</span> Relaxation
          </h1>
          <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-xl leading-relaxed">
            Experience therapeutic healing at home with Heli's smart massage chairs. Guided by biosensors to scan posture and locate pain points automatically.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="#products" className="inline-flex items-center justify-center bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-700/20 hover:bg-emerald-800 hover:shadow-emerald-750/30 transition-all text-center">
              Explore Models
            </Link>
            <Link href="/booking" className="inline-flex items-center justify-center border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center">
              Book Showroom Trial
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative w-12 h-12 rounded-full border-4 border-white dark:border-slate-950 overflow-hidden shrink-0">
                  <Image 
                    src={`https://picsum.photos/seed/user${i}/100/100`} 
                    alt={`User avatar ${i}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Rated <span className="text-slate-900 dark:text-white font-black">4.9/5 stars</span> by over <span className="text-slate-900 dark:text-white font-black">10,000+</span> wellness enthusiasts
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -top-10 -right-10 w-96 h-96 bg-emerald-200/20 dark:bg-emerald-800/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/3] sm:aspect-[16/11]">
            <Image 
              src="/menu.jpeg" 
              alt="Premium Heli Smart Massage Chair"
              fill
              className="object-cover"
              priority
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </section>
  );
};