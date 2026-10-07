import { create } from 'zustand';
import { Job, JobScreenConfig, JobCustomItem, mockJobs } from '@/lib/mockData';

interface JobsState {
  jobs: Job[];
  editingJobId: string | null;
  editingDraft: Job | null;
  activeScreenForEdit: JobScreenConfig | null;

  startNewJob: () => void;
  selectJobForEdit: (id: string) => void;
  clearDraft: () => void;
  updateDraft: (patch: Partial<Job>) => void;

  setActiveScreenForEdit: (screen: JobScreenConfig | null) => void;
  addScreenToDraft: (screen: Omit<JobScreenConfig, 'id'>) => void;
  updateScreenInDraft: (id: string, patch: Partial<JobScreenConfig>) => void;
  removeScreenFromDraft: (id: string) => void;

  addCustomItemToDraft: (equipmentId: string, qty: number) => void;
  setCustomItemQtyInDraft: (equipmentId: string, qty: number) => void;
  removeCustomItemFromDraft: (equipmentId: string) => void;
  clearCustomItemsInDraft: () => void;

  saveDraft: () => void;
  deleteJob: (id: string) => void;
  toggleJobStatus: (id: string) => void;
}

export const useJobs = create<JobsState>((set, get) => ({
  jobs: mockJobs,
  editingJobId: null,
  editingDraft: null,
  activeScreenForEdit: null,

  startNewJob: () => {
    const today = new Date().toISOString().split('T')[0];
    const newJob: Job = {
      id: `job-${Date.now()}`,
      name: '',
      date: today,
      startDate: today,
      endDate: today,
      startTime: '18:00',
      location: '',
      status: 'w_trakcie',
      screens: [],
      customItems: [],
      organizerName: '',
      organizerPhone: '',
      notes: '',
      createdAt: new Date().toISOString(),
    };
    set({ editingJobId: null, editingDraft: newJob, activeScreenForEdit: null });
  },

  selectJobForEdit: (id) => {
    const job = get().jobs.find((j) => j.id === id);
    if (!job) return;
    set({
      editingJobId: id,
      editingDraft: JSON.parse(JSON.stringify(job)),
      activeScreenForEdit: null,
    });
  },

  clearDraft: () => {
    set({ editingJobId: null, editingDraft: null, activeScreenForEdit: null });
  },

  setActiveScreenForEdit: (screen) => {
    set({ activeScreenForEdit: screen });
  },

  updateDraft: (patch) => {
    const { editingDraft } = get();
    if (!editingDraft) return;
    set({ editingDraft: { ...editingDraft, ...patch } });
  },

  addScreenToDraft: (screen) => {
    const { editingDraft } = get();
    if (!editingDraft) return;
    const newScreen: JobScreenConfig = {
      ...screen,
      id: `scr-${Date.now()}`,
    };
    set({
      editingDraft: {
        ...editingDraft,
        screens: [...editingDraft.screens, newScreen],
      },
    });
  },

  updateScreenInDraft: (id, patch) => {
    const { editingDraft } = get();
    if (!editingDraft) return;
    set({
      editingDraft: {
        ...editingDraft,
        screens: editingDraft.screens.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      },
    });
  },

  removeScreenFromDraft: (id) => {
    const { editingDraft } = get();
    if (!editingDraft) return;
    set({
      editingDraft: {
        ...editingDraft,
        screens: editingDraft.screens.filter((s) => s.id !== id),
      },
    });
  },

  addCustomItemToDraft: (equipmentId, qty) => {
    const { editingDraft } = get();
    if (!editingDraft || qty <= 0) return;
    const existing = editingDraft.customItems.find((ci) => ci.equipmentId === equipmentId);
    let updated: JobCustomItem[];
    if (existing) {
      updated = editingDraft.customItems.map((ci) =>
        ci.equipmentId === equipmentId ? { ...ci, qty: ci.qty + qty } : ci
      );
    } else {
      updated = [...editingDraft.customItems, { equipmentId, qty }];
    }
    set({ editingDraft: { ...editingDraft, customItems: updated } });
  },

  setCustomItemQtyInDraft: (equipmentId, qty) => {
    const { editingDraft } = get();
    if (!editingDraft) return;
    if (qty <= 0) {
      set({
        editingDraft: {
          ...editingDraft,
          customItems: editingDraft.customItems.filter((ci) => ci.equipmentId !== equipmentId),
        },
      });
      return;
    }
    const existing = editingDraft.customItems.find((ci) => ci.equipmentId === equipmentId);
    let updated: JobCustomItem[];
    if (existing) {
      updated = editingDraft.customItems.map((ci) =>
        ci.equipmentId === equipmentId ? { ...ci, qty } : ci
      );
    } else {
      updated = [...editingDraft.customItems, { equipmentId, qty }];
    }
    set({ editingDraft: { ...editingDraft, customItems: updated } });
  },

  removeCustomItemFromDraft: (equipmentId) => {
    const { editingDraft } = get();
    if (!editingDraft) return;
    set({
      editingDraft: {
        ...editingDraft,
        customItems: editingDraft.customItems.filter((ci) => ci.equipmentId !== equipmentId),
      },
    });
  },

  clearCustomItemsInDraft: () => {
    const { editingDraft } = get();
    if (!editingDraft) return;
    set({
      editingDraft: {
        ...editingDraft,
        customItems: [],
      },
    });
  },

  saveDraft: () => {
    const { editingDraft, editingJobId, jobs } = get();
    if (!editingDraft || !editingDraft.name.trim()) return;

    if (editingJobId) {
      set({
        jobs: jobs.map((j) => (j.id === editingJobId ? editingDraft : j)),
        editingJobId: null,
        editingDraft: null,
        activeScreenForEdit: null,
      });
    } else {
      set({
        jobs: [editingDraft, ...jobs],
        editingJobId: null,
        editingDraft: null,
        activeScreenForEdit: null,
      });
    }
  },

  deleteJob: (id) => {
    set((state) => ({
      jobs: state.jobs.filter((j) => j.id !== id),
      editingJobId: state.editingJobId === id ? null : state.editingJobId,
      editingDraft: state.editingJobId === id ? null : state.editingDraft,
    }));
  },

  toggleJobStatus: (id) => {
    set((state) => ({
      jobs: state.jobs.map((j) =>
        j.id === id
          ? { ...j, status: j.status === 'w_trakcie' ? 'zakonczone' : 'w_trakcie' }
          : j
      ),
    }));
  },
}));
