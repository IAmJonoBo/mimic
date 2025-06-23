# 🎨 @mimic/design-tokens

Design tokens generated from Penpot using Style Dictionary, providing the single source of truth for all visual
properties across the Mimic design system.

## 📋 Overview

This package transforms W3C Design Token Community Group (DTCG) compliant JSON tokens into platform-specific formats
using Style Dictionary. It serves as the foundation for consistent visual design across web, mobile, and desktop
applications.

## 🎯 Key Features

- **W3C DTCG Compliant**: Standards-based token format
- **Multi-Platform Output**: CSS variables, TypeScript types, mobile tokens
- **Style Dictionary Integration**: Powerful transformation pipeline
- **Type Safety**: Full TypeScript support with generated types
- **Watch Mode**: Real-time token compilation during development

## 📦 Installation

```bash
# Install via pnpm (workspace dependency)
pnpm add @mimic/design-tokens

# Or if developing locally
pnpm install
```

## 🚀 Usage

### Basic Import

```typescript
import { tokens } from '@mimic/design-tokens';

// Access tokens with full type safety
const primaryColor = tokens.color.primary.value; // '#007bff'
const largeFontSize = tokens.fontSize.large.value; // '1.25rem'
```

### CSS Variables

```css
/* Tokens are automatically available as CSS custom properties */
.button {
  background-color: var(--color-primary);
  font-size: var(--font-size-medium);
  border-radius: var(--border-radius-medium);
}
```

### Token Categories

#### Colors

```typescript
import { tokens } from '@mimic/design-tokens';

// Semantic colors
tokens.color.primary.value; // Primary brand color
tokens.color.secondary.value; // Secondary brand color
tokens.color.success.value; // Success state color
tokens.color.warning.value; // Warning state color
tokens.color.error.value; // Error state color

// Neutral colors
tokens.color.neutral.grey100.value;
tokens.color.neutral.grey200.value;
// ... and more
```

#### Typography

```typescript
// Font families
tokens.fontFamily.primary.value; // Primary font stack
tokens.fontFamily.monospace.value; // Monospace font stack

// Font sizes
tokens.fontSize.small.value; // 0.875rem
tokens.fontSize.medium.value; // 1rem
tokens.fontSize.large.value; // 1.25rem

// Font weights
tokens.fontWeight.normal.value; // 400
tokens.fontWeight.medium.value; // 500
tokens.fontWeight.bold.value; // 700
```

#### Spacing

```typescript
// Spacing scale
tokens.spacing.xs.value; // 0.25rem
tokens.spacing.sm.value; // 0.5rem
tokens.spacing.md.value; // 1rem
tokens.spacing.lg.value; // 1.5rem
tokens.spacing.xl.value; // 2rem
```

#### Border Radius

```typescript
tokens.borderRadius.small.value; // 0.25rem
tokens.borderRadius.medium.value; // 0.5rem
tokens.borderRadius.large.value; // 1rem
```

## 🛠️ Development

### Building Tokens

```bash
# Build all token outputs
pnpm build

# Build only tokens (skip TypeScript compilation)
pnpm build:tokens

# Build only TypeScript types
pnpm build:types

# Watch for changes and rebuild
pnpm watch
```

### Token File Structure

```text
tokens/
├── base.json                 # Base token definitions
├── semantic.json            # Semantic color mappings (future)
├── components.json          # Component-specific tokens (future)
└── platforms/
    ├── web.json             # Web-specific overrides (future)
    ├── mobile.json          # Mobile-specific overrides (future)
    └── desktop.json         # Desktop-specific overrides (future)
```

### Style Dictionary Configuration

The `style-dictionary.config.js` file defines how tokens are transformed:

```javascript
module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'dist/js/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
        },
      ],
    },
  },
};
```

## 📁 Output Structure

```text
dist/
├── css/
│   └── variables.css         # CSS custom properties
├── js/
│   ├── tokens.js            # JavaScript token exports
│   └── tokens.d.ts          # TypeScript definitions
├── scss/
│   └── variables.scss       # Sass variables (future)
├── json/
│   └── tokens.json          # Raw JSON tokens
└── mobile/
    ├── ios/                 # iOS token formats (future)
    └── android/             # Android token formats (future)
```

## 🎨 Token Design Philosophy

### Naming Convention

Tokens follow a hierarchical naming pattern:

```text
{category}.{type}.{item}.{subitem}.{state}
```

Examples:

- `color.primary.500` - Primary color at 500 weight
- `spacing.component.button.padding` - Button padding value
- `fontSize.heading.h1` - H1 heading font size

### Token Types

1. **Primitive Tokens**: Raw values (colors, numbers, strings)
2. **Semantic Tokens**: Meaningful aliases (primary, secondary, success)
3. **Component Tokens**: Component-specific values (button-padding, card-shadow)

### Design Token Hierarchy

```text
Primitive Tokens (base.json)
    ↓
Semantic Tokens (semantic.json)
    ↓
Component Tokens (components.json)
    ↓
Platform Overrides (platforms/*.json)
```

## 🔄 Integration with Penpot

This package is designed to integrate with Penpot v2's design token export functionality:

1. **Design in Penpot**: Create and manage tokens in Penpot's design token panel
2. **Export Tokens**: Use Penpot's W3C DTCG export feature
3. **Transform Tokens**: Style Dictionary processes the exported JSON
4. **Generate Assets**: Platform-specific token files are created
5. **Consume Tokens**: Import tokens in your applications

### Future Automation

```bash
# Planned: Automated Penpot sync
pnpm nx run tools/penpot-export:sync
```

## 📊 Token Metrics

- **Token Count**: ~50 base tokens
- **Generated Files**: 8 platform-specific formats
- **Build Time**: <1 second (incremental)
- **Bundle Size**: <2KB (minified CSS)

## 🧪 Testing

```bash
# Run token validation tests
pnpm test

# Validate token structure
pnpm test:tokens

# Check generated output
pnpm test:output
```

## 🤝 Contributing

When adding new tokens:

1. **Follow Naming Convention**: Use the established hierarchy
2. **Add Documentation**: Include JSDoc comments for new token categories
3. **Test Outputs**: Verify all platform formats generate correctly
4. **Update Types**: Ensure TypeScript definitions are complete

### Adding New Tokens

```json
// tokens/base.json
{
  "color": {
    "brand": {
      "tertiary": {
        "value": "#6f42c1",
        "type": "color",
        "description": "Tertiary brand color for accents"
      }
    }
  }
}
```

## 📚 Resources

- [Style Dictionary Documentation](https://amzn.github.io/style-dictionary/)
- [Design Token Community Group](https://www.w3.org/community/design-tokens/)
- [W3C Design Token Format](https://tr.designtokens.org/format/)
- [Penpot Design Token Guide](https://penpot.app/design-tokens)

## 🐛 Troubleshooting

### Common Issues

#### Token Build Fails

```bash
# Clear dist directory and rebuild
pnpm clean && pnpm build
```

#### TypeScript Errors

```bash
# Regenerate TypeScript definitions
pnpm build:types
```

#### Watch Mode Not Working

```bash
# Restart with verbose logging
pnpm watch --verbose
```

#### CSS Variables Not Loading

- Ensure `dist/css/variables.css` is imported in your application
- Check that CSS custom properties are supported in your target browsers

## 📄 License

MIT License - see the [LICENSE](../../LICENSE) file for details.
