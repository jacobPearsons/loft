import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { HeroSection } from '@/components/home/hero-section'

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(() => ({
      matches: false,
      media: '',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
})

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className, priority, 'aria-hidden': ariaHidden }: any) =>
    <img src={src} alt={alt || ''} className={className} data-priority={priority ? 'true' : 'false'} aria-hidden={ariaHidden} />, // eslint-disable-line @next/next/no-img-element
}))

describe('HeroSection', () => {
  it('renders the heading and subheading', () => {
    render(<HeroSection />)
    expect(screen.getByRole('heading', { name: /find your dream job today/i })).toBeInTheDocument()
    expect(screen.getByText(/connect with top employers/i)).toBeInTheDocument()
  })

  it('renders the badge text', () => {
    render(<HeroSection />)
    expect(screen.getByText(/trusted by 10,000\+ job seekers/i)).toBeInTheDocument()
  })

  it('rendets the search input and button', () => {
    render(<HeroSection />)
    expect(screen.getByPlaceholderText(/job title, keywords, or company/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/location or remote/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /search jobs/i })).toBeInTheDocument()
  })

  it('renders CTA buttons', () => {
    render(<HeroSection />)
    expect(screen.getByRole('button', { name: /find jobs/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /post a job/i })).toBeInTheDocument()
  })

  it('renders stats', () => {
    render(<HeroSection />)
    expect(screen.getByText('50K+')).toBeInTheDocument()
    expect(screen.getByText('10K+')).toBeInTheDocument()
    expect(screen.getByText('100K+')).toBeInTheDocument()
    expect(screen.getByText('Active Jobs')).toBeInTheDocument()
    expect(screen.getByText('Companies')).toBeInTheDocument()
    expect(screen.getByText('Hired')).toBeInTheDocument()
  })
})
