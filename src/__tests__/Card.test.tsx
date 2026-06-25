import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

describe('Card', () => {
  it('renders Card with children', () => {
    render(<Card>Card Content</Card>)
    expect(screen.getByText('Card Content')).toBeInTheDocument()
  })

  it('applies className to Card', () => {
    render(<Card className="custom-card">Card</Card>)
    expect(screen.getByText('Card')).toHaveClass('custom-card')
  })

  it('has card-specific classes', () => {
    render(<Card>Card</Card>)
    const card = screen.getByText('Card')
    expect(card).toHaveClass('rounded-lg')
    expect(card).toHaveClass('border')
    expect(card).toHaveClass('shadow-sm')
  })
})

describe('CardHeader', () => {
  it('renders CardHeader with children', () => {
    render(<CardHeader>Header</CardHeader>)
    expect(screen.getByText('Header')).toBeInTheDocument()
  })

  it('applies className to CardHeader', () => {
    render(<CardHeader className="custom-header">Header</CardHeader>)
    expect(screen.getByText('Header')).toHaveClass('custom-header')
  })
})

describe('CardTitle', () => {
  it('renders CardTitle with children', () => {
    render(<CardTitle>Title</CardTitle>)
    expect(screen.getByText('Title')).toBeInTheDocument()
  })

  it('renders as h3 element', () => {
    render(<CardTitle>Title</CardTitle>)
    const heading = screen.getByText('Title')
    expect(heading.tagName).toBe('H3')
  })

  it('applies className to CardTitle', () => {
    render(<CardTitle className="custom-title">Title</CardTitle>)
    expect(screen.getByText('Title')).toHaveClass('custom-title')
  })
})

describe('CardDescription', () => {
  it('renders CardDescription with children', () => {
    render(<CardDescription>Description</CardDescription>)
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('renders as paragraph element', () => {
    render(<CardDescription>Description</CardDescription>)
    expect(screen.getByText('Description').tagName).toBe('P')
  })

  it('applies className to CardDescription', () => {
    render(<CardDescription className="custom-desc">Description</CardDescription>)
    expect(screen.getByText('Description')).toHaveClass('custom-desc')
  })
})

describe('CardContent', () => {
  it('renders CardContent with children', () => {
    render(<CardContent>Content</CardContent>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('applies className to CardContent', () => {
    render(<CardContent className="custom-content">Content</CardContent>)
    expect(screen.getByText('Content')).toHaveClass('custom-content')
  })
})

describe('CardFooter', () => {
  it('renders CardFooter with children', () => {
    render(<CardFooter>Footer</CardFooter>)
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('applies className to CardFooter', () => {
    render(<CardFooter className="custom-footer">Footer</CardFooter>)
    expect(screen.getByText('Footer')).toHaveClass('custom-footer')
  })
})
