"use client";

import { useState } from 'react';
import { useJobs } from '@/hooks/useJobs';
import { JobsKpiCards } from './JobsKpiCards';
import { JobCardItem } from './JobCardItem';
import { JobsRampScheduleWidget } from './JobsRampScheduleWidget';
import { DeleteJobConfirmDialog } from './DeleteJobConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Job } from '@/lib/mockData';
import {
  Plus,
  Search,
  CheckCircle,
  CalendarDays,
} from 'lucide-react';

export function JobsDashboardView() {
  const { jobs, startNewJob, selectJobForEdit, deleteJob, toggleJobStatus } = useJobs();
  const [filterStatus, setFilterStatus] = useState<'all' | 'w_trakcie' | 'zakonczone'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  const filteredJobs = jobs.filter((job) => {
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      job.name.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q) ||
      (job.organizerName && job.organizerName.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const handleConfirmDelete = () => {
    if (!jobToDelete) return;
    deleteJob(jobToDelete.id);
    setJobToDelete(null);
  };

  const handleStartNewJob = () => {
    startNewJob();
    window.history.pushState({ job: 'new' }, '', `${window.location.pathname}?job=new`);
  };

  const handleSelectJobForEdit = (id: string) => {
    selectJobForEdit(id);
    window.history.pushState({ job: id }, '', `${window.location.pathname}?job=${id}`);
  };

  return (
    <div className="pl-6 pr-16 md:pr-24 lg:pr-32 max-w-[1550px] w-full py-6 space-y-6 animate-in fade-in duration-200">
      {/* ─── 1. TOPBAR REJESTRU ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">Rejestr Robót</h1>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-medium">
              <CheckCircle className="w-3 h-3" />
              Synchronizacja z magazynem
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Zarządzaj realizacjami eventowymi, konfiguracjami ekranów i harmonogramem wyjazdów.
          </p>
        </div>

        <Button onClick={handleStartNewJob} className="gap-2 self-start sm:self-auto cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Nowa Robota</span>
        </Button>
      </div>

      {/* ─── 2. KAFELKI KPI BENTO ─── */}
      <JobsKpiCards jobs={jobs} />

      {/* ─── 3. ASYMETRYCZNY BENTO GRID (8 KOLUMN ROBOTY + 4 KOLUMNY HARMONOGRAM) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Lewa Strefa: Kafelki Realizacji (8 Kolumn) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Pasek Filtrów + Zintegrowana Wyszukiwarka */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#121824] border border-slate-800/80 p-2.5 rounded-xl">
            {/* Stonowany, wyszarzony Segmented Control */}
            <div className="bg-[#0e131d] p-1 rounded-lg border border-slate-800/80 inline-flex items-center gap-1">
              <button
                type="button"
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  filterStatus === 'all'
                    ? 'bg-slate-800 text-white border border-slate-700/80 shadow-xs'
                    : 'text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                Wszystkie ({jobs.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('w_trakcie')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  filterStatus === 'w_trakcie'
                    ? 'bg-slate-800 text-white border border-slate-700/80 shadow-xs'
                    : 'text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                W trakcie ({jobs.filter((j) => j.status === 'w_trakcie').length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('zakonczone')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  filterStatus === 'zakonczone'
                    ? 'bg-slate-800 text-white border border-slate-700/80 shadow-xs'
                    : 'text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                Zakończone ({jobs.filter((j) => j.status === 'zakonczone').length})
              </button>
            </div>

            {/* Wyszukiwarka przeniesiona do paska listy */}
            <div className="relative min-w-[200px] sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Szukaj realizacji lub miejsca..."
                className="h-8.5 pl-9 pr-3 text-xs"
              />
            </div>
          </div>

          {/* Siatka Kafelków Robót */}
          {filteredJobs.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-slate-800 rounded-xl bg-[#121824]/40">
              <CalendarDays className="w-10 h-10 text-slate-600 mx-auto mb-2.5" />
              <p className="text-white font-semibold text-sm">Brak robót w tym widoku</p>
              <p className="text-slate-500 text-xs mt-1">Zmień filtr lub utwórz nowe zlecenie.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJobs.map((job) => (
                <JobCardItem
                  key={job.id}
                  job={job}
                  onEdit={handleSelectJobForEdit}
                  onRequestDelete={(j) => setJobToDelete(j)}
                  onToggleStatus={toggleJobStatus}
                />
              ))}
            </div>
          )}
        </div>

        {/* Prawa Strefa: Harmonogram & Kalendarz (4 Kolumny) */}
        <div className="lg:col-span-4 space-y-4">
          <JobsRampScheduleWidget jobs={jobs} onSelectJob={handleSelectJobForEdit} />
        </div>
      </div>

      {/* ─── MODAL POTWIERDZENIA USUNIĘCIA ROBOTY ─── */}
      <DeleteJobConfirmDialog
        isOpen={Boolean(jobToDelete)}
        jobName={jobToDelete?.name || ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setJobToDelete(null)}
      />
    </div>
  );
}
