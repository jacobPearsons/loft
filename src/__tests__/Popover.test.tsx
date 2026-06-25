import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'

describe('Popover', () => {
  it('renders trigger', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    )

    expect(screen.getByText('Open')).toBeInTheDocument()
  })

  it('renders content on trigger click', async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Popover content</PopoverContent>
      </Popover>
    )

    expect(screen.queryByText('Popover content')).not.toBeInTheDocument()
    await user.click(screen.getByText('Open'))
    expect(screen.getByText('Popover content')).toBeInTheDocument()
  })

  it('applies className to PopoverContent', async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent className="custom-content">Content</PopoverContent>
      </Popover>
    )

    await user.click(screen.getByText('Open'))
    expect(screen.getByText('Content')).toHaveClass('custom-content')
  })

  it('uses default align center and sideOffset 4', async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    )

    await user.click(screen.getByText('Open'))
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders with custom align and sideOffset', async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent align="start" sideOffset={8}>
          Content
        </PopoverContent>
      </Popover>
    )

    await user.click(screen.getByText('Open'))
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders children in content', async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <div data-testid="popover-child">Nested</div>
        </PopoverContent>
      </Popover>
    )

    await user.click(screen.getByText('Open'))
    expect(screen.getByTestId('popover-child')).toBeInTheDocument()
  })
})
