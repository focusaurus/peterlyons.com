#!/usr/bin/env bash
cd "$(dirname "$0")/.."
source ../bin/lib/strict-mode.sh
NODE_VERSION=$(cat .nvmrc)
dockerfile=$(cat <<EOF
FROM node:${NODE_VERSION}
RUN echo deb http://ppa.launchpad.net/ansible/ansible/ubuntu trusty main > /etc/apt/sources.list.d/ansible.list && \
  apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 93C4A3FD7BB9C367 && \
  apt-get --quiet --quiet --yes update && \
  apt-get --quiet --yes install ansible
WORKDIR /opt/plws/code
EXPOSE 9000 9001
ENV PLWS_PERS_HOST=0.0.0.0
ENV PLWS_PRO_HOST=0.0.0.0
ENV PATH=/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/opt/plws/code/node_modules/.bin
CMD ["./bin/start.sh"]
EOF
)
echo "${dockerfile}" | \
  docker build --tag plws-server -
