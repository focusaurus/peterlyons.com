#!/bin/bash
cd "$(dirname "$0")/.."
source ./bin/lib/strict_mode.sh

# doc "* release_candidate: begin git work to prepare for a build/test/release
#   * (aliased as "rc")
#   * Usage: $(basename $0) release_candidate <patch|minor|major>"
echo "Creating a new release candidate"
git checkout develop
git pull origin develop
bump _package.json --"${1-patch}"
local version=$(config3 appVersion)
git add _package.json
git commit -m "bump version for ${version} release"
git tag "v${version}"
cat <<-EOF
Ready
Next steps are:
./bin/build.sh v${version}
deploy to stage
test on stage
./bin/release.sh
deploy to prod
EOF