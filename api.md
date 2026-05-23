# LoftCommunity API

## External: Jobicy Remote Jobs API
Source: https://jobicy.com/api/v2/remote-jobs

Provides access to the latest remote job listings from a diverse range of industries and companies.

**GET** `https://jobicy.com/api/v2/remote-jobs`

### Query Parameters
| Param | Description | Default |
|-------|-------------|---------|
| count | Number of listings (1-100) | 100 |
| geo | Filter by region | all |
| industry | Filter by category | all |
| tag | Search title & description | all |

### Response Fields
- `id` - Unique Job ID
- `url` - Job link
- `jobTitle` - Job title
- `companyName` - Company name
- `companyLogo` - Company logo URL
- `jobIndustry` - Job function/industry
- `jobType` - full-time, contract, part-time, internship
- `jobGeo` - Geographic restriction
- `jobLevel` - Seniority level
- `jobExcerpt` - Short description (max 55 chars)
- `jobDescription` - Full description (HTML)
- `pubDate` - Publication date (UTC+00:00)
- `salaryMin` / `salaryMax` - Salary range
- `salaryCurrency` - ISO 4217 currency code
- `salaryPeriod` - hourly, daily, yearly, etc.

### Examples
```
GET https://jobicy.com/api/v2/remote-jobs?count=20&tag=python
GET https://jobicy.com/api/v2/remote-jobs?count=15&geo=canada
GET https://jobicy.com/api/v2/remote-jobs?count=30&geo=usa&industry=copywriting
```

---

## Internal: LoftCommunity Proxy

### GET /api/jobs/remote
Proxies Jobicy API with local JSON caching (15 min TTL). Falls back to cache on failure.

#### Query Parameters
All Jobicy params supported: `count`, `geo`, `industry`, `tag`

#### Response
```json
{
  "jobs": [...],
  "source": "live" | "cache" | "none",
  "cachedAt": "2026-05-21T...",
  "total": 20
}
```

#### Examples
```
GET /api/jobs/remote?count=10
GET /api/jobs/remote?count=20&tag=python
GET /api/jobs/remote?count=15&geo=usa&industry=marketing
```

---

### GET /api/jobs
Paginated job listings from the database (falls back to `src/data/jobs.json` if DB is empty).

#### Query Parameters
| Param | Description |
|-------|-------------|
| search | Keyword search (title, description) |
| location | City or "remote" |
| experience | ENTRY, JUNIOR, MID, SENIOR, LEAD |
| jobType | FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP |
| workMode | REMOTE, HYBRID, ONSITE |
| page | Page number (default: 1) |
| limit | Per page (default: 12) |

#### Response
```json
{
  "jobs": [{ "id": 1, "title": "...", "slug": "...", "company": {...}, "skills": [...] }],
  "total": 50,
  "page": 1,
  "totalPages": 5
}
```

### POST /api/jobs
Create a new job posting (employer only).

#### Body
```json
{
  "title": "Senior Engineer",
  "description": "...",
  "jobType": "FULL_TIME",
  "experienceLevel": "SENIOR",
  "workMode": "REMOTE",
  "skills": ["React", "Node.js"]
}
```

### GET /api/jobs/[id]/candidates
Ranked candidates for a job with skill-match scoring.

---

### GET /api/contact
Submit a contact/support request (sends email via Resend).

#### Body
```json
{
  "name": "John",
  "email": "john@example.com",
  "subject": "Help",
  "message": "I need assistance with..."
}
```

---

### GET /api/health
Server health check.

```json
{
  "status": "ok",
  "db": "connected",
  "timestamp": "...",
  "uptime": 1234
}
```
