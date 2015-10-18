#!/bin/bash

# removes all generated build artifacts

cd "$(dirname "$0")/.."
source ./bin/lib/strict_mode.sh

rm -rf ./build ./www/*
