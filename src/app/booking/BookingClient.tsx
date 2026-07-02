"use client";
import { motion } from "motion/react";
import { Calendar, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import BookingForm from "./BookingForm";

export default function BookingClient() {
  return (
    <main className="flex-grow pt-16 pb-24 min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 mb-16 text-center pt-12">
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6">
          Request a Quote
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Transform your workplace culture with restorative wellness. Fill out the form below to receive a customized quote for your team.
        </p>
      </section>

      {/* Content Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Form Section */}
          <div className="lg:col-span-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 p-5 sm:p-8 md:p-12 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-3xl mx-auto lg:max-w-none">
            <BookingForm />
          </div>

          {/* Sidebar Section */}
          <div className="lg:col-span-4 space-y-8">
            {/* Fast Response Card */}
            <div className="bg-emerald-50 dark:bg-emerald-900/10 p-8 rounded-2xl">
              <div className="flex items-center gap-4 mb-4 text-emerald-700">
                <div className="bg-emerald-600/10 p-2 rounded-lg">
                  <Calendar className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold">Fast Response</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                Our corporate wellness coordinators typically respond to all inquiries within <span className="text-emerald-700 dark:text-emerald-400 font-bold">2 business hours</span>.
              </p>
            </div>

            {/* Trust Image Card */}
            <div className="relative h-64 rounded-2xl overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
                alt="Modern office space"
                fill
                sizes="(max-width: 768px) 280px, 400px"
                className="object-cover brightness-75 group-hover:scale-105 transition-transform duration-700"
                priority
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent flex items-end p-6">
                <p className="text-white font-medium text-sm">Trusted by 500+ forward-thinking companies worldwide.</p>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-6 px-4">
              <div className="flex gap-4 items-start">
                <div className="text-emerald-600 dark:text-emerald-400 mt-1">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">Licensed Therapists</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Insured and background-checked professionals.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="text-emerald-600 dark:text-emerald-400 mt-1">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">Flexible Scheduling</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Recurring sessions or one-time events.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

