import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { HowItWorks } from '@/components/home/how-it-works'

describe('HowItWorks', () => {
  it('renders section heading', () => {
    render(<HowItWorks />)
    expect(screen.getByRole('heading', { name: /how loft community works/i })).toBeInTheDocument()
    expect(screen.getByText(/your journey to finding the perfect job/i)).toBeInTheDocument()
  })

  it('renders all step titles', () => {
    render(<HowItWorks />)
    expect(screen.getByText('Search Jobs')).toBeInTheDocument()
    expect(screen.getByText('Upload Resume')).toBeInTheDocument()
    expect(screen.getByText('Take Assessment')).toBeInTheDocument()
    expect(screen.getByText('Get Hired')).toBeInTheDocument()
  })

  it('renders step numbers', () => {
    render(<HowItWorks />)
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('02')).toBeInTheDocument()
    expect(screen.getByText('03')).toBeInTheDocument()
    expect(screen.getByText('04')).toBeInTheDocument()
  })

  it('renders step descriptions', () => {
    render(<HowItWorks />)
    expect(screen.getByText(/browse thousands of job listings/i)).toBeInTheDocument()
    expect(screen.getByText(/create your profile and upload your resume/i)).toBeInTheDocument()
    expect(screen.getByText(/complete our english proficiency test/i)).toBeInTheDocument()
    expect(screen.getByText(/apply to jobs, track your applications/i)).toBeInTheDocument()
  })
})
