"use client";

import { useState, useEffect } from "react";
import { useJobs } from "@/hooks/useJobs";
import { useSettings } from "@/hooks/useSettings";
import { JobScreenConfig } from "@/lib/mockData";
import { ScreenStudioView } from "../screens/ScreenStudioView";
import { ScreenTileCard } from "./ScreenTileCard";
import { Button } from "@/components/ui/button";
import { Tv, Plus, ArrowRight } from "lucide-react";

interface JobScreensStepProps {
  onNext: () => void;
}

export function JobScreensStep({ onNext }: JobScreensStepProps) {
  const {
    editingDraft,
    addScreenToDraft,
    updateScreenInDraft,
    removeScreenFromDraft,
    activeScreenForEdit,
    setActiveScreenForEdit,
  } = useJobs();
  const { ledSystems } = useSettings();

  const screens = editingDraft?.screens || [];

  // Obsługa przycisku wstecz w przeglądarce – zamyka edytor i wraca do kafelków
  useEffect(() => {
    const handlePopState = () => {
      if (activeScreenForEdit) {
        setActiveScreenForEdit(null);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [activeScreenForEdit, setActiveScreenForEdit]);

  const handleOpenAdd = () => {
    const newScreen: JobScreenConfig = {
      id: `new-${Date.now()}`,
      name: `Ekran ${screens.length + 1}`,
      systemId: ledSystems[0]?.id || "",
      widthM: 6.0,
      heightM: 3.5,
      mountingType: "bramka",
      hoistType: "manual",
      hoistSource: "none",
      hoistQty: 2,
    };
    setActiveScreenForEdit(newScreen);
    window.history.pushState(
      { screenId: newScreen.id },
      "",
      `${window.location.pathname}?screen=${newScreen.id}`
    );
  };

  const handleOpenEdit = (screen: JobScreenConfig) => {
    setActiveScreenForEdit(screen);
    window.history.pushState(
      { screenId: screen.id },
      "",
      `${window.location.pathname}?screen=${screen.id}`
    );
  };

  const handleCloseStudio = () => {
    setActiveScreenForEdit(null);
    if (window.location.search.includes("screen=")) {
      window.history.pushState({}, "", window.location.pathname);
    }
  };

  const handleSaveScreen = (updatedScreen: JobScreenConfig) => {
    if (updatedScreen.id.startsWith("new-")) {
      const { id, ...data } = updatedScreen;
      addScreenToDraft(data);
    } else {
      updateScreenInDraft(updatedScreen.id, updatedScreen);
    }
    handleCloseStudio();
  };

  // Jeśli edytujemy/tworzymy ekran, przełączamy na pełne Studio Ekranu LED (In-place view)
  if (activeScreenForEdit) {
    return (
      <ScreenStudioView
        screen={activeScreenForEdit}
        ledSystems={ledSystems}
        jobName={editingDraft?.name || "Nowa Realizacja"}
        onSave={handleSaveScreen}
        onClose={handleCloseStudio}
        onNameChange={(name) => {
          setActiveScreenForEdit({ ...activeScreenForEdit, name });
        }}
      />
    );
  }

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-200">
      {/* ─── HEADER ZAKŁADKI ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Tv className="w-5 h-5 text-purple-400" />
            Ekrany LED & Konstrukcje
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Skonfiguruj ekrany diodowe i konstrukcje nośne. Każdy ekran to
            niezależny zestaw transportowy.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button onClick={handleOpenAdd} className="gap-1.5 h-10 px-4">
            <Plus className="w-4 h-4" />
            <span>Dodaj Ekran LED</span>
          </Button>

          <Button
            variant="secondary"
            onClick={onNext}
            className="gap-1.5 h-10 px-4"
          >
            <span>Dalej: Dodatkowy sprzęt</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* ─── SIATKA KAFELKÓW EKRANÓW (BENTO GRID) ─── */}
      {screens.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-slate-800 rounded-xl bg-[#121824]/40 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto mb-3">
            <Tv className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">
            Brak skonfigurowanych ekranów
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Realizacja nie ma jeszcze dodanego żadnego ekranu. Kliknij przycisk
            poniżej, aby zdefiniować pierwszy ekran.
          </p>
          <Button
            onClick={handleOpenAdd}
            className="mt-4 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-xl gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Dodaj Ekran LED</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {screens.map((scr, idx) => {
            const system = ledSystems.find((s) => s.id === scr.systemId);
            const systemName = system?.name || "Dicolor P3.9 Hybryda";
            return (
              <ScreenTileCard
                key={scr.id}
                screen={scr}
                index={idx}
                systemName={systemName}
                onEdit={handleOpenEdit}
                onRemove={removeScreenFromDraft}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
