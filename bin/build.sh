#!/bin/bash

# create a build archive of the app for deployment
# Usage: build.sh <HEAD|WORK|TAG>
#   build.sh HEAD will use the last commit on the current branch
#   build.sh WORK will use uncommited local changes
#   build.sh TAG will use the code in the given git tag"

main() {
  cd "$(dirname "$0")/.."
  source ./bin/lib/strict_mode.sh

  local git_ref="${1-HEAD}"
  local build_dir="build"
  local prefix="peterlyons.com-${git_ref}-$(date +%Y%m%d%H%M)"

  echo -n "git archive…"
  mkdir -p "${build_dir}/${prefix}/node"
  # note we need to use "-C" with tar and not "--directory" due to bsdtar on OSX
  if [[ "${git_ref}" == "WORK" ]]; then
    git ls-files \
    | tar -T - --create --file - \
    | tar -C "${build_dir}/${prefix}" --extract --file -
  else
    git archive --format=tar --prefix="${prefix}/" "${git_ref}" | \
    # extract that archive into a temporary build directory
    tar -C "${build_dir}" --extract
  fi

  echo ✓; echo -n "node…"
  local node_version="$(cat .nvmrc)"
  local node_archive="node-v${node_version}-linux-x86.tar.gz"
  local node_url=$(echo "https://nodejs.org/dist/v" \
  "${node_version}/node-v${node_version}-linux-x86.tar.gz" | tr -d " ")
  if [[ ! -f "${node_archive}" ]]; then
    curl --silent --fail --location --remote-name "${node_url}"
  fi
  tar -C "${build_dir}/${prefix}/node" --strip-components=1 --extract --gzip \
    --file "${node_archive}"

  echo ✓; echo -n "npm packages…"
  # pre-cache the local node_modules in the build dir to avoid web downloads
  tar --create --file - node_modules | \
    tar -C "${build_dir}/${prefix}" --extract --file -
  cd "${build_dir}/${prefix}"
  # Run OSX node and npm utilites but within the linux build dir
  npm install --silent --production
  bower install --silent --production
  ./bin/build_js.sh
  npm dedupe
  npm prune --silent --production
  # npm prune removes our symlink, add it back
  ln -nsf ../app node_modules/app
  # remove development-only files
  rm -rf wallah doc deploy test Vagrantfile .gitignore .agignore .gitmodules
  find ./app -name \*.test.js | xargs rm
  cd -

  echo ✓; echo -n "vagrant rebuild…"
  cat <<EOF | vagrant ssh build
set -e
cd "/vagrant/${build_dir}/${prefix}"
./node/bin/npm rebuild --silent --parseable --update-binary &>> "/vagrant/${build_dir}/npm.log"
EOF

  echo ✓; echo -n "archive…"
  local dist_path="${build_dir}/${prefix}.tar.gz"
  tar -C "${build_dir}" --create --gzip --file "${dist_path}" "${prefix}"
  echo ✓

  ls -lh "${dist_path}"
  echo "To deploy to stage, run:"
  echo "  ./bin/deploy.sh ${dist_path} deploy/host_vagrant_stage.yml"
}

main "$@"
