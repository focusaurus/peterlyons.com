#!/usr/bin/env bash

# bundles browser js via browserify & uglifyjs

cd "$(dirname "$0")/.." || exit
source ./bin/lib/strict-mode.sh
unset IFS # This screws up our shell quoting
export PATH="${PWD}/node_modules/.bin:$PATH"

build_plus_party() {
  local plus_party_temp
  plus_party_temp="$(mktemp -t plus-party-build-XXXXXX).js"
  local out="./www/plus-party.js"
  cd app/work/plus-party
  elm-make --yes --output "${plus_party_temp}" PlusParty.elm
  cd -
  cat node_modules/clipboard/dist/clipboard.js "${plus_party_temp}" > "${out}"
  uglifyjs ${uglify_args} "${out}" | gzip >"${out}.gz"
}

build_browserify() {
  local bundler="watchify --debug"
  local out="./www/plws.js"
  local uglify_args=""
  if [[ "$1" == "production" ]]; then
    bundler="browserify"
    uglify_args="--compress --mangle --keep-fnames"
  fi

  echo -n "${bundler}…"
  ${bundler} \
    --outfile "${out}" \
    --entry app/browser/navigation \
    --require app/core/blog/create-post-main \
    --require app/work/pages/career-main \
    --require app/work/pages/home-main \
    --require app/play/photos/photos-main
  temp=$(mktemp -t plws-build-XXXXXX)
  cp "${out}" "${temp}"
  echo -n "uglify…"
  uglifyjs ${uglify_args} "${temp}" | gzip >"${out}.gz"
  echo "✓"
}

build_browserify "$@"
build_plus_party
