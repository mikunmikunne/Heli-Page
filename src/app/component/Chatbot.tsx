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
  "So sánh 3 dòng ghế Heli?",
  "Chính sách bảo hành và lắp đặt?",
  "Giá tiền và tiền cọc 20%?",
  "Cách thức đặt lịch trải nghiệm?"
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
      text: "Xin chào! Tôi là Trợ lý ảo Heli Care. Tôi có thể giúp gì cho bạn trong việc tìm hiểu các dòng ghế massage thông minh Heli?",
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

  const handleSendMessage = (text: string) => {
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
    
    // Keyword: So sánh / các dòng ghế / dòng ghế / có mấy loại
    if (q.includes("so sánh") || q.includes("các dòng") || q.includes("có mấy loại") || q.includes("mẫu nào") || q.includes("chọn ghế")) {
      return `Hiện tại Heli có 3 dòng ghế thông minh đáp ứng mọi nhu cầu:
1. **Heli Comfort (Standard):** 15,000,000 VND. Loa Bluetooth, nhiệt hồng ngoại, con lăn 2D, 6 chương trình tự động. Phù hợp sử dụng cơ bản.
2. **Heli Balance (Premium):** 30,000,000 VND. Zero Gravity, con lăn 3D, túi khí toàn thân, kết nối app Heli Health, 10 chương trình tự động.
3. **Heli Luxe (Ultimate):** 50,000,000 VND. Trọng lực 4D SLS, cảm biến sinh học tự động phát hiện điểm đau, sưởi Graphene, 16 chương trình, điều khiển bằng giọng nói.`;
    }

    // Keyword: giá / tiền cọc / bao nhiêu tiền / cọc / thanh toán
    if (q.includes("giá") || q.includes("tiền cọc") || q.includes("bao nhiêu") || q.includes("cọc") || q.includes("thanh toán")) {
      return `Chính sách giá bán và tiền cọc đặt trước (20%) của 3 dòng ghế:
- **Heli Comfort:** Giá 15,000,000 VND - Cọc trước: **3,000,000 VND**.
- **Heli Balance:** Giá 30,000,000 VND - Cọc trước: **6,000,000 VND**.
- **Heli Luxe:** Giá 50,000,000 VND - Cọc trước: **10,000,000 VND**.
Hỗ trợ thanh toán cọc online an toàn qua cổng VNPay Sandbox. Số tiền còn lại sẽ thanh toán khi nhận hàng.`;
    }

    // Keyword: bảo hành / lắp đặt / giao hàng / vận chuyển
    if (q.includes("bảo hành") || q.includes("lắp đặt") || q.includes("giao hàng") || q.includes("vận chuyển")) {
      return `Chính sách hậu mãi của Heli:
- **Bảo hành:** 5 năm toàn diện cho mọi bộ phận phần cứng (con lăn, da ghế, cảm biến) và phần mềm. Bảo trì tại nhà trọn đời.
- **Lắp đặt & Giao hàng:** Miễn phí giao hàng và lắp đặt tận nhà trên toàn quốc. Đội ngũ kỹ thuật hỗ trợ hướng dẫn sử dụng và kết nối app chi tiết.`;
    }

    // Keyword: trải nghiệm / thử / showroom / địa chỉ
    if (q.includes("trải nghiệm") || q.includes("thử") || q.includes("showroom") || q.includes("địa chỉ") || q.includes("đặt lịch")) {
      return `Bạn có thể đặt lịch trải nghiệm trực tiếp 1-1 tại Showroom Heli:
- **Showroom HCM:** 123 Nguyễn Huệ, Quận 1.
- **Showroom Hà Nội:** 456 Tràng Tiền, Hoàn Kiếm.
Phí đặt lịch trải nghiệm showroom là **200,000 VND** / phiên 45 phút (được chuyên gia tư vấn sức khỏe và đo chỉ số sinh học miễn phí). Hãy truy cập trang "Book / Buy" để đăng ký nhé!`;
    }

    // Keyword: comfort
    if (q.includes("comfort")) {
      const c = CHAIR_MODELS.comfort;
      return `**${c.name}** là dòng ghế phổ thông với giá bán **${c.priceStr}** (Cọc trước 20%: ${c.depositStr}). Ghế sở hữu các tính năng cơ bản như: ${c.features.join(", ")}. Phù hợp cho việc thư giãn hàng ngày tại gia đình.`;
    }

    // Keyword: balance
    if (q.includes("balance")) {
      const b = CHAIR_MODELS.balance;
      return `**${b.name}** là dòng ghế cận cao cấp với giá bán **${b.priceStr}** (Cọc trước 20%: ${b.depositStr}). Ghế tích hợp công nghệ vượt trội: ${b.features.join(", ")}. Đây là lựa chọn được yêu thích nhất của các gia đình hiện đại.`;
    }

    // Keyword: luxe / luxury
    if (q.includes("luxe") || q.includes("luxury")) {
      const l = CHAIR_MODELS.luxe;
      return `**${l.name}** là dòng ghế thông minh tối tân nhất của Heli có giá **${l.priceStr}** (Cọc trước 20%: ${l.depositStr}). Dòng ghế cao cấp này sở hữu toàn bộ các công nghệ hiện đại nhất: ${l.features.join(", ")}. Đặc biệt là cảm biến AI tự động dò quét huyệt đạo và điểm đau để đưa ra bài massage cá nhân hóa.`;
    }

    // Default response
    return "Cảm ơn câu hỏi của bạn. Tôi là AI hỗ trợ tự động của Heli. Nếu bạn muốn so sánh 3 dòng ghế, hỏi về giá tiền/tiền cọc, chính sách bảo hành, hoặc muốn đặt lịch showroom trải nghiệm, vui lòng chọn câu hỏi gợi ý nhanh hoặc nhập từ khóa liên quan nhé!";
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
                onClick={() => handleSendMessage(q)}
                className="shrink-0 text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors border border-slate-200/40 dark:border-slate-800 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Form */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
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
