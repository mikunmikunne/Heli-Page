"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ShieldCheck, ShoppingBag } from "lucide-react";
import Header from "@/app/component/header";
import Footer from "@/app/component/footer";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId") || "N/A";

  return (
    <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-2xl p-8 sm:p-10 rounded-3xl text-center relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
      </div>

      <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Deposit Successful!</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Your transaction has been securely processed. Below is your reference number.
      </p>

      <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl text-xs font-semibold font-mono text-slate-600 dark:text-slate-300 select-all mb-8 border border-slate-100 dark:border-slate-800">
        Booking ID: {bookingId}
      </div>

      <div className="space-y-4 mb-8 text-left text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/50 dark:border-slate-800/60 pt-6">
        <div className="flex gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>A confirmation email with deposit invoice and product specifics has been sent.</span>
        </div>
        <div className="flex gap-2">
          <ShoppingBag className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>For pre-orders, our white-glove setup team will contact you to coordinate home delivery.</span>
        </div>
      </div>

      <div className="w-full">
        <Link
          href="/"
          className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition active:scale-98 text-sm text-center"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-4 sm:px-6">
        <Suspense fallback={
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 shadow-2xl p-8 rounded-3xl flex flex-col items-center justify-center min-h-[350px]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
