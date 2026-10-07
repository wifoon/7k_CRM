"use client";

interface ScreenCalculationCardProps {
  totalCases: number;
  fullCases: number;
  halfCases: number;
  cols: number;
  widthM: number;
  mountingType: string;
  goalpostHeight: string;
}

export function ScreenCalculationCard({
  totalCases,
  fullCases,
  halfCases,
  cols,
  widthM,
  mountingType,
  goalpostHeight,
}: ScreenCalculationCardProps) {
  return (
    <div className="bg-[#121824] border border-slate-800 rounded-xl p-4 text-xs font-mono">
      <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-2 font-sans font-bold">
        Kalkulacja Załadunku dla tego Ekranu:
      </span>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300">
        <div>
          <span className="text-slate-500 block text-[10px]">Skrzynie Diody</span>
          <strong className="text-white text-sm">{totalCases} case</strong> ({fullCases}W + {halfCases}P)
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">Układ Modułów</span>
          <strong className="text-white text-sm">{cols} kol.</strong> (szerokość)
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">Belka Pozioma</span>
          <strong className="text-white text-sm">{widthM} m</strong> kraty
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">
            {mountingType === 'bramka' ? 'Słupy (+1m)' : 'Montaż'}
          </span>
          <strong
            className={`text-sm ${
              mountingType === 'brak' ? 'text-slate-500 font-normal' : 'text-purple-400'
            }`}
          >
            {mountingType === 'bramka'
              ? `2 × ${goalpostHeight}m`
              : mountingType === 'brak'
                ? 'Brak konstrukcji'
                : mountingType}
          </strong>
        </div>
      </div>
    </div>
  );
}
