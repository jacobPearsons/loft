import { rateLimit } from '@/lib/rate-limit'

var mockFindUnique = jest.fn()
var mockUpsert = jest.fn()
var mockUpdate = jest.fn()
var mockDeleteMany = jest.fn()

jest.mock('@/lib/db', () => ({
  db: {
    rateLimit: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
      upsert: (...args: unknown[]) => mockUpsert(...args),
      update: (...args: unknown[]) => mockUpdate(...args),
      deleteMany: (...args: unknown[]) => mockDeleteMany(...args),
    },
  },
}))

beforeEach(() => {
  jest.clearAllMocks()
})

describe('rateLimit', () => {
  const key = 'test-key'
  const limit = 5
  const windowMs = 60_000

  it('allows request when no existing record', async () => {
    mockDeleteMany.mockResolvedValue({ count: 0 })
    mockFindUnique.mockResolvedValue(null)
    mockUpsert.mockResolvedValue({ key, count: 1, windowStart: new Date() })

    const result = await rateLimit(key, limit, windowMs)

    expect(result).toEqual({ success: true, remaining: 4 })
    expect(mockDeleteMany).toHaveBeenCalled()
    expect(mockFindUnique).toHaveBeenCalledWith({ where: { key } })
    expect(mockUpsert).toHaveBeenCalled()
  })

  it('allows request when window has expired', async () => {
    const oldWindow = new Date(Date.now() - windowMs * 2)
    mockDeleteMany.mockResolvedValue({ count: 0 })
    mockFindUnique.mockResolvedValue({ key, count: 5, windowStart: oldWindow })
    mockUpsert.mockResolvedValue({ key, count: 1, windowStart: new Date() })

    const result = await rateLimit(key, limit, windowMs)

    expect(result).toEqual({ success: true, remaining: 4 })
    expect(mockUpsert).toHaveBeenCalled()
  })

  it('blocks request when limit exceeded within window', async () => {
    const currentWindow = new Date()
    mockDeleteMany.mockResolvedValue({ count: 0 })
    mockFindUnique.mockResolvedValue({ key, count: 5, windowStart: currentWindow })

    const result = await rateLimit(key, limit, windowMs)

    expect(result).toEqual({ success: false, remaining: 0 })
    expect(mockUpsert).not.toHaveBeenCalled()
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it('increments count when under limit within window', async () => {
    const currentWindow = new Date()
    mockDeleteMany.mockResolvedValue({ count: 0 })
    mockFindUnique.mockResolvedValue({ key, count: 2, windowStart: currentWindow })
    mockUpdate.mockResolvedValue({ key, count: 3, windowStart: currentWindow })

    const result = await rateLimit(key, limit, windowMs)

    expect(result).toEqual({ success: true, remaining: 2 })
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { key },
      data: { count: { increment: 1 } },
    })
  })

  it('returns safe defaults on error', async () => {
    mockDeleteMany.mockRejectedValue(new Error('DB error'))

    const result = await rateLimit(key, limit, windowMs)

    expect(result).toEqual({ success: true, remaining: 4 })
  })

  it('returns correct remaining for first request with limit 1', async () => {
    mockDeleteMany.mockResolvedValue({ count: 0 })
    mockFindUnique.mockResolvedValue(null)
    mockUpsert.mockResolvedValue({ key, count: 1, windowStart: new Date() })

    const result = await rateLimit(key, 1, windowMs)

    expect(result).toEqual({ success: true, remaining: 0 })
  })
})
