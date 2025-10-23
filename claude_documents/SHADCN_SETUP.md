# Shadcn UI Setup - Completed

## Installation Summary

### Dependencies Installed
- `tailwindcss@3` - Styling framework
- `postcss` & `autoprefixer` - CSS processing
- `class-variance-authority` - CVA for component variants
- `clsx` - Conditional classnames
- `tailwind-merge` - Merge Tailwind classes efficiently
- `lucide-react` - Icon library
- `@radix-ui/react-slot` - Composition primitive
- `@radix-ui/react-checkbox` - Accessible checkbox component

### Configuration Files Created

1. **tailwind.config.js** - Tailwind CSS configuration with Shadcn color system
2. **postcss.config.js** - PostCSS configuration
3. **components.json** - Shadcn CLI configuration
4. **src/_shared/infrastructure/lib/utils.ts** - Utility functions (`mergeTailwindClasses` helper)

### Path Aliases Configured

Updated `tsconfig.app.json` and `vite.config.ts`:
```typescript
"@/*": ["./src/*"]
```

### Components Installed

Located in `src/_shared/infrastructure/components/ui/`:
- ✅ Button (`button.tsx`)
- ✅ Card (`card.tsx`)
- ✅ Input (`input.tsx`)
- ✅ Checkbox (`checkbox.tsx`)

### Global Styles Updated

`src/index.css` now includes:
- Tailwind directives (`@tailwind base/components/utilities`)
- Shadcn CSS variables for light/dark mode
- Custom font variables (Lato, Gloock)
- Custom font size variables (responsive with clamp)

## Usage Example

```tsx
import { Button } from '@/_shared/infrastructure/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/_shared/infrastructure/components/ui/card'
import { Input } from '@/_shared/infrastructure/components/ui/input'
import { Checkbox } from '@/_shared/infrastructure/components/ui/checkbox'

function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello Shadcn UI</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter text..." />
        <Checkbox />
        <Button>Click me</Button>
      </CardContent>
    </Card>
  )
}
```

## Adding More Components

To add more Shadcn components, you can either:

1. **Use the CLI** (recommended):
   ```bash
   npx shadcn@latest add [component-name]
   ```

2. **Copy from documentation**:
   Visit https://ui.shadcn.com/docs/components and manually copy component code to `src/_shared/infrastructure/components/ui/`

## Testing

Build successful:
```bash
npm run build  # ✅ Passes
npm run dev    # ✅ Server runs on http://localhost:5173
```

## Dark Mode

Dark mode is configured and ready to use. Toggle by adding/removing the `dark` class on the root element:

```tsx
// Example dark mode toggle
document.documentElement.classList.toggle('dark')
```

## Next Steps

1. Install more components as needed (dialog, dropdown, select, etc.)
2. Create theme toggle component for dark mode
3. Implement custom fonts (Lato, Gloock) via Google Fonts or local fonts
