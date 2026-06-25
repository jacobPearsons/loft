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
import { JobList } from '@/features/job-management/components/JobList'
import type { JobSummary } from '@/features/job-management/types'

const mockJobs: JobSummary[] = [
  {
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
  },
  {
    id: 2,
    title: 'Frontend Developer',
    slug: 'frontend-developer',
    jobType: 'FULL_TIME',
    experienceLevel: 'MID',
    workMode: 'HYBRID',
    location: 'New York, NY',
    remoteWork: false,
    salaryMin: 100000,
    salaryMax: 130000,
    salaryCurrency: 'USD',
    status: 'DRAFT',
    isFeatured: false,
    isActive: true,
    viewsCount: 0,
    applicationsCount: 0,
    createdAt: new Date('2024-02-01'),
  },
]

describe('JobList', () => {
  it('renders list of job cards', () => {
    render(<JobList jobs={mockJobs} />)
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument()
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
  })

  it('shows job count', () => {
    render(<JobList jobs={mockJobs} />)
    expect(screen.getByText(/2 jobs/)).toBeInTheDocument()
  })

  it('shows empty state when no jobs', () => {
    render(<JobList jobs={[]} />)
    expect(screen.getByText('No jobs found')).toBeInTheDocument()
  })

  it('shows loading spinner when loading', () => {
    render(<JobList jobs={[]} loading={true} />)
    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('filters jobs by status', async () => {
    const user = userEvent.setup()
    render(<JobList jobs={mockJobs} />)
    const filterButton = screen.getByText('Filters')
    await user.click(filterButton)
    const draftButtons = screen.getAllByText('Draft')
    const filterDraftBtn = draftButtons.find(btn => btn.tagName === 'BUTTON')
    if (filterDraftBtn) {
      await user.click(filterDraftBtn)
    }
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
    expect(screen.queryByText('Senior Software Engineer')).not.toBeInTheDocument()
  })

  it('shows Post Job button when onCreateJob provided', () => {
    render(<JobList jobs={mockJobs} onCreateJob={jest.fn()} />)
    expect(screen.getByText('Post Job')).toBeInTheDocument()
  })

  it('filters jobs by search query', async () => {
    const user = userEvent.setup()
    render(<JobList jobs={mockJobs} />)
    const searchInput = screen.getByPlaceholderText('Search jobs...')
    await user.type(searchInput, 'Frontend')
    expect(screen.queryByText('Senior Software Engineer')).not.toBeInTheDocument()
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
  })

  it('shows clear filters when no results and filters are active', async () => {
    const user = userEvent.setup()
    render(<JobList jobs={mockJobs} />)
    const searchInput = screen.getByPlaceholderText('Search jobs...')
    await user.type(searchInput, 'Nonexistent Job')
    expect(screen.getByText('No jobs found')).toBeInTheDocument()
    expect(screen.getByText('Clear filters')).toBeInTheDocument()
  })

  it('calls onJobClick when job card is clicked', () => {
    const onJobClick = jest.fn()
    render(<JobList jobs={mockJobs} onJobClick={onJobClick} />)
    const title = screen.getByText('Senior Software Engineer')
    title.click()
    expect(onJobClick).toHaveBeenCalledWith(mockJobs[0])
  })

  it('toggles filters panel', async () => {
    const user = userEvent.setup()
    render(<JobList jobs={mockJobs} />)
    const filterButton = screen.getByText('Filters')
    await user.click(filterButton)
    expect(screen.getByText('All Jobs')).toBeInTheDocument()
  })
})
