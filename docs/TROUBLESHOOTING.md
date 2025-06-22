# 🛠️ Troubleshooting Guide

Common issues and solutions for the Mimic design system monorepo.

## 📋 Table of Contents

- [Installation Issues](#installation-issues)
- [Build Problems](#build-problems)
- [Development Server Issues](#development-server-issues)
- [Design Token Problems](#design-token-problems)
- [Storybook Issues](#storybook-issues)
- [Testing Problems](#testing-problems)
- [Git and Version Control](#git-and-version-control)
- [Performance Issues](#performance-issues)
- [TypeScript Errors](#typescript-errors)
- [macOS Specific Issues](#macos-specific-issues)

## Installation Issues

### `pnpm install` Fails

**Symptoms:**

- Package installation errors
- Dependency resolution failures
- Network timeouts

**Solutions:**

1. **Clear package manager cache:**

   ```bash
   pnpm store prune
   pnpm install --frozen-lockfile
   ```

2. **Check Node.js version:**

   ```bash
   node --version  # Should be 18.0.0 or later
   pnpm --version  # Should be 9.0.0 or later
   ```

3. **Reset workspace:**

   ```bash
   rm -rf node_modules
   rm -rf packages/*/node_modules
   rm pnpm-lock.yaml
   pnpm install
   ```

4. **Network issues:**

   ```bash
   # Use different registry
   pnpm config set registry https://registry.npmmirror.com/

   # Or use corporate proxy
   pnpm config set proxy http://proxy.company.com:8080
   ```

### Workspace Dependencies Not Found

**Symptoms:**

- `Cannot resolve module '@mimic/design-tokens'`
- Import errors between packages

**Solutions:**

1. **Rebuild all packages:**

   ```bash
   pnpm build
   ```

2. **Check workspace configuration:**

   ```bash
   # Verify pnpm-workspace.yaml
   cat pnpm-workspace.yaml

   # Should contain:
   # packages:
   #   - 'packages/*'
   ```

3. **Verify package.json dependencies:**
   ```bash
   # Check if workspace dependencies are correctly defined
   grep -r "workspace:" packages/*/package.json
   ```

## Build Problems

### Build Fails with "Cannot find module"

**Symptoms:**

- TypeScript compilation errors
- Missing module errors during build

**Solutions:**

1. **Clean and rebuild:**

   ```bash
   pnpm clean:all
   pnpm build
   ```

2. **Check TypeScript configuration:**

   ```bash
   # Verify tsconfig.json paths
   cat tsconfig.json | grep -A 10 "paths"
   ```

3. **Rebuild dependencies in order:**
   ```bash
   pnpm nx run design-tokens:build
   pnpm nx run shared-utils:build
   pnpm nx run design-system:build
   ```

### Nx Build Cache Issues

**Symptoms:**

- Builds not reflecting changes
- Inconsistent build outputs

**Solutions:**

1. **Clear Nx cache:**

   ```bash
   pnpm nx reset
   ```

2. **Check cache configuration:**

   ```bash
   # Verify nx.json cache settings
   cat nx.json | grep -A 5 "cacheDirectory"
   ```

3. **Force rebuild without cache:**
   ```bash
   pnpm nx run-many -t build --skip-nx-cache
   ```

### Style Dictionary Build Errors

**Symptoms:**

- Token generation fails
- CSS variables not generated

**Solutions:**

1. **Check token JSON syntax:**

   ```bash
   # Validate JSON files
   find packages/design-tokens/tokens -name "*.json" -exec node -e "JSON.parse(require('fs').readFileSync('{}', 'utf8'))" \;
   ```

2. **Rebuild tokens explicitly:**

   ```bash
   cd packages/design-tokens
   pnpm build:tokens
   ```

3. **Check Style Dictionary config:**
   ```bash
   # Verify configuration
   cat packages/design-tokens/style-dictionary.config.js
   ```

## Development Server Issues

### Port Already in Use

**Symptoms:**

- `Error: listen EADDRINUSE: address already in use :::3000`
- Development server won't start

**Solutions:**

1. **Find and kill process:**

   ```bash
   # Find process using port 3000
   lsof -ti:3000

   # Kill the process
   kill -9 $(lsof -ti:3000)
   ```

2. **Use different port:**

   ```bash
   # For Storybook
   pnpm storybook -- --port 6007

   # For dev server
   PORT=3001 pnpm dev
   ```

3. **Check for background processes:**
   ```bash
   # List Node.js processes
   ps aux | grep node
   ```

### Hot Reload Not Working

**Symptoms:**

- Changes not reflected in browser
- Manual refresh required

**Solutions:**

1. **Check file watchers limit (Linux/macOS):**

   ```bash
   # Increase file watchers
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

2. **Restart development server:**

   ```bash
   # Kill and restart
   pnpm dev
   ```

3. **Check firewall/antivirus:**
   - Disable firewall temporarily
   - Add Node.js to antivirus exceptions

## Design Token Problems

### Tokens Not Updating

**Symptoms:**

- CSS variables show old values
- Component styles not reflecting token changes

**Solutions:**

1. **Rebuild token pipeline:**

   ```bash
   pnpm nx run design-tokens:build
   pnpm nx run design-system:build
   ```

2. **Check token imports:**

   ```typescript
   // Verify token imports are correct
   import { tokens } from '@mimic/design-tokens';
   console.log(tokens.color.primary.value);
   ```

3. **Clear browser cache:**
   - Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
   - Clear browser cache completely

### CSS Variables Not Loading

**Symptoms:**

- Styles appear unstyled
- CSS custom properties showing as `var(--undefined)`

**Solutions:**

1. **Check CSS import:**

   ```css
   /* Ensure CSS variables are imported */
   @import '@mimic/design-tokens/dist/css/variables.css';
   ```

2. **Verify token generation:**

   ```bash
   # Check if CSS file exists
   ls -la packages/design-tokens/dist/css/

   # Check CSS content
   cat packages/design-tokens/dist/css/variables.css
   ```

3. **Check browser support:**
   - CSS custom properties require modern browsers
   - IE11 needs polyfill

## Storybook Issues

### Storybook Won't Start

**Symptoms:**

- Storybook build fails
- White screen when accessing Storybook

**Solutions:**

1. **Clear Storybook cache:**

   ```bash
   rm -rf node_modules/.cache/storybook
   pnpm build-storybook
   ```

2. **Check Storybook configuration:**

   ```bash
   # Verify .storybook/main.ts
   cat packages/design-system/.storybook/main.ts
   ```

3. **Update Storybook:**
   ```bash
   pnpm storybook upgrade
   ```

### Stories Not Loading

**Symptoms:**

- Components not appearing in Storybook
- Empty sidebar in Storybook

**Solutions:**

1. **Check story file patterns:**

   ```javascript
   // .storybook/main.ts should include:
   stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'];
   ```

2. **Verify story file naming:**

   ```bash
   # Stories should follow pattern
   find packages/design-system/src -name "*.stories.*"
   ```

3. **Check story exports:**
   ```typescript
   // Stories must have default export
   export default {
     title: 'Components/Button',
     component: Button,
   };
   ```

## Testing Problems

### Tests Fail to Run

**Symptoms:**

- Vitest/Jest crashes on startup
- Test files not found

**Solutions:**

1. **Check test configuration:**

   ```bash
   # Verify vitest.config.ts
   cat packages/*/vitest.config.ts
   ```

2. **Clear test cache:**

   ```bash
   pnpm nx run-many -t test --clearCache
   ```

3. **Run tests with verbose output:**
   ```bash
   pnpm test --reporter=verbose
   ```

### Visual Tests Failing

**Symptoms:**

- Loki tests show differences
- Visual regression failures

**Solutions:**

1. **Update baselines after intentional changes:**

   ```bash
   pnpm visual-test --update
   ```

2. **Check rendering consistency:**

   ```bash
   # Run tests in Docker for consistency
   docker run --rm -v $(pwd):/app -w /app node:18 pnpm visual-test
   ```

3. **Compare specific stories:**
   ```bash
   pnpm loki test --stories "Button.*"
   ```

## Git and Version Control

### Pre-commit Hooks Failing

**Symptoms:**

- Git commits blocked by Husky hooks
- Linting errors prevent commits

**Solutions:**

1. **Run hooks manually:**

   ```bash
   # Check what's failing
   .husky/pre-commit
   ```

2. **Fix linting issues:**

   ```bash
   pnpm lint --fix
   pnpm format
   ```

3. **Skip hooks temporarily (not recommended):**
   ```bash
   git commit --no-verify -m "temporary commit"
   ```

### Git Hooks Not Running

**Symptoms:**

- Husky hooks don't execute
- No pre-commit validation

**Solutions:**

1. **Reinstall Husky:**

   ```bash
   pnpm husky install
   chmod +x .husky/*
   ```

2. **Check hook files:**

   ```bash
   # Verify hook files exist and are executable
   ls -la .husky/
   ```

3. **Check Git configuration:**
   ```bash
   # Verify hooks path
   git config core.hooksPath
   ```

## Performance Issues

### Slow Build Times

**Symptoms:**

- Builds take excessively long
- Development feedback loop slow

**Solutions:**

1. **Use Nx affected builds:**

   ```bash
   # Only build what changed
   pnpm nx affected -t build
   ```

2. **Enable remote caching:**

   ```bash
   # Check Nx Cloud configuration
   cat nx.json | grep "nxCloudId"
   ```

3. **Parallel builds:**
   ```bash
   # Increase parallel processes
   pnpm nx run-many -t build --parallel=4
   ```

### Large Bundle Sizes

**Symptoms:**

- Slow page loads
- Large JavaScript bundles

**Solutions:**

1. **Analyze bundle size:**

   ```bash
   pnpm nx run design-system:analyze
   ```

2. **Check for duplicate dependencies:**

   ```bash
   pnpm ls --depth=0
   ```

3. **Tree-shake imports:**

   ```typescript
   // Use specific imports
   import { Button } from '@mimic/design-system/button';

   // Instead of
   import { Button } from '@mimic/design-system';
   ```

## TypeScript Errors

### Type Definition Errors

**Symptoms:**

- `Cannot find module` for local packages
- Missing type definitions

**Solutions:**

1. **Rebuild type definitions:**

   ```bash
   pnpm nx run-many -t build:types
   ```

2. **Check TypeScript paths:**

   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "paths": {
         "@mimic/*": ["packages/*/src"]
       }
     }
   }
   ```

3. **Verify package exports:**
   ```json
   // package.json
   {
     "types": "dist/index.d.ts",
     "main": "dist/index.js"
   }
   ```

### Circular Dependency Errors

**Symptoms:**

- Import/export circular dependency warnings
- Runtime errors about undefined exports

**Solutions:**

1. **Analyze dependency graph:**

   ```bash
   pnpm nx graph
   ```

2. **Check import patterns:**

   ```bash
   # Look for circular imports
   madge --circular packages/*/src
   ```

3. **Refactor problematic imports:**
   - Move shared types to separate files
   - Use dependency injection
   - Create interface files

## macOS Specific Issues

### Apple File System Artifacts

**Symptoms:**

- `.DS_Store` files appearing everywhere
- `._*` hidden files in git

**Solutions:**

1. **Run Apple cleaner:**

   ```bash
   # Use built-in cleaner
   pnpm clean:apple

   # Or run manually
   node tools/apple-cleaner.js
   ```

2. **Check gitignore:**

   ```bash
   # Verify Apple patterns are ignored
   grep -A 10 "Apple" .gitignore
   ```

3. **Configure Git globally:**
   ```bash
   echo ".DS_Store" >> ~/.gitignore_global
   git config --global core.excludesfile ~/.gitignore_global
   ```

### Permission Issues

**Symptoms:**

- Permission denied errors
- Cannot write to directories

**Solutions:**

1. **Fix ownership:**

   ```bash
   sudo chown -R $(whoami) /path/to/project
   ```

2. **Reset npm permissions:**

   ```bash
   sudo chown -R $(whoami) ~/.npm
   ```

3. **Use local npm prefix:**
   ```bash
   npm config set prefix ~/.npm-global
   export PATH=~/.npm-global/bin:$PATH
   ```

## Getting Help

### Enable Debug Mode

```bash
# Enable verbose logging
DEBUG=* pnpm dev

# Nx debug mode
NX_VERBOSE_LOGGING=true pnpm nx affected -t build

# Style Dictionary debug
DEBUG=style-dictionary pnpm nx run design-tokens:build
```

### Collect System Information

```bash
# System info script
echo "Node.js: $(node --version)"
echo "pnpm: $(pnpm --version)"
echo "OS: $(uname -a)"
echo "Nx: $(pnpm nx --version)"
echo "Git: $(git --version)"

# Package info
pnpm ls --depth=0
```

### Common Log Locations

```bash
# Nx logs
cat /tmp/nx-*.log

# npm logs
npm config get cache
ls ~/.npm/_logs/

# System logs (macOS)
tail -f /var/log/system.log
```

### Community Support

- **GitHub Issues**: [Report bugs](https://github.com/IAmJonoBo/mimic/issues)
- **Discussions**: [Ask questions](https://github.com/IAmJonoBo/mimic/discussions)
- **Documentation**: [Read the docs](https://github.com/IAmJonoBo/mimic/blob/main/README.md)

### Emergency Reset

If all else fails, here's the nuclear option:

```bash
# Complete workspace reset
git clean -fdx
rm -rf node_modules
rm -rf packages/*/node_modules
rm -rf packages/*/dist
rm -rf .nx
rm pnpm-lock.yaml

# Reinstall everything
pnpm install
pnpm build
```

Remember to commit your changes before running the emergency reset!
