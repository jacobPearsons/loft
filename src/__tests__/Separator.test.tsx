import { render } from '@testing-library/react'
import { Separator } from '@/components/ui/separator'

describe('Separator', () => {
  it('renders with horizontal orientation by default', () => {
    const { container } = render(<Separator />)
    const separator = container.firstChild as HTMLElement
    expect(separator).toHaveAttribute('data-orientation', 'horizontal')
  })

  it('applies horizontal class', () => {
    const { container } = render(<Separator />)
    const separator = container.firstChild as HTMLElement
    expect(separator).toHaveClass('h-[1px]')
    expect(separator).toHaveClass('w-full')
  })

  it('applies vertical orientation class', () => {
    const { container } = render(<Separator orientation="vertical" />)
    const separator = container.firstChild as HTMLElement
    expect(separator).toHaveAttribute('data-orientation', 'vertical')
    expect(separator).toHaveClass('h-full')
    expect(separator).toHaveClass('w-[1px]')
  })

  it('forwards className', () => {
    const { container } = render(<Separator className="custom-separator" />)
    expect(container.firstChild).toHaveClass('custom-separator')
  })

  it('is decorative by default', () => {
    const { container } = render(<Separator />)
    expect(container.firstChild).toHaveAttribute('data-orientation')
  })
})
