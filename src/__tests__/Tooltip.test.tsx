import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip'

describe('Tooltip', () => {
  it('wraps with TooltipProvider and renders trigger', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )

    expect(screen.getByText('Hover me')).toBeInTheDocument()
  })

  it('renders content on hover', async () => {
    const user = userEvent.setup()
    render(
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )

    await user.hover(screen.getByText('Hover me'))
    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toHaveTextContent('Tooltip content')
  })

  it('applies className to TooltipContent', async () => {
    const user = userEvent.setup()
    render(
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger>Hover</TooltipTrigger>
          <TooltipContent className="custom-tooltip">Content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )

    await user.hover(screen.getByText('Hover'))
    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip.parentElement).toHaveClass('custom-tooltip')
  })

  it('uses default sideOffset of 4', async () => {
    const user = userEvent.setup()
    render(
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger>Hover</TooltipTrigger>
          <TooltipContent>Content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )

    await user.hover(screen.getByText('Hover'))
    expect(await screen.findByRole('tooltip')).toBeInTheDocument()
  })

  it('renders content with custom sideOffset', async () => {
    const user = userEvent.setup()
    render(
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger>Hover</TooltipTrigger>
          <TooltipContent sideOffset={8}>Content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )

    await user.hover(screen.getByText('Hover'))
    expect(await screen.findByRole('tooltip')).toBeInTheDocument()
  })
})
