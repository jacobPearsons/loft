import { Navigate } from 'react-router-dom'
import { useAuth } from '@/providers/AuthProvider'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'applicant' | 'employer'
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, status } = useAuth()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  if (requiredRole === 'employer' && !user?.isEmployer) {
    return <Navigate to="/dashboard" replace />
  }

  if (requiredRole === 'applicant' && user?.isEmployer) {
    return <Navigate to="/employer/dashboard" replace />
  }

  return <>{children}</>
}
