import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

describe('Accordion', () => {
  it('renders items', () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item2">
          <AccordionTrigger>Trigger 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    expect(screen.getByText('Trigger 1')).toBeInTheDocument()
    expect(screen.getByText('Trigger 2')).toBeInTheDocument()
  })

  it('opens one item at a time with type single', async () => {
    const user = userEvent.setup()
    render(
      <Accordion type="single">
        <AccordionItem value="item1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item2">
          <AccordionTrigger>Trigger 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    await user.click(screen.getByText('Trigger 1'))
    expect(screen.getByText('Content 1')).toBeVisible()

    await user.click(screen.getByText('Trigger 2'))
    expect(screen.getByText('Content 2')).toBeVisible()
  })

  it('renders trigger text', () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item1">
          <AccordionTrigger>Click me</AccordionTrigger>
          <AccordionContent>Hidden content</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('renders content children', async () => {
    const user = userEvent.setup()
    render(
      <Accordion type="single">
        <AccordionItem value="item1">
          <AccordionTrigger>Trigger</AccordionTrigger>
          <AccordionContent>
            <span data-testid="child">Child element</span>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    await user.click(screen.getByText('Trigger'))
    expect(screen.getByTestId('child')).toBeVisible()
  })

  it('applies className to AccordionItem', () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item1" className="custom-item">
          <AccordionTrigger>Trigger</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    expect(screen.getByText('Trigger').closest('[data-orientation="vertical"]')).not.toBeNull()
  })

  it('applies className to AccordionTrigger', () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item1">
          <AccordionTrigger className="custom-trigger">
            Trigger
          </AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    expect(screen.getByText('Trigger')).toHaveClass('custom-trigger')
  })

  it('applies className to AccordionContent', async () => {
    const user = userEvent.setup()
    render(
      <Accordion type="single">
        <AccordionItem value="item1">
          <AccordionTrigger>Trigger</AccordionTrigger>
          <AccordionContent className="custom-content">
            Content
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    await user.click(screen.getByText('Trigger'))
    expect(screen.getByText('Content')).toHaveClass('custom-content')
  })
})
