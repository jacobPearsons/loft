import {
  convertRemoteJob,
  getRemoteJobsFromCache,
  findRemoteJobBySlug,
  findRemoteJobById,
  type RemoteJobRaw,
} from '@/lib/remote-jobs'

jest.mock('@/lib/db', () => ({
  db: {
    cacheEntry: {
      findUnique: jest.fn().mockResolvedValue(null),
    },
  },
}))

const sampleJob: RemoteJobRaw = {
  id: 144697,
  url: 'https://jobicy.com/jobs/144697-product-owner',
  jobSlug: '144697-product-owner',
  jobTitle: 'Product Owner – Canadian Payroll',
  companyName: 'Employment Hero',
  companyLogo: 'https://jobicy.com/logo.png',
  jobIndustry: ['Finance & Accounting'],
  jobType: ['Full-Time'],
  jobGeo: 'Canada',
  jobLevel: 'Midweight',
  jobExcerpt: 'We are hiring a Product Owner...',
  jobDescription: '<h3>Who we are</h3><p>Employment Hero is...</p>',
}

describe('convertRemoteJob', () => {
  it('generates correct slug from title and id', () => {
    const result = convertRemoteJob(sampleJob)
    expect(result.slug).toBe('jobicy-product-owner-canadian-payroll-144697')
  })

  it('strips HTML from description', () => {
    const result = convertRemoteJob(sampleJob)
    expect(result.description).not.toContain('<h3>')
    expect(result.description).not.toContain('</p>')
    expect(result.description).toContain('Who we are')
    expect(result.description).toContain('Employment Hero is...')
  })

  it('falls back to excerpt when description is empty', () => {
    const job = { ...sampleJob, jobDescription: '' }
    const result = convertRemoteJob(job)
    expect(result.description).toBe('We are hiring a Product Owner...')
  })

  it('maps Full-Time job type to FULL_TIME', () => {
    const result = convertRemoteJob(sampleJob)
    expect(result.jobType).toBe('FULL_TIME')
  })

  it('maps Part-Time job type', () => {
    const job = { ...sampleJob, jobType: ['Part-Time'] }
    const result = convertRemoteJob(job)
    expect(result.jobType).toBe('PART_TIME')
  })

  it('maps Contract job type', () => {
    const job = { ...sampleJob, jobType: ['Contract'] }
    const result = convertRemoteJob(job)
    expect(result.jobType).toBe('CONTRACT')
  })

  it('defaults unknown job type to FULL_TIME', () => {
    const job = { ...sampleJob, jobType: ['Unknown'] }
    const result = convertRemoteJob(job)
    expect(result.jobType).toBe('FULL_TIME')
  })

  it('maps Midweight experience level to MID', () => {
    const result = convertRemoteJob(sampleJob)
    expect(result.experienceLevel).toBe('MID')
  })

  it('maps Senior experience level', () => {
    const job = { ...sampleJob, jobLevel: 'Senior' }
    const result = convertRemoteJob(job)
    expect(result.experienceLevel).toBe('SENIOR')
  })

  it('maps Junior experience level', () => {
    const job = { ...sampleJob, jobLevel: 'Junior' }
    const result = convertRemoteJob(job)
    expect(result.experienceLevel).toBe('JUNIOR')
  })

  it('maps Entry experience level', () => {
    const job = { ...sampleJob, jobLevel: 'Entry' }
    const result = convertRemoteJob(job)
    expect(result.experienceLevel).toBe('ENTRY')
  })

  it('defaults unknown experience level to MID', () => {
    const job = { ...sampleJob, jobLevel: 'Unknown' }
    const result = convertRemoteJob(job)
    expect(result.experienceLevel).toBe('MID')
  })

  it('sets remoteWork to true', () => {
    const result = convertRemoteJob(sampleJob)
    expect(result.remoteWork).toBe(true)
  })

  it('sets location from jobGeo', () => {
    const result = convertRemoteJob(sampleJob)
    expect(result.location).toBe('Canada')
    expect(result.city).toBe('Canada')
  })

  it('defaults location to Remote when jobGeo is empty', () => {
    const job = { ...sampleJob, jobGeo: '' }
    const result = convertRemoteJob(job)
    expect(result.location).toBe('Remote')
  })

  it('sets company info correctly', () => {
    const result = convertRemoteJob(sampleJob)
    expect(result.company.companyName).toBe('Employment Hero')
    expect(result.company.companyLogo).toBe('https://jobicy.com/logo.png')
    expect(result.company.city).toBe('Canada')
  })

  it('defaults company name when missing', () => {
    const job = { ...sampleJob, companyName: '' }
    const result = convertRemoteJob(job)
    expect(result.company.companyName).toBe('Remote Company')
  })

  it('sets source to jobicy', () => {
    const result = convertRemoteJob(sampleJob)
    expect(result.source).toBe('jobicy')
  })

  it('sets skills from jobIndustry', () => {
    const result = convertRemoteJob(sampleJob)
    expect(result.skills).toEqual(['Finance & Accounting'])
  })

  it('handles em dash and special chars in slug', () => {
    const job = { ...sampleJob, jobTitle: 'Senior Frontend – React Developer' }
    const result = convertRemoteJob(job)
    expect(result.slug).toContain('senior-frontend')
    expect(result.slug).toContain('react-developer')
  })
})

describe('getRemoteJobsFromCache', () => {
  it('returns empty array when no cache file exists', async () => {
    const result = await getRemoteJobsFromCache()
    expect(Array.isArray(result)).toBe(true)
  })
})

describe('findRemoteJobBySlug', () => {
  it('returns null for non-existent slug', async () => {
    const result = await findRemoteJobBySlug('non-existent-slug')
    expect(result).toBeNull()
  })
})

describe('findRemoteJobById', () => {
  it('returns null for non-existent id', async () => {
    const result = await findRemoteJobById(999999)
    expect(result).toBeNull()
  })
})
