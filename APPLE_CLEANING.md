# 🧹 Apple Junk Cleaning Setup

This workspace includes comprehensive Apple/macOS junk cleaning hooks and utilities to keep your development environment clean and performant.

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
npm run clean:apple

# Clean specific types of files
npm run clean:ds-store      # Remove .DS_Store files only
npm run clean:xcode        # Remove Xcode user data
npm run clean:apple-logs   # Remove crash logs
npm run clean:spotlight    # Remove Spotlight metadata
npm run clean:temp         # Remove temporary files

# Complete cleanup (Apple junk + build artifacts + reinstall)
npm run clean:all
```

### Nx Integration

```bash
# Clean all projects using Nx
npm run clean:workspace

# Clean Apple junk in all projects
npm run clean:apple:workspace

# Clean specific project
nx run design-system:clean
nx run design-tokens:clean
nx run shared-utils:clean

# Clean Apple junk in specific project
nx run design-system:clean:apple
```

## 🔄 Automated Cleaning (Git Hooks)

### Pre-commit Hook

Automatically runs before each commit:

- Removes `.DS_Store` files
- Runs lint-staged for code quality

### Post-checkout Hook

Runs after checking out branches:

- Cleans `.DS_Store` files
- Removes temporary files

### Post-merge Hook

Runs after merging branches:

- Cleans `.DS_Store` files
- Removes temporary files

### Post-rewrite Hook

Runs after rebase/amend operations:

- Cleans `.DS_Store` files

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
# Initialize husky (done automatically during npm install)
pnpm exec husky init

# Test the cleaner
npm run clean:apple
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

1. **Run cleaning regularly**: Use `npm run clean:apple` periodically
2. **Before committing**: Cleaning happens automatically, but you can run manually
3. **After switching branches**: Post-checkout hook handles this automatically
4. **When workspace feels sluggish**: Run `npm run clean:all`

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
