# Foundrly Engineering Guide

This document serves as the system prompt/context for Claude Code to work effectively in the Foundrly repository, structured using the WAT (Workflows, Architecture, Tech Stack) Architecture.

## WAT Architecture

### 1. Workflows
Standard procedures for developing, testing, and shipping code in this repository.

- **Development Server**: Run `npm run dev` to start the Vite local development server.
- **Production Build**: Run `npm run build` to compile the application for production into the `dist/` directory.
- **Linting**: Run `npm run lint` to enforce code quality and style using ESLint.
- **Type Checking**: Run `npm run typecheck` to verify TypeScript types across the project.
- **Preview Build**: Run `npm run preview` to serve the production build locally for verification.

### 2. Architecture
The high-level structural design and organization of the codebase.

- **Entry Point**: 
  - `src/main.tsx`: Application entry point that mounts the React tree.
  - `src/App.tsx`: configuring global providers, authentication listeners, and `react-router-dom` routes.
- **Routing**: 
  - Uses `react-router-dom` (v7).
  - Routes are separated into public (Landing, Auth, Resources) and private (`/dashboard/*`) paths.
- **Component Organization**:
  - `src/components/`: specialized UI components (e.g., `HeaderEnhanced`, `Footer`).
  - `src/pages/`: Full-page components mapped to routes.
  - `src/lib/`: Core utilities and external service integrations (Supabase, OpenAI, etc.).
  - `src/types/`: Shared TypeScript definitions.
- **Authentication Flow**: 
  - Supabase Auth handles user sessions.
  - `App.tsx` monitors `onAuthStateChange` to protect dashboard routes and redirect users.

### 3. Tech Stack
The foundational technologies and libraries used to build Foundrly.

- **Core Framework**: React 18, TypeScript 5, Vite 5
- **Styling & UI**: 
  - **Tailwind CSS 3**: Primary styling engine.
  - **Framer Motion**: Animation library for transitions and effects.
  - **Lucide React**: Icon set.
- **Data & State**: 
  - **Supabase**: Backend-as-a-Service (Auth, Database).
  - **React Hooks**: Local state management.
- **AI & Integrations**:
  - **OpenAI**: Text generation and processing.
  - **Fal AI**: Image and video generation capabilities.
  - **Firecrawl**: Web scraping services.
- **Utilities**: 
  - **Recharts**: Data visualization and charts.
  - **React Router DOM**: Client-side routing.

## AI Coding Guidelines
When generating code for this repository:
- **Style**: Use Functional Components with Hooks.
- **Styling**: Exclusively use Tailwind CSS utility classes. Avoid inline styles or CSS modules.
- **Types**: Maintain strict TypeScript typing. Define interfaces for props and API responses.
- **Imports**: Use absolute imports where configured, or clear relative imports.
- **Safety**: Always handle loading states and potential errors from AI service calls.
