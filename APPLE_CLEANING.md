# 🧹 Apple Junk Cleaning Setup

This workspace includes comprehensive Apple/macOS junk cleaning hooks and utilities to keep your development
environment clean and performant.

## 🎯 What Gets Cleaned

### macOS System Files

- `.DS_Store` files (Finder metadata)
- `._*` files (AppleDouble files)
- `.Spotlight-V100` directories (Spotlight indexing)
- `.fseventsd` directories (FSEvents metadata)
- `.Trashes` directories (Trash folders)
- `.TemporaryItems` directories
- Thumbnails and cache files

### Development Artifacts

- Xcode user data (`*.xcuserdata*`, `xcuserdata/`)
- Crash logs (`*.crash`, `*.crashlog`)
- Temporary files (`*.tmp`, `~*`)
- Windows thumbnails (`Thumbs.db`)

## 🛠 Available Commands

### Manual Cleaning

```bash
# Clean all Apple junk using the comprehensive cleaner
pnpm run clean:apple

# Clean only staged paths (fast path for pre-commit workflows)
pnpm run clean:apple:staged

# Validate that no Apple metadata is tracked in git
pnpm run check:apple

# Clean specific types of files
pnpm run clean:ds-store     # Remove .DS_Store files only
pnpm run clean:xcode        # Remove Xcode user data
pnpm run clean:apple-logs   # Remove crash logs
pnpm run clean:spotlight    # Remove Spotlight metadata
pnpm run clean:temp         # Remove temporary files

# Complete cleanup (Apple junk + build artifacts + reinstall)
pnpm run clean:all
```

### Nx Integration

```bash
# Clean all projects using Nx
pnpm run clean:workspace

# Clean Apple junk in all projects
pnpm run clean:apple:workspace

# Clean specific project
nx run design-system:clean
nx run design-tokens:clean
nx run shared-utils:clean

# Clean Apple junk in specific project
nx run design-system:clean:apple
```

## 🔄 Automated Cleaning (Git Hooks)

### Pre-commit Hook

Runs before each commit and will fail the commit if violations are detected:

- Cleans only the staged paths for speed (`pnpm run clean:apple:staged`)
- Verifies that no Apple metadata is tracked (`pnpm run check:apple`)
- Runs `lint-staged` for code quality

### Post-checkout Hook

Runs after checking out branches (best effort, non-blocking):

- Executes the full Apple cleaner via `pnpm run clean:apple`
- Silently ignores failures (for example if pnpm is unavailable)

### Post-merge Hook

Runs after merging branches (best effort, non-blocking):

- Executes the full Apple cleaner via `pnpm run clean:apple`

### Post-rewrite Hook

Runs after rewrite/rebase operations (best effort, non-blocking):

- Executes the full Apple cleaner via `pnpm run clean:apple`

## 📁 Files and Structure

### Core Files

- `tools/apple-cleaner.js` - Comprehensive Node.js cleaner script
- `.husky/` - Git hooks directory
- `.gitignore` - Enhanced with comprehensive Apple/macOS patterns

### Git Hooks

- `.husky/pre-commit` - Pre-commit cleaning
- `.husky/post-checkout` - Post-checkout cleaning
- `.husky/post-merge` - Post-merge cleaning
- `.husky/post-rewrite` - Post-rewrite cleaning

### Project Integration

Each project (`design-system`, `design-tokens`, `shared-utils`) has:

- `clean` target - Full project cleanup including Apple junk
- `clean:apple` target - Apple junk only

## 🚀 Setup

The cleaning system is automatically active. To manually set up git hooks:

```bash
# Initialize husky (done automatically during pnpm install)
pnpm exec husky init

# Test the cleaner
pnpm run clean:apple
```

## 🎨 Customization

### Adding Custom Patterns

Edit `tools/apple-cleaner.js` to add custom cleaning patterns:

```javascript
const commands = [
  // Add your custom cleaning command
  {
    cmd: `find "${projectRoot}" -name 'your-pattern' -type f -delete`,
    desc: 'Removing your custom files',
  },
];
```

### Project-Specific Cleaning

Add custom clean targets to any `project.json`:

```json
{
  "targets": {
    "clean:custom": {
      "executor": "nx:run-commands",
      "options": {
        "command": "your-custom-clean-command",
        "cwd": "your-project-path"
      }
    }
  }
}
```

## 🔍 Monitoring

The cleaner provides detailed logging:

- ✅ Successful operations
- ⚠️ Warnings for missing files (normal)
- 🧹 Progress indicators

## 📋 Best Practices

1. **Run cleaning regularly**: Use `pnpm run clean:apple` periodically
2. **Before committing**: Cleaning happens automatically, but you can run manually
3. **After switching branches**: Post-checkout hook handles this automatically
4. **When workspace feels sluggish**: Run `pnpm run clean:all`

## 🆘 Troubleshooting

### Git Hooks Not Running

```bash
# Re-install husky
rm -rf .husky
pnpm exec husky init
chmod +x .husky/*
```

### Permission Errors

```bash
# Make cleaner executable
chmod +x tools/apple-cleaner.js
```

### Large Workspace

For very large workspaces, you can clean specific directories:

```bash
node tools/apple-cleaner.js packages/design-system
```

---

**Status**: ✅ **Fully Configured**\
**Automation**: ✅ **Git Hooks Active**\
**Cross-Platform**: ✅ **macOS Optimized**
