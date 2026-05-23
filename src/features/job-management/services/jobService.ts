/**
 * Job Management Service
 * 
 * Service layer for job management operations.
 * Follows AI dev workflow: Service handles API communication.
 */

import {
  JobWithRelations,
  JobSummary,
  JobMetrics,
  JobCategory,
  CreateJobPayload,
  UpdateJobPayload,
  JobFilters,
} from '../types';

/**
 * Fetches all jobs for the current employer
 */
export async function getEmployerJobs(filters?: JobFilters): Promise<JobSummary[]> {
  const params = new URLSearchParams();
  
  if (filters?.status) params.set('status', filters.status);
  if (filters?.jobType) params.set('jobType', filters.jobType);
  if (filters?.experienceLevel) params.set('experienceLevel', filters.experienceLevel);
  if (filters?.workMode) params.set('workMode', filters.workMode);
  if (filters?.search) params.set('search', filters.search);

  const response = await fetch(`/api/jobs/employer?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch employer jobs');
  }
  return response.json();
}

/**
 * Fetches a single job by ID
 */
export async function getJob(jobId: number): Promise<JobWithRelations> {
  const response = await fetch(`/api/jobs/${jobId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch job');
  }
  return response.json();
}

/**
 * Creates a new job posting
 */
export async function createJob(data: CreateJobPayload): Promise<JobWithRelations> {
  const response = await fetch('/api/jobs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create job');
  }
  return response.json();
}

/**
 * Updates an existing job
 */
export async function updateJob(jobId: number, data: UpdateJobPayload): Promise<JobWithRelations> {
  const response = await fetch(`/api/jobs/${jobId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update job');
  }
  return response.json();
}

/**
 * Publishes a job posting
 */
export async function publishJob(jobId: number): Promise<JobWithRelations> {
  return updateJob(jobId, { status: 'PUBLISHED' });
}

/**
 * Unpublishes/closes a job posting
 */
export async function closeJob(jobId: number): Promise<JobWithRelations> {
  return updateJob(jobId, { status: 'CLOSED' });
}

/**
 * Deletes a job posting
 */
export async function deleteJob(jobId: number): Promise<void> {
  const response = await fetch(`/api/jobs/${jobId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete job');
  }
}

/**
 * Toggles featured status
 */
export async function toggleFeatured(jobId: number, isFeatured: boolean): Promise<JobWithRelations> {
  return updateJob(jobId, { isFeatured });
}

/**
 * Fetches job metrics
 */
export async function getJobMetrics(jobId: number): Promise<JobMetrics> {
  const response = await fetch(`/api/jobs/${jobId}/metrics`);
  if (!response.ok) {
    throw new Error('Failed to fetch job metrics');
  }
  return response.json();
}

/**
 * Fetches all job categories
 */
export async function getJobCategories(): Promise<JobCategory[]> {
  const response = await fetch('/api/job-categories');
  if (!response.ok) {
    throw new Error('Failed to fetch job categories');
  }
  return response.json();
}

/**
 * Generates slug from job title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Formats salary range for display
 */
export function formatSalaryRange(
  min?: number,
  max?: number,
  currency: string = 'USD',
  period: string = 'YEARLY'
): string {
  if (!min && !max) return 'Not specified';
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });
  
  const periodLabel = {
    HOURLY: '/hr',
    WEEKLY: '/wk',
    MONTHLY: '/mo',
    YEARLY: '/yr',
  }[period] || '';
  
  if (min && max) {
    return `${formatter.format(min)} - ${formatter.format(max)}${periodLabel}`;
  }
  
  if (min) {
    return `From ${formatter.format(min)}${periodLabel}`;
  }
  
  if (max !== undefined) {
    return `Up to ${formatter.format(max)}${periodLabel}`;
  }
  
  return 'Not specified';
}

/**
 * Job type labels
 */
export const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  TEMPORARY: 'Temporary',
};

/**
 * Experience level labels
 */
export const EXPERIENCE_LEVEL_LABELS: Record<string, string> = {
  ENTRY: 'Entry Level',
  JUNIOR: 'Junior',
  MID: 'Mid-Level',
  SENIOR: 'Senior',
  LEAD: 'Lead',
  EXECUTIVE: 'Executive',
};

/**
 * Work mode labels
 */
export const WORK_MODE_LABELS: Record<string, string> = {
  ONSITE: 'On-site',
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
};

/**
 * Job status labels
 */
export const JOB_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  CLOSED: 'Closed',
  ARCHIVED: 'Archived',
};
