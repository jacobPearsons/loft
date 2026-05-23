'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Bell, Mail, Briefcase, Megaphone, Loader2, CheckCircle, MessageSquare } from 'lucide-react'

interface NotificationPrefs {
  applicationUpdates: boolean
  newMessages: boolean
  jobAlerts: boolean
  marketing: boolean
}

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/users/notifications')
      .then(res => res.json())
      .then(data => setPrefs(data))
      .catch(() => setPrefs({ applicationUpdates: true, newMessages: true, jobAlerts: true, marketing: false }))
      .finally(() => setLoading(false))
  }, [])

  const toggle = async (key: keyof NotificationPrefs) => {
    if (!prefs) return
    const updated = { ...prefs, [key]: !prefs[key] }
    setPrefs(updated)
    setSaving(key)
    setSaved(false)

    try {
      await fetch('/api/users/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {}

    setSaving(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
      </div>
    )
  }

  const items: { key: keyof NotificationPrefs; label: string; description: string; icon: React.ElementType }[] = [
    { key: 'applicationUpdates', label: 'Application Updates', description: 'Get notified when your application status changes', icon: Briefcase },
    { key: 'newMessages', label: 'New Messages', description: 'Receive notifications when you get a new message', icon: MessageSquare },
    { key: 'jobAlerts', label: 'Job Alerts', description: 'Get notified about new jobs matching your profile', icon: Bell },
    { key: 'marketing', label: 'Marketing & Promotions', description: 'Receive product updates and promotional offers', icon: Megaphone },
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Bell className="h-7 w-7 text-emerald-400" />
            Notification Preferences
          </h1>
          <p className="text-muted-foreground mt-1">Control what notifications you receive</p>
        </div>

        <Card className="bg-card border">
          <CardHeader>
            <CardTitle className="text-foreground text-lg">Email Notifications</CardTitle>
            <CardDescription className="text-muted-foreground">
              Toggle the types of emails you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {items.map(({ key, label, description, icon: Icon }) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <Label htmlFor={key} className="text-foreground font-medium cursor-pointer">{label}</Label>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </div>
                <Switch
                  id={key}
                  checked={prefs?.[key] ?? false}
                  onCheckedChange={() => toggle(key)}
                  disabled={saving === key}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {saved && (
          <div className="flex items-center gap-2 text-emerald-400 text-sm justify-center">
            <CheckCircle className="h-4 w-4" />
            Preferences saved
          </div>
        )}

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            You can change these preferences at any time from your settings page.
          </p>
        </div>
      </div>
    </div>
  )
}
