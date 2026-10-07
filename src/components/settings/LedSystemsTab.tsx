"use client";

import { useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useInventory } from '@/hooks/useInventory';
import { LedSystem } from '@/lib/mockData';
import { LedSystemModal } from './LedSystemModal';
import { Button } from '@/components/ui/button';
import { Plus, Tv, Pencil, Trash2 } from 'lucide-react';

export function LedSystemsTab() {
  const { ledSystems, deleteLedSystem } = useSettings();
  const { items } = useInventory();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSystem, setEditingSystem] = useState<LedSystem | null>(null);

  const handleEdit = (system: LedSystem) => {
    setEditingSystem(system);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingSystem(null);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Systemy LED & Korelacje</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Zdefiniuj modele ekranów z magazynu i sparuj moduły pełne z połówkami.
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-sm shadow-blue-600/30 text-xs font-semibold gap-2"
        >
          <Plus className="w-4 h-4" />
          Dodaj System LED
        </Button>
      </div>

      {ledSystems.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-800 rounded-xl bg-[#121824]">
          <Tv className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Brak zdefiniowanych systemów LED.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ledSystems.map((sys) => {
            const fullItem = items.find((i) => i.id === sys.fullItemId);
            const halfItem = sys.halfItemId ? items.find((i) => i.id === sys.halfItemId) : null;
            const barItem = sys.hangingBarItemId ? items.find((i) => i.id === sys.hangingBarItemId) : null;

            return (
              <div
                key={sys.id}
                className="bg-[#121824] border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Tv className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-white text-base">{sys.name}</h3>
                    </div>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {sys.halfItemId ? 'Hybryda' : 'Pojedynczy'}
                    </span>
                  </div>

                  <div className="space-y-2 mt-4 text-xs">
                    <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                      <span className="text-slate-400">Moduł główny:</span>
                      <span className="font-semibold text-slate-200">
                        {fullItem ? fullItem.name : sys.fullItemId}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                      <span className="text-slate-400">Połówka:</span>
                      <span className={halfItem ? 'text-purple-300 font-semibold' : 'text-slate-500'}>
                        {halfItem ? `${halfItem.name} (${sys.halfPosition === 'bottom' ? 'dół' : 'góra'})` : 'Brak'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                      <span className="text-slate-400">Hanging bar:</span>
                      <span className={barItem ? 'text-amber-300 font-semibold' : 'text-slate-500'}>
                        {barItem ? barItem.name : 'Brak'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(sys)}
                    className="h-8 text-xs text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <Pencil className="w-3.5 h-3.5 mr-1" />
                    Edytuj
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteLedSystem(sys.id)}
                    className="h-8 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Usuń
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <LedSystemModal
          key={editingSystem?.id || 'new'}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          systemToEdit={editingSystem}
        />
      )}
    </div>
  );
}
