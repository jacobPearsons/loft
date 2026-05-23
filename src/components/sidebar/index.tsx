'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useSession } from 'next-auth/react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { menuOptions, employerMenuOptions } from '@/lib/constant'
import clsx from 'clsx'
import { X } from 'lucide-react'
import { LogoWithText } from '../global/logo'

type Props = {
  isOpen?: boolean
  onClose?: () => void
  mobile?: boolean
}

const MenuOptions = ({ isOpen, onClose, mobile }: Props) => {
  const pathName = usePathname()
  const { data: session } = useSession()
  const isEmployer = (session?.user as any)?.isEmployer ?? false
  const options = isEmployer ? employerMenuOptions : menuOptions

  const content = (
    <nav className="bg-background h-screen overflow-scroll justify-between flex items-center flex-col gap-10 py-6 px-2">
      <div className="flex items-center justify-center flex-col gap-8">
        <Link className="flex font-bold flex-row" href="/" onClick={onClose}>
          <LogoWithText / >
        </Link>
        <TooltipProvider>
          {options.map((menuItem) => (
            <ul key={menuItem.name}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <li>
                    <Link
                      href={menuItem.href}
                      onClick={onClose}
                      className={clsx(
                        'group h-11 w-11 flex items-center justify-center scale-[1.5] rounded-lg p-[4px] cursor-pointer',
                        {
                          'dark:bg-emerald-800/50 bg-emerald-500/20':
                            pathName === menuItem.href,
                        }
                      )}
                    >
                      <menuItem.Component
                        selected={pathName === menuItem.href}
                      />
                    </Link>
                  </li>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-black/10 backdrop-blur-xl"
                >
                  <p>{menuItem.name}</p>
                </TooltipContent>
              </Tooltip>
            </ul>
          ))}
        </TooltipProvider>
      </div>
    </nav>
  )

  if (mobile) {
    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-black/60" onClick={onClose} />
            <div className="fixed left-0 top-0 bottom-0 w-20 bg-background animate-in slide-in-from-left">
              <button
                onClick={onClose}
                className="absolute -right-8 top-4 p-2 text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
              {content}
            </div>
          </div>
        )}
      </>
    )
  }

  return <div className="hidden md:flex">{content}</div>
}

export default MenuOptions
