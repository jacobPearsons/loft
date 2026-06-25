jest.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: any) => <>{children}</>,
  motion: {
    div: ({ children, initial, animate, exit, transition, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import JobDetailsModal from '@/components/forms/JobDetailsModal'

const mockProgram = {
  title: 'Computer Science Program',
  department: 'Department of Computer Science',
  duration: '4 Years',
  tuition: '$40,000/year',
  degreeType: 'Bachelor of Science',
  description: 'A comprehensive program covering algorithms, data structures, and software engineering.',
  credits: '120 Credits',
  courses: ['Algorithms', 'Data Structures', 'Operating Systems', 'Networks'],
  outcomes: ['Design and implement software systems', 'Analyze algorithmic complexity', 'Work effectively in teams'],
}

describe('JobDetailsModal', () => {
  const defaultOnApply = jest.fn()
  const defaultOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders nothing when isOpen=false', () => {
    const { container } = render(
      <JobDetailsModal isOpen={false} onClose={defaultOnClose} onApply={defaultOnApply} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders program title', () => {
    render(
      <JobDetailsModal isOpen={true} onClose={defaultOnClose} onApply={defaultOnApply} program={mockProgram} />
    )
    expect(screen.getByText('Computer Science Program')).toBeInTheDocument()
  })

  it('renders department, duration, tuition, credits, degree type', () => {
    render(
      <JobDetailsModal isOpen={true} onClose={defaultOnClose} onApply={defaultOnApply} program={mockProgram} />
    )
    expect(screen.getByText('Department of Computer Science')).toBeInTheDocument()
    expect(screen.getByText('4 Years')).toBeInTheDocument()
    expect(screen.getByText('$40,000/year')).toBeInTheDocument()
    expect(screen.getByText('120 Credits')).toBeInTheDocument()
    expect(screen.getByText('Bachelor of Science')).toBeInTheDocument()
  })

  it('renders program description', () => {
    render(
      <JobDetailsModal isOpen={true} onClose={defaultOnClose} onApply={defaultOnApply} program={mockProgram} />
    )
    expect(screen.getByText(/A comprehensive program covering/)).toBeInTheDocument()
  })

  it('renders list of courses', () => {
    render(
      <JobDetailsModal isOpen={true} onClose={defaultOnClose} onApply={defaultOnApply} program={mockProgram} />
    )
    expect(screen.getByText('Algorithms')).toBeInTheDocument()
    expect(screen.getByText('Data Structures')).toBeInTheDocument()
    expect(screen.getByText('Operating Systems')).toBeInTheDocument()
    expect(screen.getByText('Networks')).toBeInTheDocument()
  })

  it('renders list of outcomes', () => {
    render(
      <JobDetailsModal isOpen={true} onClose={defaultOnClose} onApply={defaultOnApply} program={mockProgram} />
    )
    expect(screen.getByText(/Design and implement software systems/)).toBeInTheDocument()
    expect(screen.getByText(/Analyze algorithmic complexity/)).toBeInTheDocument()
    expect(screen.getByText(/Work effectively in teams/)).toBeInTheDocument()
  })

  it('calls onApply when Apply Now is clicked', async () => {
    const onApply = jest.fn()
    const user = userEvent.setup()
    render(
      <JobDetailsModal isOpen={true} onClose={defaultOnClose} onApply={onApply} program={mockProgram} />
    )
    await user.click(screen.getByText('Apply for This Program'))
    expect(onApply).toHaveBeenCalledWith('Computer Science Program', 'Department of Computer Science')
  })

  it('close button calls onClose', async () => {
    const onClose = jest.fn()
    const user = userEvent.setup()
    render(
      <JobDetailsModal isOpen={true} onClose={onClose} onApply={defaultOnApply} program={mockProgram} />
    )
    await user.click(screen.getByRole('button', { name: /close modal/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it('clicking backdrop closes modal', async () => {
    const onClose = jest.fn()
    const user = userEvent.setup()
    const { container } = render(
      <JobDetailsModal isOpen={true} onClose={onClose} onApply={defaultOnApply} program={mockProgram} />
    )
    const backdrop = container.firstChild?.firstChild as HTMLElement
    await user.click(backdrop)
    expect(onClose).toHaveBeenCalled()
  })
})
