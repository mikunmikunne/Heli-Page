"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";

const faqData = [
  {
    question: "Does the Heli chair automatically adapt to my body shape?",
    answer: "Yes! All Heli models feature smart body scanning. On start, they scan your height, spine alignment, and shoulders to customize roller paths and pressure points for optimized comfort."
  },
  {
    question: "What is the pre-order deposit policy?",
    answer: "To pre-order any model, a secure 20% deposit is processed via VNPay Sandbox. The remaining 80% is payable upon delivery, inspection, and successful setup in your home."
  },
  {
    question: "How does the showroom experience trial work?",
    answer: "You can book a 45-minute individual showroom trial session entirely for free. You will get a dedicated health consultation and full access to test all Comfort, Balance, and Luxe models."
  },
  {
    question: "What does the 5-year warranty cover?",
    answer: "Our 5-year warranty covers all structural frames, mechanics, electronics, biological sensors, and software systems. We support lifetime local maintenance and software updates."
  }
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-emerald-700 dark:text-emerald-400 font-extrabold tracking-widest uppercase text-xs mb-4 block">FAQ</span>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Questions & Answers</h2>
          <p className="text-slate-650 dark:text-slate-400">Everything you need to know about the Heli Smart Massage Chair experience.</p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900/50 hover:border-emerald-600/30 dark:hover:border-emerald-400/30 transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-lg text-slate-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 text-emerald-600 dark:text-emerald-400"
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 text-slate-650 dark:text-slate-400 leading-relaxed border-t border-slate-200/80 dark:border-slate-800/50">
                    {faq.answer}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
