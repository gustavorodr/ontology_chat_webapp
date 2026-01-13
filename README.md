# Ontology Chat WebApp 💬

**Frontend component of the Multi-Chat Bug Verification System** - A Next.js web application that provides a real-time interface for visualizing and participating in simultaneous conversations between Alia AI and multiple stakeholders to verify technical skills of employees after bug completion.

> ⚠️ **Important**: This frontend application **requires** the [Ontology Chat API](https://github.com/gustavorodr/ontology_chat_api) backend to be running. It cannot function independently.

## 🎯 About the System

This is part of a **full-stack skill verification platform** that conducts automated conversations with team members (developers, QA leads, tech leads, product managers) to assess technical skills demonstrated during bug resolution. The system generates comprehensive skill ontologies based on real conversations and evidence.

### System Architecture
- **Backend API**: [Ontology Chat API](https://github.com/gustavorodr/ontology_chat_api) - FastAPI service handling sessions, conversations, and ontology generation
- **Frontend UI**: This Next.js application providing the multi-chat interface

## ✨ Key Features

- **🔄 Multi-Chat Interface**: Displays multiple conversation windows simultaneously
- **💬 Real-time Messaging**: Messages appear with realistic delays to simulate natural conversations
- **📊 Live Status Indicators**: Shows real-time status (Active, Waiting, Typing, Completed)
- **📈 Progress Dashboard**: Tracks conversation progress and displays final results
- **🎯 Skill Ontology Visualization**: Structured display of verified skills with evidence
- **📱 Responsive Design**: Adaptable interface for different screen sizes
- **🤖 AI-Driven Conversations**: Scripted conversations personalized for each participant

## 🛠 Tech Stack

- **Next.js 15** - React framework with SSR
- **TypeScript** - Static typing
- **Tailwind CSS** - Utility-first styling
- **React Hooks** - State management
- **Fetch API** - Backend communication

## 📋 Prerequisites

Before setting up the frontend, ensure you have:

1. **Node.js 18+** installed
2. **[Ontology Chat API](https://github.com/gustavorodr/ontology_chat_api) running** - This frontend is **completely dependent** on the backend API
3. **npm or yarn** package manager

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/gustavorodr/ontology_chat_webapp.git
cd ontology_chat_webapp
npm install
```

### 2. Configure Environment Variables

Create your environment configuration:

```bash
cp .env.example .env.local
```

Edit `.env.local` with the correct settings:

```env
# API Configuration (REQUIRED)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# PostHog Analytics (optional)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

> ⚠️ **Critical**: The `NEXT_PUBLIC_API_BASE_URL` must point to your running [Ontology Chat API](https://github.com/gustavorodr/ontology_chat_api) instance.

### 3. Start the Backend API First

**You must have the backend running before starting the frontend:**

```bash
# In another terminal, clone and start the API
git clone https://github.com/gustavorodr/ontology_chat_api.git
cd ontology_chat_api
docker compose up --build

# Seed with sample data
curl -X POST http://localhost:3000/dev/seed
```

### 4. Start the Frontend

```bash
npm run dev
```

The application will be available at `http://localhost:3001` (or next available port)

## 🏗 Project Structure

```
src/
├── components/           # Reusable components
│   ├── ChatWindow.tsx   # Individual chat window
│   ├── MultiChatGrid.tsx # Multi-window grid layout
│   ├── ProgressSummary.tsx # Progress and ontology panel
│   └── StatusIndicator.tsx # Status indicators
├── hooks/               # Custom hooks
│   └── useConversations.ts # Conversation management
├── pages/               # Next.js pages
│   ├── _app.tsx        # Main layout
│   ├── index.tsx       # Bug selection page
│   └── session/        # Session pages
├── services/           # API services
│   └── api.ts         # REST API client
├── types/             # TypeScript definitions
│   └── index.ts       # Application types
├── utils/             # Utilities
│   └── index.ts       # Helper functions
├── config/            # Configuration
│   └── env.ts         # Environment variables
├── constants/         # Application constants
│   └── index.ts       # Global constants
└── styles/            # Global styles
    └── globals.css    # Tailwind CSS globals
```

## 🎮 How It Works

### Complete System Flow

1. **Backend API Setup**: The [Ontology Chat API](https://github.com/gustavorodr/ontology_chat_api) manages:
   - Employee and bug data
   - Session creation and management  
   - Scripted conversations with multiple participants
   - Skill ontology generation

2. **Frontend Interface**: This webapp provides:
   - Bug selection interface
   - Multi-chat visualization
   - Real-time conversation participation
   - Progress tracking and ontology display

### User Journey

1. **Select a Bug**: Choose a completed bug from the backend API
2. **Start Verification Session**: System identifies relevant participants
3. **Multi-Chat Conversations**: Alia AI initiates conversations with stakeholders:
   - **Subject**: The developer who fixed the bug
   - **Verifiers**: QA Lead, Tech Lead who can validate the work  
   - **Context Providers**: Product Manager, other stakeholders
4. **Interactive Participation**: Users respond to Alia's questions in real-time
5. **Skill Ontology Generation**: When all conversations complete, the system generates a comprehensive skill assessment

### Conversation States

Each conversation progresses through these states:
- 🔘 **Not Started**: Waiting to begin
- 🟢 **Active**: Conversation in progress
- 🟡 **Waiting Response**: Expecting participant response
- 🔵 **Typing**: Participant is typing
- ✅ **Completed**: Conversation finished

## 🔌 API Integration

This frontend communicates exclusively with the [Ontology Chat API](https://github.com/gustavorodr/ontology_chat_api) through these endpoints:

### Core Endpoints
- **`GET /api/bugs`**: List completed bugs for verification
- **`POST /api/sessions`**: Create new verification session
- **`GET /api/sessions/{sessionKey}`**: Get session status and progress
- **`GET /api/conversations/{conversationKey}/messages`**: Get conversation history
- **`POST /api/conversations/{conversationKey}/messages`**: Send participant responses
- **`GET /api/conversations/{conversationKey}/next-message`**: Get next AI message
- **`GET /api/sessions/{sessionKey}/ontology`**: Get generated skill ontology

### Data Flow
1. Frontend fetches completed bugs from API
2. User selects bug → frontend creates session via API  
3. API creates conversations for relevant participants
4. Frontend displays multi-chat interface
5. Real-time message exchange through API
6. API generates ontology when session completes
7. Frontend displays structured skill assessment

## ⚙️ Configuration & Customization

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | ✅ Yes | Backend API URL (e.g., `http://localhost:3000`) |
| `NEXT_PUBLIC_POSTHOG_KEY` | ❌ No | PostHog analytics key |
| `NEXT_PUBLIC_POSTHOG_HOST` | ❌ No | PostHog host URL |

### Avatar Colors

Participant avatars are automatically colored based on names. Customize in `src/constants/index.ts`:

```typescript
export const AVATAR_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green  
  '#8B5CF6', // Purple
  // Add more colors...
] as const;
```

### Polling Intervals

Configure polling intervals for different operations:

```typescript
export const POLLING_INTERVALS = {
  SESSION_STATUS: 5000, // 5 seconds
  NEXT_MESSAGE: 3000,   // 3 seconds  
  TYPING_DURATION: 2000, // 2 seconds
} as const;
```

## 🚀 Deployment

### Environment Setup

**Production deployment requires:**
1. **Backend API deployed and accessible** - [See API deployment guide](https://github.com/gustavorodr/ontology_chat_api#deployment)
2. **Correct NEXT_PUBLIC_API_BASE_URL** pointing to your API instance
3. **CORS configured** in the backend for your domain

### Vercel (Recommended)

```bash
# 1. Connect your repository to Vercel
# 2. Configure environment variables in Vercel dashboard
# 3. Deploy automatically on push
```

### Docker Deployment

```bash
# Build image
docker build -t ontology-chat-webapp .

# Run container  
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com \
  ontology-chat-webapp
```

### Manual Build

```bash
npm run build
npm run start
```

## 🧪 Development Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production  
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run format:check # Check formatting
```

## 📱 Responsive Design

The interface adapts to different screen sizes:

- **Desktop**: Grid of up to 4 chat windows side-by-side
- **Tablet**: Adaptive grid with 1-2 columns
- **Mobile**: Vertical stack layout with touch-friendly interactions

## 🔍 Monitoring & Analytics

### PostHog Integration (Optional)

Track user interactions and conversation metrics:

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_your_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

**Tracked Events:**
- Conversation starts/completions
- Response times  
- Ontology generation success rates
- User interaction patterns

## ⚠️ Troubleshooting

### Backend Connection Issues

**Problem**: "Failed to fetch" or connection errors

**Solutions:**
1. ✅ Ensure [Ontology Chat API](https://github.com/gustavorodr/ontology_chat_api) is running
2. ✅ Verify `NEXT_PUBLIC_API_BASE_URL` is correct
3. ✅ Check backend CORS configuration
4. ✅ Confirm backend is accessible from your network

### Messages Not Appearing

**Possible Causes:**
1. Backend not processing conversations correctly
2. Session not created properly  
3. WebSocket/polling issues

**Debug Steps:**
```bash
# Check browser console for errors
# Verify session creation
curl http://your-api-url/api/sessions

# Check conversation status  
curl http://your-api-url/api/conversations/{key}/messages
```

### Performance Issues

**Optimization Strategies:**
1. Adjust polling intervals in constants
2. Limit concurrent conversations
3. Optimize React re-renders with useMemo/useCallback
4. Check network latency to backend API

## 🤝 Backend Dependency

This frontend application is **completely dependent** on the [Ontology Chat API](https://github.com/gustavorodr/ontology_chat_api) backend. Key dependencies:

### Data Dependencies
- **Employees**: All participant data comes from backend
- **Bugs**: Bug information and completion status  
- **Sessions**: Session management and state
- **Conversations**: Message history and conversation flow
- **Ontologies**: Generated skill assessments

### Functional Dependencies  
- **Authentication**: User session management
- **Business Logic**: Conversation scripting and turn management
- **AI Integration**: Alia's responses and conversation flow
- **Data Persistence**: All data stored in backend database

**⚡ Setup Order**: Always start the backend API before the frontend application.

## 🌐 Related Projects

- **🔧 [Ontology Chat API](https://github.com/gustavorodr/ontology_chat_api)**: Required backend API service
- **📊 Database Schema**: Included in the API repository
