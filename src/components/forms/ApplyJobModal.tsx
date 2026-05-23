/**
 * ApplyJobModal Component
 * 
 * Modal for displaying job details and submitting job applications.
 * Follows frontend-lifecycle: single responsibility, reusable, UI composition.
 * Uses Framer Motion for animations as per animation lifecycle.
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
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
  Globe
} from 'lucide-react';

// Job type for the modal
export interface JobApplicationData {
  id?: number;
  title: string;
  company: string;
  location?: string;
  jobType?: string;
  salaryRange?: string;
  description?: string;
  requiredSkills?: string[];
  benefits?: string[];
  remoteWork?: boolean;
  workMode?: string;
}

interface ApplyJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job?: JobApplicationData;
  onSubmit: (applicationData: {
    jobId: number | undefined;
    jobTitle: string;
    companyName: string;
    coverLetter: string;
    resumeUrl?: string;
  }) => void;
  isSubmitting?: boolean;
}

/**
 * ApplyJobModal - Displays job details and handles job application submission
 * 
 * Follows lifecycle phases:
 * - UI Composition: Hierarchical component structure
 * - Animation Layer: Framer Motion transitions
 * - Interaction Layer: Event handlers call parent callbacks
 * - State Initialization: Local form state management
 */
const ApplyJobModal: React.FC<ApplyJobModalProps> = ({
  isOpen,
  onClose,
  job,
  onSubmit,
  isSubmitting = false
}) => {
  // State for application form
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  // Safely get array fields with defaults
  const requiredSkills = job?.requiredSkills || [];
  const benefits = job?.benefits || [];

  // Handle apply button click - shows the application form
  const handleApplyClick = () => {
    setShowApplicationForm(true);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      jobId: job?.id,
      jobTitle: job?.title || '',
      companyName: job?.company || '',
      coverLetter,
      resumeUrl: resumeUrl || undefined
    });
  };

  // Handle close - reset form state
  const handleClose = () => {
    setShowApplicationForm(false);
    setCoverLetter('');
    setResumeUrl('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-white text-2xl font-bold focus:outline-none z-10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-8">
            {/* Header Section */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                {job?.title || 'Job Title Not Available'}
              </h2>

              {/* Job Attributes */}
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

              {/* Salary Range */}
              {job?.salaryRange && (
                <div className="flex items-center text-emerald-400 font-bold text-lg">
                  <DollarSign className="w-5 h-5 mr-2" />
                  {job.salaryRange}
                </div>
              )}
            </div>

            {/* Job Description Section */}
            {job?.description && !showApplicationForm && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-3">Job Description</h3>
                <p className="text-neutral-300 leading-relaxed">
                  {job.description}
                </p>
              </div>
            )}

            {/* Required Skills Section */}
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

            {/* Benefits Section */}
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

            {/* Application Form Section */}
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
                  {/* Resume URL */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Resume Link (LinkedIn, Portfolio, etc.)
                    </label>
                    <Input
                      type="url"
                      placeholder="https://linkedin.com/in/yourprofile or https://yourportfolio.com"
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                      className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-emerald-500 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Cover Letter
                    </label>
                    <Textarea
                      placeholder="Tell us why you are excited about this opportunity and why you would be a great fit..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-emerald-500 focus:ring-emerald-500 min-h-[150px]"
                      required
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      Minimum 50 characters. Be specific about why you are interested in this role.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowApplicationForm(false)}
                      className="flex-1 border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                      disabled={isSubmitting}
                    >
                      Back to Details
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || coverLetter.length < 50}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
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
              /* Apply Button - Shows when not in form mode */
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
  );
};

export default ApplyJobModal;
