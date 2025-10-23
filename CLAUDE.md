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
  main.tsx        - Application entry point, renders App into #root
  App.tsx         - Root component
  App.css         - Component-level styles
  index.css       - Global styles
  assets/         - Static assets (images, fonts, etc.)
  _shared/
    domain/         - Shared Domain files (aggragates, value objetcs, interfaces, etc.)
    infrastructure/ - Shared components and views
    applications  - Shared custom hooks
  features/       - Each new feature/module of app
    domain/       - Aggragates, value objects and interfaces for repositories        
    hooks/        - Hooks, natives and custom
    repositories/ - Repositories for this feature implements their interfaces
    components/   - Components and views
test/             - Test files, same strcuture than src/
public/           - Static files served directly (favicon, etc.)
```

## Architecture Notes
- Use always SOLID princples and DDD
- Use custom hooks to call to repositories/services, and when appear some native hook in the same component too, we need to reduce the logical of components
- All the code has to be coverted by minium 80% on testing
- When the component has too logic, is convenient to split the view in other file
- Use always repositories with interface, easy to implements another driver and help to testing
- Create factories to call this repositories and inject in parent components
- **Each feature must have its own provider/context** - avoid centralizing all contexts in one place
- Avoid depreciated items

### Naming Conventions

#### File Naming
- **Components**: PascalCase (e.g., `TodoList.tsx`, `TodoItem.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useTodos.ts`, `useTodoRepository.ts`)
- **Repositories**: PascalCase (e.g., `TodoRepository.ts`, `UserRepository.ts`)
- **Interfaces**: PascalCase with descriptive names (e.g., `TodoRepository`, `Todo`)
- **Types**: Use `type` only for:
  - Union literals: `type Size = 'small' | 'medium' | 'large'`
  - When you need to extend with `&` operator
  - For all other cases, prefer `interface`

#### Code Naming - CRITICAL RULE
**All names (variables, functions, classes, etc.) MUST reflect their functionality or semantics clearly.**

Following SOLID principles, avoid cryptic or abbreviated names:

❌ **BAD Examples:**
```typescript
export function cn(...inputs: ClassValue[]) { }  // What does 'cn' mean?
const a = b + c  // What do a, b, c represent?
function proc(d) { }  // What does 'proc' do? What is 'd'?
```

✅ **GOOD Examples:**
```typescript
export function mergeTailwindClasses(...inputs: ClassValue[]): string { }
const totalPrice = basePrice + taxes
function processUserData(userData: UserData) { }
```

**Guidelines:**
- Use descriptive names that explain purpose
- Avoid single-letter variables (except for common iterators like `i`, `j` in loops)
- Avoid abbreviations unless universally understood (e.g., `HTTP`, `URL`)
- Function names should be verbs describing actions (e.g., `calculateTotal`, `fetchUserData`)
- Boolean variables should be questions (e.g., `isActive`, `hasPermission`, `shouldRender`)
- Add JSDoc documentation for complex functions


### Examples
```ts

export interface RepositoryWidget {
	id: string;
	repositoryUrl: string;
}

export class RepositoryAlreadyExists extends Error {
	constructor(id: string, url: string) {
		super(`There is a repository with the same url: ${url} or id: ${id}`);
	}
}

export class LocalStorageWidgetRepository implements RepositoryWidgetRepository {
	private readonly WIDGET_KEY: string = 'widgets';

	async save(widget: RepositoryWidget): Promise<void> {
		const currentWidgets = await this.findAll();
		const widgetExists = currentWidgets.some(w => w.id === widget.id || w.repositoryUrl === widget.repositoryUrl);

		if (widgetExists) {
			return Promise.reject(new RepositoryAlreadyExists(widget.id, widget.repositoryUrl));
		}

		const newWidgets = [...currentWidgets, widget];
		localStorage.setItem(this.WIDGET_KEY, JSON.stringify(newWidgets));

		return Promise.resolve();
	}

	async findAll(): Promise<RepositoryWidget[]> {
		const widgetsString = localStorage.getItem(this.WIDGET_KEY);
		if (!widgetsString) {
			return Promise.resolve([]);
		}
		return Promise.resolve(JSON.parse(widgetsString) as RepositoryWidget[]);
	}

	async search(query: string): Promise<RepositoryWidget[]> {
		const allWidgets = await this.findAll();
		const filteredWidgets = allWidgets.filter(widget =>
			widget.repositoryUrl.toLowerCase().includes(query.toLowerCase())
			|| widget.id.toLowerCase().includes(query.toLowerCase())
		);
		return Promise.resolve(filteredWidgets);
	}
}

export interface RepositoryWidgetRepository {
	save(widget: RepositoryWidget): Promise<void>;
	findAll(): Promise<RepositoryWidget[]>;
	search(query: string): Promise<RepositoryWidget[]>;
}


export class WidgetRepositoryFactory {
	static create(): RepositoryWidgetRepository {
		return new LocalStorageWidgetRepository();
	}
}

const repositoryWidget = WidgetRepositoryFactory.create();

export function App(): React.ReactElement {
	return <RepositoryWidgetProvider
		repositoryWidget={repositoryWidget}
	>
		<RouterApp/>
	</RepositoryWidgetProvider>;
}
```

### Design Patterns

We look for a minimalism design, with great look and feel and optimize for UX
Resposnive for multiple devices

Some styles predefined in root:
```css
:root {
    --font-family: 'Lato', sans-serif;
    --font-family-titles: 'Gloock', sans-serif;
    --aspect-ratio: 16/9;
    --line-height: 1.3;
    --font-size: clamp(1.2rem, 1.1vw, 1.35rem);
    --font-size-lg: clamp(1.3rem, 1.2vw, 1.45rem);
    --font-size-sm: clamp(1.1rem, 1vw, 1.2rem);
    --font-size-xs: clamp(0.95rem, .9vw, 1.1rem);
    --font-size-h1: clamp(2.3rem, 7vw, 7rem);
    --font-size-h2: clamp(2rem, 4vw, 4rem);
    --font-size-h3: clamp(1.5rem, 3.25vw, 3.25rem);
    --font-size-h4: clamp(1.35rem, 2.5vw, 3.25rem);
    --font-size-h5: var(--font-size-lg);
    --font-size-h6: var(--font-size);
}
```
Other design features:
- **Light/dark mode**: First read at system settings and then save one to localstorage
- **Components**: use Shadcn ui, if you need to install, just do it
  - Shadcn UI components are located in `src/_shared/infrastructure/components/ui/`
  - Use absolute imports: `import { Button } from '@/_shared/infrastructure/components/ui/button'`
  - Utilities are in `src/_shared/infrastructure/lib/utils.ts`
- **styles**: childrens class defined like {parent}__{child} and classes that modify another {parent}--{child}
- **modules-styles**: Use then as possible


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
Currently uses component state. The app is intended to use **localStorage** for persistence, but not yet implemented.

## Data Persistence Pattern
When implementing todo functionality, use localStorage:
```typescript
// Save
localStorage.setItem('todos', JSON.stringify(todos))

// Load
const saved = localStorage.getItem('todos')
const todos = saved ? JSON.parse(saved) : []
```

## Testing

### Running Tests
```bash
npm test           # Run tests in watch mode
npm run test:run   # Run tests once (for CI/CD)
npm run test:ui    # Open Vitest UI
```

### Testing Configuration
- **Framework**: Vitest 4.0.1 with jsdom environment
- **Testing Library**: @testing-library/react with @testing-library/jest-dom matchers
- **Location**: Tests are located in the `test/` directory
- **Setup**: Global test setup is in `test/setup.ts`
- **TypeScript**: Separate `tsconfig.test.json` with test-specific types
- **e2e**: Use Cypress, if you need to install and configure, just do it yourself
- **E2E Structure**: E2E tests should be in `test/e2e/` directory, replicating the structure of `src/`
  - Example: `src/features/todos/components/TodoList.tsx` → `test/e2e/features/todos/components/TodoList.cy.tsx`

### Testing Best Practices
**IMPORTANT**: Always use role-based queries from Testing Library for better accessibility and maintainability:

```typescript
// ✅ PREFERRED: Use role-based queries
screen.getByRole('heading', { name: 'Todo App' })
screen.getByRole('button', { name: 'Add Todo' })
screen.getByRole('textbox', { name: 'Task description' })
screen.getByRole('checkbox', { name: /completed/i })

// ❌ AVOID: Text-only queries when role queries are available
screen.getByText('Todo App')  // Use getByRole('heading') instead
```

Role-based queries:
- Mirror how users interact with the UI
- Encourage better accessibility practices
- Are more resilient to content changes
- Provide better error messages when elements aren't found

See [Testing Library docs](https://testing-library.com/docs/queries/about#priority) for query priority guidance.

## Build Output
- Development: Uses Vite dev server on default port 5173
- Production: TypeScript compiles to check types, Vite bundles to `dist/`

## Workfow
- Before start, create a issue with the new feature or correction with a small comment and todo list, with a tag bug/feature
- Create a branch with the name feature_{feature} or issue_{feature}
- Commits with logical code approved by tests
- Final commit
- Pull request to github with a resume of the developed
- Merge

### document storage place
The resume, historical, decision, future references, etc.. documents will be storage at /claude_documents


When in the prompt appear "#" this instruction has to insert in this document