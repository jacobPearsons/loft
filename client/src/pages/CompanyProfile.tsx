import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2, ArrowLeft, Save } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/providers/AuthProvider'
import { useCompanyProfile } from '@/lib/api-hooks'

export default function CompanyProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { profile, loading, save } = useCompanyProfile(user?.email)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    companyName: '',
    companyWebsite: '',
    companySize: '',
    industry: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    city: '',
    country: '',
    linkedIn: '',
    twitter: '',
    hiringMode: 'STANDARD',
  })

  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (profile && !initialized) {
      setForm({
        companyName: profile.companyName || '',
        companyWebsite: profile.companyWebsite || '',
        companySize: profile.companySize || '',
        industry: profile.industry || '',
        description: profile.description || '',
        contactEmail: profile.contactEmail || '',
        contactPhone: profile.contactPhone || '',
        city: profile.city || '',
        country: profile.country || '',
        linkedIn: profile.linkedIn || '',
        twitter: profile.twitter || '',
        hiringMode: profile.hiringMode || 'STANDARD',
      })
      setInitialized(true)
    }
  }, [profile, initialized])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await save(form)
      toast.success('Company profile saved successfully!')
      navigate('/employer/dashboard')
    } catch {
      toast.error('Failed to save company profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    )
  }

  return (
      <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/employer/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>

        <Card className="bg-card border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-3 text-2xl">
              <div className="w-10 h-10 flex items-center justify-center">
                <img
                  src="/images/Company%20Avatar%20Placeholder.png"
                  alt=""
                  className="max-w-full max-h-full object-contain opacity-80"
                />
              </div>
              Company Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground/80">Company Name *</Label>
                  <Input value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} required className="bg-muted border text-foreground" />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground/80">Company Website</Label>
                  <Input value={form.companyWebsite} onChange={e => setForm(f => ({ ...f, companyWebsite: e.target.value }))} className="bg-muted border text-foreground" />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground/80">Industry *</Label>
                  <Input value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} required className="bg-muted border text-foreground" />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground/80">Company Size</Label>
                  <select value={form.companySize} onChange={e => setForm(f => ({ ...f, companySize: e.target.value }))} className="w-full bg-muted border border text-foreground rounded-md px-3 py-2">
                    <option value="">Select size</option>
                    <option value="STARTUP">Startup (1-10)</option>
                    <option value="SMALL">Small (11-50)</option>
                    <option value="MEDIUM">Medium (51-200)</option>
                    <option value="LARGE">Large (201-500)</option>
                    <option value="ENTERPRISE">Enterprise (500+)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground/80">Contact Email *</Label>
                  <Input type="email" value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} required className="bg-muted border text-foreground" />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground/80">Contact Phone</Label>
                  <Input value={form.contactPhone} onChange={e => setForm(f => ({ ...f, contactPhone: e.target.value }))} className="bg-muted border text-foreground" />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground/80">City</Label>
                  <Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="bg-muted border text-foreground" />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground/80">Country</Label>
                  <Input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} className="bg-muted border text-foreground" />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground/80">LinkedIn</Label>
                  <Input value={form.linkedIn} onChange={e => setForm(f => ({ ...f, linkedIn: e.target.value }))} className="bg-muted border text-foreground" />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground/80">Twitter</Label>
                  <Input value={form.twitter} onChange={e => setForm(f => ({ ...f, twitter: e.target.value }))} className="bg-muted border text-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80">Company Description</Label>
                <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} className="bg-muted border text-foreground" />
              </div>
              <Button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 w-full">
                {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Company Profile</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      </div>
  )
}
