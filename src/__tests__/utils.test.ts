import { cn } from '@/lib/utils'

describe('cn', () => {
  it('joins class names with clsx', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
    expect(cn('base', true && 'active')).toBe('base active')
  })

  it('merges tailwind classes with twMerge (later wins)', () => {
    expect(cn('px-4', 'px-2')).toBe('px-2')
  })

  it('handles arrays of classes', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz')
  })

  it('handles objects', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz')
  })

  it('returns empty string for no inputs', () => {
    expect(cn()).toBe('')
  })

  it('ignores falsy values', () => {
    expect(cn('a', undefined, null, '', 'b')).toBe('a b')
  })

  it('merges conflicting tailwind utilities', () => {
    expect(cn('text-red-500', 'text-blue-700')).toBe('text-blue-700')
    expect(cn('p-4', 'p-2')).toBe('p-2')
  })
})
