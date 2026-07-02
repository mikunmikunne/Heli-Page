"use client";

import Image from "next/image";

export const Steps = () => {
  const stepsData = [
    { step: "01", title: "Select Your Model", desc: "Browse Comfort, Balance, and Luxe models, comparing details and intelligent feature packages." },
    { step: "02", title: "Order or Try", desc: "Select direct Pre-order with 20% VNPay deposit, or book a private trial session at our showroom." },
    { step: "03", title: "Stress-Free Setup", desc: "We provide white-glove professional home delivery and installation, and 5 years full warranty." }
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="w-full lg:w-1/2">
            <span className="text-emerald-700 dark:text-emerald-400 font-extrabold tracking-widest uppercase text-xs mb-4 block">Process</span>
            <h2 className="text-4xl text-slate-900 dark:text-white lg:text-5xl font-black mb-8 leading-tight tracking-tight">Getting Your Heli</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-12">We guarantee a seamless journey from model customization to doorstep white-glove installation.</p>
            
            <div className="space-y-10">
              {stepsData.map((item, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/65 text-emerald-950 dark:text-emerald-300 flex items-center justify-center font-black">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:mt-0">
            <div className="pt-0 sm:pt-12">
              <div className="relative w-full h-[250px] sm:h-[300px] lg:h-[400px]">
                <Image 
                  src="https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600" 
                  fill
                  sizes="(max-width: 640px) 240px, (max-width: 768px) 320px, 400px"
                  className="rounded-3xl shadow-lg object-cover"
                  alt="Heli smart relaxation experience"
                />
              </div>
            </div>
            <div>
              <div className="relative w-full h-[250px] sm:h-[300px] lg:h-[400px]">
                <Image 
                  src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=600" 
                  fill
                  sizes="(max-width: 640px) 240px, (max-width: 768px) 320px, 400px"
                  className="rounded-3xl shadow-lg object-cover animate-pulse"
                  alt="Modern Heli Wellness Setting"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
