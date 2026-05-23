import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const rawId = params.id
  const jobId = parseInt(rawId)
  const isNumeric = !isNaN(jobId)

  const job = await db.job.findFirst({
    where: isNumeric
      ? { id: jobId }
      : { slug: rawId },
    include: {
      employer: {
        select: { companyName: true, companyLogo: true, companySize: true, industry: true, description: true, contactEmail: true, city: true, country: true, linkedIn: true, twitter: true, hiringMode: true },
      },
      requiredSkillsRelation: {
        include: { skill: true },
      },
      category: true,
    },
  })

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 })
  }

  return NextResponse.json({
    id: job.id,
    title: job.title,
    slug: job.slug,
    description: job.description,
    requirements: job.requirements,
    benefits: job.benefits,
    jobType: job.jobType,
    experienceLevel: job.experienceLevel,
    workMode: job.workMode,
    location: job.location,
    city: job.city,
    country: job.country,
    remoteWork: job.remoteWork,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    salaryCurrency: job.salaryCurrency,
    salaryPeriod: job.salaryPeriod,
    isSalaryVisible: job.isSalaryVisible,
    requiredSkills: job.requiredSkillsRelation.map((rs) => rs.skill.name),
    preferredSkills: job.preferredSkills,
    status: job.status,
    isFeatured: job.isFeatured,
    isActive: job.isActive,
    viewsCount: job.viewsCount,
    applicationsCount: job.applicationsCount,
    employerId: job.employerId,
    category: job.category,
    deadline: job.deadline,
    publishedAt: job.publishedAt,
    createdAt: job.createdAt,
    company: job.employer,
  })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email")

  const userEmail = email || session?.user?.email

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await db.user.findUnique({
    where: { email: userEmail as string },
    include: { employerProfile: true },
  })

  if (!user?.employerProfile) {
    return NextResponse.json({ error: "Company profile required" }, { status: 403 })
  }

  const jobId = parseInt(params.id)
  const job = await db.job.findUnique({ where: { id: jobId } })

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 })
  }

  if (job.employerId !== user.clerkId) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }

  const body = await request.json()
  const { title, description, requirements, benefits, jobType, experienceLevel, workMode, location, city, salaryMin, salaryMax, status, isFeatured, isActive, deadline, skills, preferredSkills } = body

  const updateData: Record<string, unknown> = {}
  if (title !== undefined) updateData.title = title
  if (description !== undefined) updateData.description = description
  if (requirements !== undefined) updateData.requirements = requirements
  if (benefits !== undefined) updateData.benefits = benefits
  if (jobType !== undefined) updateData.jobType = jobType
  if (experienceLevel !== undefined) updateData.experienceLevel = experienceLevel
  if (workMode !== undefined) updateData.workMode = workMode
  if (location !== undefined) updateData.location = location
  if (city !== undefined) updateData.city = city
  if (salaryMin !== undefined) updateData.salaryMin = salaryMin
  if (salaryMax !== undefined) updateData.salaryMax = salaryMax
  if (isFeatured !== undefined) updateData.isFeatured = isFeatured
  if (isActive !== undefined) updateData.isActive = isActive
  if (preferredSkills !== undefined) updateData.preferredSkills = preferredSkills

  if (status !== undefined) {
    updateData.status = status
    if (status === "PUBLISHED") updateData.publishedAt = new Date()
    if (status === "CLOSED") updateData.closedAt = new Date()
  }

  if (deadline !== undefined) {
    updateData.deadline = deadline ? new Date(deadline) : null
  }

  const updated = await db.job.update({
    where: { id: jobId },
    data: updateData,
  })

  if (skills && Array.isArray(skills)) {
    await db.jobRequiredSkill.deleteMany({ where: { jobId } })
    for (const skillName of skills) {
      let skill = await db.skill.findUnique({ where: { name: skillName } })
      if (!skill) {
        skill = await db.skill.create({ data: { name: skillName, isCustom: true } })
      }
      await db.jobRequiredSkill.create({
        data: { jobId, skillId: skill.id, isRequired: true },
      })
    }
  }

  return NextResponse.json({ success: true, job: updated })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email")

  const userEmail = email || session?.user?.email

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await db.user.findUnique({
    where: { email: userEmail as string },
    include: { employerProfile: true },
  })

  if (!user?.employerProfile) {
    return NextResponse.json({ error: "Company profile required" }, { status: 403 })
  }

  const jobId = parseInt(params.id)
  const job = await db.job.findUnique({ where: { id: jobId } })

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 })
  }

  if (job.employerId !== user.clerkId) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }

  await db.job.delete({ where: { id: jobId } })

  return NextResponse.json({ success: true })
}
