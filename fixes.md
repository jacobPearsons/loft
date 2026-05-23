odebase Exploration Report: Loft Community Employment Platform
Root: /home/n0ccx/Documents/Projects/transit/race/work_force
1. Tech Stack Summary
Layer	Technology
Framework	Next.js 14 (App Router)
Auth	NextAuth.js v4 (credentials, Google OAuth, LinkedIn OAuth)
Database	PostgreSQL + Prisma ORM
UI	Tailwind CSS + Radix UI + shadcn/ui components
Animations	Framer Motion, tsparticles
Forms	react-hook-form + zod
Payments	Stripe (integrated but not fully wired)
Email	Resend (configured but not fully wired)
File Upload	Uploadcare (configured but not wired)
2. File Map
2.1 src/app/ -- All Pages and API Routes
Pages (Route Groups):
Route	File
/	src/app/page.tsx
/auth	src/app/(auth)/auth/page.tsx
/sign-in	src/app/(auth)/sign-in/[[...sign-in]]/page.tsx
/sign-up	src/app/(auth)/sign-up/[[...sign-up]]/page.tsx
/onboarding/role-selection	src/app/(auth)/onboarding/role-selection/page.tsx
/dashboard	src/app/(main)/(pages)/dashboard/page.tsx
/profile	src/app/(main)/(pages)/profile/page.tsx
/jobs	src/app/(main)/(pages)/jobs/page.tsx
/hiring-workflow	src/app/(main)/(pages)/hiring-workflow/page.tsx
/settings	src/app/(main)/(pages)/settings/page.tsx
/billing	src/app/(main)/(pages)/billing/page.tsx
/employer/dashboard	src/app/(main)/employer/dashboard/page.tsx
API Routes:
Route	Method(s)
/api/auth/[...nextauth]	GET, POST
/api/auth/register	POST
/api/auth/login	POST
/api/auth/logout	POST
/api/auth/reset-password	POST
/api/users/profile	GET, PATCH
/api/users/skills	GET, POST, DELETE
/api/users/resume	POST
/api/users/role	POST
/api/users/saved-jobs	GET, POST, DELETE
/api/jobs	GET, POST
/api/jobs/[id]/apply	POST
/api/jobs/[id]/candidates	GET
/api/companies/profile	GET, PATCH
/api/companies/jobs	GET
/api/applications	GET
/api/applications/[id]/status	PATCH
/api/applications/[id]/shortlist	PATCH
/api/messages	GET, POST
/api/admin/analytics	GET
/api/admin/jobs	GET, PATCH
/api/payment	GET, POST
2.2 src/features/ -- Feature Modules
Module	Files	Status
auth	types/index.ts, services/authService.ts, hooks/useAuth.ts, components/LoginForm.tsx, RegisterForm.tsx, ResetPasswordForm.tsx, LogoutButton.tsx	Feature-complete types, forms, hooks; service uses in-memory store (not DB)
job-management	types/index.ts, services/jobService.ts, hooks/useJobManagement.ts, components/JobForm.tsx, JobList.tsx, JobCard.tsx	Full CRUD service layer + hooks + components
hiring-workflow	types/index.ts, services/hiringService.ts, hooks/useHiringWorkflow.ts, components/StageCard.tsx, ApplicationCard.tsx, ApplicationList.tsx, WorkflowTimeline.tsx	Full pipeline UI + service layer (some API endpoints missing: /api/applications?jobId=, /api/applications/[id], /api/interviews/, /api/jobs/[id]/metrics)
dashboard	hooks/useDashboardData.ts	Hook with mock data
billing	types/index.ts, services/billingService.ts, hooks/useBilling.ts, components/BillingDashboard.tsx	Full billing feature with mock data
2.3 src/components/ -- Shared Components
Global: navbar, footer, logo, mode-toggle, sparkles, infinite-moving-cards, 3d-card, container-scroll-animation, lamp, connect-parallax, custom-modal, infobar, sidebar
Forms: ApplyJobModal, JobDetailsModal, profile-form
Home/Landing: hero-section, featured-jobs, job-categories, how-it-works, testimonials, call-to-action
Icons: home, jobs, users, category, workflows, payment, settings, clipboard, cloud_download
UI (shadcn): accordion, badge, button, card, command, dialog, drawer, dropdown-menu, form, input, label, multiple-selector, popover, progress, resizable, separator, sonner, switch, tabs, textarea, tooltip
2.4 src/providers/
Provider	Purpose
next-auth-provider	Wraps app in NextAuth SessionProvider
theme-provider	Dark/light theme (next-themes)
modal-provider	Global modal state
user-provider	Global user context
auth-provider	Auth state context
billing-provider	Billing state context
connections-provider	Legacy automation connections
editor-provider	Legacy workflow editor
2.5 src/lib/
File	Purpose
db.ts	Prisma client singleton
auth.ts	NextAuth configuration (Google, LinkedIn, credentials)
email.ts	Resend email integration + templates
utils.ts	cn() utility
types.ts	Legacy zod schemas and types (Fuzzie remnants)
constant.ts	Navigation menu + legacy constants
editor-utils.ts	Legacy workflow editor utils
2.6 src/types/
File	Purpose
next-auth.d.ts	NextAuth type augmentation (Session, JWT)
2.7 prisma/schema.prisma -- Key Models
Core Models:
- User -- with clerkId, email, hashedPassword, isEmployer, isApplicant, tier, credits
- UserProfile -- jobTitle, summary, skills[], experienceYears, education, workHistory, languages, availability, expectedSalary
- EmployerProfile -- companyName, companyLogo, companySize, industry, description, contactEmail, isVerified, hiringMode
- Job -- title, slug, description, requirements, benefits, jobType, experienceLevel, workMode, salary, requiredSkills[], status, deadline, employerId
- JobCategory -- name, slug, parent/child hierarchy
- JobApplication -- userId, jobId, coverLetter, resumeUrl, status (PENDING/REVIEWING/SHORTLISTED/INTERVIEW/OFFERED/HIRED/REJECTED/WITHDRAWN), employerNotes
- Interview -- applicationId, scheduledAt, type, status, meetingLink, feedback, rating
- Skill, UserSkill, JobRequiredSkill -- normalized skills system
- SavedJob -- user job bookmarks
- Resume -- file upload metadata + parsedData
- Message -- sender/receiver messaging
- Notification -- in-app notifications with type enum
- NotificationPreference -- user notification settings
- EnglishTestQuestion, EnglishTestResult -- English proficiency testing
- Report -- content moderation reports
- Account, Session, VerificationToken -- NextAuth adapter models
. PRD Feature Mapping
Feature 1: Authentication (email + OAuth) & Role Selection
Status: FULLY_IMPLEMENTED
What exists:
- NextAuth.js with 3 providers: credentials (email/password), Google OAuth, LinkedIn OAuth
- Registration API (/api/auth/register) with password hashing (bcrypt, 12 rounds), validation, and role assignment (isEmployer/isApplicant)
- Login API (/api/auth/login) with credential verification
- Logout API (/api/auth/logout)
- Password reset API (/api/auth/reset-password)
- Role selection page (/onboarding/role-selection) with both Employer and Job Seeker cards
- Role API (/api/users/role) that updates isEmployer/isApplicant
- JWT session with role info persisted
- Middleware that protects dashboard, profile, settings, billing, hiring-workflow routes
- NextAuth type augmentation in src/types/next-auth.d.ts
- LoginForm, RegisterForm, ResetPasswordForm UI components with password strength indicators
- Auth page (/auth) with split-layout design
Minor gaps: The authService.ts feature service has a parallel in-memory implementation (legacy); the actual auth flows bypass it and use NextAuth directly or the API routes directly.
Feature 2: Job Seeker Profile Creation
Status: FULLY_IMPLEMENTED
What exists:
- Profile page (/profile) with tabs: Profile, Resume, English Test
- Profile form with fields: firstName, lastName, email, phone, dateOfBirth, address, city, country, nationality, jobTitle, summary, skills (add/remove), experienceYears, expectedSalary, remoteWork, relocate
- Profile API (/api/users/profile) -- GET and PATCH with upsert
- Profile form component (profile-form.tsx) with zod validation
- Settings page with profile picture upload (Uploadcare integration)
- Dashboard profile completion prompts
- Resume upload UI + API (/api/users/resume) with PDF validation (5MB limit)
Feature 3: Employer Company Profile
Status: FULLY_IMPLEMENTED
What exists:
- Employer profile API (/api/companies/profile) -- GET and PATCH with upsert
- Database model EmployerProfile with companyName, companyLogo, companyWebsite, companySize, industry, description, contactEmail, contactPhone, linkedIn, twitter, city, country, hiringMode, isVerified
- Employer dashboard (/employer/dashboard) prompts user to create company profile if none exists
- Company information integrated into job listings
- Employer profile created via /api/users/role flow when role is EMPLOYER
Feature 4: Job Posting with Skills
Status: FULLY_IMPLEMENTED
What exists:
- Job creation API (POST /api/jobs) -- title, description, requirements, jobType, experienceLevel, workMode, location, city, salaryMin, salaryMax, skills (auto-create skills on-the-fly)
- Skills relation system: Skill, JobRequiredSkill, UserSkill models in Prisma
- Slug auto-generation for jobs
- Job status management (DRAFT, PUBLISHED, CLOSED, ARCHIVED)
- job-management feature module with full CRUD service + hooks + components (JobForm, JobList, JobCard)
- JobFormValues, CreateJobPayload, UpdateJobPayload types
- Employer dashboard tab showing "My Jobs" with status badges
- Link to create job from employer dashboard
Minor gaps: No dedicated PATCH /api/jobs/[id] endpoint (updateJob in service layer calls it but endpoint doesn't exist); no DELETE /api/jobs/[id]. The preferredSkills field is in the schema but not wired in the API.
Feature 5: Job Search / Filtering
Status: PARTIALLY_IMPLEMENTED
What exists:
- Job search API (GET /api/jobs) with keyword search (title + description), location filter, experience level filter, job type filter, work mode filter, pagination (page/limit)
- Skills are returned with each job listing
- Sorting by publishedAt (desc)
- Jobs page UI (/jobs) with search bar, location input, job type filter buttons, experience level filter buttons, sort dropdown (Most Recent, Highest Salary, Most Relevant)
- Count of jobs found displayed
What's missing:
- The jobs page uses hardcoded mock data (6 jobs in an array) -- it does NOT connect to the API
- No salary range filter
- No remote-only filter
- No date-posted filter
- No category filter
- The search bar and filter buttons update local state but do not actually query the API
- No job detail page (there is a Link href={/jobs/${job.id}} but no corresponding app/jobs/[id] route exists)
Feature 6: One-Click Apply
Status: FULLY_IMPLEMENTED
What exists:
- Apply API (POST /api/jobs/[id]/apply) -- creates application, increments applicationsCount, creates notification for employer
- Duplicate application check (prevents applying twice)
- ApplyJobModal component with job details view + application form (resume URL + cover letter with min 50 chars)
- Application submission via modal
- Notification on successful application (in-app)
- submit-application handler in profile page that sends email notification to hiring.pathmatch@gmail.com
Minor gap: The job listing page currently submits applications via the modal's local onSubmit handler (console.log + alert) rather than calling the API; the modal itself is wired to call the API in the hiring-workflow feature.
Feature 7: Application Tracking
Status: PARTIALLY_IMPLEMENTED
What exists:
- Applications API (GET /api/applications) -- returns user's applications with job+company info
- Application status management API (PATCH /api/applications/[id]/status) -- valid status transitions: PENDING, REVIEWING, SHORTLISTED, INTERVIEW, OFFERED, HIRED, REJECTED
- Timestamps tracked: appliedAt, reviewedAt, interviewAt, rejectedAt, acceptedAt
- Dashboard "Recent Applications" section showing application cards with status badges
- Interview section in dashboard with join/reschedule buttons
- All database models support the full application lifecycle
What's missing:
- No dedicated "My Applications" page (the dashboard shows only a few recent ones, links to /applications which doesn't exist)
- No application detail view page
- No status transition history/audit trail model
- The dashboard uses mock data for applications, not live API data
Feature 8: Basic Skill-Match Scoring
Status: FULLY_IMPLEMENTED
What exists:
- Candidates API (GET /api/jobs/[id]/candidates) -- returns candidates with matchScore, matchedSkills, totalRequired skills
- Match score algorithm: Math.round((matchedSkills / jobSkillIds.length) * 100)
- Sorting by matchScore (default) or date
- Skills comparison between job required skills and user profile skills via JobRequiredSkill <-> UserSkill relation
- Skill data returned with candidate profiles (profile.skillsRelation with skill names)
- Employer dashboard would use this data via the candidates route
Minor gaps: The frontend hiring-workflow page uses mock data and does not yet consume the live candidates API. The employer dashboard "View Candidates" links to /employer/jobs/[id]/candidates which doesn't exist as a page.
Feature 9: Employer Pipeline Management
Status: PARTIALLY_IMPLEMENTED
What exists:
- Hiring workflow page (/hiring-workflow) with full UI: pipeline view, applications view, stages view, metrics cards, workflow timeline
- Pipeline columns: Applications, Screening, HR Interview, Technical, Offer, Hired -- with drag-and-drop style cards
- Stage cards showing 13 hiring stages from JOB_IDENTIFIED through ONBOARDING
. PRD Feature Mapping
Feature 1: Authentication (email + OAuth) & Role Selection
Status: FULLY_IMPLEMENTED
What exists:
- NextAuth.js with 3 providers: credentials (email/password), Google OAuth, LinkedIn OAuth
- Registration API (/api/auth/register) with password hashing (bcrypt, 12 rounds), validation, and role assignment (isEmployer/isApplicant)
- Login API (/api/auth/login) with credential verification
- Logout API (/api/auth/logout)
- Password reset API (/api/auth/reset-password)
- Role selection page (/onboarding/role-selection) with both Employer and Job Seeker cards
- Role API (/api/users/role) that updates isEmployer/isApplicant
- JWT session with role info persisted
- Middleware that protects dashboard, profile, settings, billing, hiring-workflow routes
- NextAuth type augmentation in src/types/next-auth.d.ts
- LoginForm, RegisterForm, ResetPasswordForm UI components with password strength indicators
- Auth page (/auth) with split-layout design
Minor gaps: The authService.ts feature service has a parallel in-memory implementation (legacy); the actual auth flows bypass it and use NextAuth directly or the API routes directly.
Feature 2: Job Seeker Profile Creation
Status: FULLY_IMPLEMENTED
What exists:
- Profile page (/profile) with tabs: Profile, Resume, English Test
- Profile form with fields: firstName, lastName, email, phone, dateOfBirth, address, city, country, nationality, jobTitle, summary, skills (add/remove), experienceYears, expectedSalary, remoteWork, relocate
- Profile API (/api/users/profile) -- GET and PATCH with upsert
- Profile form component (profile-form.tsx) with zod validation
- Settings page with profile picture upload (Uploadcare integration)
- Dashboard profile completion prompts
- Resume upload UI + API (/api/users/resume) with PDF validation (5MB limit)
Feature 3: Employer Company Profile
Status: FULLY_IMPLEMENTED
What exists:
- Employer profile API (/api/companies/profile) -- GET and PATCH with upsert
- Database model EmployerProfile with companyName, companyLogo, companyWebsite, companySize, industry, description, contactEmail, contactPhone, linkedIn, twitter, city, country, hiringMode, isVerified
- Employer dashboard (/employer/dashboard) prompts user to create company profile if none exists
- Company information integrated into job listings
- Employer profile created via /api/users/role flow when role is EMPLOYER
Feature 4: Job Posting with Skills
Status: FULLY_IMPLEMENTED
What exists:
- Job creation API (POST /api/jobs) -- title, description, requirements, jobType, experienceLevel, workMode, location, city, salaryMin, salaryMax, skills (auto-create skills on-the-fly)
- Skills relation system: Skill, JobRequiredSkill, UserSkill models in Prisma
- Slug auto-generation for jobs
- Job status management (DRAFT, PUBLISHED, CLOSED, ARCHIVED)
- job-management feature module with full CRUD service + hooks + components (JobForm, JobList, JobCard)
- JobFormValues, CreateJobPayload, UpdateJobPayload types
- Employer dashboard tab showing "My Jobs" with status badges
- Link to create job from employer dashboard
Minor gaps: No dedicated PATCH /api/jobs/[id] endpoint (updateJob in service layer calls it but endpoint doesn't exist); no DELETE /api/jobs/[id]. The preferredSkills field is in the schema but not wired in the API.
Feature 5: Job Search / Filtering
Status: PARTIALLY_IMPLEMENTED
What exists:
- Job search API (GET /api/jobs) with keyword search (title + description), location filter, experience level filter, job type filter, work mode filter, pagination (page/limit)
- Skills are returned with each job listing
- Sorting by publishedAt (desc)
- Jobs page UI (/jobs) with search bar, location input, job type filter buttons, experience level filter buttons, sort dropdown (Most Recent, Highest Salary, Most Relevant)
- Count of jobs found displayed
What's missing:
- The jobs page uses hardcoded mock data (6 jobs in an array) -- it does NOT connect to the API
- No salary range filter
- No remote-only filter
- No date-posted filter
- No category filter
- The search bar and filter buttons update local state but do not actually query the API
- No job detail page (there is a Link href={/jobs/${job.id}} but no corresponding app/jobs/[id] route exists)
Feature 6: One-Click Apply
Status: FULLY_IMPLEMENTED
What exists:
- Apply API (POST /api/jobs/[id]/apply) -- creates application, increments applicationsCount, creates notification for employer
- Duplicate application check (prevents applying twice)
- ApplyJobModal component with job details view + application form (resume URL + cover letter with min 50 chars)
- Application submission via modal
- Notification on successful application (in-app)
- submit-application handler in profile page that sends email notification to hiring.pathmatch@gmail.com
Minor gap: The job listing page currently submits applications via the modal's local onSubmit handler (console.log + alert) rather than calling the API; the modal itself is wired to call the API in the hiring-workflow feature.
Feature 7: Application Tracking
Status: PARTIALLY_IMPLEMENTED
What exists:
- Applications API (GET /api/applications) -- returns user's applications with job+company info
- Application status management API (PATCH /api/applications/[id]/status) -- valid status transitions: PENDING, REVIEWING, SHORTLISTED, INTERVIEW, OFFERED, HIRED, REJECTED
- Timestamps tracked: appliedAt, reviewedAt, interviewAt, rejectedAt, acceptedAt
- Dashboard "Recent Applications" section showing application cards with status badges
- Interview section in dashboard with join/reschedule buttons
- All database models support the full application lifecycle
What's missing:
- No dedicated "My Applications" page (the dashboard shows only a few recent ones, links to /applications which doesn't exist)
- No application detail view page
- No status transition history/audit trail model
- The dashboard uses mock data for applications, not live API data
Feature 8: Basic Skill-Match Scoring
Status: FULLY_IMPLEMENTED
What exists:
- Candidates API (GET /api/jobs/[id]/candidates) -- returns candidates with matchScore, matchedSkills, totalRequired skills
- Match score algorithm: Math.round((matchedSkills / jobSkillIds.length) * 100)
- Sorting by matchScore (default) or date
- Skills comparison between job required skills and user profile skills via JobRequiredSkill <-> UserSkill relation
- Skill data returned with candidate profiles (profile.skillsRelation with skill names)
- Employer dashboard would use this data via the candidates route
Minor gaps: The frontend hiring-workflow page uses mock data and does not yet consume the live candidates API. The employer dashboard "View Candidates" links to /employer/jobs/[id]/candidates which doesn't exist as a page.
Feature 9: Employer Pipeline Management
Status: PARTIALLY_IMPLEMENTED
What exists:
- Hiring workflow page (/hiring-workflow) with full UI: pipeline view, applications view, stages view, metrics cards, workflow timeline
- Pipeline columns: Applications, Screening, HR Interview, Technical, Offer, Hired -- with drag-and-drop style cards
- Stage cards showing 13 hiring stages from JOB_IDENTIFIED through ONBOARDING
- WorkflowTimeline component for visualizing application progress
- ApplicationList and ApplicationCard components
- Shortlist API (PATCH /api/applications/[id]/shortlist) -- toggle shortlist via employerNotes marker
- Messaging API (only available at INTERVIEW or OFFERED stage)
What's missing:
- The entire hiring workflow page uses hardcoded mock data (6 mock applications, mock timeline, mock metrics)
- No actual API integration with the candidates/shortlist/status endpoints
- No stage transition buttons wired to the API
- No interview scheduling UI wired to the API (though the schema and service layer support it)
- WorkflowMetrics API (/api/jobs/[id]/metrics) endpoint doesn't exist
- /api/applications?jobId= endpoint doesn't exist (needed for fetching applications by job)
- The useHiringWorkflow hook calls services that call non-existent endpoints
Feature 10: Email Notifications
Status: PARTIALLY_IMPLEMENTED
What exists:
- Email service (src/lib/email.ts) with Resend integration and 5 templates:
- applicationSubmitted -- confirmation to applicant
- statusUpdate -- status change notification
- newMessage -- new message alert
- newApplicant -- alert to employer
- jobExpiring -- reminder to employer
- In-app notification model (Notification) with 9 notification types (APPLICATION_RECEIVED, APPLICATION_SHORTLISTED, APPLICATION_REJECTED, JOB_RECOMMENDED, JOB_EXPIRED, PROFILE_VIEWED, MESSAGE, ENGLISH_TEST_INVITE, INTERVIEW_SCHEDULED)
- Notifications created in API routes:
- Apply endpoint creates APPLICATION_RECEIVED notification for employer
- Status update creates APPLICATION_SHORTLISTED or APPLICATION_REJECTED for applicant
- Messages create MESSAGE notification
- Admin moderation creates JOB_RECOMMENDED notification
What's missing:
- The email templates are defined but never called from any API route -- the sendEmail function exists but no API route imports it
- The profile submit action logs the email to console instead of sending it
- No notification preferences page wired to the API
- No notification center UI (bell icon, dropdown, etc.)
- The NotificationPreference model exists but has no API endpoints
- Resend API key is conditionally checked (if not configured, it silently skips)
- WorkflowTimeline component for visualizing application progress
- ApplicationList and ApplicationCard components
- Shortlist API (PATCH /api/applications/[id]/shortlist) -- toggle shortlist via employerNotes marker
- Messaging API (only available at INTERVIEW or OFFERED stage)
What's missing:
- The entire hiring workflow page uses hardcoded mock data (6 mock applications, mock timeline, mock metrics)
- No actual API integration with the candidates/shortlist/status endpoints
- No stage transition buttons wired to the API
- No interview scheduling UI wired to the API (though the schema and service layer support it)
- WorkflowMetrics API (/api/jobs/[id]/metrics) endpoint doesn't exist
- /api/applications?jobId= endpoint doesn't exist (needed for fetching applications by job)
- The useHiringWorkflow hook calls services that call non-existent endpoints
Feature 10: Email Notifications
Status: PARTIALLY_IMPLEMENTED
What exists:
- Email service (src/lib/email.ts) with Resend integration and 5 templates:
- applicationSubmitted -- confirmation to applicant
- statusUpdate -- status change notification
- newMessage -- new message alert
- newApplicant -- alert to employer
- jobExpiring -- reminder to employer
- In-app notification model (Notification) with 9 notification types (APPLICATION_RECEIVED, APPLICATION_SHORTLISTED, APPLICATION_REJECTED, JOB_RECOMMENDED, JOB_EXPIRED, PROFILE_VIEWED, MESSAGE, ENGLISH_TEST_INVITE, INTERVIEW_SCHEDULED)
- Notifications created in API routes:
- Apply endpoint creates APPLICATION_RECEIVED notification for employer
- Status update creates APPLICATION_SHORTLISTED or APPLICATION_REJECTED for applicant
- Messages create MESSAGE notification
- Admin moderation creates JOB_RECOMMENDED notification
What's missing:
- The email templates are defined but never called from any API route -- the sendEmail function exists but no API route imports it
- The profile submit action logs the email to console instead of sending it
- No notification preferences page wired to the API
- No notification center UI (bell icon, dropdown, etc.)
- The NotificationPreference model exists but has no API endpoints
- Resend API key is conditionally checked (if not configured, it silently skips)
