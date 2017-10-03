#!/bin/bash

# installs prerequisite packages for local development

cd "$(dirname "$0")/.." || exit 1
source ./bin/lib/strict_mode.sh

ansible_version=1.9.1

brew install git nvm
# shellcheck disable=SC1090
source "$(brew --prefix nvm)/nvm.sh"
nvm install
npm install
if [[ ! -e python ]]; then
  virtualenv python
fi
./python/bin/pip install "ansible=${ansible_version}"
