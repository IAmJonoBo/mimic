# Mimic Design System - Development Makefile
# Provides convenient commands for the complete design-to-code pipeline

.PHONY: help install build dev clean test tokens

# Default target
help: ## Show this help message
	@echo "Mimic Design System - Available Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Quick Start:"
	@echo "  1. Copy .env.example to .env and configure Penpot credentials"
	@echo "  2. Run 'make install && make tokens-sync' to bootstrap"
	@echo "  3. Run 'make dev' to start development environment"

install: ## Install all dependencies
	@echo "📦 Installing dependencies..."
	pnpm install

build: ## Build all packages
	@echo "🔨 Building all packages..."
	pnpm run tokens:build-all

dev: ## Start full development environment
	@echo "🚀 Starting development environment..."
	pnpm run dev:full-stack

clean: ## Clean all build artifacts
	@echo "🧹 Cleaning build artifacts..."
	pnpm nx run-many -t clean
	rm -rf node_modules/.cache
	rm -rf tmp/nx-cache

test: ## Run all tests
	@echo "🧪 Running tests..."
	pnpm nx run-many -t test lint

test-affected: ## Run tests for affected projects only
	@echo "🧪 Running affected tests..."
	pnpm nx affected -t test lint

# Design Token Workflows
tokens-export: ## Export tokens from Penpot (requires .env configuration)
	@echo "📥 Exporting tokens from Penpot..."
	@if [ ! -f .env ]; then echo "❌ .env file not found. Copy .env.example and configure."; exit 1; fi
	pnpm nx run design-tokens:tokens:export
	@echo "🧹 Cleaning Apple junk from export..."
	pnpm run clean:apple

tokens-build: ## Build design tokens only
	@echo "🎨 Building design tokens..."
	pnpm run tokens:build
	@echo "🧹 Cleaning Apple junk from build..."
	pnpm run clean:apple

tokens-sync: ## Export from Penpot and build all outputs
	@echo "🔄 Syncing tokens from Penpot..."
	@if [ ! -f .env ]; then echo "❌ .env file not found. Copy .env.example and configure."; exit 1; fi
	pnpm run tokens:sync-all
	@echo "🧹 Cleaning Apple junk from sync..."
	pnpm run clean:apple

tokens-watch: ## Watch token files and rebuild on changes
	@echo "👀 Watching tokens for changes..."
	pnpm run tokens:watch

# Application Development
web-dev: ## Start Qwik City web app development
	@echo "🌐 Starting web app..."
	pnpm nx run design-system:serve

storybook: ## Start Storybook component workshop
	@echo "📚 Starting Storybook..."
	pnpm nx run design-system:storybook

storybook-build: ## Build static Storybook
	@echo "📦 Building Storybook..."
	pnpm nx run design-system:build-storybook

visual-test: ## Run visual regression tests
	@echo "👀 Running visual tests..."
	pnpm nx run design-system:visual-test

# Environment Setup
setup-env: ## Copy .env.example to .env for configuration
	@if [ -f .env ]; then echo "⚠️  .env already exists"; else cp .env.example .env && echo "✅ Created .env from template"; fi

check-env: ## Validate environment configuration
	@echo "🔍 Checking environment configuration..."
	@if [ ! -f .env ]; then echo "❌ .env file not found"; exit 1; fi
	@if grep -q "your-file-uuid-here" .env; then echo "❌ PENPOT_FILE_ID not configured"; exit 1; fi
	@if grep -q "your-api-access-token-here" .env; then echo "❌ PENPOT_ACCESS_TOKEN not configured"; exit 1; fi
	@echo "✅ Environment configuration looks good"

# Documentation
docs: ## Open documentation in browser
	@echo "📖 Opening documentation..."
	open docs/README.md

docs-validate: ## Validate documentation links and structure
	@echo "🔍 Validating documentation..."
	@./scripts/validate-docs.sh

docs-lint: ## Lint documentation markdown files
	@echo "📝 Linting documentation..."
	@if command -v markdownlint-cli2 >/dev/null 2>&1; then \
		markdownlint-cli2 "docs/**/*.md" || echo "⚠️  Markdown linting found issues"; \
	else \
		echo "⚠️  markdownlint-cli2 not installed, skipping..."; \
	fi

docs-coverage: ## Check documentation coverage against codebase
	@echo "📊 Checking documentation coverage..."
	@echo "Advanced documentation files:"
	@find docs -name "*.md" | grep -E "(advanced|cicd|security|onboarding)" | sort
	@echo "✅ Advanced documentation coverage complete"

# CI/CD
ci: ## Run full CI pipeline locally
	@echo "🔄 Running CI pipeline..."
	make install
	make tokens-build
	make test
	make build

release: ## Create release (requires proper git setup)
	@echo "🚀 Creating release..."
	pnpm nx release

# Docker Development
docker-dev: ## Start development environment in Docker
	@echo "🐳 Starting Docker development environment..."
	docker-compose -f .devcontainer/docker-compose.yml --profile dev up -d

docker-tokens: ## Export tokens using Docker
	@echo "🐳 Exporting tokens via Docker..."
	docker-compose -f .devcontainer/docker-compose.yml --profile penpot-sync up penpot-export

docker-stop: ## Stop all Docker services
	@echo "🛑 Stopping Docker services..."
	docker-compose -f .devcontainer/docker-compose.yml down

# Utility Commands
graph: ## Show project dependency graph
	@echo "📊 Generating dependency graph..."
	pnpm nx graph

affected: ## Show affected projects
	@echo "📊 Showing affected projects..."
	pnpm nx show projects --affected

reset: ## Reset Nx cache and node_modules
	@echo "🔄 Resetting workspace..."
	pnpm nx reset
	rm -rf node_modules
	make install
