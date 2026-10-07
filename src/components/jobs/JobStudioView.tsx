"use client";

import { useState } from "react";
import { useJobs } from "@/hooks/useJobs";
import { JobGeneralInfoStep } from "./steps/JobGeneralInfoStep";
import { JobScreensStep } from "./steps/JobScreensStep";
import { JobExtraGearStep } from "./steps/JobExtraGearStep";
import { JobManifestStep } from "./steps/JobManifestStep";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Tv,
  Cable,
  ClipboardList,
  Check,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

export function JobStudioView() {
  const {
    editingDraft,
    saveDraft,
    clearDraft,
    activeScreenForEdit,
    setActiveScreenForEdit,
  } = useJobs();

  // 4 Zakładki: 'general', 'screens', 'extra', 'manifest'
  const [activeTab, setActiveTab] = useState<
    "general" | "screens" | "extra" | "manifest"
  >("general");

  if (!editingDraft) return null;

  const screensCount = editingDraft.screens.length;
  const extraItemsCount = editingDraft.customItems.length;

  const handleExitStudio = () => {
    clearDraft();
    window.history.pushState({}, '', window.location.pathname);
  };

  const handleSaveAndExit = () => {
    saveDraft();
    window.history.pushState({}, '', window.location.pathname);
  };

  const handleCloseActiveScreen = () => {
    setActiveScreenForEdit(null);
    if (window.location.search.includes("screen=")) {
      window.history.pushState({}, "", window.location.pathname);
    }
  };

  const handleTabChange = (tab: "general" | "screens" | "extra" | "manifest") => {
    if (activeScreenForEdit) {
      handleCloseActiveScreen();
    }
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-[#090D16]">
      {/* ─── GÓRNY HEADER STUDIA ROBOTY (QUIXERA / SAAS STANDARD) ─── */}
      <header className="border-b border-slate-800/80 bg-[#0d121c]/90 backdrop-blur-md sticky top-0 z-20 pt-5 pb-0">
        <div className="pl-6 pr-16 md:pr-24 lg:pr-32 max-w-[1550px] w-full space-y-4">
          {/* Rząd 1: Breadcrumbs & Główny Przycisk Zatwierdzenia */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <button
                type="button"
                onClick={handleExitStudio}
                className="hover:text-blue-400 transition-colors flex items-center gap-1 font-medium cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Roboty
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              {activeScreenForEdit ? (
                <>
                  <button
                    type="button"
                    onClick={handleCloseActiveScreen}
                    className="hover:text-blue-400 text-slate-300 font-medium transition-colors cursor-pointer truncate max-w-[180px] sm:max-w-xs"
                    title="Wróć do listy ekranów"
                  >
                    {editingDraft.name || "Nowa Realizacja"}
                  </button>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span className="text-white font-semibold truncate max-w-[180px]">
                    {activeScreenForEdit.name || "Nowy Ekran"}
                  </span>
                </>
              ) : (
                <span className="text-slate-300 font-semibold truncate max-w-[200px] sm:max-w-xs">
                  {editingDraft.name || "Nowa Realizacja"}
                </span>
              )}
            </div>

            {/* Prawy górny róg: Zatwierdzenie roboty (zgodnie ze wzorcem Quixera) */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExitStudio}
                className="text-slate-400 hover:text-white rounded-xl text-xs h-9 px-3 cursor-pointer"
              >
                Anuluj
              </Button>
              <Button
                onClick={handleSaveAndExit}
                disabled={!editingDraft.name.trim()}
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold gap-2 h-9 px-4 shadow-md shadow-blue-600/25 disabled:opacity-40 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Zatwierdź robotę</span>
              </Button>
            </div>
          </div>

          {/* Rząd 2: Tytuł i Metadane */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white truncate">
              {editingDraft.name || "Nowa Realizacja"}
            </h1>
            <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1 font-mono">
              {editingDraft.location && <span>{editingDraft.location}</span>}
              <span>
                • {editingDraft.startDate || editingDraft.date}
                {editingDraft.endDate &&
                editingDraft.endDate !==
                  (editingDraft.startDate || editingDraft.date)
                  ? ` – ${editingDraft.endDate}`
                  : ""}
              </span>
              {editingDraft.startTime && (
                <span className="text-blue-400">
                  • Start {editingDraft.startTime}
                </span>
              )}
              {editingDraft.organizerName && (
                <span className="text-slate-400 hidden sm:inline">
                  • Organizator: {editingDraft.organizerName}
                </span>
              )}
            </div>
          </div>

          {/* Rząd 3: Pasek Zakładek (Underline Style - Bez numerowania kroków) */}
          <div className="border-t border-slate-800/80 pt-1">
            <nav className="flex items-center gap-6 sm:gap-8 overflow-x-auto">
              {/* Informacje ogólne */}
              <button
                type="button"
                onClick={() => handleTabChange("general")}
                className={`py-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "general"
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Informacje ogólne</span>
              </button>

              {/* Ekrany LED */}
              <button
                type="button"
                onClick={() => handleTabChange("screens")}
                className={`py-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "screens"
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Tv className="w-4 h-4" />
                <span>Ekrany LED</span>
                {screensCount > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {screensCount}
                  </span>
                )}
              </button>

              {/* Dodatkowy sprzęt */}
              <button
                type="button"
                onClick={() => handleTabChange("extra")}
                className={`py-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "extra"
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Cable className="w-4 h-4" />
                <span>Dodatkowy sprzęt</span>
                {extraItemsCount > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {extraItemsCount}
                  </span>
                )}
              </button>

              {/* Podsumowanie & WZ */}
              <button
                type="button"
                onClick={() => handleTabChange("manifest")}
                className={`py-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "manifest"
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span>Podsumowanie</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* ─── GŁÓWNA TREŚĆ WYBRANEJ ZAKŁADKI ─── */}
      <main className="flex-1 pl-6 pr-16 md:pr-24 lg:pr-32 max-w-[1550px] w-full py-6">
        {activeTab === "general" && (
          <JobGeneralInfoStep onNext={() => setActiveTab("screens")} />
        )}

        {activeTab === "screens" && (
          <JobScreensStep onNext={() => setActiveTab("extra")} />
        )}

        {activeTab === "extra" && (
          <JobExtraGearStep onNext={() => setActiveTab("manifest")} />
        )}

        {activeTab === "manifest" && <JobManifestStep />}
      </main>
    </div>
  );
}
