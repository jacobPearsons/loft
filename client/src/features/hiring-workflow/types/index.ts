export type HiringStage =
  | 'JOB_IDENTIFIED'
  | 'JOB_APPLICATION'
  | 'APPLICATIONS_RECEIVED'
  | 'RESUME_SCREENING'
  | 'HR_INTERVIEW'
  | 'SKILLS_TEST'
  | 'TECHNICAL_INTERVIEW'
  | 'BEHAVIORAL_INTERVIEW'
  | 'FINAL_HIRING_MANAGER'
  | 'BACKGROUND_CHECKS'
  | 'OFFER_LETTER'
  | 'HIRING'
  | 'ONBOARDING'

export type ApplicationStatus =
  | 'PENDING'
  | 'REVIEWING'
  | 'SHORTLISTED'
  | 'INTERVIEW'
  | 'OFFERED'
  | 'HIRED'
  | 'REJECTED'
  | 'WITHDRAWN'

export interface StageConfig {
  id: HiringStage
  name: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'rejected'
  order: number
  icon?: string
}

export interface Application {
  id: number
  userId: string
  jobId: number
  job?: Job
  coverLetter?: string
  resumeUrl?: string
  status: ApplicationStatus
  englishTestRequired: boolean
  englishTestScore?: number
  passedScreening?: boolean
  appliedAt: Date | string
  reviewedAt?: Date | string
  interviewAt?: Date | string
  rejectedAt?: Date | string
  acceptedAt?: Date | string
  employerNotes?: string
  isShortlisted?: boolean
  interviews?: Interview[]
  candidate?: {
    id: string
    firstName: string
    lastName: string
    email: string
    profileImage?: string
  }
}

export interface Job {
  id: number
  title: string
  slug: string
  description: string
  requirements?: string
  benefits?: string
  jobType: JobType
  experienceLevel: ExperienceLevel
  workMode: WorkMode
  location?: string
  city?: string
  country?: string
  remoteWork: boolean
  salaryMin?: number
  salaryMax?: number
  salaryCurrency: string
  salaryPeriod: SalaryPeriod
  isSalaryVisible: boolean
  requiredSkills: string[]
  preferredSkills: string[]
  status: JobStatus
  isFeatured: boolean
  isActive: boolean
  applicationUrl?: string
  applicationEmail?: string
  deadline?: Date | string
  viewsCount: number
  applicationsCount: number
  employerId: string
  categoryId?: number
  createdAt: Date | string
  updatedAt: Date | string
  publishedAt?: Date | string
  closedAt?: Date | string
}

export interface Interview {
  id: number
  applicationId: number
  scheduledAt: Date | string
  duration: number
  type: InterviewType
  meetingLink?: string
  location?: string
  status: InterviewStatus
  completed: boolean
  notes?: string
  feedback?: string
  rating?: number
  createdAt: Date | string
  updatedAt: Date | string
}

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'TEMPORARY'
export type ExperienceLevel = 'ENTRY' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD' | 'EXECUTIVE'
export type WorkMode = 'ONSITE' | 'REMOTE' | 'HYBRID'
export type SalaryPeriod = 'HOURLY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
export type JobStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED'
export type InterviewType = 'PHONE' | 'VIDEO' | 'ONSITE' | 'TECHNICAL' | 'FINAL'
export type InterviewStatus = 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED'

export interface WorkflowMetrics {
  totalApplications: number
  applicationsByStage: Record<HiringStage, number>
  averageTimeToHire: number
  conversionRates: Record<string, number>
}

export interface StageTransition {
  from: HiringStage
  to: HiringStage
  applicationId: number
  timestamp: Date
  notes?: string
}

export interface TimelineEntry {
  stage: HiringStage
  date: Date
  status: 'completed' | 'current' | 'pending'
  notes?: string
}
