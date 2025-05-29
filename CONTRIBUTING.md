# Contributing to Qimma

Thank you for your interest in contributing to Qimma! This guide will help you get started with the development process and ensure consistency across the codebase.

## 🏁 Getting Started

### 1. Development Environment Setup

Ensure you have the required tools installed:

```bash
# Check Node.js version (should be v18.0.0+)
node --version

# Check npm version
npm --version

# Install dependencies
npm install
```

### 2. Environment Configuration

1. Copy the environment template:

   ```bash
   cp .env.example .env.local
   ```

2. Fill in the required environment variables:
   - See `scripts/environment-setup.md` for detailed instructions
   - Contact the team for development credentials

### 3. Verify Setup

Run these commands to ensure everything is working:

```bash
# Start development server
npm run dev

# Run linting
npm run lint

# Check formatting
npm run format:check

# Build the project
npm run build
```

## 🔀 Development Workflow

### Branch Naming Convention

Use descriptive branch names with prefixes:

- `feature/` - New features (e.g., `feature/auth-integration`)
- `fix/` - Bug fixes (e.g., `fix/form-validation-error`)
- `docs/` - Documentation changes (e.g., `docs/setup-guide`)
- `refactor/` - Code refactoring (e.g., `refactor/api-structure`)
- `test/` - Test additions (e.g., `test/user-authentication`)

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Examples:**

```bash
feat(auth): add social login with Google
fix(forms): resolve validation error on submit
docs(readme): update installation instructions
refactor(api): reorganize route handlers
```

### Pull Request Process

1. **Create a new branch** from `main`:

   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the coding standards below

3. **Test your changes**:

   ```bash
   npm run lint        # Check for linting errors
   npm run format      # Format code
   npm run build       # Ensure build works
   npm run dev         # Test manually
   ```

4. **Commit your changes**:

   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push and create PR**:

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request** with:
   - Clear title and description
   - Link to related issues
   - Screenshots for UI changes
   - Testing instructions

## 📝 Coding Standards

### TypeScript Guidelines

- **Always use TypeScript** for new files
- **Export types** alongside functions/components
- **Use interfaces** for object shapes
- **Prefer type unions** over enums when possible

```typescript
// ✅ Good
interface UserProfile {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
}

export type UserRole = 'admin' | 'teacher' | 'student';

// ❌ Avoid
const user = {
  id: 'any',
  name: 'any',
  // No type definition
};
```

### React Component Guidelines

- **Use functional components** with hooks
- **Export components** as default when single component per file
- **Use TypeScript interfaces** for props
- **Implement proper error boundaries**

```typescript
// ✅ Good
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick: () => void;
  disabled?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  onClick,
  disabled = false
}: ButtonProps) {
  return (
    <button
      className={cn('btn', `btn-${variant}`)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

### Styling Guidelines

- **Use Tailwind CSS** for styling
- **Follow utility-first** approach
- **Use custom CSS classes** sparingly
- **Maintain consistent spacing** (use Tailwind's spacing scale)

```typescript
// ✅ Good
<div className="flex items-center justify-between p-4 bg-white shadow-sm">
  <h1 className="text-xl font-semibold text-gray-900">Title</h1>
  <Button variant="primary">Action</Button>
</div>

// ❌ Avoid inline styles
<div style={{ display: 'flex', padding: '16px' }}>
```

### File and Directory Organization

```
src/
├── app/                    # Next.js pages (App Router)
│   ├── (auth)/            # Route groups
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── ui/               # Basic UI components (Shadcn)
│   ├── forms/            # Form-specific components
│   └── layout/           # Layout components
├── lib/                  # Utility libraries
│   ├── hooks/            # Custom React hooks
│   ├── stores/           # Zustand stores
│   ├── schemas/          # Zod validation schemas
│   └── utils/            # Helper functions
├── types/                # TypeScript type definitions
└── constants/            # Application constants
```

### Naming Conventions

- **Files**: kebab-case (`user-profile.tsx`)
- **Components**: PascalCase (`UserProfile`)
- **Functions**: camelCase (`getUserProfile`)
- **Constants**: SCREAMING_SNAKE_CASE (`API_BASE_URL`)
- **Hooks**: camelCase with `use` prefix (`useUserProfile`)

## 🧪 Testing Guidelines

### Component Testing

- **Test user interactions** not implementation details
- **Use meaningful test descriptions**
- **Mock external dependencies**
- **Test accessibility features**

### Manual Testing Checklist

Before submitting a PR, verify:

- [ ] All pages load without errors
- [ ] Forms submit correctly
- [ ] Responsive design works on mobile/tablet
- [ ] Accessibility features work (keyboard navigation, screen readers)
- [ ] Error states display properly
- [ ] Loading states are appropriate

## 🎨 UI/UX Guidelines

### Design System

- **Follow Shadcn/UI patterns** for consistency
- **Use Qimma brand colors** defined in Tailwind config
- **Maintain visual hierarchy** with proper typography
- **Ensure accessibility** (WCAG 2.1 AA compliance)

### Component Library

- **Reuse existing components** before creating new ones
- **Follow established patterns** for forms, buttons, modals
- **Document component props** with TypeScript interfaces
- **Test components** in isolation

### Responsive Design

- **Mobile-first approach** using Tailwind breakpoints
- **Test on multiple screen sizes**
- **Ensure touch targets** are appropriately sized
- **Optimize for performance** on mobile devices

## 🛠️ Tools and Configuration

### Code Quality Tools

- **ESLint**: Enforces code standards and catches errors
- **Prettier**: Automatic code formatting
- **Husky**: Git hooks for pre-commit checks
- **TypeScript**: Type safety and better developer experience

### Development Tools

- **Next.js Dev Tools**: React profiler and debugging
- **Tailwind CSS IntelliSense**: VS Code extension for Tailwind
- **React Developer Tools**: Browser extension for React debugging

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

## 🐛 Bug Reports

When reporting bugs, include:

1. **Clear description** of the issue
2. **Steps to reproduce** the bug
3. **Expected behavior** vs actual behavior
4. **Screenshots or videos** if applicable
5. **Environment details** (browser, OS, device)
6. **Error messages** or console logs

## 💡 Feature Requests

For new features, provide:

1. **Problem description** - What problem does this solve?
2. **Proposed solution** - How should it work?
3. **Alternative solutions** - What other approaches were considered?
4. **Additional context** - Mockups, examples, references

## 📞 Getting Help

- **Documentation**: Check `scripts/` directory for setup guides
- **Code Examples**: Review existing components for patterns
- **Team Communication**: Use established channels for questions
- **Issue Tracker**: Search existing issues before creating new ones

## 🎯 Best Practices Summary

1. **Write self-documenting code** with clear variable names
2. **Keep functions small** and focused on single responsibility
3. **Use TypeScript** to catch errors early
4. **Follow established patterns** in the codebase
5. **Test your changes** thoroughly before submitting
6. **Document complex logic** with comments
7. **Consider accessibility** in all UI changes
8. **Optimize for performance** but prioritize readability

---

Thank you for contributing to Qimma! Your efforts help make education more efficient and effective for teachers worldwide. 🎓
