#!/bin/bash

# deploys data repo (blog posts) only to a remote host via ansible
# Usage: deploy-data.sh <inventory-file>
# inventory files live in the deploy/hosts directory"

cd "$(dirname "$0")/.." || exit 10
source ./bin/lib/strict-mode.sh

main() {
  PATH="${PWD}/python/bin:${PATH}"
  if [[ $# -ne 1 ]]; then
    echo "Usage $0 <deploy/host-production.yml>" 1>&2
    exit 1
  fi
  local inventory="$1"
  export ANSIBLE_HOST_KEY_CHECKING=False
  ansible-playbook -i "${inventory}" --ask-become-pass ./deploy/playbook-data-repo.yml
}

main "$@"
