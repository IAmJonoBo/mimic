# 📚 Documentation Index

Welcome to the comprehensive documentation for the Mimic design system monorepo.

## 🎯 Master Control Document

📖 **[Master Control Document](./CONTROL_DOCUMENT.md)** - The canonical reference and control
handbook for the complete Mimic design token pipeline, orchestrating all components, workflows,
and integrations across the entire ecosystem.

## 🚀 Quick Start

- **[README](../README.md)** - Project overview and quick start guide
- **[CONTRIBUTING](../CONTRIBUTING.md)** - How to contribute to the project
- **[DEVELOPMENT](../DEVELOPMENT.md)** - Local development setup and workflows

## 📦 Package Documentation

### Design Tokens

- **[Design Tokens README](../packages/design-tokens/README.md)** - W3C-compliant design tokens with Style Dictionary

### Design System

- **[Design System README](../packages/design-system/README.md)** - Qwik-based component library with Storybook

### Shared Utilities

- **[Shared Utils README](../packages/shared-utils/README.md)** - Common utilities and helper functions

## 🔧 Technical Documentation

### Implementation Guides

- **[Complete Implementation Guide](./IMPLEMENTATION_GUIDE.md)** - Step-by-step Penpot to production workflow
- **[Design Token Implementation](./DESIGN_TOKENS.md)** - End-to-end design token usage and integration
- **[Design Token Migration Guide](./DESIGN_TOKENS_MIGRATION.md)** - Migration strategies for existing projects

### API Reference

- **[API Documentation](./API.md)** - Complete API reference for all packages
- **[Type Definitions](./API.md#type-definitions)** - TypeScript types and interfaces

### Architecture

- **[Architecture Decision Records (ADRs)](./ADR.md)** - Key architectural decisions and rationale
- **[Troubleshooting Guide](./TROUBLESHOOTING.md)** - Common issues and solutions

### Operations

- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment procedures
- **[Apple Cleaning Guide](../APPLE_CLEANING.md)** - macOS development setup

## 🚀 Advanced Documentation

- **[Advanced Documentation Summary](./ADVANCED_DOCUMENTATION_SUMMARY.md)** - Complete overview of advanced workflows

### Design and Token Management

- **[Penpot Schema and Integration](./design/penpot-schema.md)** - Penpot token JSON schema, CLI config, and governance
- **[Token Diff Strategy](./design/diff-strategy.md)** - Token change detection and review workflow

### Build Pipeline

- **[Style Dictionary Advanced](./build/style-dictionary.md)** - Advanced Style Dictionary config and custom transforms

### Platform Integration

- **[Qwik Integration](./platforms/qwik.md)** - Qwik City integration, image optimization, prefetch, service worker
- **[Storybook Advanced](./platforms/storybook.md)** - Storybook 8.5 integration, interaction/visual testing, test-runner
- **[Compose Multiplatform](./platforms/compose.md)** - Compose theme injection, iOS/Wasm quirks, React Native
- **[Tauri Integration](./platforms/tauri.md)** - Tauri security checklist, auto-updater, token integration

### Mobile Development

- **[Compose Theme Integration](./mobile/compose-theme.md)** - Complete guide to integrating design tokens
  with Compose Multiplatform, including runtime theme switching and platform-specific optimizations
- **[React Native New Architecture](./mobile/rn-new-arch.md)** - React Native New Architecture integration
  with Hermes IPO optimizations and feature flags for gradual migration

### Desktop Development

- **[Tauri Security Framework](./desktop/tauri-security.md)** - Complete security implementation for
  Tauri desktop application, including CSP configuration, auto-updater security, and code signing

### Web Development

- **[Qwik Performance Optimization](./web/qwik-performance.md)** - Advanced Qwik performance features
  including image optimization, prefetch strategies, and performance flags

### Quality Assurance

- **[Token Governance](./quality/token-governance.md)** - Token governance, validation, review, and compliance
- **[Code Quality Tools](./quality/biome-dprint.md)** - Biome/dprint config, linting, formatting standards

### CI/CD and DevOps

- **[CI/CD Pipeline Overview](./devops/ci-overview.md)** - Comprehensive overview of the complete CI/CD
  pipeline, including pipeline diagrams, performance budgets, and integration workflows
- **[Advanced Pipeline Automation](./cicd/advanced-pipeline-automation.md)** - Multi-stage CI/CD pipeline and release orchestration
- **[Token Drift Detection](./cicd/token-drift-check.md)** - Token drift detection, sync, and alerting in CI/CD
- **[Nx Boundaries and Optimization](./devops/nx-boundaries.md)** - Nx module boundaries, remote cache, release workflow

### Build System

- **[Style Dictionary Advanced](./build/style-dictionary-advanced.md)** - Custom platforms, transforms,
  and watch mode configuration for comprehensive token transformation

### Design Integration

- **[Penpot Token Schema](./design/penpot-token-schema.md)** - Penpot JSON anatomy, export procedures,
  and mapping to Style Dictionary paths

### Security and Compliance

- **[Security Compliance Framework](./security/security-compliance-framework.md)** - Enterprise security and compliance automation

### Testing and QA

- **[Comprehensive Testing Strategy](./testing/comprehensive-testing.md)** - Visual regression, interaction, accessibility

### Mobile Development

- **[React Native New Architecture](./mobile/rn-new-arch.md)** - RN Fabric + TurboModules integration with design tokens

### Development Workflows

- **[Advanced Development Workflows](./development/advanced-workflows.md)** - Hot reload, debugging, contributor onboarding
- **[Advanced Contributor Guide](./onboarding/advanced-contributor-guide.md)** - Comprehensive onboarding and setup automation

## 🎨 Design System Resources

### Component Library

- **[Storybook](https://iamjonobo.github.io/mimic/storybook/)** - Interactive component documentation
- **[Component Guidelines](../CONTRIBUTING.md#component-guidelines)** - Best practices for component development

### Design Tokens Usage

- **[Design Tokens Guide](./DESIGN_TOKENS.md)** - Complete guide to token usage, patterns, and best practices
- **[Design Tokens Migration](./DESIGN_TOKENS_MIGRATION.md)** - Step-by-step migration guide for existing projects
- **[Token Categories](../packages/design-tokens/README.md#token-categories)** - Available design tokens
- **[Token Usage](../packages/design-tokens/README.md#usage)** - How to use tokens in your applications

## 🧪 Testing and Quality

### Testing Strategy

- **[Comprehensive Testing Strategy](./testing/comprehensive-testing.md)** - Visual regression, interaction, accessibility
- **[Storybook CI Integration](./testing/storybook-ci.md)** - Complete CI/CD integration for Storybook
  testing, including test-runner automation, visual regression testing with Loki, and GitHub Actions
- **[Testing Guidelines](../CONTRIBUTING.md#testing-requirements)** - Unit, integration, and visual testing
- **[Visual Regression Testing](../packages/design-system/README.md#visual-regression-testing)** - Automated visual testing

### Code Quality

- **[Code Style Guidelines](../CONTRIBUTING.md#code-style-guidelines)** - Formatting and linting standards
- **[Git Hooks](../APPLE_CLEANING.md#git-hooks)** - Automated quality checks

## 🚀 Release and Deployment

### Release Process

- **[Release Workflow](../CONTRIBUTING.md#submitting-changes)** - How releases are created and published
- **[Versioning Strategy](./DEPLOYMENT.md#package-publishing)** - Semantic versioning approach

### Deployment Targets

- **[NPM Packages](./DEPLOYMENT.md#package-publishing)** - Publishing to npm registry
- **[Storybook Deployment](./DEPLOYMENT.md#storybook-deployment)** - Documentation site deployment
- **[CI/CD Pipeline](./DEPLOYMENT.md#cicd-pipeline)** - Automated deployment workflow

## 🛠️ Development Workflows

### Local Development

- **[Development Setup](../DEVELOPMENT.md#quick-start)** - Getting started locally
- **[Development Tools](../scripts/setup-dx.sh)** - Developer experience tools
- **[Apple Cleaning](../APPLE_CLEANING.md)** - macOS-specific setup

### Component Development

- **[Adding New Components](../packages/design-system/README.md#adding-new-components)** - Component creation workflow
- **[Token Integration](../packages/design-tokens/README.md#integration-with-penpot)** - Using design tokens

## 📊 Monitoring and Analytics

### Performance

- **[Bundle Analysis](./DEPLOYMENT.md#performance-monitoring)** - Bundle size monitoring
- **[Performance Guidelines](../packages/design-system/README.md#performance)** - Optimization best practices

### Health Monitoring

- **[Health Checks](./DEPLOYMENT.md#monitoring-and-maintenance)** - System health monitoring
- **[Rollback Procedures](./DEPLOYMENT.md#rollback-procedures)** - Emergency response

## 🤝 Community and Support

### Getting Help

- **[GitHub Issues](https://github.com/IAmJonoBo/mimic/issues)** - Bug reports and feature requests
- **[GitHub Discussions](https://github.com/IAmJonoBo/mimic/discussions)** - Community discussions
- **[Troubleshooting](./TROUBLESHOOTING.md)** - Common problems and solutions

### Contributing

- **[Contribution Guidelines](../CONTRIBUTING.md)** - How to contribute
- **[Code of Conduct](../CONTRIBUTING.md#code-of-conduct)** - Community standards
- **[Pull Request Template](../.github/pull_request_template.md)** - PR guidelines

## 📋 Checklists and Templates

### Development Checklists

- **[Pre-commit Checklist](../CONTRIBUTING.md#submitting-changes)** - Before committing code
- **[Component Checklist](../packages/design-system/README.md#contributing)** - Creating new components
- **[Release Checklist](./DEPLOYMENT.md#deployment-checklist)** - Before releasing

### Templates

- **[ADR Template](./ADR.md#adr-template)** - Architecture decision template
- **[Component Template](../packages/design-system/README.md#adding-new-components)** - New component template

## 🔗 External Resources

### Learning Resources

- **[Nx Documentation](https://nx.dev/docs)** - Monorepo management
- **[Qwik Documentation](https://qwik.builder.io/)** - Component framework
- **[Style Dictionary](https://amzn.github.io/style-dictionary/)** - Design token transformation
- **[Storybook Documentation](https://storybook.js.org/docs)** - Component documentation

### Standards and Specifications

- **[W3C Design Token Community Group](https://www.w3.org/community/design-tokens/)** - Token standards
- **[WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)** - Accessibility standards
- **[Semantic Versioning](https://semver.org/)** - Version numbering

## 📝 Documentation Maintenance

### Updating Documentation

1. **Edit Source Files**: Update markdown files in respective locations
2. **Test Changes**: Verify links and formatting
3. **Update Index**: Add new documentation to this index
4. **Submit PR**: Follow the standard contribution process

### Documentation Standards

- **Markdown Format**: Use standard markdown syntax
- **Link Validation**: Ensure all links are functional
- **Code Examples**: Include working code samples
- **Screenshots**: Use current UI screenshots
- **Accessibility**: Ensure documentation is accessible

---

**Last Updated**: June 2025

**Need help?** Check the [troubleshooting guide](./TROUBLESHOOTING.md) or [open an issue](https://github.com/IAmJonoBo/mimic/issues/new).
