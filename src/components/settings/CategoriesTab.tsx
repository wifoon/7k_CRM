"use client";

import { useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useInventory } from '@/hooks/useInventory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tag, Plus, Trash2, Edit2, Check, AlertTriangle } from 'lucide-react';
import { CATEGORY_COLOR_PALETTE, getCategoryColorDef } from '@/utils/categoryColors';

export function CategoriesTab() {
  const { categories, addCategory, updateCategory, deleteCategory } = useSettings();
  const { items } = useInventory();

  const [newCatId, setNewCatId] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('blue');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingColor, setEditingColor] = useState('blue');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const id = newCatId.trim().toLowerCase().replace(/\s+/g, '-');
    const name = newCatName.trim();
    if (!id || !name) return;

    if (categories.some((c) => c.id === id)) {
      setErrorMsg(`Kategoria o ID "${id}" już istnieje.`);
      return;
    }

    addCategory({
      id,
      name,
      color: newCatColor,
    });

    setNewCatId('');
    setNewCatName('');
    setNewCatColor('blue');
    setErrorMsg(null);
  };

  const handleStartEdit = (id: string, name: string, color?: string) => {
    setEditingId(id);
    setEditingName(name);
    setEditingColor(color || 'blue');
  };

  const handleSaveEdit = (id: string) => {
    if (editingName.trim()) {
      updateCategory(id, { name: editingName.trim(), color: editingColor });
    }
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    const count = items.filter((i) => i.categoryId === id).length;
    if (count > 0) {
      setErrorMsg(`Nie można usunąć kategorii "${id}" – zawiera ${count} pozycji w magazynie.`);
      return;
    }

    deleteCategory(id);
    setErrorMsg(null);
  };

  const paletteList = Object.values(CATEGORY_COLOR_PALETTE);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">Kategorie Magazynowe</h2>
        <p className="text-sm text-slate-400 mt-0.5">
          Zarządzaj strukturą kategoryzacji sprzętu i przypisaną kolorystyką w systemie.
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Add New Category */}
      <form onSubmit={handleAdd} className="bg-[#121824] border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Input
            placeholder="Unikalne ID (np. audio, video)..."
            value={newCatId}
            onChange={(e) => setNewCatId(e.target.value)}
            className="h-10"
            required
          />
          <Input
            placeholder="Nazwa kategorii (np. Nagłośnienie)..."
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="h-10"
            required
          />
          <Button
            type="submit"
            className="h-10 gap-1 shrink-0 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Dodaj Kategorię
          </Button>
        </div>

        {/* Color Palette Picker */}
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          <span className="text-[11px] text-slate-400 font-medium">Kolor znacznika:</span>
          {paletteList.map((col) => {
            const isSelected = newCatColor === col.value;
            return (
              <button
                key={col.value}
                type="button"
                onClick={() => setNewCatColor(col.value)}
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium border transition-all ${col.bg} ${col.text} ${
                  isSelected ? `${col.border} ring-1 ${col.ring} scale-105` : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                {col.name}
              </button>
            );
          })}
        </div>
      </form>

      {/* Categories List */}
      <div className="bg-[#121824] border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/80">
        {categories.map((cat) => {
          const itemCount = items.filter((i) => i.categoryId === cat.id).length;
          const isEditing = editingId === cat.id;
          const style = getCategoryColorDef(cat.color);

          return (
            <div
              key={cat.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${style.bg} border ${style.border} flex items-center justify-center ${style.text}`}>
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="h-8 w-48"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSaveEdit(cat.id)}
                          className="h-8 px-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-lg"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {paletteList.map((col) => (
                          <button
                            key={col.value}
                            type="button"
                            onClick={() => setEditingColor(col.value)}
                            className={`w-4 h-4 rounded-full ${col.dot} border transition-all ${
                              editingColor === col.value ? 'ring-2 ring-white scale-125' : 'opacity-60 hover:opacity-100'
                            }`}
                            title={col.name}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">{cat.name}</span>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg border ${style.bg} ${style.text} ${style.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                        {cat.id}
                      </span>
                    </div>
                  )}
                  <span className="text-xs text-slate-500 mt-0.5 block">
                    {itemCount} {itemCount === 1 ? 'pozycja' : itemCount > 1 && itemCount < 5 ? 'pozycje' : 'pozycji'} w magazynie
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 self-end sm:self-center">
                {!isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStartEdit(cat.id, cat.name, cat.color)}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(cat.id)}
                  disabled={itemCount > 0}
                  className="h-8 w-8 p-0 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg disabled:opacity-20"
                  title={itemCount > 0 ? 'Nie można usunąć kategorii z przypisanym sprzętem' : 'Usuń'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
