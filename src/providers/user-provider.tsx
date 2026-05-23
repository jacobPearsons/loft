'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuthContext } from './auth-provider'
import type { AuthUser } from '@/features/auth/types'

interface UserContextType {
  user: AuthUser | null
  isLoading: boolean
  profile: any
  resume: any
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  profile: null,
  resume: null,
})

export const useUser = () => useContext(UserContext)

interface UserProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const { user: authUser, status } = useAuthContext()
  const [profile, setProfile] = useState<any>(null)
  const [resume, setResume] = useState<any>(null)

  const isLoading = status === 'loading' || status === 'idle'

  return (
    <UserContext.Provider value={{ 
      user: authUser, 
      isLoading, 
      profile, 
      resume 
    }}>
      {children}
    </UserContext.Provider>
  )
}
