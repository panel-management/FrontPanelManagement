# AI Agent Instructions for FrontPanelManagement

This is a Nuxt.js-based front-end management system with a focus on sports club management. Here's what you need to know to work effectively with this codebase:

## Architecture Overview

### Core Technologies

- **Framework**: Nuxt.js with TypeScript
- **UI Components**: Nuxt UI with custom components
- **State Management**: Pinia stores (`stores/`)
- **API Integration**: Custom services with TypeScript interfaces

### Key Directories

- `components/`: UI components organized by feature
  - `Base/`: Reusable form components and UI elements
  - `Widget/`: Complex components including modals and dialogs
  - `Charts/`: Client-side chart components
  - `Table/`: Data table components for different entities
- `pages/`: Route-based views following Nuxt file-based routing
- `services/`: API service modules for backend communication
- `models/`: TypeScript interfaces and type definitions
- `composables/`: Reusable Vue composition functions

## Project Patterns

### Component Conventions

1. Modal Components:
   - Located in `components/Widget/Modal/{Entity}/`
   - Follow Add/Edit pattern (see `Master/Add.vue` and `Master/Edit.vue`)
   - Use the modal store for state management

2. Form Components:
   - Base form elements in `components/Base/`
   - Follow `form{ComponentType}` naming (e.g., `formInput.vue`, `formSelect.vue`)
   - Use TypeScript for prop definitions

### State Management

- Use Pinia stores in `stores/` directory
- Key stores:
  - `accountStore.ts`: User authentication and profile
  - `modalStore.ts`: Modal/dialog state management
  - `toastStore.ts`: Notification management

### API Integration

- Services follow entity-based organization in `services/`
- Use TypeScript interfaces from `models/` for type safety
- Handle API responses using `ApiResponse.ts` interface

## Development Workflows

### Running the Project

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Production build
pnpm build
```

### Common Tasks

1. Adding a New Feature:
   - Create component in appropriate directory
   - Add TypeScript interfaces in `models/`
   - Create/update service in `services/`
   - Add route in `pages/` if needed

2. Working with Modals:
   - Use `useConfirmDialog()` composable for confirmations
   - Follow existing modal patterns in `Widget/Modal/`
   - Manage state through modalStore

## Best Practices

1. Use composables for reusable logic (see `composables/`)
2. Follow TypeScript interfaces for API data structures
3. Use base form components for consistent UI
4. Implement proper type definitions for all components

## Key Files for Reference

- `composables/showConfirmDialog.ts`: Dialog management pattern
- `components/Base/formInput.vue`: Base component pattern
- `services/auth.service.ts`: API service pattern
- `stores/modalStore.ts`: State management pattern
