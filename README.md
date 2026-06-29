<div align="center">

  <img src="./public/planic-ai-logo.png" alt="Planic AI Logo" width="220"/>

  <h1>Planic AI</h1>
  <p><strong>The AI Accountability Operating System</strong></p>

  <br/>

  <img src="./public/vibe2ship.png" alt="Vibe 2 Ship — CodingNinjas x Google for Developers" width="340"/>

  <br/><br/>

  <!-- Tech Stack Badges -->
  <img src="https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <br/>
  <img src="https://img.shields.io/badge/Firebase-DD2C00?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase" />
  <img src="https://img.shields.io/badge/Firestore-FFCA28?style=for-the-badge&logo=google&logoColor=black" alt="Firestore" />
  <img src="https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="NextAuth.js" />
  <img src="https://img.shields.io/badge/Google_Cloud_Run-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white" alt="Google Cloud Run" />
  <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/Gmail_API-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Gmail API" />

</div>

---

## 🚀 The Problem: Tool Fatigue is Killing Productivity

Students, professionals, and entrepreneurs frequently miss deadlines, bill payments, and interviews — not because they lack tools, but because existing tools create **"tool fatigue."** Data is fragmented across calendars, financial apps, to-do lists, and email clients, and passive reminders are trivially easy to ignore.

**Planic AI** flips this paradigm entirely. Instead of waiting for users to manually log tasks, it proactively connects to real data streams (like Gmail), uses Google Gemini to extract hidden obligations, and intervenes with **Panic Mode** to aggressively restructure failing schedules before deadlines are missed.

---

## 🔥 Core Features

| Feature | Description |
|---|---|
| 📊 **Command Center** | Central dashboard aggregating all active modules with a real-time Accountability Score |
| 🚨 **Panic Mode** | High-contrast brutalist UI locks in. Gemini triages and restructures tasks to surface the single most critical action |
| 🤖 **AI Planner** | Ingests ambiguous goals (e.g., *"Launch a Startup"*) and autonomously breaks them into daily, actionable sub-tasks |
| 📧 **Gmail Intelligence** | Parses incoming emails to extract action items, detect deadlines, and convert static emails into tracked tasks |
| 💸 **Bill Guardian** | Scans connected data streams for upcoming bills and recurring subscriptions so payment deadlines are never missed |

---

## 🏗️ Architecture & AI Agent Workflows

### 1. AI Planner — Autonomous Goal Breakdown

The AI Planner sends a high-level goal to Google Gemini and receives a structured, chronologically ordered task list in return, which is persisted to Firestore and surfaced in real-time on the dashboard.

```mermaid
sequenceDiagram
    actor User
    participant UI as Next.js UI
    participant API as Next.js Edge API
    participant Gemini as Google Gemini
    participant DB as Firestore

    User->>UI: Submits ambiguous goal<br/>("Launch a Startup")
    UI->>API: POST /api/planner
    API->>Gemini: Goal + execution constraints
    Gemini-->>API: Structured JSON (sub-tasks, durations, priorities)
    API->>DB: Persist sub-tasks linked to Goal ID
    DB-->>UI: Real-time listener fires
    UI-->>User: Dashboard updates with actionable plan
```

---

### 2. Gmail Intelligence — Context Extraction Pipeline

A background serverless agent scans the connected inbox, forwards email content through Gemini's parsing engine, and routes extracted intelligence (tasks, deadlines, bills) into the appropriate modules automatically.

```mermaid
flowchart TD
    A[📧 Incoming Email / Data Stream] --> B[Next.js Serverless Function]
    B --> C{⚡ Google Gemini Parsing Engine}

    C -->|Action Item Detected| D[🗂️ Create Task in Firestore]
    C -->|Due Date Detected| E[📅 Update Deadline Radar]
    C -->|Invoice / Bill Detected| F[💳 Add to Bill Guardian]

    D --> G[🖥️ Command Center Dashboard]
    E --> G
    F --> G

    style A fill:#EA4335,color:#fff,stroke:none
    style C fill:#8E75B2,color:#fff,stroke:none
    style G fill:#1a1a1a,color:#fff,stroke:none
```

---

### 3. Panic Mode — Intelligent Triage Flow

When the user is overwhelmed, Panic Mode locks the UI and invokes Gemini to perform aggressive triage on the current task list.

```mermaid
flowchart LR
    A[🚨 User Activates Panic Mode] --> B[UI locks into Brutalist Mode]
    B --> C[Fetch all active tasks from Firestore]
    C --> D{Google Gemini Triage}
    D --> E[Rank tasks by urgency + impact]
    E --> F[Surface #1 critical task]
    F --> G[Block all other UI interactions]
    G --> H[User completes critical task]
    H --> I[Panic Mode deactivated ✅]

    style A fill:#FF3B30,color:#fff,stroke:none
    style D fill:#8E75B2,color:#fff,stroke:none
    style I fill:#34C759,color:#fff,stroke:none
```

---

## 🛠️ Local Development

### 1. Clone the repository
```bash
git clone https://github.com/bitmorphic/futureyouai.git
cd futureyouai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root directory:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_auth_domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"

# Google OAuth (NextAuth)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_generated_secret"
```

### 4. Start the dev server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## ☁️ Deployment on Google Cloud Run

This app is fully containerized and optimized for **Google Cloud Run** with zero cold-start configuration.

1. Connect your GitHub repo to **Google Cloud Build**
2. Target the `main` branch
3. Use Google's automated **Node.js Buildpacks** — no Dockerfile needed
4. Inject environment variables in the Cloud Run service configuration
5. Enable unauthenticated invocations to make the app publicly accessible

```mermaid
flowchart LR
    A[GitHub Push to main] --> B[Cloud Build Trigger]
    B --> C[Node.js Buildpack]
    C --> D[Container Image → Artifact Registry]
    D --> E[Deploy to Cloud Run]
    E --> F[🌐 Live on Public URL]

    style A fill:#24292e,color:#fff,stroke:none
    style E fill:#4285F4,color:#fff,stroke:none
    style F fill:#34C759,color:#fff,stroke:none
```

---

## 📁 Project Structure

```
futureyouai/
├── public/
│   ├── planic-ai-logo.png
│   └── vibe2ship.png
├── app/
│   ├── api/                  # Next.js Edge API routes
│   │   ├── planner/          # AI Planner endpoint
│   │   ├── gmail/            # Gmail Intelligence endpoint
│   │   └── bills/            # Bill Guardian endpoint
│   ├── dashboard/            # Command Center UI
│   ├── panic/                # Panic Mode UI
│   └── layout.tsx
├── components/
├── lib/
│   ├── firebase.ts           # Firebase client config
│   └── gemini.ts             # Gemini API wrapper
├── .env.local
└── next.config.js
```
