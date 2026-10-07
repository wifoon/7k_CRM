"use client";

import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';

export function Topbar() {
  const pathname = usePathname();
  
  const title = pathname === '/' 
    ? 'Pulpit' 
    : pathname.split('/')[1].charAt(0).toUpperCase() + pathname.split('/')[1].slice(1);

  return (
    <header className="sticky top-0 z-50 h-16 backdrop-blur-md bg-[#090D16]/80 border-b border-slate-800/80 flex items-center justify-between px-8">
      <h1 className="text-xl font-bold tracking-tight text-white">{title}</h1>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800/50">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
        </button>
      </div>
    </header>
  );
}
