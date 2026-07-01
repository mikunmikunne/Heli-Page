"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Header from "@/app/component/header";
import Footer from "@/app/component/footer";
import { Suspense } from "react";

function FailedContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId") || "N/A";

  return (
    <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-2xl p-8 sm:p-10 rounded-3xl text-center relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-20 h-20 bg-rose-50 dark:bg-rose-950/40 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertTriangle className="w-12 h-12 text-rose-600 dark:text-rose-400" />
      </div>

          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Payment Failed</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            The transaction was cancelled, timed out, or encountered a banking authentication error.
          </p>

          <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl text-xs font-semibold font-mono text-slate-600 dark:text-slate-300 select-all mb-8 border border-slate-100 dark:border-slate-800">
            Reference ID: {bookingId}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto leading-relaxed">
            No money has been debited. Please review your bank account credentials and verify your card allows sandbox or test transactions.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/booking"
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition active:scale-98 text-sm flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Payment</span>
            </Link>
            <Link
              href="/"
              className="flex-1 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850 font-bold py-3.5 px-4 rounded-xl transition active:scale-98 text-sm"
            >
              Home Page
            </Link>
          </div>
    </div>
  );
}

export default function FailedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-4 sm:px-6">
        <Suspense fallback={
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 shadow-2xl p-8 rounded-3xl flex flex-col items-center justify-center min-h-[350px]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
          </div>
        }>
          <FailedContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
