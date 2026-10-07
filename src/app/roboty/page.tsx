"use client";

import { useEffect } from 'react';
import { useJobs } from '@/hooks/useJobs';
import { JobsDashboardView } from '@/components/jobs/JobsDashboardView';
import { JobStudioView } from '@/components/jobs/JobStudioView';

export default function RobotyPage() {
  const { editingDraft, clearDraft } = useJobs();

  // Obsługa przycisku wstecz w przeglądarce dla całego widoku roboty
  useEffect(() => {
    const handlePopState = () => {
      const search = window.location.search;
      if (!search.includes('job=') && !search.includes('screen=') && editingDraft) {
        clearDraft();
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [editingDraft, clearDraft]);

  if (editingDraft) {
    return <JobStudioView />;
  }

  return <JobsDashboardView />;
}

