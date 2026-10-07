"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LedSystemsTab } from '@/components/settings/LedSystemsTab';
import { MountingPresetsTab } from '@/components/settings/MountingPresetsTab';
import { ConstructionMappingTab } from '@/components/settings/ConstructionMappingTab';
import { CategoriesTab } from '@/components/settings/CategoriesTab';
import { Tv, Box, Construction, Tag } from 'lucide-react';

export default function UstawieniaPage() {
  return (
    <div className="p-8 space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Ustawienia Systemu</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Zarządzaj powiązaniami sprzętowymi, presetami montażu i uniwersalną konfiguracją.
        </p>
      </div>

      <Tabs defaultValue="led-systems" className="space-y-6">
        <TabsList className="bg-[#121824] border border-slate-800 p-1 rounded-xl h-auto flex flex-wrap gap-1">
          <TabsTrigger
            value="led-systems"
            className="data-[state=active]:bg-blue-600/15 data-[state=active]:text-blue-400 data-[state=active]:border-blue-500/30 text-slate-400 text-xs font-semibold px-3 py-2 rounded-lg gap-2 border border-transparent transition-all"
          >
            <Tv className="w-3.5 h-3.5" />
            Systemy LED & Korelacje
          </TabsTrigger>

          <TabsTrigger
            value="mounting-presets"
            className="data-[state=active]:bg-blue-600/15 data-[state=active]:text-blue-400 data-[state=active]:border-blue-500/30 text-slate-400 text-xs font-semibold px-3 py-2 rounded-lg gap-2 border border-transparent transition-all"
          >
            <Box className="w-3.5 h-3.5" />
            Presety Montażowe
          </TabsTrigger>

          <TabsTrigger
            value="construction-mapping"
            className="data-[state=active]:bg-blue-600/15 data-[state=active]:text-blue-400 data-[state=active]:border-blue-500/30 text-slate-400 text-xs font-semibold px-3 py-2 rounded-lg gap-2 border border-transparent transition-all"
          >
            <Construction className="w-3.5 h-3.5" />
            Mapowanie Konstrukcji
          </TabsTrigger>

          <TabsTrigger
            value="categories"
            className="data-[state=active]:bg-blue-600/15 data-[state=active]:text-blue-400 data-[state=active]:border-blue-500/30 text-slate-400 text-xs font-semibold px-3 py-2 rounded-lg gap-2 border border-transparent transition-all"
          >
            <Tag className="w-3.5 h-3.5" />
            Kategorie Magazynowe
          </TabsTrigger>
        </TabsList>

        <TabsContent value="led-systems" className="outline-none">
          <LedSystemsTab />
        </TabsContent>

        <TabsContent value="mounting-presets" className="outline-none">
          <MountingPresetsTab />
        </TabsContent>

        <TabsContent value="construction-mapping" className="outline-none">
          <ConstructionMappingTab />
        </TabsContent>

        <TabsContent value="categories" className="outline-none">
          <CategoriesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
