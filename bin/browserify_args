#!/bin/bash
cd $(dirname "$0")/..
echo \
  -e app/browser/navigation \
  $(find app/browser -name '*.js' -not -name '*test.js' -print0 | \
    xargs -0 -I file echo -r file | \
    sed -e 's/\.js$//' | \
    xargs)
