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
import { ApplicationCard } from '@/features/hiring-workflow/components/ApplicationCard'
import { Application } from '@/features/hiring-workflow/types'

const mockApplication: Application = {
  id: 1,
  userId: 'user1',
  jobId: 1,
  job: { id: 1, title: 'Software Engineer', slug: 'software-engineer', description: 'Build stuff' } as any,
  status: 'PENDING',
  englishTestRequired: false,
  appliedAt: new Date('2024-01-15'),
  candidate: {
    id: 'cand1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
  },
}

describe('ApplicationCard', () => {
  it('renders job title and application date', () => {
    render(<ApplicationCard application={mockApplication} />)
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()
    expect(screen.getByText(/Applied/)).toBeInTheDocument()
  })

  it('shows status badge', () => {
    render(<ApplicationCard application={mockApplication} />)
    expect(screen.getByText('Pending Review')).toBeInTheDocument()
  })

  it('shows Current Stage section', () => {
    render(<ApplicationCard application={mockApplication} />)
    expect(screen.getByText(/Applications Received/)).toBeInTheDocument()
  })

  it('shows Start Review button for PENDING status', () => {
    const onStatusChange = jest.fn()
    render(<ApplicationCard application={mockApplication} onStatusChange={onStatusChange} />)
    expect(screen.getByText('Start Review')).toBeInTheDocument()
  })

  it('fires onClick when card is clicked', async () => {
    const onClick = jest.fn()
    render(<ApplicationCard application={mockApplication} onClick={onClick} />)
    const card = screen.getByText('Software Engineer').closest('[class]') as HTMLElement | null
    if (card) {
      card.click()
      expect(onClick).toHaveBeenCalled()
    }
  })

  it('hides actions when showActions is false', () => {
    render(<ApplicationCard application={mockApplication} showActions={false} />)
    expect(screen.queryByText('Start Review')).not.toBeInTheDocument()
  })

  it('shows employer notes when provided', () => {
    const app = { ...mockApplication, employerNotes: 'Great candidate' }
    render(<ApplicationCard application={app} />)
    expect(screen.getByText('Great candidate')).toBeInTheDocument()
  })

  it('shows english test score when required and score present', () => {
    const app = { ...mockApplication, englishTestRequired: true, englishTestScore: 85 }
    render(<ApplicationCard application={app} />)
    expect(screen.getByText('Score: 85')).toBeInTheDocument()
  })

  it('renders with REJECTED status', () => {
    const app = { ...mockApplication, status: 'REJECTED' as const }
    render(<ApplicationCard application={app} />)
    expect(screen.getByText('Not Selected')).toBeInTheDocument()
  })
})
