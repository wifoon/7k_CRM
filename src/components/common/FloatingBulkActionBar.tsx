"use client";

import React from "react";

export interface BulkActionItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "warning" | "destructive" | "primary" | "success";
  disabled?: boolean;
}

export interface FloatingBulkActionBarProps {
  selectedCount: number;
  totalCount?: number;
  onSelectAll?: () => void;
  onClearSelection: () => void;
  actions: BulkActionItem[];
  singularLabel?: string;
  pluralFewLabel?: string;
  pluralManyLabel?: string;
  className?: string;
}

function getPluralLabel(
  count: number,
  singular = "zaznaczona",
  pluralFew = "zaznaczone",
  pluralMany = "zaznaczonych"
): string {
  if (count === 1) return `${count} ${singular}`;
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return `${count} ${pluralFew}`;
  }
  return `${count} ${pluralMany}`;
}

export function FloatingBulkActionBar({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  actions,
  singularLabel,
  pluralFewLabel,
  pluralManyLabel,
  className = "",
}: FloatingBulkActionBarProps) {
  if (selectedCount <= 0) return null;

  const countText = getPluralLabel(
    selectedCount,
    singularLabel,
    pluralFewLabel,
    pluralManyLabel
  );

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200 select-none ${className}`}
    >
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-[#0e1422]/95 border border-slate-700/80 rounded-full shadow-2xl shadow-black/60 backdrop-blur-md">
        {/* Licznik zaznaczonych */}
        <span className="text-xs sm:text-sm font-medium text-slate-200 pl-1 whitespace-nowrap">
          {countText}
        </span>

        {/* Link: Zaznacz wszystkie */}
        {onSelectAll && (
          <button
            type="button"
            onClick={onSelectAll}
            className="text-xs sm:text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer whitespace-nowrap px-1"
          >
            Zaznacz wszystkie{totalCount ? ` (${totalCount})` : ""}
          </button>
        )}

        {/* Link: Odznacz */}
        <button
          type="button"
          onClick={onClearSelection}
          className="text-xs sm:text-sm text-slate-400 hover:text-slate-200 transition-colors cursor-pointer whitespace-nowrap px-1"
        >
          Odznacz
        </button>

        {/* Separator */}
        {actions.length > 0 && (
          <div className="h-4 w-px bg-slate-700/80 mx-0.5" />
        )}

        {/* Przyciski akcji z tooltipami */}
        <div className="flex items-center gap-1">
          {actions.map((action) => {
            const variantClasses =
              action.variant === "destructive"
                ? "text-slate-300 hover:text-rose-400 hover:bg-rose-500/20 active:bg-rose-500/30"
                : action.variant === "warning"
                ? "text-slate-300 hover:text-amber-400 hover:bg-amber-500/20 active:bg-amber-500/30"
                : action.variant === "success"
                ? "text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/20 active:bg-emerald-500/30"
                : action.variant === "primary"
                ? "text-slate-300 hover:text-blue-400 hover:bg-blue-500/20 active:bg-blue-500/30"
                : "text-slate-300 hover:text-white hover:bg-slate-800 active:bg-slate-700";

            return (
              <div
                key={action.id}
                className="relative group/tooltip flex items-center justify-center"
              >
                <button
                  type="button"
                  disabled={action.disabled}
                  onClick={action.onClick}
                  aria-label={action.label}
                  className={`p-2 rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${variantClasses}`}
                >
                  {action.icon}
                </button>

                {/* Tooltip w stylu wzorca ze zrzutu ekranu */}
                <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 group-focus-visible/tooltip:opacity-100 pointer-events-none transition-all duration-150 z-50 flex flex-col items-center">
                  <div className="px-2.5 py-1 text-[11px] font-medium text-white bg-slate-900 border border-slate-700/90 rounded-md shadow-xl whitespace-nowrap">
                    {action.label}
                  </div>
                  <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-700/90" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
