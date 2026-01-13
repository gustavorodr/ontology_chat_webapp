# ontology_chat_webapp

Web interface for **Alia’s Skill Verification System** — an application that allows visualization of simultaneous conversations between the AI Alia and multiple stakeholders to verify employees’ technical skills after bug completion.

## 📋 Key Features

* **Multi-Chat Interface**: Displays multiple chat windows simultaneously
* **Message Streaming**: Messages appear with realistic delays to simulate real conversations
* **Status Indicators**: Shows real-time statuses (Active, Waiting, Typing, Completed)
* **Progress Panel**: Tracks conversation progress and displays the final result
* **Skill Ontology**: Visualizes the structured output of the verification
* **Responsive Design**: Adaptive interface for different screen sizes

## 🚀 Technologies

* **Next.js 15** – React framework with SSR
* **TypeScript** – Static typing
* **Tailwind CSS** – Utility-first styling
* **React Hooks** – State management
* **Fetch API** – Backend communication

## 🏗️ Project Structure

```
src/
├── components/           # Reusable components
│   ├── ChatWindow.tsx    # Individual chat window
│   ├── MultiChatGrid.tsx # Multi-window grid
│   ├── ProgressSummary.tsx # Summary and progress panel
│   └── StatusIndicator.tsx # Status indicators
├── hooks/                # Custom hooks
│   └── useConversations.ts # Conversation management
├── pages/                # Next.js pages
│   ├── _app.tsx          # Main layout
│   └── index.tsx         # Verification page
├── services/             # API services
│   └── api.ts            # REST API client
├── types/                # TypeScript definitions
│   └── index.ts          # Application types
├── utils/                # Utilities
│   └── index.ts          # Helper functions
├── config/               # Configuration
│   └── env.ts            # Environment variables
├── constants/            # Application constants
│   └── index.ts          # Global constants
└── styles/               # Global styles
    └── globals.css       # Global CSS with Tailwind
```

## ⚙️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variable Configuration

Copy the example file and configure the variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with the correct settings:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# PostHog Analytics (optional)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### 3. Run in Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🎯 Features

### Multi-Chat Interface

The application displays multiple chat windows side by side, each representing a conversation with a different stakeholder:

* **Marcus** (Backend Developer) – Verification subject
* **Diana** (QA Lead) – Verifier
* **Rafael** (Tech Lead) – Verifier
* **Sophie** (Product Manager) – Context provider

### Conversation States

Each conversation can be in one of the following states:

* 🔘 **Not started**: Waiting to begin
* 🟢 **Active**: Conversation in progress
* 🟡 **Waiting for response**: Waiting for the participant’s reply
* 🔵 **Typing**: Participant is typing
* ✅ **Completed**: Conversation finished

### Usage Flow

1. **Bug Selection**: Choose a completed bug for verification
2. **Session Start**: The system identifies relevant participants
3. **Simultaneous Conversations**: Alia starts conversations with multiple stakeholders
4. **Interaction**: Users respond to Alia’s messages
5. **Completion**: The system generates the skill ontology once all conversations are completed

### Progress Panel

The side panel shows:

* Overall conversation progress
* List of participants and their statuses
* Final ontology result (when available)
* Verified skills with evidence
* Confidence levels and verifiers

## 🔧 Available Scripts

```bash
# Development
npm run dev

# Production build
npm run build

# Start production
npm run start

# Linting
npm run lint

# Formatting
npm run format
npm run format:check
```

## 🎨 Customization

### Avatar Colors

Participant avatars are automatically colored based on the name. You can customize colors in `src/constants/index.ts`:

```typescript
export const AVATAR_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#8B5CF6', // Purple
  // ... add more colors
] as const;
```

### Polling Intervals

Configure polling intervals for different operations:

```typescript
export const POLLING_INTERVALS = {
  SESSION_STATUS: 5000,   // 5 seconds
  NEXT_MESSAGE: 3000,     // 3 seconds
  TYPING_DURATION: 2000,  // 2 seconds
} as const;
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables in the dashboard
3. Automatic deployment on every push

### Docker

```bash
# Build image
docker build -t ontology-chat-webapp .

# Run container
docker run -p 3000:3000 ontology-chat-webapp
```

### Manual Build

```bash
# Build for production
npm run build

# Serve static files
npm run start
```

## 🔍 Monitoring

The application includes optional PostHog integration for analytics:

* Conversation event tracking
* Response time metrics
* Verification completion analytics

## 🤝 Backend Communication

The application communicates with the backend through a REST API. All endpoints are documented in `src/services/api.ts`:

* **Sessions**: Session creation and management
* **Conversations**: Conversation messages and status
* **Employees**: Employee data
* **Bugs**: Bug information
* **Skill Ontologies**: Verification results

## 📱 Responsiveness

The interface is fully responsive:

* **Desktop**: Grid with up to 4 chat windows
* **Tablet**: Adaptive grid with 1–2 columns
* **Mobile**: Vertical stacked layout

## ⚠️ Troubleshooting

### API Connection Error

Check that:

1. The backend is running on the correct port
2. The `NEXT_PUBLIC_API_BASE_URL` variable is configured
3. There are no CORS issues

### Messages Not Appearing

1. Check browser logs
2. Confirm the session was created correctly
3. Verify the backend is processing conversations

### Slow Performance

1. Adjust polling intervals
2. Check the number of simultaneous conversations
3. Optimize component re-renders
