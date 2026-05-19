import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email")

  const userEmail = email || (await getServerSession(authOptions))?.user?.email
  
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const applicationId = parseInt(params.id)
  const { isShortlisted } = await request.json()

  // Get application with job info
  const application = await db.jobApplication.findUnique({
    where: { id: applicationId },
    include: { job: true },
  })

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 })
  }

  // Verify employer owns the job
  const user = await db.user.findUnique({
    where: { email: userEmail as string },
  })

  if (application.job.employerId !== user?.clerkId) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }

  // Toggle shortlist by adding/removing note
  const currentNotes = application.employerNotes || ""
  const shortlistMarker = "SHORTLISTED:"
  
  let newNotes = currentNotes
  if (isShortlisted && !currentNotes.includes(shortlistMarker)) {
    newNotes = currentNotes + (currentNotes ? "\n" : "") + `${shortlistMarker} true`
  } else if (!isShortlisted) {
    newNotes = currentNotes.replace(`${shortlistMarker} true`, "").trim()
  }

  const updated = await db.jobApplication.update({
    where: { id: applicationId },
    data: { employerNotes: newNotes || null },
  })

  return NextResponse.json({ 
    success: true,
    isShortlisted: isShortlisted 
  })
}