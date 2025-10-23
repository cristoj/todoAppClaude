# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a minimalist todo web application built with React 19, TypeScript, and Vite. The app stores todo items in browser localStorage for persistence.

## Tech Stack

- **Frontend Framework**: React 19.1.1 with React DOM
- **Build Tool**: Vite 7.1.7
- **Language**: TypeScript 5.9.3
- **Compiler**: React Compiler (babel-plugin-react-compiler) enabled for automatic optimization
- **Linting**: ESLint 9 with TypeScript ESLint configuration

## Development Commands

### Start Development Server
```bash
npm run dev
```
Starts Vite dev server with HMR (Hot Module Replacement).

### Build for Production
```bash
npm run build
```
Runs TypeScript compiler (`tsc -b`) followed by Vite build. Output goes to `dist/` directory.

### Lint Code
```bash
npm run lint
```
Runs ESLint on all TypeScript/TSX files according to `eslint.config.js`.

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing.

## Project Structure

```
src/
  main.tsx       - Application entry point, renders App into #root
  App.tsx        - Root component
  App.css        - Component-level styles
  index.css      - Global styles
  assets/        - Static assets (images, fonts, etc.)
public/          - Static files served directly (favicon, etc.)
```

## Architecture Notes

### React Compiler
The React Compiler is **enabled** via babel-plugin-react-compiler in `vite.config.ts:9`. This automatically optimizes React components by memoizing values and components without explicit `useMemo`/`useCallback`. Note that this impacts dev and build performance.

### TypeScript Configuration
- **Strict mode enabled**: All strict type-checking options are on (`tsconfig.app.json:20`)
- **Module resolution**: Uses "bundler" mode for Vite compatibility (`tsconfig.app.json:12`)
- **JSX**: Configured for `react-jsx` transform (no need to import React in files)
- Project uses TypeScript project references with separate configs for app code and node scripts

### ESLint Configuration
ESLint uses the new flat config format (`eslint.config.js`). Configuration includes:
- TypeScript ESLint recommended rules
- React Hooks recommended rules (latest)
- React Refresh rules for Vite
- Ignores `dist/` directory

### State Management
Currently uses component state. The app is intended to use **localStorage** for persistence (mentioned in `App.tsx:8` but not yet implemented).

## Data Persistence Pattern

When implementing todo functionality, use localStorage:
```typescript
// Save
localStorage.setItem('todos', JSON.stringify(todos))

// Load
const saved = localStorage.getItem('todos')
const todos = saved ? JSON.parse(saved) : []
```

## Build Output
- Development: Uses Vite dev server on default port 5173
- Production: TypeScript compiles to check types, Vite bundles to `dist/`
