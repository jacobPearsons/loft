import ProfileForm from '@/components/forms/profile-form'
import React from 'react'
import ProfilePicture from './_components/profile-picture'
import { EmailVerification } from './_components/email-verification'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Shield, Mail, User, Camera } from 'lucide-react'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

const Settings = async () => {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/auth')

  const user = await db.user.findUnique({ where: { email: session.user.email } })

  const removeProfileImage = async () => {
    'use server'
    const s = await getServerSession(authOptions)
    if (!s?.user?.email) return null
    const u = await db.user.findUnique({ where: { email: s.user.email } })
    if (!u) return null
    const response = await db.user.update({
      where: {
        clerkId: u.clerkId,
      },
      data: {
        profileImage: '',
      },
    })
    return response
  }

  const uploadProfileImage = async (image: string) => {
    'use server'
    const s = await getServerSession(authOptions)
    if (!s?.user?.email) return null
    const u = await db.user.findUnique({ where: { email: s.user.email } })
    if (!u) return null
    const response = await db.user.update({
      where: {
        clerkId: u.clerkId,
      },
      data: {
        profileImage: image,
      },
    })
    return response
  }

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and profile information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Picture */}
        <div className="lg:col-span-1">
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Camera className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-foreground font-semibold">Profile Picture</h3>
                <p className="text-sm text-muted-foreground">Upload your photo</p>
              </div>
            </div>
            <ProfilePicture 
              userImage={user?.profileImage || null}
              onDelete={removeProfileImage}
              onUpload={uploadProfileImage}
            />
          </div>

          {/* Account Security Summary */}
          <div className="bg-card border rounded-xl p-6 space-y-4 mt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Shield className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-foreground font-semibold">Account Security</h3>
                <p className="text-sm text-muted-foreground">Password & auth</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
                <span className="text-sm text-foreground/80">Password</span>
                <span className="text-xs text-muted-foreground">••••••••</span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
                <span className="text-sm text-foreground/80">Two-Factor Auth</span>
                <span className="text-xs text-emerald-400">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-card border rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <User className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-foreground font-semibold">Personal Information</h3>
                <p className="text-sm text-muted-foreground">Update your personal details</p>
              </div>
            </div>
            <ProfileForm user={user} />
          </div>

          {/* Email & Notifications Summary */}
          <div className="bg-card border rounded-xl p-6 space-y-4 mt-6">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Mail className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-foreground font-semibold">Email & Notifications</h3>
                <p className="text-sm text-muted-foreground">Manage your email preferences</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/80">Primary Email</span>
                <span className="text-sm text-muted-foreground">{user?.email || 'Not set'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/80">Email Verified</span>
                <EmailVerification
                  email={user?.email || ''}
                  isVerified={user?.emailVerified || false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
