#!/bin/bash
# Usage: push_posts_to_github.sh <token>
set -e
cd $(dirname "$0")/../../data
git add posts
git commit -m "new blog post from web UI"
git push "https://${1}:x-oauth-basic@github.com/focusaurus/data.git" master
