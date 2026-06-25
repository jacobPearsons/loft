import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase, Users, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/providers/AuthProvider'
import api from '@/lib/api'
import { toast } from 'sonner'

export default function Onboarding() {
  const navigate = useNavigate()
  const { user, status } = useAuth()
  const [loading, setLoading] = useState(false)

  if (status === 'loading') return null

  if (user && !user.needsOnboarding) {
    navigate(user.isEmployer ? '/employer/dashboard' : '/dashboard', { replace: true })
    return null
  }

  async function handleSelectRole(role: 'JOB_SEEKER' | 'EMPLOYER') {
    setLoading(true)
    try {
      await api.post('/users/role', { role })
      localStorage.removeItem('pendingOnboarding')
      if (role === 'EMPLOYER') {
        navigate('/employer/dashboard')
      } else {
        navigate('/dashboard')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to set role')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-neutral-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[200px] h-[200px] bg-emerald-400/10 rounded-full blur-[80px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl text-center"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Choose Your Role
        </h1>
        <p className="text-neutral-400 mb-10">
          Select how you want to use LoftCommunity
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card
              className="cursor-pointer hover:border-emerald-500/40 transition-all duration-300 h-full"
              onClick={() => handleSelectRole('JOB_SEEKER')}
            >
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center mb-5">
                  <Users className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Job Seeker</h3>
                <p className="text-sm text-neutral-400">
                  Find your dream job, take assessments, and connect with top employers.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card
              className="cursor-pointer hover:border-emerald-500/40 transition-all duration-300 h-full"
              onClick={() => handleSelectRole('EMPLOYER')}
            >
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center mb-5">
                  <Briefcase className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Employer</h3>
                <p className="text-sm text-neutral-400">
                  Post jobs, find qualified candidates, and build your dream team.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {loading && (
          <div className="mt-8 flex items-center justify-center gap-2 text-emerald-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Setting up your account...</span>
          </div>
        )}
      </motion.div>
    </div>
  )
}
