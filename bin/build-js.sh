#!/usr/bin/env bash

# bundles browser js via browserify & uglifyjs

cd "$(dirname "$0")/.." || exit
source ./bin/lib/strict_mode.sh
unset IFS # This screws up our shell quoting
export PATH="${PWD}/node_modules/.bin:$PATH"

bundler="watchify --debug"
out="./www/plws.js"
uglify_args=""
if [[ "$1" == "production" ]]; then
  bundler="browserify"
  uglify_args="--compress warnings=false --mangle --keep-fnames --screw-ie8"
fi

echo -n "${bundler}…"
${bundler} \
  --outfile "${out}" \
  --entry app/browser/navigation \
  --require app/blog/create-post-main \
  --require app/pages/career-main \
  --require app/pages/home-main \
  --require app/personal/photos/photos-main \
  --require app/plus-party/plus-party-main

if [[ "$1" == "production" ]]; then
  temp=$(mktemp -t plws-build-XXXX)
  cp "${out}" "${temp}"
  uglifyjs ${uglify_args} "${temp}" | gzip > "${out}.gz"
fi
