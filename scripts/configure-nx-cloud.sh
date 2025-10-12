#!/usr/bin/env bash
set -euo pipefail

# This helper normalises Nx Cloud environment flags so workflows can
# gracefully fall back to local-only execution when no access token is
# available. When running under GitHub Actions the script appends the
# necessary exports to $GITHUB_ENV so subsequent steps inherit the
# configuration.

NX_TOKEN="${NX_CLOUD_ACCESS_TOKEN:-}"
HAS_GITHUB_ENV="${GITHUB_ENV:-}"

if [[ -n "${NX_TOKEN}" ]]; then
  echo "⚡ Nx Cloud access token detected; remote caching remains enabled."
else
  echo "ℹ️ Nx Cloud access token not provided. Disabling remote features."
  if [[ -n "${HAS_GITHUB_ENV}" ]]; then
    {
      echo "NX_NO_CLOUD=true"
      echo "NX_CLOUD_AGENT_DISABLED=true"
      echo "NX_CLOUD_DISTRIBUTED_EXECUTION=false"
    } >> "${GITHUB_ENV}"
  else
    export NX_NO_CLOUD=true
    export NX_CLOUD_AGENT_DISABLED=true
    export NX_CLOUD_DISTRIBUTED_EXECUTION=false
  fi
fi
