"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useInventory } from '@/hooks/useInventory';
import { useSettings } from '@/hooks/useSettings';
import { EquipmentItem, EquipmentUnit } from '@/lib/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tv, Package, Plus, Check } from 'lucide-react';

interface EquipmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: EquipmentItem;
}

const unitDisplayMap: Record<string, string> = {
  case: 'Skrzynia (Case)',
  'szt.': 'Sztuka (luzem)',
  'kpl.': 'Komplet',
};

export function EquipmentFormModal({ isOpen, onClose, itemToEdit }: EquipmentFormModalProps) {
  const { addItem, updateItem } = useInventory();
  const { categories } = useSettings();
  
  const { register, handleSubmit, reset, watch, setValue } = useForm<Partial<EquipmentItem>>({
    defaultValues: itemToEdit || {
      name: '',
      categoryId: 'led',
      totalQty: 1,
      availableQty: 1,
      serviceQty: 0,
      unit: 'case',
      status: 'dostepny',
      attributes: {
        cabinetsPerCase: 8,
        widthCm: 50,
        heightCm: 100,
        resolutionX: 128,
        resolutionY: 256,
      }
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        reset(itemToEdit);
      } else {
        reset({
          name: '',
          categoryId: 'led',
          totalQty: 1,
          availableQty: 1,
          serviceQty: 0,
          unit: 'case',
          status: 'dostepny',
          attributes: {
            cabinetsPerCase: 8,
            widthCm: 50,
            heightCm: 100,
            resolutionX: 128,
            resolutionY: 256,
          }
        });
      }
    }
  }, [isOpen, itemToEdit, reset]);

  const categoryId = watch('categoryId');
  const unit = watch('unit');

  const onSubmit = (data: Partial<EquipmentItem>) => {
    const formattedData = {
      ...data,
      totalQty: Number(data.totalQty),
      availableQty: Number(data.totalQty),
      attributes: {
        ...data.attributes,
        cabinetsPerCase: data.attributes?.cabinetsPerCase ? Number(data.attributes.cabinetsPerCase) : undefined,
        widthCm: data.attributes?.widthCm ? Number(data.attributes.widthCm) : undefined,
        heightCm: data.attributes?.heightCm ? Number(data.attributes.heightCm) : undefined,
        resolutionX: data.attributes?.resolutionX ? Number(data.attributes.resolutionX) : undefined,
        resolutionY: data.attributes?.resolutionY ? Number(data.attributes.resolutionY) : undefined,
      }
    };

    if (itemToEdit) {
      updateItem(itemToEdit.id, formattedData);
    } else {
      addItem(formattedData as Omit<EquipmentItem, 'id'>);
    }
    onClose();
  };

  const selectedCategoryName = categories.find((c) => c.id === categoryId)?.name || 'Ekrany LED';
  const selectedUnitLabel = unitDisplayMap[unit || 'case'] || 'Skrzynia (Case)';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[620px] bg-[#111726] border-slate-700/80 text-slate-200 overflow-y-auto max-h-[92vh] rounded-xl shadow-2xl shadow-black/60 p-6">
        <DialogHeader className="pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Package size={20} />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-white tracking-tight">
                {itemToEdit ? 'Edycja pozycji magazynowej' : 'Nowa pozycja w magazynie'}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400 mt-0.5">
                Wprowadź dane sprzętu, kategorię oraz stany fizyczne.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Nazwa sprzętu */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Nazwa Sprzętu / Model
            </Label>
            <Input
              id="name"
              {...register('name', { required: true })}
              placeholder="np. Dicolor P3.9 Outdoor 50x100"
              className="text-sm h-10"
            />
          </div>

          {/* Kategoria i Jednostka */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Kategoria
              </Label>
              <Select value={categoryId} onValueChange={(val) => { if (val) setValue('categoryId', val); }}>
                <SelectTrigger className="bg-[#0a0e17] border-slate-700/80 text-white text-xs h-10 rounded-lg">
                  <SelectValue>{selectedCategoryName}</SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-[#111726] border-slate-700 text-white">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Jednostka ewidencji
              </Label>
              <Select value={unit} onValueChange={(val) => { if (val) setValue('unit', val as EquipmentUnit); }}>
                <SelectTrigger className="bg-[#0a0e17] border-slate-700/80 text-white text-xs h-10 rounded-lg">
                  <SelectValue>{selectedUnitLabel}</SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-[#111726] border-slate-700 text-white">
                  <SelectItem value="case">Skrzynia (Case)</SelectItem>
                  <SelectItem value="szt.">Sztuka (luzem)</SelectItem>
                  <SelectItem value="kpl.">Komplet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stan magazynowy */}
          <div className="space-y-1.5">
            <Label htmlFor="totalQty" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Całkowity stan magazynowy ({selectedUnitLabel})
            </Label>
            <Input
              id="totalQty"
              type="number"
              min={0}
              {...register('totalQty')}
              className="font-mono text-sm h-10"
            />
          </div>

          {/* Sekcja LED */}
          {categoryId === 'led' && (
            <div className="space-y-3.5 p-4 border border-slate-700/70 bg-[#0e1422] rounded-xl">
              <div className="flex items-center gap-2">
                <Tv size={15} className="text-blue-400" />
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Parametry Modułu LED & Pojemność Skrzyni
                </h4>
              </div>

              <div className="space-y-3">
                {/* Pojemność skrzyni */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300 font-medium">
                    Ilość kabinetów w 1 skrzyni transportowej (Case)
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="np. 8"
                    {...register('attributes.cabinetsPerCase')}
                    className="font-mono text-sm h-9"
                  />
                  <p className="text-[11px] text-slate-500">
                    System automatycznie zaokrągla zapotrzebowanie w górę do pełnych skrzyń.
                  </p>
                </div>

                {/* Wymiary fizyczne w TEJ SAMEJ LINII */}
                <div>
                  <Label className="text-xs text-slate-300 font-medium block mb-1.5">
                    Wymiary fizyczne kabinetu (szerokość × wysokość w cm)
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="Szerokość X"
                        {...register('attributes.widthCm')}
                        className="font-mono text-sm h-9 pr-9"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">cm</span>
                    </div>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="Wysokość Y"
                        {...register('attributes.heightCm')}
                        className="font-mono text-sm h-9 pr-9"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">cm</span>
                    </div>
                  </div>
                </div>

                {/* Rozdzielczość pikseli w TEJ SAMEJ LINII */}
                <div>
                  <Label className="text-xs text-slate-300 font-medium block mb-1.5">
                    Rozdzielczość matrycy modułu (piksele X × Y)
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="Piksele X"
                        {...register('attributes.resolutionX')}
                        className="font-mono text-sm h-9 pr-9"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">px</span>
                    </div>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="Piksele Y"
                        {...register('attributes.resolutionY')}
                        className="font-mono text-sm h-9 pr-9"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">px</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dolny pasek (Footer) spójny kolorystycznie */}
          <div className="px-6 py-4 border-t border-slate-800 bg-[#0c101a] -mx-6 -mb-6 mt-5 rounded-b-xl flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              Anuluj
            </Button>
            <Button
              type="submit"
              className="gap-2"
            >
              {itemToEdit ? <Check size={15} /> : <Plus size={15} />}
              <span>{itemToEdit ? 'Zapisz zmiany' : 'Dodaj sprzęt'}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
