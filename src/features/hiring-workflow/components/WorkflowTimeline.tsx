/**
 * Workflow Timeline Component
 * 
 * Visual timeline showing all stages of the hiring workflow.
 * Follows frontend-lifecycle rules: reusable component with single responsibility.
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TimelineEntry, HiringStage } from '../types';
import { STAGE_CONFIG } from '../services/hiringService';
import { cn } from '@/lib/utils';

interface WorkflowTimelineProps {
  timeline: TimelineEntry[];
  currentStage?: HiringStage;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

const statusColors = {
  completed: {
    bg: 'bg-emerald-500',
    border: 'border-emerald-500',
    text: 'text-emerald-400',
    dot: 'bg-emerald-500',
  },
  current: {
    bg: 'bg-blue-500',
    border: 'border-blue-500',
    text: 'text-blue-400',
    dot: 'bg-blue-500',
  },
  pending: {
    bg: 'bg-neutral-600',
    border: 'border-neutral-600',
    text: 'text-muted-foreground',
    dot: 'bg-neutral-600',
  },
};

export function WorkflowTimeline({
  timeline,
  currentStage,
  className,
  orientation = 'horizontal',
}: WorkflowTimelineProps) {
  return (
    <div className={cn(
      orientation === 'horizontal' 
        ? 'flex flex-col md:flex-row' 
        : 'flex flex-col',
      'gap-4',
      className
    )}>
      {timeline.map((entry, index) => {
        const config = STAGE_CONFIG[entry.stage];
        const colors = statusColors[entry.status];
        
        return (
          <motion.div
            key={entry.stage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              'relative flex items-center gap-4',
              orientation === 'horizontal' ? 'flex-row md:basis-1/4' : 'flex-col'
            )}
          >
            {/* Connector Line */}
            {index < timeline.length - 1 && orientation === 'horizontal' && (
              <div className="hidden md:block absolute top-5 left-1/2 w-full h-0.5 bg-muted -translate-y-1/2" />
            )}
            {index < timeline.length - 1 && orientation === 'vertical' && (
              <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-muted -translate-x-1/2" />
            )}
            
            {/* Stage Indicator */}
            <div className={cn(
              'relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2',
              colors.bg,
              colors.border,
              'shrink-0'
            )}>
              {entry.status === 'completed' ? (
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : entry.status === 'current' ? (
                <div className={cn('w-3 h-3 rounded-full', colors.dot)} />
              ) : (
                <span className="text-xs font-medium text-foreground">{config.order}</span>
              )}
            </div>
            
            {/* Stage Info */}
            <div className={cn(
              'flex flex-col',
              orientation === 'horizontal' ? 'md:items-center md:text-center' : 'items-start'
            )}>
              <span className={cn(
                'font-medium text-sm',
                entry.status === 'current' ? 'text-foreground' : colors.text
              )}>
                {config.name}
              </span>
              {entry.date && (
                <span className="text-xs text-muted-foreground">
                  {new Date(entry.date).toLocaleDateString()}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/**
 * Simplified horizontal progress bar for workflow
 */
interface WorkflowProgressBarProps {
  timeline: TimelineEntry[];
  className?: string;
}

export function WorkflowProgressBar({ timeline, className }: WorkflowProgressBarProps) {
  const completedCount = timeline.filter(t => t.status === 'completed').length;
  const progress = Math.round((completedCount / timeline.length) * 100);
  
  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-muted-foreground">Progress</span>
        <span className="text-sm font-medium text-white">{progress}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-emerald-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="flex justify-between mt-2">
        {timeline.slice(0, 5).map((entry, index) => (
          <div
            key={entry.stage}
            className={cn(
              'w-2 h-2 rounded-full',
              entry.status === 'completed' ? 'bg-emerald-500' :
              entry.status === 'current' ? 'bg-blue-500' : 'bg-muted'
            )}
          />
        ))}
      </div>
    </div>
  );
}

export default WorkflowTimeline;
