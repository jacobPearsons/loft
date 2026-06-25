import { render } from '@testing-library/react'
import { Progress } from '@/components/ui/progress'

describe('Progress', () => {
  it('renders with correct value', () => {
    const { container } = render(<Progress value={50} />)
    const indicator = container.querySelector('[class*="bg-primary"]')
    expect(indicator).toBeInTheDocument()
    expect(indicator).toHaveStyle({ transform: 'translateX(-50%)' })
  })

  it('renders with 0 value', () => {
    const { container } = render(<Progress value={0} />)
    const indicator = container.querySelector('[class*="bg-primary"]')
    expect(indicator).toBeInTheDocument()
    expect(indicator).toHaveStyle({ transform: 'translateX(-100%)' })
  })

  it('renders with no value prop', () => {
    const { container } = render(<Progress />)
    const indicator = container.querySelector('[class*="bg-primary"]')
    expect(indicator).toBeInTheDocument()
    expect(indicator).toHaveStyle({ transform: 'translateX(-100%)' })
  })

  it('renders with 100 value', () => {
    const { container } = render(<Progress value={100} />)
    const indicator = container.querySelector('[class*="bg-primary"]')
    expect(indicator).toBeInTheDocument()
    expect(indicator).toHaveStyle({ transform: 'translateX(-0%)' })
  })

  it('applies className', () => {
    const { container } = render(<Progress className="custom-progress" value={50} />)
    const root = container.firstChild as HTMLElement
    expect(root).toHaveClass('custom-progress')
  })
})
