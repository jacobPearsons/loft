import { motion } from 'framer-motion'
import { Bell, Mail, Briefcase, Megaphone, Loader2, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useNotificationPrefs } from '@/lib/api-hooks'

export default function Notifications() {
  const { prefs, loading, saving, toggle } = useNotificationPrefs()

  if (loading) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
    )
  }

  const items = [
    { key: 'applicationUpdates' as const, icon: Briefcase, label: 'Application Updates', desc: 'Get notified when your application status changes' },
    { key: 'newMessages' as const, icon: MessageSquare, label: 'New Messages', desc: 'Receive notifications when someone sends you a message' },
    { key: 'jobAlerts' as const, icon: Bell, label: 'Job Alerts', desc: 'Get notified about new job postings matching your profile' },
    { key: 'marketing' as const, icon: Megaphone, label: 'Marketing & Promotions', desc: 'Receive updates about new features and promotions' },
  ]

  return (
      <div className="container px-4 md:px-6 py-16 sm:py-20 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <Bell className="h-6 w-6 text-emerald-400" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Notification Preferences</h1>
              <p className="text-sm text-neutral-400 mt-1">Manage how you receive notifications</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-emerald-400" />
                Email Notifications
              </CardTitle>
              <CardDescription>
                Choose which emails you&apos;d like to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <div className="flex items-start gap-3 min-w-0">
                    <item.icon className="h-5 w-5 text-neutral-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <Label className="text-sm font-medium text-white cursor-pointer">{item.label}</Label>
                      <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <Switch
                    checked={prefs[item.key]}
                    onCheckedChange={() => toggle(item.key)}
                    disabled={saving === item.key}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <p className="text-xs text-neutral-600 mt-6 text-center">
            You can change these preferences at any time from your settings.
          </p>
        </motion.div>
      </div>
  )
}
