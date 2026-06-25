import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LogoutButton } from '@/features/auth/components/LogoutButton'

const mockLogout = jest.fn()

jest.mock('@/providers/auth-provider', () => ({
  useAuthContext: jest.fn(),
}))

import { useAuthContext } from '@/providers/auth-provider'
const mockedUseAuthContext = useAuthContext as jest.Mock

describe('LogoutButton', () => {
  beforeEach(() => {
    mockLogout.mockClear()
  })

  it('renders Sign Out button when authenticated', () => {
    mockedUseAuthContext.mockReturnValue({
      logout: mockLogout,
      status: 'authenticated',
      isAuthenticated: true,
    })
    render(<LogoutButton />)
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
  })

  it('renders Signing out text when status is loading', () => {
    mockedUseAuthContext.mockReturnValue({
      logout: mockLogout,
      status: 'loading',
      isAuthenticated: true,
    })
    render(<LogoutButton />)
    expect(screen.getByRole('button', { name: /signing out/i })).toBeInTheDocument()
  })

  it('returns null when not authenticated', () => {
    mockedUseAuthContext.mockReturnValue({
      logout: mockLogout,
      status: 'unauthenticated',
      isAuthenticated: false,
    })
    const { container } = render(<LogoutButton />)
    expect(container).toBeEmptyDOMElement()
  })

  it('calls logout on click', async () => {
    mockedUseAuthContext.mockReturnValue({
      logout: mockLogout,
      status: 'authenticated',
      isAuthenticated: true,
    })
    const user = userEvent.setup()
    render(<LogoutButton />)
    await user.click(screen.getByRole('button', { name: /sign out/i }))
    expect(mockLogout).toHaveBeenCalledTimes(1)
  })

  it('renders with logout icon when showIcon is true', () => {
    mockedUseAuthContext.mockReturnValue({
      logout: mockLogout,
      status: 'authenticated',
      isAuthenticated: true,
    })
    const { container } = render(<LogoutButton showIcon={true} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('hides icon when showIcon is false', () => {
    mockedUseAuthContext.mockReturnValue({
      logout: mockLogout,
      status: 'authenticated',
      isAuthenticated: true,
    })
    const { container } = render(<LogoutButton showIcon={false} />)
    expect(container.querySelector('svg')).not.toBeInTheDocument()
  })
})
