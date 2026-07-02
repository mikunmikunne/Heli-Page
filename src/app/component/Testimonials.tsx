"use client";

import Image from "next/image";
import { Star } from "lucide-react";

export const Testimonials = () => {
  const reviewsData = [
    {
      name: "Hoang Nguyen",
      role: "Software Architect, VNG Corp",
      text: "The Heli Luxe biosensors accurately detected my shoulder strain. The 4D Zero-Gravity is absolute magic after long coding hours.",
      avatar: "https://picsum.photos/seed/hoang/100/100"
    },
    {
      name: "Thuong Mai",
      role: "Wellness Advisor, Healthy Living Co.",
      text: "As an ergonomics advisor, I highly recommend Heli Balance. The custom airbag pressure is incredibly accurate and soothing.",
      avatar: "https://picsum.photos/seed/thuong/100/100"
    },
    {
      name: "Tuan Tran",
      role: "Freelance Designer",
      text: "Ordered the Heli Comfort. Compact design, beautiful leather, and fits perfectly in my home office. Love the Bluetooth speakers!",
      avatar: "https://picsum.photos/seed/tuan/100/100"
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-emerald-700 dark:text-emerald-400 font-extrabold tracking-widest uppercase text-xs mb-4 block">Testimonials</span>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">What Owners Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviewsData.map((review, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 hover:shadow-lg transition-all duration-350">
              <div className="flex text-amber-500 mb-6">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={16} fill="currentColor" />)}
              </div>
              <p className="text-lg text-slate-700 dark:text-slate-300 italic mb-8">&quot;{review.text}&quot;</p>
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                  <Image src={review.avatar} alt={review.name} fill sizes="48px" className="object-cover" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{review.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
