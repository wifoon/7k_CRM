"use client";

import React, { useState } from "react";
import { JobScreenConfig, LedSystem } from "@/lib/mockData";
import { ScreenPreviewCanvas } from "./ScreenPreviewCanvas";
import { ScreenDimensionControls } from "./ScreenDimensionControls";
import { ScreenSystemSelector } from "./ScreenSystemSelector";
import { ScreenMountingControls } from "./ScreenMountingControls";
import { ScreenBOMSummaryCard } from "./ScreenBOMSummaryCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import { CabinetRowType, ScreenMatrixMode } from "@/utils/screenCalc";

interface ScreenStudioViewProps {
  screen: JobScreenConfig;
  ledSystems: LedSystem[];
  jobName: string;
  onSave: (updatedScreen: JobScreenConfig) => void;
  onClose: () => void;
  onNameChange?: (name: string) => void;
}

export function ScreenStudioView({
  screen,
  ledSystems,
  jobName,
  onSave,
  onClose,
  onNameChange,
}: ScreenStudioViewProps) {
  const [name, setName] = useState(screen.name);
  const [systemId, setSystemId] = useState(screen.systemId || ledSystems[0]?.id || "");
  const [widthM, setWidthM] = useState<number>(screen.widthM || 6.0);
  const [heightM, setHeightM] = useState<number>(screen.heightM || 3.5);
  const [matrixMode, setMatrixMode] = useState<ScreenMatrixMode>(screen.matrixMode || "hybrid");
  const [customRows, setCustomRows] = useState<CabinetRowType[] | undefined>(screen.customRows);
  const [mountingType, setMountingType] = useState<JobScreenConfig["mountingType"]>(
    screen.mountingType || "bramka"
  );
  const [hoistType, setHoistType] = useState<"manual" | "electric">(screen.hoistType || "manual");
  const [customTrussWidthM, setCustomTrussWidthM] = useState<number | undefined>(screen.customTrussWidthM);
  const [customTrussHeightM, setCustomTrussHeightM] = useState<number | undefined>(screen.customTrussHeightM);
  const [hoistSource, setHoistSource] = useState<"none" | "warehouse">(screen.hoistSource || "none");
  const [hoistQty, setHoistQty] = useState<number>(screen.hoistQty || 2);
  const [usePlates, setUsePlates] = useState<boolean>(
    screen.mountingType === "elki" ? true : (screen.usePlates ?? false)
  );

  const { items: inventory } = useInventory();
  const currentSystem = ledSystems.find((s) => s.id === systemId);
  const fullEquipment = inventory.find((i) => i.id === currentSystem?.fullItemId);
  const halfEquipment = inventory.find((i) => i.id === currentSystem?.halfItemId);

  const handleNameChange = (val: string) => {
    setName(val);
    onNameChange?.(val);
  };

  const handleMountingTypeChange = (nextType: JobScreenConfig["mountingType"]) => {
    setMountingType(nextType);
    if (nextType === "elki") {
      setUsePlates(true);
    }
  };

  const handleSave = () => {
    onSave({
      ...screen,
      name,
      systemId,
      matrixMode,
      customRows,
      widthM: Number(widthM),
      heightM: Number(heightM),
      mountingType,
      hoistType,
      customTrussWidthM,
      customTrussHeightM,
      hoistSource,
      hoistQty,
      usePlates: mountingType === "elki" ? true : usePlates,
    });
    onClose();
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Pasek akcji studia */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111622] border border-slate-800/80 rounded-xl p-3 sm:px-5 sm:py-3.5 shadow-md">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-white rounded-lg text-xs h-9 px-2.5 gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Powrót do listy</span>
          </Button>
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          <span className="text-xs font-semibold text-slate-300 hidden sm:inline">
            Konfiguracja ekranu: <span className="text-blue-400 font-bold">{name || "Nowy Ekran"}</span>
          </span>
        </div>
        <div className="flex items-center gap-2.5 ml-auto sm:ml-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-white rounded-lg text-xs h-9 px-3 cursor-pointer"
          >
            Anuluj
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!name.trim()}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold gap-1.5 h-9 px-4 shadow-md shadow-blue-600/25 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Zapisz ekran</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-7 space-y-5">
          <ScreenDimensionControls
            widthM={widthM}
            heightM={heightM}
            onChangeWidth={setWidthM}
            onChangeHeight={(h) => {
              setHeightM(h);
              setCustomRows(undefined);
            }}
          />

          <ScreenPreviewCanvas
            widthM={widthM}
            heightM={heightM}
            screenName={name}
            customRows={customRows}
            matrixMode={matrixMode}
            onChangeCustomRows={setCustomRows}
            onChangeMatrixMode={setMatrixMode}
            fullEquipment={fullEquipment}
            halfEquipment={halfEquipment}
          />
        </div>

        {/* Prawa Kolumna (5 kolumn): System, Konstrukcja, Zapotrzebowanie magazynowe */}
        <div className="lg:col-span-5 space-y-5">
          <ScreenSystemSelector
            name={name}
            systemId={systemId}
            ledSystems={ledSystems}
            onChangeName={handleNameChange}
            onChangeSystemId={setSystemId}
          />

          <ScreenMountingControls
            mountingType={mountingType}
            hoistType={hoistType}
            widthM={widthM}
            heightM={heightM}
            customTrussWidthM={customTrussWidthM}
            customTrussHeightM={customTrussHeightM}
            hoistSource={hoistSource}
            hoistQty={hoistQty}
            usePlates={usePlates}
            onChangeMountingType={handleMountingTypeChange}
            onChangeHoistType={setHoistType}
            onChangeCustomTrussWidthM={setCustomTrussWidthM}
            onChangeCustomTrussHeightM={setCustomTrussHeightM}
            onChangeHoistSource={setHoistSource}
            onChangeHoistQty={setHoistQty}
            onChangeUsePlates={setUsePlates}
          />

          <ScreenBOMSummaryCard
            widthM={widthM}
            heightM={heightM}
            mountingType={mountingType}
            hoistType={hoistType}
            customTrussWidthM={customTrussWidthM}
            customTrussHeightM={customTrussHeightM}
            hoistSource={hoistSource}
            hoistQty={hoistQty}
            usePlates={usePlates}
            customRows={customRows}
            matrixMode={matrixMode}
          />
        </div>
      </div>
    </div>
  );
}
