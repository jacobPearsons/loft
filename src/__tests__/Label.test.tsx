import { render, screen } from '@testing-library/react'
import { Label } from '@/components/ui/label'

describe('Label', () => {
  it('renders text', () => {
    render(<Label>Username</Label>)
    expect(screen.getByText('Username')).toBeInTheDocument()
  })

  it('associates with input via htmlFor', () => {
    render(
      <>
        <Label htmlFor="username">Username</Label>
        <input id="username" />
      </>
    )
    const label = screen.getByText('Username')
    expect(label).toHaveAttribute('for', 'username')
  })

  it('forwards className', () => {
    render(<Label className="custom-label">Label</Label>)
    expect(screen.getByText('Label')).toHaveClass('custom-label')
  })
})
