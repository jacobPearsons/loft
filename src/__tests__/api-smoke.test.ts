/**
 * Smoke tests for critical API endpoints.
 * These tests verify that key routes respond correctly.
 * Run with: bun run test
 */

describe('API Smoke Tests', () => {
  const baseUrl = 'http://localhost:3000'

  describe('Health', () => {
    it('GET /api/health returns ok', async () => {
      const res = await fetch(`${baseUrl}/api/health`)
      const data = await res.json()
      expect(res.status).toBe(200)
      expect(data.status).toBe('ok')
      expect(data.db).toBe('connected')
    })
  })

  describe('Auth', () => {
    it('POST /api/auth/register validates required fields', async () => {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await res.json()
      expect(res.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it('POST /api/auth/login validates required fields', async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await res.json()
      expect(res.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })

  describe('Jobs', () => {
    it('GET /api/jobs returns paginated results', async () => {
      const res = await fetch(`${baseUrl}/api/jobs?page=1&limit=10`)
      const data = await res.json()
      expect(res.status).toBe(200)
      expect(Array.isArray(data.jobs ?? data)).toBe(true)
    })

    it('GET /api/jobs filters by experience level', async () => {
      const res = await fetch(`${baseUrl}/api/jobs?experience=ENTRY`)
      expect(res.status).toBe(200)
    })
  })

  describe('Job Detail', () => {
    it('GET /api/jobs/:id returns 404 for non-existent job', async () => {
      const res = await fetch(`${baseUrl}/api/jobs/9999999`)
      expect(res.status).toBe(404)
    })
  })

  describe('Notifications', () => {
    it('GET /api/notifications returns 401 without auth', async () => {
      const res = await fetch(`${baseUrl}/api/notifications`)
      expect(res.status).toBe(401)
    })
  })

  describe('Messages', () => {
    it('GET /api/messages returns 401 without auth', async () => {
      const res = await fetch(`${baseUrl}/api/messages`)
      expect(res.status).toBe(401)
    })
  })

  describe('Rate Limiting', () => {
    it('auth endpoints enforce rate limits', async () => {
      const url = `${baseUrl}/api/auth/login`
      const body = { email: 'test@test.com', password: 'Test1234' }

      // Rapid requests should eventually trigger rate limiting
      const results = await Promise.all(
        Array.from({ length: 10 }, () =>
          fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
        )
      )

      const statuses = results.map(r => r.status)
      const hasRateLimited = statuses.some(s => s === 429)
      expect(hasRateLimited).toBe(true)
    })
  })
})
