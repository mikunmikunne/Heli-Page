"use client";

import dynamic from "next/dynamic";

const Benefits = dynamic(() => import("../home-components").then((m) => m.Benefits), { ssr: false });
const SpecsSection = dynamic(() => import("../home-components").then((m) => m.SpecsSection), { ssr: false });
const Steps = dynamic(() => import("../home-components").then((m) => m.Steps), { ssr: false });
const Testimonials = dynamic(() => import("../home-components").then((m) => m.Testimonials), { ssr: false });
const FAQ = dynamic(() => import("../home-components").then((m) => m.FAQ), { ssr: false });
const CTA = dynamic(() => import("../home-components").then((m) => m.CTA), { ssr: false });
const NewsletterSection = dynamic(() => import("../home-components").then((m) => m.NewsletterSection), { ssr: false });

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
