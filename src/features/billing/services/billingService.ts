/**
 * Billing Service
 * Purpose: Handles all billing-related data access and business logic
 */

import type { Plan, UserSubscription, BillingUsage, PlanId } from '../types'

// Static plan data (in production, this would come from database)
export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    credits: '10',
    features: [
      '10 job applications',
      'Basic profile',
      'Resume upload',
      'English proficiency test',
      'Email support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29',
    description: 'For serious job seekers',
    credits: '100',
    popular: true,
    features: [
      '100 job applications',
      'Premium profile badge',
      'Resume optimization',
      'Priority support',
      'Application tracking',
      'Interview scheduling',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$99',
    description: 'Maximum job search power',
    credits: 'Unlimited',
    features: [
      'Unlimited applications',
      'Featured profile',
      'Direct employer contacts',
      '24/7 support',
      'Resume review by experts',
      'Mock interviews',
      'Career coaching',
    ],
  },
]

/**
 * Get all available plans
 */
export const getPlans = (): Plan[] => {
  return PLANS
}

/**
 * Get a specific plan by ID
 */
export const getPlanById = (planId: PlanId): Plan | undefined => {
  return PLANS.find(plan => plan.id === planId)
}

/**
 * Get current user's subscription
 * In production, this would query the database
 */
export const getCurrentSubscription = async (): Promise<UserSubscription> => {
  // Mock implementation - in production, call API
  // const response = await fetch('/api/billing/subscription')
  // return response.json()
  
  return {
    id: 'sub_123',
    userId: 'user_123',
    planId: 'free',
    status: 'active',
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  }
}

/**
 * Get current user's billing usage
 * In production, this would query the database
 */
export const getBillingUsage = async (): Promise<BillingUsage> => {
  // Mock implementation - in production, call API
  // const response = await fetch('/api/billing/usage')
  // return response.json()
  
  return {
    applicationsUsed: 3,
    applicationsLimit: 10,
    profileViews: 156,
    interviewRequests: 4,
  }
}

/**
 * Upgrade user subscription
 * In production, this would call Stripe API
 */
export const upgradeSubscription = async (planId: PlanId): Promise<{ success: boolean; message: string }> => {
  // Mock implementation - in production, call payment API
  // const response = await fetch('/api/billing/upgrade', {
  //   method: 'POST',
  //   body: JSON.stringify({ planId })
  // })
  // return response.json()
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    success: true,
    message: `Successfully upgraded to ${getPlanById(planId)?.name} plan`,
  }
}

/**
 * Get plan limit based on plan ID
 */
export const getPlanLimit = (planId: PlanId): number => {
  const plan = getPlanById(planId)
  if (!plan) return 0
  if (plan.credits === 'Unlimited') return Infinity
  return parseInt(plan.credits, 10)
}
