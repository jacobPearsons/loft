import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navbar from '@/components/global/navbar'

jest.setTimeout(15000)

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { priority, fill, ...rest } = props
    return <img {...rest} alt={rest.alt as string || ''} /> // eslint-disable-line @next/next/no-img-element, jsx-a11y/alt-text
  },
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

jest.mock('@/components/ContactSupportModal', () => ({
  __esModule: true,
  default: () => <button>Contact Support</button>,
}))

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}))

jest.mock('@/providers/auth-provider', () => ({
  useAuthContext: jest.fn(),
}))

import { useSession } from 'next-auth/react'
import { useAuthContext } from '@/providers/auth-provider'
const mockedUseSession = useSession as jest.Mock
const mockedUseAuthContext = useAuthContext as jest.Mock

const unauthenticatedSession = { data: null, status: 'unauthenticated' }
const authenticatedSession = {
  data: { user: { name: 'Test User', email: 'test@test.com', isEmployer: false } },
  status: 'authenticated',
}

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedUseSession.mockReturnValue(unauthenticatedSession)
    mockedUseAuthContext.mockReturnValue({
      logout: jest.fn().mockResolvedValue({ success: true }),
      isAuthenticated: false,
    })
  })

  it('renders logo', () => {
    render(<Navbar />)
    expect(screen.getByAltText('Loft Community')).toBeInTheDocument()
  })

  it('renders nav links (Jobs, Employers, Dashboard)', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /jobs/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /employers/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
  })

  it('shows Contact Support', () => {
    render(<Navbar />)
    expect(screen.getAllByText(/contact support/i).length).toBeGreaterThanOrEqual(1)
  })

  it('shows Sign In and Get Started when not authenticated', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByText(/get started/i)).toBeInTheDocument()
  })

  it('shows Dashboard and Sign Out when authenticated', () => {
    mockedUseSession.mockReturnValue(authenticatedSession)
    mockedUseAuthContext.mockReturnValue({
      logout: jest.fn().mockResolvedValue({ success: true }),
      isAuthenticated: true,
    })
    render(<Navbar />)
    expect(screen.getByText(/test user/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
  })

  it('mobile menu toggle works', async () => {
    const user = userEvent.setup()
    render(<Navbar />)
    expect(screen.getAllByText('Jobs')).toHaveLength(1)
    await user.click(screen.getByLabelText('Toggle menu'))
    expect(screen.getAllByText('Jobs')).toHaveLength(2)
    await user.click(screen.getByLabelText('Toggle menu'))
    expect(screen.getAllByText('Jobs')).toHaveLength(1)
  })
})
