#!/bin/bash
cd "$(dirname "$0")/.."
source ./bin/lib/strict_mode.sh

node-dev ./app/server.js | tee -a ./log/app.log
