"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CreditCard, ShieldCheck, AlertCircle } from "lucide-react";
import { Suspense } from "react";

function MockPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const bookingId = searchParams.get("bookingId") || "";
  const amount = parseInt(searchParams.get("amount") || "0");
  const description = searchParams.get("description") || "Heli Smart Massage Chair";

  const handleSimulatePayment = (success: boolean) => {
    const callbackParams = new URLSearchParams({
      vnp_ResponseCode: success ? "00" : "24", // 00 = Success, 24 = Cancelled
      vnp_TxnRef: bookingId,
      vnp_Amount: String(amount * 100)
    });

    router.push(`/api/payments/callback?${callbackParams.toString()}`);
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
      
      {/* Mock VNPay Header */}
      <div className="p-6 bg-blue-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="w-6 h-6" />
          <span className="font-black tracking-wider text-lg">VNPay Sandbox Simulator</span>
        </div>
        <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 bg-white/20 rounded-md">Testing</span>
      </div>

      {/* Payment Summary */}
      <div className="p-6 sm:p-8 space-y-6">
        <div className="text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Amount</p>
          <h2 className="text-3xl font-black text-slate-950 dark:text-white mt-1">
            {amount.toLocaleString()} VND
          </h2>
        </div>

        <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl text-xs text-slate-600 dark:text-slate-400">
          <div className="flex justify-between">
            <span>Merchant:</span>
            <span className="font-bold text-slate-850 dark:text-white">HELI CORP</span>
          </div>
          <div className="flex justify-between">
            <span>Transaction Ref:</span>
            <span className="font-bold text-slate-850 dark:text-white">{bookingId}</span>
          </div>
          <div className="flex justify-between">
            <span>Description:</span>
            <span className="font-bold text-slate-850 dark:text-white text-right max-w-[200px] truncate">{description}</span>
          </div>
        </div>

        {/* Alert Info */}
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/35 text-amber-800 dark:text-amber-300 text-xs flex gap-3 items-start">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            This simulator bypasses OTP checks and real money transfers to test callback redirects, Supabase database storage synchronization, and Nodemailer SMTP notifications.
          </p>
        </div>

        {/* Action Simulation Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => handleSimulatePayment(true)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Simulate Success Payment (00)</span>
          </button>

          <button
            onClick={() => handleSimulatePayment(false)}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition active:scale-98 cursor-pointer"
          >
            <span>Simulate Cancelled / Failed Payment (24)</span>
          </button>
        </div>

      </div>

    </div>
  );
}

export default function PaymentMockPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center py-12 px-4 sm:px-6">
      <Suspense fallback={
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-8 rounded-3xl flex flex-col items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
        </div>
      }>
        <MockPaymentContent />
      </Suspense>
    </div>
  );
}
