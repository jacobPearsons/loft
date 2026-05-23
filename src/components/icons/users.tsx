import React from 'react'
import { Users } from 'lucide-react'

type Props = {
  selected?: boolean
}

const HiringWorkflow = ({ selected }: Props) => {
  return (
    <Users
      className={`h-5 w-5 transition-colors ${
        selected ? 'text-emerald-400' : 'text-neutral-500 dark:text-white group-hover:text-emerald-400'
      }`}
    />
  )
}

export default HiringWorkflow
