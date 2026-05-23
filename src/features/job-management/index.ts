/**
 * Job Management Feature Module
 * 
 * Complete employer job management implementation.
 * 
 * Features:
 * - Job posting CRUD operations
 * - Filtering and search
 * - Job form with skills management
 * - Status management (publish/unpublish)
 * 
 * Following AI dev workflow:
 * - Types → Service → Hooks → Components
 * - Modular architecture
 * - Single responsibility per module
 */

// Types
export * from './types';

// Services
export * from './services/jobService';

// Hooks
export { useJobManagement, useJobMetrics } from './hooks/useJobManagement';

// Components
export * from './components';
