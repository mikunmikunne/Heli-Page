"use client";

import dynamic from "next/dynamic";

const Benefits = dynamic(() => import("./Benefits").then((m) => m.Benefits), { ssr: false });
const SpecsSection = dynamic(() => import("./SpecsSection").then((m) => m.SpecsSection), { ssr: false });
const Steps = dynamic(() => import("./Steps").then((m) => m.Steps), { ssr: false });
const Testimonials = dynamic(() => import("./Testimonials").then((m) => m.Testimonials), { ssr: false });
const FAQ = dynamic(() => import("./FAQ").then((m) => m.FAQ), { ssr: false });
const CTA = dynamic(() => import("./CTA").then((m) => m.CTA), { ssr: false });
const NewsletterSection = dynamic(() => import("./NewsletterSection").then((m) => m.NewsletterSection), { ssr: false });

export default function ClientHome() {
  return (
    <>
      <Benefits />
      <SpecsSection />
      <Steps />
      <Testimonials />
      <FAQ />
      <CTA />
      <NewsletterSection />
    </>
  );
}
