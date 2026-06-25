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
import { JobCard } from '@/features/job-management/components/JobCard'
import type { JobSummary } from '@/features/job-management/types'

const mockJob: JobSummary = {
  id: 1,
  title: 'Senior Software Engineer',
  slug: 'senior-software-engineer',
  jobType: 'FULL_TIME',
  experienceLevel: 'SENIOR',
  workMode: 'REMOTE',
  location: 'San Francisco, CA',
  remoteWork: true,
  salaryMin: 150000,
  salaryMax: 200000,
  salaryCurrency: 'USD',
  status: 'PUBLISHED',
  isFeatured: false,
  isActive: true,
  viewsCount: 120,
  applicationsCount: 15,
  createdAt: new Date('2024-01-01'),
}

describe('JobCard', () => {
  it('renders job title', () => {
    render(<JobCard job={mockJob} />)
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument()
  })

  it('renders job type label', () => {
    render(<JobCard job={mockJob} />)
    expect(screen.getByText(/Full Time/)).toBeInTheDocument()
  })

  it('renders location as Remote when remoteWork is true', () => {
    render(<JobCard job={mockJob} />)
    const remoteElements = screen.getAllByText('Remote')
    const locationEl = remoteElements.find(el => el.className.includes('emerald'))
    expect(locationEl).toBeTruthy()
  })

  it('renders salary range', () => {
    render(<JobCard job={mockJob} />)
    expect(screen.getByText(/\$150,000/)).toBeInTheDocument()
    expect(screen.getByText(/\$200,000/)).toBeInTheDocument()
  })

  it('renders status badge', () => {
    render(<JobCard job={mockJob} />)
    expect(screen.getByText('Published')).toBeInTheDocument()
  })

  it('renders stats (views and applications)', () => {
    render(<JobCard job={mockJob} />)
    expect(screen.getByText(/120 views/)).toBeInTheDocument()
    expect(screen.getByText(/15 applications/)).toBeInTheDocument()
  })

  it('shows Edit button when onEdit provided', () => {
    render(<JobCard job={mockJob} onEdit={jest.fn()} />)
    expect(screen.getByText('Edit')).toBeInTheDocument()
  })

  it('fires onClick when card is clicked', async () => {
    const onClick = jest.fn()
    render(<JobCard job={mockJob} onClick={onClick} />)
    const title = screen.getByText('Senior Software Engineer')
    title.click()
    expect(onClick).toHaveBeenCalled()
  })

  it('fires onEdit when edit button clicked', async () => {
    const onEdit = jest.fn()
    render(<JobCard job={mockJob} onEdit={onEdit} />)
    const editButton = screen.getByText('Edit')
    editButton.click()
    expect(onEdit).toHaveBeenCalled()
  })

  it('shows featured star when job is featured', () => {
    const featuredJob = { ...mockJob, isFeatured: true }
    render(<JobCard job={featuredJob} />)
    const starIcon = document.querySelector('.text-yellow-400')
    expect(starIcon).toBeInTheDocument()
  })

  it('shows View button for published jobs', () => {
    render(<JobCard job={mockJob} />)
    expect(screen.getByText('View')).toBeInTheDocument()
  })
})
