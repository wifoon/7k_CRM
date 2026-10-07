"use client";

import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) {
  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
      {/* ─── LEWA STRONA: ILOŚĆ ELEMENTÓW NA STRONIE + STAN STRONY ─── */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span>Pokaż na stronę:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-[#0a0e17] border border-slate-800 text-white rounded-lg px-2.5 py-1 text-xs outline-none focus:border-blue-500 cursor-pointer font-sans"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <span className="text-slate-700">|</span>

        <div className="font-mono text-xs">
          Strona <strong className="text-white font-bold">{currentPage}</strong> z{' '}
          <strong className="text-white font-bold">{totalPages}</strong>{' '}
          <span className="text-slate-500">({totalItems} pozycji)</span>
        </div>
      </div>

      {/* ─── PRAWA STRONA: PRZYCISKI POPRZEDNIA / NASTĘPNA ─── */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="h-8.5 px-3 rounded-lg border border-slate-800 bg-[#0d121c] text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 font-medium cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Poprzednia</span>
        </button>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="h-8.5 px-3 rounded-lg border border-slate-800 bg-[#0d121c] text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 font-medium cursor-pointer"
        >
          <span>Następna</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
