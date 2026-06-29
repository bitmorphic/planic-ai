# 🧠 Planic AI — Brain.md
> **The AI Accountability Operating System**  
> Single source of truth for project architecture, design system, modules, and roadmap.  
> Last updated: June 26, 2026

---

## 📌 Project Overview

| Field | Value |
|---|---|
| **Product Name** | Planic AI |
| **Tagline** | The AI Accountability Operating System |
| **Positioning** | Your AI Executive Assistant — not a task manager |
| **Demo User** | Anas Khan · CS Senior · Indie Hacker |
| **Stack** | Next.js 15 · TypeScript · Tailwind CSS · Framer Motion · Radix UI |
| **Primary Color** | Indigo `#4F46E5` / HSL `243 75% 59%` |
| **Accent Color** | Cyan `#06B6D4` / HSL `189 94% 43%` |

**Core vision:** Planic AI proactively *thinks, plans, prioritizes, schedules, predicts failure, and intervenes* before the user misses anything important. It combines Linear + Notion + Motion + Raycast + Arc Browser into one premium AI OS.

---

## 🗂️ Folder Structure

```
planicai/
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── layout.tsx               # Root layout (fonts, metadata, providers)
│   │   ├── page.tsx                 # Landing page (marketing)
│   │   ├── globals.css              # Design system tokens + utility classes
│   │   ├── icon.tsx                 # Favicon generator
│   │   ├── apple-icon.tsx           # Apple touch icon generator
│   │   └── app/                     # Authenticated app shell
│   │       ├── layout.tsx           # App shell layout (sidebar + topbar)
│   │       ├── page.tsx             # /app — Command Center (dashboard)
│   │       ├── deadlines/page.tsx   # /app/deadlines — Deadline Radar
│   │       ├── gmail/page.tsx       # /app/gmail — Gmail Intelligence
│   │       ├── planner/page.tsx     # /app/planner — AI Planner
│   │       ├── planic/page.tsx   # /app/planic — Planic Mode
│   │       ├── panic/page.tsx       # /app/panic — Panic Mode
│   │       ├── interviews/page.tsx  # /app/interviews — Interview Copilot
│   │       ├── bills/page.tsx       # /app/bills — Bill Guardian
│   │       ├── dna/page.tsx         # /app/dna — Productivity DNA
│   │       └── goals/page.tsx       # /app/goals — Goals & Habits
│   │
│   ├── components/
│   │   ├── app/                     # App shell components
│   │   │   ├── app-shell.tsx        # Sidebar + topbar responsive shell
│   │   │   ├── sidebar.tsx          # Navigation sidebar
│   │   │   ├── topbar.tsx           # Top navigation bar
│   │   │   ├── page-header.tsx      # Reusable page header
│   │   │   ├── command-palette.tsx  # ⌘K global command palette
│   │   │   ├── floating-assistant.tsx # AI floating chat assistant
│   │   │   └── task-card.tsx        # Reusable task card component
│   │   │
│   │   ├── marketing/               # Landing page sections
│   │   │   ├── header.tsx           # Marketing header + Logo
│   │   │   ├── hero.tsx             # Hero section
│   │   │   ├── hero-mockup.tsx      # Animated dashboard mockup in hero
│   │   │   ├── tech-logos.tsx       # "Trusted Technology" logo marquee
│   │   │   ├── how-it-works.tsx     # 3-step explainer section
│   │   │   ├── bento.tsx            # Feature bento grid (10 agents)
│   │   │   ├── dashboard-showcase.tsx # Dashboard preview section
│   │   │   ├── planic-showcase.tsx # Planic AI feature highlight
│   │   │   ├── cta-faq.tsx          # CTA + FAQ accordion
│   │   │   └── footer.tsx           # Site footer
│   │   │
│   │   ├── shared/                  # Reusable across app + marketing
│   │   │   ├── counter.tsx          # Animated count-up number
│   │   │   ├── motion.tsx           # Framer Motion animation presets
│   │   │   ├── priority.tsx         # UrgencyMeter component
│   │   │   ├── score-ring.tsx       # Circular score/progress ring
│   │   │   ├── skeleton.tsx         # Shimmer skeleton loader
│   │   │   └── theme-toggle.tsx     # Dark/light mode toggle
│   │   │
│   │   ├── brand/                   # Brand identity components
│   │   │   ├── logo-glyph.tsx       # Icon-only logo mark
│   │   │   ├── logo-mark.tsx        # Full logo with wordmark
│   │   │   ├── wordmark.tsx         # Text-only wordmark
│   │   │   └── brand-pattern.tsx    # Decorative brand pattern
│   │   │
│   │   ├── ui/                      # Primitive UI components (Radix-based)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── avatar.tsx
│   │   │
│   │   └── providers.tsx            # Theme provider wrapper
│   │
│   ├── lib/
│   │   ├── data.ts                  # All mock/demo data (822 lines)
│   │   ├── types.ts                 # TypeScript domain types
│   │   ├── utils.ts                 # Utilities: cn, urgencyScore, formatDate, etc.
│   │   └── nav.ts                   # Navigation items config
│   │
│   └── types/
│       └── speech.d.ts              # Web Speech API type declarations
│
├── prompt.md                        # Original AI product vision prompt
├── brain.md                         # ← THIS FILE
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🧩 Modules & Routes

| # | Module | Route | Status | Description |
|---|---|---|---|---|
| 01 | **Command Center** | `/app` | ✅ Built | Main dashboard: KPIs, Planic AI alert, Today's Focus, Deadline Radar, AI Recs, Interview widget |
| 02 | **Deadline Radar** | `/app/deadlines` | ✅ Built | Timeline + Kanban + risk prediction, urgency scores |
| 03 | **Gmail Intelligence** | `/app/gmail` | ✅ Built | Inbox scanner, AI task extraction, deadline/bill/interview detection |
| 04 | **AI Planner** | `/app/planner` | ✅ Built | Project breakdown, subtask generation, smart scheduling, effort estimation |
| 05 | **Planic Mode** | `/app/planic` | ✅ Built | Accountability dashboard, predicted consequences, future-self messages |
| 06 | **Panic Mode** | `/app/panic` | ✅ Built | Emergency rescue plan, time remaining, survival focus mode |
| 07 | **Interview Copilot** | `/app/interviews` | ✅ Built | Company research, prep checklist, mock interview planner |
| 08 | **Bill Guardian** | `/app/bills` | ✅ Built | Recurring bills, upcoming payments, subscription tracking, risk alerts |
| 09 | **Productivity DNA** | `/app/dna` | ✅ Built | Focus heatmap (7d×24h), peak performance windows, weekly trend charts |
| 10 | **Goals & Habits** | `/app/goals` | ✅ Built | Goals with milestones, habit streaks, weekly completion tracking |

---

## 🤖 AI Agents

| Agent | Purpose | Status |
|---|---|---|
| **Gmail Intelligence** | Reads inbox, detects assignments/deadlines/bills/meetings/interviews, extracts structured tasks | UI Done |
| **Vision Task** | User uploads photos/screenshots → Gemini Vision extracts tasks and deadlines | UI Done |
| **Voice Capture** | Speak → scheduled task (Web Speech API type declarations present) | UI Done |
| **AI Planner** | Input goal → auto-generates subtasks with priorities, estimates, dependencies | UI Done |
| **Calendar Agent** | Syncs with Google Calendar, auto-schedules focus blocks | UI Done |
| **Interview Copilot** | Detects interview emails → company research, prep tracker, mock planner | UI Done |
| **Bill Guardian** | Tracks recurring bills, escalates urgency, risk alerts | UI Done |
| **Planic AI** | Generates emotional accountability messages from "future self" perspective | UI Done |
| **Panic Mode** | <24h deadlines → emergency rescue plan, minimal survival focus | UI Done |
| **Productivity DNA** | Learns peak hours, focus patterns, task completion trends | UI Done |

---

## 🎨 Design System

### Color Tokens (HSL Semantic)

| Token | Light | Dark | Hex (Light) |
|---|---|---|---|
| `--background` | `210 40% 98%` | `226 47% 9%` | `#F8FAFC` / `#0B1020` |
| `--surface` | `210 40% 99%` | `219 30% 12%` | `#FDFDFE` / `#121826` |
| `--card` | `0 0% 100%` | `217 32% 16%` | `#FFFFFF` / `#1A2332` |
| `--primary` | `243 75% 59%` | `243 76% 62%` | `#4F46E5` |
| `--accent` | `189 94% 43%` | `189 94% 45%` | `#06B6D4` |
| `--destructive` | `0 84% 60%` | `0 84% 64%` | `#EF4444` |
| `--success` | `160 84% 39%` | `160 84% 42%` | `#10B981` |
| `--warning` | `38 92% 50%` | `38 92% 52%` | `#F59E0B` |

**Design Philosophy:** 90% neutral · 10% accent — Linear × Vercel × Stripe × Apple polish

### Typography

| Variable | Font | Usage |
|---|---|---|
| `--font-inter` | Inter (Google Fonts) | Body, UI text |
| `--font-geist-sans` | Geist Sans (Vercel) | Display, headings |
| `--font-mono` | JetBrains Mono | Code, tabular numbers |

### Utility Classes (globals.css)

| Class | Purpose |
|---|---|
| `.eyebrow` | Section label (uppercase, tracked) |
| `.section` | Vertical rhythm (`py-20 sm:py-28`) |
| `.glass` | Glassmorphism (backdrop blur + tinted bg) |
| `.card-elevated` | Card with elevation + hover lift shadow |
| `.gradient-border` | CSS pseudo-element gradient border |
| `.aurora` | Blurred ambient glow blob |
| `.text-gradient` | Primary→Accent gradient text |
| `.text-gradient-warm` | Amber→Red→Pink warm gradient text |
| `.skeleton` | Shimmer loading skeleton |
| `.glow-primary` | Primary color box-shadow glow |
| `.lift` | Hover translateY(-3px) lift |
| `.link-underline` | Animated underline on hover |

### Animations (Tailwind keyframes)

| Name | Effect |
|---|---|
| `shimmer` | Skeleton loading sweep |
| `fade-in` | Opacity + translateY entrance |
| `pulse-glow` | Breathing opacity glow |
| `float` | Gentle up-down floating |
| `gradient-x` | Background position cycling |
| `marquee` | Horizontal scroll loop |

---

## 📦 Tech Stack

### Frontend
| Package | Version | Purpose |
|---|---|---|
| Next.js | ^16.2.9 | App Router, SSR, routing |
| React | ^19.0.0 | UI library |
| TypeScript | ^5.7.2 | Type safety |
| Tailwind CSS | ^3.4.17 | Utility styling |
| Framer Motion | ^11.15.0 | Animations, layout transitions |
| Radix UI | various | Accessible UI primitives |
| Lucide React | ^0.469.0 | Icon system |
| Recharts | ^2.15.0 | Charts (DNA heatmap, trend charts) |
| next-themes | ^0.4.4 | Dark/light theme switching |
| Sonner | ^1.7.1 | Toast notifications |
| Geist | ^1.7.2 | Vercel's Geist font |
| class-variance-authority | ^0.7.1 | Component variant system |
| clsx + tailwind-merge | latest | Conditional class merging |

### Planned Backend (per prompt.md)
- **Firebase Auth** — Google OAuth
- **Firestore** — Database
- **Cloud Functions** — Serverless logic
- **Gemini 2.5 / Vertex AI** — AI agents
- **Gmail API** — Inbox intelligence
- **Google Calendar API** — Scheduling
- **Cloud Run** — Containerized agents
- **Firebase Hosting** — Deployment

---

## 🗃️ Data Model (TypeScript Types)

```typescript
Task          // Core task: id, title, category, priority, status, deadline, effortHours, progress, source, subtasks
SubTask       // Sub-items of a task with completion state
Email         // Gmail message with AI-detected type and extracted task
Bill          // Recurring payment with amount, dueDate, riskLevel, autoPay
Goal          // Long-term goal with milestones and streak
Milestone     // Goal sub-checkpoint (done/undone)
Habit         // Daily habit with 7-day completion map and streak
CalendarEvent // Scheduled block with start/end, type (focus/meeting/class/break)
Interview     // Job interview with company, checklist, research notes, prepProgress
PlanicMessage // Accountability message with tone (motivation/regret/warning/celebration)
ProductivitySlot // Heatmap cell: hour × day × score
AISuggestion  // AI recommendation card with type (warning/schedule/focus/opportunity/insight)
```

**Priority levels:** `low | medium | high | critical`  
**Task sources:** `gmail | voice | vision | manual | planner`  
**Task status:** `todo | in_progress | done | overdue`

---

## 🔑 Key Utilities (`src/lib/utils.ts`)

| Function | Purpose |
|---|---|
| `cn(...)` | Merge Tailwind classes (clsx + tailwind-merge) |
| `urgencyScore(deadline, priority)` | Compute 0–100 urgency from deadline proximity and priority |
| `formatDate(date, options?)` | Locale-aware date formatting |
| `formatTime(date)` | Time formatting (HH:MM) |
| `inHours(n)` | ISO date offset by n hours from now (for demo data) |
| `inDays(n)` | ISO date offset by n days from now (for demo data) |
| `initials(name)` | Extract initials from full name |

---

## 🧭 Navigation (`src/lib/nav.ts`)

```
01  Command Center      /app              LayoutDashboard   #4F46E5
02  Deadline Radar      /app/deadlines    Radar             #EF4444  [badge: 6]
03  Gmail Intelligence  /app/gmail        Mail              #06B6D4  [badge: 2]
04  AI Planner          /app/planner      Workflow          #8B5CF6
05  Planic Mode      /app/planic    Sparkles          #EC4899
06  Panic Mode          /app/panic        Siren             #EF4444  [badge: !]
07  Interview Copilot   /app/interviews   Briefcase         #6366F1
08  Bill Guardian       /app/bills        Receipt           #22C55E  [badge: 3]
09  Productivity DNA    /app/dna          Dna               #8B5CF6
10  Goals & Habits      /app/goals        Target            #F59E0B
```

---

## 🖼️ Landing Page Sections (`src/app/page.tsx`)

1. **MarketingHeader** — Sticky nav with logo, links, CTA, theme toggle
2. **Hero** — Main headline + subtext + CTA buttons + HeroMockup animation
3. **TechLogos** — Marquee of trusted technology logos (Google, Firebase, Gemini, etc.)
4. **HowItWorks** — 3-step process: Connect → Detect → Act
5. **Bento** — Feature grid showcasing all 10 AI agents
6. **DashboardShowcase** — Animated preview of the app dashboard
7. **PlanicShowcase** — Spotlight on the Planic Mode feature
8. **CtaFaq** — Bottom CTA + accordion FAQ
9. **Footer** — Links, social, copyright

---

## 🧱 App Shell Components

| Component | Description |
|---|---|
| `AppShell` | Responsive wrapper: sidebar (desktop) + topbar + mobile drawer |
| `Sidebar` | 64px-wide nav with module links, active state (Framer Motion `layoutId`) |
| `Topbar` | Search trigger, theme toggle, user avatar, notification bell |
| `CommandPalette` | ⌘K modal with fuzzy search over all modules/actions |
| `FloatingAssistant` | Bottom-right AI chat bubble with Gemini-powered responses |
| `TaskCard` | Compact/full task card with priority badge, progress bar, deadline |
| `PageHeader` | Standardized h1 + breadcrumb for each module page |

---

## 📊 Demo Data Summary

| Dataset | Count | Description |
|---|---|---|
| `TASKS` | 12 | Mix of assignments, bills, meetings, interviews, projects, habits |
| `EMAILS` | 6 | Gmail messages with AI-extracted tasks (assignment, interview, bill, meeting) |
| `BILLS` | 6 | Mix of due/upcoming/overdue bills in INR and USD |
| `GOALS` | 3 | Google offer, Planic AI launch, 3.9+ GPA |
| `HABITS` | 4 | Deep work, reading, gym, no-phone rule |
| `CALENDAR_EVENTS` | 7 | Focus blocks, meetings, classes — auto-scheduled by AI |
| `INTERVIEWS` | 2 | Google SWE (3 days), Linear Frontend (9 days) |
| `PLANIC_MESSAGES` | 3 | Regret, motivation, warning tones |
| `PRODUCTIVITY_HEATMAP` | 168 slots | 7 days × 24 hours, score 0–100 |
| `AI_SUGGESTIONS` | 5 | Warning, schedule, focus, opportunity, insight cards |
| `AGENTS` | 10 | All 10 AI agents with status and processed count |

**Demo user:** `Anas Khan` · Productivity Score: 78 · Focus Score: 64 · Streak: 12 days

---

## 🛠️ What Is Built vs. What Needs Work

### ✅ Fully Built (Frontend/UI)
- [x] Landing page with all 8 sections
- [x] App shell (sidebar + topbar + responsive layout)
- [x] All 10 module pages with realistic demo data
- [x] Command palette (⌘K)
- [x] Floating AI assistant
- [x] Design system (tokens, typography, animations, components)
- [x] Dark / Light theme toggle
- [x] Brand components (logo, glyph, wordmark, pattern)

### 🔧 Needs Redesign / Improvement
> _To be filled as redesign tasks are identified_

- [ ] Hero section — could be more visually dramatic and interactive
- [ ] Bento grid — feature descriptions could be richer
- [ ] Mobile responsiveness audit across all module pages
- [ ] Dashboard Command Center — add mini calendar widget
- [ ] Planic AI page — add animated message transitions
- [ ] Panic Mode — add live countdown timer component
- [ ] Productivity DNA — heatmap needs Recharts implementation

### 🚀 Needs Building (Features & Backend)
- [ ] Firebase Auth integration (Google OAuth)
- [ ] Firestore database connection (replace mock data)
- [ ] Gmail API integration (real inbox scanning)
- [ ] Google Calendar API sync
- [ ] Gemini 2.5 API integration for AI agents
- [ ] Voice capture (Web Speech API implementation)
- [ ] Vision upload (Gemini Vision for screenshot → task)
- [ ] Real-time notifications system
- [ ] User settings / profile page
- [ ] Pricing page
- [ ] Onboarding flow

---

## 🎯 Product Positioning

**Target Users:**
- CS/engineering students with assignments, exams, deadlines
- Indie hackers / startup founders managing multiple projects
- Job seekers preparing for technical interviews
- Young professionals tracking bills, habits, and career goals

**Competitors it outperforms:**
- Todoist / TickTick — only remind, don't think
- Notion — too open-ended, no accountability
- Motion — schedules but no emotional accountability
- Reclaim.ai — calendar-only, no agent intelligence

**Unique differentiation:** "Planic AI" emotional accountability engine — AI messages from your future self creating *fear of regret* motivation without being toxic.

---

## 📐 Component Hierarchy (Quick Reference)

```
RootLayout (layout.tsx)
├── Providers (next-themes)
├── [Marketing pages] (page.tsx)
│   └── MarketingHeader > Hero > TechLogos > HowItWorks > Bento > ...
└── AppShell (app/layout.tsx)
    ├── Sidebar
    │   └── NAV_ITEMS × Link
    ├── Topbar
    │   └── CommandPalette (⌘K)
    ├── [Module Page] (app/*/page.tsx)
    │   └── PageHeader + module-specific content
    └── FloatingAssistant
```

---

## 💡 Key Design Decisions

1. **Mock data is "live"** — all dates use `inHours()` / `inDays()` offset from `Date.now()`, so the demo always feels current
2. **90/10 color rule** — 90% neutral grays, 10% indigo/cyan accent. No neon, no rainbow
3. **Framer Motion `layoutId`** — used for sidebar active pill animation (smooth spring transition)
4. **Radix UI primitives** — all interactive elements (Dialog, Tabs, Select, Progress) use Radix for a11y
5. **`cn()` utility** — every component uses `clsx + tailwind-merge` for safe class merging
6. **HSL tokens over hex** — entire design system in CSS HSL vars, no hex drift across components
7. **Desktop-first** — designed at 1400px max-width, responsive down to mobile

---

*This file is the single source of truth for the Planic AI project. Update it whenever a major module is added, redesigned, or connected to a real backend.*
