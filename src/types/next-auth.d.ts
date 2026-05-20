import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      isEmployer: boolean
    } & DefaultSession["user"]
  }

  interface User {
    isEmployer?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isEmployer?: boolean
    id?: number
    needsOnboarding?: boolean
  }
}