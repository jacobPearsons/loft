import { createLogger } from '@/lib/logger'

describe('createLogger', () => {
  let originalLog: typeof console.log
  let originalWarn: typeof console.warn
  let originalError: typeof console.error
  let originalDebug: typeof console.debug

  beforeEach(() => {
    originalLog = console.log
    originalWarn = console.warn
    originalError = console.error
    originalDebug = console.debug
    console.log = jest.fn()
    console.warn = jest.fn()
    console.error = jest.fn()
    console.debug = jest.fn()
    ;(process.env as Record<string, string>).NODE_ENV = 'development'
  })

  afterEach(() => {
    console.log = originalLog
    console.warn = originalWarn
    console.error = originalError
    console.debug = originalDebug
  })

  it('creates a logger with info, warn, error, debug methods', () => {
    const logger = createLogger('testService')
    expect(logger).toHaveProperty('info')
    expect(logger).toHaveProperty('warn')
    expect(logger).toHaveProperty('error')
    expect(logger).toHaveProperty('debug')
    expect(typeof logger.info).toBe('function')
    expect(typeof logger.warn).toBe('function')
    expect(typeof logger.error).toBe('function')
    expect(typeof logger.debug).toBe('function')
  })

  it('logs info messages to console.log', () => {
    const logger = createLogger('testService')
    logger.info('User logged in', { userId: 1 })
    expect(console.log).toHaveBeenCalledTimes(1)
    const entry = JSON.parse((console.log as jest.Mock).mock.calls[0][0])
    expect(entry).toMatchObject({
      level: 'info',
      context: 'testService',
      message: 'User logged in',
      data: { userId: 1 },
    })
    expect(entry).toHaveProperty('timestamp')
  })

  it('logs warn messages to console.warn', () => {
    const logger = createLogger('testService')
    logger.warn('Rate limit approaching', { remaining: 1 })
    expect(console.warn).toHaveBeenCalledTimes(1)
    const entry = JSON.parse((console.warn as jest.Mock).mock.calls[0][0])
    expect(entry.level).toBe('warn')
    expect(entry.message).toBe('Rate limit approaching')
    expect(entry.data).toEqual({ remaining: 1 })
  })

  it('logs error messages to console.error', () => {
    const logger = createLogger('testService')
    const error = new Error('Something broke')
    logger.error('Operation failed', error, { requestId: 'abc' })
    expect(console.error).toHaveBeenCalledTimes(1)
    const entry = JSON.parse((console.error as jest.Mock).mock.calls[0][0])
    expect(entry.level).toBe('error')
    expect(entry.message).toBe('Operation failed')
    expect(entry.data.error).toMatchObject({
      message: 'Something broke',
      name: 'Error',
    })
    expect(entry.data.error).toHaveProperty('stack')
    expect(entry.data.requestId).toBe('abc')
  })

  it('handles non-Error error payloads', () => {
    const logger = createLogger('testService')
    logger.error('String error', 'just a string')
    expect(console.error).toHaveBeenCalledTimes(1)
    const entry = JSON.parse((console.error as jest.Mock).mock.calls[0][0])
    expect(entry.data.error).toBe('just a string')
  })

  it('logs debug messages to console.debug in development', () => {
    const logger = createLogger('testService')
    logger.debug('Cache miss', { key: 'foo' })
    expect(console.debug).toHaveBeenCalledTimes(1)
    const entry = JSON.parse((console.debug as jest.Mock).mock.calls[0][0])
    expect(entry.level).toBe('debug')
    expect(entry.message).toBe('Cache miss')
    expect(entry.data).toEqual({ key: 'foo' })
  })

  it('does not log debug messages in production', () => {
    ;(process.env as Record<string, string>).NODE_ENV = 'production'
    const logger = createLogger('testService')
    logger.debug('Should not appear')
    expect(console.debug).not.toHaveBeenCalled()
  })

  it('logs info without data', () => {
    const logger = createLogger('testService')
    logger.info('Simple message')
    expect(console.log).toHaveBeenCalledTimes(1)
    const entry = JSON.parse((console.log as jest.Mock).mock.calls[0][0])
    expect(entry.message).toBe('Simple message')
    expect(entry.data).toBeUndefined()
  })

  it('includes timestamp in all log entries', () => {
    const logger = createLogger('testService')
    logger.info('test')
    logger.warn('test')
    logger.error('test')
    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.warn).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledTimes(1)
    const entries = [
      JSON.parse((console.log as jest.Mock).mock.calls[0][0]),
      JSON.parse((console.warn as jest.Mock).mock.calls[0][0]),
      JSON.parse((console.error as jest.Mock).mock.calls[0][0]),
    ]
    entries.forEach(entry => {
      expect(entry).toHaveProperty('timestamp')
      expect(new Date(entry.timestamp).toISOString()).toBe(entry.timestamp)
    })
  })
})
