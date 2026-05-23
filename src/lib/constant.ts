import Home from '@/components/icons/home'
import Settings from '@/components/icons/settings'
import Jobs from '@/components/icons/jobs'
import Users from '@/components/icons/users'
import Messages from '@/components/icons/messages'

export const menuOptions = [
  { name: 'Dashboard', Component: Home, href: '/dashboard' },
  { name: 'Jobs', Component: Jobs, href: '/jobs' },
  { name: 'Messages', Component: Messages, href: '/messages' },
  { name: 'Settings', Component: Settings, href: '/settings' },
]

export const employerMenuOptions = [
  { name: 'Dashboard', Component: Home, href: '/employer/dashboard' },
  { name: 'Jobs', Component: Jobs, href: '/employer/dashboard' },
  { name: 'Candidates', Component: Users, href: '/hiring-workflow' },
  { name: 'Messages', Component: Messages, href: '/messages' },
  { name: 'Company', Component: Jobs, href: '/employer/company' },
  { name: 'Settings', Component: Settings, href: '/settings' },
]
