# 🎫 AI-Powered Ticket System

An intelligent support ticket management system that uses AI to automatically analyze, prioritize, and assign tickets to the right team members based on their skills and expertise.

![AI Ticket System Demo](https://via.placeholder.com/800x400/1e293b/64748b?text=AI+Ticket+System+Demo)

## ✨ Features

- 🤖 **AI-Powered Analysis**: Gemini AI automatically analyzes tickets to extract priority, required skills, and helpful notes
- 🎯 **Smart Assignment**: Automatically assigns tickets to moderators based on skill matching
- 📧 **Email Notifications**: Instant email alerts when tickets are assigned
- 👥 **Role-Based Access**: Three distinct user roles (User, Moderator, Admin) with appropriate permissions
- 🔄 **Real-time Updates**: Live status updates across all dashboards
- 🎨 **Modern UI**: Clean, responsive interface with dark theme
- 🔐 **Secure Authentication**: Google OAuth integration with NextAuth.js

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js with Google OAuth
- **AI**: Google Gemini AI for ticket analysis
- **Background Jobs**: Inngest for email notifications
- **Email**: Mailtrap for development, configurable for production
- **UI Components**: Radix UI primitives

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Creates  │───▶│   AI Analysis   │───▶│ Auto Assignment │
│     Ticket      │    │  (Gemini API)   │    │  (Skill Match)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
┌─────────────────┐    ┌─────────────────┐              │
│ Email Notification│◀──│  Inngest Job    │◀─────────────┘
│   (Mailtrap)    │    │  (Background)   │
└─────────────────┘    └─────────────────┘
```

## 🔄 User Roles & Permissions

### 👤 **User**

- Create support tickets
- View own tickets and their status
- See AI-detected required skills
- Track assignment and progress

### 🛠️ **Moderator**

- View assigned tickets
- Update ticket status (TODO → IN_PROGRESS → COMPLETED)
- See AI analysis and helpful notes
- Manage workload efficiently

### ⚡ **Admin**

- Full system oversight
- Assign tickets manually
- Manage user roles and skills
- View all tickets and analytics
- Configure moderator expertise

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google Cloud Console account (for OAuth)
- Gemini AI API key
- Mailtrap account (for email testing)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-ticket-system.git
cd ai-ticket-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your actual values
nano .env
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed with sample data
npx prisma db seed
```

### 5. Configure External Services

#### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000/api/auth/callback/google` to redirect URIs

#### Gemini AI Setup

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Generate API key
3. Add to your `.env` file

#### Mailtrap Setup

1. Sign up at [Mailtrap](https://mailtrap.io/)
2. Create inbox
3. Copy SMTP credentials to `.env`

### 6. Start Development Server

```bash
# Start Next.js app
npm run dev

# In another terminal, start Inngest for background jobs
npm run inngest-dev

# (Optional) Open Prisma Studio to view database
npm run db-studio
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📋 Usage

### Creating Your First Ticket

1. Sign in with Google
2. Click "New Ticket"
3. Fill in title, description, priority, and deadline
4. Submit - AI will automatically analyze and assign!

### Testing Different Roles

Create multiple Google accounts and manually update user roles in the database:

```sql
-- Make user a moderator
UPDATE users SET role = 'MODERATOR', skills = '{"React", "Node.js", "Database"}'
WHERE email = 'moderator@example.com';

-- Make user an admin
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

## 🤖 AI Analysis Features

The system uses Gemini AI to analyze each ticket and extract:

- **Priority Level**: Automatically determined from description urgency
- **Required Skills**: Technical skills needed to solve the issue
- **Helpful Notes**: AI-generated insights and solution suggestions
- **Best Match**: Finds moderator with most relevant skills

Example AI analysis:

```json
{
  "priority": "high",
  "relatedSkills": ["React", "API", "Database"],
  "helpfulNotes": "Issue seems related to API authentication failing. Check JWT token expiration and database connection."
}
```

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

```bash
DATABASE_URL="your_production_postgres_url"
NEXTAUTH_URL="https://your-app.vercel.app"
# ... other production values
```

## 🧪 Testing

```bash
# Run development server
npm run dev

# Test with different user roles:
# 1. Create tickets as regular user
# 2. Sign in as moderator to see assignments
# 3. Use admin account for management
```

## 📦 Project Structure

```
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── dashboards/        # Role-specific dashboards
│   └── ui/                # Reusable UI components
├── lib/                   # Utility functions
│   ├── controllers/       # Business logic
│   ├── middleware/        # Auth middleware
│   └── db.ts              # Database connection
├── prisma/                # Database schema
├── utils/                 # Helper functions
└── inngest/               # Background job functions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Hitesh Choudhary](https://github.com/hiteshchoudhary) for the original tutorial inspiration
- [Prisma](https://prisma.io) for the excellent ORM
- [Google](https://ai.google.dev/) for Gemini AI API
- [Inngest](https://www.inngest.com/) for Inngest Workflows

---

**Built with ❤️ by [Umang](https://github.com/UmangAgarwal257)**
