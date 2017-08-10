#!/usr/bin/env bash

# bundles browser js via browserify & uglifyjs

cd "$(dirname "$0")/.." || exit
source ./bin/lib/strict_mode.sh
unset IFS # This screws up our shell quoting
export PATH="${PWD}/node_modules/.bin:$PATH"

build_plus_party() {
  local plus_party_temp
  plus_party_temp="$(mktemp -t plus-party-build-XXXX).js"
  local out="./www/plus-party.js"
  cd app/plus-party
  elm-make --yes --output "${plus_party_temp}" PlusParty.elm
  cd -
  cat node_modules/clipboard/dist/clipboard.js "${plus_party_temp}" >"${out}"
  uglifyjs ${uglify_args} "${out}" | gzip >"${out}.gz"
}
#
# build_create_post() {
#   local out="www/create-post.js"
#   cd app/blog
#   elm-make --yes --output "../../${out}" CreatePost.elm
#   cd -
#   uglifyjs ${uglify_args} "${out}" | gzip >"${out}.gz"
# }

# build_create_post() {
#   local out="www/create-post.js"
#   watchify ./app/blog/create-post.js --debug --entry ./app/blog/create-post.js --outfile "${out}"
#     # | uglifyjs ${uglify_args} > "${out}"
#   # gzip --force --stdout "${out}" > "${out}.gz"
# }

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
    --require app/blog/create-post-main \
    --require app/pages/career-main \
    --require app/pages/home-main \
    --require app/personal/photos/photos-main
  temp=$(mktemp -t plws-build-XXXX)
  cp "${out}" "${temp}"
  echo -n "uglify…"
  uglifyjs ${uglify_args} "${temp}" | gzip >"${out}.gz"
  echo "✓"
}

build_browserify "$@"
build_plus_party
# build_create_post
