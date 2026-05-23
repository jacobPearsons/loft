import { MetadataRoute } from 'next'
import { db } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://loftcommunity.com'

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${baseUrl}/jobs`, lastModified: new Date(), changeFrequency: 'hourly' as const, priority: 0.9 },
    { url: `${baseUrl}/auth`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
  ]

  try {
    const jobs = await db.job.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
      take: 1000,
    })

    const jobPages = jobs.map(job => ({
      url: `${baseUrl}/jobs/${job.slug}`,
      lastModified: job.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [...staticPages, ...jobPages]
  } catch {
    return staticPages
  }
}
