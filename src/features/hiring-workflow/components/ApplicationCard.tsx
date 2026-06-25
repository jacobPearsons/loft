/**
 * Application Card Component
 * 
 * Card component for displaying application details.
 * Follows frontend-lifecycle rules: reusable component with single responsibility.
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Application, ApplicationStatus } from '../types';
import { STAGE_CONFIG } from '../services/hiringService';
import { cn } from '@/lib/utils';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Mail, 
  User,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface ApplicationCardProps {
  application: Application;
  onClick?: () => void;
  onStatusChange?: (status: ApplicationStatus) => void;
  showActions?: boolean;
  className?: string;
  onScheduleInterview?: () => void;
}

const statusConfig: Record<ApplicationStatus, { 
  label: string; 
  color: string; 
  bgColor: string;
  icon: React.ReactNode;
}> = {
  PENDING: {
    label: 'Pending Review',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    icon: <Clock className="w-4 h-4" />,
  },
  REVIEWING: {
    label: 'Under Review',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    icon: <FileText className="w-4 h-4" />,
  },
  SHORTLISTED: {
    label: 'Shortlisted',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    icon: <CheckCircle className="w-4 h-4" />,
  },
  INTERVIEW: {
    label: 'Interview Stage',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-400/10',
    icon: <User className="w-4 h-4" />,
  },
  OFFERED: {
    label: 'Offer Extended',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
    icon: <Mail className="w-4 h-4" />,
  },
  HIRED: {
    label: 'Hired',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    icon: <CheckCircle className="w-4 h-4" />,
  },
  REJECTED: {
    label: 'Not Selected',
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    icon: <XCircle className="w-4 h-4" />,
  },
  WITHDRAWN: {
    label: 'Withdrawn',
    color: 'text-neutral-400',
    bgColor: 'bg-neutral-400/10',
    icon: <AlertCircle className="w-4 h-4" />,
  },
};

const statusToStage: Record<ApplicationStatus, string> = {
  PENDING: 'APPLICATIONS_RECEIVED',
  REVIEWING: 'RESUME_SCREENING',
  SHORTLISTED: 'HR_INTERVIEW',
  INTERVIEW: 'TECHNICAL_INTERVIEW',
  OFFERED: 'OFFER_LETTER',
  HIRED: 'HIRING',
  REJECTED: 'RESUME_SCREENING',
  WITHDRAWN: 'JOB_APPLICATION',
};

export function ApplicationCard({
  application,
  onClick,
  onStatusChange,
  showActions = true,
  className,
  onScheduleInterview,
}: ApplicationCardProps) {
  const status = statusConfig[application.status];
  const stage = STAGE_CONFIG[statusToStage[application.status] as keyof typeof STAGE_CONFIG];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={cn(
          'bg-neutral-900/50 border-neutral-800 hover:border-emerald-500/30 transition-all cursor-pointer',
          className
        )}
        onClick={onClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg text-white">
                {application.job?.title || 'Job Title'}
              </CardTitle>
              <p className="text-neutral-400 text-sm mt-1">
                Applied {new Date(application.appliedAt).toLocaleDateString()}
              </p>
            </div>
            <Badge className={cn('flex items-center gap-1', status.bgColor, status.color)}>
              {status.icon}
              {status.label}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Current Stage */}
          <div className="p-3 bg-neutral-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-neutral-300">
                Current Stage: <span className="font-medium text-white">{stage?.name || 'Application'}</span>
              </span>
            </div>
          </div>
          
          {/* Timeline Dates */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {application.reviewedAt && (
              <div className="flex items-center gap-2 text-neutral-400">
                <Calendar className="w-4 h-4" />
                <span>Reviewed: {new Date(application.reviewedAt).toLocaleDateString()}</span>
              </div>
            )}
            {application.interviewAt && (
              <div className="flex items-center gap-2 text-neutral-400">
                <Clock className="w-4 h-4" />
                <span>Interview: {new Date(application.interviewAt).toLocaleDateString()}</span>
              </div>
            )}
            {application.acceptedAt && (
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                <span>Accepted: {new Date(application.acceptedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          
          {/* Skills Test Score */}
          {application.englishTestRequired && application.englishTestScore && (
            <div className="flex items-center justify-between p-3 bg-neutral-800/30 rounded-lg">
              <span className="text-sm text-neutral-400">Skills Assessment</span>
              <Badge variant="outline" className="border-neutral-700">
                Score: {application.englishTestScore}
              </Badge>
            </div>
          )}
          
          {/* Notes */}
          {application.employerNotes && (
            <div className="p-3 bg-neutral-800/30 rounded-lg">
              <p className="text-xs text-neutral-500 mb-1">Notes</p>
              <p className="text-sm text-neutral-300 line-clamp-2">
                {application.employerNotes}
              </p>
            </div>
          )}
          
          {/* Actions */}
          {showActions && onStatusChange && (
            <div className="flex gap-2 pt-2 border-t border-neutral-800">
              {application.status === 'PENDING' && (
                <Button 
                  size="sm" 
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange('REVIEWING');
                  }}
                >
                  Start Review
                </Button>
              )}
              {application.status === 'REVIEWING' && (
                <>
                  <Button 
                    size="sm" 
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange('SHORTLISTED');
                    }}
                  >
                    Shortlist
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-neutral-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange('REJECTED');
                    }}
                  >
                    Reject
                  </Button>
                </>
              )}
              {application.status === 'SHORTLISTED' && (
                <Button 
                  size="sm" 
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onScheduleInterview) {
                      onScheduleInterview();
                    } else {
                      onStatusChange('INTERVIEW');
                    }
                  }}
                >
                  Schedule Interview
                </Button>
              )}
              {application.status === 'INTERVIEW' && (
                <Button 
                  size="sm" 
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange('OFFERED');
                  }}
                >
                  Extend Offer
                </Button>
              )}
              {application.status === 'OFFERED' && (
                <Button 
                  size="sm" 
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange('HIRED');
                  }}
                >
                  Confirm Hire
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ApplicationCard;
