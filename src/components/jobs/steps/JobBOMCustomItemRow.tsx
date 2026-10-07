"use client";

import { JobCustomItem, EquipmentItem, mockCategories } from '@/lib/mockData';
import { getCategoryColorDef } from '@/utils/categoryColors';
import { Plus, Minus, Trash2, X } from 'lucide-react';

interface JobBOMCustomItemRowProps {
  customItem: JobCustomItem;
  inventoryItem?: EquipmentItem;
  onSetQty: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
}

export function JobBOMCustomItemRow({
  customItem,
  inventoryItem,
  onSetQty,
  onRemoveItem,
}: JobBOMCustomItemRowProps) {
  const cat = mockCategories.find((c) => c.id === inventoryItem?.categoryId);
  const catColor = getCategoryColorDef(cat?.color);

  return (
    <div className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-blue-950/30 transition-colors group">
      {/* Hover ✕ po lewej – bezpieczny od strefy +/- */}
      <button
        type="button"
        onClick={() => onRemoveItem(customItem.equipmentId)}
        className="w-5 h-5 flex items-center justify-center text-transparent group-hover:text-slate-500 hover:!text-rose-400 transition-colors cursor-pointer shrink-0"
        title="Usuń pozycję"
      >
        <X size={14} strokeWidth={2.5} />
      </button>

      <div className="min-w-0 flex-1 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full shrink-0 ${catColor.dot} ring-2 ring-blue-500/10`} />
        <span className="font-semibold text-sm text-white group-hover:text-blue-300 transition-colors truncate">
          {inventoryItem?.name || customItem.equipmentId}
        </span>
      </div>

      {/* Stepper: [-/🗑] [qty unit] [+] */}
      <div className="shrink-0 flex items-center gap-1.5 bg-[#060913] border border-blue-950/70 hover:border-blue-500/40 transition-colors rounded-lg p-1">
        <button
          type="button"
          onClick={() =>
            customItem.qty > 1
              ? onSetQty(customItem.equipmentId, customItem.qty - 1)
              : onRemoveItem(customItem.equipmentId)
          }
          className={`w-6 h-6 flex items-center justify-center rounded transition-colors cursor-pointer ${
            customItem.qty === 1
              ? 'text-rose-400/70 hover:text-rose-400 hover:bg-rose-950/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title={customItem.qty === 1 ? 'Usuń pozycję' : 'Zmniejsz ilość'}
        >
          {customItem.qty === 1 ? <Trash2 size={12} /> : <Minus size={13} />}
        </button>
        <div className="min-w-[48px] text-center font-mono">
          <span className="text-sm font-bold text-white tabular-nums">{customItem.qty}</span>
          <span className="text-xs text-slate-400 ml-1">{inventoryItem?.unit || 'szt.'}</span>
        </div>
        <button
          type="button"
          onClick={() => onSetQty(customItem.equipmentId, customItem.qty + 1)}
          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-blue-300 hover:bg-blue-600/20 rounded transition-colors cursor-pointer"
          title="Zwiększ ilość"
        >
          <Plus size={13} />
        </button>
      </div>
    </div>
  );
}
