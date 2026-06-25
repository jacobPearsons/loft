import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EmailVerification } from '@/app/(main)/(pages)/settings/_components/email-verification'

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('EmailVerification', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn() as jest.Mock
  })

  it('shows Verified when isVerified=true', () => {
    render(<EmailVerification email="test@test.com" isVerified={true} />)
    expect(screen.getByText('Verified')).toBeInTheDocument()
  })

  it('shows Pending and sent message after sending', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true }),
    }) as jest.Mock
    const user = userEvent.setup()
    render(<EmailVerification email="test@test.com" isVerified={false} />)
    await user.click(screen.getByText(/verify email/i))
    await waitFor(() => {
      expect(screen.getByText('Pending')).toBeInTheDocument()
    })
    expect(screen.getByText(/verification link sent/i)).toBeInTheDocument()
  })

  it('shows Unverified and button initially', () => {
    render(<EmailVerification email="test@test.com" isVerified={false} />)
    expect(screen.getByText('Unverified')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /verify email/i })).toBeInTheDocument()
  })

  it('sends verification on button click', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true }),
    }) as jest.Mock
    const user = userEvent.setup()
    render(<EmailVerification email="test@test.com" isVerified={false} />)
    await user.click(screen.getByText(/verify email/i))
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com' }),
      })
    })
  })
})
