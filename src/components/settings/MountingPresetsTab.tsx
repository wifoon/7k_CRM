"use client";

import { useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Box, Check } from 'lucide-react';

export function MountingPresetsTab() {
  const { mountingPresets, updateMountingPreset } = useSettings();
  const [newItemName, setNewItemName] = useState<Record<string, string>>({});
  const [newItemQty, setNewItemQty] = useState<Record<string, number>>({});
  const [justSaved, setJustSaved] = useState<string | null>(null);

  const handleQtyChange = (presetId: string, itemIdx: number, newQty: number) => {
    const preset = mountingPresets.find((p) => p.id === presetId);
    if (!preset) return;

    const updatedItems = [...preset.items];
    updatedItems[itemIdx] = { ...updatedItems[itemIdx], qty: Math.max(1, newQty) };
    updateMountingPreset(presetId, { items: updatedItems });
  };

  const handleRemoveItem = (presetId: string, itemIdx: number) => {
    const preset = mountingPresets.find((p) => p.id === presetId);
    if (!preset) return;

    const updatedItems = preset.items.filter((_, idx) => idx !== itemIdx);
    updateMountingPreset(presetId, { items: updatedItems });
  };

  const handleAddItem = (presetId: string) => {
    const name = newItemName[presetId]?.trim();
    const qty = newItemQty[presetId] || 1;
    if (!name) return;

    const preset = mountingPresets.find((p) => p.id === presetId);
    if (!preset) return;

    const updatedItems = [...preset.items, { name, qty }];
    updateMountingPreset(presetId, { items: updatedItems });

    setNewItemName((prev) => ({ ...prev, [presetId]: '' }));
    setNewItemQty((prev) => ({ ...prev, [presetId]: 1 }));
    setJustSaved(presetId);
    setTimeout(() => setJustSaved(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">Presety Osprzętu Montażowego</h2>
        <p className="text-sm text-slate-400 mt-0.5">
          Skonfiguruj stały osprzęt dodawany automatycznie do bramek i belek podwieszanych.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {mountingPresets.map((preset) => (
          <div
            key={preset.id}
            className="bg-[#121824] border border-slate-800 rounded-xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Box className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{preset.label}</h3>
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                    Typ konstrukcji: {preset.type}
                  </span>
                </div>
              </div>
              {justSaved === preset.id && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <Check className="w-4 h-4" />
                  <span>Zapisano</span>
                </div>
              )}
            </div>

            {/* Items Table */}
            <div className="space-y-2">
              {preset.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all text-xs"
                >
                  <span className="font-medium text-slate-200">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Ilość:</span>
                    <Input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => handleQtyChange(preset.id, idx, parseInt(e.target.value) || 1)}
                      className="w-16 h-8 text-center font-mono"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(preset.id, idx)}
                      className="h-8 w-8 p-0 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Item Row */}
            <div className="flex items-center gap-2 pt-2">
              <Input
                placeholder="Nowa pozycja (np. Szakle 3.25T)..."
                value={newItemName[preset.id] || ''}
                onChange={(e) =>
                  setNewItemName((prev) => ({ ...prev, [preset.id]: e.target.value }))
                }
                className="h-9"
              />
              <Input
                type="number"
                min={1}
                value={newItemQty[preset.id] || 1}
                onChange={(e) =>
                  setNewItemQty((prev) => ({
                    ...prev,
                    [preset.id]: parseInt(e.target.value) || 1,
                  }))
                }
                className="w-20 h-9 text-center font-mono"
              />
              <Button
                onClick={() => handleAddItem(preset.id)}
                className="gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Dodaj
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
