#!/bin/bash

# Safe Autofix Script
# Applies the same safe autofixes that run in CI

set -e

echo "🔧 Running safe autofixes..."

# Check if we're in a git repository
if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "❌ Error: Not in a git repository"
  exit 1
fi

# Check for uncommitted changes
uncommitted_changes=$(git status --porcelain || true)
if [[ -n ${uncommitted_changes} ]]; then
  echo "⚠️  Warning: You have uncommitted changes. Consider committing them first."
  read -p "Continue anyway? (y/N) " -n 1 -r
  echo
  if [[ ! ${REPLY} =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
  fi
fi

echo "📋 Starting autofix sequence..."

# 1. Format code with Biome
echo "  🎨 Formatting code..."
pnpm run format 2>/dev/null || echo "    ⚠️  Biome format had issues (continuing...)"

# 2. Fix CSS/SCSS issues
echo "  🧹 Fixing CSS/SCSS..."
pnpm run lint:css 2>/dev/null || echo "    ⚠️  Stylelint had issues (continuing...)"

# 3. Fix markdown issues
echo "  📝 Fixing markdown..."
pnpm run lint:md 2>/dev/null || echo "    ⚠️  Markdownlint had issues (continuing...)"

# 4. Fix markdown line lengths
echo "  📏 Fixing markdown line lengths..."
pnpm run lint:md:fix-line-length 2>/dev/null || echo "    ⚠️  Line length fixer had issues (continuing...)"

# 5. Clean temporary files
echo "  🗑️  Cleaning temporary files..."
pnpm run clean:temp 2>/dev/null || true
pnpm run clean:ds-store 2>/dev/null || true

# Check what changed
changed_files_count=$(git diff --name-only | wc -l || true)
changed_files_count=$(echo "${changed_files_count}" | tr -d ' ')

if [[ ${changed_files_count} -gt 0 ]]; then
  echo ""
  echo "✅ Autofix complete! Fixed ${changed_files_count} files:"
  echo ""
  git status --short
  echo ""
  echo "🔍 Review changes with: git diff"
  echo '📦 Commit changes with: git add . && git commit -m "🔧 autofix: Apply safe code quality fixes"'
  echo ""
else
  echo ""
  echo "✨ No changes needed! Your code is already perfectly formatted."
  echo ""
fi

echo "🎉 Safe autofix complete!"
