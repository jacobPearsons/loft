import { useRef } from 'react'
import { useInView, Variants } from 'framer-motion'
import { useReducedMotion } from './useReducedMotion'

interface RevealOptions {
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  duration?: number
  distance?: number
  once?: boolean
}

export function useReveal<T extends HTMLElement>(options: RevealOptions = {}) {
  const ref = useRef<T>(null)
  const isInView = useInView(ref, { once: options.once ?? true, margin: '-80px' })
  const reduced = useReducedMotion()

  const {
    direction = 'up',
    delay = 0,
    duration = 0.6,
    distance = 40,
  } = options

  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  }

  const variants: Variants = {
    hidden: {
      opacity: reduced ? 1 : 0,
      ...directionMap[direction],
      filter: reduced ? 'blur(0px)' : 'blur(4px)',
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: reduced ? 0 : duration,
        delay: reduced ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return { ref, isInView, variants }
}

export function useStaggerReveal(itemDelay: number = 0.08) {
  const reduced = useReducedMotion()

  const containerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : itemDelay,
        delayChildren: reduced ? 0 : 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduced ? 0 : 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return { containerVariants, itemVariants }
}
