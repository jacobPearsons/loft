jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, whileHover, whileTap, transition, exit, layout, variants, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, initial, animate, whileHover, whileTap, transition, exit, layout, variants, ...props }: any) => <section {...props}>{children}</section>,
    span: ({ children, initial, animate, whileHover, whileTap, transition, exit, layout, variants, ...props }: any) => <span {...props}>{children}</span>,
    button: ({ children, initial, animate, whileHover, whileTap, transition, exit, layout, variants, ...props }: any) => <button {...props}>{children}</button>,
    h1: ({ children, initial, animate, whileHover, whileTap, transition, exit, layout, variants, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, initial, animate, whileHover, whileTap, transition, exit, layout, variants, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, initial, animate, whileHover, whileTap, transition, exit, layout, variants, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => false,
}))

import React from 'react'
import { render, screen } from '@testing-library/react'
import { WorkflowTimeline, WorkflowProgressBar } from '@/features/hiring-workflow/components/WorkflowTimeline'
import type { TimelineEntry } from '@/features/hiring-workflow/types'

describe('WorkflowTimeline', () => {
  const timeline: TimelineEntry[] = [
    { stage: 'JOB_IDENTIFIED', date: new Date('2024-01-01'), status: 'completed' },
    { stage: 'JOB_APPLICATION', date: new Date('2024-01-10'), status: 'completed' },
    { stage: 'APPLICATIONS_RECEIVED', date: new Date('2024-01-15'), status: 'current' },
    { stage: 'RESUME_SCREENING', date: new Date(), status: 'pending' },
    { stage: 'HR_INTERVIEW', date: new Date(), status: 'pending' },
  ]

  it('renders all stages in the timeline', () => {
    render(<WorkflowTimeline timeline={timeline} />)
    expect(screen.getByText('Job Identified')).toBeInTheDocument()
    expect(screen.getByText('Job Application')).toBeInTheDocument()
    expect(screen.getByText('Applications Received')).toBeInTheDocument()
    expect(screen.getByText('Resume Screening')).toBeInTheDocument()
    expect(screen.getByText('HR Interview')).toBeInTheDocument()
  })

  it('shows dates for completed/current stages', () => {
    render(<WorkflowTimeline timeline={timeline} />)
    expect(screen.getByText('1/1/2024')).toBeInTheDocument()
    expect(screen.getByText('1/10/2024')).toBeInTheDocument()
    expect(screen.getByText('1/15/2024')).toBeInTheDocument()
  })

  it('accepts vertical orientation', () => {
    const { container } = render(<WorkflowTimeline timeline={timeline} orientation="vertical" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders with empty timeline', () => {
    const { container } = render(<WorkflowTimeline timeline={[]} />)
    expect(container.firstChild).toBeInTheDocument()
  })
})

describe('WorkflowProgressBar', () => {
  const timeline: TimelineEntry[] = [
    { stage: 'JOB_IDENTIFIED', date: new Date(), status: 'completed' },
    { stage: 'JOB_APPLICATION', date: new Date(), status: 'completed' },
    { stage: 'APPLICATIONS_RECEIVED', date: new Date(), status: 'current' },
    { stage: 'RESUME_SCREENING', date: new Date(), status: 'pending' },
  ]

  it('renders progress percentage', () => {
    render(<WorkflowProgressBar timeline={timeline} />)
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('shows Progress label', () => {
    render(<WorkflowProgressBar timeline={timeline} />)
    expect(screen.getByText('Progress')).toBeInTheDocument()
  })
})
