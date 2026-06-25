const jobTypeDisplay: Record<string, string> = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  TEMPORARY: 'Temporary',
  FREELANCE: 'Freelance',
}

const jobTypeApi: Record<string, string> = {
  'Full Time': 'FULL_TIME',
  'Part Time': 'PART_TIME',
  'Contract': 'CONTRACT',
  'Internship': 'INTERNSHIP',
  'Temporary': 'TEMPORARY',
  'Freelance': 'FREELANCE',
}

const workModeDisplay: Record<string, string> = {
  REMOTE: 'remote',
  ONSITE: 'onsite',
  HYBRID: 'hybrid',
}

const workModeApi: Record<string, string> = {
  remote: 'REMOTE',
  onsite: 'ONSITE',
  hybrid: 'HYBRID',
}

const expDisplay: Record<string, string> = {
  ENTRY: 'Entry',
  JUNIOR: 'Junior',
  MID: 'Mid',
  SENIOR: 'Senior',
  LEAD: 'Lead',
  EXECUTIVE: 'Executive',
}

const expApi: Record<string, string> = {
  Entry: 'ENTRY',
  Junior: 'JUNIOR',
  Mid: 'MID',
  Senior: 'SENIOR',
  Lead: 'LEAD',
  Executive: 'EXECUTIVE',
}

export function displayJobType(v: string): string { return jobTypeDisplay[v] || v }
export function apiJobType(v: string): string { return jobTypeApi[v] || v }
export function displayWorkMode(v: string): string { return workModeDisplay[v] || v }
export function apiWorkMode(v: string): string { return workModeApi[v] || v }
export function displayExperience(v: string): string { return expDisplay[v] || v }
export function apiExperience(v: string): string { return expApi[v] || v }

export function normalizeJob(raw: any) {
  return {
    ...raw,
    isFeatured: raw.isFeatured ?? raw.featured ?? false,
    source: raw.source || 'local',
    company: raw.company || raw.employer || null,
    skills: raw.skills || raw.requiredSkills || [],
  }
}

export function formatSalary(min: number | null, max: number | null, currency = 'USD'): string | null {
  if (!min && !max) return null
  const fmt = (n: number) => {
    if (currency === 'USD') return `$${(n / 1000).toFixed(0)}k`
    return `${n.toLocaleString()} ${currency}`
  }
  if (min && max) return `${fmt(min)} - ${fmt(max)}`
  if (min) return `From ${fmt(min)}`
  return `Up to ${fmt(max!)}`
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}
