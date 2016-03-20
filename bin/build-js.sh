#!/bin/bash

# bundles browser js via browserify & uglifyjs

cd "$(dirname "$0")/.."
source ./bin/lib/strict_mode.sh
unset IFS # This screws up our shell quoting
export PATH=$PWD/node_modules/.bin:$PATH

bundler="watchify --debug"
out="./www/plws.js"
uglify_args=""
if [[ "$1" == "production" ]]; then
  bundler="browserify"
  uglify_args="--compress --mangle --keep-fnames --screw-ie8"
fi

printf 'building ./www/reveal.js…'
browserify --entry app/browser/deck | uglifyjs ${uglify_args} > www/reveal.js
echo ✓

printf "${bundler}…"
${bundler} \
  --outfile "${out}" \
  --entry app/browser/navigation \
  --require app/browser/career \
  --require app/browser/post \
  --require app/browser/plus-party \
  --require app/plus-party/plus-party-react \
  --require app/blog/create-post-react \
  --require app/personal/photos-react/browser-main

if [[ "$1" == "production" ]]; then
  temp=$(mktemp -t plws-build-XXXX)
  cp "${out}" "${temp}"
  uglifyjs ${uglify_args} "${temp}" | gzip > "${out}.gz"
fi
