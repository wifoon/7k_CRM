"use client";

import { useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useInventory } from '@/hooks/useInventory';
import { LedSystem } from '@/lib/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle2, Layers } from 'lucide-react';

interface LedSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemToEdit?: LedSystem | null;
}

export function LedSystemModal({ isOpen, onClose, systemToEdit }: LedSystemModalProps) {
  const { addLedSystem, updateLedSystem } = useSettings();
  const { items } = useInventory();

  const ledItems = items.filter((i) => i.categoryId === 'led');
  const accessoryItems = items.filter((i) => i.categoryId === 'accessories');

  const [name, setName] = useState(systemToEdit?.name || '');
  const [fullItemId, setFullItemId] = useState(
    systemToEdit?.fullItemId || ledItems[0]?.id || ''
  );
  const [halfItemId, setHalfItemId] = useState<string>(
    systemToEdit?.halfItemId || 'none'
  );
  const [hangingBarItemId, setHangingBarItemId] = useState<string>(
    systemToEdit?.hangingBarItemId || 'none'
  );
  const [halfPosition, setHalfPosition] = useState<'bottom' | 'top'>(
    systemToEdit?.halfPosition || 'bottom'
  );

  const selectedFull = items.find((i) => i.id === fullItemId);
  const selectedHalf = items.find((i) => i.id === halfItemId);
  const selectedBar = items.find((i) => i.id === hangingBarItemId);

  // Validation
  const widthMismatch =
    selectedFull &&
    selectedHalf &&
    selectedFull.attributes?.widthCm &&
    selectedHalf.attributes?.widthCm &&
    selectedFull.attributes.widthCm !== selectedHalf.attributes.widthCm;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !fullItemId) return;

    const payload = {
      name,
      fullItemId,
      halfItemId: halfItemId === 'none' ? undefined : halfItemId,
      hangingBarItemId: hangingBarItemId === 'none' ? undefined : hangingBarItemId,
      halfPosition,
    };

    if (systemToEdit) {
      updateLedSystem(systemToEdit.id, payload);
    } else {
      addLedSystem(payload);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-[#121824] border-slate-800 text-slate-200">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            {systemToEdit ? 'Edytuj System LED' : 'Nowy System LED'}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Zdefiniuj model ekranu łącząc moduł główny, połówkę i belkę zawiesia.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <Label className="text-slate-300 text-xs font-semibold uppercase">Nazwa Systemu</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="np. Dicolor P3.9"
                  className="mt-1.5"
                  required
                />
              </div>

              <div>
                <Label className="text-slate-300 text-xs font-semibold uppercase">Moduł Główny (Pełny)</Label>
                <Select value={fullItemId} onValueChange={(v) => { if (v) setFullItemId(v); }}>
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-white mt-1.5">
                    <SelectValue placeholder="Wybierz moduł 50x100" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#121824] border-slate-700 text-white">
                    {ledItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} ({item.attributes?.widthCm}x{item.attributes?.heightCm}cm)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-slate-300 text-xs font-semibold uppercase">Moduł Połówkowy (Opcjonalnie)</Label>
                <Select value={halfItemId} onValueChange={(v) => { if (v) setHalfItemId(v); }}>
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-white mt-1.5">
                    <SelectValue placeholder="Brak (system bez połówek)" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#121824] border-slate-700 text-white">
                    <SelectItem value="none">Brak (brak połówki)</SelectItem>
                    {ledItems
                      .filter((i) => i.id !== fullItemId)
                      .map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name} ({item.attributes?.widthCm}x{item.attributes?.heightCm}cm)
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {halfItemId !== 'none' && (
                <div>
                  <Label className="text-slate-300 text-xs font-semibold uppercase">Pozycja Połówki</Label>
                  <Select
                    value={halfPosition}
                    onValueChange={(v) => { if (v) setHalfPosition(v as 'bottom' | 'top'); }}
                  >
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-white mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#121824] border-slate-700 text-white">
                      <SelectItem value="bottom">Dół ekranu (standard)</SelectItem>
                      <SelectItem value="top">Góra ekranu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label className="text-slate-300 text-xs font-semibold uppercase">Dedykowany Hanging Bar</Label>
                <Select value={hangingBarItemId} onValueChange={(v) => { if (v) setHangingBarItemId(v); }}>
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-white mt-1.5">
                    <SelectValue placeholder="Wybierz belkę zawiesia" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#121824] border-slate-700 text-white">
                    <SelectItem value="none">Brak przypisania</SelectItem>
                    {accessoryItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Visual Column Preview */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center min-h-[300px]">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Wizualizacja kolumny
              </span>

              {/* Hanging Bar */}
              {selectedBar ? (
                <div className="w-28 py-1 mb-1.5 bg-amber-500/20 border border-amber-500/50 rounded text-[10px] text-amber-300 text-center font-mono">
                  Belka: {selectedBar.name.slice(0, 14)}...
                </div>
              ) : (
                <div className="w-28 py-1 mb-1.5 border border-dashed border-slate-700 rounded text-[10px] text-slate-600 text-center">
                  Brak belki
                </div>
              )}

              {/* Top Half if configured */}
              {selectedHalf && halfPosition === 'top' && (
                <div className="w-24 h-10 bg-purple-600/30 border border-purple-500/60 rounded-t flex flex-col items-center justify-center text-[10px] font-mono text-purple-200">
                  <span>Połówka</span>
                  <span className="text-[9px] text-purple-400">
                    {selectedHalf.attributes?.widthCm}x{selectedHalf.attributes?.heightCm}cm
                  </span>
                </div>
              )}

              {/* Full Cabinet 1 */}
              <div className="w-24 h-20 bg-blue-600/20 border border-blue-500/50 flex flex-col items-center justify-center text-[11px] font-mono text-blue-200 my-0.5">
                <span>Pełny</span>
                <span className="text-[9px] text-blue-400">
                  {selectedFull?.attributes?.widthCm || 50}x{selectedFull?.attributes?.heightCm || 100}cm
                </span>
              </div>

              {/* Full Cabinet 2 */}
              <div className="w-24 h-20 bg-blue-600/20 border border-blue-500/50 flex flex-col items-center justify-center text-[11px] font-mono text-blue-200 my-0.5">
                <span>Pełny</span>
                <span className="text-[9px] text-blue-400">
                  {selectedFull?.attributes?.widthCm || 50}x{selectedFull?.attributes?.heightCm || 100}cm
                </span>
              </div>

              {/* Bottom Half if configured */}
              {selectedHalf && halfPosition === 'bottom' && (
                <div className="w-24 h-10 bg-purple-600/30 border border-purple-500/60 rounded-b flex flex-col items-center justify-center text-[10px] font-mono text-purple-200">
                  <span>Połówka</span>
                  <span className="text-[9px] text-purple-400">
                    {selectedHalf.attributes?.widthCm}x{selectedHalf.attributes?.heightCm}cm
                  </span>
                </div>
              )}

              {/* Validation status badge */}
              <div className="mt-4 w-full">
                {widthMismatch ? (
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Niezgodne szerokości modułów!</span>
                  </div>
                ) : selectedFull ? (
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs justify-center">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Konfiguracja poprawna</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="hover:bg-slate-800 text-slate-300"
            >
              Anuluj
            </Button>
            <Button
              type="submit"
              disabled={Boolean(widthMismatch || !name || !fullItemId)}
            >
              {systemToEdit ? 'Zapisz Zmiany' : 'Utwórz System'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
