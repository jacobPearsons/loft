import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export interface CompanySession {
  userId: string
  email: string
  companyId: number
  role: "ADMIN" | "EMPLOYER"
}

export async function getCompanySession(): Promise<CompanySession | null> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return null

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: {
      companyMemberships: {
        include: { company: true },
        take: 1,
      },
    },
  })

  if (!user || user.companyMemberships.length === 0) return null

  const membership = user.companyMemberships[0]
  return {
    userId: user.clerkId,
    email: user.email,
    companyId: membership.companyId,
    role: membership.role,
  }
}

export async function requireAdmin(): Promise<CompanySession> {
  const cs = await getCompanySession()
  if (!cs) throw new Error("Unauthorized")
  if (cs.role !== "ADMIN") throw new Error("Forbidden: admin role required")
  return cs
}

export async function requireCompanyMember(): Promise<CompanySession> {
  const cs = await getCompanySession()
  if (!cs) throw new Error("Unauthorized")
  return cs
}

export function getCompanyId() {
  const slug = "loft-community"
  return slug
}
