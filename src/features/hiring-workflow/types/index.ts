/**
 * Hiring Workflow Types
 * 
 * Defines all types for the hiring workflow based on flow.md
 * and the existing ApplicationStatus enum from Prisma schema.
 */

// Flow stages from docs/flow.md
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
  | 'ONBOARDING';

// Application status mapped to Prisma schema
export type ApplicationStatus = 
  | 'PENDING'
  | 'REVIEWING'
  | 'SHORTLISTED'
  | 'INTERVIEW'
  | 'OFFERED'
  | 'HIRED'
  | 'REJECTED'
  | 'WITHDRAWN';

// Stage configuration for UI display
export interface StageConfig {
  id: HiringStage;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  order: number;
  icon?: string;
}

// Application data from backend
export interface Application {
  id: number;
  userId: string;
  jobId: number;
  job?: Job;
  coverLetter?: string;
  resumeUrl?: string;
  status: ApplicationStatus;
  englishTestRequired: boolean;
  englishTestScore?: number;
  passedScreening?: boolean;
  appliedAt: Date;
  reviewedAt?: Date;
  interviewAt?: Date;
  rejectedAt?: Date;
  acceptedAt?: Date;
  employerNotes?: string;
  isShortlisted?: boolean;
  interviews?: Interview[];
  candidate?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
}

// Job data from backend
export interface Job {
  id: number;
  title: string;
  slug: string;
  description: string;
  requirements?: string;
  benefits?: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  workMode: WorkMode;
  location?: string;
  city?: string;
  country?: string;
  remoteWork: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  salaryPeriod: SalaryPeriod;
  isSalaryVisible: boolean;
  requiredSkills: string[];
  preferredSkills: string[];
  status: JobStatus;
  isFeatured: boolean;
  isActive: boolean;
  applicationUrl?: string;
  applicationEmail?: string;
  deadline?: Date;
  viewsCount: number;
  applicationsCount: number;
  employerId: string;
  categoryId?: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  closedAt?: Date;
}

// Interview data
export interface Interview {
  id: number;
  applicationId: number;
  scheduledAt: Date;
  duration: number;
  type: InterviewType;
  meetingLink?: string;
  location?: string;
  status: InterviewStatus;
  completed: boolean;
  notes?: string;
  feedback?: string;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Enums from Prisma schema
export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'TEMPORARY';

export type ExperienceLevel = 'ENTRY' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD' | 'EXECUTIVE';

export type WorkMode = 'ONSITE' | 'REMOTE' | 'HYBRID';

export type SalaryPeriod = 'HOURLY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export type JobStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';

export type InterviewType = 'PHONE' | 'VIDEO' | 'ONSITE' | 'TECHNICAL' | 'FINAL';

export type InterviewStatus = 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';

// Workflow metrics
export interface WorkflowMetrics {
  totalApplications: number;
  applicationsByStage: Record<HiringStage, number>;
  averageTimeToHire: number;
  conversionRates: Record<string, number>;
}

// Stage transition
export interface StageTransition {
  from: HiringStage;
  to: HiringStage;
  applicationId: number;
  timestamp: Date;
  notes?: string;
}

// Workflow timeline entry
export interface TimelineEntry {
  stage: HiringStage;
  date: Date;
  status: 'completed' | 'current' | 'pending';
  notes?: string;
}
