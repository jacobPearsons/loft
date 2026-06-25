import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { CallToAction } from '@/components/home/call-to-action'

describe('CallToAction', () => {
  it('renders heading and description', () => {
    render(<CallToAction />)
    expect(screen.getByRole('heading', { name: /ready to start your career journey/i })).toBeInTheDocument()
    expect(screen.getByText(/join loft community today/i)).toBeInTheDocument()
  })

  it('renders Get Started Free button with correct link', () => {
    render(<CallToAction />)
    const getStarted = screen.getByRole('link', { name: /get started free/i })
    expect(getStarted).toBeInTheDocument()
    expect(getStarted).toHaveAttribute('href', '/sign-up')
  })

  it('renders Hire Talent button with correct link', () => {
    render(<CallToAction />)
    const hireTalent = screen.getByRole('link', { name: /hire talent/i })
    expect(hireTalent).toBeInTheDocument()
    expect(hireTalent).toHaveAttribute('href', '/employer/dashboard')
  })
})
