"use client";

import { Clock, Tv, PackageCheck, HelpCircle } from 'lucide-react';
import { Job } from '@/lib/mockData';

interface JobsKpiCardsProps {
  jobs: Job[];
}

export function JobsKpiCards({ jobs }: JobsKpiCardsProps) {
  const activeJobs = jobs.filter((j) => j.status === 'w_trakcie');
  const completedJobs = jobs.filter((j) => j.status === 'zakonczone');
  const totalScreens = jobs.reduce((sum, j) => sum + j.screens.length, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Karta 1: Aktywne Realizacje */}
      <div className="bg-[#121824] border border-slate-800/80 rounded-xl p-4.5 hover:border-slate-700/80 transition-all">
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-800/60 border border-slate-700/60 px-2 py-0.5 rounded-full font-mono">
            {activeJobs.length} w toku
          </span>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold text-white font-mono tabular-nums tracking-tight">
            {activeJobs.length}
          </span>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Aktywne Realizacje</p>
          <span className="text-[11px] text-slate-500 block mt-1 font-mono">
            {completedJobs.length} zakończonych
          </span>
        </div>
      </div>

      {/* Karta 2: Powierzchnia LED na scenach */}
      <div className="bg-[#121824] border border-slate-800/80 rounded-xl p-4.5 hover:border-slate-700/80 transition-all">
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Tv className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-800/60 border border-slate-700/60 px-2 py-0.5 rounded-full font-mono">
            {totalScreens} ekr.
          </span>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold text-white font-mono tabular-nums tracking-tight">
            ~185 m²
          </span>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Powierzchnia LED na Scenach</p>
          <span className="text-[11px] text-slate-500 block mt-1 font-mono">
            Zestawienie ze wszystkich zleceń
          </span>
        </div>
      </div>

      {/* Karta 3: Zaplanowane Wydarzenia */}
      <div className="bg-[#121824] border border-slate-800/80 rounded-xl p-4.5 hover:border-slate-700/80 transition-all">
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <PackageCheck className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-800/60 border border-slate-700/60 px-2 py-0.5 rounded-full font-mono">
            Wszystkie
          </span>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold text-white font-mono tabular-nums tracking-tight">
            {jobs.length} Imprez
          </span>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Zaplanowane w Rejestrze</p>
          <span className="text-[11px] text-slate-500 block mt-1 font-mono">
            Zlecenia w bazie danych
          </span>
        </div>
      </div>

      {/* Karta 4: Miejsce na metrykę (Do uzupełnienia) */}
      <div className="bg-[#121824]/60 border border-dashed border-slate-800 rounded-xl p-4.5 transition-all">
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
            <HelpCircle className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-medium text-slate-500 bg-slate-900/80 border border-slate-800 px-2 py-0.5 rounded-full">
            Do ustalenia
          </span>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold text-slate-500 font-mono tracking-tight">
            —
          </span>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">Do Uzupełnienia</p>
          <span className="text-[11px] text-slate-600 block mt-1">
            Miejsce na nową metrykę
          </span>
        </div>
      </div>
    </div>
  );
}
