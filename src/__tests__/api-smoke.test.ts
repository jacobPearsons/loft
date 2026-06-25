import { NextRequest } from 'next/server'

jest.mock('@/features/auth/services/authService', () => ({
  registerUser: jest.fn(),
  validatePassword: jest.fn(),
  isPasswordStrongEnough: jest.fn(),
  loginUser: jest.fn(),
}))

jest.mock('@/lib/rate-limit', () => ({
  rateLimit: jest.fn(),
}))

jest.mock('@/lib/remote-jobs', () => ({
  getAllRemoteJobs: jest.fn(),
  findRemoteJobBySlug: jest.fn(),
  findRemoteJobById: jest.fn(),
}))

import { GET as healthGET } from '@/app/api/health/route'
import { POST as registerPOST } from '@/app/api/auth/register/route'
import { POST as loginPOST } from '@/app/api/auth/login/route'
import { GET as jobsGET } from '@/app/api/jobs/route'
import { GET as jobDetailGET } from '@/app/api/jobs/[slug]/route'
import { GET as notificationsGET } from '@/app/api/notifications/route'
import { GET as messagesGET } from '@/app/api/messages/route'

import { db } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'
import { getServerSession } from 'next-auth'
import { getAllRemoteJobs, findRemoteJobBySlug } from '@/lib/remote-jobs'

describe('API Smoke Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Health', () => {
    it('GET /api/health returns ok', async () => {
      (db.$queryRaw as jest.Mock).mockResolvedValue(undefined)

      const res = await healthGET()
      const data = await res.json()

      expect(res.status).toBe(200)
      expect(data.status).toBe('ok')
      expect(data.db).toBe('connected')
    })
  })

  describe('Auth', () => {
    it('POST /api/auth/register validates required fields', async () => {
      (rateLimit as jest.Mock).mockResolvedValue({ success: true })

      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const res = await registerPOST(request)
      const data = await res.json()

      expect(res.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it('POST /api/auth/login validates required fields', async () => {
      (rateLimit as jest.Mock).mockResolvedValue({ success: true })

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const res = await loginPOST(request)
      const data = await res.json()

      expect(res.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })

  describe('Jobs', () => {
    it('GET /api/jobs returns paginated results', async () => {
      (db.job.updateMany as jest.Mock).mockResolvedValue({ count: 0 })
      ;(db.job.findMany as jest.Mock).mockResolvedValue([])
      ;(db.job.count as jest.Mock).mockResolvedValue(0)
      ;(getAllRemoteJobs as jest.Mock).mockResolvedValue([])

      const request = new NextRequest('http://localhost:3000/api/jobs?page=1&limit=10')
      const res = await jobsGET(request)
      const data = await res.json()

      expect(res.status).toBe(200)
      expect(Array.isArray(data.jobs)).toBe(true)
    })
  })

  describe('Job Detail', () => {
    it('GET /api/jobs/:id returns 404 for non-existent job', async () => {
      (db.job.findFirst as jest.Mock).mockResolvedValue(null)
      ;(findRemoteJobBySlug as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/jobs/9999999')
      const res = await jobDetailGET(request, { params: { slug: '9999999' } })

      expect(res.status).toBe(404)
    })
  })

  describe('Notifications', () => {
    it('GET /api/notifications returns 401 without auth', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/notifications')
      const res = await notificationsGET(request)

      expect(res.status).toBe(401)
    })
  })

  describe('Messages', () => {
    it('GET /api/messages returns 401 without auth', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/messages')
      const res = await messagesGET(request)

      expect(res.status).toBe(401)
    })
  })

  describe('Rate Limiting', () => {
    it('auth endpoints enforce rate limits', async () => {
      (rateLimit as jest.Mock).mockResolvedValue({ success: false })

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'Test1234' }),
      })
      const res = await loginPOST(request)

      expect(res.status).toBe(429)
    })
  })
})
