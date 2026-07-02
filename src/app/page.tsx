import type { Metadata } from "next";
import Header from "./component/header"; 
import Footer from "./component/footer";
import { Hero } from "./home-components";
import dynamic from "next/dynamic";

const Benefits = dynamic(() => import("./home-components").then((m) => m.Benefits), { ssr: true });
const SpecsSection = dynamic(() => import("./home-components").then((m) => m.SpecsSection), { ssr: true });
const Steps = dynamic(() => import("./home-components").then((m) => m.Steps), { ssr: true });
const Testimonials = dynamic(() => import("./home-components").then((m) => m.Testimonials), { ssr: true });
const FAQ = dynamic(() => import("./home-components").then((m) => m.FAQ), { ssr: true });
const CTA = dynamic(() => import("./home-components").then((m) => m.CTA), { ssr: true });
const NewsletterSection = dynamic(() => import("./home-components").then((m) => m.NewsletterSection), { ssr: true });

export const metadata: Metadata = {
  title: "Heli Smart Massage Chair | Next-Gen AI Wellness",
  description: "Experience therapeutic healing at home with Heli's smart massage chairs. Guided by biosensors to scan posture and locate pain points automatically.",
  openGraph: {
    title: "Heli Smart Massage Chair | Next-Gen AI Wellness",
    description: "Experience therapeutic healing at home with Heli's smart massage chairs. Guided by biosensors to scan posture and locate pain points automatically.",
    url: "https://heli-smart-massage-chair.vercel.app",
    siteName: "Heli",
    images: [
      {
        url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800",
        width: 1200,
        height: 630,
        alt: "Heli Smart Massage Chair",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen selection:bg-emerald-100 selection:text-emerald-900">
      <Header />
      <main>
        <Hero />
        <Benefits />
        <SpecsSection />
        <Steps />
        <Testimonials />
        <FAQ />
        <CTA />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}
