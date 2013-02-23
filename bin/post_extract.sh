#!/bin/sh
#This script sets up file owner/group/perms after the code
#has been extracted on a production host.
#It should be run as root via sudo

set_owner_and_permissions() {
  chown -R plyons:www-data . ../data
  find . -type d -print0 | xargs -0 chmod 775
  find . -type f -print0 | xargs -0 chmod 664
  chmod +x node/bin/* node_modules/.bin/* bin/* ./node/lib/node_modules/npm/bin/node-gyp-bin/* app/server.coffee
  chgrp -R www-data ../data/posts
  chmod -R g+w ../data/posts
}

repoint_code_symlink() {
  cd "${PROJECT_PATH}"
  ln -nsf "${CODE_PATH}" code.new
  #https://gist.github.com/3807742
  mv -T code.new code
  cd -
}

#Helper function for symlinking files in the git work area out into the OS
link() {
  ln -n -s -f "${PROJECT_PATH}/code/overlay${1}" "${1}"
}

link_os_files() {
  local SITE=peterlyons.com
  local OVERLAY="${PROJECT_PATH}/code/overlay"
  [ -e /etc/nginx/sites-enabled/default ] && rm /etc/nginx/sites-enabled/default
  link "/etc/nginx/sites-enabled/${SITE}"
  link "/etc/monit/conf.d/nginx_${SITE}.monitrc"
  link "/etc/monit/conf.d/node_${SITE}.monitrc"
  link "/etc/init/node_peterlyons.conf"
  cp "${OVERLAY}/etc/monit/monitrc" /etc/monit/monitrc
}

restart_services() {
  stop node_peterlyons || true
  initctl reload-configuration
  start node_peterlyons
  /etc/init.d/nginx reload
}

##### main code #####
#code root is our working directory
cd $(dirname "${0}")/..
CODE_PATH=$(pwd)
PROJECT_PATH=$(dirname "${CODE_PATH}")

chmod +x ./node/lib/node_modules/npm/bin/node-gyp-bin/node-gyp
./node/bin/npm rebuild
[ -e ../var/log ] || mkdir -p ../var/log
set_owner_and_permissions
repoint_code_symlink
link_os_files
restart_services
