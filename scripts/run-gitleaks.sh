#!/usr/bin/env bash
set -euo pipefail

VERSION="${GITLEAKS_VERSION:-8.28.0}"
case "$(uname -s)" in
  Linux*) OS="linux" ;;
  Darwin*) OS="darwin" ;;
  *)
    echo "Unsupported operating system: $(uname -s)" >&2
    exit 1
    ;;
esac

case "$(uname -m)" in
  x86_64|amd64) ARCH="x64" ;;
  arm64|aarch64) ARCH="arm64" ;;
  *)
    echo "Unsupported architecture: $(uname -m)" >&2
    exit 1
    ;;
esac
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
CACHE_ROOT="${XDG_CACHE_HOME:-$HOME/.cache}/mimic/gitleaks"
mkdir -p "$CACHE_ROOT"
BIN_PATH="$CACHE_ROOT/gitleaks"
VERSION_FILE="$CACHE_ROOT/.version"

if [[ ! -x "$BIN_PATH" ]] || [[ ! -f "$VERSION_FILE" ]] || [[ "$(cat "$VERSION_FILE")" != "$VERSION" ]]; then
  TARBALL="gitleaks_${VERSION}_${OS}_${ARCH}.tar.gz"
  URL="https://github.com/gitleaks/gitleaks/releases/download/v${VERSION}/${TARBALL}"
  TMPDIR="$(mktemp -d)"
  trap 'rm -rf "$TMPDIR"' EXIT
  echo "⬇️  Downloading gitleaks ${VERSION} (${OS}/${ARCH})" >&2
  curl -fsSL "$URL" -o "$TMPDIR/$TARBALL"
  tar -xzf "$TMPDIR/$TARBALL" -C "$TMPDIR"
  install -m 755 "$TMPDIR/gitleaks" "$BIN_PATH"
  echo "$VERSION" > "$VERSION_FILE"
fi

ARGS=("$@")
CONFIG_PATH="${GITLEAKS_CONFIG:-$REPO_ROOT/.gitleaks.toml}"
if [[ -f "$CONFIG_PATH" ]]; then
  ARGS=(--config "$CONFIG_PATH" "${ARGS[@]}")
fi

exec "$BIN_PATH" "${ARGS[@]}"
