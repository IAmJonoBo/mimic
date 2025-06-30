#!/bin/bash
# Post-build chain script: Runs Apple cleaner after any build or export
# Usage: ./scripts/postbuild-chain.sh [target-directory]

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TARGET_DIR="${1:-.}"

echo "🔗 [Post-Build Chain] Starting cleanup for: $TARGET_DIR"

# Run Apple cleaner on target directory
echo "🧹 [Post-Build Chain] Cleaning Apple junk..."
node "$PROJECT_ROOT/tools/apple-cleaner.js" "$TARGET_DIR"

# Optional: Run additional cleanup tasks
if [ "$2" = "--with-deps" ]; then
  echo "📦 [Post-Build Chain] Cleaning node_modules Apple junk..."
  find "$TARGET_DIR" -name "node_modules" -type d -exec node "$PROJECT_ROOT/tools/apple-cleaner.js" {} \; 2>/dev/null || true
fi

# Optional: Validate build output
if [ "$2" = "--validate" ] || [ "$3" = "--validate" ]; then
  echo "✅ [Post-Build Chain] Validating build output..."

  # Check for remaining Apple junk
  APPLE_FILES=$(find "$TARGET_DIR" -name "._*" -o -name ".DS_Store" 2>/dev/null | wc -l)
  if [ "$APPLE_FILES" -gt 0 ]; then
    echo "⚠️ [Post-Build Chain] Found $APPLE_FILES remaining Apple files"
    find "$TARGET_DIR" -name "._*" -o -name ".DS_Store" 2>/dev/null | head -5
  else
    echo "✅ [Post-Build Chain] No Apple junk detected"
  fi
fi

echo "🎉 [Post-Build Chain] Cleanup complete!"
