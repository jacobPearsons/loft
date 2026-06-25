'use server'

import { db } from '@/lib/db'
import { createLogger } from '@/lib/logger'

const log = createLogger('dashboard-data')

// Get user dashboard data - simplified version without Clerk
export const getDashboardData = async () => {
  try {
    // For now, return mock data since we're transitioning from Clerk
    // In production, this would use native auth session
    return {
      user: null,
      stats: {
        totalApplications: 0,
        pendingApplications: 0,
        interviews: 0,
        hired: 0,
      },
      recentJobs: [],
    }
  } catch (error) {
    log.error('Error fetching dashboard data', error)
    return null
  }
}
