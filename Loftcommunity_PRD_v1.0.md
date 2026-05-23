LoftCommunity
Product Requirements Document
MVP Release | Employment & Hiring Platform
Version 1.0 | May 2026
1. Overview and Problem Statement
Table
Field	Details
Product Name	LoftCommunity
Product Focus	Employment & Hiring Platform (MVP)
Vision Statement	A world where finding the right job or the right talent is as simple as a single conversation.
Mission Statement	To connect ambitious professionals with opportunity-rich employers through transparent, skill-first matching — eliminating the noise of traditional hiring.
Problem Statement	Job seekers spend hours applying to roles with no feedback, while employers drown in unqualified resumes. Existing platforms prioritize volume over fit, creating a broken experience on both sides.
Opportunity	LoftCommunity shifts the focus from "spray and pray" applications to intentional, skill-matched connections — giving job seekers clarity on their application status and employers pre-qualified, ranked candidates from day one.
Owner	[Your Team Name]
2. Goals and Success Metrics
Table
Goal Type	Description	Priority
Primary Goal	Enable job seekers to create skill-rich profiles and apply to relevant roles with transparent application tracking.	MVP
Primary Goal	Enable employers to post jobs, review ranked candidate matches, and manage hiring pipelines efficiently.	MVP
Secondary Goal	Deliver real-time application status updates and communication tools to reduce ghosting on both sides.	MVP
North Star Metric	Successful Hire Rate (SHR) — % of posted roles filled within 30 days via the platform.	MVP
North Star Metric	Weekly Active Job Seekers (WAJS) — unique seekers with profile views or applications per week.	MVP
Core Success Metric	30-Day Job Seeker Retention Rate	MVP
Core Success Metric	Employer Job Post-to-Fill Ratio	Post-MVP
Additional Metric	Average Time-to-First-Interview (from application)	Post-MVP
Additional Metric	Profile Completion Rate	MVP
Additional Metric	Application Response Rate (employer reply within 48h)	Post-MVP
3. Users and User Personas
Primary User A: Job Seeker
Table
Category	Details
Persona Name	Adaobi Nwosu
Age	26 Years Old
Occupation	Junior Product Designer
Experience	2 Years
Core Behaviour	Applies to 15-20 roles weekly, rarely hears back, struggles to stand out with just a resume.
Frustrations	No feedback on applications, generic job recommendations, resume black holes, lack of transparency.
Needs	Skill-based profile visibility, application status tracking, direct employer communication, relevant job matching.
Quote	"I send out applications and they just disappear. I have no idea if anyone even saw my portfolio."
Primary User B: Employer / Hiring Manager
Table
Category	Details
Persona Name	Emeka Okafor
Age	34 Years Old
Occupation	CTO at a Seed-Stage Startup
Team Size	12 People
Core Behaviour	Posts roles on multiple platforms, receives 200+ unfiltered resumes, spends 10+ hours screening per role.
Frustrations	Unqualified applicants, no ranking system, scattered communication across email/LinkedIn/Slack, slow time-to-hire.
Needs	Pre-ranked candidate shortlists, in-app messaging, pipeline stage management, easy job posting with skill requirements.
Quote	"I need to hire fast but I can't afford to spend a week sorting through CVs. I need the top 10 candidates, not 200."
4. Scope
4.1 In Scope (MVP)
Table
Feature Area	Details
Authentication	Email/password sign-up, OAuth (Google, LinkedIn), role selection (Job Seeker vs Employer), email verification.
Job Seeker Profile	Skills tags (predefined + custom), work experience, education, portfolio links, resume upload (PDF), bio/summary, availability status.
Employer Profile & Company Page	Company name, logo, description, industry, size, website, location. Basic company page visible to seekers.
Job Posting (Employer)	Title, description, required skills, experience level, location (remote/hybrid/onsite), salary range (optional), job type (full-time, contract, internship), application deadline.
Job Discovery & Search (Seeker)	Keyword search, skill-based filtering, location filter, experience level filter, remote toggle, saved jobs, job cards with key info.
Application System	One-click apply with profile, cover letter (optional), application status tracking (Applied → Under Review → Interview → Offer → Rejected).
Matching & Ranking (Basic)	Keyword + skill overlap scoring for employer candidate lists. No AI — simple rule-based matching for MVP.
Employer Dashboard	Active job posts, applicant counts per role, candidate list with match score, pipeline stage management, shortlist/reject actions.
Messaging (Basic)	In-app messaging triggered when employer moves candidate to "Interview" stage. Email notifications for new messages.
Notifications	Application submitted confirmation, status change alerts, new applicant alerts (employer), message notifications, job expiry warnings. Email-first; in-app badge counts.
Admin Panel	User management, job post moderation (approve/reject/flag), reported content review, platform analytics overview.
Help & Support	FAQ section, contact support form, chatbot placeholder (static responses for MVP).
4.2 Out of Scope
Table
Out of Scope Item	Reason
AI-Powered Resume Parsing	Requires ML model training and NLP pipeline. Use manual upload + structured fields for MVP.
Video Profiles / Interviews	Complex media handling and WebRTC integration. Deferred to post-MVP.
Advanced Analytics & Reporting	Requires data warehouse and BI tooling. Basic counts only for MVP.
Referral System	Multi-user incentive logic. Post-MVP growth feature.
Subscription / Payment Plans	Payment gateway integration and billing infrastructure. Free tier only for MVP launch.
Mobile Native Apps	iOS/Android builds extend timeline by 4+ weeks. Responsive web-first for MVP.
ATS Integrations	API integrations with external HR tools (Greenhouse, Lever). Post-MVP.
Background Checks	Third-party verification services and compliance. Post-MVP.
Salary Insights & Benchmarking	Requires aggregate data and market research. Post-MVP.
5. Functional Requirements
Table
ID	Requirement Description	Priority
FR1	Users must select a role (Job Seeker or Employer) during sign-up and cannot change it without admin intervention.	Must Have
FR2	Job seekers must create a profile with at least name, email, skills, and experience level before applying to jobs.	Must Have
FR3	Employers must complete company profile (name, industry, location) before posting a job.	Must Have
FR4	Employers must be able to create, edit, pause, and close job posts. Closed posts stop accepting applications.	Must Have
FR5	Job seekers must be able to search and filter jobs by keyword, skill, location, and experience level.	Must Have
FR6	Job seekers must be able to apply to jobs using their profile with optional cover letter.	Must Have
FR7	Employers must see a ranked list of applicants per job post based on skill overlap with job requirements.	Must Have
FR8	Employers must be able to move applicants through pipeline stages: Applied → Under Review → Interview → Offer → Hired/Rejected.	Must Have
FR9	Messaging must unlock between employer and applicant only when applicant reaches "Interview" stage.	Must Have
FR10	Both user types must receive email notifications for critical events (application status change, new message, new applicant).	Must Have
FR11	Job seekers must be able to save jobs and view their saved list.	Must Have
FR12	Job seekers must see a dashboard of their applications with current status and history.	Must Have
FR13	Employers must be able to shortlist (star) candidates for quick access.	Should Have
FR14	Admin must be able to moderate job posts (flag inappropriate content, approve/reject).	Should Have
FR15	Users must be able to export their application history as PDF.	Should Have
FR16	Job posts must auto-expire after 30 days unless renewed by employer.	Should Have
FR17	Platform must show basic analytics: total users, active jobs, applications per week.	Could Have
FR18	Users should be able to report inappropriate job posts or messages.	Could Have
6. Non-Functional Requirements
Table
Category	Requirement
Performance	Page load under 2 seconds for job search and profile pages. Dashboard loads under 3 seconds.
Reliability	99.5% uptime target. Database backups daily. Zero-downtime deployments via rolling updates.
Security	Passwords hashed with bcrypt (salt rounds ≥ 12). JWT tokens with 24h expiry. HTTPS enforced. Rate limiting on auth endpoints (5 attempts/minute).
Data Protection	GDPR-compliant data deletion requests. Resume files stored encrypted at rest. No PII in logs.
Usability	Mobile-responsive design (320px+). WCAG 2.1 AA accessibility standard. Clear empty states and loading skeletons.
Scalability	Architecture supports 10,000 concurrent users without degradation. Horizontal scaling ready.
SEO	Public job posts must be server-side rendered (SSR) or pre-rendered for search engine indexing.
7. Epics and User Stories
EP-01: Authentication & Onboarding
Enable secure, role-based access. Business value: trusted platform entry with clear user segmentation.
Table
Story ID	User Story	Acceptance Criteria
US-01.1	As a new user, I want to sign up with email/password or OAuth so I can join quickly.	Email validation, password strength indicator (min 8 chars, 1 uppercase, 1 number), OAuth redirects handled. Duplicate emails rejected.
US-01.2	As a new user, I want to select my role (Job Seeker or Employer) during sign-up so the platform tailors my experience.	Role selection screen post-verification. Choice is persisted and determines dashboard type. Cannot be changed without support request.
US-01.3	As a user, I want to verify my email so my account is secure and functional.	Verification email sent within 30 seconds. Link expires in 24 hours. Unverified users cannot post jobs or apply.
US-01.4	As a returning user, I want to log in with my credentials so I can access my dashboard.	JWT token issued, stored in httpOnly cookie. Session persists 7 days. "Remember me" extends to 30 days.
US-01.5	As a user, I want to reset my password if I forget it so I can regain access.	Reset link sent to verified email. Link expires in 1 hour. Old password invalidated upon reset.
EP-02: Job Seeker Profile & Discovery
Enable seekers to showcase skills and find relevant roles. Business value: quality candidate supply.
Table
Story ID	User Story	Acceptance Criteria
US-02.1	As a job seeker, I want to create a profile with my skills, experience, and portfolio so employers can discover me.	Profile completion percentage shown. Required: name, email, at least 3 skills, experience level. Optional: bio, portfolio URL, resume PDF (max 5MB).
US-02.2	As a job seeker, I want to add custom skills not in the predefined list so my profile is accurate.	Typeahead with predefined skills. "Add custom" option creates a new skill tag. Custom skills are searchable by employers.
US-02.3	As a job seeker, I want to search and filter jobs so I can find roles matching my criteria.	Search by keyword (title, company, skill). Filters: location (remote/onsite/hybrid + city), experience level, job type, salary range. Results update without full page reload.
US-02.4	As a job seeker, I want to save jobs for later so I can apply when ready.	Save/unsave toggle on job card. Saved jobs list accessible from dashboard. Max 100 saved jobs.
US-02.5	As a job seeker, I want to apply to a job using my profile so the process is fast and consistent.	One-click apply using current profile. Optional cover letter (max 500 chars). Confirmation email sent. Application appears in dashboard immediately.
US-02.6	As a job seeker, I want to track my application status so I know where I stand.	Dashboard shows all applications with current stage and last updated date. Status changes trigger email notification.
EP-03: Employer Job Posting & Candidate Management
Enable employers to attract and evaluate talent efficiently. Business value: paid customer acquisition pipeline.
Table
Story ID	User Story	Acceptance Criteria
US-03.1	As an employer, I want to create a company profile so seekers know who we are.	Required: company name, industry (dropdown), size (dropdown), location. Optional: logo (max 2MB), description (max 500 chars), website URL.
US-03.2	As an employer, I want to post a job with skill requirements so the right candidates apply.	Required: title, description, required skills (min 1), experience level, location type. Optional: salary range, application deadline. Preview before publish.
US-03.3	As an employer, I want to see applicants ranked by skill match so I can focus on the best fits.	Match score calculated as: (seeker skills ∩ job skills) / (job skills) × 100. Displayed as percentage. Sortable by match score or application date.
US-03.4	As an employer, I want to move candidates through hiring stages so my pipeline is organized.	Drag-and-drop or dropdown stage change: Applied → Under Review → Interview → Offer → Hired/Rejected. Stage change triggers email to candidate. Rejected candidates can be archived.
US-03.5	As an employer, I want to shortlist standout candidates so I can compare them later.	Star/unstar toggle per candidate. Filter view to "Shortlisted only." Shortlist persists until job is closed.
US-03.6	As an employer, I want to close or pause a job post so I control when applications stop.	Pause: hidden from search but applications preserved. Close: visible as closed, no new applications. Reopen option available. Auto-close after 30 days with email warning 3 days prior.
EP-04: Communication & Notifications
Reduce ghosting and keep both parties informed. Business value: engagement and trust.
Table
Story ID	User Story	Acceptance Criteria
US-04.1	As an employer, I want to message candidates who reach interview stage so we can coordinate.	Messaging UI unlocks when candidate hits "Interview." Real-time message list with timestamps. Email notification for new unread messages.
US-04.2	As a job seeker, I want to receive email notifications when my application status changes so I'm not left waiting.	Email sent within 5 minutes of stage change. Includes job title, company name, new status, and link to dashboard.
US-04.3	As an employer, I want to be notified when a new applicant applies so I can review promptly.	Daily digest email of new applicants per active job. Real-time option available in notification settings.
US-04.4	As a user, I want to manage my notification preferences so I control what I receive.	Toggle switches for: application updates, new messages, job alerts, marketing. All on by default.
EP-05: Admin & Platform Governance
Ensure platform quality and operational visibility. Business value: trust and safety.
Table
Story ID	User Story	Acceptance Criteria
US-05.1	As an admin, I want to review and moderate job posts so inappropriate content is removed.	Job post list with status: Pending/Approved/Flagged/Rejected. Flagged posts highlighted. Approve/reject actions with optional reason note.
US-05.2	As an admin, I want to view platform analytics so I understand growth and health.	Dashboard cards: total users (split by role), active jobs, applications this week, hire rate. Updated hourly.
US-05.3	As an admin, I want to manage user accounts so I can handle abuse or support requests.	User list with search. Actions: suspend, delete, reset password. Suspended users cannot log in.
8. Dependencies
Table
Dependency	Description	Owner
Email Service	SendGrid/Resend for transactional emails (verification, notifications, digests).	Engineering
File Storage	AWS S3 or Cloudflare R2 for resume and logo uploads with CDN delivery.	Engineering
Database	PostgreSQL for relational data + Redis for sessions/caching.	Engineering
Search Engine	PostgreSQL full-text search for MVP (Algolia/Elasticsearch post-MVP).	Engineering
Auth Provider	Custom JWT + OAuth 2.0 (Google, LinkedIn) via Passport.js or similar.	Engineering
Deployment	Vercel/Netlify (frontend) + Railway/Render (backend) + PostgreSQL managed instance.	DevOps
9. Risks and Mitigations
Table
Risk	Impact	Mitigation
Low initial job volume creates empty marketplace	High — seekers leave if no jobs	Seed initial jobs via manual outreach to 20 target employers pre-launch. Allow employers to post for free during MVP.
Employers receive few qualified applicants	High — employers abandon platform	Emphasize skill-matching in marketing. Target niche communities (tech, design) for initial user base.
3-4 week timeline forces technical debt	Medium — scaling issues later	Document all shortcuts. Schedule "debt sprint" week 5. Use battle-tested frameworks (Next.js, Prisma, tRPC).
Resume upload security vulnerabilities	High — data breach risk	Validate file types (PDF only), scan with ClamAV, store outside web root, encrypt at rest.
Spam/fake job posts damage trust	Medium — platform reputation	Admin moderation queue for first 100 posts. Report button on every job. Auto-flag posts with suspicious keywords.
SEO discoverability low at launch	Medium — organic growth stalled	SSR all public job posts. Generate sitemap.xml. Basic meta tags and structured data (JobPosting schema).
10. Assumptions
Table
Assumption	Impact on Product
Users have LinkedIn or Google accounts for OAuth	Reduces friction vs email-only sign-up. Fallback email flow always available.
Job seekers are willing to invest 10-15 minutes in profile creation	Profile quality directly impacts match scoring. Gamify completion with progress bar.
Employers prefer free posting during early stage	No payment infrastructure needed for MVP. Monetization (featured posts, subscriptions) post-MVP.
Skill-based matching is more valuable than experience-based alone	Drives product differentiation. Validated by user research on both sides.
Target market has reliable internet and modern browsers	Supports responsive web-first approach. No native app needed for MVP.
11. Open Questions
Table
Question	Owner	Deadline
Should we allow job seekers to upload multiple resumes for different role types?	PM + Design	Before Sprint 1
What is the exact skill taxonomy for predefined tags?	PM + Data Team	Before Sprint 1
Should employers see candidate contact info before interview stage?	PM + Legal	Before Sprint 1
Do we need NDA or terms of service for employer data access?	Legal	Before Sprint 1
Which OAuth providers beyond Google/LinkedIn are essential for MVP?	PM + Engineering	Before Sprint 1
What is the fallback if email deliverability (SendGrid) has issues?	Engineering	Before Sprint 2
12. Prioritization Framework (MoSCoW)
Table
Priority	Features
Must Have	Authentication (email + OAuth), role selection, job seeker profile creation, employer company profile, job posting with skills, job search/filtering, one-click apply, application tracking, basic skill-match scoring, employer pipeline management, email notifications, admin moderation, responsive design.
Should Have	Saved jobs, shortlist candidates, job expiry auto-close, application export PDF, notification preferences, SEO optimization (SSR), password reset.
Could Have	In-app messaging (real-time), platform analytics dashboard, custom skill creation, report content, job post preview.
Will Not Have (MVP)	AI resume parsing, video profiles/interviews, native mobile apps, payment/subscriptions, ATS integrations, referral system, background checks, salary benchmarking, advanced analytics, video messaging, calendar scheduling.
Rationale: The MoSCoW framework ensures LoftCommunity delivers a functional two-sided marketplace in 3-4 weeks. Features requiring ML pipelines, native mobile APIs, payment infrastructure, or third-party integrations are deferred to post-MVP. The focus is on profile quality, transparent matching, and pipeline management — the core value exchange between seekers and employers.
13. Technical Architecture Notes (MVP)
Table
Layer	Stack Recommendation	Rationale
Frontend	Next.js 14 (App Router) + Tailwind CSS + shadcn/ui	SSR for SEO, rapid UI development, TypeScript safety.
Backend	Next.js API Routes or tRPC + Prisma ORM	Full-stack TypeScript, end-to-end type safety, rapid development.
Database	PostgreSQL 15 (Neon/Supabase)	Relational data fits job/applicant models. JSONB for flexible skill storage.
Auth	NextAuth.js (OAuth + Credentials)	Battle-tested, supports Google/LinkedIn OAuth out of the box.
File Storage	Supabase Storage or AWS S3	Resume/logo uploads with signed URLs.
Email	Resend or SendGrid	Transactional email API with templates.
Hosting	Vercel (frontend) + Railway/Render (backend/DB)	Zero-config deployments, automatic previews, scales to thousands of users.
Monitoring	Vercel Analytics + LogRocket (free tier)	Basic performance and error tracking for MVP.
14. Post-MVP Enhancement Roadmap
Table
Enhancement	Description	Target Quarter
AI Resume Parsing	Auto-extract skills and experience from uploaded resumes.	Q3 2026
Smart Matching Engine	ML-based candidate ranking beyond keyword overlap.	Q3 2026
Video Profiles	60-second video introductions for seekers.	Q4 2026
Subscription Tiers	Free, Pro (featured posts), Enterprise (ATS integration).	Q4 2026
Interview Scheduling	Native calendar integration (Google/Outlook).	Q4 2026
Mobile Apps	React Native iOS/Android builds.	Q1 2027
Referral Program	Incentivized user growth with tracking.	Q1 2027
Salary Transparency Tools	Market rate insights and benchmarking.	Q1 2027
Diversity & Inclusion Dashboard	Anonymous demographic tracking for employers.	Q2 2027
