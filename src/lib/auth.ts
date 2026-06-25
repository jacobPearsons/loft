import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import LinkedInProvider from "next-auth/providers/linkedin"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID || "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.hashedPassword) {
          throw new Error("Invalid credentials")
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        )

        if (!isValid) {
          throw new Error("Invalid credentials")
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          image: user.profileImage,
          rememberMe: (credentials as any).rememberMe === 'true',
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      const email = token.email || user?.email
      if (email) {
        const dbUser = await db.user.findUnique({
          where: { email },
          select: {
            isEmployer: true,
            id: true,
            isApplicant: true,
            companyMemberships: {
              take: 1,
              select: { companyId: true, role: true },
            },
          },
        })
        
        if (dbUser) {
          token.isEmployer = dbUser.isEmployer
          token.id = dbUser.id
          token.needsOnboarding = dbUser.isApplicant === false && dbUser.isEmployer === false
          token.companyId = dbUser.companyMemberships[0]?.companyId
          token.companyRole = dbUser.companyMemberships[0]?.role ?? undefined
        }

        if (user && account) {
          token.rememberMe = (user as any).rememberMe ?? false
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id?.toString() || ""
        session.user.isEmployer = token.isEmployer as boolean
        ;(session.user as any).needsOnboarding = token.needsOnboarding
        session.user.companyId = token.companyId
        session.user.companyRole = token.companyRole ?? undefined
      }
      return session
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/auth/error",
  },
}