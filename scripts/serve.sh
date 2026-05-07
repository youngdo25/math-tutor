#!/bin/bash
# Production serve script for math-tutor (used by the LaunchAgent).
# Binds 0.0.0.0 so devices on the same network can reach it.
set -euo pipefail

cd "$(dirname "$0")/.."

export NODE_ENV=production
export PORT="${PORT:-3000}"
export HOSTNAME="${HOSTNAME:-0.0.0.0}"

if [[ ! -d .next ]]; then
  echo "[$(date)] No .next build found; running 'npm run build' first..." >&2
  npm run build
fi

echo "[$(date)] Starting math-tutor on ${HOSTNAME}:${PORT}"
exec npm run start -- --hostname "$HOSTNAME" --port "$PORT"
