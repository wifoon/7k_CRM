"use client";

import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  count?: number;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Usuń pozycje z magazynu",
  description,
  count,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Tło przyciemniające */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Kontener okna */}
      <div className="relative w-full max-w-md bg-[#111726] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Nagłówek */}
        <div className="px-6 py-4 border-b border-slate-800 bg-[#0d121c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">{title}</h2>
              {count !== undefined && count > 0 && (
                <p className="text-xs text-rose-400 font-medium">
                  Dotyczy {count} {count === 1 ? "pozycji" : "pozycji"}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Zawartość */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            {description ||
              `Czy na pewno chcesz usunąć wybrane pozycje ze stanu magazynowego? Ta operacja jest nieodwracalna.`}
          </p>

          <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl">
            <p className="text-xs text-rose-300 font-medium">
              Uwaga: Usunięty sprzęt zniknie z katalogu i nie będzie dostępny do nowych rezerwacji.
            </p>
          </div>
        </div>

        {/* Przyciski */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#0d121c] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Anuluj
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-lg shadow-rose-600/30 cursor-pointer"
          >
            <Trash2 size={14} />
            Usuń trwale
          </button>
        </div>
      </div>
    </div>
  );
}
