"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, CalendarDays, Settings } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Pulpit', icon: LayoutDashboard },
    { href: '/magazyn', label: 'Magazyn', icon: Package },
    { href: '/roboty', label: 'Roboty', icon: CalendarDays },
    { href: '/ustawienia', label: 'Ustawienia', icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen bg-[#121824] border-r border-slate-800/80 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-800/80 gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
          <span className="text-white font-bold text-sm">7K</span>
        </div>
        <span className="text-lg font-bold tracking-tight text-white">
          LED CRM
        </span>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-1.5">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          const Icon = link.icon;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-3 py-2.5 transition-all group ${
                isActive
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 font-semibold rounded-xl'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl border border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-800/80">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
            <span className="text-sm font-semibold text-slate-300">IK</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-100">Igor K.</span>
            <span className="text-xs text-slate-500">Administrator</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
