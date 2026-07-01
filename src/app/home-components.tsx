"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, ArrowRight, Shield, Activity, Sparkles, Star, ChevronDown, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { CHAIR_MODELS } from "@/utils/chairModels";
import { useRouter } from "next/navigation";

export const Hero = () => {
  return (
    <section className="relative pt-28 pb-12 sm:pt-36 sm:pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100/80 dark:bg-emerald-950/40 rounded-full text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Wellness Technology</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6 text-balance tracking-tight">
            The Future of <span className="text-emerald-600 dark:text-emerald-400">Intelligent</span> Relaxation
          </h1>
          <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-xl leading-relaxed">
            Experience therapeutic healing at home with Heli's smart massage chairs. Guided by biosensors to scan posture and locate pain points automatically.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="#products" className="inline-flex items-center justify-center bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-emerald-600/30 transition-all text-center">
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
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
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
        </motion.div>
      </div>
    </section>
  );
};

export const Benefits = () => {
  const { cart, favorites, addToCart, toggleFavorite, addToViewed } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleProductAction = (chairId: string, action: "cart" | "order" | "detail") => {
    addToViewed(chairId);
    
    if (action === "cart") {
      addToCart(chairId, 1);
    } else if (action === "order") {
      router.push(`/booking?chair=${chairId}`);
    }
  };

  return (
    <section id="products" className="py-20 bg-white dark:bg-slate-950 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold tracking-widest uppercase text-xs mb-4 block">Heli Smart Series</span>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Compare Our Models</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-xl mx-auto">
            Choose the model that fits your lifestyle. Get custom biosensor scanning, smart app support, or advanced graphene heat therapy.
          </p>
        </div>

        {/* 3 models cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {Object.entries(CHAIR_MODELS).map(([id, details]) => {
            const isFav = favorites.includes(id);
            return (
              <motion.div 
                key={id}
                whileHover={{ y: -8 }}
                onClick={() => addToViewed(id)}
                className="group rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-8 hover:shadow-xl hover:shadow-emerald-600/5 transition-all flex flex-col justify-between overflow-hidden relative"
              >
                {/* Favorite Heart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!user) {
                      router.push("/login");
                    } else {
                      toggleFavorite(id);
                    }
                  }}
                  className="absolute top-6 right-6 z-20 p-2.5 rounded-full bg-white dark:bg-slate-800 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  aria-label="Add to favorites"
                >
                  <Heart className={`w-5 h-5 transition-colors ${isFav ? "text-rose-500 fill-rose-500" : "text-slate-400 dark:text-slate-500 hover:text-rose-500"}`} />
                </button>

                <div>
                  {/* Image */}
                  <div className="relative w-full h-56 rounded-2xl overflow-hidden mb-6 bg-slate-100">
                    <Image 
                      src={details.image} 
                      alt={details.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>

                  {/* Title & Price */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">{details.name}</h3>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-4">{details.desc}</p>
                  
                  <div className="mb-6">
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{details.priceStr}</p>
                    <p className="text-xs text-slate-400 font-semibold mt-1">Pre-order deposit 20%: {details.depositStr}</p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5 border-t border-slate-200 dark:border-slate-800 pt-6 mb-8">
                    {details.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Buy Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => handleProductAction(id, "cart")}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3.5 rounded-xl font-bold hover:bg-emerald-700 transition active:scale-98 shadow-md cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={() => handleProductAction(id, "order")}
                    className="w-full py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl transition active:scale-98 cursor-pointer"
                  >
                    Pre-order Now
                  </button>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Recently Viewed Products */}
        <RecentlyViewed />

      </div>
    </section>
  );
};

// Subcomponent: Recently Viewed
const RecentlyViewed = () => {
  const { viewed } = useCart();
  
  if (viewed.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-t border-slate-200 dark:border-slate-800 pt-16 mt-16"
    >
      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Recently Viewed Products</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {viewed.map((id) => {
          const details = CHAIR_MODELS[id];
          if (!details) return null;
          return (
            <Link key={id} href="#products" className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 hover:brightness-95 transition-all">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                <Image src={details.image} alt={details.name} fill className="object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{details.name}</h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">{details.priceStr}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
};

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
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold tracking-widest uppercase text-xs mb-4 block">Process</span>
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
                  src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=600" 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="rounded-3xl shadow-lg object-cover"
                  alt="Heli relaxation experience"
                />
              </div>
            </div>
            <div>
              <div className="relative w-full h-[250px] sm:h-[300px] lg:h-[400px]">
                <Image 
                  src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=600" 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
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
          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold tracking-widest uppercase text-xs mb-4 block">Testimonials</span>
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
                  <Image src={review.avatar} alt={review.name} fill className="object-cover" />
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

const faqData = [
  {
    question: "Does the Heli chair automatically adapt to my body shape?",
    answer: "Yes! All Heli models feature smart body scanning. On start, they scan your height, spine alignment, and shoulders to customize con-roller paths and pressure points for optimized comfort."
  },
  {
    question: "What is the pre-order deposit policy?",
    answer: "To pre-order any model, a secure 20% deposit is processed via VNPay Sandbox. The remaining 80% is payable upon delivery, inspection, and successful setup in your home."
  },
  {
    question: "How does the showroom experience trial work?",
    answer: "You can book a 45-minute individual session at our Heli Wellness Showroom for 200,000 VND. You will get a dedicated health consultation and full access to test all Comfort, Balance, and Luxe models."
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
          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold tracking-widest uppercase text-xs mb-4 block">FAQ</span>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Questions & Answers</h2>
          <p className="text-slate-600 dark:text-slate-400">Everything you need to know about the Heli Smart Massage Chair experience.</p>
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
                  <div className="p-6 pt-0 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/80 dark:border-slate-800/50">
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
          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold tracking-widest uppercase text-xs mb-4 block">Specifications</span>
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
                    ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
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
                <span className="text-emerald-600 dark:text-emerald-400 font-black text-base">{activeData.price}</span>
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
                <td className="p-4 md:p-6 text-emerald-600 dark:text-emerald-400 font-extrabold whitespace-nowrap">15,000,000 VND</td>
                <td className="p-4 md:p-6 text-emerald-600 dark:text-emerald-400 font-extrabold whitespace-nowrap">30,000,000 VND</td>
                <td className="p-4 md:p-6 text-emerald-600 dark:text-emerald-400 font-extrabold whitespace-nowrap">50,000,000 VND</td>
              </tr>
              <tr>
                <td className="p-4 md:p-6 font-bold text-slate-900 dark:text-slate-200 bg-slate-50/30 dark:bg-slate-800/10">Deposit Amount (20%)</td>
                <td className="p-4 md:p-6 text-slate-600 dark:text-slate-300 whitespace-nowrap">3,000,000 VND</td>
                <td className="p-4 md:p-6 text-slate-600 dark:text-slate-300 whitespace-nowrap">6,000,000 VND</td>
                <td className="p-4 md:p-6 text-slate-600 dark:text-slate-300 whitespace-nowrap">10,000,000 VND</td>
              </tr>
              <tr>
                <td className="p-4 md:p-6 font-bold text-slate-900 dark:text-slate-200 bg-slate-50/30 dark:bg-slate-800/10">Roller Mechanism</td>
                <td className="p-4 md:p-6 text-slate-600 dark:text-slate-300">2D Fixed Track</td>
                <td className="p-4 md:p-6 text-slate-600 dark:text-slate-300">3D Intelligent Rollers</td>
                <td className="p-4 md:p-6 text-slate-600 dark:text-slate-300">4D Dynamic SL-Track Rollers</td>
              </tr>
              <tr>
                <td className="p-4 md:p-6 font-bold text-slate-900 dark:text-slate-200 bg-slate-50/30 dark:bg-slate-800/10">AI Contours Scanning</td>
                <td className="p-4 md:p-6 text-slate-600 dark:text-slate-300">Standard Auto-Height Check</td>
                <td className="p-4 md:p-6 text-slate-600 dark:text-slate-300">Full Body-Scan Contour Calibration</td>
                <td className="p-4 md:p-6 text-slate-600 dark:text-slate-300">Biosensor Pain & Soreness Diagnostics</td>
              </tr>
              <tr>
                <td className="p-4 md:p-6 font-bold text-slate-900 dark:text-slate-200 bg-slate-50/30 dark:bg-slate-800/10">Zero Gravity Angles</td>
                <td className="p-4 md:p-6 text-slate-600 dark:text-slate-300">Single Tilt Position</td>
                <td className="p-4 md:p-6 text-slate-600 dark:text-slate-300">Dual Stage Zero-Gravity</td>
                <td className="p-4 md:p-6 text-slate-600 dark:text-slate-300">Triple Stage Zero-Gravity 4D Linkage</td>
              </tr>
              <tr>
                <td className="p-4 md:p-6 font-bold text-slate-900 dark:text-slate-200 bg-slate-50/30 dark:bg-slate-800/10">Airbag Massage Areas</td>
                <td className="p-4 md:p-6 text-slate-600 dark:text-slate-300">Shoulders & Calves (16 Airbags)</td>
                <td className="p-4 md:p-6 text-slate-600 dark:text-slate-300">Full Body Compression (32 Airbags)</td>
                <td className="p-4 md:p-6 text-slate-600 dark:text-slate-300">Full Body Segmented Compression (48 Airbags)</td>
              </tr>
              <tr>
                <td className="p-4 md:p-6 font-bold text-slate-900 dark:text-slate-200 bg-slate-50/30 dark:bg-slate-800/10">App Support</td>
                <td className="p-4 md:p-6 text-slate-600 dark:text-slate-300">No</td>
                <td className="p-4 md:p-6 text-slate-600 dark:text-slate-300">Yes (iOS & Android via Bluetooth)</td>
                <td className="p-4 md:p-6 text-slate-600 dark:text-slate-300">Yes (iOS & Android, Remote Over-The-Air)</td>
              </tr>
              <tr>
                <td className="p-4 md:p-6 font-bold text-slate-900 dark:text-slate-200 bg-slate-50/30 dark:bg-slate-800/10">Voice Control</td>
                <td className="p-4 md:p-6 text-slate-600 dark:text-slate-300">No</td>
                <td className="p-4 md:p-6 text-slate-600 dark:text-slate-300">Yes (Offline Preset Commands)</td>
                <td className="p-4 md:p-6 text-slate-600 dark:text-slate-300">Yes (Real-time Online Intelligent Voice AI)</td>
              </tr>
              <tr>
                <td className="p-4 md:p-6 font-bold text-slate-900 dark:text-slate-200 bg-slate-50/30 dark:bg-slate-800/10">Warranty Duration</td>
                <td className="p-4 md:p-6 text-slate-600 dark:text-slate-300">3 Years Structural</td>
                <td className="p-4 md:p-6 text-slate-600 dark:text-slate-300">5 Years Full Hardware</td>
                <td className="p-4 md:p-6 text-slate-600 dark:text-slate-300">5 Years Full Hardware + Lifetime Service</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMsg("Vui lòng nhập địa chỉ email hợp lệ.");
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
        setMsg("Đăng ký thành công! Cảm ơn bạn đã quan tâm đến Heli.");
        setEmail("");
      } else {
        setStatus("error");
        setMsg(data.error || "Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMsg("Lỗi kết nối mạng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold tracking-widest uppercase text-xs mb-4 block">Newsletter</span>
        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
          Stay Informed on Wellness Tech
        </h2>
        <p className="text-slate-550 dark:text-slate-400 mb-8 max-w-xl mx-auto text-sm">
          Subscribe to get exclusive product offers, chiropractic advice, and updates directly from the Heli engineering team.
        </p>

        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập địa chỉ email của bạn..."
            className="flex-grow px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white text-sm"
            required
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-2xl transition shadow-lg disabled:opacity-50 text-sm cursor-pointer shrink-0"
            disabled={loading}
          >
            {loading ? "Đang gửi..." : "Đăng ký nhận tin"}
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