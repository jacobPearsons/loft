/**
 * Job Management Types
 * 
 * Data types for employer job management feature.
 * Follows AI dev workflow: Types define system contracts.
 */

// Job creation/update payload
export interface CreateJobPayload {
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  workMode: WorkMode;
  location?: string;
  city?: string;
  country?: string;
  remoteWork?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: SalaryPeriod;
  isSalaryVisible?: boolean;
  requiredSkills?: string[];
  preferredSkills?: string[];
  applicationUrl?: string;
  applicationEmail?: string;
  deadline?: Date;
  categoryId?: number;
}

export interface UpdateJobPayload extends Partial<CreateJobPayload> {
  status?: JobStatus;
  isFeatured?: boolean;
  isActive?: boolean;
}

// Job with relations
export interface JobWithRelations {
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
  applications?: JobApplicationSummary[];
  category?: JobCategory;
}

// Simplified job for lists
export interface JobSummary {
  id: number;
  title: string;
  slug: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  workMode: WorkMode;
  location?: string;
  remoteWork: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  status: JobStatus;
  isFeatured: boolean;
  isActive: boolean;
  viewsCount: number;
  applicationsCount: number;
  createdAt: Date;
  publishedAt?: Date;
}

// Job category
export interface JobCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

// Job application summary
export interface JobApplicationSummary {
  id: number;
  userId: string;
  status: ApplicationStatus;
  appliedAt: Date;
  englishTestScore?: number;
  passedScreening?: boolean;
}

// Job metrics
export interface JobMetrics {
  jobId: number;
  totalViews: number;
  totalApplications: number;
  pendingApplications: number;
  interviewingApplications: number;
  offeredApplications: number;
  hiredApplications: number;
  rejectedApplications: number;
  averageTimeToReview: number;
  conversionRate: number;
}

// Job status options
export type JobStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';

// Enums from Prisma
export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'TEMPORARY';
export type ExperienceLevel = 'ENTRY' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD' | 'EXECUTIVE';
export type WorkMode = 'ONSITE' | 'REMOTE' | 'HYBRID';
export type SalaryPeriod = 'HOURLY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
export type ApplicationStatus = 'PENDING' | 'REVIEWING' | 'SHORTLISTED' | 'INTERVIEW' | 'OFFERED' | 'HIRED' | 'REJECTED' | 'WITHDRAWN';

// Form types
export interface JobFormValues extends CreateJobPayload {
  isSalaryVisible: boolean;
  remoteWork: boolean;
  isFeatured: boolean;
}

// Filter types
export interface JobFilters {
  status?: JobStatus;
  jobType?: JobType;
  experienceLevel?: ExperienceLevel;
  workMode?: WorkMode;
  search?: string;
}
