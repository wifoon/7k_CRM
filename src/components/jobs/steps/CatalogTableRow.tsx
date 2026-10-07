"use client";

import { EquipmentItem, JobCustomItem, mockCategories } from '@/lib/mockData';
import { getCategoryColorDef } from '@/utils/categoryColors';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Check } from 'lucide-react';

interface CatalogTableRowProps {
  item: EquipmentItem;
  inCart?: JobCustomItem;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onAddItem: (id: string, qty: number) => void;
  onSetQty: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
}

export function CatalogTableRow({
  item,
  inCart,
  isSelected,
  onToggleSelect,
  onAddItem,
  onSetQty,
  onRemoveItem,
}: CatalogTableRowProps) {
  const isAvailable = item.availableQty > 0;
  const cat = mockCategories.find((c) => c.id === item.categoryId);
  const catColor = getCategoryColorDef(cat?.color);

  return (
    <tr
      className={`border-b border-slate-800/60 transition-colors group ${
        isSelected ? 'bg-blue-600/10 hover:bg-blue-600/15' : 'hover:bg-slate-800/30'
      }`}
    >
      {/* Kwadratowy Checkbox (taki sam jak w Magazynie) */}
      <td className="w-12 pl-4 py-3.5 text-center">
        <button
          type="button"
          onClick={() => onToggleSelect(item.id)}
          className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all cursor-pointer ${
            isSelected
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'border-slate-700 bg-slate-900/60 hover:border-slate-500'
          }`}
          title={`Zaznacz ${item.name}`}
        >
          {isSelected && <Check size={11} strokeWidth={3} />}
        </button>
      </td>

      {/* Nazwa Sprzętu */}
      <td className="py-3.5 px-3">
        <div className="font-semibold text-sm text-white group-hover:text-blue-300 transition-colors">
          {item.name}
        </div>
      </td>

      {/* Kategoria (bez kropki) */}
      <td className="py-3.5 px-3">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${catColor.bg} ${catColor.text} ${catColor.border}`}
        >
          {cat?.name || item.categoryId}
        </span>
      </td>

      {/* Stan magazynowy */}
      <td className="py-3.5 px-3 text-center font-mono text-sm">
        <span className={`font-bold ${isAvailable ? 'text-emerald-400' : 'text-rose-400'}`}>
          {item.availableQty}
        </span>
        <span className="text-slate-400 text-xs">
          {' '}
          / {item.totalQty} {item.unit}
        </span>
      </td>

      {/* W zleceniu */}
      <td className="py-3.5 px-3 text-center">
        {inCart ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/15 border border-blue-500/30 text-blue-300">
            {inCart.qty} {item.unit}
          </span>
        ) : (
          <span className="text-slate-600 font-mono text-xs">—</span>
        )}
      </td>

      {/* Kontrolki dodawania */}
      <td className="py-3.5 pr-4 pl-3 text-right">
        {inCart ? (
          <div className="inline-flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => {
                if (inCart.qty > 1) {
                  onSetQty(item.id, inCart.qty - 1);
                } else {
                  onRemoveItem(item.id);
                }
              }}
              className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              title="Zmniejsz"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-mono font-bold text-white px-1.5">
              {inCart.qty}
            </span>
            <button
              type="button"
              onClick={() => onAddItem(item.id, 1)}
              className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              title="Zwiększ"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <Button
            size="sm"
            onClick={() => onAddItem(item.id, 1)}
            className="h-8 px-3 bg-blue-600/15 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 rounded-lg text-xs font-semibold gap-1 transition-all cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Dodaj</span>
          </Button>
        )}
      </td>
    </tr>
  );
}
