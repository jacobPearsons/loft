import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { FeaturedJobs } from '@/components/home/featured-jobs'

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { whileInView, initial, animate, exit, variants, layout, transition, style, ...rest } = props
      return <div {...rest}>{children}</div>
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => false,
  useScroll: () => ({ scrollYProgress: { get: () => 0, onChange: jest.fn() } }),
  useTransform: (value: any) => ({ get: () => 0, onChange: jest.fn() }),
  useMotionTemplate: (...args: any[]) => '',
  useSpring: (value: any) => ({ get: () => 0, set: jest.fn() }),
  useMotionValue: (initial: any) => ({ get: () => initial, set: jest.fn() }),
  useAnimation: () => ({ start: jest.fn(), stop: jest.fn() }),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className }: any) => <img src={src} alt={alt || ''} className={className} />, // eslint-disable-line @next/next/no-img-element
}))

describe('FeaturedJobs', () => {
  it('renders section heading and description', () => {
    render(<FeaturedJobs />)
    expect(screen.getByRole('heading', { name: /available jobs/i })).toBeInTheDocument()
    expect(screen.getByText(/scroll to explore featured opportunities/i)).toBeInTheDocument()
  })

  it('renders View All Jobs link', () => {
    render(<FeaturedJobs />)
    expect(screen.getByRole('link', { name: /view all jobs/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view all jobs/i })).toHaveAttribute('href', '/jobs')
  })

  it('renders job titles', () => {
    render(<FeaturedJobs />)
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument()
    expect(screen.getByText('Product Designer')).toBeInTheDocument()
    expect(screen.getByText('Data Scientist')).toBeInTheDocument()
  })

  it('renders job companies', () => {
    render(<FeaturedJobs />)
    expect(screen.getByText('TechCorp Inc.')).toBeInTheDocument()
    expect(screen.getByText('DesignHub')).toBeInTheDocument()
    expect(screen.getByText('DataMinds')).toBeInTheDocument()
  })

  it('renders job tags', () => {
    render(<FeaturedJobs />)
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Node.js')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Figma')).toBeInTheDocument()
    expect(screen.getByText('Python')).toBeInTheDocument()
  })

  it('renders Apply Now buttons', () => {
    render(<FeaturedJobs />)
    const applyButtons = screen.getAllByRole('link', { name: /apply now/i })
    expect(applyButtons).toHaveLength(3)
  })

  it('rendert Featured badge for featured jobs', () => {
    render(<FeaturedJobs />)
    const featuredBadges = screen.getAllByText('Featured')
    expect(featuredBadges).toHaveLength(2)
  })
})
