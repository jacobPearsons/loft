import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  // For now, allow unauthenticated access for demo purposes
  // In production, this would require authentication
  const { email, role } = await request.json()

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 })
  }

  const user = await db.user.update({
    where: { email },
    data: {
      isEmployer: role === "EMPLOYER",
      isApplicant: role === "JOB_SEEKER",
    },
  })

  return NextResponse.json({ success: true, role: user.isEmployer ? "EMPLOYER" : "JOB_SEEKER" })
}