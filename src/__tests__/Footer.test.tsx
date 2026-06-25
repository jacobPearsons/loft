import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/global/footer'

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className, width, height }: any) =>
    <img src={src} alt={alt || ''} className={className} width={width} height={height} />, // eslint-disable-line @next/next/no-img-element
}))

describe('Footer', () => {
  it('renders company description', () => {
    render(<Footer />)
    expect(screen.getByText(/your trusted platform for finding your dream job/i)).toBeInTheDocument()
  })

  it('renders social media icons', () => {
    render(<Footer />)
    const socialLinks = screen.getAllByRole('link')
    const twitter = socialLinks.find(l => l.innerHTML.includes('twitter'))
    const linkedin = socialLinks.find(l => l.innerHTML.includes('linkedin'))
    const github = socialLinks.find(l => l.innerHTML.includes('github'))
    const instagram = socialLinks.find(l => l.innerHTML.includes('instagram'))
    expect(twitter).toBeInTheDocument()
    expect(linkedin).toBeInTheDocument()
    expect(github).toBeInTheDocument()
    expect(instagram).toBeInTheDocument()
  })

  it('renders For Job Seekers section with links', () => {
    render(<Footer />)
    expect(screen.getByText('For Job Seekers')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /browse jobs/i })).toHaveAttribute('href', '/jobs')
    expect(screen.getByRole('link', { name: /my profile/i })).toHaveAttribute('href', '/profile')
    expect(screen.getByRole('link', { name: /my applications/i })).toHaveAttribute('href', '/applications')
    const dashboardLinks = screen.getAllByRole('link', { name: /dashboard/i })
    expect(dashboardLinks[0]).toHaveAttribute('href', '/dashboard')
  })

  it('renders For Employers section with links', () => {
    render(<Footer />)
    expect(screen.getByText('For Employers')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /employer dashboard/i })).toHaveAttribute('href', '/employer/dashboard')
    expect(screen.getByRole('link', { name: /post a job/i })).toHaveAttribute('href', '/jobs/create')
    expect(screen.getByRole('link', { name: /hiring pipeline/i })).toHaveAttribute('href', '/hiring-workflow')
  })

  it('renders Support section with contact support and email', () => {
    render(<Footer />)
    expect(screen.getByText('Support')).toBeInTheDocument()
    expect(screen.getByText(/contact support/i)).toBeInTheDocument()
    expect(screen.getByText('hiring.pathmatch@gmail.com')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /settings/i })).toHaveAttribute('href', '/settings')
  })

  it('renders copyright notice with current year', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`© ${currentYear} LoftCommunity`))).toBeInTheDocument()
  })

  it('renders logo link', () => {
    render(<Footer />)
    const homeLinks = screen.getAllByRole('link', { name: /loft community home/i })
    expect(homeLinks.length).toBeGreaterThanOrEqual(1)
  })
})
