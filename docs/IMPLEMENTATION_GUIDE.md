# Complete Implementation Guide: Penpot to Production

This guide provides step-by-step instructions to implement the full design token pipeline from
Penpot design files to production applications across web, mobile, and desktop platforms.

## 📋 Table of Contents

1. [Prerequisites & Workspace Bootstrap](#1-prerequisites--workspace-bootstrap)
2. [Penpot → Design Token Pipeline](#2-penpot--design-token-pipeline)
3. [Style Dictionary Multi-Platform Transform](#3-style-dictionary-multi-platform-transform)
4. [Web Component Library (Qwik City)](#4-web-component-library-qwik-city)
5. [Storybook Workshop & Testing](#5-storybook-workshop--testing)
6. [Mobile & Desktop Shells](#6-mobile--desktop-shells)
7. [Monorepo Plumbing & Automation](#7-monorepo-plumbing--automation)
8. [Local Development & CI Workflow](#8-local-development--ci-workflow)
9. [Next Steps & Advanced Features](#9-next-steps--advanced-features)

## 1. Prerequisites & Workspace Bootstrap

### Required Tools

| Tool | Version | Installation Notes |
|------|---------|-------------------|
| Node.js | ≥ 20 LTS | `corepack enable && corepack prepare pnpm@latest --activate` |
| pnpm | ≥ 8 | Included with Node corepack |
| Rust | Latest stable | Required for Tauri desktop apps |
| Java | 17+ | For Compose Multiplatform development |
| Xcode | Latest | iOS React Native development (macOS only) |
| Android SDK | Latest | Android development |
| Nx CLI | Latest | `pnpm dlx @nx/cli@latest` |

### Bootstrap Existing Workspace

```bash
# The workspace is already created with Nx
cd /Volumes/MagicBag/GitHub/Mimic/Mimic

# Install dependencies
pnpm install

# Build design tokens to ensure pipeline works
pnpm nx run design-tokens:build
```

## 2. Penpot → Design Token Pipeline

### 2.1 Setup Penpot Design Tokens

1. **In Penpot Design File**:
   - Open the **Tokens** panel in the sidebar
   - Create Global tokens (colors, typography, spacing)
   - Create Alias tokens (semantic mappings)
   - Export follows W3C Design Token Community Group format

2. **Get Export Credentials**:

   ```bash
   # Create .env file in workspace root
   cat > .env << EOF
   PENPOT_FILE_ID=your-file-uuid-from-url
   PENPOT_ACCESS_TOKEN=your-api-token
   PENPOT_TEAM_ID=your-team-id
   EOF
   ```

### 2.2 Automated Export Setup

The dev-container is already configured with `penpot-export` service:

```bash
# Export tokens from Penpot
pnpm nx run design-tokens:tokens:export

# Export and build pipeline
pnpm nx run design-tokens:tokens:sync

# Watch for changes and auto-rebuild
pnpm nx run design-tokens:watch
```

## 3. Style Dictionary Multi-Platform Transform

### Current Configuration

The `style-dictionary.config.js` already supports multiple platforms:

```javascript
// packages/design-tokens/style-dictionary.config.js
module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    css: { /* CSS variables */ },
    ts: { /* TypeScript types */ },
    json: { /* Raw JSON */ },
    compose: { /* Kotlin for Compose */ },
    rn: { /* React Native JS */ },
  },
};
```

### Building Tokens

```bash
# Build all platform outputs
pnpm nx run design-tokens:build

# Build only tokens (skip TypeScript compilation)
pnpm nx run design-tokens:build:tokens

# Watch mode for development
pnpm nx run design-tokens:watch
```

## 4. Web Component Library (Qwik City)

### 4.1 Create Qwik Application

```bash
# Generate new Qwik City app
pnpm create qwik@latest apps/web --no-git --qwikcity

# Add to workspace
cd apps/web
echo '{
  "name": "web",
  "targets": {
    "serve": {
      "executor": "@nx/vite:dev-server",
      "options": { "port": 5173 }
    },
    "build": {
      "executor": "@nx/vite:build"
    }
  }
}' > project.json
```

### 4.2 Wire Design Tokens

```bash
# Install token dependency
pnpm add -w @mimic/design-tokens

# Install styling tools
pnpm add -w vanilla-extract @vanilla-extract/vite-plugin
```

Create theme integration:

```typescript
// apps/web/src/theme.css.ts
import { tokens } from '@mimic/design-tokens';
import { style } from '@vanilla-extract/css';

export const theme = {
  colors: {
    primary: tokens.color.primary.value,
    secondary: tokens.color.secondary.value,
  },
  spacing: {
    small: tokens.spacing.sm.value,
    medium: tokens.spacing.md.value,
    large: tokens.spacing.lg.value,
  },
};

export const buttonStyles = style({
  backgroundColor: theme.colors.primary,
  padding: theme.spacing.medium,
  borderRadius: tokens.borderRadius.medium.value,
});
```

### 4.3 Configure Vite

```typescript
// apps/web/vite.config.ts
import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default defineConfig({
  plugins: [
    qwikVite(),
    vanillaExtractPlugin(),
  ],
  // Import design token CSS
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@mimic/design-tokens/css";`,
      },
    },
  },
});
```

## 5. Storybook Workshop & Testing

### 5.1 Setup Storybook

```bash
# Initialize Storybook with Qwik support
cd apps/web
pnpm dlx storybook@next init --builder vite --type qwik

# Add design token addon
pnpm add -D @storybook/addon-designs @storybook/addon-controls
```

### 5.2 Configure Storybook

```typescript
// apps/web/.storybook/preview.ts
import { tokens } from '@mimic/design-tokens';
import '@mimic/design-tokens/css';

export const parameters = {
  backgrounds: {
    default: 'light',
    values: [
      { name: 'light', value: tokens.color.background.primary.value },
      { name: 'dark', value: tokens.color.background.inverse.value },
    ],
  },
  // Design token documentation
  designToken: {
    theme: tokens,
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
```

### 5.3 Add Testing

```bash
# Add test dependencies
pnpm add -D @storybook/test-runner playwright loki

# Configure test scripts
echo '{
  "scripts": {
    "test-storybook": "test-storybook",
    "visual-test": "loki test",
    "visual-test:update": "loki update"
  }
}' >> apps/web/package.json
```

## 6. Mobile & Desktop Shells

### 6.1 React Native Application

```bash
# Create React Native app
npx react-native@latest init MimicMobile --template react-native-template-typescript

# Move to workspace
mv MimicMobile apps/mobile-rn

# Add workspace integration
cd apps/mobile-rn
echo '{
  "name": "mobile-rn",
  "targets": {
    "start": {
      "executor": "@nx/react-native:start"
    },
    "run-ios": {
      "executor": "@nx/react-native:run-ios"
    },
    "run-android": {
      "executor": "@nx/react-native:run-android"
    }
  }
}' > project.json

# Install design tokens
pnpm add @mimic/design-tokens
```

Create React Native theme:

```typescript
// apps/mobile-rn/src/theme.ts
import { tokens } from '@mimic/design-tokens';
import { StyleSheet } from 'react-native';

const remToPx = (rem: string) => parseInt(rem) * 16;

export const theme = StyleSheet.create({
  container: {
    backgroundColor: tokens.color.background.primary.value,
    padding: remToPx(tokens.spacing.md.value),
  },
  text: {
    color: tokens.color.text.primary.value,
    fontSize: remToPx(tokens.fontSize.medium.value),
  },
  button: {
    backgroundColor: tokens.color.primary.value,
    borderRadius: remToPx(tokens.borderRadius.medium.value),
    padding: remToPx(tokens.spacing.sm.value),
  },
});
```

### 6.2 Compose Multiplatform

```bash
# Create Compose Multiplatform project
mkdir -p apps/mobile-compose

# Add Kotlin Gradle setup (simplified for brevity)
cd apps/mobile-compose

# Create project structure
mkdir -p src/commonMain/kotlin/com/mimic/theme
mkdir -p src/androidMain/kotlin/com/mimic
mkdir -p src/iosMain/kotlin/com/mimic
```

Generate Compose theme from tokens:

```kotlin
// apps/mobile-compose/src/commonMain/kotlin/com/mimic/theme/DesignTokens.kt
// Generated from Style Dictionary
object DesignTokens {
    val ColorPrimary = Color(0xFF007BFF)
    val ColorSecondary = Color(0xFF6C757D)
    val SpacingSmall = 8.dp
    val SpacingMedium = 16.dp
    val SpacingLarge = 24.dp
    val BorderRadiusMedium = 8.dp
}

@Composable
fun MimicTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = lightColorScheme(
            primary = DesignTokens.ColorPrimary,
            secondary = DesignTokens.ColorSecondary,
        ),
        content = content
    )
}
```

### 6.3 Tauri Desktop Application

```bash
# Create Tauri app
mkdir -p apps/desktop
cd apps/desktop

# Initialize Tauri
pnpm dlx create-tauri-app@latest . --before-dev-command "pnpm nx run web:serve" --dev-path "http://localhost:5173"

# Add workspace integration
echo '{
  "name": "desktop",
  "targets": {
    "tauri": {
      "executor": "@nx/run-commands",
      "options": {
        "command": "tauri dev"
      }
    },
    "build": {
      "executor": "@nx/run-commands",
      "options": {
        "command": "tauri build"
      }
    }
  }
}' > project.json
```

Configure Tauri to use Qwik app:

```json
// apps/desktop/src-tauri/tauri.conf.json
{
  "build": {
    "beforeDevCommand": "pnpm nx run web:serve",
    "beforeBuildCommand": "pnpm nx run web:build",
    "devPath": "http://localhost:5173",
    "distDir": "../web/dist"
  }
}
```

## 7. Monorepo Plumbing & Automation

### 7.1 Add Global Targets

Create workspace-level automation:

```bash
# Add global targets for token management
pnpm nx g @nx/workspace:run-commands tokens:build-all \
  --command="pnpm nx run design-tokens:build && pnpm nx run-many -t build" \
  --project=workspace-format

pnpm nx g @nx/workspace:run-commands tokens:sync-all \
  --command="pnpm nx run design-tokens:tokens:sync && pnpm nx run-many -t build --skip-nx-cache" \
  --project=workspace-format

pnpm nx g @nx/workspace:run-commands dev:full-stack \
  --command="concurrently 'pnpm nx run design-tokens:watch' 'pnpm nx run web:serve' 'pnpm nx run web:storybook'" \
  --project=workspace-format
```

### 7.2 Update Nx Configuration

Add token dependencies to nx.json:

```json
// nx.json (add to targetDefaults)
{
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build", "design-tokens:build"]
    }
  }
}
```

## 8. Local Development & CI Workflow

### 8.1 Development Commands

```bash
# Initial setup
pnpm install && pnpm nx run tokens:build-all

# Full development environment
pnpm nx run dev:full-stack

# Individual platforms
pnpm nx run web:serve                    # Qwik City dev
pnpm nx run web:storybook               # Storybook workshop
pnpm nx run mobile-rn:start             # React Native Metro
pnpm nx run desktop:tauri               # Tauri desktop dev

# Testing
pnpm nx run-many -t test lint           # Unit & lint tests
pnpm nx run web:test-storybook          # Storybook interaction tests
pnpm nx run web:visual-test             # Visual regression tests
```

### 8.2 CI/CD Pipeline

Update GitHub Actions workflow:

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      
      # Setup environment
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      
      # Install and build
      - run: pnpm install
      - run: pnpm nx run tokens:build-all
      
      # Test affected projects
      - run: pnpm nx affected -t lint test build
      
      # Visual regression tests
      - run: pnpm nx run web:build-storybook
      - run: pnpm nx run web:visual-test
        env:
          LOKI_REFERENCE_URL: ${{ secrets.LOKI_REFERENCE_URL }}
```

## 9. Next Steps & Advanced Features

### 9.1 Automated Token Sync

```bash
# Add cron job for nightly token sync
# .github/workflows/token-sync.yml
```

### 9.2 AI-Powered Code Generation

```bash
# Add Ollama service integration for component scaffolding
# tools/ollama-scaffold/
```

### 9.3 Semantic Versioning & Publishing

```bash
# Enable nx release for package publishing
pnpm nx g @nx/js:release-configuration
```

### 9.4 Advanced Visual Testing

```bash
# Add Chromatic for advanced visual testing
pnpm add -D chromatic
```

## 🎯 Verification Checklist

After implementing this guide, verify:

- [ ] Penpot tokens export to `packages/design-tokens/tokens/base.json`
- [ ] Style Dictionary generates outputs for all platforms
- [ ] Qwik City app uses tokens via CSS variables and TypeScript
- [ ] Storybook displays components with token documentation
- [ ] React Native app applies tokens through StyleSheet
- [ ] Tauri desktop app bundles and runs the web app
- [ ] All tests pass (`pnpm nx run-many -t test lint`)
- [ ] Visual regression tests capture changes
- [ ] Watch mode enables real-time design-to-code updates

## 📚 Resources

- [Penpot Design Tokens Guide](https://penpot.app/design-tokens)
- [Style Dictionary Documentation](https://amzn.github.io/style-dictionary/)
- [W3C Design Token Format](https://tr.designtokens.org/format/)
- [Nx Workspace Configuration](https://nx.dev/concepts/mental-model)
- [Qwik City Framework](https://qwik.builder.io/qwikcity/overview/)
- [Tauri Desktop Apps](https://tauri.app/v1/guides/)

This implementation provides a complete, production-ready design token pipeline that maintains
consistency across all platforms while enabling real-time design-to-code workflows.
