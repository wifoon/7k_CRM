"use client";

import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeleteScreenConfirmDialogProps {
  isOpen: boolean;
  screenName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteScreenConfirmDialog({
  isOpen,
  screenName,
  onConfirm,
  onCancel,
}: DeleteScreenConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#121824] border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-5 shadow-2xl shadow-black/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Usunąć ekran z realizacji?
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tej operacji nie można cofnąć.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
          Czy na pewno chcesz usunąć ekran <strong className="text-white font-semibold">«{screenName}»</strong>?
          <p className="text-[11px] text-slate-400 mt-1">
            Wszystkie skojarzone z nim skrzynie diody LED, moduły oraz odcinki konstrukcji zostaną natychmiast zwolnione z rezerwacji.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs h-9 px-4"
          >
            Anuluj
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={onConfirm}
            className="bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold gap-1.5 h-9 px-4 shadow-sm shadow-rose-600/30"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Tak, usuń ekran</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
