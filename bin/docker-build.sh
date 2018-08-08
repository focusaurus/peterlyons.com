#!/usr/bin/env bash
cd "$(dirname "$0")"
source ../bin/lib/strict-mode.sh
docker build \
  --tag plws-server \
  --build-arg NODE_VERSION="$(cat ../.nvmrc)" \
  --build-arg UID="$(id -u)" \
  --build-arg GID="$(id -g)" \
  ../docker
