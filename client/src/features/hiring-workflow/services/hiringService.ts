import api from '@/lib/api'
import {
  Application,
  HiringStage,
  WorkflowMetrics,
  TimelineEntry,
  Interview,
  InterviewType,
  InterviewStatus,
} from '../types'

export async function getApplications(jobId: number): Promise<Application[]> {
  const { data } = await api.get('/applications', { params: { jobId } })
  return data
}

export async function getApplication(applicationId: number): Promise<Application> {
  const { data } = await api.get(`/applications/${applicationId}`)
  return data
}

export async function getApplicationsByStatus(status: string): Promise<Application[]> {
  const { data } = await api.get('/applications', { params: { status } })
  return data
}

export async function updateApplicationStatus(
  applicationId: number,
  status: string,
  notes?: string
): Promise<Application> {
  const { data } = await api.patch(`/applications/${applicationId}/status`, { status, notes: notes || "" })
  return data
}

export async function submitApplication(data: {
  jobId: number
  coverLetter?: string
  resumeUrl?: string
}): Promise<Application> {
  const { data: res } = await api.post(`/jobs/${data.jobId}/apply`, {
    coverLetter: data.coverLetter,
    resumeUrl: data.resumeUrl,
  })
  return res.application as Application
}

export async function scheduleInterview(
  applicationId: number,
  data: {
    scheduledAt: Date
    duration: number
    type: InterviewType
    meetingLink?: string
    location?: string
  }
): Promise<Interview> {
  const { data: res } = await api.post(`/applications/${applicationId}/interviews`, data)
  return res.interview
}

export async function updateInterview(
  interviewId: number,
  data: {
    status?: InterviewStatus
    notes?: string
    feedback?: string
    rating?: number
    completed?: boolean
  }
): Promise<Interview> {
  const { data: res } = await api.patch(`/interviews/${interviewId}`, data)
  return res.interview
}

export async function getWorkflowMetrics(jobId: number): Promise<WorkflowMetrics> {
  const { data } = await api.get(`/jobs/${jobId}/metrics`)
  return data
}

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
  ]

  const statusToStage: Record<string, HiringStage> = {
    PENDING: 'APPLICATIONS_RECEIVED',
    REVIEWING: 'RESUME_SCREENING',
    SHORTLISTED: 'HR_INTERVIEW',
    INTERVIEW: 'TECHNICAL_INTERVIEW',
    OFFERED: 'OFFER_LETTER',
    HIRED: 'HIRING',
    REJECTED: 'RESUME_SCREENING',
    WITHDRAWN: 'JOB_APPLICATION',
  }

  const currentStage = statusToStage[application.status] || 'APPLICATIONS_RECEIVED'
  const currentIndex = stages.indexOf(currentStage)

  return stages.map((stage, index) => ({
    stage,
    date: getStageDate(application, stage),
    status: index < currentIndex ? 'completed' : index === currentIndex ? 'current' : 'pending',
  }))
}

function getStageDate(application: Application, stage: HiringStage): Date {
  switch (stage) {
    case 'JOB_APPLICATION':
      return new Date(application.appliedAt)
    case 'APPLICATIONS_RECEIVED':
      return new Date(application.appliedAt)
    case 'RESUME_SCREENING':
      return application.reviewedAt ? new Date(application.reviewedAt) : new Date(application.appliedAt)
    case 'HR_INTERVIEW':
    case 'SKILLS_TEST':
    case 'TECHNICAL_INTERVIEW':
    case 'BEHAVIORAL_INTERVIEW':
    case 'FINAL_HIRING_MANAGER':
      return application.interviewAt ? new Date(application.interviewAt) : new Date(application.appliedAt)
    case 'BACKGROUND_CHECKS':
    case 'OFFER_LETTER':
      return application.acceptedAt ? new Date(application.acceptedAt) : new Date(application.appliedAt)
    case 'HIRING':
      return application.acceptedAt ? new Date(application.acceptedAt) : new Date(application.appliedAt)
    case 'ONBOARDING':
      return application.acceptedAt ? new Date(application.acceptedAt) : new Date(application.appliedAt)
    default:
      return new Date(application.appliedAt)
  }
}

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
}

export function calculateConversionRate(
  fromCount: number,
  toCount: number
): number {
  if (fromCount === 0) return 0
  return Math.round((toCount / fromCount) * 100)
}
