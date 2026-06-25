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
import userEvent from '@testing-library/user-event'
import { StageCard, StageProgress } from '@/features/hiring-workflow/components/StageCard'
import type { HiringStage, TimelineEntry } from '@/features/hiring-workflow/types'

describe('StageCard', () => {
  it('renders stage name from config', () => {
    render(<StageCard stage={'RESUME_SCREENING'} status="current" />)
    expect(screen.getByText('Resume Screening')).toBeInTheDocument()
  })

  it('shows In Progress badge for current status', () => {
    render(<StageCard stage={'TECHNICAL_INTERVIEW'} status="current" />)
    expect(screen.getByText('In Progress')).toBeInTheDocument()
  })

  it('shows Complete badge for completed status', () => {
    render(<StageCard stage={'RESUME_SCREENING'} status="completed" />)
    expect(screen.getByText('Complete')).toBeInTheDocument()
  })

  it('shows Pending badge for pending status', () => {
    render(<StageCard stage={'ONBOARDING'} status="pending" />)
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })

  it('shows description from config', () => {
    render(<StageCard stage={'HR_INTERVIEW'} status="current" />)
    expect(screen.getByText(/screening interview with HR/)).toBeInTheDocument()
  })

  it('shows application count when provided', () => {
    render(<StageCard stage={'RESUME_SCREENING'} status="current" applicationCount={5} />)
    expect(screen.getByText('5 applicants')).toBeInTheDocument()
  })

  it('shows singular applicant when count is 1', () => {
    render(<StageCard stage={'RESUME_SCREENING'} status="current" applicationCount={1} />)
    expect(screen.getByText('1 applicant')).toBeInTheDocument()
  })

  it('fires onClick when clicked', async () => {
    const onClick = jest.fn()
    render(<StageCard stage={'RESUME_SCREENING'} status="current" onClick={onClick} />)
    const stageName = screen.getByText('Resume Screening')
    stageName.click()
    expect(onClick).toHaveBeenCalled()
  })

  it('shows date when provided', () => {
    const date = new Date('2024-01-15')
    render(<StageCard stage={'RESUME_SCREENING'} status="completed" date={date} />)
    expect(screen.getByText(/1\/15\/2024/)).toBeInTheDocument()
  })
})

describe('StageProgress', () => {
  const timeline: TimelineEntry[] = [
    { stage: 'JOB_IDENTIFIED', date: new Date(), status: 'completed' },
    { stage: 'JOB_APPLICATION', date: new Date(), status: 'completed' },
    { stage: 'APPLICATIONS_RECEIVED', date: new Date(), status: 'current' },
    { stage: 'RESUME_SCREENING', date: new Date(), status: 'pending' },
  ]

  it('renders all timeline stages', () => {
    render(<StageProgress timeline={timeline} />)
    expect(screen.getByText('Job Identified')).toBeInTheDocument()
    expect(screen.getByText('Job Application')).toBeInTheDocument()
    expect(screen.getByText('Applications Received')).toBeInTheDocument()
    expect(screen.getByText('Resume Screening')).toBeInTheDocument()
  })

  it('renders correct number of stages', () => {
    const { container } = render(<StageProgress timeline={timeline} />)
    const stageElements = container.querySelectorAll('[class*="rounded-full"]')
    expect(stageElements.length).toBeGreaterThanOrEqual(4)
  })
})
