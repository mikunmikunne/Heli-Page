"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CreditCard, ShieldCheck, AlertCircle, RefreshCw, Landmark, Calendar, User, KeyRound } from "lucide-react";
import { Suspense, useState } from "react";

function MockPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const bookingId = searchParams.get("bookingId") || "";
  const amount = parseInt(searchParams.get("amount") || "0");
  const description = searchParams.get("description") || "Heli Smart Massage Chair";

  // Pre-filled form states
  const [bank, setBank] = useState("NCB - National Citizen Bank");
  const [cardNumber, setCardNumber] = useState("9704 1985 2619 1432 198");
  const [cardHolder, setCardHolder] = useState("NGUYEN VAN A");
  const [expiryDate, setExpiryDate] = useState("07/15");
  const [otp, setOtp] = useState("123456");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimulatePayment = (success: boolean) => {
    setIsProcessing(true);
    
    // Simulate a brief bank processing latency
    setTimeout(() => {
      const callbackParams = new URLSearchParams({
        vnp_ResponseCode: success ? "00" : "24", // 00 = Success, 24 = Cancelled
        vnp_TxnRef: bookingId,
        vnp_Amount: String(amount * 100)
      });
      router.push(`/api/payments/callback?${callbackParams.toString()}`);
    }, 1200);
  };

  return (
    <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
      
      {/* VNPAY Brand Header */}
      <div className="p-6 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Landmark className="w-6 h-6 text-amber-400" />
          <div>
            <span className="font-black tracking-wider text-lg block leading-none">VNPAY</span>
            <span className="text-[10px] text-blue-200 uppercase tracking-widest font-extrabold">Sandbox Simulator</span>
          </div>
        </div>
        <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-1 bg-white/10 rounded-lg border border-white/20">
          Demo Mode
        </span>
      </div>

      {/* Payment Summary Box */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10 grid grid-cols-2 gap-4 text-xs">
        <div>
          <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Merchant Name</p>
          <p className="font-extrabold text-slate-800 dark:text-white mt-1 text-sm">HELI CORP</p>
        </div>
        <div className="text-right">
          <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Payment Amount</p>
          <p className="font-black text-emerald-600 dark:text-emerald-400 mt-1 text-lg">
            {amount.toLocaleString()} VND
          </p>
        </div>
        <div className="col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <span className="text-slate-400 font-semibold">Description:</span>
          <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[260px]">
            {description}
          </span>
        </div>
      </div>

      {/* Test Credentials Alert Box */}
      <div className="p-6 space-y-6">
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-300 text-xs flex gap-3 items-start">
          <AlertCircle className="w-4.5 h-4.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="leading-relaxed">
            <p className="font-black mb-1">VNPAY Sandbox Simulator (Test Mode)</p>
            <p className="font-semibold text-slate-600 dark:text-slate-400">
              The test card credentials have been pre-filled below. Simply click **Confirm Payment** to complete the mock checkout and trigger SMTP emails!
            </p>
          </div>
        </div>

        {/* Card Input Form Fields */}
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Card Issuing Bank</label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={bank}
                className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white text-xs font-bold focus:outline-none"
              />
              <Landmark className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Test ATM Card Number</label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={cardNumber}
                className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white text-xs font-bold focus:outline-none tracking-widest"
              />
              <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Cardholder Name</label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={cardHolder}
                  className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white text-xs font-bold focus:outline-none"
                />
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Issue Month/Year</label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={expiryDate}
                  className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white text-xs font-bold focus:outline-none"
                />
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">OTP Verification Code</label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={otp}
                className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white text-xs font-bold focus:outline-none tracking-widest"
              />
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t border-slate-150 dark:border-slate-800">
          <button
            onClick={() => handleSimulatePayment(true)}
            disabled={isProcessing}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-4 rounded-2xl shadow-xl shadow-emerald-600/20 dark:shadow-emerald-900/10 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer disabled:opacity-80"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Processing transaction...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Confirm Payment (OTP: 123456)</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleSimulatePayment(false)}
            disabled={isProcessing}
            className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-3.5 px-4 rounded-2xl transition active:scale-98 cursor-pointer disabled:opacity-50 text-xs"
          >
            Cancel Transaction / Fail Payment
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
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-8 rounded-3xl flex flex-col items-center justify-center min-h-[350px]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
        </div>
      }>
        <MockPaymentContent />
      </Suspense>
    </div>
  );
}
