"use client";

import { useState, useRef, useEffect } from "react";
import { CheckCircle2, ChevronDown, ShoppingBag, Calendar, Info, Heart, ShoppingCart } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { CHAIR_MODELS } from "@/utils/chairModels";
import { isValidEmail, isValidPhoneNumber } from "@/utils/validators";
import { FormState } from "./types";
import ReCAPTCHA from "react-google-recaptcha";

const SHOWROOMS = [
  "Heli Showroom HCMC - 7/1 Thành Thái, Quận 10",
  "Heli Wellness Showroom Hanoi - 456 Trang Tien, Hoan Kiem"
];

const TIME_SLOTS = [
  "09:00 AM - 10:00 AM",
  "10:30 AM - 11:30 AM",
  "02:00 PM - 03:00 PM",
  "03:30 PM - 04:30 PM",
  "05:00 PM - 06:00 PM"
];

export default function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkoutParam = searchParams.get("checkout");
  const chairParam = searchParams.get("chair");
  
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [formInteracted, setFormInteracted] = useState(false);
  
  // Watch booking type
  const [bookingType, setBookingType] = useState<"order" | "experience">("order");
  const [selectedChair, setSelectedChair] = useState<string>("comfort");
  const [qty, setQty] = useState<number>(1);

  // Auto-detect checkout param or pre-selected chair
  useEffect(() => {
    if (checkoutParam === "cart") {
      setBookingType("order");
    } else if (chairParam && CHAIR_MODELS[chairParam]) {
      setBookingType("order");
      setSelectedChair(chairParam);
    }
  }, [checkoutParam, chairParam]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormState>({
    defaultValues: {
      fullName: user?.user_metadata?.full_name || "",
      email: user?.email || "",
      phone: "",
      bookingType: "order",
      chairId: "comfort",
      quantity: 1,
      shippingAddress: "",
      preferredDate: "",
      preferredTime: TIME_SLOTS[0],
      showroomLocation: SHOWROOMS[0],
      details: "",
    }
  });

  // Calculate pricing
  let totalAmount = 0;
  let depositAmount = 0;
  let orderSummaryText = "";

  if (bookingType === "order") {
    if (checkoutParam === "cart") {
      // Cart items checkout
      totalAmount = cart.reduce((sum, item) => {
        const d = CHAIR_MODELS[item.chairId];
        return sum + (d ? d.price * item.quantity : 0);
      }, 0);
      depositAmount = totalAmount * 0.2;
      orderSummaryText = `Pre-ordering ${cart.length} item(s) from Shopping Cart`;
    } else {
      // Single item pre-order
      const model = CHAIR_MODELS[selectedChair];
      if (model) {
        totalAmount = model.price * qty;
        depositAmount = totalAmount * 0.2;
        orderSummaryText = `${model.name} x ${qty}`;
      }
    }
  } else {
    // Showroom Experience Booking
    totalAmount = 200000;
    depositAmount = 200000; // full pay
    orderSummaryText = "Showroom 1-1 Trial Session Booking";
  }

  const onSubmit: SubmitHandler<FormState> = async (data) => {
    setSubmitError(null);
    
    // Check cart if cart checkout
    if (bookingType === "order" && checkoutParam === "cart" && cart.length === 0) {
      setSubmitError("Your shopping cart is empty.");
      return;
    }

    try {
      const captchaToken = recaptchaRef.current?.getValue();
      if (!captchaToken) {
        setFormInteracted(true);
        setSubmitError("Please verify that you are not a robot.");
        return;
      }

      // Assemble purchase bundle
      const finalData = {
        ...data,
        bookingType,
        captchaToken,
        // Override selection if using cart checkout
        chairId: checkoutParam === "cart" ? "cart_checkout" : selectedChair,
        quantity: checkoutParam === "cart" ? undefined : qty,
        cartItems: checkoutParam === "cart" ? cart : undefined,
        totalAmount,
        depositAmount
      };

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to process request.");
      }

      // If checkout is successful, simulate payment redirect or create VNPay url
      console.log("Booking created successfully:", result);
      
      // Attempt to create VNPay payment url
      try {
        const payResponse = await fetch("/api/payments/create-vnpay-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: result.bookingId,
            amount: depositAmount,
            description: `Heli Payment for ${orderSummaryText}`
          })
        });
        
        const payResult = await payResponse.json();
        
        if (payResponse.ok && payResult.vnpayUrl) {
          // Redirect to VNPay
          if (checkoutParam === "cart") {
            await clearCart();
          }
          window.location.href = payResult.vnpayUrl;
          return;
        }
      } catch (payErr) {
        console.error("VNPay payment creation failed, falling back to instant success screen:", payErr);
      }

      // Local Success Screen (Fallback if VNPay routes are offline or testing)
      if (checkoutParam === "cart") {
        await clearCart();
      }
      setIsSuccess(true);
      recaptchaRef.current?.reset();
    } catch (error: unknown) {
      console.error("Booking submit error:", error);
      setSubmitError(error instanceof Error ? error.message : "An unexpected error occurred.");
      recaptchaRef.current?.reset();
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Order Received!</h3>
        <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-md">
          Thank you for choosing Heli. Your request is registered successfully. An confirmation email with invoice details has been sent to your inbox.
        </p>
        <button
          onClick={() => { setIsSuccess(false); router.push("/"); }}
          className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)} noValidate onFocusCapture={() => { if (!formInteracted) setFormInteracted(true); }}>
      
      {/* Booking Type Toggle */}
      <div className="flex flex-col sm:flex-row bg-slate-100 dark:bg-slate-800/60 rounded-2xl p-1.5 gap-1.5 sm:gap-0">
        <button
          type="button"
          onClick={() => { setBookingType("order"); setValue("bookingType", "order"); }}
          className={`flex-1 py-3.5 text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 ${
            bookingType === "order"
              ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-white shadow-md"
              : "text-slate-650 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Pre-Order Heli Smart Chair</span>
        </button>
        <button
          type="button"
          onClick={() => { setBookingType("experience"); setValue("bookingType", "experience"); }}
          className={`flex-1 py-3.5 text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 ${
            bookingType === "experience"
              ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-white shadow-md"
              : "text-slate-650 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Book Showroom Experience</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="fullName" className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Full Name</label>
          <input
            id="fullName"
            type="text"
            placeholder="Nguyen Van A"
            {...register("fullName", { required: "Full Name is required" })}
            aria-invalid={!!errors.fullName}
            className="bg-slate-50 dark:bg-slate-800/35 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors"
          />
          {errors.fullName && <span className="text-red-500 text-xs mt-1">{errors.fullName.message}</span>}
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Phone Number</label>
          <input
            id="phone"
            type="tel"
            placeholder="0901234567"
            {...register("phone", { 
              required: "Phone Number is required",
              validate: (value) => isValidPhoneNumber(value) || "Invalid Phone Number format"
            })}
            aria-invalid={!!errors.phone}
            className="bg-slate-50 dark:bg-slate-800/35 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors"
          />
          {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone.message}</span>}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="email" className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="name@gmail.com"
            {...register("email", { 
              required: "Email is required",
              validate: (value) => isValidEmail(value) || "Invalid Email format"
            })}
            aria-invalid={!!errors.email}
            className="bg-slate-50 dark:bg-slate-800/35 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors"
          />
          {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
        </div>

        {/* DYNAMIC FIELDS: Pre-Order */}
        {bookingType === "order" && (
          <>
            {checkoutParam === "cart" ? (
              /* Shopping Cart Summary Read-Only */
              <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-emerald-600" />
                  <span>Items being ordered:</span>
                </h4>
                <div className="space-y-3">
                  {cart.map((item) => {
                    const details = CHAIR_MODELS[item.chairId];
                    if (!details) return null;
                    return (
                      <div key={item.chairId} className="flex justify-between items-center text-xs">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">{details.name} (x{item.quantity})</span>
                        <span className="font-black text-slate-800 dark:text-slate-200">{(details.price * item.quantity).toLocaleString()} VND</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Single Chair Selection */
              <>
                <div className="flex flex-col gap-2">
                  <label htmlFor="chairId" className="text-xs uppercase tracking-wider font-bold text-slate-500">Chair Model</label>
                  <div className="relative">
                    <select
                      id="chairId"
                      value={selectedChair}
                      onChange={(e) => {
                        setSelectedChair(e.target.value);
                        setValue("chairId", e.target.value);
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-800/35 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white text-sm focus:border-emerald-500 focus:outline-none appearance-none cursor-pointer"
                    >
                      {Object.entries(CHAIR_MODELS).map(([id, item]) => (
                        <option key={id} value={id} className="bg-white dark:bg-slate-950 text-gray-900 dark:text-white">
                          {item.name} ({item.priceStr})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="quantity" className="text-xs uppercase tracking-wider font-bold text-slate-500">Quantity</label>
                  <input
                    id="quantity"
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) => {
                      const val = Math.max(1, parseInt(e.target.value) || 1);
                      setQty(val);
                      setValue("quantity", val);
                    }}
                    className="bg-slate-50 dark:bg-slate-800/35 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>
              </>
            )}

            {/* Shipping Address */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="shippingAddress" className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Delivery / Shipping Address</label>
              <input
                id="shippingAddress"
                type="text"
                placeholder="No. 123, Le Loi Street, Ben Nghe Ward, District 1, HCMC"
                {...register("shippingAddress", { required: "Shipping Address is required for chair orders" })}
                aria-invalid={!!errors.shippingAddress}
                className="bg-slate-50 dark:bg-slate-800/35 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors"
              />
              {errors.shippingAddress && <span className="text-red-500 text-xs mt-1">{errors.shippingAddress.message}</span>}
            </div>
          </>
        )}

        {/* DYNAMIC FIELDS: Showroom Trial Booking */}
        {bookingType === "experience" && (
          <>
            <div className="flex flex-col gap-2">
              <label htmlFor="showroomLocation" className="text-xs uppercase tracking-wider font-bold text-slate-500">Showroom Location</label>
              <div className="relative">
                <select
                  id="showroomLocation"
                  {...register("showroomLocation", { required: true })}
                  className="w-full bg-slate-50 dark:bg-slate-800/35 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white text-sm focus:border-emerald-500 focus:outline-none appearance-none cursor-pointer"
                >
                  {SHOWROOMS.map((room) => (
                    <option key={room} value={room} className="bg-white dark:bg-slate-950 text-gray-900 dark:text-white">
                      {room}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="preferredDate" className="text-xs uppercase tracking-wider font-bold text-slate-500">Preferred Date</label>
              <input
                id="preferredDate"
                type="date"
                {...register("preferredDate", { required: "Preferred Date is required" })}
                aria-invalid={!!errors.preferredDate}
                min={new Date().toISOString().split("T")[0]}
                className="bg-slate-50 dark:bg-slate-800/35 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white text-sm focus:border-emerald-500 focus:outline-none w-full [color-scheme:light] dark:[color-scheme:dark]"
              />
              {errors.preferredDate && <span className="text-red-500 text-xs mt-1">{errors.preferredDate.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="preferredTime" className="text-xs uppercase tracking-wider font-bold text-slate-500">Preferred Time Slot</label>
              <div className="relative">
                <select
                  id="preferredTime"
                  {...register("preferredTime", { required: true })}
                  className="w-full bg-slate-50 dark:bg-slate-800/35 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white text-sm focus:border-emerald-500 focus:outline-none appearance-none cursor-pointer"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot} className="bg-white dark:bg-slate-950 text-gray-900 dark:text-white">
                      {slot}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Details / Comments */}
      <div className="flex flex-col gap-2">
        <label htmlFor="details" className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Additional Instructions</label>
        <textarea
          id="details"
          {...register("details")}
          rows={3}
          placeholder="Special directions for shipping or specific physical symptoms you want to test..."
          className="bg-slate-50 dark:bg-slate-800/35 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-none"
        />
      </div>

      {/* Pricing Summary card */}
      <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
        <div className="flex items-center gap-2 mb-4 text-emerald-800 dark:text-emerald-300 font-bold">
          <Info className="w-5 h-5 shrink-0" />
          <span>Payment Breakdown:</span>
        </div>
        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <div className="flex justify-between">
            <span>Selected item:</span>
            <span className="font-semibold">{orderSummaryText}</span>
          </div>
          <div className="flex justify-between">
            <span>Total price:</span>
            <span className="font-semibold">{totalAmount.toLocaleString()} VND</span>
          </div>
          <div className="flex justify-between border-t border-emerald-200/50 dark:border-emerald-900/40 pt-2 font-bold text-emerald-800 dark:text-emerald-300">
            <span>{bookingType === "order" ? "Pre-order Deposit (20%):" : "Showroom trial fee (100%):"}</span>
            <span>{depositAmount.toLocaleString()} VND</span>
          </div>
        </div>
      </div>

      {/* Google reCAPTCHA v2 */}
      <div className="min-h-[80px] flex justify-center items-center py-2">
        {formInteracted && (
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"} // fallback default test key
            onChange={(token) => {
              if (token) {
                setSubmitError(null);
              }
            }}
          />
        )}
      </div>

      {submitError && (
        <div className="text-red-600 dark:text-red-400 text-sm font-semibold text-center bg-red-50 dark:bg-red-950/20 py-3 px-4 rounded-xl border border-red-200 dark:border-red-900/50">
          {submitError}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-4.5 rounded-xl font-bold text-base shadow-lg shadow-emerald-700/20 dark:shadow-emerald-900/40 disabled:opacity-70 flex justify-center items-center cursor-pointer active:scale-98 transition-transform"
      >
        {isSubmitting ? (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        ) : (
          `Pay ${depositAmount.toLocaleString()} VND via VNPay`
        )}
      </button>
    </form>
  );
}