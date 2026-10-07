"use client";

import { useState } from 'react';
import { useInventory } from '@/hooks/useInventory';
import { EquipmentItem } from '@/lib/mockData';
import { Wrench, X, Plus, Minus, RotateCcw } from 'lucide-react';

interface ServiceActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: EquipmentItem;
  action: 'to_service' | 'from_service';
}

export function ServiceActionModal({ isOpen, onClose, item, action: initialAction }: ServiceActionModalProps) {
  const { moveToService, restoreFromService } = useInventory();
  const [tab, setTab] = useState<'send' | 'restore'>(initialAction === 'to_service' ? 'send' : 'restore');
  const [qty, setQty] = useState(1);

  if (!isOpen) return null;

  const sQty = item.serviceQty;
  const maxSend = item.availableQty;
  const maxRestore = sQty;
  const maxQty = tab === 'send' ? maxSend : maxRestore;

  const handleReturnAll = () => {
    if (sQty > 0) {
      restoreFromService(item.id, sQty);
      onClose();
    }
  };

  const handleSubmit = () => {
    if (qty <= 0 || qty > maxQty) return;
    if (tab === 'send') moveToService(item.id, qty);
    else restoreFromService(item.id, qty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#111726] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-[#0d121c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Wrench size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Obsługa Serwisowa</h2>
              <p className="text-xs text-slate-400 font-mono">{item.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Szybki przycisk 1-klik: Zwróć całość z serwisu */}
          {sQty > 0 && (
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-emerald-300">W naprawie: {sQty} {item.unit}</p>
                <p className="text-[11px] text-slate-400">Przywróć cały sprzęt do magazynu</p>
              </div>
              <button
                type="button"
                onClick={handleReturnAll}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <RotateCcw size={13} />
                Zwróć całość ({sQty})
              </button>
            </div>
          )}

          {/* Przełącznik trybu */}
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => { setTab('send'); setQty(1); }}
              disabled={maxSend <= 0}
              className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all disabled:opacity-30 ${
                tab === 'send' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Wyślij do serwisu
            </button>
            <button
              onClick={() => { setTab('restore'); setQty(Math.min(1, maxRestore)); }}
              disabled={maxRestore <= 0}
              className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all disabled:opacity-30 ${
                tab === 'restore' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Zwróć część
            </button>
          </div>

          {/* Stepper ilości z szybkimi przyciskami */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Liczba skrzyń / sztuk:</span>
              <span className="text-slate-500 font-mono">Dostępne: {maxQty} {item.unit}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center font-mono font-bold text-white text-base">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                  className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Szybkie presety */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setQty(1)}
                  className="px-2 py-1 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                >
                  1
                </button>
                <button
                  type="button"
                  onClick={() => setQty(maxQty)}
                  className="px-2 py-1 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                >
                  Wszystko ({maxQty})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-[#0d121c] flex items-center justify-end gap-2.5">
          <button onClick={onClose} className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white">
            Anuluj
          </button>
          <button
            onClick={handleSubmit}
            disabled={qty <= 0 || qty > maxQty}
            className={`px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all shadow-md disabled:opacity-40 ${
              tab === 'send' ? 'bg-orange-600 hover:bg-orange-500' : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            {tab === 'send' ? 'Wyślij na serwis' : 'Potwierdź zwrot'}
          </button>
        </div>
      </div>
    </div>
  );
}
