#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const composePath = path.resolve(repoRoot, 'infra/containers/devcontainer/docker-compose.yml');

const args = process.argv.slice(2);
let outputFile;
for (let index = 0; index < args.length; index += 1) {
  if (args[index] === '--output') {
    outputFile = args[index + 1];
  }
}

const setOutput = (key, value) => {
  if (outputFile) {
    fs.appendFileSync(outputFile, `${key}=${value}\n`);
  } else {
    console.log(`${key}=${value}`);
  }
};

const composeContent = fs.readFileSync(composePath, 'utf8');

const extractVersion = (service) => {
  const pattern = new RegExp(`image: penpotapp/${service}:(\\d+\\.\\d+\\.\\d+)`);
  const match = composeContent.match(pattern);
  if (!match) {
    throw new Error(`Unable to find current version for ${service} in docker-compose.yml`);
  }
  return match[1];
};

const currentVersions = {
  backend: extractVersion('backend'),
  frontend: extractVersion('frontend'),
  exporter: extractVersion('exporter'),
};

const versionSet = new Set(Object.values(currentVersions));
if (versionSet.size !== 1) {
  console.warn(
    '⚠️ Penpot services are not aligned to a single version. Automation will use backend version as source of truth.'
  );
}
const currentVersion = currentVersions.backend;

const SEMVER_REGEX = /^(\d+)\.(\d+)\.(\d+)$/;
const compareSemver = (a, b) => {
  if (!SEMVER_REGEX.test(a) || !SEMVER_REGEX.test(b)) {
    throw new Error(`Invalid semver comparison between "${a}" and "${b}"`);
  }
  const [ma, mi, pa] = a.split('.').map(Number);
  const [mb, mj, pb] = b.split('.').map(Number);
  if (ma !== mb) return ma - mb;
  if (mi !== mj) return mi - mj;
  return pa - pb;
};

const fetchSemverTags = async (repo) => {
  let page = 1;
  const tags = new Set();
  const maxPages = 5; // Avoid hammering the API

  while (page <= maxPages) {
    const response = await fetch(
      `https://registry.hub.docker.com/v2/repositories/${repo}/tags?page_size=100&page=${page}&ordering=last_updated`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch tags for ${repo}: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    for (const result of data.results ?? []) {
      const name = result.name;
      if (SEMVER_REGEX.test(name)) {
        tags.add(name);
      }
    }
    if (!data.next) {
      break;
    }
    page += 1;
  }

  if (tags.size === 0) {
    throw new Error(`No semver tags found for ${repo}`);
  }
  return Array.from(tags);
};

const intersectVersions = (arrays) => {
  if (arrays.length === 0) return [];
  const [first, ...rest] = arrays;
  const baseSet = new Set(first);
  for (const value of baseSet) {
    if (!rest.every((arr) => arr.includes(value))) {
      baseSet.delete(value);
    }
  }
  return Array.from(baseSet);
};

const main = async () => {
  const repositories = ['penpotapp/backend', 'penpotapp/frontend', 'penpotapp/exporter'];
  const tagLists = await Promise.all(repositories.map((repo) => fetchSemverTags(repo)));
  const commonTags = intersectVersions(tagLists);

  if (commonTags.length === 0) {
    throw new Error('No common Penpot versions found across backend, frontend, and exporter images.');
  }

  const sorted = commonTags.sort(compareSemver);
  const latestVersion = sorted[sorted.length - 1];

  setOutput('current_version', currentVersion);
  setOutput('latest_version', latestVersion);

  if (compareSemver(latestVersion, currentVersion) <= 0) {
    console.log(`Penpot images already at latest version ${currentVersion}.`);
    setOutput('updated', 'false');
    return;
  }

  let updatedContent = composeContent;
  updatedContent = updatedContent.replace(/(image: penpotapp\/backend:)\d+\.\d+\.\d+/g, `$1${latestVersion}`);
  updatedContent = updatedContent.replace(/(image: penpotapp\/frontend:)\d+\.\d+\.\d+/g, `$1${latestVersion}`);
  updatedContent = updatedContent.replace(/(image: penpotapp\/exporter:)\d+\.\d+\.\d+/g, `$1${latestVersion}`);

  if (updatedContent === composeContent) {
    console.warn('No changes were made to docker-compose.yml even though a newer version was detected.');
    setOutput('updated', 'false');
    return;
  }

  fs.writeFileSync(composePath, `${updatedContent.trimEnd()}\n`, 'utf8');
  console.log(`Updated Penpot images from ${currentVersion} to ${latestVersion}.`);
  setOutput('updated', 'true');
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
