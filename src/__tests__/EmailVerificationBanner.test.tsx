import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EmailVerificationBanner } from '@/components/global/email-verification-banner'

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('EmailVerificationBanner', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn() as jest.Mock
  })

  it('renders nothing when isVerified=true', () => {
    const { container } = render(<EmailVerificationBanner email="test@test.com" isVerified={true} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when dismissed', async () => {
    const user = userEvent.setup()
    render(<EmailVerificationBanner email="test@test.com" isVerified={false} />)
    expect(screen.getByText(/please verify your email/i)).toBeInTheDocument()
    const buttons = screen.getAllByRole('button')
    const sendButton = screen.getByText(/send verification/i).closest('button')
    const dismissButton = buttons.find(b => b !== sendButton)
    if (dismissButton) {
      await user.click(dismissButton)
    }
    await waitFor(() => {
      expect(screen.queryByText(/please verify your email/i)).not.toBeInTheDocument()
    })
  })

  it('shows warning when unverified', () => {
    render(<EmailVerificationBanner email="test@test.com" isVerified={false} />)
    expect(screen.getByText(/please verify your email address/i)).toBeInTheDocument()
    expect(screen.getByText(/send verification/i)).toBeInTheDocument()
  })

  it('sends verification on button click', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true }),
    }) as jest.Mock
    const user = userEvent.setup()
    render(<EmailVerificationBanner email="test@test.com" isVerified={false} />)
    await user.click(screen.getByText(/send verification/i))
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com' }),
      })
    })
  })

  it('dismisses on X click', async () => {
    const user = userEvent.setup()
    render(<EmailVerificationBanner email="test@test.com" isVerified={false} />)
    expect(screen.getByText(/please verify your email/i)).toBeInTheDocument()
    const buttons = screen.getAllByRole('button')
    const sendButton = screen.getByText(/send verification/i).closest('button')
    const xButton = buttons.find(b => b !== sendButton)
    if (xButton) {
      await user.click(xButton)
    }
    await waitFor(() => {
      expect(screen.queryByText(/please verify your email/i)).not.toBeInTheDocument()
    })
  })

  it('shows sending state', async () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock
    const user = userEvent.setup()
    render(<EmailVerificationBanner email="test@test.com" isVerified={false} />)
    await user.click(screen.getByText(/send verification/i))
    expect(screen.getByText(/sending/i)).toBeInTheDocument()
  })
})
