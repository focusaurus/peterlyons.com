#!/bin/bash
cd "$(dirname "$0")/.."
source ./bin/lib/strict_mode.sh
unset IFS # This screws up groups variable quoting/parsing

# doc "* test [node|browser|debug]: run automated test suite and linting
#   * no args runs them all
#   * otherwise run the groups provided
#     * debug: run mocha tests with immediate breakpoint for debugging"
main() {
  local groups="${@-node browser}"
  for group in ${groups}; do
    if type "test_${group}" &>/dev/null; then
      eval "test_${group}"
    else
      echo "Usage: $0 <node|browser|debug>" 1>&2
      exit 1
    fi
  done
  ./bin/lint.sh
}

test_node() {
  set -e
  echo "node.js mocha unit tests…"
  echo -n "browserifying…"
  ./bin/bundle.sh
  echo ✓
  export NODE_ENV=test
  if [[ $# -eq 0 ]]; then
    mocha $(find ./app -name \*.test.js -print0 | sort | xargs -0)
  else
    mocha "$@"
  fi
  echo ✓
}

test_browser() {
  set +e
  echo -n browser tests…
  local browser="--phantom"
  #use this for real browser
  # local browser="--local $(config3 tests.port)"
  zuul ${browser} --ui mocha-bdd --open \
    $(find ./app -name '*btest.js' -print0 | xargs -0)
  echo ✓
}

test_debug() {
  NODE_ENV=test mocha --debug-brk=$(config3 tests.debugPort) "$@"
}

main "$@"
