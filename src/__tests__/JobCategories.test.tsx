import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { JobCategories } from '@/components/home/job-categories'

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className, 'aria-hidden': ariaHidden }: any) =>
    <img src={src} alt={alt || ''} className={className} aria-hidden={ariaHidden} />, // eslint-disable-line @next/next/no-img-element
}))

describe('JobCategories', () => {
  it('renders section heading', () => {
    render(<JobCategories />)
    expect(screen.getByRole('heading', { name: /browse jobs by category/i })).toBeInTheDocument()
    expect(screen.getByText(/explore opportunities across various industries/i)).toBeInTheDocument()
  })

  it('renders all category names', () => {
    render(<JobCategories />)
    expect(screen.getByText('Software Development')).toBeInTheDocument()
    expect(screen.getByText('Data Science')).toBeInTheDocument()
    expect(screen.getByText('Design')).toBeInTheDocument()
    expect(screen.getByText('Mobile Development')).toBeInTheDocument()
    expect(screen.getByText('Cloud Computing')).toBeInTheDocument()
    expect(screen.getByText('Business Analyst')).toBeInTheDocument()
    expect(screen.getByText('Project Management')).toBeInTheDocument()
    expect(screen.getByText('Healthcare')).toBeInTheDocument()
    expect(screen.getByText('Cybersecurity')).toBeInTheDocument()
  })

  it('renders open position counts', () => {
    render(<JobCategories />)
    expect(screen.getByText('12,500 open positions')).toBeInTheDocument()
    expect(screen.getByText('8,200 open positions')).toBeInTheDocument()
    expect(screen.getByText('2,400 open positions')).toBeInTheDocument()
  })

  it('renders View All Categories link', () => {
    render(<JobCategories />)
    const link = screen.getByText('View All Categories')
    expect(link).toBeInTheDocument()
    expect(link.closest('a')).toHaveAttribute('href', '/jobs')
  })

  it('renders category links with correct hrefs', () => {
    render(<JobCategories />)
    const softwareDevLink = screen.getByText('Software Development').closest('a')
    expect(softwareDevLink).toHaveAttribute('href', '/jobs?category=software-development')
  })
})
