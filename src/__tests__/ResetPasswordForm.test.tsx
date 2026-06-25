import '@testing-library/jest-dom'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm'

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, transition, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => false,
}))

const mockRequestPasswordReset = jest.fn()
const mockClearError = jest.fn()

jest.mock('@/providers/auth-provider', () => ({
  useAuthContext: jest.fn(),
}))

import { useAuthContext } from '@/providers/auth-provider'
const mockedUseAuthContext = useAuthContext as jest.Mock

describe('ResetPasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedUseAuthContext.mockReturnValue({
      requestPasswordReset: mockRequestPasswordReset,
      status: 'idle',
      error: null,
      clearError: mockClearError,
    })
  })

  it('renders heading and description', () => {
    render(<ResetPasswordForm />)
    expect(screen.getByRole('heading', { name: /reset password/i })).toBeInTheDocument()
    expect(screen.getByText(/enter your email to receive a reset link/i)).toBeInTheDocument()
  })

  it('renders email input and submit button', () => {
    render(<ResetPasswordForm />)
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument()
  })

  it('shows error when submitting empty email', async () => {
    render(<ResetPasswordForm />)
    const form = screen.getByRole('button', { name: /send reset link/i }).closest('form')!
    fireEvent.submit(form)
    expect(await screen.findByText(/please enter your email address/i)).toBeInTheDocument()
  })

  it('calls requestPasswordReset on submit', async () => {
    mockRequestPasswordReset.mockResolvedValue({ success: true })
    const user = userEvent.setup()
    render(<ResetPasswordForm />)
    await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /send reset link/i }))
    await waitFor(() => {
      expect(mockRequestPasswordReset).toHaveBeenCalledWith({ email: 'test@example.com' })
    })
  })

  it('shows success message', async () => {
    mockRequestPasswordReset.mockResolvedValue({ success: true })
    const user = userEvent.setup()
    render(<ResetPasswordForm />)
    await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /send reset link/i }))
    expect(await screen.findByText(/if an account exists/i)).toBeInTheDocument()
  })

  it('shows loading state', () => {
    mockedUseAuthContext.mockReturnValue({
      requestPasswordReset: mockRequestPasswordReset,
      status: 'loading',
      error: null,
      clearError: mockClearError,
    })
    render(<ResetPasswordForm />)
    expect(screen.getByRole('button', { name: /sending/i })).toBeInTheDocument()
  })

  it('calls onBackToLogin when clicked', async () => {
    const onBackToLogin = jest.fn()
    const user = userEvent.setup()
    render(<ResetPasswordForm onBackToLogin={onBackToLogin} />)
    await user.click(screen.getByText(/sign in/i))
    expect(onBackToLogin).toHaveBeenCalledTimes(1)
  })
})
