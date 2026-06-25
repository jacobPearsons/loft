import '@testing-library/jest-dom'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '@/features/auth/components/LoginForm'

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

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('renders the heading and description', () => {
    render(<LoginForm />)
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
    expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument()
  })

  it('renders email and password fields', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  })

  it('renders OAuth buttons', () => {
    render(<LoginForm />)
    expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /continue with linkedin/i })).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<LoginForm />)
    expect(screen.getByRole('button', { name: /sign in$/i })).toBeInTheDocument()
  })

  it('renders remember me checkbox and forgot password button', () => {
    render(<LoginForm />)
    expect(screen.getByText(/remember me for 30 days/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /forgot password/i })).toBeInTheDocument()
  })

  it('shows validation error when submitting with empty fields', async () => {
    render(<LoginForm />)
    const form = screen.getByRole('button', { name: /sign in$/i }).closest('form')!
    fireEvent.submit(form)
    expect(await screen.findByText(/please fill in all fields/i)).toBeInTheDocument()
  })

  it('calls signIn with credentials on submit', async () => {
    mockSignIn.mockResolvedValue({ error: undefined })
    mockGetSession.mockResolvedValue({
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
    })
    const user = userEvent.setup()
    render(<LoginForm />)
    await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'Password123!')
    await user.click(screen.getByRole('button', { name: /sign in$/i }))
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'Password123!',
        rememberMe: 'false',
        redirect: false,
      })
    })
  })

  it('navigates to dashboard on successful login', async () => {
    mockSignIn.mockResolvedValue({ error: undefined })
    mockGetSession.mockResolvedValue({
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
    })
    const user = userEvent.setup()
    render(<LoginForm />)
    await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'Password123!')
    await user.click(screen.getByRole('button', { name: /sign in$/i }))
    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('shows error message on failed login', async () => {
    mockSignIn.mockResolvedValue({ error: 'Invalid credentials' })
    const user = userEvent.setup()
    render(<LoginForm />)
    await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'wrong')
    await user.click(screen.getByRole('button', { name: /sign in$/i }))
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })

  it('renders link to switch to register', () => {
    const onSwitchToRegister = jest.fn()
    render(<LoginForm onSwitchToRegister={onSwitchToRegister} />)
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('calls onSwitchToRegister when clicking create account', async () => {
    const onSwitchToRegister = jest.fn()
    const user = userEvent.setup()
    render(<LoginForm onSwitchToRegister={onSwitchToRegister} />)
    await user.click(screen.getByRole('button', { name: /create account/i }))
    expect(onSwitchToRegister).toHaveBeenCalledTimes(1)
  })

  it('calls onSwitchToResetPassword when clicking forgot password', async () => {
    const onSwitchToResetPassword = jest.fn()
    const user = userEvent.setup()
    render(<LoginForm onSwitchToResetPassword={onSwitchToResetPassword} />)
    await user.click(screen.getByRole('button', { name: /forgot password/i }))
    expect(onSwitchToResetPassword).toHaveBeenCalledTimes(1)
  })
})
