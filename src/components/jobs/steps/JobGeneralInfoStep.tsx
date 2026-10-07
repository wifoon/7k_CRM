"use client";

import { useJobs } from "@/hooks/useJobs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  FileText,
  ArrowRight,
} from "lucide-react";

interface JobGeneralInfoStepProps {
  onNext: () => void;
}

export function JobGeneralInfoStep({ onNext }: JobGeneralInfoStepProps) {
  const { editingDraft, updateDraft } = useJobs();

  if (!editingDraft) return null;

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-200">
      {/* ─── KROK HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            Informacje Ogólne & Terminy Wydarzenia
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Wprowadź ramy czasowe imprezy, lokalizację oraz dane kontaktowe do organizatora.
          </p>
        </div>

        <Button onClick={onNext} className="gap-2 self-start sm:self-auto">
          <span>Dalej: Ekrany LED</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* ─── SIATKA BENTO DANYCH (8 + 4) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Karta Główna: Metryka Wydarzenia (8 Kolumn) */}
        <div className="lg:col-span-8 bg-[#121824] border border-slate-800/80 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800/60">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Metryka Wydarzenia
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-xs text-slate-300 font-semibold mb-1.5 block">
                Nazwa Realizacji / Wydarzenia <span className="text-rose-400">*</span>
              </Label>
              <Input
                value={editingDraft.name}
                onChange={(e) => updateDraft({ name: e.target.value })}
                placeholder="np. Gala Jubileuszowa Orlen 2026, Festiwal Świateł..."
                className="h-11 text-sm"
              />
            </div>

            {/* Daty i Godzina Rozpoczęcia */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-slate-300 font-semibold mb-1.5 block">
                  Data Rozpoczęcia
                </Label>
                <Input
                  type="date"
                  value={editingDraft.startDate || editingDraft.date}
                  onChange={(e) =>
                    updateDraft({
                      startDate: e.target.value,
                      date: e.target.value,
                    })
                  }
                  className="h-10 font-mono"
                />
              </div>

              <div>
                <Label className="text-xs text-slate-300 font-semibold mb-1.5 block">
                  Data Zakończenia
                </Label>
                <Input
                  type="date"
                  value={editingDraft.endDate || editingDraft.startDate || editingDraft.date}
                  onChange={(e) => updateDraft({ endDate: e.target.value })}
                  className="h-10 font-mono"
                />
              </div>

              <div>
                <Label className="text-xs text-blue-400 font-semibold mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Start Imprezy
                </Label>
                <Input
                  type="time"
                  value={editingDraft.startTime || "18:00"}
                  onChange={(e) => updateDraft({ startTime: e.target.value })}
                  className="h-10 font-mono"
                />
              </div>
            </div>

            {/* Lokalizacja */}
            <div>
              <Label className="text-xs text-slate-300 font-semibold mb-1.5 block">
                Lokalizacja / Obiekt / Hala
              </Label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={editingDraft.location}
                  onChange={(e) => updateDraft({ location: e.target.value })}
                  placeholder="np. EXPO XXI Warszawa, Hala 1"
                  className="h-10 pl-9"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Karta Boczna: Organizator & Notatki (4 Kolumny) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-[#121824] border border-slate-800/80 rounded-xl p-6 space-y-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider block pb-2 border-b border-slate-800/60">
              Organizator & Kontakt
            </span>

            <div className="space-y-3">
              <div>
                <Label className="text-xs text-slate-400 mb-1 block">Organizator</Label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    value={editingDraft.organizerName || ""}
                    onChange={(e) => updateDraft({ organizerName: e.target.value })}
                    placeholder="np. Agencja Live / Jan Kowalski"
                    className="h-9.5 pl-9"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs text-slate-400 mb-1 block">Numer Organizatora</Label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    value={editingDraft.organizerPhone || ""}
                    onChange={(e) => updateDraft({ organizerPhone: e.target.value })}
                    placeholder="np. +48 501 234 567"
                    className="h-9.5 pl-9 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#121824] border border-slate-800/80 rounded-xl p-6 space-y-3">
            <Label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800/60">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Dodatkowe Uwagi do Realizacji
            </Label>
            <Textarea
              rows={4}
              value={editingDraft.notes || ""}
              onChange={(e) => updateDraft({ notes: e.target.value })}
              placeholder="np. Wjazd od ulicy Prądzyńskiego. Winda towarowa. Próby reżyserskie od 16:00..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
