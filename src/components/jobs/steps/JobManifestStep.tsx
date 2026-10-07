"use client";

import { useState } from 'react';
import { useJobs } from '@/hooks/useJobs';
import { useSettings } from '@/hooks/useSettings';
import { useInventory } from '@/hooks/useInventory';
import { calculateJobBOM } from '@/utils/jobCalc';
import { Button } from '@/components/ui/button';
import {
  ClipboardList,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  Package,
  Layers,
  Construction,
  Cable,
  Check,
  Save,
} from 'lucide-react';

export function JobManifestStep() {
  const { editingDraft, editingJobId, jobs, saveDraft } = useJobs();
  const { ledSystems, constructionMapping, mountingPresets } = useSettings();
  const { items: inventory } = useInventory();

  // Stan lokalny odznaczonych pozycji dla celów checklisty (to mamy / spakowane)
  const [packedItemIds, setPackedItemIds] = useState<Record<string, boolean>>({});

  if (!editingDraft) return null;

  const existingJob = editingJobId ? jobs.find((j) => j.id === editingJobId) : null;

  const summary = calculateJobBOM({
    job: editingDraft,
    ledSystems,
    constructionMapping,
    mountingPresets,
    inventory,
    existingJobBeforeEdit: existingJob,
  });

  const togglePacked = (id: string) => {
    setPackedItemIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleMarkAllPacked = () => {
    const all: Record<string, boolean> = {};
    summary.items.forEach((i) => {
      all[i.equipmentId] = true;
    });
    setPackedItemIds(all);
  };

  const packedCount = summary.items.filter((i) => packedItemIds[i.equipmentId]).length;
  const totalCount = summary.items.length;
  const progressPercent = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 100;

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-200">
      {/* ─── KROK HEADER I AKCJE EKSPORTU ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 print:hidden">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-amber-400" />
            Lista Załadunkowa (WZ) & Odprawa Sprzętu
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Odznaczaj spakowany sprzęt na liście i wygeneruj dokument WZ dla ekipy.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllPacked}
            className="bg-[#121824] border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs h-9 px-3"
          >
            <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
            Oznacz Wszystkie
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="bg-[#121824] border-slate-700 text-slate-200 hover:text-white rounded-xl text-xs h-9 px-3 gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-blue-400" />
            Drukuj WZ
          </Button>

          <Button
            size="sm"
            onClick={saveDraft}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold h-9 px-4 shadow-lg shadow-blue-600/25 gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            Zatwierdź Zlecenie
          </Button>
        </div>
      </div>

      {/* ─── KARTA POSTĘPU ZAŁADUNKU ─── */}
      <div className="bg-[#121824] border border-slate-800/80 rounded-xl p-5 print:hidden space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-400" />
            Stan Spakowania Sprzętu:
          </span>
          <span className="font-mono font-bold text-emerald-400">
            {packedCount} z {totalCount} pozycji spakowanych ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* ─── ARKUSZ LISTY ZAŁADUNKOWEJ ─── */}
      <div className="bg-[#121824] border border-slate-800/80 rounded-xl p-6 sm:p-8 space-y-6 shadow-xl print:bg-white print:text-black print:p-0 print:border-0">
        {/* Metryka nagłówkowa dokumentu */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800 print:border-slate-300">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold block mb-1 print:text-slate-600">
              7K LED WMS · SPECYFIKACJA ZAŁADUNKU
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight print:text-black">
              WZ / LISTA: {editingDraft.name || 'Realizacja'}
            </h1>
          </div>

          <div className="text-left sm:text-right text-xs font-mono text-slate-400 print:text-slate-600 space-y-0.5">
            <div>
              Termin:{' '}
              <strong className="text-white print:text-black">
                {editingDraft.startDate || editingDraft.date}
                {editingDraft.endDate && editingDraft.endDate !== (editingDraft.startDate || editingDraft.date)
                  ? ` – ${editingDraft.endDate}`
                  : ''}
              </strong>
            </div>
            {editingDraft.startTime && (
              <div className="text-blue-400 print:text-black">
                Start Imprezy: <strong>{editingDraft.startTime}</strong>
              </div>
            )}
            {editingDraft.organizerName && (
              <div>
                Organizator:{' '}
                <strong className="text-white print:text-black">
                  {editingDraft.organizerName}
                </strong>
              </div>
            )}
            {editingDraft.location && (
              <div>Miejsce: <strong className="text-white print:text-black">{editingDraft.location}</strong></div>
            )}
          </div>
        </div>

        {/* Tabela pozycji */}
        <div className="space-y-2">
          {summary.items.map((item, idx) => {
            const isPacked = packedItemIds[item.equipmentId];
            return (
              <div
                key={item.equipmentId}
                onClick={() => togglePacked(item.equipmentId)}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  isPacked
                    ? 'bg-emerald-950/20 border-emerald-500/40 opacity-70 print:bg-slate-50'
                    : 'bg-[#0d121c] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                      isPacked
                        ? 'bg-emerald-500 border-emerald-400 text-white'
                        : 'border-slate-700 bg-slate-900 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>

                  <div className="min-w-0">
                    <span
                      className={`text-xs font-bold block truncate ${
                        isPacked ? 'line-through text-slate-400' : 'text-white'
                      }`}
                    >
                      {item.equipmentName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {item.sources.length > 0 ? item.sources.join(' • ') : 'Zapotrzebowanie zlecenia'}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-mono font-bold text-white block">
                    {item.requiredQty} {item.unit}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    W magazynie: {item.availableQty}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stopka z podpisami (widoczna na wydruku A4) */}
        <div className="pt-8 border-t border-slate-800 print:border-slate-300 hidden print:grid grid-cols-2 gap-8 text-xs text-slate-600">
          <div className="border-t border-slate-400 pt-2 text-center">
            Podpis Magazyniera (Wydający)
          </div>
          <div className="border-t border-slate-400 pt-2 text-center">
            Podpis Kierowcy / Ekipy (Odbierający)
          </div>
        </div>
      </div>
    </div>
  );
}
