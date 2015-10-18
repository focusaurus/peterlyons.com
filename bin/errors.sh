#!/bin/bash
# doc "* errors: regenerate static error HTML pages"

cd "$(dirname "$0")/.."
source ./bin/lib/strict_mode.sh

export PATH="${PATH}:${PWD}/node_modules/.bin"

devurl="http://localhost:$(config3 port)"
static="../static"
echo "Generating HTML for static error pages from ${devurl}..."
for uri in error404 error500; do
  url="${devurl}/${uri}"
  echo -n "${uri}, "
  exit_code=0
  curl --silent "${url}" --output \
  "${static}/${uri}.html" || exit_code=$?
  if [ ${exit_code} -ne 0 ]; then
    echo "FAILED to retrieve ${url}"
    exit ${exit_code}
  fi
done
