# 🤝 Contributing to Mimic

Thank you for your interest in contributing to Mimic! We welcome contributions from developers of all skill levels.

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Workflow](#-development-workflow)
- [Code Style Guidelines](#-code-style-guidelines)
- [Testing Requirements](#-testing-requirements)
- [Submitting Changes](#-submitting-changes)
- [Review Process](#-review-process)

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). We
are committed to creating a welcoming and inclusive environment for everyone.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 18.0.0 or later
- **pnpm**: 9.0.0 or later
- **Git**: Latest stable version

### Fork and Clone

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/mimic.git
   cd mimic
   ```

3. **Add upstream** remote:

   ```bash
   git remote add upstream https://github.com/IAmJonoBo/mimic.git
   ```

### Setup Development Environment

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests to verify setup
pnpm test

# Start development servers
pnpm dev
```

## 🔄 Development Workflow

### 1. Create a Feature Branch

```bash
# Sync with upstream
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Keep changes **focused** and **atomic**
- Write **clear commit messages**
- Follow **coding standards** (see below)
- Add **tests** for new functionality
- Update **documentation** as needed

### 3. Commit Your Changes

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Examples of good commit messages
git commit -m "feat(design-tokens): add color palette tokens"
git commit -m "fix(design-system): resolve button accessibility issue"
git commit -m "docs(readme): update installation instructions"
git commit -m "test(shared-utils): add unit tests for utility functions"
```

**Commit Types:**

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `refactor`: Code refactoring
- `style`: Code style changes (formatting)
- `chore`: Maintenance tasks

### 4. Keep Your Branch Updated

```bash
# Regularly sync with upstream
git fetch upstream
git rebase upstream/main
```

## 🎨 Code Style Guidelines

### TypeScript Standards

- Use **TypeScript** for all new code
- Enable **strict mode** settings
- Provide **explicit types** for public APIs
- Use **interfaces** over type aliases for object shapes

```typescript
// ✅ Good
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

// ❌ Avoid
type ButtonProps = {
  variant: any;
  size: string;
  children: any;
};
```

### React Component Guidelines

- Use **functional components** with hooks
- Keep components **small** and **focused**
- Extract **custom hooks** for reusable logic
- Use **forwardRef** for ref forwarding

```tsx
// ✅ Good
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', children, ...props }, ref) => {
    return (
      <button ref={ref} className={`btn btn--${variant}`} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### File Organization

```bash
packages/design-system/src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── Button.stories.tsx
│   │   └── index.ts
│   └── index.ts
├── hooks/
├── utils/
└── types/
```

### Import/Export Standards

```typescript
// ✅ Use named exports
export const Button = () => {
  /* */
};
export const Icon = () => {
  /* */
};

// ✅ Use barrel exports
export { Button } from './Button';
export { Icon } from './Icon';

// ✅ Group imports
import React from 'react';
import { render, screen } from '@testing-library/react';

import { Button } from '../Button';
import { mockProps } from '../../test-utils';
```

## 🧪 Testing Requirements

### Unit Tests

- **Required** for all new features
- **Minimum 80%** code coverage
- Use **Vitest** for testing framework
- Follow **Arrange-Act-Assert** pattern

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct variant class', () => {
    // Arrange
    const props = { variant: 'primary' as const, children: 'Click me' };

    // Act
    render(<Button {...props} />);

    // Assert
    expect(screen.getByRole('button')).toHaveClass('btn--primary');
  });
});
```

### Integration Tests

- **Required** for complex components
- Test **user interactions**
- Test **accessibility** features

### Visual Tests

- **Required** for UI components
- Create **Storybook stories**
- Include **multiple variants**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'A versatile button component with multiple variants.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage

# Run specific package tests
pnpm nx test design-system

# Run visual tests
pnpm visual-test
```

## 📝 Submitting Changes

### 1. Pre-submission Checklist

- [ ] **Tests pass**: `pnpm test`
- [ ] **Linting passes**: `pnpm lint`
- [ ] **Types check**: `pnpm typecheck`
- [ ] **Build succeeds**: `pnpm build`
- [ ] **Visual tests pass**: `pnpm visual-test`

### 2. Create Pull Request

1. **Push** your branch to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request** on GitHub with:
   - **Clear title** describing the change
   - **Detailed description** explaining what and why
   - **Screenshots** for UI changes
   - **Breaking changes** clearly marked

### 3. Pull Request Template

```markdown
## Description

Brief description of changes made.

## Type of Change

- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix/feature causing existing functionality to break)
- [ ] Documentation update

## Testing

- [ ] Added unit tests
- [ ] Added integration tests
- [ ] Added visual tests
- [ ] Manual testing completed

## Screenshots (if applicable)

Include screenshots for UI changes.

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests added for new functionality
- [ ] Documentation updated
```

## 🔍 Review Process

### What We Look For

1. **Code Quality**

   - Clean, readable code
   - Proper error handling
   - Performance considerations

2. **Testing**

   - Adequate test coverage
   - Edge cases covered
   - Tests are maintainable

3. **Documentation**

   - Code is self-documenting
   - Complex logic is commented
   - Public APIs are documented

4. **Design System Consistency**
   - Follows design token patterns
   - Maintains visual consistency
   - Accessible by default

### Review Timeline

- **Initial review**: Within 2-3 business days
- **Follow-up reviews**: Within 1-2 business days
- **Merge**: After all checks pass and approval

### Addressing Feedback

- **Be responsive** to reviewer comments
- **Ask questions** if feedback is unclear
- **Make changes** in separate commits
- **Update tests** if implementation changes

## 🎯 Contribution Areas

### 🐛 Bug Reports

Found a bug? Please [create an issue](https://github.com/IAmJonoBo/mimic/issues/new) with:

- **Clear description** of the bug
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Environment details** (OS, Node version, etc.)
- **Screenshots** if applicable

### 💡 Feature Requests

Have an idea? Please [start a discussion](https://github.com/IAmJonoBo/mimic/discussions) with:

- **Use case** description
- **Proposed solution**
- **Alternative solutions** considered
- **Implementation details** (if any)

### 📚 Documentation

Documentation improvements are always welcome:

- **Fix typos** and grammar
- **Improve clarity** of existing docs
- **Add examples** and tutorials
- **Translate** documentation

### 🧩 Components

Contributing new components:

- **Follow design system** patterns
- **Include comprehensive tests**
- **Add Storybook stories**
- **Ensure accessibility**

## 🆘 Getting Help

- **GitHub Discussions**: For questions and general discussion
- **GitHub Issues**: For bug reports and feature requests
- **Code Reviews**: For feedback on your contributions

## 📞 Contact

- **Maintainer**: [@IAmJonoBo](https://github.com/IAmJonoBo)
- **Discussions**: [GitHub Discussions](https://github.com/IAmJonoBo/mimic/discussions)

---

Thank you for contributing to Mimic! Your efforts help make this project better for everyone. 🙏
