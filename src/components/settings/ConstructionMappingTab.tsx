"use client";

import { useSettings } from '@/hooks/useSettings';
import { useInventory } from '@/hooks/useInventory';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2, Check, Construction, Sparkles } from 'lucide-react';
import { useState } from 'react';

export function ConstructionMappingTab() {
  const { constructionMapping, updateConstructionMapping, autoDetectConstructionMapping } = useSettings();
  const { items } = useInventory();
  const [justSaved, setJustSaved] = useState(false);

  const trussItems = items.filter((i) => i.categoryId === 'truss');
  const hoistItems = items.filter((i) => i.categoryId === 'hoist');

  const handleAutoDetect = () => {
    autoDetectConstructionMapping(items);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const handleSelect = (key: keyof typeof constructionMapping, value: string | null) => {
    if (!value) return;
    updateConstructionMapping({ [key]: value === 'none' ? undefined : value });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Mapowanie Konstrukcji i Wciągarek</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Połącz modularne odcinki kalkulatora kratownicy z fizycznymi pozycjami w magazynie.
          </p>
        </div>
        <Button
          onClick={handleAutoDetect}
          className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-semibold gap-2 transition-all shadow-sm"
        >
          <Wand2 className="w-4 h-4 text-blue-400" />
          Autowykryj z Magazynu
        </Button>
      </div>

      <div className="bg-[#121824] border border-slate-800 rounded-xl p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 mb-4">
            <Construction className="w-4 h-4 text-sky-400" />
            Modularne Odcinki Kratownicy (Truss)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-400">Odcinek 2.0 m</Label>
              <Select
                value={constructionMapping.truss200Id || 'none'}
                onValueChange={(val) => handleSelect('truss200Id', val)}
              >
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                  <SelectValue placeholder="Wybierz kratę 2.0m" />
                </SelectTrigger>
                <SelectContent className="bg-[#121824] border-slate-700 text-white">
                  <SelectItem value="none">Brak przypisania</SelectItem>
                  {trussItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} ({item.totalQty} {item.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-400">Odcinek 1.5 m</Label>
              <Select
                value={constructionMapping.truss150Id || 'none'}
                onValueChange={(val) => handleSelect('truss150Id', val)}
              >
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                  <SelectValue placeholder="Wybierz kratę 1.5m" />
                </SelectTrigger>
                <SelectContent className="bg-[#121824] border-slate-700 text-white">
                  <SelectItem value="none">Brak przypisania</SelectItem>
                  {trussItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} ({item.totalQty} {item.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-400">Odcinek 1.0 m</Label>
              <Select
                value={constructionMapping.truss100Id || 'none'}
                onValueChange={(val) => handleSelect('truss100Id', val)}
              >
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                  <SelectValue placeholder="Wybierz kratę 1.0m" />
                </SelectTrigger>
                <SelectContent className="bg-[#121824] border-slate-700 text-white">
                  <SelectItem value="none">Brak przypisania</SelectItem>
                  {trussItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} ({item.totalQty} {item.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-400">Odcinek 0.5 m</Label>
              <Select
                value={constructionMapping.truss050Id || 'none'}
                onValueChange={(val) => handleSelect('truss050Id', val)}
              >
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                  <SelectValue placeholder="Wybierz kratę 0.5m" />
                </SelectTrigger>
                <SelectContent className="bg-[#121824] border-slate-700 text-white">
                  <SelectItem value="none">Brak przypisania</SelectItem>
                  {trussItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} ({item.totalQty} {item.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Wciągarki
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-400">Wciągarka Ręczna</Label>
              <Select
                value={constructionMapping.hoistManualId || 'none'}
                onValueChange={(val) => handleSelect('hoistManualId', val)}
              >
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                  <SelectValue placeholder="Wybierz wciągarkę ręczną" />
                </SelectTrigger>
                <SelectContent className="bg-[#121824] border-slate-700 text-white">
                  <SelectItem value="none">Brak przypisania</SelectItem>
                  {hoistItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} ({item.totalQty} {item.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-400">Wciągarka Elektryczna / Silnik</Label>
              <Select
                value={constructionMapping.hoistElectricId || 'none'}
                onValueChange={(val) => handleSelect('hoistElectricId', val)}
              >
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                  <SelectValue placeholder="Wybierz wciągarkę elektryczną" />
                </SelectTrigger>
                <SelectContent className="bg-[#121824] border-slate-700 text-white">
                  <SelectItem value="none">Brak przypisania</SelectItem>
                  {hoistItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} ({item.totalQty} {item.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {justSaved && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl justify-center animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Mapowanie zostało pomyślnie zaktualizowane!</span>
          </div>
        )}
      </div>
    </div>
  );
}
