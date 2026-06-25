import { PrismaClient } from '@prisma/client'
import { createLogger } from './logger'

declare global {
  var prisma: PrismaClient | undefined
}

const log = createLogger('db')

export const db = globalThis.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db

export async function testDbConnection() {
  try {
    await db.$queryRaw`SELECT 1`
    return true
  } catch {
    return false
  }
}

export function setupGracefulShutdown() {
  process.on('SIGTERM', async () => {
    log.info('SIGTERM received, shutting down gracefully')
    await db.$disconnect()
    process.exit(0)
  })

  process.on('SIGINT', async () => {
    log.info('SIGINT received, shutting down gracefully')
    await db.$disconnect()
    process.exit(0)
  })

  process.on('uncaughtException', (error) => {
    log.error('Uncaught exception', error)
    db.$disconnect().finally(() => process.exit(1))
  })

  process.on('unhandledRejection', (reason) => {
    log.error('Unhandled rejection', reason instanceof Error ? reason : new Error(String(reason)))
  })

  log.info('Graceful shutdown handlers registered')
}