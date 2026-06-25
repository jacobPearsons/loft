import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SaveJobButton } from '@/components/global/save-job-button'

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}))

jest.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => <div data-testid="tooltip-content">{children}</div>,
}))

import { useSession } from 'next-auth/react'

const mockUseSession = useSession as jest.Mock

describe('SaveJobButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows sign-in tooltip when not authenticated', () => {
    mockUseSession.mockReturnValue({ data: null })
    render(<SaveJobButton jobId={1} />)
    expect(screen.getByLabelText('Sign in to save jobs')).toBeInTheDocument()
  })

  it('shows save button when authenticated', () => {
    mockUseSession.mockReturnValue({ data: { user: { id: '1' } } })
    render(<SaveJobButton jobId={1} />)
    expect(screen.getByLabelText('Save job')).toBeInTheDocument()
  })

  it('shows saved state when initiallySaved is true', () => {
    mockUseSession.mockReturnValue({ data: { user: { id: '1' } } })
    render(<SaveJobButton jobId={1} initiallySaved />)
    expect(screen.getByLabelText('Remove from saved jobs')).toBeInTheDocument()
  })

  it('toggles saved state on click', async () => {
    const user = userEvent.setup()
    mockUseSession.mockReturnValue({ data: { user: { id: '1' } } })
    global.fetch = jest.fn().mockResolvedValue({ ok: true } as Response)

    render(<SaveJobButton jobId={1} />)
    const button = screen.getByLabelText('Save job')
    await user.click(button)

    expect(global.fetch).toHaveBeenCalledWith('/api/users/saved-jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: 1 }),
    })
  })

  it('calls DELETE endpoint when unsaving', async () => {
    const user = userEvent.setup()
    mockUseSession.mockReturnValue({ data: { user: { id: '1' } } })
    global.fetch = jest.fn().mockResolvedValue({ ok: true } as Response)

    render(<SaveJobButton jobId={1} initiallySaved />)
    const button = screen.getByLabelText('Remove from saved jobs')
    await user.click(button)

    expect(global.fetch).toHaveBeenCalledWith('/api/users/saved-jobs', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: 1 }),
    })
  })

  it('forwards className', () => {
    mockUseSession.mockReturnValue({ data: null })
    render(<SaveJobButton jobId={1} className="custom-class" />)
    const container = screen.getByLabelText('Sign in to save jobs').closest('button')!
    expect(container).toHaveClass('custom-class')
  })
})
