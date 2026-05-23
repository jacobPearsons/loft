import { NextRequest, NextResponse } from "next/server"
import * as fs from "fs"
import * as path from "path"

const CACHE_FILE = path.join(process.cwd(), "src", "data", "remote-jobs-cache.json")
const CACHE_TTL_MS = 15 * 60 * 1000
const JOBICY_URL = "https://jobicy.com/api/v2/remote-jobs"

function readCache(): { data: any; timestamp: number } | null {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8")
      return JSON.parse(raw)
    }
  } catch {}
  return null
}

function writeCache(data: any) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify({ data, timestamp: Date.now() }))
  } catch {}
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const count = searchParams.get("count") || "20"
  const geo = searchParams.get("geo") || ""
  const industry = searchParams.get("industry") || ""
  const tag = searchParams.get("tag") || ""

  const cached = readCache()
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    let jobs = cached.data
    if (tag) jobs = jobs.filter((j: any) => (j.jobTitle + " " + j.jobDescription).toLowerCase().includes(tag.toLowerCase()))
    if (geo) jobs = jobs.filter((j: any) => j.jobGeo?.toLowerCase().includes(geo.toLowerCase()))
    if (industry) jobs = jobs.filter((j: any) => j.jobIndustry?.toLowerCase().includes(industry.toLowerCase()))
    return NextResponse.json({
      jobs: jobs.slice(0, parseInt(count)),
      source: "cache",
      cachedAt: new Date(cached.timestamp).toISOString(),
      total: jobs.length,
    })
  }

  try {
    const url = `${JOBICY_URL}?count=${count}${geo ? `&geo=${geo}` : ""}${industry ? `&industry=${industry}` : ""}${tag ? `&tag=${tag}` : ""}`
    const res = await fetch(url, { next: { revalidate: 900 } })
    if (!res.ok) throw new Error(`Jobicy returned ${res.status}`)
    const data = await res.json()
    const jobs = data.jobs || data || []
    writeCache(jobs)
    return NextResponse.json({ jobs, source: "live", total: jobs.length })
  } catch {
    const cached = readCache()
    if (cached) {
      return NextResponse.json({
        jobs: cached.data,
        source: "cache",
        cachedAt: new Date(cached.timestamp).toISOString(),
        total: cached.data.length,
      })
    }
    return NextResponse.json({ jobs: [], source: "none", total: 0 })
  }
}
