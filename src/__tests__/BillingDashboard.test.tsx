jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, whileHover, whileTap, transition, exit, layout, variants, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, initial, animate, whileHover, whileTap, transition, exit, layout, variants, ...props }: any) => <section {...props}>{children}</section>,
    span: ({ children, initial, animate, whileHover, whileTap, transition, exit, layout, variants, ...props }: any) => <span {...props}>{children}</span>,
    button: ({ children, initial, animate, whileHover, whileTap, transition, exit, layout, variants, ...props }: any) => <button {...props}>{children}</button>,
    h1: ({ children, initial, animate, whileHover, whileTap, transition, exit, layout, variants, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, initial, animate, whileHover, whileTap, transition, exit, layout, variants, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, initial, animate, whileHover, whileTap, transition, exit, layout, variants, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => false,
}))

jest.mock('@/features/billing/hooks/useBilling', () => ({
  useBilling: jest.fn(),
}))

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BillingDashboard } from '@/features/billing/components/BillingDashboard'
import { useBilling } from '@/features/billing/hooks/useBilling'

const mockPlans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    features: ['10 job applications', 'Basic profile', 'Resume upload', 'Email support'],
    popular: false,
    credits: '10',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29',
    description: 'For serious job seekers',
    features: ['100 job applications', 'Premium profile badge', 'Priority support'],
    popular: true,
    credits: '100',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$99',
    description: 'Maximum job search power',
    features: ['Unlimited applications', 'Featured profile', '24/7 support'],
    popular: false,
    credits: 'Unlimited',
  },
]

const mockUsage = {
  applicationsUsed: 3,
  profileViews: 156,
  interviewRequests: 4,
}

const defaultMockState = {
  plans: mockPlans,
  usage: mockUsage,
  loading: false,
  upgrading: false,
  error: null,
  currentPlanId: 'free',
  currentPlan: mockPlans[0],
  applicationsLimit: 10,
  upgradePlan: jest.fn(),
  refreshData: jest.fn(),
  currentSubscription: null,
}

describe('BillingDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useBilling as jest.Mock).mockReturnValue(defaultMockState)
  })

  it('renders plan names', () => {
    render(<BillingDashboard />)
    expect(screen.getByText('Free')).toBeInTheDocument()
    expect(screen.getByText('Pro')).toBeInTheDocument()
    expect(screen.getByText('Premium')).toBeInTheDocument()
  })

  it('shows current plan badge', () => {
    render(<BillingDashboard />)
    expect(screen.getByText(/Current: Free/)).toBeInTheDocument()
  })

  it('shows usage statistics', () => {
    render(<BillingDashboard />)
    expect(screen.getByText('Your Usage')).toBeInTheDocument()
    expect(screen.getByText(/3 \/ 10/)).toBeInTheDocument()
    expect(screen.getByText('156')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('shows plan features', () => {
    render(<BillingDashboard />)
    expect(screen.getByText('10 job applications')).toBeInTheDocument()
    expect(screen.getByText('100 job applications')).toBeInTheDocument()
  })

  it('shows Most Popular badge for popular plan', () => {
    render(<BillingDashboard />)
    expect(screen.getByText('Most Popular')).toBeInTheDocument()
  })

  it('shows Current Plan button for active plan', () => {
    render(<BillingDashboard />)
    const currentButtons = screen.getAllByText('Current Plan')
    expect(currentButtons.length).toBeGreaterThanOrEqual(1)
  })

  it('shows loading state', () => {
    ;(useBilling as jest.Mock).mockReturnValue({ ...defaultMockState, loading: true })
    render(<BillingDashboard />)
    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
    expect(screen.queryByText('Free')).not.toBeInTheDocument()
  })

  it('shows error state', () => {
    const errorMsg = 'Failed to load data'
    ;(useBilling as jest.Mock).mockReturnValue({ ...defaultMockState, error: errorMsg, plans: [] })
    render(<BillingDashboard />)
    expect(screen.getByText(errorMsg)).toBeInTheDocument()
  })

  it('shows FAQ section', () => {
    render(<BillingDashboard />)
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument()
    expect(screen.getByText('What counts as an application?')).toBeInTheDocument()
    expect(screen.getByText('Can I cancel anytime?')).toBeInTheDocument()
  })

  it('calls onPlanSelect when provided', async () => {
    const onPlanSelect = jest.fn()
    render(<BillingDashboard onPlanSelect={onPlanSelect} />)
    const upgradeButtons = screen.getAllByText('Upgrade')
    const user = userEvent.setup()
    await user.click(upgradeButtons[0])
    expect(onPlanSelect).toHaveBeenCalledWith('pro')
  })

  it('renders Subscription Plans heading', () => {
    render(<BillingDashboard />)
    expect(screen.getByText('Subscription Plans')).toBeInTheDocument()
  })

  it('shows plan prices', () => {
    render(<BillingDashboard />)
    expect(screen.getByText('$0')).toBeInTheDocument()
    expect(screen.getByText('$29')).toBeInTheDocument()
    expect(screen.getByText('$99')).toBeInTheDocument()
  })
})
