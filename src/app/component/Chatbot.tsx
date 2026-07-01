"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, User, RefreshCw } from "lucide-react";
import { CHAIR_MODELS } from "@/utils/chairModels";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/utils/supabaseClient";

interface Message {
  sender: "user" | "bot";
  text: string;
  time: string;
}

const QUICK_QUESTIONS = [
  "Compare 3 Heli models?",
  "Warranty & installation policy?",
  "Pricing & 20% deposit?",
  "How to book showroom trial?"
];

// Helper to get formatted current time
const getFormattedTime = () => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function Chatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! I am Heli Care AI Assistant. How can I help you learn about Heli's smart massage chairs today?",
      time: getFormattedTime()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (text: string, isQuickOption = false) => {
    if (!text.trim()) return;

    // 1. Add User Message
    const userMsg: Message = {
      sender: "user",
      text,
      time: getFormattedTime()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    
    // 2. Trigger bot typing
    setIsTyping(true);

    // 3. Save message to contacts database
    if (!isQuickOption) {
      const senderName = user?.email 
        ? (user.user_metadata?.full_name || user.email.split("@")[0]) 
        : "Guest User";
      const senderEmail = user?.email || "guest_chatbot@heli.com";
      
      const saveChatToDb = async () => {
        try {
          const { error } = await supabase.from("contacts").insert([
            {
              full_name: senderName,
              email: senderEmail,
              message: `[Chatbot] ${text}`
            }
          ]);
          if (error) {
            console.error("Error saving chatbot message to Supabase:", error);
          }
        } catch (err) {
          console.error("Failed to run Supabase insert:", err);
        }
      };
      saveChatToDb();
    }
    
    setTimeout(() => {
      const botResponse = generateBotResponse(text);
      const botMsg: Message = {
        sender: "bot",
        text: botResponse,
        time: getFormattedTime()
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const generateBotResponse = (query: string): string => {
    const q = query.toLowerCase();
    
    // Keyword: Compare / models / difference
    if (q.includes("compare") || q.includes("models") || q.includes("difference") || q.includes("so sánh") || q.includes("các dòng")) {
      return `Heli offers 3 smart massage chair models to suit your needs:
1. **Heli Comfort (Standard):** 15,000,000 VND. Bluetooth speakers, infrared heat, 2D rollers, 6 auto programs. Ideal for essential relaxation.
2. **Heli Balance (Premium):** 30,000,000 VND. Zero Gravity, 3D rollers, full-body airbags, Heli Health app connectivity, 10 auto programs.
3. **Heli Luxe (Ultimate):** 50,000,000 VND. 4D SLS tracks, AI biosensors for pain detection, Graphene heating, 16 programs, voice control.`;
    }

    // Keyword: Price / deposit / payment
    if (q.includes("price") || q.includes("deposit") || q.includes("cost") || q.includes("pay") || q.includes("giá") || q.includes("tiền cọc")) {
      return `Pricing and 20% pre-order deposit details:
- **Heli Comfort:** Price: 15,000,000 VND - Deposit: **3,000,000 VND**.
- **Heli Balance:** Price: 30,000,000 VND - Deposit: **6,000,000 VND**.
- **Heli Luxe:** Price: 50,000,000 VND - Deposit: **10,000,000 VND**.
You can pay the deposit securely online via VNPay Sandbox. The remaining balance is due upon delivery.`;
    }

    // Keyword: Warranty / delivery / shipping
    if (q.includes("warranty") || q.includes("install") || q.includes("delivery") || q.includes("shipping") || q.includes("bảo hành")) {
      return `Heli Customer Services & Policies:
- **Warranty:** 5-year comprehensive warranty on all hardware parts (rollers, leather, sensors) and software. Lifetime in-home maintenance.
- **Delivery & Setup:** Free shipping and professional installation nationwide. Our technicians will guide you through the app setup and features.`;
    }

    // Keyword: Showroom / trial / address / book
    if (q.includes("showroom") || q.includes("trial") || q.includes("address") || q.includes("book") || q.includes("trải nghiệm") || q.includes("địa chỉ")) {
      return `You can book a 1-to-1 trial session at our showrooms:
- **Showroom HCM:** 7/1 Thành Thái, District 10.
- **Showroom Hanoi:** 456 Tràng Tiền, Hoàn Kiếm.
The private trial fee is **200,000 VND** / 45-minute session (includes a professional health consultation and bio-metric scans). Please go to the "Book / Buy" page to book!`;
    }

    // Keyword: comfort
    if (q.includes("comfort")) {
      const c = CHAIR_MODELS.comfort;
      return `**${c.name}** is our standard model priced at **${c.priceStr}** (20% Deposit: ${c.depositStr}). It features essential functions such as: ${c.features.join(", ")}. Perfect for everyday home relaxation.`;
    }

    // Keyword: balance
    if (q.includes("balance")) {
      const b = CHAIR_MODELS.balance;
      return `**${b.name}** is our premium model priced at **${b.priceStr}** (20% Deposit: ${b.depositStr}). It integrates advanced features: ${b.features.join(", ")}. It is our most popular choice for modern families.`;
    }

    // Keyword: luxe / luxury
    if (q.includes("luxe") || q.includes("luxury")) {
      const l = CHAIR_MODELS.luxe;
      return `**${l.name}** is our ultimate AI massage chair priced at **${l.priceStr}** (20% Deposit: ${l.depositStr}). It offers state-of-the-art tech: ${l.features.join(", ")}. The built-in AI biosensor scans acupoints and automatically customizes a pain-relief program.`;
    }

    // Default response
    return "Thank you for reaching out! I am Heli Care AI Assistant. If you have questions about comparing our 3 models, pricing/deposit, warranty policies, or how to book a showroom trial, please select one of the quick options or type a keyword.";
  };

  return (
    <div className="fixed bottom-6 right-6 z-100 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[500px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl overflow-hidden flex flex-col mb-4 animate-scaleUp relative">
          {/* Header */}
          <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h4 className="font-black text-sm">Heli AI Assistant</h4>
                <p className="text-[10px] text-emerald-200/90 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Online & Ready</span>
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages body */}
          <div className="flex-grow p-4 overflow-y-auto bg-slate-50 dark:bg-slate-950/20 space-y-4">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-2 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === "user" 
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200" 
                    : "bg-emerald-600 text-white"
                }`}>
                  {msg.sender === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.sender === "user"
                    ? "bg-emerald-600 text-white rounded-tr-none"
                    : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-850"
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className="block text-[9px] text-right mt-1 text-slate-400 dark:text-slate-500 font-semibold">{msg.time}</span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-150"></span>
                  <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-300"></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick options chips */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-150 dark:border-slate-850 flex gap-2 overflow-x-auto custom-scrollbar pb-1.5 shrink-0">
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q, true)}
                className="shrink-0 text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors border border-slate-200/40 dark:border-slate-800 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Form */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText, false); }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow px-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
            />
            <button 
              type="submit" 
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition active:scale-95 cursor-pointer shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Bubble Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer relative"
        aria-label="Toggle chat helper"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6 animate-pulse" />}
      </button>
    </div>
  );
}
