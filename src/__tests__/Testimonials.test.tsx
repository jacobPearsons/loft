import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Testimonials } from '@/components/home/testimonials'

describe('Testimonials', () => {
  it('renders section heading', () => {
    render(<Testimonials />)
    expect(screen.getByRole('heading', { name: /what our users say/i })).toBeInTheDocument()
    expect(screen.getByText(/join thousands of satisfied job seekers/i)).toBeInTheDocument()
  })

  it('renders all testimonial names', () => {
    render(<Testimonials />)
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument()
    expect(screen.getByText('Michael Chen')).toBeInTheDocument()
    expect(screen.getByText('Emily Rodriguez')).toBeInTheDocument()
  })

  it('renders all testimonial roles', () => {
    render(<Testimonials />)
    expect(screen.getByText('Software Engineer at Google')).toBeInTheDocument()
    expect(screen.getByText('HR Director at TechCorp')).toBeInTheDocument()
    expect(screen.getByText('Product Designer at Figma')).toBeInTheDocument()
  })

  it('renders testimonial quotes', () => {
    render(<Testimonials />)
    expect(screen.getByText(/loft community helped me land my dream job/i)).toBeInTheDocument()
    expect(screen.getByText(/as an employer, finding qualified candidates/i)).toBeInTheDocument()
    expect(screen.getByText(/the platform's clean interface/i)).toBeInTheDocument()
  })

  it('renders all three avatar initials', () => {
    render(<Testimonials />)
    expect(screen.getByText('S')).toBeInTheDocument()
    expect(screen.getByText('M')).toBeInTheDocument()
    expect(screen.getByText('E')).toBeInTheDocument()
  })
})
