# GitHub Issue: Setup Shadcn UI and Project Structure

## Issue Title
[Feature] Setup Shadcn UI, reorganize project structure, and implement naming conventions

## Labels
`feature`, `infrastructure`, `documentation`

## Description

### Summary
Install and configure Shadcn UI following DDD architecture principles. Reorganize project structure to align with CLAUDE.md guidelines and implement proper naming conventions across the codebase.

### Tasks Completed

#### 1. Shadcn UI Installation & Configuration
- [x] Install Tailwind CSS v3 + PostCSS + Autoprefixer
- [x] Install Shadcn UI dependencies (CVA, clsx, tailwind-merge, Radix UI)
- [x] Configure `tailwind.config.js` with Shadcn color system
- [x] Configure `postcss.config.js`
- [x] Create `components.json` for Shadcn CLI
- [x] Setup path aliases in `tsconfig.app.json` and `vite.config.ts`
- [x] Update global styles (`src/index.css`) with Tailwind + Shadcn variables
- [x] Preserve custom CSS variables (fonts, sizes)

#### 2. UI Components Installation
- [x] Create `mergeTailwindClasses` utility function (with JSDoc)
- [x] Install Button component
- [x] Install Card component (with all subcomponents)
- [x] Install Input component
- [x] Install Checkbox component

#### 3. Project Structure Reorganization
- [x] Create `src/_shared/` directory structure
  - `domain/` - Shared domain objects
  - `infrastructure/` - Shared infrastructure
  - `applications/` - Shared hooks
- [x] Move UI components to `src/_shared/infrastructure/components/ui/`
- [x] Move utilities to `src/_shared/infrastructure/lib/`
- [x] Create `src/features/` directory (ready for feature modules)
- [x] Create `test/e2e/` directory structure
- [x] Create `claude_documents/` for documentation storage

#### 4. Code Quality & Naming Conventions
- [x] Refactor `cn` → `mergeTailwindClasses` (SOLID compliance)
- [x] Add comprehensive JSDoc documentation
- [x] Update all imports across components
- [x] Document naming conventions in CLAUDE.md

#### 5. Testing
- [x] Create tests for `mergeTailwindClasses` utility (13 tests)
- [x] Create tests for Button component (15 tests)
- [x] Create tests for Card component (19 tests)
- [x] Create tests for Input component (12 tests)
- [x] Create tests for Checkbox component (11 tests)
- [x] **Total: 72 tests - All passing ✅**

#### 6. Documentation
- [x] Update CLAUDE.md with:
  - File naming conventions
  - Code naming conventions (CRITICAL RULE)
  - Shadcn UI location and usage
  - Each feature must have its own provider/context
  - Documentation storage location
- [x] Create `SHADCN_SETUP.md` (moved to `claude_documents/`)
- [x] Create `RESTRUCTURE_SUMMARY.md` (moved to `claude_documents/`)
- [x] Create `REFACTOR_CN_TO_MERGE_TAILWIND_CLASSES.md` (moved to `claude_documents/`)

### Verification

```bash
npm run build   # ✅ Passes
npm run test:run # ✅ 72/72 tests passing
npm run lint    # ✅ No errors
```

### Breaking Changes
None - This is a greenfield setup.

### Migration Notes
- All Shadcn UI components use `mergeTailwindClasses` instead of `cn`
- Future Shadcn CLI installations will need manual refactor from `cn` to `mergeTailwindClasses`
- Use absolute imports: `@/_shared/infrastructure/components/ui/button`

### Files Changed
- Modified: `CLAUDE.md`, `package.json`, `package-lock.json`, `src/App.tsx`, `src/index.css`, `tsconfig.app.json`, `tsconfig.json`, `vite.config.ts`
- Added: `components.json`, `tailwind.config.js`, `postcss.config.js`, `tsconfig.test.json`
- Added: `src/_shared/` (complete structure)
- Added: `test/_shared/` (test structure)
- Added: `claude_documents/` (documentation)

### Dependencies Added
```json
{
  "dependencies": {},
  "devDependencies": {
    "tailwindcss": "^3.x",
    "postcss": "^8.x",
    "autoprefixer": "^10.x",
    "class-variance-authority": "^0.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    "lucide-react": "^0.x",
    "@radix-ui/react-slot": "^1.x",
    "@radix-ui/react-checkbox": "^1.x"
  }
}
```

### Next Steps
1. Implement dark mode toggle component
2. Add Google Fonts (Lato, Gloock)
3. Create first feature: TODOs with DDD architecture
4. Setup Cypress for E2E testing

---

**Created by:** Claude Code
**Date:** 2025-10-23
**Type:** Feature Implementation (Retroactive Documentation)
