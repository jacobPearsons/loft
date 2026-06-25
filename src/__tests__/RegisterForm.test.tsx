import '@testing-library/jest-dom'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RegisterForm } from '@/features/auth/components/RegisterForm'

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { initial, animate, transition, ...rest } = props
      return <div {...rest}>{children}</div>
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => false,
}))

const mockSignIn = jest.fn()
const mockGetSession = jest.fn()
const mockRouterPush = jest.fn()
let mockFetch: jest.Mock

jest.mock('next-auth/react', () => ({
  signIn: (...args: any[]) => mockSignIn(...args),
  getSession: (...args: any[]) => mockGetSession(...args),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

describe('RegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    mockFetch = jest.fn()
    global.fetch = mockFetch
  })

  it('renders the heading and description', () => {
    render(<RegisterForm />)
    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument()
    expect(screen.getByText(/join the employment platform/i)).toBeInTheDocument()
  })

  it('renders all registration fields', () => {
    render(<RegisterForm />)
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password /i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
  })

  it('renders password requirements', () => {
    render(<RegisterForm />)
    expect(screen.getByText('8+ chars')).toBeInTheDocument()
    expect(screen.getByText('Uppercase')).toBeInTheDocument()
    expect(screen.getByText('Number')).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<RegisterForm />)
    expect(screen.getByRole('button', { name: /create account$/i })).toBeInTheDocument()
  })

  it('shows validation error for empty required fields', async () => {
    const user = userEvent.setup()
    const { container } = render(<RegisterForm />)
    await user.type(screen.getByLabelText(/^password /i), 'ValidPass1')
    await user.type(screen.getByLabelText(/confirm password/i), 'ValidPass1')
    const form = container.querySelector('form')!
    fireEvent.submit(form)
    expect(await screen.findByText(/please fill in all required fields/i)).toBeInTheDocument()
  })

  it('shows validation error when passwords do not match', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.type(screen.getByLabelText(/^password /i), 'Password1')
    await user.type(screen.getByLabelText(/confirm password/i), 'Password2')
    await user.click(screen.getByRole('button', { name: /create account$/i }))
    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument()
  })

  it('shows validation error when password is not strong enough', async () => {
    const user = userEvent.setup()
    const { container } = render(<RegisterForm />)
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.type(screen.getByLabelText(/^password /i), 'weak')
    await user.type(screen.getByLabelText(/confirm password/i), 'weak')
    const form = container.querySelector('form')!
    fireEvent.submit(form)
    expect(await screen.findByText(/password does not meet requirements/i)).toBeInTheDocument()
  })

  it('calls register API on submit with valid data', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true }),
    })
    mockSignIn.mockResolvedValue({ error: undefined })
    mockGetSession.mockResolvedValue({
      user: { id: '1', email: 'john@example.com', name: 'John Doe' },
    })
    const user = userEvent.setup()
    render(<RegisterForm />)
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.type(screen.getByLabelText(/^password /i), 'Password1')
    await user.type(screen.getByLabelText(/confirm password/i), 'Password1')
    await user.click(screen.getByRole('button', { name: /create account$/i }))
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'john@example.com',
          password: 'Password1',
          firstName: 'John',
          lastName: 'Doe',
        }),
      })
    })
  })

  it('navigates to onboarding on successful registration', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true }),
    })
    mockSignIn.mockResolvedValue({ error: undefined })
    mockGetSession.mockResolvedValue({
      user: { id: '1', email: 'john@example.com', name: 'John Doe' },
    })
    const user = userEvent.setup()
    render(<RegisterForm />)
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.type(screen.getByLabelText(/^password /i), 'Password1')
    await user.type(screen.getByLabelText(/confirm password/i), 'Password1')
    await user.click(screen.getByRole('button', { name: /create account$/i }))
    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/onboarding/role-selection')
    })
  })

  it('shows error message on API failure', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: false, message: 'Email already exists' }),
    })
    const user = userEvent.setup()
    render(<RegisterForm />)
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.type(screen.getByLabelText(/^password /i), 'Password1')
    await user.type(screen.getByLabelText(/confirm password/i), 'Password1')
    await user.click(screen.getByRole('button', { name: /create account$/i }))
    expect(await screen.findByText('Email already exists')).toBeInTheDocument()
  })

  it('shows error message when sign-in fails after registration', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true }),
    })
    mockSignIn.mockResolvedValue({ error: 'Login failed' })
    const user = userEvent.setup()
    render(<RegisterForm />)
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.type(screen.getByLabelText(/^password /i), 'Password1')
    await user.type(screen.getByLabelText(/confirm password/i), 'Password1')
    await user.click(screen.getByRole('button', { name: /create account$/i }))
    expect(await screen.findByText(/registration successful but login failed/i)).toBeInTheDocument()
  })

  it('shows error on network failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))
    const user = userEvent.setup()
    render(<RegisterForm />)
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.type(screen.getByLabelText(/^password /i), 'Password1')
    await user.type(screen.getByLabelText(/confirm password/i), 'Password1')
    await user.click(screen.getByRole('button', { name: /create account$/i }))
    expect(await screen.findByText(/an error occurred/i)).toBeInTheDocument()
  })

  it('calls onSwitchToLogin when clicking sign in link', async () => {
    const onSwitchToLogin = jest.fn()
    const user = userEvent.setup()
    render(<RegisterForm onSwitchToLogin={onSwitchToLogin} />)
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    expect(onSwitchToLogin).toHaveBeenCalledTimes(1)
  })

  it('disables submit button when password is weak', () => {
    render(<RegisterForm />)
    const submitButton = screen.getByRole('button', { name: /create account$/i })
    expect(submitButton).toBeDisabled()
  })

  it('enables submit button when password meets requirements', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)
    await user.type(screen.getByLabelText(/^password /i), 'Password1')
    const submitButton = screen.getByRole('button', { name: /create account$/i })
    expect(submitButton).not.toBeDisabled()
  })
})
