/**
 * Hiring Workflow Feature Module
 * 
 * Complete hiring workflow implementation based on docs/flow.md
 * 
 * Features:
 * - Application management through all hiring stages
 * - Visual timeline tracking
 * - Status management
 * - Service layer for API communication
 * - Custom hooks for state management
 * 
 * Following frontend-lifecycle rules:
 * - Modular architecture
 * - Separation of concerns (services, hooks, components, types)
 * - Single responsibility for each module
 */

// Types
export * from './types';

// Services
export * from './services/hiringService';

// Hooks
export { useHiringWorkflow, useApplicationTimeline } from './hooks/useHiringWorkflow';

// Components
export * from './components';
