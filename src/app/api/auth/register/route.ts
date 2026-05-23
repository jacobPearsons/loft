import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { db } from "@/lib/db"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const { success } = rateLimit(`register:${ip}`, 5, 60000)
  if (!success) {
    return NextResponse.json(
      { success: false, message: 'Too many requests. Try again later.' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const { email, password, firstName, lastName, role: rawRole } = body
    const role = rawRole || "JOB_SEEKER"

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate password strength (min 8 chars, 1 uppercase, 1 number)
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        { success: false, message: "Password must contain at least 1 uppercase letter and 1 number" },
        { status: 400 }
      )
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate unique clerkId for local accounts
    const clerkId = `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    const user = await db.user.create({
      data: {
        clerkId,
        email,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        hashedPassword,
        isEmployer: role === "EMPLOYER",
        isApplicant: role === "JOB_SEEKER",
      },
    })

    // Create empty profile for job seekers
    if (role === "JOB_SEEKER") {
      await db.userProfile.create({
        data: {
          userId: clerkId,
        },
      })
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString("hex")
    await db.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    })

    return NextResponse.json(
      { 
        success: true, 
        message: "User created successfully. Please check your email to verify your account.", 
        user: { id: user.id, email: user.email },
        verificationToken, // In production, send via email
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Register error:", error)
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    )
  }
}