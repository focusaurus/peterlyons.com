#!/usr/bin/env bash

# Please Use Google Shell Style: https://google.github.io/styleguide/shell.xml

# ---- Start unofficial bash strict mode boilerplate
# http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -o errexit  # always exit on error
set -o errtrace # trap errors in functions as well
set -o pipefail # don't ignore exit codes when piping output
set -o posix    # more strict failures in subshells
set -x          # enable debugging

IFS="$(printf "\n\t")"
# ---- End unofficial bash strict mode boilerplate

docker_build() {
  dockerfile=$(
    cat <<'EOF'
ARG NODE_VERSION
FROM node:${NODE_VERSION}
ARG USER
ARG USER_ID=1000
ARG GROUP_ID=1000
# This flavor is good for debian/ubuntu
RUN addgroup --gid ${GROUP_ID} ${USER} || true
RUN adduser --disabled-password --gid ${GROUP_ID} --uid ${USER_ID} --gecos ${USER} ${USER} || true
RUN set -eux; \
  echo deb http://ppa.launchpad.net/ansible/ansible/ubuntu trusty main > /etc/apt/sources.list.d/ansible.list; \
  apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 93C4A3FD7BB9C367; \
  apt-get --quiet --quiet --yes update; \
  apt-get --quiet --yes install ansible
WORKDIR /host
EXPOSE 9000 9001
ENV PLWS_PERS_HOST=0.0.0.0
ENV PLWS_PRO_HOST=0.0.0.0
ENV PATH=/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/opt/plws/code/node_modules/.bin
CMD ["./bin/start.sh"]
EOF
  )
  echo "${dockerfile}" | docker build \
    --tag "$1" \
    --build-arg "USER=${USER}" \
    --build-arg "USER_ID=$(id -u)" \
    --build-arg "GROUP_ID=$(id -g)" \
    --build-arg "NODE_VERSION=$(cat .nvmrc)" \
    -
}

docker_run() {
  exec docker run --rm --interactive --tty \
    --attach stdin --attach stdout --attach stderr \
    --volume "${PWD}/../data:/opt/plws/data" \
    --volume "${PWD}/../static:/opt/plws/static" \
    --volume "${PWD}:/opt/plws/code" \
    --volume "${HOME}/.gitconfig":/home/node/.gitconfig \
    --volume $SSH_AUTH_SOCK:/ssh-agent \
    --env SSH_AUTH_SOCK=/ssh-agent \
    --publish "127.0.0.1:9001:9001" \
    --publish "127.0.0.1:9000:9000" \
    --user "$(id -u)" \
    "$1" "${2-bash}"
}

main() {
  cd "$(dirname "${BASH_SOURCE[0]}")/.."
  local image="plws-server"
  case "$1" in
  --build)
    docker_build "${image}"
    ;;
  *)
    if ! docker inspect "${image}" &>/dev/null; then
      docker_build "${image}"
    fi
    docker_run "${image}"
    ;;
  esac
}

main "$@"
