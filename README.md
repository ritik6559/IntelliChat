# IntelliChat 🤖💬

An intelligent video chat platform that allows users to create and interact with AI agents through real-time video conversations. Users can create custom AI agents, define their expertise topics, and engage in meaningful video discussions.

## ✨ Features

- **Custom AI Agents**: Create personalized AI agents with specific knowledge domains and personalities
- **Video Chat Integration**: Real-time video and audio conversations with AI agents
- **Topic-Specific Conversations**: AI agents are prompted and trained for specific topics and use cases
- **User Authentication**: Secure authentication with GitHub and Google OAuth
- **Payment Integration**: Subscription and payment management through Polar
- **Real-time Communication**: Powered by Stream SDK for seamless video/audio chat experience
- **Responsive Design**: Built with Next.js for optimal performance across devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 15+ with TypeScript
- **Database**: PostgreSQL with Neon
- **ORM**: Drizzle ORM
- **API**: tRPC for type-safe APIs
- **Authentication**: Better Auth with OAuth providers
- **Video/Audio**: Stream SDK for real-time communication
- **Payments**: Polar for subscription management
- **Background Jobs**: Inngest for async processing
- **Deployment**: Vercel
- **AI Integration**: OpenAI API

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Neon recommended)
- Stream account for video/chat services
- OpenAI API key
- OAuth app credentials (GitHub, Google)
- Polar account for payments

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ritik6559/IntelliChat.git
   cd IntelliChat
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables (see Environment Variables section below)

4. **Set up the database**
   ```bash
   npm run db:push
   # or
   yarn db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=your_neon_database_url

# Authentication
BETTER_AUTH_SECRET=your_auth_secret_key
BETTER_AUTH_URL=http://localhost:3000

# OAuth Providers
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stream SDK (Video & Chat)
NEXT_PUBLIC_STREAM_VIDEO_API_KEY=your_stream_video_api_key
STREAM_VIDEO_SECRET_KEY=your_stream_video_secret_key
NEXT_PUBLIC_STREAM_CHAT_API_KEY=your_stream_chat_api_key
STREAM_CHAT_SECRET_KEY=your_stream_chat_secret_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Payments
POLAR_ACCESS_TOKEN=your_polar_access_token
```

## 📖 Usage

### Creating an AI Agent

1. Sign in to your account
2. Navigate to "Create Agent"
3. Define your agent's:
   - Name and description
   - Area of expertise/topic
   - Personality traits
   - Conversation style
4. Save your agent

### Starting a Video Chat

1. Browse available agents or select your created agents
2. Click "Start Video Chat"
3. Allow camera and microphone permissions
4. Begin your conversation with the AI agent

### Managing Subscriptions

- Access premium features through Polar integration
- Manage billing and subscription plans
- Track usage and limits

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


- [Stream](https://getstream.io/) for video/chat infrastructure
- [OpenAI](https://openai.com/) for AI capabilities
- [Vercel](https://vercel.com/) for deployment platform
- [Neon](https://neon.tech/) for database hosting

---
(Video chat might now wrok due to not sufficcient openai api credist)
