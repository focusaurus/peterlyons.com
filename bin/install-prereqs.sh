#!/bin/bash

# installs prerequisite packages for local development

cd "$(dirname "$0")/.." || exit 1
source ./bin/lib/strict_mode.sh

ansible_version=1.9.1

brew install git nvm
# shellcheck disable=SC1090
source "$(brew --prefix nvm)/nvm.sh"
nvm install
npm install --install-scripts
git submodule update --init --depth 1
./wallah/bin/install_pip_package "ansible=${ansible_version}"
