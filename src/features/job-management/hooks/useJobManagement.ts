/**
 * Job Management Hook
 * 
 * Custom hook for managing job postings state.
 * Follows AI dev workflow: Hooks manage state, components display state.
 */

import { useState, useEffect, useCallback } from 'react';
import { createLogger } from '@/lib/logger';

const log = createLogger('useJobManagement');

import {
  JobSummary,
  JobWithRelations,
  JobMetrics,
  JobCategory,
  CreateJobPayload,
  UpdateJobPayload,
  JobFilters,
} from '../types';
import {
  getEmployerJobs,
  getJob,
  createJob,
  updateJob,
  publishJob,
  closeJob,
  deleteJob,
  toggleFeatured,
  getJobMetrics,
  getJobCategories,
} from '../services/jobService';

interface UseJobManagementState {
  jobs: JobSummary[];
  currentJob: JobWithRelations | null;
  metrics: JobMetrics | null;
  categories: JobCategory[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook for managing employer job listings
 */
export function useJobManagement(filters?: JobFilters) {
  const [state, setState] = useState<UseJobManagementState>({
    jobs: [],
    currentJob: null,
    metrics: null,
    categories: [],
    loading: true,
    error: null,
  });

  // Fetch all jobs for employer
  const fetchJobs = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const jobs = await getEmployerJobs(filters);
      setState(prev => ({ ...prev, jobs, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch jobs',
      }));
    }
  }, [filters]);

  // Fetch job categories
  const fetchCategories = useCallback(async () => {
    try {
      const categories = await getJobCategories();
      setState(prev => ({ ...prev, categories }));
    } catch (error) {
      log.error('Failed to fetch categories', error);
    }
  }, []);

  // Fetch single job
  const fetchJob = useCallback(async (jobId: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const job = await getJob(jobId);
      setState(prev => ({ ...prev, currentJob: job, loading: false }));
      return job;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch job',
      }));
      throw error;
    }
  }, []);

  // Create new job
  const addJob = useCallback(async (data: CreateJobPayload) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const job = await createJob(data);
      setState(prev => ({
        ...prev,
        jobs: [...prev.jobs, job as unknown as JobSummary],
        currentJob: job as unknown as JobWithRelations,
        loading: false,
      }));
      return job;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to create job',
      }));
      throw error;
    }
  }, []);

  // Update job
  const editJob = useCallback(async (jobId: number, data: UpdateJobPayload) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const job = await updateJob(jobId, data);
      setState(prev => ({
        ...prev,
        jobs: prev.jobs.map(j => j.id === jobId ? job as unknown as JobSummary : j),
        currentJob: job as unknown as JobWithRelations,
        loading: false,
      }));
      return job;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to update job',
      }));
      throw error;
    }
  }, []);

  // Publish job
  const publish = useCallback(async (jobId: number) => {
    try {
      const job = await publishJob(jobId);
      setState(prev => ({
        ...prev,
        jobs: prev.jobs.map(j => j.id === jobId ? job as unknown as JobSummary : j),
      }));
      return job;
    } catch (error) {
      throw error;
    }
  }, []);

  // Close job
  const close = useCallback(async (jobId: number) => {
    try {
      const job = await closeJob(jobId);
      setState(prev => ({
        ...prev,
        jobs: prev.jobs.map(j => j.id === jobId ? job as unknown as JobSummary : j),
      }));
      return job;
    } catch (error) {
      throw error;
    }
  }, []);

  // Delete job
  const removeJob = useCallback(async (jobId: number) => {
    try {
      await deleteJob(jobId);
      setState(prev => ({
        ...prev,
        jobs: prev.jobs.filter(j => j.id !== jobId),
      }));
    } catch (error) {
      throw error;
    }
  }, []);

  // Toggle featured
  const setFeatured = useCallback(async (jobId: number, isFeatured: boolean) => {
    try {
      const job = await toggleFeatured(jobId, isFeatured);
      setState(prev => ({
        ...prev,
        jobs: prev.jobs.map(j => j.id === jobId ? job as unknown as JobSummary : j),
      }));
      return job;
    } catch (error) {
      throw error;
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchJobs();
    fetchCategories();
  }, [fetchJobs, fetchCategories]);

  return {
    ...state,
    fetchJobs,
    fetchJob,
    addJob,
    editJob,
    publish,
    close: close,
    deleteJob: removeJob,
    setFeatured,
  };
}

/**
 * Hook for fetching job metrics
 */
export function useJobMetrics(jobId: number) {
  const [metrics, setMetrics] = useState<JobMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJobMetrics(jobId);
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (jobId) {
      fetchMetrics();
    }
  }, [jobId, fetchMetrics]);

  return { metrics, loading, error, refetch: fetchMetrics };
}
