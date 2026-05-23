/**
 * Billing Feature Index
 * Purpose: Main entry point for the billing feature
 * Follows docs pattern: Export types, hooks, services, and components
 */

// Types
export type {
  Plan,
  PlanId,
  UserSubscription,
  BillingUsage,
  UpgradeRequest,
  UpgradeResponse,
} from './types'

// Services
export {
  getPlans,
  getPlanById,
  getCurrentSubscription,
  getBillingUsage,
  upgradeSubscription,
  getPlanLimit,
  PLANS,
} from './services/billingService'

// Hooks
export { useBilling } from './hooks/useBilling'

// Components
export { BillingDashboard } from './components'
