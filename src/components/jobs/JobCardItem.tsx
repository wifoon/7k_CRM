"use client";

import { useState } from 'react';
import { Job } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  MapPin,
  ArrowRight,
  Trash2,
  CheckCircle2,
  MoreVertical,
  User,
} from 'lucide-react';

interface JobCardItemProps {
  job: Job;
  onEdit: (id: string) => void;
  onRequestDelete: (job: Job) => void;
  onToggleStatus: (id: string) => void;
}

export function JobCardItem({
  job,
  onEdit,
  onRequestDelete,
  onToggleStatus,
}: JobCardItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isCompleted = job.status === 'zakonczone';
  const totalScreensArea = job.screens
    .reduce((sum, s) => sum + s.widthM * s.heightM, 0)
    .toFixed(1);

  return (
    <div
      onClick={() => onEdit(job.id)}
      className={`group relative rounded-xl p-5 transition-all cursor-pointer flex flex-col justify-between gap-4 ${
        isCompleted
          ? 'bg-[#090d16]/90 border border-slate-900 opacity-60 hover:opacity-95 hover:border-slate-800'
          : 'bg-[#121824] border border-slate-800/80 hover:border-slate-700 hover:shadow-lg'
      }`}
    >
      {/* ─── GÓRNY PASEK: NAZWA, TERMIN I STATUS ─── */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3
              className={`text-base font-bold transition-colors truncate ${
                isCompleted
                  ? 'text-slate-400 group-hover:text-slate-200'
                  : 'text-white group-hover:text-blue-300'
              }`}
            >
              {job.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {job.startDate || job.date}
                {job.endDate && job.endDate !== (job.startDate || job.date)
                  ? ` – ${job.endDate}`
                  : ''}
              </span>
              {job.startTime && (
                <span className="text-slate-300 font-medium">• {job.startTime}</span>
              )}
            </div>
          </div>

          {/* Status i Menu Kontekstowe */}
          <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
            <span
              className={`text-[11px] px-2.5 py-1 rounded-full font-semibold border flex items-center gap-1.5 ${
                isCompleted
                  ? 'bg-slate-800 text-slate-400 border-slate-700/60'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isCompleted ? 'bg-slate-500' : 'bg-emerald-400 animate-pulse'
                }`}
              />
              {isCompleted ? 'Zakończona' : 'W trakcie'}
            </span>

            {/* Menu kontekstowe */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                title="Więcej opcji"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <div
                  onMouseLeave={() => setMenuOpen(false)}
                  className="absolute right-0 top-8 z-30 w-44 bg-[#0d121c] border border-slate-800 rounded-xl p-1.5 shadow-2xl animate-in fade-in duration-150"
                >
                  <button
                    type="button"
                    onClick={() => {
                      onToggleStatus(job.id);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isCompleted ? 'Oznacz jako w trakcie' : 'Oznacz jako zakończoną'}</span>
                  </button>

                  <div className="h-px bg-slate-800 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      onRequestDelete(job);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 rounded-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Usuń z rejestru</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── BLOCZEK INFORMACYJNY: LOKALIZACJA I EKRANY ─── */}
        <div className="mt-3.5 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-[#0d121c] border border-slate-800/70 rounded-lg px-3 py-2">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{job.location || 'Brak przypisanej lokalizacji'}</span>
          </div>

          {/* Ekrany LED – fioletowa poświata dedykowana dla diody */}
          {job.screens.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {job.screens.map((scr, idx) => (
                <span
                  key={scr.id || idx}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold transition-colors ${
                    isCompleted
                      ? 'bg-purple-950/20 border border-purple-900/30 text-purple-400/60'
                      : 'bg-purple-950/30 border border-purple-500/30 text-purple-300 shadow-xs shadow-purple-500/10'
                  }`}
                >
                  {scr.widthM}×{scr.heightM}m
                </span>
              ))}
              <span className="text-[11px] font-mono text-slate-500 ml-0.5">
                ({totalScreensArea} m²)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ─── DOLNY PASEK: ORGANIZATOR I PRZYCISK WEJŚCIA ─── */}
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate max-w-[240px]">
          <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate font-mono text-[11px]">
            {job.organizerName || 'Organizator nieokreślony'}
          </span>
        </div>

        <Button
          size="sm"
          variant={isCompleted ? "secondary" : "default"}
          onClick={() => onEdit(job.id)}
          className="gap-1.5 shrink-0"
        >
          <span>{isCompleted ? 'Podgląd' : 'Otwórz Planer'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
