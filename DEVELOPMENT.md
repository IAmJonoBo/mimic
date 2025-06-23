# Mimic Development Guide

## Quick Start

### Option 1: Dev Container (Recommended)

```bash
# Open in VS Code with Dev Container extension
code --folder-uri vscode-remote://dev-container+$(pwd)/.devcontainer
```

### Option 2: Local Development

```bash
# Run setup script
./setup.sh

# Start development
pnpm dev
```

## Project Structure

```bash
mimic/
├── packages/
│   ├── design-tokens/     # Style Dictionary + W3C tokens
│   ├── design-system/     # Qwik components + Storybook
│   └── shared-utils/      # Cross-platform utilities
├── apps/
│   ├── web/              # Qwik City application
│   ├── mobile/           # React Native + Compose MP
│   └── desktop/          # Tauri desktop shell
├── tools/
│   └── penpot-export/    # Figmagic CLI + token extraction
└── .devcontainer/        # Docker dev environment
```

## Development Workflow

### 1. Design Token Updates

```bash
# Export tokens from Penpot (manual or automated)
pnpm nx run tools/penpot-export:extract

# Build tokens for all platforms
pnpm nx run design-tokens:build

# Watch for token changes
pnpm nx run design-tokens:build --watch
```

### 2. Component Development

```bash
# Start Storybook
pnpm nx run design-system:storybook

# Run component tests
pnpm nx run design-system:test

# Visual regression testing
pnpm nx run design-system:visual-test
```

### 3. Multi-Platform Building

```bash
# Build affected packages only
pnpm nx affected -t build

# Build specific platform
pnpm nx run web:build
pnpm nx run mobile:build
pnpm nx run desktop:build
```

### 4. Quality Gates

```bash
# Lint all code
pnpm nx run-many -t lint

# Type checking
pnpm nx run-many -t typecheck

# Full test suite
pnpm nx run-many -t test

# E2E tests
pnpm nx run-many -t e2e
```

## AI-Assisted Development

### Local Llama 3 Setup

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull Llama 3 8B model
ollama pull llama3:8b

# Generate component scaffolding
ollama run llama3:8b "Generate a Qwik button component using @mimic/design-tokens"
```

## Penpot Integration

### Self-Hosted Instance

- **URL**: <http://localhost:9001> (Dev Container)
- **Credentials**: Create during first setup
- **Token Export**: Manual via UI or automated CI job

### Token Workflow

1. Design in Penpot with token annotations
2. Export W3C JSON tokens
3. Style Dictionary transforms to CSS/TS/Kotlin
4. Nx rebuilds affected components automatically

## Performance Optimization

### Build Caching

```bash
# Enable Nx Cloud (optional)
npx nx connect

# Local cache optimization
export NX_CACHE_DIRECTORY=~/.nx-cache
```

### Bundle Analysis

```bash
# Web bundle analysis
pnpm nx run web:build:analyze

# Mobile APK analysis
pnpm nx run mobile:build:analyze
```

## Deployment

### CI/CD Pipeline

- **Trigger**: Push to main or PR
- **Steps**: Lint → Test → Build → Visual Test → Deploy
- **Artifacts**: Storybook static, mobile APKs, desktop binaries

### Manual Deployment

```bash
# Build for production
pnpm nx run-many -t build --configuration=production

# Deploy Storybook
pnpm nx run design-system:deploy-storybook

# Release desktop app
pnpm nx run desktop:build --release
```

## Troubleshooting

### Common Issues

1. **Token build fails**

   ```bash
   # Clear Style Dictionary cache
   rm -rf packages/design-tokens/dist
   pnpm nx run design-tokens:build
   ```

2. **Storybook tests timeout**

   ```bash
   # Increase timeout in .storybook/test-runner.js
   export STORYBOOK_TEST_TIMEOUT=60000
   ```

3. **Mobile builds fail**

   ```bash
   # Ensure Android SDK is configured
   export ANDROID_SDK_ROOT=/usr/lib/android-sdk
   ```

### Debug Mode

```bash
# Enable Nx debug logging
export NX_VERBOSE_LOGGING=true

# Enable verbose pnpm output
pnpm --reporter=verbose [command]
```

## Contributing

1. Create feature branch from `main`
2. Implement changes with tests
3. Ensure all quality gates pass
4. Submit PR with visual diffs
5. Automated review + manual review
6. Merge after approval

## Architecture Decisions

- **Monorepo**: Nx + pnpm for optimal caching and workspace management
- **Design Tokens**: Single source of truth, multi-platform output
- **Testing**: Storybook + Loki for visual regression, Vitest for unit tests
- **Performance**: Qwik's resumability + Hermes IPO for minimal bundle sizes
- **AI Integration**: Local-first with Ollama, no cloud dependencies
