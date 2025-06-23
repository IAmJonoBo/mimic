#!/usr/bin/env node
/* eslint-disable no-console */
/* global console */

import { execSync } from 'node:child_process';
import process from 'node:process';

const tasks = {
  '🏗️ build': {
    command: 'pnpm nx run-many -t build',
    description: 'Build all packages',
  },
  '🧪 test': {
    command: 'pnpm nx run-many -t test',
    description: 'Run all tests',
  },
  '🔍 lint': {
    command: 'pnpm nx run-many -t lint',
    description: 'Lint all packages',
  },
  '📚 storybook': {
    command: 'pnpm storybook',
    description: 'Start Storybook development server',
  },
  '🎨 tokens': {
    command: 'pnpm tokens:watch',
    description: 'Watch and build design tokens',
  },
  '🧹 clean': {
    command: 'pnpm clean:all',
    description: 'Clean workspace and Apple junk',
  },
  '📊 graph': {
    command: 'pnpm graph',
    description: 'Show dependency graph',
  },
  '⚡ affected': {
    command: 'pnpm nx affected:build',
    description: 'Build only affected projects',
  },
  '🔧 setup': {
    command: './scripts/setup-dx.sh',
    description: 'Setup modern DX tools',
  },
};

function showMenu() {
  console.log('\n🎨 Mimic Development Task Runner\n');
  Object.entries(tasks).forEach(([key, { description }]) => {
    console.log(`${key.padEnd(15)} ${description}`);
  });
  console.log('\n');
}

function runTask(taskKey) {
  const task = tasks[taskKey];
  if (!task) {
    console.error(`❌ Task "${taskKey}" not found`);
    process.exit(1);
  }

  console.log(`🚀 Running: ${task.description}`);
  console.log(`📝 Command: ${task.command}\n`);

  try {
    execSync(task.command, { stdio: 'inherit', cwd: process.cwd() });
    console.log(`\n✅ Task "${taskKey}" completed successfully!`);
  } catch (error) {
    console.error(
      `\n❌ Task "${taskKey}" failed with exit code ${error.status}`
    );
    process.exit(error.status || 1);
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  showMenu();
  process.exit(0);
}

const taskKey = args[0];
runTask(taskKey);
