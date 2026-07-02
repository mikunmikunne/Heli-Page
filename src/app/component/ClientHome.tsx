"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

const Benefits = dynamic(() => import("./Benefits").then((m) => m.Benefits), { ssr: false });
const SpecsSection = dynamic(() => import("./SpecsSection").then((m) => m.SpecsSection), { ssr: false });
const Steps = dynamic(() => import("./Steps").then((m) => m.Steps), { ssr: false });
const Testimonials = dynamic(() => import("./Testimonials").then((m) => m.Testimonials), { ssr: false });
const FAQ = dynamic(() => import("./FAQ").then((m) => m.FAQ), { ssr: false });
const CTA = dynamic(() => import("./CTA").then((m) => m.CTA), { ssr: false });
const NewsletterSection = dynamic(() => import("./NewsletterSection").then((m) => m.NewsletterSection), { ssr: false });

export default function ClientHome() {
  const [loadBelowFold, setLoadBelowFold] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoadBelowFold(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="min-h-[100px]">
      {loadBelowFold ? (
        <>
          <Benefits />
          <SpecsSection />
          <Steps />
          <Testimonials />
          <FAQ />
          <CTA />
          <NewsletterSection />
        </>
      ) : (
        <div className="h-[100px] flex items-center justify-center">
          <span className="text-xs text-slate-400 dark:text-slate-650 font-bold animate-pulse">Loading wellness details...</span>
        </div>
      )}
    </div>
  );
}
