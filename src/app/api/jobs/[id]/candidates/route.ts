import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email")
  const sort = searchParams.get("sort") || "matchScore"

  const userEmail = email || (await getServerSession(authOptions))?.user?.email
  
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const jobId = parseInt(params.id)

  const job = await db.job.findUnique({
    where: { id: jobId },
    include: {
      requiredSkills: {
        include: { skill: true },
      },
    },
  })

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 })
  }

  // Verify employer owns this job
  const user = await db.user.findUnique({
    where: { email: userEmail as string },
  })

  if (job.employerId !== user?.clerkId) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }

  const applications = await db.jobApplication.findMany({
    where: { jobId },
    include: {
      user: {
        include: {
          profile: {
            include: {
              skills: {
                include: { skill: true },
              },
            },
          },
        },
      },
    },
  })

  const jobSkillIds = job.requiredSkills.map((rs) => rs.skillId)

  // Calculate match scores
  const candidates = applications.map((app) => {
    const userSkillIds = app.user.profile?.skills.map((s) => s.skillId) || []
    const matchedSkills = userSkillIds.filter((id) => jobSkillIds.includes(id)).length
    const matchScore = jobSkillIds.length > 0 
      ? Math.round((matchedSkills / jobSkillIds.length) * 100) 
      : 0

    return {
      id: app.id,
      status: app.status,
      appliedAt: app.appliedAt,
      coverLetter: app.coverLetter,
      matchScore,
      matchedSkills,
      totalRequired: jobSkillIds.length,
      candidate: {
        id: app.user.id,
        name: app.user.name,
        firstName: app.user.firstName,
        lastName: app.user.lastName,
        email: app.user.email,
        profileImage: app.user.profileImage,
        profile: app.user.profile,
      },
    }
  })

  // Sort
  if (sort === "date") {
    candidates.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
  } else {
    candidates.sort((a, b) => b.matchScore - a.matchScore)
  }

  return NextResponse.json({
    job: {
      id: job.id,
      title: job.title,
      requiredSkills: job.requiredSkills.map(rs => rs.skill.name),
    },
    candidates,
    total: candidates.length,
  })
}