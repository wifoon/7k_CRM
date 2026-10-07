"use client";

import { useState, useRef, useEffect } from 'react';
import { Category } from '@/lib/mockData';
import { SlidersHorizontal, Check, X, RotateCcw } from 'lucide-react';

interface JobExtraGearFiltersProps {
  categories: Category[];
  selectedCat: string;
  setSelectedCat: (cat: string) => void;
  stockFilter: 'all' | 'available_only';
  setStockFilter: (stock: 'all' | 'available_only') => void;
}

export function JobExtraGearFilters({
  categories,
  selectedCat,
  setSelectedCat,
  stockFilter,
  setStockFilter,
}: JobExtraGearFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Zamykanie przy kliknięciu poza komponentem
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const activeCount = (selectedCat !== 'all' ? 1 : 0) + (stockFilter !== 'all' ? 1 : 0);
  const activeCategoryObj = categories.find((c) => c.id === selectedCat);

  const clearAllFilters = () => {
    setSelectedCat('all');
    setStockFilter('all');
  };

  return (
    <div className="relative flex items-center gap-2" ref={containerRef}>
      {/* ─── PRZYCISK GŁÓWNY FILTRÓW (JAK W MAGAZYNIE) ─── */}
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

      {/* ─── AKTYWNE FILTRY CHIPS (SZYBKIE USUWANIE) ─── */}
      {selectedCat !== 'all' && activeCategoryObj && (
        <span className="inline-flex items-center gap-1.5 h-7.5 px-2.5 rounded-lg bg-slate-900/80 border border-slate-700/70 text-xs text-slate-200 font-medium">
          <span className="max-w-[120px] truncate">{activeCategoryObj.name}</span>
          <button
            type="button"
            onClick={() => setSelectedCat('all')}
            className="text-slate-400 hover:text-white ml-0.5 cursor-pointer"
            title="Usuń filtr kategorii"
          >
            <X size={12} />
          </button>
        </span>
      )}

      {stockFilter === 'available_only' && (
        <span className="inline-flex items-center gap-1.5 h-7.5 px-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-medium font-mono">
          <span>Na stanie (&gt;0)</span>
          <button
            type="button"
            onClick={() => setStockFilter('all')}
            className="text-emerald-500 hover:text-white ml-0.5 cursor-pointer"
            title="Usuń filtr dostępności"
          >
            <X size={12} />
          </button>
        </span>
      )}

      {/* ─── PŁYWAJĄCE MENU FILTRÓW (JAK W MAGAZYNIE) ─── */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-[#111726] border border-slate-700/80 rounded-xl shadow-2xl shadow-black/70 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
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
            {/* Status dostępności */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Status dostępności
              </label>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setStockFilter('all')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    stockFilter === 'all'
                      ? 'bg-blue-600/20 text-blue-300 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <span>Wszystkie stany</span>
                  {stockFilter === 'all' && <Check size={13} className="text-blue-400" />}
                </button>

                <button
                  type="button"
                  onClick={() => setStockFilter('available_only')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    stockFilter === 'available_only'
                      ? 'bg-blue-600/20 text-blue-300 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <span>Tylko na stanie (&gt;0)</span>
                  {stockFilter === 'available_only' && <Check size={13} className="text-blue-400" />}
                </button>
              </div>
            </div>

            {/* Kategoria sprzętu */}
            <div className="pt-2 border-t border-slate-800">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Kategoria sprzętu
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedCat('all')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
                    selectedCat === 'all'
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
                    onClick={() => setSelectedCat(cat.id)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
                      selectedCat === cat.id
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
