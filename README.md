# Qimma - AI-Powered Exam Correction Platform

> **Qimma** is a comprehensive SaaS platform that leverages OpenAI's advanced language models to automate the exam correction process for educators, transforming traditionally time-consuming manual grading into an efficient, consistent, and insightful process.

## 🚀 Features

- **AI-Powered Grading**: Automatic exam correction using OpenAI GPT-4 Vision
- **Handwriting Recognition**: Advanced OCR for handwritten responses
- **Multi-Format Support**: PDF, images, LaTeX expressions, and graphical content
- **Comprehensive Analytics**: Grade distribution, difficulty analysis, and performance trends
- **Credit-Based System**: Flexible subscription tiers with Stripe integration
- **Real-Time Processing**: Live status updates for exam processing
- **Bulk Operations**: Batch editing and modification tools
- **Export Functionality**: CSV, PDF reports, and annotated papers

## 🏗️ Tech Stack

- **Frontend**: Next.js 15.3.2 with App Router, TypeScript, Tailwind CSS v4
- **UI Components**: Shadcn/UI with custom Qimma branding
- **Authentication**: Clerk for secure user management
- **Database**: Supabase PostgreSQL with Row Level Security
- **File Storage**: AWS S3 via Supabase Storage
- **Payments**: Stripe for subscription management
- **AI Processing**: OpenAI GPT-4 Vision API
- **State Management**: Zustand with persistence
- **Form Handling**: React Hook Form + Zod validation
- **Email**: Resend for transactional emails
- **Deployment**: AWS Amplify with CloudFront CDN
- **Monitoring**: Sentry (error tracking) + Mixpanel (analytics)

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher (or yarn/pnpm equivalent)
- **Git**: Latest version
- **Code Editor**: VS Code recommended with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript Hero

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd my-fullstack-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your credentials
# See scripts/environment-setup.md for detailed instructions
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🛠️ Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code analysis |
| `npm run lint:fix` | Fix ESLint issues automatically |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run type-check` | Run TypeScript type checking |

## 📁 Project Structure

```
my-fullstack-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # Reusable UI components
│   │   ├── forms/             # Form components
│   │   └── ui/                # Shadcn/UI components
│   ├── lib/                   # Utility libraries
│   │   ├── hooks/             # Custom React hooks
│   │   ├── schemas/           # Zod validation schemas
│   │   ├── stores/            # Zustand state management
│   │   └── utils.ts           # Helper functions
├── scripts/                   # Documentation and setup scripts
├── tasks/                     # Task Master project files
├── .env.example              # Environment variables template
├── .eslintrc.json            # ESLint configuration
├── .prettierrc               # Prettier configuration
├── components.json           # Shadcn/UI configuration
├── tailwind.config.ts        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## 🎨 Code Quality & Standards

This project uses automated code quality tools enforced via Git hooks:

### ESLint Configuration
- Next.js recommended rules
- TypeScript strict mode
- Tailwind CSS linting
- Accessibility rules (jsx-a11y)

### Prettier Configuration
- Consistent code formatting
- Import sorting and organization
- Tailwind class sorting
- Integration with ESLint

### Git Hooks (Husky)
- **Pre-commit**: Runs ESLint --fix and Prettier --write on staged files
- **Commit-msg**: Enforces conventional commit format

## 🔧 Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Payments (Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

# AI Processing (OpenAI)
OPENAI_API_KEY=

# File Storage (AWS S3)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET_NAME=

# Email (Resend)
RESEND_API_KEY=

# See scripts/environment-setup.md for complete list
```

## 🧪 Testing

### Available Test Pages
- **Form Management**: `/test-forms` - React Hook Form + Zod + Zustand demo
- **Shadcn Components**: `/shadcn-test` - UI component testing

### Manual Testing Checklist
- [ ] Development server starts without errors
- [ ] All pages load correctly
- [ ] ESLint passes without errors
- [ ] Prettier formatting is consistent
- [ ] Build process completes successfully
- [ ] Git hooks execute properly

## 🤝 Contributing

### Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow existing code patterns
   - Add tests for new functionality
   - Update documentation as needed

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```
   *Note: Git hooks will automatically format and lint your code*

4. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Coding Standards
- Use TypeScript for all new code
- Follow existing naming conventions
- Write descriptive commit messages (conventional commits)
- Add JSDoc comments for complex functions
- Ensure all components are accessible (WCAG 2.1 AA)

### Pull Request Guidelines
- Provide clear description of changes
- Include screenshots for UI changes
- Ensure all checks pass (linting, formatting, build)
- Request review from relevant team members

## 📚 Documentation

- **Environment Setup**: `scripts/environment-setup.md`
- **Form Management**: `scripts/form-management-setup.md`
- **Task Management**: `tasks/` directory
- **API Documentation**: Coming soon
- **Deployment Guide**: Coming soon

## 🔍 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process on port 3000
   npx kill-port 3000
   ```

2. **Node Modules Issues**
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Git Hook Issues**
   ```bash
   # Reinstall Husky
   npm run prepare
   ```

4. **Build Errors**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

### Getting Help

- Check existing issues in the repository
- Review documentation in `scripts/` directory
- Contact the development team
- Create a new issue with detailed description

## 📄 License

This project is proprietary software. All rights reserved.

## 🎯 Roadmap

- [x] Project setup and configuration
- [x] Form management system
- [ ] Authentication with Clerk
- [ ] Database schema design
- [ ] Credit system implementation
- [ ] Stripe payment integration
- [ ] OpenAI processing engine
- [ ] Dashboard and analytics
- [ ] Export functionality
- [ ] Deployment pipeline

---

**Built with ❤️ for educators worldwide**
