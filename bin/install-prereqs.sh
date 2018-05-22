#!/bin/bash

# installs prerequisite packages for local development

cd "$(dirname "$0")/.." || exit 1
source ./bin/lib/strict-mode.sh

brew install git nvm ansible
# shellcheck disable=SC1090
source "$(brew --prefix nvm)/nvm.sh"
nvm install
npm install
