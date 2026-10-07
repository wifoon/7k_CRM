"use client";

import { useState } from 'react';
import { BOMItem, JobCalculationSummary } from '@/utils/jobCalc';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface JobBOMBaseSectionProps {
  ledItems: BOMItem[];
  trussItems: BOMItem[];
  bomSummary: JobCalculationSummary | null;
}

export function JobBOMBaseSection({
  ledItems,
  trussItems,
  bomSummary,
}: JobBOMBaseSectionProps) {
  const [baseExpanded, setBaseExpanded] = useState(false);

  if (ledItems.length === 0 && trussItems.length === 0) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => setBaseExpanded(!baseExpanded)}
        className="w-full px-5 py-3 bg-[#0e131d] flex items-center gap-3 hover:bg-[#151c2a] transition-colors cursor-pointer group"
      >
        <span className="text-slate-500 group-hover:text-slate-300 transition-colors">
          {baseExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </span>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Baza Zlecenia
        </span>
        <div className="flex items-center gap-2 ml-auto text-xs font-mono">
          {ledItems.length > 0 && (
            <span className="text-purple-400/80">
              {bomSummary?.totalCases || 0} case · {bomSummary?.totalScreens || 0} ekr.
            </span>
          )}
          {ledItems.length > 0 && trussItems.length > 0 && (
            <span className="text-slate-700">•</span>
          )}
          {trussItems.length > 0 && (
            <span className="text-sky-400/80">
              {bomSummary?.totalTrussM || 0} m kraty
            </span>
          )}
        </div>
      </button>

      {baseExpanded && (
        <div className="divide-y divide-slate-800/40 bg-[#0d121c]">
          {ledItems.map((item) => (
            <div
              key={item.equipmentId}
              className="px-5 pl-11 py-2.5 flex items-center justify-between gap-3 hover:bg-[#141b29] transition-colors"
            >
              <span className="text-xs text-slate-400 truncate">{item.equipmentName}</span>
              <span className="shrink-0 font-mono text-xs font-semibold text-slate-300 tabular-nums">
                {item.requiredQty} {item.unit}
              </span>
            </div>
          ))}
          {trussItems.map((item) => (
            <div
              key={item.equipmentId}
              className="px-5 pl-11 py-2.5 flex items-center justify-between gap-3 hover:bg-[#141b29] transition-colors"
            >
              <span className="text-xs text-slate-400 truncate">{item.equipmentName}</span>
              <span className="shrink-0 font-mono text-xs font-semibold text-slate-300 tabular-nums">
                {item.requiredQty} {item.unit}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
