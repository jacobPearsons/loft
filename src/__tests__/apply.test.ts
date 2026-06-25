import { NextRequest } from 'next/server'

jest.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
    },
    job: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    jobApplication: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    notification: {
      create: jest.fn(),
    },
  },
}))

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

jest.mock('@/lib/email', () => ({
  sendEmail: jest.fn(),
  emailTemplates: {
    applicationSubmitted: jest.fn(() => ({})),
    newApplicant: jest.fn(() => ({})),
  },
  shouldSendEmail: jest.fn(() => Promise.resolve(false)),
}))

jest.mock('@/lib/auth', () => ({
  authOptions: {},
}))

const { db } = require('@/lib/db')
const { getServerSession } = require('next-auth')

async function callApplyRoute(slug: string, body: any, email: string) {
  const url = `http://localhost:3000/api/jobs/${slug}/apply?email=${encodeURIComponent(email)}`
  const request = new NextRequest(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const { POST } = await import('@/app/api/jobs/[slug]/apply/route')
  return POST(request, { params: { slug } })
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('POST /api/jobs/[slug]/apply', () => {
  const mockUser = { clerkId: 'user_123', email: 'test@example.com' }
  const mockJob = { id: 1, title: 'Software Engineer', employerId: 'emp_123' }
  const mockEmail = 'test@example.com'

  it('returns 401 when not authenticated', async () => {
    getServerSession.mockResolvedValue(null)
    const response = await callApplyRoute('1', { coverLetter: 'test'.repeat(20) }, '')
    expect(response.status).toBe(401)
  })

  it('returns 404 when user not found', async () => {
    getServerSession.mockResolvedValue({ user: { email: 'test@example.com' } })
    db.user.findUnique.mockResolvedValue(null)

    const response = await callApplyRoute('1', { coverLetter: 'test'.repeat(20) }, 'test@example.com')
    expect(response.status).toBe(404)
    const data = await response.json()
    expect(data.error).toContain('User not found')
  })

  it('returns 404 when job not found', async () => {
    getServerSession.mockResolvedValue({ user: { email: 'test@example.com' } })
    db.user.findUnique.mockResolvedValue(mockUser)
    db.job.findFirst.mockResolvedValue(null)

    const response = await callApplyRoute('999999', { coverLetter: 'test'.repeat(20) }, 'test@example.com')
    expect(response.status).toBe(404)
    const data = await response.json()
    expect(data.error).toContain('Job not found')
  })

  it('returns 400 when already applied', async () => {
    getServerSession.mockResolvedValue({ user: { email: 'test@example.com' } })
    db.user.findUnique.mockResolvedValue(mockUser)
    db.job.findFirst.mockResolvedValue(mockJob)
    db.jobApplication.findFirst.mockResolvedValue({ id: 1 })

    const response = await callApplyRoute('1', { coverLetter: 'test'.repeat(20) }, 'test@example.com')
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toContain('Already applied')
  })

  it('creates application successfully with coverLetter only', async () => {
    getServerSession.mockResolvedValue({ user: { email: 'test@example.com' } })
    db.user.findUnique.mockResolvedValue(mockUser)
    db.job.findFirst.mockResolvedValue(mockJob)
    db.jobApplication.findFirst.mockResolvedValue(null)

    const createdApp = {
      id: 1,
      userId: 'user_123',
      jobId: 1,
      coverLetter: 'test'.repeat(20),
      resumeUrl: null,
      status: 'PENDING',
      appliedAt: new Date(),
      job: { title: 'Software Engineer', employer: { companyName: 'Tech Corp', companyLogo: null, contactEmail: 'hr@techcorp.com' } },
      user: { firstName: 'John', lastName: 'Doe', email: 'test@example.com' },
    }
    db.jobApplication.create.mockResolvedValue(createdApp)
    db.job.update.mockResolvedValue({})

    const response = await callApplyRoute('1', { coverLetter: 'test'.repeat(20) }, 'test@example.com')
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.application.status).toBe('PENDING')

    expect(db.jobApplication.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          resumeUrl: null,
          coverLetter: 'test'.repeat(20),
        }),
      })
    )
  })

  it('creates application with resumeUrl', async () => {
    getServerSession.mockResolvedValue({ user: { email: 'test@example.com' } })
    db.user.findUnique.mockResolvedValue(mockUser)
    db.job.findFirst.mockResolvedValue(mockJob)
    db.jobApplication.findFirst.mockResolvedValue(null)

    const createdApp = {
      id: 2,
      userId: 'user_123',
      jobId: 1,
      coverLetter: 'test'.repeat(20),
      resumeUrl: 'https://uploadthing.com/f/resume.pdf',
      status: 'PENDING',
      appliedAt: new Date(),
      job: { title: 'Software Engineer', employer: { companyName: 'Tech Corp', companyLogo: null, contactEmail: 'hr@techcorp.com' } },
      user: { firstName: 'John', lastName: 'Doe', email: 'test@example.com' },
    }
    db.jobApplication.create.mockResolvedValue(createdApp)
    db.job.update.mockResolvedValue({})

    const resumeUrl = 'https://uploadthing.com/f/resume.pdf'
    const response = await callApplyRoute('1', { coverLetter: 'test'.repeat(20), resumeUrl }, 'test@example.com')
    expect(response.status).toBe(200)

    expect(db.jobApplication.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          resumeUrl: 'https://uploadthing.com/f/resume.pdf',
        }),
      })
    )
  })

  it('looks up job by slug when non-numeric', async () => {
    getServerSession.mockResolvedValue({ user: { email: 'test@example.com' } })
    db.user.findUnique.mockResolvedValue(mockUser)
    db.job.findFirst.mockResolvedValue(mockJob)
    db.jobApplication.findFirst.mockResolvedValue(null)

    const createdApp = {
      id: 3,
      userId: 'user_123',
      jobId: 1,
      coverLetter: 'test'.repeat(20),
      resumeUrl: null,
      status: 'PENDING',
      appliedAt: new Date(),
      job: { title: 'Software Engineer', employer: { companyName: 'Tech Corp', companyLogo: null, contactEmail: 'hr@techcorp.com' } },
      user: { firstName: 'John', lastName: 'Doe', email: 'test@example.com' },
    }
    db.jobApplication.create.mockResolvedValue(createdApp)
    db.job.update.mockResolvedValue({})

    await callApplyRoute('senior-engineer-1', { coverLetter: 'test'.repeat(20) }, 'test@example.com')

    expect(db.job.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { slug: 'senior-engineer-1' },
      })
    )
  })
})
