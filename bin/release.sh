#!/bin/bash

# git mechanics to finalize a release candidate to an official release

cd "$(dirname "$0")/.."
source ./bin/lib/strict-mode.sh

git checkout develop
git pull origin develop
./bin/test.sh
echo "Will merge develop to master and push to origin"
echo "CTRL-C now to abort. ENTER to proceed."
read DONTCARE
git checkout master
git merge develop
git push origin master --tags
git checkout develop #Not good form to leave master checked out
echo "Done. Miller Time."
