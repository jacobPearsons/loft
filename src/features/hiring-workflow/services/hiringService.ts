/**
 * Hiring Workflow Service
 * 
 * Service layer for hiring workflow data operations.
 * Follows frontend-lifecycle rules: services handle API communication.
 */

import {
  Application,
  Job,
  HiringStage,
  WorkflowMetrics,
  TimelineEntry,
  StageTransition,
  Interview,
  InterviewType,
  InterviewStatus,
} from '../types';

/**
 * Fetches all applications for a job
 */
export async function getApplications(jobId: number): Promise<Application[]> {
  const response = await fetch(`/api/applications?jobId=${jobId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch applications');
  }
  return response.json();
}

/**
 * Fetches a single application by ID
 */
export async function getApplication(applicationId: number): Promise<Application> {
  const response = await fetch(`/api/applications/${applicationId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch application');
  }
  return response.json();
}

/**
 * Fetches applications by status
 */
export async function getApplicationsByStatus(status: string): Promise<Application[]> {
  const response = await fetch(`/api/applications?status=${status}`);
  if (!response.ok) {
    throw new Error('Failed to fetch applications by status');
  }
  return response.json();
}

/**
 * Updates application status (stage transition)
 */
export async function updateApplicationStatus(
  applicationId: number,
  status: string,
  notes?: string
): Promise<Application> {
  const response = await fetch(`/api/applications/${applicationId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status, notes: notes || "" }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update application status');
  }
  return response.json();
}

/**
 * Submits a new job application
 */
export async function submitApplication(data: {
  jobId: number;
  coverLetter?: string;
  resumeUrl?: string;
}): Promise<Application> {
  const response = await fetch('/api/applications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to submit application');
  }
  return response.json();
}

/**
 * Schedules an interview for an application
 */
export async function scheduleInterview(
  applicationId: number,
  data: {
    scheduledAt: Date;
    duration: number;
    type: InterviewType;
    meetingLink?: string;
    location?: string;
  }
): Promise<Interview> {
  const response = await fetch(`/api/applications/${applicationId}/interviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to schedule interview');
  }
  return response.json();
}

/**
 * Updates interview details
 */
export async function updateInterview(
  interviewId: number,
  data: {
    status?: InterviewStatus;
    notes?: string;
    feedback?: string;
    rating?: number;
    completed?: boolean;
  }
): Promise<Interview> {
  const response = await fetch(`/api/interviews/${interviewId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update interview');
  }
  return response.json();
}

/**
 * Fetches workflow metrics for a job
 */
export async function getWorkflowMetrics(jobId: number): Promise<WorkflowMetrics> {
  const response = await fetch(`/api/jobs/${jobId}/metrics`);
  if (!response.ok) {
    throw new Error('Failed to fetch workflow metrics');
  }
  return response.json();
}

/**
 * Generates timeline for an application
 */
export function generateApplicationTimeline(application: Application): TimelineEntry[] {
  const stages: HiringStage[] = [
    'JOB_IDENTIFIED',
    'JOB_APPLICATION',
    'APPLICATIONS_RECEIVED',
    'RESUME_SCREENING',
    'HR_INTERVIEW',
    'SKILLS_TEST',
    'TECHNICAL_INTERVIEW',
    'BEHAVIORAL_INTERVIEW',
    'FINAL_HIRING_MANAGER',
    'BACKGROUND_CHECKS',
    'OFFER_LETTER',
    'HIRING',
    'ONBOARDING',
  ];

  const statusToStage: Record<string, HiringStage> = {
    PENDING: 'APPLICATIONS_RECEIVED',
    REVIEWING: 'RESUME_SCREENING',
    SHORTLISTED: 'HR_INTERVIEW',
    INTERVIEW: 'TECHNICAL_INTERVIEW',
    OFFERED: 'OFFER_LETTER',
    HIRED: 'HIRING',
    REJECTED: 'RESUME_SCREENING',
    WITHDRAWN: 'JOB_APPLICATION',
  };

  const currentStage = statusToStage[application.status] || 'APPLICATIONS_RECEIVED';
  const currentIndex = stages.indexOf(currentStage);

  return stages.map((stage, index) => ({
    stage,
    date: getStageDate(application, stage),
    status: index < currentIndex ? 'completed' : index === currentIndex ? 'current' : 'pending',
  }));
}

/**
 * Helper to get date for each stage
 */
function getStageDate(application: Application, stage: HiringStage): Date {
  switch (stage) {
    case 'JOB_APPLICATION':
      return application.appliedAt;
    case 'APPLICATIONS_RECEIVED':
      return application.appliedAt;
    case 'RESUME_SCREENING':
      return application.reviewedAt || application.appliedAt;
    case 'HR_INTERVIEW':
    case 'SKILLS_TEST':
    case 'TECHNICAL_INTERVIEW':
    case 'BEHAVIORAL_INTERVIEW':
    case 'FINAL_HIRING_MANAGER':
      return application.interviewAt || application.appliedAt;
    case 'BACKGROUND_CHECKS':
    case 'OFFER_LETTER':
      return application.acceptedAt || application.appliedAt;
    case 'HIRING':
      return application.acceptedAt || application.appliedAt;
    case 'ONBOARDING':
      return application.acceptedAt || application.appliedAt;
    default:
      return application.appliedAt;
  }
}

/**
 * Stage configuration mapping
 */
export const STAGE_CONFIG: Record<HiringStage, { name: string; description: string; order: number }> = {
  JOB_IDENTIFIED: {
    name: 'Job Identified',
    description: 'Position has been identified and approved for hiring',
    order: 1,
  },
  JOB_APPLICATION: {
    name: 'Job Application',
    description: 'Candidate has submitted their application',
    order: 2,
  },
  APPLICATIONS_RECEIVED: {
    name: 'Applications Received',
    description: 'All applications have been received and logged',
    order: 3,
  },
  RESUME_SCREENING: {
    name: 'Resume Screening',
    description: 'Applications are being reviewed for qualifications',
    order: 4,
  },
  HR_INTERVIEW: {
    name: 'HR Interview',
    description: 'Initial screening interview with HR',
    order: 5,
  },
  SKILLS_TEST: {
    name: 'Skills / Technical Test',
    description: 'Technical skills assessment',
    order: 6,
  },
  TECHNICAL_INTERVIEW: {
    name: 'Technical Interview',
    description: 'In-depth technical interview with team lead',
    order: 7,
  },
  BEHAVIORAL_INTERVIEW: {
    name: 'Behavioral Interview',
    description: 'Cultural fit and behavioral assessment',
    order: 8,
  },
  FINAL_HIRING_MANAGER: {
    name: 'Final Hiring Manager Interview',
    description: 'Final interview with hiring manager',
    order: 9,
  },
  BACKGROUND_CHECKS: {
    name: 'Background Checks',
    description: 'Verification of credentials and references',
    order: 10,
  },
  OFFER_LETTER: {
    name: 'Offer Letter',
    description: 'Employment offer has been extended',
    order: 11,
  },
  HIRING: {
    name: 'Hiring',
    description: 'Candidate has accepted and is being hired',
    order: 12,
  },
  ONBOARDING: {
    name: 'Onboarding',
    description: 'New hire orientation and setup',
    order: 13,
  },
};

/**
 * Calculate conversion rate between stages
 */
export function calculateConversionRate(
  fromCount: number,
  toCount: number
): number {
  if (fromCount === 0) return 0;
  return Math.round((toCount / fromCount) * 100);
}
