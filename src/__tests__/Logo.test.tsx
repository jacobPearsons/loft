import { render, screen } from '@testing-library/react'
import { Logo, LogoWithText, LogoIcon } from '@/components/global/logo'

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const { priority, ...rest } = props as any
    return <img {...rest} alt={rest.alt as string || ''} /> // eslint-disable-line @next/next/no-img-element, jsx-a11y/alt-text
  },
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('Logo', () => {
  it('renders full variant by default', () => {
    render(<Logo />)
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })

  it('renders icon variant', () => {
    render(<Logo variant="icon" />)
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })

  it('link points to correct href', () => {
    render(<Logo />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/')
  })

  it('renders logo image with alt text', () => {
    render(<Logo />)
    const img = screen.getByAltText('Loft Community Logo')
    expect(img).toBeInTheDocument()
  })

  it('forwards className', () => {
    render(<Logo className="custom-logo" />)
    expect(screen.getByRole('link')).toHaveClass('custom-logo')
  })
})

describe('LogoWithText', () => {
  it('renders a link to home', () => {
    render(<LogoWithText />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/')
  })

  it('renders logo image', () => {
    render(<LogoWithText />)
    const img = screen.getByAltText('Loft Community')
    expect(img).toBeInTheDocument()
  })
})

describe('LogoIcon', () => {
  it('renders a link to home', () => {
    render(<LogoIcon />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/')
  })

  it('renders logo image', () => {
    render(<LogoIcon />)
    const img = screen.getByAltText('Loft Community')
    expect(img).toBeInTheDocument()
  })
})
