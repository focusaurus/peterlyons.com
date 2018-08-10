#!/bin/bash

# deploys application build to a remote host via ansible
# Usage: deploy.sh <dist-file> <inventory-file>
# will deploy the full stack to the server(s) listed in the ansible yaml inventory file argument
# distribution archive files get built in the "build" directory
# inventory files live in the deploy/hosts directory"

cd "$(dirname "$0")/.." || exit 10
source ./bin/lib/strict-mode.sh

main() {
  PATH="${PWD}/python/bin:${PATH}"
  local dist_path="$1"
  local dist_name
  dist_name=$(basename "${dist_path/.tar.*/}")
  local inventory="$2"
  echo "Next sudo password prompt is for your unix account on the remote server"
  export ANSIBLE_HOST_KEY_CHECKING=False
  ansible-playbook \
    -i "${inventory}" \
    --extra-vars "dist=${dist_path}" \
    --extra-vars "dist_name=${dist_name}" \
    --ask-become-pass \
    ./deploy/playbook-full-stack.yml
}

main "$@"
