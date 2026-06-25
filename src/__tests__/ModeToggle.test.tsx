import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ModeToggle } from '@/components/global/mode-toggle'

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}))

jest.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  DropdownMenuTrigger: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
    const { asChild, ...rest } = props
    return <div {...rest}>{children}</div>
  },
  DropdownMenuContent: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
    const { align, ...rest } = props
    return <div data-testid="dropdown-content" {...rest}>{children}</div>
  },
  DropdownMenuItem: ({ children, onClick, ...props }: { children: React.ReactNode; onClick?: () => void; [key: string]: any }) => (
    <button onClick={onClick} {...props} role="menuitem">{children}</button>
  ),
}))

import { useTheme } from 'next-themes'

const mockUseTheme = useTheme as jest.Mock

describe('ModeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTheme.mockReturnValue({ setTheme: jest.fn() })
  })

  it('renders a theme toggle button', () => {
    render(<ModeToggle />)
    const button = screen.getByRole('button', { name: /toggle theme/i })
    expect(button).toBeInTheDocument()
  })

  it('renders theme selection options', async () => {
    const user = userEvent.setup()
    mockUseTheme.mockReturnValue({ setTheme: jest.fn() })
    render(<ModeToggle />)

    const button = screen.getByRole('button', { name: /toggle theme/i })
    await user.click(button)

    expect(screen.getByText('Light')).toBeInTheDocument()
    expect(screen.getByText('Dark')).toBeInTheDocument()
    expect(screen.getByText('System')).toBeInTheDocument()
  })

  it('calls setTheme with light when Light is clicked', async () => {
    const user = userEvent.setup()
    const setTheme = jest.fn()
    mockUseTheme.mockReturnValue({ setTheme })

    render(<ModeToggle />)
    await user.click(screen.getByRole('button', { name: /toggle theme/i }))
    await user.click(screen.getByText('Light'))

    expect(setTheme).toHaveBeenCalledWith('light')
  })

  it('calls setTheme with dark when Dark is clicked', async () => {
    const user = userEvent.setup()
    const setTheme = jest.fn()
    mockUseTheme.mockReturnValue({ setTheme })

    render(<ModeToggle />)
    await user.click(screen.getByRole('button', { name: /toggle theme/i }))
    await user.click(screen.getByText('Dark'))

    expect(setTheme).toHaveBeenCalledWith('dark')
  })

  it('calls setTheme with system when System is clicked', async () => {
    const user = userEvent.setup()
    const setTheme = jest.fn()
    mockUseTheme.mockReturnValue({ setTheme })

    render(<ModeToggle />)
    await user.click(screen.getByRole('button', { name: /toggle theme/i }))
    await user.click(screen.getByText('System'))

    expect(setTheme).toHaveBeenCalledWith('system')
  })
})
