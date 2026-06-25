import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Bookmark,
  MessageSquare,
  Settings,
  Users,
  Building2,
  type LucideIcon,
} from 'lucide-react'

export type SidebarLink = {
  label: string
  href: string
  icon: LucideIcon
}

export const applicantLinks: SidebarLink[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Jobs', href: '/jobs', icon: Briefcase },
  { label: 'Applications', href: '/applications', icon: FileText },
  { label: 'Saved Jobs', href: '/saved-jobs', icon: Bookmark },
  { label: 'Messages', href: '/messages', icon: MessageSquare },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export const employerLinks: SidebarLink[] = [
  { label: 'Dashboard', href: '/employer/dashboard', icon: LayoutDashboard },
  { label: 'My Jobs', href: '/employer/dashboard?tab=jobs', icon: Briefcase },
  { label: 'Candidates', href: '/hiring-workflow', icon: Users },
  { label: 'Company', href: '/employer/company', icon: Building2 },
  { label: 'Messages', href: '/messages', icon: MessageSquare },
  { label: 'Settings', href: '/settings', icon: Settings },
]
