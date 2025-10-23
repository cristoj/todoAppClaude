# Refactor: `cn` → `mergeTailwindClasses`

## Motivation

The original `cn` function violated SOLID principles and best practices:

❌ **Problems with `cn`:**
- Non-descriptive name (abbreviation of "className")
- Doesn't indicate what the function does
- Requires context to understand
- Not self-documenting

## Changes Made

### 1. Function Renamed and Documented

**Before:**
```typescript
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**After:**
```typescript
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
```

### 2. Updated All Imports

**Files updated:**
- ✅ `src/_shared/infrastructure/components/ui/button.tsx`
- ✅ `src/_shared/infrastructure/components/ui/card.tsx`
- ✅ `src/_shared/infrastructure/components/ui/input.tsx`
- ✅ `src/_shared/infrastructure/components/ui/checkbox.tsx`

**Old:**
```typescript
import { cn } from "@/_shared/infrastructure/lib/utils"
className={cn("base-class", conditionalClass, className)}
```

**New:**
```typescript
import { mergeTailwindClasses } from "@/_shared/infrastructure/lib/utils"
className={mergeTailwindClasses("base-class", conditionalClass, className)}
```

### 3. Updated All Function Calls

All occurrences of `cn()` have been replaced with `mergeTailwindClasses()` across all UI components.

## Benefits

✅ **Self-documenting**: Function name clearly describes what it does
✅ **SOLID compliance**: Single Responsibility Principle - name reflects purpose
✅ **Better IntelliSense**: IDE autocomplete shows meaningful function name
✅ **Maintainability**: New developers can understand the code without additional context
✅ **JSDoc documentation**: Provides examples and parameter descriptions

## Verification

```bash
npm run build  # ✅ Passes
```

All components compile successfully with the new function name.

## Usage Example

```typescript
import { mergeTailwindClasses } from '@/_shared/infrastructure/lib/utils'

// Basic usage
const className = mergeTailwindClasses('px-4 py-2', 'bg-blue-500')

// Conditional classes
const className = mergeTailwindClasses(
  'base-class',
  isActive && 'active-class',
  error && 'error-class'
)

// Override conflicts (last wins)
const className = mergeTailwindClasses('px-4', 'px-6')
// Result: 'px-6' (px-6 overrides px-4)
```

## Migration Notes

For future Shadcn UI components installed via CLI:
1. They will use `cn` by default
2. Manually replace `cn` with `mergeTailwindClasses`
3. Update the import path

Or better yet, update `components.json` to use the new function name in future installations.
