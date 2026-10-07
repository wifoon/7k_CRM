"use client";

import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Truck, Clock, MapPin } from 'lucide-react';
import { Job } from '@/lib/mockData';

interface JobsRampScheduleWidgetProps {
  jobs: Job[];
  onSelectJob: (id: string) => void;
}

export function JobsRampScheduleWidget({ jobs, onSelectJob }: JobsRampScheduleWidgetProps) {
  const [selectedDay, setSelectedDay] = useState<number>(18);

  // Dni tygodnia
  const weekDays = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];
  // Dni miesiąca dla mockupu (Październik 2026)
  const days = [
    { num: 12, hasJob: true },
    { num: 13, hasJob: false },
    { num: 14, hasJob: false },
    { num: 15, hasJob: false },
    { num: 16, hasJob: false },
    { num: 17, hasJob: false },
    { num: 18, hasJob: true },
    { num: 19, hasJob: false },
    { num: 20, hasJob: false },
    { num: 21, hasJob: false },
    { num: 22, hasJob: true },
    { num: 23, hasJob: false },
    { num: 24, hasJob: false },
    { num: 25, hasJob: false },
  ];

  return (
    <div className="bg-[#121824] border border-slate-800/80 rounded-xl p-5 space-y-5">
      {/* ─── Nagłówek Kalendarza ─── */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">Harmonogram Wyjazdów</h4>
            <p className="text-[11px] text-slate-400 font-mono">Październik 2026</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── Mini-Siatka Kalendarza ─── */}
      <div>
        <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
          {weekDays.map((d) => (
            <span key={d} className="text-[10px] font-bold text-slate-500 uppercase">
              {d}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {days.map((d) => {
            const isSelected = selectedDay === d.num;
            return (
              <button
                key={d.num}
                onClick={() => setSelectedDay(d.num)}
                className={`h-8 rounded-xl text-xs font-mono font-medium transition-all relative flex items-center justify-center ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                    : d.hasJob
                    ? 'bg-slate-800/80 text-blue-300 hover:bg-slate-800 border border-blue-500/30 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                {d.num}
                {d.hasJob && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 absolute bottom-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Lista Wyjazdów & Zdarzeń ─── */}
      <div className="space-y-2.5 pt-2 border-t border-slate-800/60">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Nadchodzące Wydarzenia
        </span>

        {jobs.slice(0, 3).map((job) => (
          <div
            key={job.id}
            onClick={() => onSelectJob(job.id)}
            className="group bg-[#0d121c] border border-slate-800 hover:border-slate-700 rounded-xl p-3 flex items-center justify-between gap-3 cursor-pointer transition-all"
          >
            <div className="min-w-0">
              <h5 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                {job.name}
              </h5>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                <span className="flex items-center gap-1 text-blue-400">
                  <Clock className="w-3 h-3" />
                  Start: {job.startTime || '18:00'}
                </span>
                <span>• {job.startDate || job.date}</span>
              </div>
            </div>

            <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-lg shrink-0 flex items-center gap-1 group-hover:bg-blue-600 group-hover:text-white transition-all">
              Szczegóły &gt;
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
