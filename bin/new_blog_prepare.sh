#!/bin/bash
# Usage: new_blog_prepare.sh

# Programmatically manipulating a git repository is rife with edge cases.
# Handling all the race conditions and edge cases would be very complex.
# For reference, see
# - https://github.com/ahoward/ro/blob/master/lib/ro/git.rb
# - https://github.com/pauldowman/gitmodel
#
# This code makes several simplifying assumptions
# - only 1 person will attempt to publish a new blog post at a time
#   - This time window is probably 10s or less, often 2s or less
# - The remote repo does not undergo radical changes that make changes
#   impossible to apply

set -o errexit    # always exit on error
set -o errtrace   # trap errors in functions as well
set -o pipefail   # don't ignore exit codes when piping output
set -o posix      # more strict failures in subshells
# set -x          # enable debugging

IFS="$(printf "\n\t")"
cd "$(dirname "$0")/../../data"
# Sadly cannot use RFC 3339 timestamp as git branch names disallow :
stamp="$(date -u +%Y-%m-%dT%H-%M-%SZ)"
branch="blog-post-${stamp}"

# The goal here is to reliably get the latest code from origin
# and checkout a new branch for our new blog post

# This gets all the latest code into the local filesystem
git fetch origin

# Make sure the working directory does not have untracked changes
status=$(git status --porcelain)
if [[ -n "${status}" ]]; then
  # Uncommitted changes
  echo "Repo at $(pwd) has uncommitted changes. Aborting." 1>&2
  git status
  exit 10
fi

# Checkout the master branch, forcibly destroying any uncommited working dir
# files
git checkout --force master

# get us to the most recent origin commit
git reset --hard origin/master

# make a new branch where we can add our new files
git checkout -b "${branch}" origin/master
echo "New blog branch ready: ${branch}"
