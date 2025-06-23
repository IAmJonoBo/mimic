#!/bin/bash

# Mimic Repository Setup Script
echo "🎨 Setting up Mimic monorepo..."

# Check if pnpm is installed
if ! command -v pnpm &>/dev/null; then
	echo "❌ pnpm not found. Installing pnpm..."
	npm install -g pnpm@9.0.0
fi

# Check if Nx CLI is installed
if ! command -v nx &>/dev/null; then
	echo "📦 Installing Nx CLI..."
	pnpm add -g @nx/cli@latest
fi

echo "📥 Installing dependencies..."
pnpm install

echo "🏗️  Building design tokens..."
pnpm nx run design-tokens:tokens:build

echo "🧪 Running initial tests..."
pnpm nx run-many -t test --parallel=3

echo "📚 Setting up Git hooks..."
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
npx husky add .husky/commit-msg 'npx commitlint --edit $1'

echo "🔧 Setting up Ollama (if available)..."
if command -v ollama &>/dev/null; then
	ollama pull llama3:8b &
	echo "🤖 Llama 3 8B model download started in background"
else
	echo "ℹ️  Ollama not found. Install from https://ollama.ai for AI features"
fi

echo "✅ Setup complete!"
echo ""
echo "🚀 Quick start commands:"
echo "  pnpm dev                    # Start all development servers"
echo "  pnpm build                  # Build all packages"
echo "  pnpm test                   # Run all tests"
echo "  pnpm nx run design-system:storybook  # Start Storybook"
echo ""
echo "📖 Open Penpot at http://localhost:9001 (if using Dev Container)"
echo "🎨 Design tokens will auto-sync from Penpot exports"
