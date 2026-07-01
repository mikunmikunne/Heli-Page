import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full pt-16 pb-8 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <div className="text-xl font-black text-emerald-800 dark:text-emerald-400 mb-6 tracking-tight">
            HELI SMART CHAIR
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            Bringing biological AI wellness technology directly to your home. Designed for modern life recovery.
          </p>
        </div>
        
        <div>
          <h3 className="text-gray-700 dark:text-gray-300 font-bold mb-6 text-sm uppercase tracking-wider">Models</h3>
          <ul className="space-y-4">
            <li>
              <Link
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                href="#products"
              >
                Heli Comfort
              </Link>
            </li>
            <li>
              <Link
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                href="#products"
              >
                Heli Balance
              </Link>
            </li>
            <li>
              <Link
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                href="#products"
              >
                Heli Luxe
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-gray-700 dark:text-gray-300 font-bold mb-6 text-sm uppercase tracking-wider">Company</h3>
          <ul className="space-y-4">
            <li>
              <Link
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                href="/#specs"
              >
                Specs & Technology
              </Link>
            </li>
            <li>
              <Link
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                href="/booking"
              >
                Book / Buy
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-gray-700 dark:text-gray-300 font-bold mb-6 text-sm uppercase tracking-wider">Contact</h3>
          <ul className="space-y-4">
            <li className="text-slate-500 dark:text-slate-400 text-sm">
              <span className="font-semibold block text-[10px] text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider">Email:</span>
              <a
                href="mailto:mikun.creatory@gmail.com"
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-bold text-sm"
              >
                Heli Chair
              </a>
            </li>
            <li className="text-slate-500 dark:text-slate-400 text-sm">
              <span className="font-semibold block text-[10px] text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider">Hotline:</span>
              <a
                href="tel:+84374716789"
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-bold"
              >
                (+84) 374 716 789
              </a>
            </li>
            <li className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              <span className="font-semibold block text-[10px] text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider">Showroom HCM:</span>
              <a
                href="https://maps.app.goo.gl/Qtyguk6nqMRt6J2Q6"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-xs font-semibold"
              >
                7/1 Thành Thái, Phường 14, Quận 10, TP. Hồ Chí Minh
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-200 dark:border-slate-850 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          &copy; {new Date().getFullYear()} Heli Smart Chair Corp. All rights reserved.
        </p>
      </div>
    </footer>
  );
}