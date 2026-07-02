"use client";

import { useState } from "react";

export const SpecsSection = () => {
  const [activeModel, setActiveModel] = useState<"comfort" | "balance" | "luxe">("comfort");

  const specsData = {
    comfort: {
      name: "Heli Comfort (Standard)",
      price: "15,000,000 VND",
      deposit: "3,000,000 VND",
      roller: "2D Fixed Track",
      scan: "Standard Auto-Height Check",
      zero: "Single Tilt Position",
      airbags: "Shoulders & Calves (16 Airbags)",
      app: "No",
      voice: "No",
      warranty: "3 Years Structural",
    },
    balance: {
      name: "Heli Balance (Premium)",
      price: "30,000,000 VND",
      deposit: "6,000,000 VND",
      roller: "3D Intelligent Rollers",
      scan: "Full Body-Scan Contour Calibration",
      zero: "Dual Stage Zero-Gravity",
      airbags: "Full Body Compression (32 Airbags)",
      app: "Yes (iOS & Android via Bluetooth)",
      voice: "Yes (Offline Preset Commands)",
      warranty: "5 Years Full Hardware",
    },
    luxe: {
      name: "Heli Luxe (Ultimate)",
      price: "50,000,000 VND",
      deposit: "10,000,000 VND",
      roller: "4D Dynamic SL-Track Rollers",
      scan: "Biosensor Pain & Soreness Diagnostics",
      zero: "Triple Stage Zero-Gravity 4D Linkage",
      airbags: "Full Body Segmented Compression (48 Airbags)",
      app: "Yes (iOS & Android, Remote Over-The-Air)",
      voice: "Yes (Real-time Online Intelligent Voice AI)",
      warranty: "5 Years Full Hardware + Lifetime Service",
    }
  };

  const activeData = specsData[activeModel];

  return (
    <section id="specs" className="py-20 bg-slate-50 dark:bg-slate-900/40 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-emerald-700 dark:text-emerald-400 font-extrabold tracking-widest uppercase text-xs mb-4 block">Specifications</span>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Technical Comparison</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-xl mx-auto text-sm">
            Review detailed specifications of the Comfort, Balance, and Luxe models to find the perfect therapeutic match.
          </p>
        </div>

        {/* 1. MOBILE VIEW: Tabbed Specifications (hidden on Desktop) */}
        <div className="block sm:hidden">
          {/* Tabs Nav */}
          <div className="flex bg-slate-200/60 dark:bg-slate-800/60 rounded-2xl p-1 gap-1 mb-6">
            {(["comfort", "balance", "luxe"] as const).map((model) => (
              <button
                key={model}
                onClick={() => setActiveModel(model)}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  activeModel === model
                    ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-white shadow-sm"
                    : "text-slate-650 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                {model === "comfort" ? "Comfort" : model === "balance" ? "Balance" : "Luxe"}
              </button>
            ))}
          </div>

          {/* Tab Content Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xl space-y-5">
            <div className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">{activeData.name}</h3>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider font-extrabold">Price</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-black text-base">{activeData.price}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-start gap-4">
                <span className="text-slate-900 dark:text-slate-100 font-bold shrink-0">Deposit (20%)</span>
                <span className="text-slate-500 dark:text-slate-400 font-medium text-right">{activeData.deposit}</span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-slate-900 dark:text-slate-100 font-bold shrink-0">Roller Mechanism</span>
                <span className="text-slate-500 dark:text-slate-400 font-medium text-right">{activeData.roller}</span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-slate-900 dark:text-slate-100 font-bold shrink-0">AI Body Scan</span>
                <span className="text-slate-500 dark:text-slate-400 font-medium text-right">{activeData.scan}</span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-slate-900 dark:text-slate-100 font-bold shrink-0">Zero Gravity</span>
                <span className="text-slate-500 dark:text-slate-400 font-medium text-right">{activeData.zero}</span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-slate-900 dark:text-slate-100 font-bold shrink-0">Airbag Massage</span>
                <span className="text-slate-500 dark:text-slate-400 font-medium text-right">{activeData.airbags}</span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-slate-900 dark:text-slate-100 font-bold shrink-0">App Support</span>
                <span className="text-slate-500 dark:text-slate-400 font-medium text-right">{activeData.app}</span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-slate-900 dark:text-slate-100 font-bold shrink-0">Voice Control</span>
                <span className="text-slate-500 dark:text-slate-400 font-medium text-right">{activeData.voice}</span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-slate-900 dark:text-slate-100 font-bold shrink-0">Warranty</span>
                <span className="text-slate-500 dark:text-slate-400 font-medium text-right">{activeData.warranty}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. DESKTOP VIEW: Full Wide Comparison Table (hidden on Mobile) */}
        <div className="hidden sm:block overflow-x-auto rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900">
          <table className="w-full text-left border-collapse text-sm min-w-[780px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 md:p-6 font-bold text-slate-900 dark:text-slate-100">Feature Specs</th>
                <th className="p-4 md:p-6 font-bold text-slate-900 dark:text-slate-100">Heli Comfort (Standard)</th>
                <th className="p-4 md:p-6 font-bold text-slate-900 dark:text-slate-100">Heli Balance (Premium)</th>
                <th className="p-4 md:p-6 font-bold text-slate-900 dark:text-slate-100">Heli Luxe (Ultimate)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              <tr>
                <td className="p-4 md:p-6 font-bold text-slate-900 dark:text-slate-200 bg-slate-50/30 dark:bg-slate-800/10">Retail Price</td>
                <td className="p-4 md:p-6 text-emerald-700 dark:text-emerald-400 font-extrabold whitespace-nowrap">15,000,000 VND</td>
                <td className="p-4 md:p-6 text-emerald-700 dark:text-emerald-400 font-extrabold whitespace-nowrap">30,000,000 VND</td>
                <td className="p-4 md:p-6 text-emerald-700 dark:text-emerald-400 font-extrabold whitespace-nowrap">50,000,000 VND</td>
              </tr>
              <tr>
                <td className="p-4 md:p-6 font-bold text-slate-900 dark:text-slate-200 bg-slate-50/30 dark:bg-slate-800/10">Deposit Amount (20%)</td>
                <td className="p-4 md:p-6 text-slate-650 dark:text-slate-300 whitespace-nowrap">3,000,000 VND</td>
                <td className="p-4 md:p-6 text-slate-650 dark:text-slate-300 whitespace-nowrap">6,000,000 VND</td>
                <td className="p-4 md:p-6 text-slate-650 dark:text-slate-300 whitespace-nowrap">10,000,000 VND</td>
              </tr>
              <tr>
                <td className="p-4 md:p-6 font-bold text-slate-900 dark:text-slate-200 bg-slate-50/30 dark:bg-slate-800/10">Roller Mechanism</td>
                <td className="p-4 md:p-6 text-slate-650 dark:text-slate-300">2D Fixed Track</td>
                <td className="p-4 md:p-6 text-slate-650 dark:text-slate-300">3D Intelligent Rollers</td>
                <td className="p-4 md:p-6 text-slate-650 dark:text-slate-300">4D Dynamic SL-Track Rollers</td>
              </tr>
              <tr>
                <td className="p-4 md:p-6 font-bold text-slate-900 dark:text-slate-200 bg-slate-50/30 dark:bg-slate-800/10">AI Contours Scanning</td>
                <td className="p-4 md:p-6 text-slate-650 dark:text-slate-300">Standard Auto-Height Check</td>
                <td className="p-4 md:p-6 text-slate-650 dark:text-slate-300">Full Body-Scan Contour Calibration</td>
                <td className="p-4 md:p-6 text-slate-650 dark:text-slate-300">Biosensor Pain & Soreness Diagnostics</td>
              </tr>
              <tr>
                <td className="p-4 md:p-6 font-bold text-slate-900 dark:text-slate-200 bg-slate-50/30 dark:bg-slate-800/10">Zero Gravity Angles</td>
                <td className="p-4 md:p-6 text-slate-650 dark:text-slate-300">Single Tilt Position</td>
                <td className="p-4 md:p-6 text-slate-650 dark:text-slate-300">Dual Stage Zero-Gravity</td>
                <td className="p-4 md:p-6 text-slate-650 dark:text-slate-300">Triple Stage Zero-Gravity 4D Linkage</td>
              </tr>
              <tr>
                <td className="p-4 md:p-6 font-bold text-slate-900 dark:text-slate-200 bg-slate-50/30 dark:bg-slate-800/10">Airbag Massage Areas</td>
                <td className="p-4 md:p-6 text-slate-650 dark:text-slate-300">Shoulders & Calves (16 Airbags)</td>
                <td className="p-4 md:p-6 text-slate-650 dark:text-slate-300">Full Body Compression (32 Airbags)</td>
                <td className="p-4 md:p-6 text-slate-650 dark:text-slate-300">Full Body Segmented Compression (48 Airbags)</td>
              </tr>
              <tr>
                <td className="p-4 md:p-6 font-bold text-slate-900 dark:text-slate-200 bg-slate-50/30 dark:bg-slate-800/10">App Support</td>
                <td className="p-4 md:p-6 text-slate-650 dark:text-slate-300">No</td>
                <td className="p-4 md:p-6 text-slate-650 dark:text-slate-300">Yes (iOS & Android via Bluetooth)</td>
                <td className="p-4 md:p-6 text-slate-650 dark:text-slate-300">Yes (iOS & Android, Remote Over-The-Air)</td>
              </tr>
              <tr>
                <td className="p-4 md:p-6 font-bold text-slate-900 dark:text-slate-200 bg-slate-50/30 dark:bg-slate-800/10">Voice Control</td>
                <td className="p-4 md:p-6 text-slate-650 dark:text-slate-300">No</td>
                <td className="p-4 md:p-6 text-slate-650 dark:text-slate-300">Yes (Offline Preset Commands)</td>
                <td className="p-4 md:p-6 text-slate-650 dark:text-slate-300">Yes (Real-time Online Intelligent Voice AI)</td>
              </tr>
              <tr>
                <td className="p-4 md:p-6 font-bold text-slate-900 dark:text-slate-200 bg-slate-50/30 dark:bg-slate-800/10">Warranty Duration</td>
                <td className="p-4 md:p-6 text-slate-650 dark:text-slate-300">3 Years Structural</td>
                <td className="p-4 md:p-6 text-slate-650 dark:text-slate-300">5 Years Full Hardware</td>
                <td className="p-4 md:p-6 text-slate-650 dark:text-slate-300">5 Years Full Hardware + Lifetime Service</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
