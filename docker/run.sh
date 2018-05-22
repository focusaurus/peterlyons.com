#!/usr/bin/env bash
cd "$(dirname "$0")/.."
source ./bin/lib/strict-mode.sh
exec docker run --rm --interactive --tty \
  --attach stdin --attach stdout --attach stderr \
  --volume "${PWD}/../data:/opt/plws/data" \
  --volume "${PWD}/../static:/opt/plws/static" \
  --volume "${PWD}:/opt/plws/code" \
  --publish "127.0.0.1:9000:9000" \
  --publish "127.0.0.1:9001:9001" \
  plws-server "$@"
