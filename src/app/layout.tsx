import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const inter = Inter({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Chatbot from "@/app/component/Chatbot";
import BehaviorTracker from "@/app/component/BehaviorTracker";

export const metadata: Metadata = {
  title: "Heli Smart Massage Chair | Next-Gen AI Wellness",
  description: "Experience the future of wellness with Heli Smart Massage Chair. AI posture scanning, biosensors, 4D Zero Gravity, and IoT smart app connectivity.",
  openGraph: {
    title: "Heli Smart Massage Chair | Next-Gen AI Wellness",
    description: "Experience the future of wellness with Heli Smart Massage Chair. AI posture scanning, biosensors, 4D Zero Gravity, and IoT smart app connectivity.",
    url: "https://helicorp.vn",
    siteName: "Heli",
    images: [
      {
        url: "https://helicorp.vn/blog-images/office-relaxation.jpg",
        width: 1200,
        height: 630,
        alt: "Heli Smart Massage Chair",
      }
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Heli Smart Massage Chair | Next-Gen AI Wellness",
    description: "Experience the future of wellness with Heli Smart Massage Chair.",
    images: ["https://helicorp.vn/blog-images/office-relaxation.jpg"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
       <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (_) {}
              })()
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <AuthProvider>
          <CartProvider>
            {children}
            <Chatbot />
            <BehaviorTracker />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
