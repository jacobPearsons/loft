'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  X,
  Send,
  CheckCircle,
  Upload,
  Building,
  Globe,
  FileText,
  Trash2,
  Loader2,
} from 'lucide-react'
import { UploadButton } from '@uploadthing/react'
import type { OurFileRouter } from '@/app/api/uploadthing/core'

export interface JobApplicationData {
  id?: number
  title: string
  company: string
  location?: string
  jobType?: string
  salaryRange?: string
  description?: string
  requiredSkills?: string[]
  benefits?: string[]
  remoteWork?: boolean
  workMode?: string
}

interface ApplyJobModalProps {
  isOpen: boolean
  onClose: () => void
  job?: JobApplicationData
  onSubmit: (applicationData: {
    jobId: number | undefined
    jobTitle: string
    companyName: string
    coverLetter: string
    resumeUrl?: string
  }) => Promise<void>
  isSubmitting?: boolean
}

const ApplyJobModal: React.FC<ApplyJobModalProps> = ({
  isOpen,
  onClose,
  job,
  onSubmit,
  isSubmitting = false,
}) => {
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [resumeUrl, setResumeUrl] = useState('')
  const [resumeFileName, setResumeFileName] = useState('')
  const [uploadingResume, setUploadingResume] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const requiredSkills = job?.requiredSkills || []
  const benefits = job?.benefits || []

  const handleApplyClick = () => {
    setShowApplicationForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit({
        jobId: job?.id,
        jobTitle: job?.title || '',
        companyName: job?.company || '',
        coverLetter,
        resumeUrl: resumeUrl || undefined,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setShowApplicationForm(false)
    setCoverLetter('')
    setResumeUrl('')
    setResumeFileName('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-white text-2xl font-bold focus:outline-none z-10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-4 sm:p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                {job?.title || 'Job Title Not Available'}
              </h2>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                {job?.company && (
                  <div className="flex items-center text-neutral-300">
                    <Building className="w-4 h-4 mr-2 text-emerald-500" />
                    {job.company}
                  </div>
                )}

                {job?.location && (
                  <div className="flex items-center text-neutral-300">
                    <MapPin className="w-4 h-4 mr-2 text-emerald-500" />
                    {job.location}
                  </div>
                )}

                {job?.remoteWork && (
                  <div className="flex items-center text-emerald-400">
                    <Globe className="w-4 h-4 mr-2" />
                    Remote
                  </div>
                )}

                {job?.jobType && (
                  <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium">
                    {job.jobType}
                  </span>
                )}
              </div>

              {job?.salaryRange && (
                <div className="flex items-center text-emerald-400 font-bold text-lg">
                  <DollarSign className="w-5 h-5 mr-2" />
                  {job.salaryRange}
                </div>
              )}
            </div>

            {job?.description && !showApplicationForm && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-3">Job Description</h3>
                <p className="text-neutral-300 leading-relaxed">
                  {job.description}
                </p>
              </div>
            )}

            {requiredSkills.length > 0 && !showApplicationForm && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {requiredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-neutral-800 text-neutral-300 px-3 py-1 rounded-full text-sm font-medium border border-neutral-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {benefits.length > 0 && !showApplicationForm && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-white mb-3">Benefits</h3>
                <ul className="space-y-2">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start text-neutral-300">
                      <CheckCircle className="w-4 h-4 mr-2 mt-1 text-emerald-500 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {showApplicationForm ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6 pb-4 border-b border-neutral-800">
                  <h3 className="text-lg font-bold text-white mb-2">Apply for this Position</h3>
                  <p className="text-neutral-400 text-sm">
                    Submit your application for {job?.title} at {job?.company}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Resume (PDF)
                    </label>
                    {resumeUrl ? (
                      <div className="flex items-center gap-3 bg-neutral-800 border border-neutral-700 rounded-lg p-3">
                        <FileText className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm truncate">{resumeFileName || 'Resume uploaded'}</p>
                          <p className="text-xs text-neutral-400">Uploaded successfully</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setResumeUrl(''); setResumeFileName('') }}
                          className="text-neutral-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="bg-neutral-800 border border-dashed border-neutral-700 rounded-lg p-4">
                        <UploadButton<OurFileRouter, "resumeUploader">
                          endpoint="resumeUploader"
                          onUploadBegin={() => setUploadingResume(true)}
                          onClientUploadComplete={(res) => {
                            if (res?.[0]) {
                              setResumeUrl(res[0].url)
                              setResumeFileName(res[0].name || 'Resume')
                            }
                            setUploadingResume(false)
                          }}
                          onUploadError={() => setUploadingResume(false)}
                          appearance={{
                            button:
                              "bg-emerald-600 hover:bg-emerald-700 text-white text-sm py-2 px-4 rounded-lg transition-colors",
                            allowedContent: "text-neutral-500 text-xs mt-1",
                          }}
                          content={{
                            button: uploadingResume ? 'Uploading...' : 'Choose Resume PDF',
                            allowedContent: 'PDF up to 8MB',
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Cover Letter
                    </label>
                    <Textarea
                      placeholder="Tell us why you are excited about this opportunity and why you would be a great fit..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-emerald-500 focus:ring-emerald-500 min-h-[150px]"
                      maxLength={500}
                    />
                    <p className="text-xs text-neutral-500 mt-1 flex justify-between">
                      <span>Tell the employer why you are a great fit</span>
                      <span>{coverLetter.length}/500</span>
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowApplicationForm(false)}
                      className="flex-1 border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                      disabled={submitting || isSubmitting}
                    >
                      Back to Details
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        submitting ||
                        isSubmitting ||
                        coverLetter.length > 500 ||
                        uploadingResume
                      }
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting || isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <button
                onClick={handleApplyClick}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center text-lg"
              >
                <Upload className="w-5 h-5 mr-2" />
                Apply for This Position
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ApplyJobModal
