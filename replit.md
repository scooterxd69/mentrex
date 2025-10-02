# Mentrex - AI Study Buddy Application

## Overview

Mentrex is an educational AI chatbot application featuring a T-Rex mascot theme. The application provides three core learning modes: answering questions, summarizing notes, and generating multiple-choice quizzes (MCQs). Built as a full-stack TypeScript application, it uses a React frontend with shadcn/ui components and an Express backend that integrates with Hugging Face AI services.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Technology Stack

**Frontend:**
- React with TypeScript
- Vite as the build tool and development server
- Wouter for client-side routing
- TanStack Query (React Query) for server state management
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with custom theming

**Backend:**
- Express.js server with TypeScript
- Node.js runtime environment
- ESM module system

**Database:**
- PostgreSQL configured via Drizzle ORM
- Neon Database serverless driver (@neondatabase/serverless)
- Database schema defined in shared/schema.ts
- Two main tables: `messages` and `conversations`

**AI Integration:**
- Hugging Face Inference API for AI capabilities
- Service layer abstracts AI interactions (server/services/huggingface.ts)

### Application Structure

The codebase follows a monorepo pattern with clear separation:

- `client/` - Frontend React application
- `server/` - Backend Express application  
- `shared/` - Shared TypeScript types and database schema
- `migrations/` - Database migration files (Drizzle Kit)

### Data Architecture

**Message Schema:**
Messages store all chat interactions with the following structure:
- `id`: UUID primary key
- `type`: Either 'user' or 'ai'
- `content`: The message text
- `mode`: Learning mode ('ask' | 'summarize' | 'mcq')
- `metadata`: JSONB field for structured data (MCQ options, summary points)
- `createdAt`: Timestamp

**Conversation Schema:**
Supports grouping messages into conversations with:
- `id`: UUID primary key
- `title`: Optional conversation title
- `createdAt` and `updatedAt`: Timestamps

**Storage Layer:**
An abstraction layer (IStorage interface) allows switching between implementations:
- MemStorage: In-memory storage for development/testing
- Future: PostgreSQL-backed storage using Drizzle ORM

### API Design

RESTful API endpoints under `/api`:
- `GET /api/messages` - Retrieve chat history (with optional limit)
- `POST /api/ask` - Submit a question for AI response
- `POST /api/summarize` - Request text summarization
- `POST /api/mcq` - Generate multiple-choice questions for a topic

Request/response validation uses Zod schemas for type safety.

### Frontend Architecture

**Component Structure:**
- Page components (`client/src/pages/`)
- Feature components (`client/src/components/`)
- Reusable UI components (`client/src/components/ui/`)
- Custom hooks (`client/src/hooks/`)

**State Management:**
- TanStack Query manages server state and caching
- Query keys follow the pattern `["/api/endpoint"]`
- Mutations invalidate queries to trigger refetches
- Local component state for UI interactions

**Styling Approach:**
- CSS variables defined in `index.css` for theming
- Custom color scheme with primary (green), secondary (orange), and accent (yellow) colors
- Dark mode support through CSS variable overrides
- Playful, educational aesthetic with custom fonts (Nunito, Poppins, JetBrains Mono)

### Build and Deployment

**Development:**
- Vite dev server with HMR
- Express server runs separately via tsx
- Middleware mode integration for seamless development

**Production Build:**
- Frontend: Vite builds to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js`
- Static file serving from Express in production

### Environment Configuration

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string (required for Drizzle)
- `HUGGING_FACE_API_KEY` or `HF_API_KEY`: Hugging Face API credentials
- `NODE_ENV`: 'development' or 'production'

### Path Aliases

TypeScript path mapping for clean imports:
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets/*` → `attached_assets/*`

### Third-Party UI Components

Extensive use of Radix UI primitives via shadcn/ui:
- Dialogs, dropdowns, and popovers for overlays
- Form controls (checkbox, radio, select, switch)
- Navigation components (tabs, accordion, menubar)
- Feedback components (toast, progress, skeleton)
- All components customized with Tailwind variants

### Validation and Type Safety

- Zod schemas for runtime validation
- Drizzle-Zod integration generates schemas from database tables
- Shared types ensure consistency between client and server
- TypeScript strict mode enabled