#!/bin/bash

# Documentation Validation Script
# Validates that all advanced documentation is properly linked and discoverable

set -e

echo "🔍 Validating Mimic documentation structure..."

# Check if all advanced documentation files exist
ADVANCED_DOCS=(
  "docs/design/penpot-schema.md"
  "docs/build/style-dictionary.md"
  "docs/platforms/qwik.md"
  "docs/platforms/storybook.md"
  "docs/platforms/tauri.md"
  "docs/quality/token-governance.md"
  "docs/cicd/advanced-pipeline-automation.md"
  "docs/security/security-compliance-framework.md"
  "docs/testing/comprehensive-testing.md"
  "docs/development/advanced-workflows.md"
  "docs/onboarding/advanced-contributor-guide.md"
  "docs/mobile/rn-new-arch.md"
  "docs/ADVANCED_DOCUMENTATION_SUMMARY.md"
)

echo "📋 Checking advanced documentation files..."
missing_files=()

for doc in "${ADVANCED_DOCS[@]}"; do
  if [[ -f "$doc" ]]; then
    echo "✅ $doc"
  else
    echo "❌ $doc (missing)"
    missing_files+=("$doc")
  fi
done

if [[ ${#missing_files[@]} -gt 0 ]]; then
  echo ""
  echo "❌ Missing documentation files:"
  printf '   %s\n' "${missing_files[@]}"
  exit 1
fi

echo ""
echo "🔗 Checking documentation links in main README..."

# Check if main docs/README.md links to all advanced docs
MAIN_README="docs/README.md"
missing_links=()

for doc in "${ADVANCED_DOCS[@]}"; do
  # Extract filename for link checking
  filename=$(basename "$doc")
  if ! grep -q "$filename" "$MAIN_README"; then
    missing_links+=("$doc")
  fi
done

if [[ ${#missing_links[@]} -gt 0 ]]; then
  echo "⚠️  Some advanced docs may not be linked in main README:"
  printf '   %s\n' "${missing_links[@]}"
else
  echo "✅ All advanced docs appear to be linked"
fi

echo ""
echo "📦 Checking package README links..."

# Check if package READMEs link to relevant advanced docs
PACKAGE_READMES=(
  "packages/design-tokens/README.md"
  "packages/design-system/README.md"
  "packages/shared-utils/README.md"
)

for readme in "${PACKAGE_READMES[@]}"; do
  if [[ -f "$readme" ]]; then
    if grep -q "Advanced Documentation" "$readme"; then
      echo "✅ $readme has advanced documentation section"
    else
      echo "⚠️  $readme missing advanced documentation section"
    fi
  else
    echo "❌ $readme not found"
  fi
done

echo ""
echo "🎯 Checking for TODO items in documentation..."

# Check for remaining TODO items
todo_files=$(find docs -name "*.md" -exec grep -l "TODO\|FIXME\|XXX" {} \; 2>/dev/null || true)

if [[ -n "$todo_files" ]]; then
  echo "📝 Files with TODO items:"
  echo "$todo_files"
  echo ""
  echo "TODO items found:"
  find docs -name "*.md" -exec grep -n "TODO\|FIXME\|XXX" {} +
else
  echo "✅ No TODO items found in documentation"
fi

echo ""
echo "📊 Documentation statistics:"
echo "   Advanced docs: ${#ADVANCED_DOCS[@]}"
echo "   Total docs: $(find docs -name "*.md" | wc -l | tr -d ' ')"
echo "   Package READMEs: ${#PACKAGE_READMES[@]}"

echo ""
echo "✅ Documentation validation complete!"
echo ""
echo "🚀 Next steps to complete the documentation pipeline:"
echo "   1. Verify all links are functional with 'make docs-validate'"
echo "   2. Add documentation coverage enforcement to CI"
echo "   3. Set up automated doc generation for API changes"
echo "   4. Enable community contribution workflows"
