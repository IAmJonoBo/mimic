#!/usr/bin/env node

/* eslint-disable no-console */

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import chokidar from 'chokidar';

import { cleanAppleJunk } from './apple-cleaner.js';

const WATCH_PATTERNS = [
  '**/.DS_Store',
  '**/.DS_Store?',
  '**/._*',
  '**/.Spotlight-V100',
  '**/.Spotlight-V100/**',
  '**/.fseventsd',
  '**/.fseventsd/**',
  '**/.Trashes',
  '**/.Trashes/**',
  '**/.TemporaryItems',
  '**/.TemporaryItems/**',
  '**/Thumbs.db',
  '**/~*',
  '**/*.xcuserdata*',
  '**/xcuserdata',
  '**/xcuserdata/**',
  '**/*.crash',
  '**/*.crashlog',
  '**/*.tmp',
  '**/.AppleDouble',
  '**/.AppleDB',
  '**/.AppleDesktop',
  '**/.DocumentRevisions-V100',
  '**/.VolumeIcon.icns',
  '**/.com.apple.timemachine.donotpresent',
];

const IGNORED_DIRECTORIES = [
  '**/node_modules/**',
  '**/.git/**',
  '**/.husky/**',
  '**/.nx/**',
  '**/.next/**',
  '**/.nuxt/**',
  '**/.vercel/**',
  '**/.expo/**',
  '**/dist/**',
  '**/build/**',
  '**/tmp/**',
];

const LOG_PREFIX = '🧹 [Apple Cleaner Watch]';

function parseOptions(argv) {
  const options = {
    roots: [],
    initialClean: true,
  };

  argv.forEach((arg) => {
    if (arg === '--no-initial') {
      options.initialClean = false;
      return;
    }

    if (arg.startsWith('-')) {
      log(`Unknown flag '${arg}' ignored`);
      return;
    }

    options.roots.push(arg);
  });

  if (options.roots.length === 0) {
    options.roots = ['.'];
  }

  return options;
}

function log(message) {
  console.log(`${LOG_PREFIX} ${message}`);
}

function formatPath(targetPath) {
  return path.relative(process.cwd(), targetPath) || '.';
}

async function removeTarget(targetPath, isDir) {
  try {
    await fs.rm(targetPath, { force: true, recursive: isDir });
    log(`Removed ${isDir ? 'directory' : 'file'}: ${formatPath(targetPath)}`);
  } catch (error) {
    log(`Unable to remove ${formatPath(targetPath)} (${error.message})`);
  }
}

function buildGlobs(roots) {
  if (!roots?.length) {
    return WATCH_PATTERNS;
  }

  return roots.flatMap((root) => {
    const normalized = root.replace(/\\/g, '/').replace(/\/$/, '') || '.';
    if (normalized === '.' || normalized === '') {
      return WATCH_PATTERNS;
    }

    return WATCH_PATTERNS.map((pattern) => `${normalized}/${pattern.replace(/^[./]*/, '')}`);
  });
}

function watchForAppleArtifacts(roots) {
  const watcher = chokidar.watch(buildGlobs(roots), {
    ignored: IGNORED_DIRECTORIES,
    ignoreInitial: true,
    persistent: true,
    awaitWriteFinish: {
      stabilityThreshold: 150,
      pollInterval: 100,
    },
  });

  watcher
    .on('add', (filePath) => removeTarget(filePath, false))
    .on('change', (filePath) => removeTarget(filePath, false))
    .on('addDir', (dirPath) => removeTarget(dirPath, true))
    .on('ready', () => log('Watcher ready. Monitoring for Apple metadata...'));

  const shutdown = () => {
    log('Shutting down watcher...');
    watcher.close().finally(() => process.exit(0));
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

async function main() {
  const { roots, initialClean } = parseOptions(process.argv.slice(2));

  if (initialClean) {
    log('Performing initial cleanup...');
    cleanAppleJunk(roots);
  } else {
    log('Skipping initial cleanup (--no-initial)');
  }

  log(`Starting realtime watcher for ${roots.join(', ')}`);
  watchForAppleArtifacts(roots);
}

main().catch((error) => {
  console.error(`${LOG_PREFIX} Unexpected error`, error);
  process.exit(1);
});
