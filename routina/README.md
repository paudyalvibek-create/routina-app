# Routina - AI-Powered Routine Builder & Habit Coach

A production-ready web application that helps users generate and follow adaptive daily routines to improve consistency and focus through AI-powered routine generation and habit tracking.

## Features

- **AI-Powered Routine Generation**: Generate personalized daily routines using Google's Gemini AI
- **Habit Tracking**: Create and track habits with streaks and analytics
- **Dynamic Re-planning**: Adjust your schedule on the fly while preserving completed activities
- **Analytics Dashboard**: Track completion rates, streaks, and progress over time
- **Study Planning Module**: Special features for students including Pomodoro technique hints
- **Multi-role Support**: Tailored routines for students, professionals, creators, and fitness enthusiasts

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **State Management**: TanStack Query, Zustand
- **Database**: Supabase Postgres with Prisma ORM
- **Authentication**: Supabase Auth
- **AI Integration**: Google AI Studio (Gemini 2.0 Flash)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 20.9.0 or higher
- pnpm package manager
- Supabase account
- Google AI Studio API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables (create `.env.local`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   DATABASE_URL=your_database_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

5. Run the development server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses the following tables:
- `preferences`: User preferences and onboarding data
- `plans`: Daily routine plans with activity blocks
- `habits`: User-defined habits
- `checkins`: Habit completion tracking
- `reminders`: User reminders

## API Endpoints

- `POST /api/plan/generate` - Generate new daily routine
- `PUT /api/plan/replan` - Re-plan remaining day
- `GET /api/plan/[date]` - Get routine for specific date
- `POST /api/habit/checkin` - Log habit completion
- `GET /api/analytics/summary` - User analytics data
- `POST /api/onboarding` - Save user preferences
- `PUT /api/preferences` - Update user settings
- `GET/POST/DELETE /api/habit` - Habit CRUD operations

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Make sure to configure environment variables in your Vercel project settings.

## License

MIT

## Author

Built by MiniMax Agent

