import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges Tailwind CSS classes intelligently, resolving conflicts.
 * Uses clsx for conditional classes and tailwind-merge to handle Tailwind-specific conflicts.
 *
 * @param inputs - Class names, objects, or arrays of class names
 * @returns A single string with merged and deduplicated class names
 *
 * @example
 * mergeTailwindClasses('px-4 py-2', condition && 'bg-blue-500', 'px-6')
 * // Returns: 'py-2 bg-blue-500 px-6' (px-6 overrides px-4)
 */
export function mergeTailwindClasses(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
