/**
 * Job Form Component
 * 
 * Form for creating and editing job postings.
 * Follows frontend-lifecycle: reusable, single responsibility.
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { CreateJobPayload, JobWithRelations } from '../types';
import { JOB_TYPE_LABELS, WORK_MODE_LABELS, EXPERIENCE_LEVEL_LABELS, generateSlug } from '../services/jobService';
import { cn } from '@/lib/utils';
import { 
  Briefcase, 
  Globe, 
  MapPin, 
  DollarSign, 
  Clock,
  X,
  Plus,
  Save,
  Eye
} from 'lucide-react';

interface JobFormProps {
  initialData?: JobWithRelations;
  onSubmit: (data: CreateJobPayload) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
}

const jobTypes = Object.keys(JOB_TYPE_LABELS);
const experienceLevels = Object.keys(EXPERIENCE_LEVEL_LABELS);
const workModes = Object.keys(WORK_MODE_LABELS);

export function JobForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  className,
}: JobFormProps) {
  const [formData, setFormData] = useState<CreateJobPayload>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    requirements: initialData?.requirements || '',
    benefits: initialData?.benefits || '',
    jobType: initialData?.jobType || 'FULL_TIME',
    experienceLevel: initialData?.experienceLevel || 'MID',
    workMode: initialData?.workMode || 'REMOTE',
    location: initialData?.location || '',
    city: initialData?.city || '',
    country: initialData?.country || '',
    remoteWork: initialData?.remoteWork || false,
    salaryMin: initialData?.salaryMin,
    salaryMax: initialData?.salaryMax,
    salaryCurrency: initialData?.salaryCurrency || 'USD',
    salaryPeriod: initialData?.salaryPeriod || 'YEARLY',
    isSalaryVisible: initialData?.isSalaryVisible ?? true,
    requiredSkills: initialData?.requiredSkills || [],
    preferredSkills: initialData?.preferredSkills || [],
    applicationUrl: initialData?.applicationUrl || '',
    applicationEmail: initialData?.applicationEmail || '',
    deadline: initialData?.deadline,
  });

  const [requiredSkillInput, setRequiredSkillInput] = useState('');
  const [preferredSkillInput, setPreferredSkillInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (field: keyof CreateJobPayload, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addRequiredSkill = () => {
    if (requiredSkillInput.trim()) {
      handleChange('requiredSkills', [...(formData.requiredSkills || []), requiredSkillInput.trim()]);
      setRequiredSkillInput('');
    }
  };

  const removeRequiredSkill = (skill: string) => {
    handleChange('requiredSkills', formData.requiredSkills?.filter(s => s !== skill));
  };

  const addPreferredSkill = () => {
    if (preferredSkillInput.trim()) {
      handleChange('preferredSkills', [...(formData.preferredSkills || []), preferredSkillInput.trim()]);
      setPreferredSkillInput('');
    }
  };

  const removePreferredSkill = (skill: string) => {
    handleChange('preferredSkills', formData.preferredSkills?.filter(s => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className={cn('space-y-6', className)}>
      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <Card className="bg-card/50 border-border mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Basic Information</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter the basic details about the position
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-foreground/80">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g., Senior Software Engineer"
                className="bg-muted border-border text-foreground mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-foreground/80">Job Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe the role and responsibilities..."
                className="bg-muted border-border text-foreground mt-1 min-h-[120px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="requirements" className="text-foreground/80">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => handleChange('requirements', e.target.value)}
                  placeholder="List the job requirements..."
                  className="bg-muted border-border text-foreground mt-1"
                />
              </div>
              <div>
                <Label htmlFor="benefits" className="text-foreground/80">Benefits</Label>
                <Textarea
                  id="benefits"
                  value={formData.benefits}
                  onChange={(e) => handleChange('benefits', e.target.value)}
                  placeholder="List the benefits and perks..."
                  className="bg-muted border-border text-foreground mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Details */}
        <Card className="bg-card/50 border-border mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Job Details</CardTitle>
            <CardDescription className="text-muted-foreground">
              Specify the type, level, and work mode
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-foreground/80">Job Type *</Label>
                <select
                  value={formData.jobType}
                  onChange={(e) => handleChange('jobType', e.target.value)}
                  className="w-full bg-muted border border-border rounded-md px-3 py-2 text-foreground mt-1"
                  required
                >
                  {jobTypes.map(type => (
                    <option key={type} value={type}>
                      {JOB_TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-foreground/80">Experience Level *</Label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => handleChange('experienceLevel', e.target.value)}
                  className="w-full bg-muted border border-border rounded-md px-3 py-2 text-foreground mt-1"
                  required
                >
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>
                      {EXPERIENCE_LEVEL_LABELS[level]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-foreground/80">Work Mode *</Label>
                <select
                  value={formData.workMode}
                  onChange={(e) => handleChange('workMode', e.target.value)}
                  className="w-full bg-muted border border-border rounded-md px-3 py-2 text-foreground mt-1"
                  required
                >
                  {workModes.map(mode => (
                    <option key={mode} value={mode}>
                      {WORK_MODE_LABELS[mode]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Switch
                id="remoteWork"
                checked={formData.remoteWork}
                onCheckedChange={(checked) => handleChange('remoteWork', checked)}
              />
              <Label htmlFor="remoteWork" className="text-foreground/80">Remote position</Label>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="bg-card/50 border-border mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Location</CardTitle>
            <CardDescription className="text-muted-foreground">
              Where will the employee be working?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city" className="text-foreground/80">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="e.g., San Francisco"
                  className="bg-muted border-border text-foreground mt-1"
                />
              </div>
              <div>
                <Label htmlFor="country" className="text-foreground/80">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  placeholder="e.g., USA"
                  className="bg-muted border-border text-foreground mt-1"
                />
              </div>
              <div>
                <Label htmlFor="location" className="text-foreground/80">Address</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Full address"
                  className="bg-muted border-border text-foreground mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Salary */}
        <Card className="bg-card/50 border-border mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Compensation</CardTitle>
            <CardDescription className="text-muted-foreground">
              Set the salary range for this position
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Switch
                id="isSalaryVisible"
                checked={formData.isSalaryVisible}
                onCheckedChange={(checked) => handleChange('isSalaryVisible', checked)}
              />
              <Label htmlFor="isSalaryVisible" className="text-foreground/80">Show salary on job posting</Label>
            </div>

            {formData.isSalaryVisible && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="salaryMin" className="text-foreground/80">Minimum</Label>
                  <Input
                    id="salaryMin"
                    type="number"
                    value={formData.salaryMin || ''}
                    onChange={(e) => handleChange('salaryMin', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="50000"
                    className="bg-muted border-border text-foreground mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="salaryMax" className="text-foreground/80">Maximum</Label>
                  <Input
                    id="salaryMax"
                    type="number"
                    value={formData.salaryMax || ''}
                    onChange={(e) => handleChange('salaryMax', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="80000"
                    className="bg-muted border-border text-foreground mt-1"
                  />
                </div>
                <div>
                  <Label className="text-foreground/80">Currency</Label>
                  <select
                    value={formData.salaryCurrency}
                    onChange={(e) => handleChange('salaryCurrency', e.target.value)}
                    className="w-full bg-muted border border-border rounded-md px-3 py-2 text-foreground mt-1"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                <div>
                  <Label className="text-foreground/80">Period</Label>
                  <select
                    value={formData.salaryPeriod}
                    onChange={(e) => handleChange('salaryPeriod', e.target.value)}
                    className="w-full bg-muted border border-border rounded-md px-3 py-2 text-foreground mt-1"
                  >
                    <option value="YEARLY">Yearly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="HOURLY">Hourly</option>
                  </select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="bg-card/50 border-border mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Skills</CardTitle>
            <CardDescription className="text-muted-foreground">
              Required and preferred skills for this position
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-foreground/80">Required Skills</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={requiredSkillInput}
                  onChange={(e) => setRequiredSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequiredSkill())}
                  placeholder="Add a skill and press Enter"
                  className="bg-muted border-border text-foreground"
                />
                <Button type="button" onClick={addRequiredSkill} variant="outline" className="border-border">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.requiredSkills?.map(skill => (
                  <Badge key={skill} variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeRequiredSkill(skill)}
                      className="ml-1 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-foreground/80">Preferred Skills</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={preferredSkillInput}
                  onChange={(e) => setPreferredSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPreferredSkill())}
                  placeholder="Add a skill and press Enter"
                  className="bg-muted border-border text-foreground"
                />
                <Button type="button" onClick={addPreferredSkill} variant="outline" className="border-border">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.preferredSkills?.map(skill => (
                  <Badge key={skill} variant="secondary" className="bg-blue-500/20 text-blue-400">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removePreferredSkill(skill)}
                      className="ml-1 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Details */}
        <Card className="bg-card/50 border-border mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Application</CardTitle>
            <CardDescription className="text-muted-foreground">
              How candidates should apply
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="applicationUrl" className="text-foreground/80">Application URL</Label>
                <Input
                  id="applicationUrl"
                  value={formData.applicationUrl}
                  onChange={(e) => handleChange('applicationUrl', e.target.value)}
                  placeholder="https://..."
                  className="bg-muted border-border text-foreground mt-1"
                />
              </div>
              <div>
                <Label htmlFor="applicationEmail" className="text-foreground/80">Application Email</Label>
                <Input
                  id="applicationEmail"
                  type="email"
                  value={formData.applicationEmail}
                  onChange={(e) => handleChange('applicationEmail', e.target.value)}
                  placeholder="jobs@company.com"
                  className="bg-muted border-border text-foreground mt-1"
                />
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="deadline" className="text-foreground/80">Application Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline ? new Date(formData.deadline).toISOString().split('T')[0] : ''}
                onChange={(e) => handleChange('deadline', e.target.value ? new Date(e.target.value) : undefined)}
                className="bg-muted border-border text-foreground mt-1 w-auto"
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} className="border-border">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {initialData ? 'Update Job' : 'Create Job'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default JobForm;
