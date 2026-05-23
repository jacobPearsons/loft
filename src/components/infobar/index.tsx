'use client'

import React from 'react'
import { Book, Headphones, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NotificationCenter } from '@/components/NotificationCenter'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useSession } from 'next-auth/react'
import { useAuthContext } from '@/providers/auth-provider'

type Props = {}

const InfoBar = (props: Props) => {
  const { data: session } = useSession()
  const { logout } = useAuthContext()
  const user = session?.user

  return (
    <div className="flex flex-row justify-end gap-6 items-center px-4 py-4 w-full bg-background ">
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger>
            <Headphones />
          </TooltipTrigger>
          <TooltipContent>
            <p>Contact Support</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger>
            <Book />
          </TooltipTrigger>
          <TooltipContent>
            <p>Guide</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <NotificationCenter />
      {user && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden md:inline">
            {user.name || user.email}
          </span>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default InfoBar
