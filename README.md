# Flowlist - Premium Modern Serverless Todo App

Production-ready Todo web app with premium SaaS styling, Firebase serverless backend, Framer Motion interactions, drag-and-drop ordering, stats, streaks, AI suggestions, voice input, and PWA installability.

## Tech Stack

- Frontend: Next.js (React, JavaScript only)
- Styling: Pure CSS + CSS Modules (no Tailwind)
- Animation: Framer Motion
- Backend (serverless): Firebase Auth + Firestore
- Hosting: Vercel

## Full Project Structure

```text
.
|- .env.example
|- firebase/
|  |- firestore.indexes.json
|  |- firestore.rules
|- public/
|  |- sw.js
|- src/
|  |- app/
|  |  |- api/ai-suggestions/route.js
|  |  |- auth/login/page.js
|  |  |- auth/signup/page.js
|  |  |- dashboard/page.js
|  |  |- globals.css
|  |  |- layout.js
|  |  |- manifest.js
|  |  |- page.js
|  |- components/
|  |  |- AISuggestions.js
|  |  |- AppProviders.js
|  |  |- ProtectedRoute.js
|  |  |- PwaRegistrar.js
|  |  |- SkeletonList.js
|  |  |- StatsPanel.js
|  |  |- ThemeToggle.js
|  |  |- TodoComposer.js
|  |  |- TodoFilters.js
|  |  |- TodoItem.js
|  |  |- TodoList.js
|  |  |- VoiceInputButton.js
|  |- hooks/
|  |  |- useAuth.js
|  |  |- useDebounce.js
|  |  |- useKeyboardShortcuts.js
|  |  |- useTheme.js
|  |  |- useTodos.js
|  |- pages/
|  |  |- README.md
|  |- services/
|  |  |- ai/suggestions.js
|  |  |- firebase/auth.js
|  |  |- firebase/config.js
|  |  |- firebase/todos.js
|  |- styles/
|  |  |- auth.module.css
|  |  |- components.module.css
|  |  |- dashboard.module.css
|  |  |- landing.module.css
|  |- utils/
|  |  |- constants.js
|  |  |- date.js
|  |  |- sanitize.js
|  |  |- stats.js
|  |  |- validation.js
|  |- views/
|  |  |- AuthPage.js
|  |  |- DashboardPage.js
|  |  |- LandingPage.js
```

## Step-by-Step Setup Guide

1. Install dependencies.

```bash
npm install
```

2. Create Firebase project.

- Go to Firebase Console and create a project.
- Enable Authentication providers:
	- Email/Password
	- Google
- Create Firestore database (Production mode recommended).

3. Configure Firebase environment values.

- Copy `.env.example` to `.env.local`.
- Fill values from Firebase project settings.

```bash
cp .env.example .env.local
```

Required vars:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Optional var (AI):

- `GROQ_API_KEY`
- `GROQ_MODEL` (optional, default: `llama-3.3-70b-versatile`)

4. Run the app locally.

```bash
npm run dev
```

5. Run quality checks.

```bash
npm run lint
npm run build
```

## Component-Wise Implementation Map

- Landing page UI and motion: `src/views/LandingPage.js`
- Auth screens (email/password + Google): `src/views/AuthPage.js`
- Dashboard orchestration and productivity UX: `src/views/DashboardPage.js`
- Todo creation/edit modal card: `src/components/TodoComposer.js`
- Search/filter/sort controls: `src/components/TodoFilters.js`
- Drag-and-drop list and item interactions: `src/components/TodoList.js`, `src/components/TodoItem.js`
- Stats and streak tracking: `src/components/StatsPanel.js`, `src/utils/stats.js`
- AI suggestions: `src/components/AISuggestions.js`, `src/services/ai/suggestions.js`, `src/app/api/ai-suggestions/route.js`
- Voice input: `src/components/VoiceInputButton.js`
- Auth and theme providers: `src/hooks/useAuth.js`, `src/hooks/useTheme.js`, `src/components/AppProviders.js`
- Firebase service layer: `src/services/firebase/auth.js`, `src/services/firebase/todos.js`
- PWA and offline support: `public/sw.js`, `src/app/manifest.js`, Firestore local cache in `src/services/firebase/config.js`

## Firebase Schema

### users

- `id` (string)
- `name` (string)
- `email` (string)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### todos

- `id` (string doc id)
- `userId` (string)
- `title` (string)
- `description` (string)
- `completed` (boolean)
- `priority` (low | medium | high)
- `dueDate` (timestamp | null)
- `tags` (string[])
- `order` (number)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)
- `completedAt` (timestamp | null)

## Firestore Security and Indexes

- Security rules file: `firebase/firestore.rules`
- Composite indexes file: `firebase/firestore.indexes.json`

Deploy with Firebase CLI:

```bash
firebase login
firebase init firestore
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

## Performance and UX Features Included

- Debounced search via `useDebounce`
- Lazy-safe modular architecture and memoized filtering
- Optimistic UI for completion and ordering
- Framer Motion transitions and micro-interactions
- Skeleton loaders and toast notifications
- Keyboard shortcuts:
	- `N`: open new task composer
	- `/`: focus search
	- `Esc`: close edit mode
- Light/Dark mode toggle with persistence
- PWA manifest + service worker registration

## Deployment to Vercel

1. Push code to GitHub.
2. Import project in Vercel.
3. Add all `.env.local` values into Vercel Environment Variables.
4. Set production domain in Firebase Auth authorized domains.
5. Deploy.

Recommended post-deploy checks:

- Login/signup flow
- Google OAuth popup flow
- Firestore read/write permissions per user
- Todo CRUD + drag-and-drop persistence
- PWA install prompt behavior

## Notes

- This project uses Next.js App Router (`src/app`) as runtime router.
- `src/pages` is intentionally retained for structure compliance and documentation.
