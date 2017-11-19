#!/usr/bin/env bash
cd "$(dirname "$0")/.." || exit
source ./bin/lib/strict_mode.sh
export PATH="${PWD}/node_modules/.bin:$PATH"

local_dev_format="delete this.v; delete this.hostname;delete this.level; delete this.pid; delete this.name"

node --inspect . \
  | tee -a ./log/app.log \
  | json -g -a -0 -e "${local_dev_format}"
