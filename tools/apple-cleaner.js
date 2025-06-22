#!/usr/bin/env node

const { execSync } = require('child_process');

function log(message) {
  console.log(`🧹 [Apple Cleaner] ${message}`);
}

function safeExec(command, description) {
  try {
    log(`${description}...`);
    execSync(command, { stdio: 'pipe' });
    log(`✅ ${description} completed`);
  } catch {
    log(`⚠️ ${description} - some files may not exist (this is normal)`);
  }
}

function cleanAppleJunk(projectRoot = '.') {
  log('Starting comprehensive Apple junk cleanup...');

  const commands = [
    {
      cmd: `find "${projectRoot}" -name '.DS_Store' -type f -delete`,
      desc: 'Removing .DS_Store files',
    },
    {
      cmd: `find "${projectRoot}" -name '._*' -type f -delete`,
      desc: 'Removing AppleDouble files',
    },
    {
      cmd: `find "${projectRoot}" -name '.Spotlight-V100' -type d -exec rm -rf {} +`,
      desc: 'Removing Spotlight metadata',
    },
    {
      cmd: `find "${projectRoot}" -name '.fseventsd' -type d -exec rm -rf {} +`,
      desc: 'Removing FSEvents metadata',
    },
    {
      cmd: `find "${projectRoot}" -name '.Trashes' -type d -exec rm -rf {} +`,
      desc: 'Removing Trash folders',
    },
    {
      cmd: `find "${projectRoot}" -name '.TemporaryItems' -type d -exec rm -rf {} +`,
      desc: 'Removing temporary items',
    },
    {
      cmd: `find "${projectRoot}" -name 'Thumbs.db' -type f -delete`,
      desc: 'Removing Windows thumbnails',
    },
    {
      cmd: `find "${projectRoot}" -name '*.xcuserdata*' -type d -exec rm -rf {} +`,
      desc: 'Removing Xcode user data',
    },
    {
      cmd: `find "${projectRoot}" -name 'xcuserdata' -type d -exec rm -rf {} +`,
      desc: 'Removing Xcode user data directories',
    },
    {
      cmd: `find "${projectRoot}" -name '*.crash' -type f -delete`,
      desc: 'Removing crash logs',
    },
    {
      cmd: `find "${projectRoot}" -name '*.crashlog' -type f -delete`,
      desc: 'Removing crash log files',
    },
    {
      cmd: `find "${projectRoot}" -name '*.tmp' -type f -delete`,
      desc: 'Removing temporary files',
    },
    {
      cmd: `find "${projectRoot}" -name '~*' -type f -delete`,
      desc: 'Removing backup files',
    },
  ];

  commands.forEach(({ cmd, desc }) => {
    safeExec(cmd, desc);
  });

  log('🎉 Apple junk cleanup completed!');
}

// CLI usage
if (require.main === module) {
  const projectRoot = process.argv[2] || '.';
  cleanAppleJunk(projectRoot);
}

module.exports = { cleanAppleJunk };
