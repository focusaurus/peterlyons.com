#!/bin/bash
# Usage: new-blog-finalize.sh <token>

# Programmatically manipulating a git repository is rife with edge cases.
# Handling all the race conditions and edge cases would be very complex.
# For reference, see
# - https://github.com/ahoward/ro/blob/master/lib/ro/git.rb
# - https://github.com/pauldowman/gitmodel
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
branch="$(git rev-parse --abbrev-ref HEAD)"

# If this is a fresh deployment, these are necessary so git can commit properly
git config --local "user.email" "pete@peterlyons.com"
git config --local "user.name" "Peter Lyons"

# add and commit the new blog post files
git add --all posts
git commit -m "new blog post from web UI ${branch}"

# dump a patch to /tmp as a fallback in case anything goes wrong
git format-patch master --stdout > "/tmp/${branch}.patch"

git checkout master
# this will be a fast forward merge, which is good
git merge "${branch}"
git push "https://${1}:x-oauth-basic@github.com/focusaurus/data.git" master
git branch -D "${branch}"
