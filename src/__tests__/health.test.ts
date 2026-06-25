import { GET } from '@/app/api/health/route'
import { db } from '@/lib/db'

describe('GET /api/health', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 200 with ok status when db is connected', async () => {
    (db.$queryRaw as jest.Mock).mockResolvedValue(undefined)

    const res = await GET()
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.status).toBe('ok')
    expect(data.db).toBe('connected')
    expect(data).toHaveProperty('timestamp')
    expect(data).toHaveProperty('uptime')
  })

  it('returns 503 with error status when db is disconnected', async () => {
    (db.$queryRaw as jest.Mock).mockRejectedValue(new Error('connection failed'))

    const res = await GET()
    const data = await res.json()

    expect(res.status).toBe(503)
    expect(data.status).toBe('error')
    expect(data.db).toBe('disconnected')
    expect(data).toHaveProperty('timestamp')
  })
})
