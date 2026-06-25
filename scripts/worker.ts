/**
 * Background Worker Process
 *
 * Runs one-off and scheduled background tasks:
 * - Job expiry notifications
 * - Email digests
 * - Data cleanup
 *
 * Start with: bun run scripts/worker.ts
 */

import { db } from '../src/lib/db'
import { createLogger } from '../src/lib/logger'
import { sendEmail, emailTemplates } from '../src/lib/email'

const log = createLogger('worker')

async function processJobExpiryNotifications() {
  const now = new Date()
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

  const expiringJobs = await db.job.findMany({
    where: {
      deadline: { lte: threeDaysFromNow, gte: now },
      isActive: true,
      status: 'PUBLISHED',
    },
    include: {
      employer: { include: { user: true } },
    },
  })

  for (const job of expiringJobs) {
    const daysLeft = Math.ceil((job.deadline!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    try {
      await sendEmail(emailTemplates.jobExpiring(job.title, daysLeft, job.employer.contactEmail))
      log.info('Expiry notification sent', { jobId: job.id, daysLeft })
    } catch (error) {
      log.error('Failed to send expiry notification', error, { jobId: job.id })
    }
  }
}

async function run() {
  log.info('Worker started')

  try {
    await processJobExpiryNotifications()
    log.info('Job expiry notifications processed')
  } catch (error) {
    log.error('Worker run failed', error)
  }

  await db.$disconnect()
  log.info('Worker finished')
}

run()
