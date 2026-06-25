Comprehensive Jobs System Analysis
1. JOB CREATION & MANAGEMENT (Employer Side)
1.1 Prisma Schema (Foundation)
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/prisma/schema.prisma
Key models:
- Job (lines 261-325) - Full job posting with status, skills, salary, employer relation
- EmployerProfile (lines 217-255) - Company profile linked to user, has Job[] relation
- JobCategory (lines 327-337) - Categories with self-referential parent/children hierarchy
- JobRequiredSkill (lines 686-695) - Many-to-many join table for jobs <-> skills
- SavedJob (lines 409-418) - User saved jobs with unique constraint on [userId, jobId]
Job <-> Company relationship:
EmployerProfile (userId) --< Job (employerId)
- Job.employerId references EmployerProfile.userId (which is User.clerkId)
- EmployerProfile has jobs Job[] relation
- EmployerProfile.userId is unique (one profile per user)
- EmployerProfile also has isVerified, hiringMode, companySize fields
1.2 Job Creation Flow
UI (Next.js create job page):
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/app/(main)/(pages)/jobs/create/page.tsx
- Form with title, description, requirements, benefits, jobType, experienceLevel, workMode, location, city, salaryMin, salaryMax, skills (via MultipleSelector component)
- Posts to POST /api/jobs?email=${email}
- Redirects to /employer/dashboard on success
- No DRAFT support in UI - jobs are immediately PUBLISHED
API Route:
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/app/api/jobs/route.ts
- POST (lines 306-389): Creates job, immediately sets status: "PUBLISHED", generates slug from title + timestamp, requires employerProfile, adds skills via JobRequiredSkill join table
- GET (lines 145-303): Lists/search jobs with filtering by search, location, experience, jobType, workMode, sort; auto-closes jobs older than 30 days; includes fallback from JSON file and remote jobs from Jobicy
Validation: Only title, description, jobType, experienceLevel, workMode are required. Missing: benefits, salaryCurrency, salaryPeriod, isSalaryVisible in form.
1.3 Job Edit/Close/Delete
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/app/api/jobs/[slug]/route.ts
- GET (lines 7-80): Fetches single job by ID or slug, includes employer profile, required skills, category
- PATCH (lines 82-164): Updates job fields, handles status transitions (PUBLISHED/CLOSED sets timestamps), replaces skills entirely
- DELETE (lines 166-203): Deletes job, verifies ownership
IMPORTANT: The route param is named slug but is actually used as both numeric ID and slug. When PATCH/DELETE are called, parseInt(params.slug) is used, meaning only numeric IDs work for mutations. This is a bug.
1.4 Employer Dashboard (Viewing Own Jobs)
Next.js page:
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/app/(main)/employer/dashboard/page.tsx
- Fetches GET /api/companies/jobs for employer's jobs
- Fetches GET /api/companies/profile for company profile
- Shows stats (active jobs, total applicants, hired this month - hardcoded to 0)
- Shows jobs list with "View Candidates" and "View Post" links
- Shows company profile creation prompt if no company exists
React SPA page:
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/client/src/pages/EmployerDashboard.tsx
- Same functionality using useCompanyJobs, useCompanyProfile hooks
API Route for company jobs:
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/app/api/companies/jobs/route.ts
- Simple GET returning all jobs by employerId
1.5 Company Profile (Required for Job Creation)
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/app/api/companies/profile/route.ts
- GET: Returns employerProfile for current user
- PATCH: Upserts employerProfile - requires companyName, industry, size
UI:
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/app/(main)/employer/company/page.tsx
- Form with companyName, website, size, industry, description, contactEmail, phone, city, country, LinkedIn, Twitter, hiringMode
- PATCH to /api/companies/profile on submit
1.6 Missing Pieces (Job Management)
- No DRAFT workflow: Jobs are immediately PUBLISHED upon creation. The DRAFT status exists in the enum but is never used.
- No job editing UI: The PATCH API exists but there is no employer-facing edit job page/form.
- No close/reopen job UI: The API supports status transitions to CLOSED but there's no UI for it.
- Admin moderation: /api/admin/jobs/route.ts exists but role checking is TODO.
- Slug/ID confusion: In jobs/[slug]/route.ts, the PATCH and DELETE handlers parse params.slug with parseInt() - only numeric IDs work.
- Job expiry: Auto-close logic exists in GET handler but no notification/cron for expiring jobs (email template jobExpiring exists but is not wired).
- Job metrics view: /api/jobs/[slug]/metrics route exists but is only used in the hiring workflow, not in a dedicated employer analytics view.
2. JOB APPLICATION FLOW (Candidate Side)
2.1 Prisma Schema
Model JobApplication (lines 343-378):
- Links User + Job
- Status field with ApplicationStatus enum: PENDING, REVIEWING, SHORTLISTED, INTERVIEW, OFFERED, HIRED, REJECTED, WITHDRAWN
- Timeline timestamps: appliedAt, reviewedAt, interviewAt, rejectedAt, acceptedAt
- Has optional Interview relation (one-to-one)
Model Interview (lines 380-403):
- Unique on applicationId (one interview per application)
- Fields: scheduledAt, duration, type, meetingLink, location, status, completed, notes, feedback, rating
2.2 How Candidates Apply
UI (Job detail page):
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/app/(main)/(pages)/jobs/[slug]/page.tsx
- "Apply Now" button opens ApplyJobModal
ApplyJobModal:
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/components/forms/ApplyJobModal.tsx
- Two-step: Shows job details first, then application form
- Fields: Resume upload (via UploadThing), cover letter (max 500 chars)
- Posts to POST /api/jobs/${slug}/apply
Jobs list page:
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/app/(main)/(pages)/jobs/page.tsx
- Each job card has "Apply Now" button that opens same modal
- Also has SaveJobButton component
API Route:
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/app/api/jobs/[slug]/apply/route.ts
- Checks for existing application (duplicate prevention)
- Creates JobApplication with PENDING status
- Increments Job.applicationsCount
- Creates notification for employer (APPLICATION_RECEIVED)
- Sends email to applicant + employer
- Returns application with job + user info
2.3 Application Statuses
Enum values and transitions (defined in schema and UI):
PENDING → REVIEWING → SHORTLISTED → INTERVIEW → OFFERED → HIRED
                                                              ↘ REJECTED (from any active state)
                                                                       ↘ WITHDRAWN (by candidate)
ApplicationCard component (in hiring workflow) has specific action buttons per status:
- PENDING → "Start Review" (→ REVIEWING)
- REVIEWING → "Shortlist" (→ SHORTLISTED) or "Reject" (→ REJECTED)
- SHORTLISTED → "Schedule Interview" (→ INTERVIEW)
- INTERVIEW → "Extend Offer" (→ OFFERED)
- OFFERED → "Confirm Hire" (→ HIRED)
HiringWorkflowPage has "Advance Stage" button with map:
- PENDING→REVIEWING→SHORTLISTED→INTERVIEW→OFFERED→HIRED
2.4 Viewing Applications by Candidates
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/app/(main)/(pages)/applications/page.tsx
- Lists user's applications with status badges
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/app/(main)/(pages)/applications/[id]/page.tsx
- Shows full application detail with cover letter, employer notes, interview info
API:
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/app/api/applications/route.ts
- GET: Returns applications - for job seekers returns own, for employers returns applications on their jobs
- Supports filtering by status and jobId
2.5 Saved Jobs
API: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/app/api/users/saved-jobs/route.ts
- GET/POST/DELETE with 100-job limit
- Uses SaveJobButton component in job listing and detail pages
2.6 Missing Pieces (Application Flow)
- No withdraw functionality: The WITHDRAWN status exists but there's no UI for candidates to withdraw applications.
- No candidate-side application editing: Once submitted, applications cannot be updated.
- Resume URL persistence: The resumeUrl is stored on the application but not automatically populated from the user's uploaded resume.
- E-mail notification failures: Email sending uses Promise.allSettled (silent failures), which could mask issues.
- No bulk application actions: Employers cannot batch-update application statuses.
3. HIRING WORKFLOW
3.1 Review Pipeline
Hiring Workflow Page (Next.js):
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/app/(main)/(pages)/hiring-workflow/page.tsx
Hiring Workflow Page (React SPA):
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/client/src/pages/HiringWorkflow.tsx
Both implement:
- Job selector dropdown (fetches from /api/companies/jobs)
- Metrics cards (total, in review, interviewing, hired)
- Three tabs: Pipeline, Applications, Stages
- Pipeline view: Kanban-style columns for each status (PENDING→REVIEWING→SHORTLISTED→INTERVIEW→OFFERED→HIRED)
- Application detail modal with "Advance Stage", "Shortlist", "Reject", "Add Notes" buttons
- Shortlist toggle using employerNotes text field hack (SHORTLISTED:true marker)
Application modal "Advance Stage" logic (hardcoded progression):
PENDING → REVIEWING → SHORTLISTED → INTERVIEW → OFFERED → HIRED
3.2 Status Transition API
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/app/api/applications/[id]/status/route.ts
- PATCH to update status with valid status list check
- Sets timestamps: reviewedAt, interviewAt, acceptedAt, rejectedAt based on status
- Creates notification for applicant
- Sends email notification (checks notification preferences)
3.3 Shortlist API
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/app/api/applications/[id]/shortlist/route.ts
- PATCH to toggle shortlist status
- HACK: Uses employerNotes field as a string with SHORTLISTED:true marker
- This is fragile - overwriting employer notes could break the shortlist marker
3.4 Interview Scheduling
Create interview API:
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/app/api/applications/[id]/interviews/route.ts
- POST to create interview (one per application - unique constraint)
- Required: scheduledAt, type; Optional: duration, meetingLink, location
- Validates employer ownership
Update interview API:
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/app/api/interviews/[id]/route.ts
- PATCH to update interview status, notes, feedback, rating, reschedule
UI: Interview scheduling is only available via API. There is no interview scheduling form/UI in the frontend.
3.5 Candidates View (Employer)
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/app/(main)/employer/jobs/[id]/candidates/page.tsx
- Fetches GET /api/jobs/${id}/candidates
- Shows candidate cards with name, title, status badge, match score, skill match progress bar
- Links to email and "Review" button (review goes to hiring workflow - no link)
Employer candidates API:
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/app/api/jobs/[slug]/candidates/route.ts
- Returns candidates with match scores (skill-based)
- Calculates matchScore as percentage of job-required skills matched by applicant
- Sorts by matchScore (default) or date
3.6 Hiring Workflow Feature (src/features/hiring-workflow/)
Hooks:
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/features/hiring-workflow/hooks/useHiringWorkflow.ts
- useHiringWorkflow: Manages applications list, current application, timeline, transitions
- useApplicationTimeline: Generates timeline entries from application status
- transitionStage: Calls API, updates local state, regenerates timeline
Services:
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/features/hiring-workflow/services/hiringService.ts
- generateApplicationTimeline: Maps application status to 13-stage hiring pipeline
- STAGE_CONFIG: Defines all stages from JOB_IDENTIFIED to ONBOARDING with names, descriptions, orders
- updateApplicationStatus, submitApplication, scheduleInterview, etc.
Components:
- ApplicationCard.tsx: Status-specific card with actions per status
- ApplicationList.tsx: Filterable, searchable grid/list of ApplicationCards
- StageCard.tsx: Visual stage indicator with progress status
3.7 Missing Pieces (Hiring Workflow)
- No interview scheduling UI: The API for creating interviews exists but there is no frontend form. The "Schedule Interview" button in ApplicationCard just transitions status to INTERVIEW.
- Notes feature is broken: "Add Notes" button uses prompt() and logs to console, never actually saves notes.
- Shortlist stored in employerNotes: This is a fragile hack that could corrupt notes.
- Metrics page is separate: metrics endpoint returns data but it's only displayed in the hiring workflow page.
- No background check or offer letter features: These stages exist in the workflow definition but have no corresponding API or UI.
- Conversion rates are not calculated dynamically: The metrics cards show "+0%" hardcoded.
- Pipeline status mapping is duplicated: The status→stage mapping exists in multiple places (hiringService.ts, ApplicationCard.tsx, HiringWorkflowPage.tsx) - maintenance risk.
- Candidate "Review" button does nothing meaningful: In candidates/page.tsx, the "Review" button has no onClick handler.
4. MESSAGING SYSTEM
4.1 Prisma Schema
Model Message (lines 701-713):
- senderId → User.clerkId (relation "SentMessages")
- receiverId → User.clerkId (relation "ReceivedMessages")
- content (text)
- jobId (optional, references Job.id)
- readAt (nullable timestamp)
No Conversation/Thread model: Messages are simple 1:1 relationships grouped by participant pairs in the UI.
4.2 API Routes
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/app/api/messages/route.ts
- GET (lines 8-57): Returns all messages for current user (sent OR received), optionally filtered by jobId. Orders by createdAt ASC.
- POST (lines 60-144): Sends a message. IMPORTANT RESTRICTION: If a jobId is provided, messaging is only allowed when the candidate's application status is INTERVIEW or OFFERED. This enforces that employers can only message candidates who have reached interview stage.
- Creates notification for receiver (MESSAGE type)
- Sends email notification (checks newMessages preference)
No conversation grouping in API: The API returns flat messages. The React SPA client groups them into conversations client-side (in useConversations hook). The Next.js client groups them in MessagesPage component.
4.3 Client-side Conversation Grouping
React SPA hook:
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/client/src/lib/api-hooks.ts (lines 157-211, useConversations)
- Groups messages by other participant's ID
- Creates Conversation objects with participant info, last message, unread count
- Sorts by most recent message
Next.js MessagesPage:
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/app/(main)/(pages)/messages/page.tsx
- Same grouping logic via groupConversations() function
- Groups by jobId + otherParty.id key
- Polls every 30 seconds for new messages
- Shows conversation list and chat area with send functionality
4.4 Missing Pieces (Messaging)
- No real-time messaging: The 30-second polling interval is the only update mechanism. No WebSocket/SSE.
- No message read receipts: readAt is stored but never displayed or updated on read.
- No message threading/replies: All messages are flat.
- No file/image sharing in messages: Text only.
- Conversation grouping is client-side only: The API returns flat messages; grouping is done in the browser. This means conversations aren't persisted server-side.
- No notification when messages are read.
- No block/report messaging feature.
- Only employers can initiate: Candidates cannot initiate messages; the API enforces INTERVIEW/OFFERED status for job-linked messages.
5. COMPANY SYSTEM
5.1 Prisma Schema
Model EmployerProfile (lines 217-255):
- One-to-one with User via userId (unique, references User.clerkId)
- Fields: companyName, companyLogo, companyWebsite, companySize, industry, description, contactEmail, contactPhone, address, city, country, linkedIn, twitter, isVerified, verifiedAt, hiringMode
- Has jobs Job[] relation
5.2 Company Profile Management
API:
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/app/api/companies/profile/route.ts
- GET: Returns employer profile for authenticated user
- PATCH: Upserts profile (create if not exists, update if exists). Requires: companyName, industry, size (CompanySize enum)
UI (Next.js):
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/app/(main)/employer/company/page.tsx
- Full form with all EmployerProfile fields
- Saves via fetch to /api/companies/profile
- Redirects to employer dashboard on save
UI (React SPA):
File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/client/src/pages/CompanyProfile.tsx
5.3 How Companies Link to Jobs
User (clerkId) → EmployerProfile (userId) → Job[] (employerId)
- Job.employerId references EmployerProfile.userId (which IS User.clerkId - this is an unusual pattern, usually it would reference a numeric ID)
- When creating a job, the API looks up user.employerProfile and uses user.clerkId as employerId
- The candidates API and metrics API use Job.employerId to verify employer authorization
5.4 How Companies Link to Employers/Users
User (clerkId) ←→ EmployerProfile (userId) [one-to-one]
User (clerkId) → JobApplication.userId
User.clerkId ← Account.userId [for OAuth]
- Each User can have at most one EmployerProfile
- User.isEmployer boolean flag determines role
- The EmployerProfile uses User.clerkId as its foreign key (not the auto-increment User.id)
5.5 Missing Pieces (Company System)
- No company search/discovery: There is no public company profile page or company directory.
- No company logo upload UI: The companyLogo field exists but there's no upload UI in the company profile form.
- No multi-employer per company: Each employer has their own company profile. There's no concept of multiple users belonging to the same company.
- No company verification workflow: isVerified exists but there's no admin workflow to verify companies.
- EmployerProfile foreign key uses clerkId: The relation Job.employerId references EmployerProfile.userId, which is the clerkId string. This is inconsistent with most other relations that reference auto-increment IDs.
ARCHITECTURAL OBSERVATIONS & CROSS-CUTTING ISSUES
Dual App Architecture
There are two separate frontend applications:
1. Next.js app (src/) - Main application with App Router, uses next-auth
2. React SPA (client/) - Built with Vite, uses custom auth provider
Both have duplicate hiring workflow features (src/features/hiring-workflow/ and client/src/features/hiring-workflow/). The Next.js app is the production app; the React SPA appears to be a legacy or experimental frontend.
Authentication Pattern
- Almost every API route supports an ?email= query parameter for auth bypass
- Falls back to getServerSession(authOptions) 
- This dual auth mechanism is potentially insecure (email in query params)
- Session/clerkId confusion: User.id is auto-increment, User.clerkId is the string identifier used for relations, but some places use User.id (number) while others use clerkId (string)
Email Notification System
- File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/lib/email.ts
- Uses Resend, checks NotificationPreference before sending
- Templates: applicationSubmitted, statusUpdate, newMessage, newApplicant, jobExpiring (unused)
- All sending is fire-and-forget (Promise.allSettled)
Remote Jobs Integration
- File: /home/n0ccx/Documents/Projects/transit/race/loft_commmunity/src/app/api/jobs/remote/route.ts
- Fetches from Jobicy API with caching
- Jobs are merged into local job listings in the GET /api/jobs handler
- Remote jobs are not stored in the local DB - they're displayed as external listings
File Structure Summary
Area	API Routes	UI Pages (Next.js)	UI Pages (React SPA)	Components
Jobs	api/jobs/* (5 routes)	(pages)/jobs/* (3 pages)	CreateJob.tsx, BrowseJobs.tsx, JobDetail.tsx	ApplyJobModal.tsx, SaveJobButton
Applications	api/applications/* (4 routes)	(pages)/applications/* (2 pages)	Applications.tsx, ApplicationDetail.tsx	-
Hiring Workflow	api/applications/[id]/*	(pages)/hiring-workflow/	HiringWorkflow.tsx	ApplicationCard, ApplicationList, StageCard
Messages	api/messages/*	(pages)/messages/	Messages.tsx	-
Companies	api/companies/* (2 routes)	employer/company/	CompanyProfile.tsx	-
Employer Dashboard	api/companies/jobs (used by UI)	employer/dashboard/	EmployerDashboard.tsx	-
Interviews	api/interviews/[id]	-	-	-
Candidates	api/jobs/[slug]/candidates	`	 	 
