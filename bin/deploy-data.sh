#!/bin/bash

# deploys data repo (blog posts) only to a remote host via ansible
# Usage: deploy-data.sh <inventory-file>
# inventory files live in the deploy/hosts directory"

cd "$(dirname "$0")/.." || exit 10
source ./bin/lib/strict_mode.sh

main() {
  PATH="${PWD}/python/bin:${PATH}"
  local inventory="$1"
  export ANSIBLE_HOST_KEY_CHECKING=False
  ansible-playbook -i "${inventory}" ./deploy/playbook-data-repo.yml
}

main "$@"
