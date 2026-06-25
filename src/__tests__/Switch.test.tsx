import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Switch } from '@/components/ui/switch'

describe('Switch', () => {
  it('renders as a button', () => {
    render(<Switch />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('toggles checked state on click', async () => {
    const user = userEvent.setup()
    render(<Switch />)
    const switchElement = screen.getByRole('switch')

    expect(switchElement).toHaveAttribute('data-state', 'unchecked')
    await user.click(switchElement)
    expect(switchElement).toHaveAttribute('data-state', 'checked')
    await user.click(switchElement)
    expect(switchElement).toHaveAttribute('data-state', 'unchecked')
  })

  it('applies className', () => {
    render(<Switch className="custom-switch" />)
    expect(screen.getByRole('switch')).toHaveClass('custom-switch')
  })

  it('can be default checked', () => {
    render(<Switch defaultChecked />)
    expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'checked')
  })

  it('can be controlled with checked prop', () => {
    render(<Switch checked onCheckedChange={() => {}} />)
    expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'checked')
  })
})
