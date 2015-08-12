#!/bin/bash
# Usage: push_posts_to_github.sh <token>
set -e
cd $(dirname "$0")/../../data
git config --local "user.email" "pete@peterlyons.com"
git config --local "user.name" "Peter Lyons"
git add posts
git commit -m "new blog post from web UI $(date)"
git push "https://${1}:x-oauth-basic@github.com/focusaurus/data.git" master
