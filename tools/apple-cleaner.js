#!/usr/bin/env node
/* eslint-disable no-console */
/* global console */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const DEFAULT_MODE = 'full';
const SUPPORTED_MODES = new Set(['full', 'staged', 'check']);
const APPLE_METADATA_PATTERNS = [
  /(^|\/)\.DS_Store$/,
  /(^|\/)\._[^/]+$/,
  /(^|\/)\.Spotlight-V100(\/|$)/,
  /(^|\/)\.fseventsd(\/|$)/,
  /(^|\/)\.Trashes(\/|$)/,
  /(^|\/)\.TemporaryItems(\/|$)/,
  /(^|\/)Thumbs\.db$/i,
  /(^|\/)~[^/]*$/,
  /\.xcuserdata[^/]*$/,
  /(^|\/)xcuserdata(\/|$)/,
  /\.crash(log)?$/,
  /\.tmp$/,
];

const CLEANING_COMMANDS = [
  {
    desc: 'Removing .DS_Store files',
    build: (root) => `find ${quotePath(root)} -name '.DS_Store' -type f -delete`,
  },
  {
    desc: 'Removing AppleDouble files',
    build: (root) => `find ${quotePath(root)} -name '._*' -type f -delete`,
  },
  {
    desc: 'Removing Spotlight metadata',
    build: (root) => `find ${quotePath(root)} -name '.Spotlight-V100' -type d -exec rm -rf {} +`,
  },
  {
    desc: 'Removing FSEvents metadata',
    build: (root) => `find ${quotePath(root)} -name '.fseventsd' -type d -exec rm -rf {} +`,
  },
  {
    desc: 'Removing Trash folders',
    build: (root) => `find ${quotePath(root)} -name '.Trashes' -type d -exec rm -rf {} +`,
  },
  {
    desc: 'Removing temporary items',
    build: (root) => `find ${quotePath(root)} -name '.TemporaryItems' -type d -exec rm -rf {} +`,
  },
  {
    desc: 'Removing Windows thumbnails',
    build: (root) => `find ${quotePath(root)} -name 'Thumbs.db' -type f -delete`,
  },
  {
    desc: 'Removing Xcode user data',
    build: (root) => `find ${quotePath(root)} -name '*.xcuserdata*' -type d -exec rm -rf {} +`,
  },
  {
    desc: 'Removing Xcode user data directories',
    build: (root) => `find ${quotePath(root)} -name 'xcuserdata' -type d -exec rm -rf {} +`,
  },
  {
    desc: 'Removing crash logs',
    build: (root) => `find ${quotePath(root)} -name '*.crash' -type f -delete`,
  },
  {
    desc: 'Removing crash log files',
    build: (root) => `find ${quotePath(root)} -name '*.crashlog' -type f -delete`,
  },
  {
    desc: 'Removing temporary files',
    build: (root) => `find ${quotePath(root)} -name '*.tmp' -type f -delete`,
  },
  {
    desc: 'Removing backup files',
    build: (root) => `find ${quotePath(root)} -name '~*' -type f -delete`,
  },
];

function log(message) {
  console.log(`🧹 [Apple Cleaner] ${message}`);
}

function safeExec(command, description) {
  try {
    execSync(command, { stdio: 'pipe' });
    log(`✅ ${description}`);
  } catch {
    log(`⚠️ ${description} - nothing to remove or command failed safely`);
  }
}

function escapeShellPath(value) {
  return value.replace(/(["$`\\])/g, '\\$1');
}

function quotePath(value) {
  return `"${escapeShellPath(value)}"`;
}

function normalizeRoots(projectRoots) {
  const candidates = Array.isArray(projectRoots) ? projectRoots : [projectRoots];
  const normalized = new Set();

  candidates
    .map((candidate) => {
      const trimmed = candidate?.trim();
      if (trimmed) {
        return trimmed;
      }
      return '.';
    })
    .forEach((candidate) => {
      const sanitized = candidate === '.' ? '.' : candidate.replace(/\/$/, '');
      if (!sanitized) {
        return;
      }
      if (sanitized === '.' || fs.existsSync(sanitized)) {
        normalized.add(sanitized);
      }
    });

  if (normalized.size === 0) {
    return ['.'];
  }

  if (normalized.has('.')) {
    return ['.'];
  }

  return Array.from(normalized);
}

function cleanAppleJunk(projectRoots = ['.']) {
  const roots = normalizeRoots(projectRoots);

  log(
    roots.length === 1 && roots[0] === '.'
      ? 'Starting comprehensive Apple junk cleanup in the workspace root...'
      : `Starting Apple junk cleanup for ${roots.length} paths...`
  );

  roots.forEach((root) => {
    const label = root === '.' ? 'workspace root' : root;
    CLEANING_COMMANDS.forEach(({ desc, build }) => {
      safeExec(build(root), `${desc} in ${label}`);
    });
  });

  log('🎉 Apple junk cleanup completed!');
}

function fileMatchesApplePattern(filePath) {
  return APPLE_METADATA_PATTERNS.some((pattern) => pattern.test(filePath));
}

function checkTrackedAppleMetadata(projectRoots = ['.']) {
  let output = '';
  try {
    output = execSync('git ls-files -z', { encoding: 'utf8' });
  } catch {
    log('⚠️ Unable to inspect tracked files (is this a git repository?)');
    return;
  }

  const files = output.split('\0').filter(Boolean);
  const roots = normalizeRoots(projectRoots);
  const offenders = files
    .filter((file) => (roots.includes('.') ? true : roots.some((root) => file.startsWith(`${root}/`) || file === root)))
    .filter(fileMatchesApplePattern);

  if (offenders.length > 0) {
    log('❌ Tracked Apple metadata files detected:');
    offenders.slice(0, 20).forEach((file) => {
      log(`   • ${file}`);
    });
    if (offenders.length > 20) {
      log(`   • ...and ${offenders.length - 20} more`);
    }
    log('Please remove these files from version control (git rm --cached <path>) and re-run the cleaner.');
    process.exitCode = 1;
  } else {
    log('✅ No tracked Apple metadata files found');
  }
}

function stagedRootsWithin(explicitRoots) {
  try {
    const stagedOutput = execSync('git diff --cached --name-only -z', {
      encoding: 'utf8',
    });
    const stagedFiles = stagedOutput.split('\0').filter(Boolean);
    if (stagedFiles.length === 0) {
      return [];
    }

    const directories = new Set();
    stagedFiles.forEach((file) => {
      const dir = path.dirname(file);
      const normalizedDir = dir === '.' ? '.' : dir;
      if (
        !explicitRoots.length ||
        explicitRoots.includes('.') ||
        explicitRoots.some((root) => normalizedDir === root || normalizedDir.startsWith(`${root}/`))
      ) {
        directories.add(normalizedDir);
      }
    });

    const roots = Array.from(directories).filter((dir) => dir === '.' || fs.existsSync(dir));
    if (roots.includes('.')) {
      return ['.'];
    }

    return roots;
  } catch {
    log('⚠️ Unable to determine staged files - falling back to workspace root');
    return explicitRoots.length ? explicitRoots : ['.'];
  }
}

function resolveModeValue(rawValue) {
  if (rawValue && SUPPORTED_MODES.has(rawValue)) {
    return rawValue;
  }

  const display = rawValue ?? '<missing>';
  log(`⚠️ Unsupported mode '${display}', defaulting to ${DEFAULT_MODE}`);
  return DEFAULT_MODE;
}

function parseCliArgs(argv) {
  const roots = [];
  let mode = DEFAULT_MODE;
  let index = 0;

  while (index < argv.length) {
    const arg = argv[index];

    if (!arg.startsWith('-')) {
      roots.push(arg);
      index += 1;
      continue;
    }

    switch (arg) {
      case '--staged':
        mode = 'staged';
        index += 1;
        break;
      case '--check':
        mode = 'check';
        index += 1;
        break;
      case '--mode': {
        const value = argv[index + 1];
        mode = resolveModeValue(value);
        index += value ? 2 : 1;
        break;
      }
      default: {
        if (arg.startsWith('--mode=')) {
          const value = arg.slice('--mode='.length);
          mode = resolveModeValue(value);
        } else {
          log(`⚠️ Unknown flag '${arg}' will be ignored`);
        }
        index += 1;
      }
    }
  }

  return { mode, roots };
}

function main() {
  const { mode, roots } = parseCliArgs(process.argv.slice(2));

  if (mode === 'check') {
    checkTrackedAppleMetadata(roots.length ? roots : ['.']);
    return;
  }

  if (mode === 'staged') {
    const explicitRoots = normalizeRoots(roots.length ? roots : ['.']);
    const stagedRoots = stagedRootsWithin(explicitRoots);
    if (stagedRoots.length === 0) {
      log('No staged files detected - skipping cleanup.');
      return;
    }
    cleanAppleJunk(stagedRoots);
    return;
  }

  cleanAppleJunk(roots.length ? roots : ['.']);
}

if (process.argv[1]?.endsWith('apple-cleaner.js')) {
  main();
}

export { cleanAppleJunk, checkTrackedAppleMetadata };
