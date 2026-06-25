import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const db = new PrismaClient({
  log: ['warn', 'error'],
})

interface JobSeed {
  id?: string
  title: string
  company: string
  jobType: string
  location: string
  salaryRange?: string
  description: string
  requiredSkills: string[]
  benefits?: string[]
  postedTime?: string
  employer_id?: string
  status?: string
  created_at?: string
}

function parseJobType(jt: string): string {
  const map: Record<string, string> = {
    'full-time': 'FULL_TIME',
    'part-time': 'PART_TIME',
    contract: 'CONTRACT',
    internship: 'INTERNSHIP',
    temporary: 'TEMPORARY',
    freelance: 'FREELANCE',
  }
  return map[jt.toLowerCase()] || 'FULL_TIME'
}

function parseWorkMode(location: string): string {
  const loc = location.toLowerCase()
  if (loc.startsWith('remote')) return 'REMOTE'
  if (loc.startsWith('hybrid')) return 'HYBRID'
  if (loc.startsWith('on-site') || loc.startsWith('onsite')) return 'ONSITE'
  return 'ONSITE'
}

function parseSalaryRange(range?: string): { min: number | null; max: number | null } {
  if (!range) return { min: null, max: null }
  const matches = range.replace(/,/g, '').match(/\$?(\d+(?:,\d{3})*(?:\.\d+)?)/g)
  if (!matches) return { min: null, max: null }
  const nums = matches.map(m => parseInt(m.replace(/[^0-9]/g, '')))
  return { min: nums[0] || null, max: nums[1] || null }
}

function parseCreatedAt(dateStr?: string): Date {
  if (dateStr) return new Date(dateStr)
  return new Date()
}

function slugify(title: string, id: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + id
}

async function main() {
  console.log('🌱 Seeding database...')

  // ============================================
  // STEP 1: Ensure Loft Community company exists
  // ============================================
  console.log('\n📋 Setting up Loft Community company...')

  const company = await db.company.upsert({
    where: { slug: 'loft-community' },
    update: {
      name: 'Loft Community',
      description: 'The official Loft Community employment platform',
    },
    create: {
      name: 'Loft Community',
      slug: 'loft-community',
      description: 'The official Loft Community employment platform',
      contactEmail: 'admin@loftcommunity.com',
    },
  })
  console.log(`  ✓ Loft Community company (id=${company.id})`)

  // ============================================
  // STEP 2: Migrate existing employers → CompanyMembers
  // ============================================
  console.log('\n📋 Migrating existing employers to CompanyMembers...')

  const existingEmployers = await db.employerProfile.findMany({
    include: { user: true },
  })

  let membersCreated = 0
  for (const emp of existingEmployers) {
    const existing = await db.companyMember.findUnique({
      where: { companyId_userId: { companyId: company.id, userId: emp.userId } },
    })
    if (!existing) {
      await db.companyMember.create({
        data: {
          companyId: company.id,
          userId: emp.userId,
          role: membersCreated === 0 ? 'ADMIN' : 'EMPLOYER',
        },
      })
      membersCreated++
    }
  }
  console.log(`  ✓ ${membersCreated} CompanyMembers created (first user is ADMIN)`)

  // ============================================
  // STEP 3: Migrate existing jobs → set companyId
  // ============================================
  console.log('\n📋 Migrating existing jobs to Loft Community company...')

  const { count: jobsMigrated } = await db.job.updateMany({
    where: { companyId: null },
    data: { companyId: company.id },
  })
  console.log(`  ✓ ${jobsMigrated} jobs migrated to Loft Community`)

  // ============================================
  // STEP 4: Seed jobs from JSON
  // ============================================
  const dataPath = path.join(process.cwd(), 'src', 'data', 'jobs.json')
  const rawData = fs.readFileSync(dataPath, 'utf-8')
  const jobsData: JobSeed[] = JSON.parse(rawData)

  console.log(`\n📦 Loaded ${jobsData.length} jobs from JSON`)

  const companyMap = new Map<string, string>()

  for (const job of jobsData) {
    if (!companyMap.has(job.company)) {
      const existingEmployer = await db.employerProfile.findFirst({
        where: { companyName: job.company },
      })

      if (existingEmployer) {
        companyMap.set(job.company, existingEmployer.userId)
        console.log(`  ✓ Found existing employer: ${job.company}`)
      } else {
        const companySlug = job.company.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        const clerkId = `employer-seed-${companySlug}-${Date.now()}`
        const email = `employer-${companySlug}@loftcommunity.com`

        const existingUser = await db.user.findUnique({ where: { email } })
        if (existingUser) {
          companyMap.set(job.company, existingUser.clerkId)
          continue
        }

        const user = await db.user.create({
          data: {
            clerkId,
            email,
            name: job.company,
            isEmployer: true,
            isApplicant: false,
            emailVerified: true,
          },
        })

        await db.employerProfile.create({
          data: {
            userId: user.clerkId,
            companyName: job.company,
            industry: 'Technology',
            contactEmail: email,
            isVerified: true,
          },
        })

        companyMap.set(job.company, user.clerkId)
        console.log(`  ✓ Created employer: ${job.company}`)
      }
    }
  }

  let created = 0
  let skipped = 0

  for (const job of jobsData) {
    const slug = slugify(job.title, job.id || `${Date.now()}-${Math.random()}`)
    const existingJob = await db.job.findUnique({ where: { slug } })
    if (existingJob) {
      skipped++
      continue
    }

    const employerId = companyMap.get(job.company)
    if (!employerId) {
      console.warn(`  ⚠ No employer for ${job.company}, skipping`)
      skipped++
      continue
    }

    const { min: salaryMin, max: salaryMax } = parseSalaryRange(job.salaryRange)
    const workMode = parseWorkMode(job.location)
    const isRemote = workMode === 'REMOTE'
    const createdAt = parseCreatedAt(job.created_at)

    const dbJob = await db.job.create({
      data: {
        title: job.title,
        slug,
        description: job.description,
        benefits: JSON.stringify(job.benefits || []),
        jobType: parseJobType(job.jobType) as any,
        experienceLevel: 'MID' as any,
        workMode: workMode as any,
        city: job.location,
        location: job.location,
        remoteWork: isRemote,
        salaryMin: salaryMin,
        salaryMax: salaryMax,
        requiredSkills: job.requiredSkills,
        status: 'PUBLISHED' as any,
        isActive: true,
        companyId: company.id,
        employerId,
        publishedAt: createdAt,
        createdAt,
      },
    })

    for (const skillName of job.requiredSkills) {
      const skill = await db.skill.upsert({
        where: { name: skillName },
        update: {},
        create: { name: skillName, isCustom: false },
      })
      await db.jobRequiredSkill.upsert({
        where: { jobId_skillId: { jobId: dbJob.id, skillId: skill.id } },
        update: {},
        create: { jobId: dbJob.id, skillId: skill.id, isRequired: true },
      })
    }

    created++
  }

  console.log(`\n✅ Done! Created ${created} jobs, skipped ${skipped} duplicates`)
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
