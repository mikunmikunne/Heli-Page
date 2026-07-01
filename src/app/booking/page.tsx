import { Suspense } from "react";
import type { Metadata } from "next";
import Header from "@/app/component/header";
import Footer from "@/app/component/footer";
import BookingClient from "./BookingClient";

export const metadata: Metadata = {
  title: "Pre-Order & Booking | Heli Smart Massage Chair",
  description: "Request a customized quote or pre-order your Heli Smart Massage Chair today.",
  openGraph: {
    title: "Pre-Order & Booking | Heli Smart Massage Chair",
    description: "Request a customized quote or pre-order your Heli Smart Massage Chair today.",
    images: [{ url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800" }],
  },
};

export default function BookingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Suspense fallback={
        <div className="flex-grow flex items-center justify-center bg-gray-50 dark:bg-gray-950 min-h-[50vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
        </div>
      }>
        <BookingClient />
      </Suspense>
      <Footer />
    </div>
  );
}
