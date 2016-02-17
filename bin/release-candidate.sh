#!/bin/bash

# begin git work to prepare for a build/test/release
# Usage: release-candidate.sh <patch|minor|major>"

cd "$(dirname "$0")/.."
source ./bin/lib/strict_mode.sh
echo "Creating a new release candidate"
git checkout develop
git pull origin develop
npm version "${1-patch}"
version=$(config3 appVersion)
cat <<-EOF
Ready
Next steps are:
./bin/build.sh v${version}
deploy to stage
test on stage
./bin/release.sh
deploy to prod
EOF
