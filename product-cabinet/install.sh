#!/usr/bin/env bash
#
# Install Product Cabinet skills for GitHub Copilot.
#
# Usage:
#   ./install.sh [--force] [skill ...]
#
# With no skill names, installs every Product Cabinet skill. Name one or more
# skills to install only those skills.
#
# Options:
#   --force              Overwrite existing installed copies
#   -h, --help           Show this help
#
# Environment:
#   COPILOT_SKILLS_DIR   Override the target skills directory
#                        (default: ~/.copilot/skills)
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_SOURCE="$SCRIPT_DIR/skills"
SKILLS_DIR="${COPILOT_SKILLS_DIR:-$HOME/.copilot/skills}"

case "$SKILLS_DIR" in
  ""|"/"|"$HOME")
    echo "Refusing unsafe skills directory: '$SKILLS_DIR'." >&2
    exit 2
    ;;
esac

ALL_SKILLS=()
for directory in "$SKILLS_SOURCE"/*/; do
  [ -f "${directory}SKILL.md" ] && ALL_SKILLS+=("$(basename "$directory")")
done

FORCE=0
REQUESTED=()
for argument in "$@"; do
  case "$argument" in
    --force) FORCE=1 ;;
    -h|--help)
      sed -n '2,/^set -euo pipefail$/s/^# \{0,1\}//p' "$0"
      exit 0
      ;;
    -*)
      echo "Unknown option: $argument" >&2
      exit 2
      ;;
    *) REQUESTED+=("$argument") ;;
  esac
done

if [ "${#REQUESTED[@]}" -eq 0 ]; then
  REQUESTED=("${ALL_SKILLS[@]}")
fi

for skill in "${REQUESTED[@]}"; do
  case "$skill" in
    ""|"."|".."|*/*|*\\*)
      echo "Invalid skill name: '$skill'." >&2
      exit 2
      ;;
  esac

  if [ ! -f "$SKILLS_SOURCE/$skill/SKILL.md" ]; then
    echo "Unknown Product Cabinet skill: '$skill'." >&2
    exit 2
  fi
done

mkdir -p "$SKILLS_DIR"

installed=0
for skill in "${REQUESTED[@]}"; do
  source_path="$SKILLS_SOURCE/$skill"
  destination="$SKILLS_DIR/$skill"

  if [ -e "$destination" ] && [ "$FORCE" -ne 1 ]; then
    echo "Skip '$skill': $destination already exists. Re-run with --force to overwrite." >&2
    continue
  fi

  if [ -e "$destination" ]; then
    rm -rf -- "$destination"
  fi

  cp -R "$source_path" "$destination"
  echo "Installed '$skill' to $destination"
  installed=$((installed + 1))
done

if [ "$installed" -gt 0 ]; then
  echo "Restart Copilot CLI or reload your agent host to load the installed skills."
fi
