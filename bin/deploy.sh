cd "$(dirname "$0")/.."
source ./bin/lib/strict_mode.sh

autoinstall_wallah() {
  [[ -f wallah/bin/install_iojs ]] && return
  git submodule update --init --depth 1
}
# doc "* deploy: deploy code to a target system via ansible
#   * Usage: $(basename $0) deploy <dist-file> <inventory-file>
#   * will deploy the full stack to the server(s) listed in the ansible yaml inventory file argument
#   * distribution archive files get built in the "build" directory
#   * inventory files live in the deploy/hosts directory"
main() {
  autoinstall_wallah
  ./wallah/bin/install_pip_package ansible
  local dist_path="$1"
  local dist_name=$(basename "${dist_path/.tar.*/}")
  local inventory="$2"
  export ANSIBLE_HOST_KEY_CHECKING=False
  ansible-playbook \
    -i "${inventory}" \
    --ask-sudo-pass \
    --extra-vars "dist=${dist_path}" \
    --extra-vars "dist_name=${dist_name}" \
    ./deploy/playbook_full_stack.yml
}

main "$@"
