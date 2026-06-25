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
import { ApplicationList } from '@/features/hiring-workflow/components/ApplicationList'
import type { Application } from '@/features/hiring-workflow/types'

const mockApplications: Application[] = [
  {
    id: 1,
    userId: 'user1',
    jobId: 1,
    job: { id: 1, title: 'Software Engineer', slug: 'se', description: '' } as any,
    status: 'PENDING',
    englishTestRequired: false,
    appliedAt: new Date('2024-01-15'),
  },
  {
    id: 2,
    userId: 'user2',
    jobId: 1,
    job: { id: 1, title: 'Frontend Developer', slug: 'fe', description: '' } as any,
    status: 'REVIEWING',
    englishTestRequired: false,
    appliedAt: new Date('2024-01-20'),
  },
]

describe('ApplicationList', () => {
  it('renders list of applications', () => {
    render(<ApplicationList applications={mockApplications} />)
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
  })

  it('shows application count', () => {
    render(<ApplicationList applications={mockApplications} />)
    expect(screen.getByText('2 applications')).toBeInTheDocument()
  })

  it('shows empty state when no applications', () => {
    render(<ApplicationList applications={[]} />)
    expect(screen.getByText('No applications found')).toBeInTheDocument()
  })

  it('shows loading spinner when loading', () => {
    render(<ApplicationList applications={[]} loading={true} />)
    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('filters applications by search query', async () => {
    const user = userEvent.setup()
    render(<ApplicationList applications={mockApplications} />)
    const searchInput = screen.getByPlaceholderText('Search applications...')
    await user.type(searchInput, 'Frontend')
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
    expect(screen.queryByText('Software Engineer')).not.toBeInTheDocument()
  })

  it('calls onApplicationClick when application card is clicked', async () => {
    const onApplicationClick = jest.fn()
    render(<ApplicationList applications={mockApplications} onApplicationClick={onApplicationClick} />)
    const title = screen.getByText('Software Engineer')
    title.click()
    expect(onApplicationClick).toHaveBeenCalledWith(mockApplications[0])
  })

  it('toggles filter panel visibility', async () => {
    const user = userEvent.setup()
    render(<ApplicationList applications={mockApplications} />)
    const filterButton = screen.getByText('Filters')
    await user.click(filterButton)
    expect(screen.getByText('All')).toBeInTheDocument()
  })

  it('clears search from empty state', async () => {
    const user = userEvent.setup()
    render(<ApplicationList applications={mockApplications} />)
    const searchInput = screen.getByPlaceholderText('Search applications...')
    await user.type(searchInput, 'Nonexistent')
    expect(screen.getByText('No applications found')).toBeInTheDocument()
    const clearButton = screen.getByText('Clear search')
    await user.click(clearButton)
    expect(screen.getByText('2 applications')).toBeInTheDocument()
  })
})
