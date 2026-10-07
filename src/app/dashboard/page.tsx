import { Activity, PackageOpen, AlertTriangle, CalendarDays } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Pulpit</h1>
        <p className="text-slate-400 mt-1">Szybki podgląd na to, co dzieje się dzisiaj w magazynie.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Karta 1 */}
        <div className="bg-[#121824] p-6 rounded-xl border border-slate-800/80 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-24 h-24 text-blue-500" />
          </div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/20">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-slate-300 font-medium text-sm">Aktywne Realizacje</h3>
          </div>
          <p className="text-4xl font-bold text-white font-mono tabular-nums">12</p>
          <p className="text-sm text-slate-500 mt-2">W tym tygodniu</p>
        </div>

        {/* Karta 2 */}
        <div className="bg-[#121824] p-6 rounded-xl border border-slate-800/80 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <PackageOpen className="w-24 h-24 text-emerald-500" />
          </div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <PackageOpen className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-slate-300 font-medium text-sm">Sprzęt w terenie</h3>
          </div>
          <p className="text-4xl font-bold text-white font-mono tabular-nums">45<span className="text-xl text-slate-500">%</span></p>
          <p className="text-sm text-slate-500 mt-2">Więcej niż wczoraj</p>
        </div>

        {/* Karta 3 */}
        <div className="bg-[#121824] p-6 rounded-xl border border-slate-800/80 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertTriangle className="w-24 h-24 text-amber-500" />
          </div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-slate-300 font-medium text-sm">Alerty Magazynowe</h3>
          </div>
          <p className="text-4xl font-bold text-white font-mono tabular-nums text-amber-400">3</p>
          <p className="text-sm text-slate-500 mt-2">Niskie stany sprzętowe</p>
        </div>
      </div>
      
      {/* Sekcja tabelaryczna */}
      <div className="bg-[#121824] rounded-xl border border-slate-800/80 overflow-hidden">
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-white">Najbliższe wyjazdy</h2>
          <button className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">Zobacz wszystkie</button>
        </div>
        <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center">
          <CalendarDays className="w-12 h-12 text-slate-700 mb-4" />
          <p>Lista nadchodzących robót pojawi się tutaj.</p>
        </div>
      </div>
    </div>
  );
}
