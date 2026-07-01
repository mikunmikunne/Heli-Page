"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/app/component/header";
import Footer from "@/app/component/footer";
import { 
  ShoppingBag, 
  Calendar, 
  MessageSquare, 
  Trash2, 
  Save, 
  AlertTriangle, 
  TrendingUp, 
  Search, 
  Filter, 
  ShieldAlert, 
  LogOut,
  ChevronDown
} from "lucide-react";
import { supabase } from "@/utils/supabaseClient";

interface AdminBooking {
  id: string;
  full_name: string;
  company_name: string; // Used to identify 'Individual Pre-order' or 'Showroom Booking'
  email: string;
  phone: string;
  employee_count: string; // Stores chair model details e.g. 'luxe (x1)'
  preferred_date: string;
  location: string;
  details: string; // Used to hold status, notes and extra details
  created_at?: string;
}

interface AdminContact {
  id: string;
  full_name: string;
  email: string;
  message: string; // Used to hold both message content and note annotations
  created_at?: string;
}

// Initial mock data fallbacks with realistic submission timestamps
const INITIAL_MOCK_BOOKINGS: AdminBooking[] = [
  {
    id: "b2-luxe-preorder",
    full_name: "Tran Thi B",
    company_name: "Individual Pre-order",
    email: "thib@gmail.com",
    phone: "0912345678",
    employee_count: "luxe (x2)",
    preferred_date: "",
    location: "Shipping: 456 Trang Tien, Hoan Kiem, Hanoi",
    details: "[Status: Pending] [Note: Customer wants premium wrapping]. Pre-order: Model luxe (x2). Amount: 100,000,000 VND.",
    created_at: "2026-06-30T14:45:00Z"
  },
  {
    id: "b1-comfort-preorder",
    full_name: "Nguyen Van A",
    company_name: "Individual Pre-order",
    email: "vana@gmail.com",
    phone: "0901234567",
    employee_count: "comfort (x1)",
    preferred_date: "",
    location: "Shipping: 7/1 Thanh Thai, District 10, HCMC",
    details: "[Status: Confirmed] [Note: Call customer before shipping]. Pre-order: Model comfort (x1). Amount: 15,000,000 VND.",
    created_at: "2026-06-30T10:15:00Z"
  },
  {
    id: "b3-showroom-booking",
    full_name: "Pham Minh C",
    company_name: "Showroom Booking",
    email: "minhc@gmail.com",
    phone: "0987654321",
    employee_count: "1 person",
    preferred_date: "2026-07-01",
    location: "Showroom: Heli Wellness Showroom HCMC - 123 Nguyen Hue, District 1",
    details: "[Status: Confirmed] [Note: Preparing tea for consultation]. Showroom Trial Session at 10:30 AM - 11:30 AM.",
    created_at: "2026-06-30T09:30:00Z"
  }
];

const INITIAL_MOCK_CONTACTS: AdminContact[] = [
  {
    id: "c2-contact",
    full_name: "Kim Chi",
    email: "chichi@gmail.com",
    message: "Ghế Heli Luxe có hỗ trợ trả góp 0% qua thẻ tín dụng không vậy shop? [Status: Replied] [Note: Replied via email with installments documentation]",
    created_at: "2026-06-30T11:20:00Z"
  },
  {
    id: "c1-contact",
    full_name: "Hoang Giang",
    email: "giangh@gmail.com",
    message: "Tôi muốn làm đại lý phân phối ghế Heli ở miền Trung thì liên hệ với ai? [Status: Unprocessed] [Note: Contact CEO for cooperation]",
    created_at: "2026-06-30T08:12:00Z"
  }
];

export default function AdminPage() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  
  const [activeTab, setActiveTab] = useState<"bookings" | "contacts">("bookings");
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [contacts, setContacts] = useState<AdminContact[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Note edits state map (rowId -> note text)
  const [notesState, setNotesState] = useState<Record<string, string>>({});
  const [savingRowId, setSavingRowId] = useState<string | null>(null);

  // Sorting helper: Newest first
  const sortNewestFirst = (arr: any[]) => {
    return [...arr].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });
  };

  // Auth check
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push("/login");
    }
  }, [user, isAdmin, authLoading, router]);

  // Load Bookings & Contacts from Supabase or Fallback LocalStorage
  useEffect(() => {
    if (!user || !isAdmin) return;

    const fetchData = async () => {
      setLoadingData(true);
      try {
        // Try to fetch bookings from Supabase
        const { data: dbBookings, error: bookingsError } = await supabase
          .from("bookings")
          .select("*")
          .order("created_at", { ascending: false });

        // Try to fetch contacts from Supabase
        const { data: dbContacts, error: contactsError } = await supabase
          .from("contacts")
          .select("*")
          .order("created_at", { ascending: false });

        if (bookingsError || contactsError) {
          console.warn("Database tables not found or connection error. Falling back to local storage simulation.");
          setIsDemoMode(true);
          loadLocalSimulation();
        } else {
          const sortedBookings = sortNewestFirst(dbBookings || []);
          const sortedContacts = sortNewestFirst(dbContacts || []);
          setBookings(sortedBookings);
          setContacts(sortedContacts);
          initializeNotes(sortedBookings, sortedContacts);
        }
      } catch (err) {
        console.error("Auth / Fetch error, loading local simulation fallback:", err);
        setIsDemoMode(true);
        loadLocalSimulation();
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [user, isAdmin]);

  const loadLocalSimulation = () => {
    const savedB = localStorage.getItem("heli_mock_bookings");
    const savedC = localStorage.getItem("heli_mock_contacts");

    let finalB = INITIAL_MOCK_BOOKINGS;
    let finalC = INITIAL_MOCK_CONTACTS;

    if (savedB) {
      try { finalB = JSON.parse(savedB); } catch (e) {}
    } else {
      localStorage.setItem("heli_mock_bookings", JSON.stringify(finalB));
    }

    if (savedC) {
      try { finalC = JSON.parse(savedC); } catch (e) {}
    } else {
      localStorage.setItem("heli_mock_contacts", JSON.stringify(finalC));
    }

    const sortedB = sortNewestFirst(finalB);
    const sortedC = sortNewestFirst(finalC);

    setBookings(sortedB);
    setContacts(sortedC);
    initializeNotes(sortedB, sortedC);
  };

  const initializeNotes = (bList: AdminBooking[], cList: AdminContact[]) => {
    const initialNotes: Record<string, string> = {};
    
    bList.forEach((b) => {
      initialNotes[b.id] = parseNote(b.details);
    });
    
    cList.forEach((c) => {
      initialNotes[c.id] = parseNote(c.message);
    });
    
    setNotesState(initialNotes);
  };

  // String parsers for Status and Notes stored in text columns
  const parseStatus = (text: string) => {
    const match = text.match(/\[Status:\s*([^\]]+)\]/i);
    return match ? match[1].trim() : "Pending";
  };

  const parseNote = (text: string) => {
    const match = text.match(/\[Note:\s*([^\]]*)\]/i);
    return match ? match[1].trim() : "";
  };

  const updateTextWithStatusAndNote = (originalText: string, status: string, note: string) => {
    let cleanText = originalText
      .replace(/\[Status:\s*[^\]]+\]/gi, "")
      .replace(/\[Note:\s*[^\]]*\]/gi, "")
      .trim();
    
    return `[Status: ${status}] [Note: ${note}] ${cleanText}`;
  };

  // 1. Save Inline Note Action
  const handleSaveNote = async (id: string, type: "booking" | "contact") => {
    setSavingRowId(id);
    const noteText = notesState[id] || "";

    if (isDemoMode) {
      if (type === "booking") {
        const updated = bookings.map((b) => {
          if (b.id === id) {
            const currentStatus = parseStatus(b.details);
            return { ...b, details: updateTextWithStatusAndNote(b.details, currentStatus, noteText) };
          }
          return b;
        });
        setBookings(updated);
        localStorage.setItem("heli_mock_bookings", JSON.stringify(updated));
      } else {
        const updated = contacts.map((c) => {
          if (c.id === id) {
            const currentStatus = parseStatus(c.message);
            return { ...c, message: updateTextWithStatusAndNote(c.message, currentStatus, noteText) };
          }
          return c;
        });
        setContacts(updated);
        localStorage.setItem("heli_mock_contacts", JSON.stringify(updated));
      }
      setTimeout(() => setSavingRowId(null), 300);
      return;
    }

    try {
      if (type === "booking") {
        const target = bookings.find((b) => b.id === id);
        if (target) {
          const currentStatus = parseStatus(target.details);
          const newDetails = updateTextWithStatusAndNote(target.details, currentStatus, noteText);
          const { error } = await supabase
            .from("bookings")
            .update({ details: newDetails })
            .eq("id", id);
          
          if (!error) {
            setBookings(bookings.map((b) => (b.id === id ? { ...b, details: newDetails } : b)));
          }
        }
      } else {
        const target = contacts.find((c) => c.id === id);
        if (target) {
          const currentStatus = parseStatus(target.message);
          const newMsg = updateTextWithStatusAndNote(target.message, currentStatus, noteText);
          const { error } = await supabase
            .from("contacts")
            .update({ message: newMsg })
            .eq("id", id);
          
          if (!error) {
            setContacts(contacts.map((c) => (c.id === id ? { ...c, message: newMsg } : c)));
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingRowId(null);
    }
  };

  // 2. Change Status Dropdown Action
  const handleStatusChange = async (id: string, newStatus: string, type: "booking" | "contact") => {
    const noteText = notesState[id] || "";

    if (isDemoMode) {
      if (type === "booking") {
        const updated = bookings.map((b) => {
          if (b.id === id) {
            return { ...b, details: updateTextWithStatusAndNote(b.details, newStatus, noteText) };
          }
          return b;
        });
        setBookings(updated);
        localStorage.setItem("heli_mock_bookings", JSON.stringify(updated));
      } else {
        const updated = contacts.map((c) => {
          if (c.id === id) {
            return { ...c, message: updateTextWithStatusAndNote(c.message, newStatus, noteText) };
          }
          return c;
        });
        setContacts(updated);
        localStorage.setItem("heli_mock_contacts", JSON.stringify(updated));
      }
      return;
    }

    try {
      if (type === "booking") {
        const target = bookings.find((b) => b.id === id);
        if (target) {
          const newDetails = updateTextWithStatusAndNote(target.details, newStatus, noteText);
          const { error } = await supabase
            .from("bookings")
            .update({ details: newDetails })
            .eq("id", id);
          
          if (!error) {
            setBookings(bookings.map((b) => (b.id === id ? { ...b, details: newDetails } : b)));
          }
        }
      } else {
        const target = contacts.find((c) => c.id === id);
        if (target) {
          const newMsg = updateTextWithStatusAndNote(target.message, newStatus, noteText);
          const { error } = await supabase
            .from("contacts")
            .update({ message: newMsg })
            .eq("id", id);
          
          if (!error) {
            setContacts(contacts.map((c) => (c.id === id ? { ...c, message: newMsg } : c)));
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 3. Delete Row Action
  const handleDeleteRow = async (id: string, type: "booking" | "contact") => {
    if (!window.confirm("Are you sure you want to delete this record permanently?")) return;

    if (isDemoMode) {
      if (type === "booking") {
        const updated = bookings.filter((b) => b.id !== id);
        setBookings(updated);
        localStorage.setItem("heli_mock_bookings", JSON.stringify(updated));
      } else {
        const updated = contacts.filter((c) => c.id !== id);
        setContacts(updated);
        localStorage.setItem("heli_mock_contacts", JSON.stringify(updated));
      }
      return;
    }

    try {
      if (type === "booking") {
        const { error } = await supabase.from("bookings").delete().eq("id", id);
        if (!error) setBookings(bookings.filter((b) => b.id !== id));
      } else {
        const { error } = await supabase.from("contacts").delete().eq("id", id);
        if (!error) setContacts(contacts.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Format created_at date nicely
  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('vi-VN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Filtering calculations
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery);
    
    const currentStatus = parseStatus(b.details).toLowerCase();
    const matchesFilter = statusFilter === "all" || currentStatus === statusFilter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch = 
      c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const currentStatus = parseStatus(c.message).toLowerCase();
    const matchesFilter = statusFilter === "all" || currentStatus === statusFilter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  // KPI summaries
  const totalDepositValue = bookings
    .filter((b) => b.company_name === "Individual Pre-order" && parseStatus(b.details).toLowerCase() !== "cancelled")
    .reduce((sum, b) => {
      if (b.employee_count.includes("comfort")) return sum + 3000000;
      if (b.employee_count.includes("balance")) return sum + 6000000;
      if (b.employee_count.includes("luxe")) {
        const qtyMatch = b.employee_count.match(/x(\d+)/);
        const qty = qtyMatch ? parseInt(qtyMatch[1]) : 1;
        return sum + (10000000 * qty);
      }
      return sum;
    }, 0);

  const pendingBookingsCount = bookings.filter((b) => parseStatus(b.details).toLowerCase() === "pending").length;
  const unprocessedMessagesCount = contacts.filter((c) => parseStatus(c.message).toLowerCase() === "unprocessed").length;

  if (authLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">Verifying Administrator privileges...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Header />

      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Page title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <span>Heli Wellness Admin Portal</span>
              {isDemoMode && (
                <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 font-bold px-2 py-0.5 rounded-md border border-amber-250 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Offline Simulation Mode</span>
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
              Manage smart massage chair pre-orders, showroom trial sessions and support message tickets.
            </p>
          </div>
          <button 
            onClick={signOut}
            className="self-start md:self-auto bg-slate-200 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-900 dark:hover:bg-rose-950/20 text-slate-700 dark:text-slate-355 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer border-none"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Dashboard stats indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders / Bookings</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{bookings.length}</h3>
              <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                <span>{pendingBookingsCount} pending action</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-2xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Deposit Value</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalDepositValue.toLocaleString()} VND</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">From pre-orders deposit cọc (20%)</p>
            </div>
            <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950/40 text-teal-600 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Showroom Trials</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {bookings.filter((b) => b.company_name === "Showroom Booking").length}
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">1-1 showroom trial bookings</p>
            </div>
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 rounded-2xl flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Support Messages</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{contacts.length}</h3>
              <p className="text-[10px] text-rose-500 font-semibold flex items-center gap-1 mt-1">
                <ShieldAlert className="w-3 h-3" />
                <span>{unprocessedMessagesCount} unprocessed tickets</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/40 text-rose-500 rounded-2xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Selection, search and filter toolbar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 p-6 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-2 bg-slate-100 dark:bg-slate-850 p-1.5 rounded-2xl w-fit">
            <button
              onClick={() => { setActiveTab("bookings"); setSearchQuery(""); }}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer border-none ${
                activeTab === "bookings"
                  ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white bg-transparent"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Bookings / Orders ({bookings.length})</span>
            </button>
            <button
              onClick={() => { setActiveTab("contacts"); setSearchQuery(""); }}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer border-none ${
                activeTab === "contacts"
                  ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white bg-transparent"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Support Messages ({contacts.length})</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === "bookings" ? "Search customer name, email..." : "Search name, content..."}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Status Filter */}
            <div className="relative w-full sm:w-44 flex items-center">
              <span className="absolute left-3.5 text-slate-400">
                <Filter className="w-3.5 h-3.5" />
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                {activeTab === "bookings" ? (
                  <>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </>
                ) : (
                  <>
                    <option value="unprocessed">Unprocessed</option>
                    <option value="replied">Replied</option>
                  </>
                )}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Data list view */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl shadow-sm overflow-hidden">
          {loadingData ? (
            <div className="p-16 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <span className="text-xs text-slate-500 mt-3">Fetching database records...</span>
            </div>
          ) : activeTab === "bookings" ? (
            /* BOOKINGS PANEL */
            filteredBookings.length === 0 ? (
              <div className="p-16 text-center text-slate-400 font-semibold">No bookings found matching filters.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-5">Customer info</th>
                      <th className="p-5">Submitted At (Date & Time)</th>
                      <th className="p-5">Order Type</th>
                      <th className="p-5">Details / Items</th>
                      <th className="p-5">Showroom Date</th>
                      <th className="p-5">Status</th>
                      <th className="p-5 w-72">Admin Note</th>
                      <th className="p-5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-350">
                    {filteredBookings.map((b) => {
                      const status = parseStatus(b.details);
                      const noteVal = notesState[b.id] ?? "";
                      
                      return (
                        <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
                          <td className="p-5">
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{b.full_name}</p>
                            <p className="text-slate-400 mt-1">{b.email}</p>
                            <p className="text-slate-400">{b.phone}</p>
                          </td>
                          <td className="p-5 font-semibold text-slate-850 dark:text-slate-200">
                            {formatDateTime(b.created_at)}
                          </td>
                          <td className="p-5">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                              b.company_name === "Showroom Booking" 
                                ? "bg-indigo-50 text-indigo-750 dark:bg-indigo-950/20 dark:text-indigo-300"
                                : "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300"
                            }`}>
                              {b.company_name === "Showroom Booking" ? "Showroom Trial" : "Chair Pre-Order"}
                            </span>
                          </td>
                          <td className="p-5">
                            <p className="font-semibold text-slate-900 dark:text-white">{b.employee_count}</p>
                            <p className="text-slate-400 mt-1 max-w-[200px] truncate">{b.location}</p>
                          </td>
                          <td className="p-5 font-semibold text-slate-800 dark:text-slate-250">
                            {b.company_name === "Showroom Booking" ? b.preferred_date : "—"}
                          </td>
                          <td className="p-5">
                            <div className="relative flex items-center">
                              <select
                                value={status}
                                onChange={(e) => handleStatusChange(b.id, e.target.value, "booking")}
                                className="pl-3 pr-8 py-1.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-850 rounded-lg text-slate-900 dark:text-white font-bold text-xs focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                              <ChevronDown className="absolute right-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="flex gap-2 items-center">
                              <input
                                type="text"
                                value={noteVal}
                                onChange={(e) => setNotesState({ ...notesState, [b.id]: e.target.value })}
                                placeholder="Ghi chú đơn hàng..."
                                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-850 rounded-lg text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                              />
                              <button
                                onClick={() => handleSaveNote(b.id, "booking")}
                                className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition shrink-0 cursor-pointer flex items-center justify-center w-8 h-8 border-none"
                                aria-label="Save note"
                              >
                                {savingRowId === b.id ? (
                                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                                ) : (
                                  <Save className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="p-5 text-center">
                            <button
                              onClick={() => handleDeleteRow(b.id, "booking")}
                              className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition cursor-pointer border-none"
                              aria-label="Delete booking"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            /* SUPPORT MESSAGES PANEL */
            filteredContacts.length === 0 ? (
              <div className="p-16 text-center text-slate-400 font-semibold">No messages found matching filters.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-5">Sender</th>
                      <th className="p-5">Submitted At (Date & Time)</th>
                      <th className="p-5">Email Address</th>
                      <th className="p-5 w-[30%]">Message Content</th>
                      <th className="p-5">Status</th>
                      <th className="p-5 w-72">Admin Note</th>
                      <th className="p-5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-355">
                    {filteredContacts.map((c) => {
                      const status = parseStatus(c.message);
                      const noteVal = notesState[c.id] ?? "";
                      
                      // Strip status/note labels from message body for clean view
                      const cleanMsgBody = c.message
                        .replace(/\[Status:\s*[^\]]+\]/gi, "")
                        .replace(/\[Note:\s*[^\]]*\]/gi, "")
                        .trim();

                      return (
                        <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
                          <td className="p-5 font-bold text-slate-900 dark:text-white text-sm">{c.full_name}</td>
                          <td className="p-5 font-semibold text-slate-850 dark:text-slate-200">
                            {formatDateTime(c.created_at)}
                          </td>
                          <td className="p-5">{c.email}</td>
                          <td className="p-5 leading-relaxed">{cleanMsgBody}</td>
                          <td className="p-5">
                            <div className="relative flex items-center">
                              <select
                                value={status === "Replied" ? "Replied" : "Unprocessed"}
                                onChange={(e) => handleStatusChange(c.id, e.target.value, "contact")}
                                className="pl-3 pr-8 py-1.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-850 rounded-lg text-slate-900 dark:text-white font-bold text-xs focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                              >
                                <option value="Unprocessed">Unprocessed</option>
                                <option value="Replied">Replied</option>
                              </select>
                              <ChevronDown className="absolute right-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="flex gap-2 items-center">
                              <input
                                type="text"
                                value={noteVal}
                                onChange={(e) => setNotesState({ ...notesState, [c.id]: e.target.value })}
                                placeholder="Ghi chú tin nhắn..."
                                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-850 rounded-lg text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                              />
                              <button
                                onClick={() => handleSaveNote(c.id, "contact")}
                                className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition shrink-0 cursor-pointer flex items-center justify-center w-8 h-8 border-none"
                                aria-label="Save note"
                              >
                                {savingRowId === c.id ? (
                                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                                ) : (
                                  <Save className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="p-5 text-center">
                            <button
                              onClick={() => handleDeleteRow(c.id, "contact")}
                              className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition cursor-pointer border-none"
                              aria-label="Delete contact message"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
