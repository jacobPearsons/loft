import { useReducedMotion } from './useReducedMotion'

export function useAmbient() {
  const reduced = useReducedMotion()

  const orbs = [
    { size: 400, x: '10%', y: '-10%', color: 'rgba(52, 211, 153, 0.12)', duration: 25, delay: 0 },
    { size: 300, x: '70%', y: '20%', color: 'rgba(16, 185, 129, 0.08)', duration: 20, delay: 2 },
    { size: 200, x: '40%', y: '60%', color: 'rgba(5, 150, 105, 0.06)', duration: 30, delay: 1 },
  ]

  const reducedOrbs = reduced ? [] : orbs

  return { orbs: reducedOrbs }
}
