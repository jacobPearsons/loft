import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/providers/AuthProvider'
import api from '@/lib/api'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'

const jobSchema = z.object({
  title: z.string().min(3, 'Job title is required'),
  jobType: z.string().min(1, 'Job type is required'),
  experienceLevel: z.string().min(1, 'Experience level is required'),
  workMode: z.string().min(1, 'Work mode is required'),
  location: z.string().min(2, 'Location is required'),
  city: z.string().optional(),
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
})

type JobForm = z.infer<typeof jobSchema>

export default function CreateJob() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<JobForm>({
    resolver: zodResolver(jobSchema),
  })

  async function onSubmit(data: JobForm) {
    setSaving(true)
    try {
      await api.post(`/jobs?email=${user?.email}`, data)
      toast.success('Job posted successfully!')
      navigate('/employer/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to post job')
    } finally {
      setSaving(false)
    }
  }

  return (
      <div className="container px-4 md:px-6 py-16 sm:py-20 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Post a New Job</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input id="title" placeholder="e.g. Senior Software Engineer" {...register('title')} className={errors.title ? 'ring-2 ring-red-500' : ''} />
                  {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobType">Job Type *</Label>
                    <select id="jobType" {...register('jobType')} className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white">
                      <option value="">Select</option>
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experienceLevel">Experience *</Label>
                    <select id="experienceLevel" {...register('experienceLevel')} className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white">
                      <option value="">Select</option>
                      <option value="Entry">Entry</option>
                      <option value="Junior">Junior</option>
                      <option value="Mid">Mid</option>
                      <option value="Senior">Senior</option>
                      <option value="Lead">Lead</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workMode">Work Mode *</Label>
                    <select id="workMode" {...register('workMode')} className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white">
                      <option value="">Select</option>
                      <option value="remote">Remote</option>
                      <option value="onsite">On-site</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input id="location" placeholder="e.g. San Francisco, CA" {...register('location')} className={errors.location ? 'ring-2 ring-red-500' : ''} />
                    {errors.location && <p className="text-xs text-red-400">{errors.location.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="e.g. San Francisco" {...register('city')} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salaryMin">Salary Min</Label>
                    <Input id="salaryMin" type="number" placeholder="e.g. 80000" {...register('salaryMin')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salaryMax">Salary Max</Label>
                    <Input id="salaryMax" type="number" placeholder="e.g. 120000" {...register('salaryMax')} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea id="description" placeholder="Describe the role, responsibilities, and ideal candidate..." rows={6} {...register('description')} className={errors.description ? 'ring-2 ring-red-500' : ''} />
                  {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea id="requirements" placeholder="List key requirements and qualifications..." rows={4} {...register('requirements')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="benefits">Benefits</Label>
                  <Textarea id="benefits" placeholder="Describe benefits and perks..." rows={3} {...register('benefits')} />
                </div>

                <Button type="submit" size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={saving}>
                  {saving ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Publishing...</>
                  ) : (
                    'Post Job'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
  )
}
