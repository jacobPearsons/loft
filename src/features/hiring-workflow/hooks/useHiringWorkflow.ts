/**
 * Hiring Workflow Hook
 * 
 * Custom hook for managing hiring workflow state.
 * Follows frontend-lifecycle rules: hooks manage state, components display state.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Application,
  HiringStage,
  WorkflowMetrics,
  TimelineEntry,
  StageConfig,
} from '../types';
import {
  getApplications,
  getApplication,
  updateApplicationStatus,
  submitApplication,
  generateApplicationTimeline,
  STAGE_CONFIG,
} from '../services/hiringService';

interface UseHiringWorkflowProps {
  jobId?: number;
  applicationId?: number;
}

interface UseHiringWorkflowState {
  applications: Application[];
  currentApplication: Application | null;
  timeline: TimelineEntry[];
  metrics: WorkflowMetrics | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for managing hiring workflow state
 */
export function useHiringWorkflow({ jobId, applicationId }: UseHiringWorkflowProps = {}) {
  const [state, setState] = useState<UseHiringWorkflowState>({
    applications: [],
    currentApplication: null,
    timeline: [],
    metrics: null,
    loading: true,
    error: null,
  });

  // Fetch applications for a job
  const fetchApplications = useCallback(async () => {
    if (!jobId) return;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const applications = await getApplications(jobId);
      setState(prev => ({
        ...prev,
        applications,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch applications',
      }));
    }
  }, [jobId]);

  // Fetch single application
  const fetchApplication = useCallback(async () => {
    if (!applicationId) return;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const application = await getApplication(applicationId);
      const timeline = generateApplicationTimeline(application);
      setState(prev => ({
        ...prev,
        currentApplication: application,
        timeline,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch application',
      }));
    }
  }, [applicationId]);

  // Transition application to next stage
  const transitionStage = useCallback(async (
    appId: number,
    newStatus: string,
    notes?: string
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const updated = await updateApplicationStatus(appId, newStatus, notes);
      const timeline = generateApplicationTimeline(updated);
      
      setState(prev => ({
        ...prev,
        currentApplication: updated,
        timeline,
        applications: prev.applications.map(app => 
          app.id === appId ? updated : app
        ),
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to update status',
      }));
    }
  }, []);

  // Submit new application
  const applyToJob = useCallback(async (data: {
    jobId: number;
    coverLetter?: string;
    resumeUrl?: string;
  }) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const application = await submitApplication(data);
      setState(prev => ({
        ...prev,
        currentApplication: application,
        applications: [...prev.applications, application],
        loading: false,
      }));
      return application;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to submit application',
      }));
      throw error;
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    if (jobId) {
      fetchApplications();
    } else if (applicationId) {
      fetchApplication();
    }
  }, [jobId, applicationId, fetchApplications, fetchApplication]);

  // Get stage configuration
  const getStageConfig = useCallback((): StageConfig[] => {
    return Object.entries(STAGE_CONFIG).map(([key, value]) => ({
      id: key as HiringStage,
      name: value.name,
      description: value.description,
      status: 'pending' as const,
      order: value.order,
    }));
  }, []);

  // Get current stage
  const getCurrentStage = useCallback((): HiringStage | null => {
    if (!state.currentApplication) return null;
    
    const statusMap: Record<string, HiringStage> = {
      PENDING: 'APPLICATIONS_RECEIVED',
      REVIEWING: 'RESUME_SCREENING',
      SHORTLISTED: 'HR_INTERVIEW',
      INTERVIEW: 'TECHNICAL_INTERVIEW',
      OFFERED: 'OFFER_LETTER',
      HIRED: 'HIRING',
    };
    
    return statusMap[state.currentApplication.status] || null;
  }, [state.currentApplication]);

  // Get applications by status
  const getApplicationsByStatus = useCallback((status: string) => {
    return state.applications.filter(app => app.status === status);
  }, [state.applications]);

  return {
    ...state,
    fetchApplications,
    fetchApplication,
    transitionStage,
    applyToJob,
    getStageConfig,
    getCurrentStage,
    getApplicationsByStatus,
  };
}

interface UseApplicationTimelineProps {
  application: Application;
}

interface UseApplicationTimelineState {
  timeline: TimelineEntry[];
  currentStage: HiringStage;
  progress: number;
}

/**
 * Hook for managing application timeline
 */
export function useApplicationTimeline({ application }: UseApplicationTimelineProps) {
  const [state, setState] = useState<UseApplicationTimelineState>({
    timeline: [],
    currentStage: 'JOB_APPLICATION',
    progress: 0,
  });

  useEffect(() => {
    const timeline = generateApplicationTimeline(application);
    const currentIndex = timeline.findIndex(t => t.status === 'current');
    const progress = currentIndex >= 0 ? Math.round(((currentIndex + 1) / timeline.length) * 100) : 0;
    
    const statusMap: Record<string, HiringStage> = {
      PENDING: 'APPLICATIONS_RECEIVED',
      REVIEWING: 'RESUME_SCREENING',
      SHORTLISTED: 'HR_INTERVIEW',
      INTERVIEW: 'TECHNICAL_INTERVIEW',
      OFFERED: 'OFFER_LETTER',
      HIRED: 'HIRING',
    };
    
    setState({
      timeline,
      currentStage: statusMap[application.status] || 'JOB_APPLICATION',
      progress,
    });
  }, [application]);

  return state;
}
