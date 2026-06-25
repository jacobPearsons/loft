import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import path from 'path'
import geoip from 'geoip-lite'
import { createLogger } from './logger'

const log = createLogger('geo')

if (!process.env.GEODATADIR) {
  process.env.GEODATADIR = path.resolve(process.cwd(), 'node_modules/geoip-lite/data')
}

const BLOCKED_COUNTRIES = ['NG']

export async function checkGeoBlock(): Promise<void> {
  let shouldRedirect = false

  try {
    const headersList = await headers()
    const pathname = headersList.get('x-invoke-path') || headersList.get('next-url') || ''

    if (
      pathname.startsWith('/blocked') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api')
    ) {
      return
    }

    const forwardedFor = headersList.get('x-forwarded-for')
    const realIp = headersList.get('x-real-ip')
    const ip = forwardedFor?.split(',')[0]?.trim() || realIp || '127.0.0.1'

    if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') return

    const geo = geoip.lookup(ip)

    if (geo && BLOCKED_COUNTRIES.includes(geo.country)) {
      shouldRedirect = true
    }
  } catch (error: any) {
    if (error?.digest === 'DYNAMIC_SERVER_USAGE') throw error
    log.error('Geo-block check failed', error)
  }

  if (shouldRedirect) {
    redirect('/blocked')
  }
}
