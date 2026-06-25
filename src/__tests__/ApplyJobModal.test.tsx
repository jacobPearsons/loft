jest.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: any) => <>{children}</>,
  motion: {
    div: ({ children, initial, animate, exit, transition, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

jest.mock('@uploadthing/react', () => ({
  UploadButton: ({ onClientUploadComplete, ...props }: any) => (
    <button
      data-testid="upload-button"
      onClick={() => onClientUploadComplete?.([{ url: 'https://example.com/resume.pdf', name: 'resume.pdf' }])}
    >
      Upload
    </button>
  ),
}))

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ApplyJobModal from '@/components/forms/ApplyJobModal'

const mockJob = {
  id: 1,
  title: 'Senior Software Engineer',
  company: 'Tech Corp',
  location: 'San Francisco, CA',
  jobType: 'Full-time',
  salaryRange: '$120k - $180k',
  description: 'Build amazing things.',
  requiredSkills: ['React', 'TypeScript', 'Node.js'],
  benefits: ['Health Insurance', 'Remote Work', '401k Matching'],
  remoteWork: true,
}

describe('ApplyJobModal', () => {
  const defaultOnSubmit = jest.fn().mockResolvedValue(undefined)
  const defaultOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders nothing when isOpen=false', () => {
    const { container } = render(
      <ApplyJobModal isOpen={false} onClose={defaultOnClose} onSubmit={defaultOnSubmit} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders job details', () => {
    render(
      <ApplyJobModal isOpen={true} onClose={defaultOnClose} onSubmit={defaultOnSubmit} job={mockJob} />
    )
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument()
    expect(screen.getByText('Tech Corp')).toBeInTheDocument()
    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument()
    expect(screen.getByText('$120k - $180k')).toBeInTheDocument()
    expect(screen.getByText('Full-time')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Node.js')).toBeInTheDocument()
    expect(screen.getByText('Health Insurance')).toBeInTheDocument()
    expect(screen.getByText('Remote Work')).toBeInTheDocument()
    expect(screen.getByText('401k Matching')).toBeInTheDocument()
    expect(screen.getByText('Remote')).toBeInTheDocument()
  })

  it('clicking "Apply for This Position" shows application form', async () => {
    const user = userEvent.setup()
    render(
      <ApplyJobModal isOpen={true} onClose={defaultOnClose} onSubmit={defaultOnSubmit} job={mockJob} />
    )
    await user.click(screen.getByText('Apply for This Position'))
    expect(screen.getByText('Submit Application')).toBeInTheDocument()
    expect(screen.getByText(/Submit your application for/)).toBeInTheDocument()
  })

  it('renders cover letter textarea with character count', async () => {
    const user = userEvent.setup()
    render(
      <ApplyJobModal isOpen={true} onClose={defaultOnClose} onSubmit={defaultOnSubmit} job={mockJob} />
    )
    await user.click(screen.getByText('Apply for This Position'))
    expect(screen.getByPlaceholderText(/Tell us why/)).toBeInTheDocument()
  })

  it('renders resume upload button', async () => {
    const user = userEvent.setup()
    render(
      <ApplyJobModal isOpen={true} onClose={defaultOnClose} onSubmit={defaultOnSubmit} job={mockJob} />
    )
    await user.click(screen.getByText('Apply for This Position'))
    expect(screen.getByTestId('upload-button')).toBeInTheDocument()
  })

  it('calls onSubmit with form data', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(
      <ApplyJobModal isOpen={true} onClose={defaultOnClose} onSubmit={onSubmit} job={mockJob} />
    )
    await user.click(screen.getByText('Apply for This Position'))
    await user.type(screen.getByPlaceholderText(/Tell us why/), 'I am a great fit')
    await user.click(screen.getByText('Submit Application'))
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        jobId: 1,
        jobTitle: 'Senior Software Engineer',
        companyName: 'Tech Corp',
        coverLetter: 'I am a great fit',
        resumeUrl: undefined,
      })
    })
  })

  it('handles submit loading state via isSubmitting prop', async () => {
    const user = userEvent.setup()
    render(
      <ApplyJobModal
        isOpen={true}
        onClose={defaultOnClose}
        onSubmit={defaultOnSubmit}
        job={mockJob}
        isSubmitting={true}
      />
    )
    await user.click(screen.getByText('Apply for This Position'))
    expect(screen.getByText('Submitting...')).toBeInTheDocument()
  })

  it('back button returns to details view', async () => {
    const user = userEvent.setup()
    render(
      <ApplyJobModal isOpen={true} onClose={defaultOnClose} onSubmit={defaultOnSubmit} job={mockJob} />
    )
    await user.click(screen.getByText('Apply for This Position'))
    expect(screen.getByText('Submit Application')).toBeInTheDocument()
    await user.click(screen.getByText('Back to Details'))
    expect(screen.getByText('Apply for This Position')).toBeInTheDocument()
    expect(screen.queryByText('Submit Application')).not.toBeInTheDocument()
  })

  it('close button calls onClose', async () => {
    const onClose = jest.fn()
    const user = userEvent.setup()
    render(
      <ApplyJobModal isOpen={true} onClose={onClose} onSubmit={defaultOnSubmit} job={mockJob} />
    )
    await user.click(screen.getByRole('button', { name: /close modal/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it('clicking backdrop closes modal', async () => {
    const onClose = jest.fn()
    const user = userEvent.setup()
    const { container } = render(
      <ApplyJobModal isOpen={true} onClose={onClose} onSubmit={defaultOnSubmit} job={mockJob} />
    )
    const backdrop = container.firstChild?.firstChild as HTMLElement
    await user.click(backdrop)
    expect(onClose).toHaveBeenCalled()
  })
})
