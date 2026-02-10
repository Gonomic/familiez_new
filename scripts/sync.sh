#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
branch=$(git rev-parse --abbrev-ref HEAD)
# fetch and rebase to keep local branch in sync with remote
git fetch origin --prune
git pull --rebase origin "$branch"
# if there are local commits, push them
if ! git diff --quiet --; then
  git add -A
  git commit -m "Local sync: update" || true
  git push origin "$branch"
fi
