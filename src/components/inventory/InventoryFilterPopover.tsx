"use client";

import { useState, useRef, useEffect } from 'react';
import { SlidersHorizontal, Check, RotateCcw } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useInventory, InventoryStatusFilter } from '@/hooks/useInventory';

interface InventoryFilterPopoverProps {
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
}

export function InventoryFilterPopover({
  categoryFilter,
  setCategoryFilter,
}: InventoryFilterPopoverProps) {
  const { categories } = useSettings();
  const { statusFilter, setStatusFilter } = useInventory();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Zliczanie aktywnych filtrów
  const activeCount = (categoryFilter !== 'all' ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const clearAllFilters = () => {
    setCategoryFilter('all');
    setStatusFilter('all');
  };

  const statusOptions: { id: InventoryStatusFilter; label: string }[] = [
    { id: 'all', label: 'Wszystkie stany' },
    { id: 'dostepny', label: 'Tylko dostępne' },
    { id: 'w_terenie', label: 'W terenie (realizacje)' },
    { id: 'serwis', label: 'W naprawie (serwis)' },
    { id: 'alert', label: 'Alerty (brak / niski stan)' },
  ];

  return (
    <div className="relative" ref={popoverRef}>
      {/* Przycisk Filtry */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
          activeCount > 0
            ? 'bg-blue-600/20 border-blue-500/60 text-blue-300 shadow-sm'
            : 'bg-[#151D2C] border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
      >
        <SlidersHorizontal size={14} className={activeCount > 0 ? 'text-blue-400' : 'text-slate-400'} />
        <span>Filtry</span>
        {activeCount > 0 && (
          <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center font-mono">
            {activeCount}
          </span>
        )}
      </button>

      {/* Pływające menu filtrów */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#111726] border border-slate-700/80 rounded-xl shadow-2xl shadow-black/70 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Filtry magazynowe</h4>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={11} />
                Wyczyść
              </button>
            )}
          </div>

          <div className="space-y-4 py-3">
            {/* Status */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Status dostępności
              </label>
              <div className="space-y-1">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setStatusFilter(opt.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      statusFilter === opt.id
                        ? 'bg-blue-600/20 text-blue-300 font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {statusFilter === opt.id && <Check size={13} className="text-blue-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Kategoria - dynamiczne pełne nazwy */}
            <div className="pt-2 border-t border-slate-800">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Kategoria sprzętu
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setCategoryFilter('all')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
                    categoryFilter === 'all'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-white'
                  }`}
                >
                  Wszystkie
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
                      categoryFilter === cat.id
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              Gotowe
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
