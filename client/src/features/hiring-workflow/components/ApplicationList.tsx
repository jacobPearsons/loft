import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Application, ApplicationStatus } from '../types'
import { ApplicationCard } from './ApplicationCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  ChevronDown,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Mail
} from 'lucide-react'

interface ApplicationListProps {
  applications: Application[]
  onApplicationClick?: (application: Application) => void
  onStatusChange?: (applicationId: number, status: ApplicationStatus) => void
  loading?: boolean
  className?: string
}

const statusFilters: { value: ApplicationStatus | 'ALL'; label: string; icon: React.ReactNode }[] = [
  { value: 'ALL', label: 'All', icon: <Users className="w-4 h-4" /> },
  { value: 'PENDING', label: 'Pending', icon: <Clock className="w-4 h-4" /> },
  { value: 'REVIEWING', label: 'Reviewing', icon: <CheckCircle className="w-4 h-4" /> },
  { value: 'SHORTLISTED', label: 'Shortlisted', icon: <User className="w-4 h-4" /> },
  { value: 'INTERVIEW', label: 'Interview', icon: <Mail className="w-4 h-4" /> },
  { value: 'OFFERED', label: 'Offered', icon: <Mail className="w-4 h-4" /> },
  { value: 'HIRED', label: 'Hired', icon: <CheckCircle className="w-4 h-4" /> },
  { value: 'REJECTED', label: 'Rejected', icon: <XCircle className="w-4 h-4" /> },
]

export function ApplicationList({
  applications,
  onApplicationClick,
  onStatusChange,
  loading = false,
  className,
}: ApplicationListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'ALL'>('ALL')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  const filteredApplications = applications.filter(app => {
    const matchesSearch = !searchQuery ||
      app.job?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const handleStatusChange = (applicationId: number, status: ApplicationStatus) => {
    onStatusChange?.(applicationId, status)
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-border text-muted-foreground"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            <ChevronDown className={cn('w-4 h-4 ml-2 transition-transform', showFilters && 'rotate-180')} />
          </Button>

          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'rounded-none',
                viewMode === 'grid' ? 'bg-muted text-foreground' : 'text-muted-foreground'
              )}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'rounded-none',
                viewMode === 'list' ? 'bg-muted text-foreground' : 'text-muted-foreground'
              )}
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg">
              {statusFilters.map(filter => (
                <Button
                  key={filter.value}
                  variant={statusFilter === filter.value ? 'default' : 'outline'}
                  size="sm"
                  className={cn(
                    statusFilter === filter.value
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'border-border text-muted-foreground hover:text-foreground',
                    'flex items-center gap-1'
                  )}
                  onClick={() => setStatusFilter(filter.value)}
                >
                  {filter.icon}
                  {filter.label}
                  {filter.value !== 'ALL' && statusCounts[filter.value] !== undefined && (
                    <Badge variant="secondary" className="ml-1 bg-muted">
                      {statusCounts[filter.value]}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <p className="text-muted-foreground text-sm">
          {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
          {statusFilter !== 'ALL' && ` in ${statusFilters.find(f => f.value === statusFilter)?.label}`}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
          <p className="text-muted-foreground">No applications found</p>
          {searchQuery && (
            <Button
              variant="link"
              className="text-emerald-400 mt-2"
              onClick={() => setSearchQuery('')}
            >
              Clear search
            </Button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredApplications.map((application, index) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <ApplicationCard
                  application={application}
                  onClick={() => onApplicationClick?.(application)}
                  onStatusChange={(status) => handleStatusChange(application.id, status)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filteredApplications.map((application, index) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.03 }}
              >
                <ApplicationCard
                  application={application}
                  onClick={() => onApplicationClick?.(application)}
                  onStatusChange={(status) => handleStatusChange(application.id, status)}
                  className="hover:bg-card"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default ApplicationList
