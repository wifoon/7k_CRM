"use client";

import { useState, useMemo } from 'react';
import { useJobs } from '@/hooks/useJobs';
import { useInventory } from '@/hooks/useInventory';
import { useSettings } from '@/hooks/useSettings';
import { calculateJobBOM } from '@/utils/jobCalc';
import { GearPreset } from '@/lib/mockData';
import { InventoryCatalogTable } from './InventoryCatalogTable';
import { JobBOMCartPanel } from './JobBOMCartPanel';
import { JobExtraGearFilters } from './JobExtraGearFilters';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, SlidersHorizontal, Plus, ArrowRight } from 'lucide-react';

interface JobExtraGearStepProps {
  onNext: () => void;
}

export function JobExtraGearStep({ onNext }: JobExtraGearStepProps) {
  const {
    editingDraft,
    addCustomItemToDraft,
    setCustomItemQtyInDraft,
    removeCustomItemFromDraft,
    clearCustomItemsInDraft,
  } = useJobs();

  const { items: inventory } = useInventory();
  const { ledSystems, constructionMapping, mountingPresets, categories, gearPresets } = useSettings();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'available_only'>('all');

  const customItems = editingDraft?.customItems || [];

  // Wyliczanie pełnego zestawienia zapotrzebowania zlecenia (BOM)
  const bomSummary = useMemo(() => {
    if (!editingDraft) return null;
    return calculateJobBOM({
      job: editingDraft,
      ledSystems,
      constructionMapping,
      mountingPresets,
      inventory,
    });
  }, [editingDraft, ledSystems, constructionMapping, mountingPresets, inventory]);

  const handleApplyPreset = (preset: GearPreset) => {
    preset.items.forEach((pItem) => {
      const existing = customItems.find((ci) => ci.equipmentId === pItem.equipmentId);
      if (existing) {
        setCustomItemQtyInDraft(pItem.equipmentId, existing.qty + pItem.qty);
      } else {
        addCustomItemToDraft(pItem.equipmentId, pItem.qty);
      }
    });
  };

  return (
    <div className="w-full space-y-4 animate-in fade-in duration-200">
      {/* ─── LINIA 1: SEARCHBAR + FILTRY + PRZYCISK DALEJ (JEDNA LINIA POD NAVBAREM) ─── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 bg-[#111622] border border-slate-800/80 rounded-xl p-2.5 shadow-md">
        {/* Wyszukiwarka */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Szukaj sprzętu w magazynie..."
            className="pl-9 pr-8 h-9"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Nowoczesny rozwijany filtr (Kategorie + Stan magazynowy) */}
        <div className="shrink-0">
          <JobExtraGearFilters
            categories={categories}
            selectedCat={selectedCat}
            setSelectedCat={setSelectedCat}
            stockFilter={stockFilter}
            setStockFilter={setStockFilter}
          />
        </div>

        {/* Przycisk Dalej: Podsumowanie */}
        <Button
          onClick={onNext}
          className="shrink-0 ml-auto md:ml-0"
        >
          <span>Dalej: Podsumowanie</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* ─── LINIA 2: PRESETY POD SPODEM ─── */}
      <div className="flex flex-wrap items-center gap-2 px-1 text-xs">
        <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1.5 mr-1 select-none">
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
          Presety:
        </span>
        {gearPresets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => handleApplyPreset(preset)}
            className="h-7 px-2.5 rounded-lg border border-slate-800 bg-[#111622] hover:bg-blue-600/15 hover:border-blue-500/40 text-slate-300 hover:text-blue-300 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-sm group"
            title={`Dodaj zestaw: ${preset.name} (${preset.items.length} pozycji)`}
          >
            <Plus className="w-3 h-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
            <span>{preset.name}</span>
            <span className="text-[10px] text-slate-500 font-mono">({preset.items.length})</span>
          </button>
        ))}
      </div>

      {/* ─── LINIA 3: LISTA MAGAZYNOWA (8 KOLUMN) + KOSZYK (4 KOLUMNY) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Lewa Strefa: Tabela Magazynowa (8 Kolumn) */}
        <div className="lg:col-span-8">
          <InventoryCatalogTable
            inventory={inventory}
            customItems={customItems}
            searchQuery={searchQuery}
            selectedCat={selectedCat}
            stockFilter={stockFilter}
            onAddItem={addCustomItemToDraft}
            onSetQty={setCustomItemQtyInDraft}
            onRemoveItem={removeCustomItemFromDraft}
          />
        </div>

        {/* Prawa Strefa: Koszyk Zlecenia (4 Kolumny) */}
        <div className="lg:col-span-4">
          <JobBOMCartPanel
            bomSummary={bomSummary}
            customItems={customItems}
            inventory={inventory}
            onSetQty={setCustomItemQtyInDraft}
            onRemoveItem={removeCustomItemFromDraft}
            onClearCustomItems={clearCustomItemsInDraft}
            onNext={onNext}
          />
        </div>
      </div>
    </div>
  );
}
