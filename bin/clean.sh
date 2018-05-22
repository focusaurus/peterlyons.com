#!/bin/bash

# removes all generated build artifacts

cd "$(dirname "$0")/.."
source ./bin/lib/strict-mode.sh

rm -rf ./build ./www/*
