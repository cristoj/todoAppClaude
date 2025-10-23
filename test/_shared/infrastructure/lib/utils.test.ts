import { describe, it, expect } from 'vitest'
import { mergeTailwindClasses } from '@/_shared/infrastructure/lib/utils'

describe('mergeTailwindClasses', () => {
  it('should merge multiple class strings', () => {
    const result = mergeTailwindClasses('px-4 py-2', 'bg-blue-500')
    expect(result).toBe('px-4 py-2 bg-blue-500')
  })

  it('should handle conditional classes (falsy values)', () => {
    const result = mergeTailwindClasses('base-class', false && 'hidden-class', 'visible-class')
    expect(result).toBe('base-class visible-class')
  })

  it('should handle conditional classes (truthy values)', () => {
    const isActive = true
    const result = mergeTailwindClasses('base-class', isActive && 'active-class')
    expect(result).toBe('base-class active-class')
  })

  it('should resolve Tailwind conflicts (last class wins)', () => {
    const result = mergeTailwindClasses('px-4', 'px-6')
    expect(result).toBe('px-6')
  })

  it('should resolve complex Tailwind conflicts', () => {
    const result = mergeTailwindClasses('px-4 py-2', 'px-6 py-4', 'bg-blue-500')
    expect(result).toBe('px-6 py-4 bg-blue-500')
  })

  it('should handle undefined and null values', () => {
    const result = mergeTailwindClasses('base-class', undefined, null, 'another-class')
    expect(result).toBe('base-class another-class')
  })

  it('should handle empty strings', () => {
    const result = mergeTailwindClasses('base-class', '', 'another-class')
    expect(result).toBe('base-class another-class')
  })

  it('should handle object syntax from clsx', () => {
    const result = mergeTailwindClasses({
      'base-class': true,
      'conditional-class': false,
      'active-class': true,
    })
    expect(result).toBe('base-class active-class')
  })

  it('should handle array syntax from clsx', () => {
    const result = mergeTailwindClasses(['base-class', 'another-class'], 'third-class')
    expect(result).toBe('base-class another-class third-class')
  })

  it('should handle mixed inputs', () => {
    const isActive = true
    const result = mergeTailwindClasses(
      'base-class',
      ['px-4', 'py-2'],
      { 'bg-blue-500': isActive, 'bg-red-500': false },
      'rounded-md'
    )
    expect(result).toBe('base-class px-4 py-2 bg-blue-500 rounded-md')
  })

  it('should deduplicate identical classes', () => {
    const result = mergeTailwindClasses('px-4', 'py-2', 'px-4', 'py-2')
    expect(result).toBe('px-4 py-2')
  })

  it('should handle responsive and variant modifiers correctly', () => {
    const result = mergeTailwindClasses('md:px-4', 'md:px-6')
    expect(result).toBe('md:px-6')
  })

  it('should return empty string when no valid classes provided', () => {
    const result = mergeTailwindClasses(null, undefined, false, '')
    expect(result).toBe('')
  })
})
