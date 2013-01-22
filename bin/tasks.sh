#!/bin/bash
#This script contains many install/deploy/run related tasks
#The tasks are defined as shell functions and prefixed with a namespace
#which is one of os, app, web, user, etc.
#The goal is that once you figure out how to clone the git repository,
#You can use this script to get a dev, staging, or production environment
#up and running.  The script doesn't do 100% automation yet but it does a lot.
#You run it like this:
#tasks.sh staging app:start
#where "staging" is the environment name (defined below) and app:start is the
#task name.
#The script can be run locally in which case the task's shell function is just
#directly executed, or against one or more remote hosts, in which case
#this script handles copying itself to the remote hosts then running itself
#on each host.

#To bootstrap a new staging host, you would run
#tasks.sh staging os:initial_setup
#tasks.sh staging user:initial_setup
#tasks.sh staging app:initial_setup
#tasks.sh staging os:init_scripts
#Then on the host run "sudo service node_peterlyons.com start" to start the app

TASK_SCRIPT="${0}"

########## Define Environments ##########
SITE="peterlyons.com"
PRODUCTION_HOSTS="${SITE}"
STAGING_HOSTS="staging.${SITE}"
DEVURL="http://localhost:9000"
PRODURL="http://${SITE}"
REPO_URL="ssh://git.peterlyons.com/home/plyons/projects/peterlyons.com.git"
NODE_VERSION="0.6.17"
PROJECT_DIR=~/projects/peter_lyons_web_site
CODE_PATH="${PROJECT_DIR}/code"
OVERLAY="${CODE_PATH}/overlay"
PUBLIC="${CODE_PATH}/public"
BRANCH=master

#OS X support
TAR=tar
if which gnutar &> /dev/null; then
  TAR=gnutar
fi

########## No-Op Test Tasks for sudo, root, and normal user ##########
#Use these to make sure your passwordless ssh is working, hosts are correct, etc
test:uptime() {
    uptime
}

test:uptime_sudo() { #TASK: sudo
    uptime
    id
}
########## OS Section ##########
#Wrapper function for getting everything in the OS bootstrapped
os:initial_setup() { #TASK: sudo
    os:prereqs
}


#These are the packages we need above and beyond the basic Ubuntu 10.10
#server default install.  There are prereqs included in that default config
#that we don't explicitly restate here (openssh-server, etc)
os:prereqs() { #TASK: sudo
    if ! which apt-get >/dev/null; then
        echo "apt-get not found in PATH.  Is this really an Ubuntu box?" \
            " Is your PATH correct?" 1>&2
        exit 5
    fi
    apt-get update
    cat <<EOF | grep -v "#" | sort | xargs apt-get --assume-yes install
#Needed to download node
curl
#Needed to build node.js
g++
#Source Code Management
git-core
#Needed to build node.js with SSL support
libssl-dev
#Needed to build node.js
make
#For monitoring
monit
#We use perl in the tasks.sh script for quick command line file editing
perl
#This is our web server
nginx
EOF
}

#Helper function for symlinking files in the git work area out into the OS
link() {
  ln -n -s -f "${OVERLAY}${1}" "${1}"
}

os:init_scripts() { #TASK: sudo
    [ -e /etc/nginx/sites-enabled/default ] && rm /etc/nginx/sites-enabled/default
    link "/etc/nginx/sites-enabled/${SITE}"
    link "/etc/monit/conf.d/nginx_${SITE}.monitrc"
    link "/etc/monit/conf.d/node_${SITE}.monitrc"
    link "/etc/init/node_peterlyons.conf"
    cp "${OVERLAY}/etc/monit/monitrc" /etc/monit/monitrc
    initctl reload-configuration
    /etc/init.d/nginx reload
}

########## User Section ##########
#Wrapper function
user:initial_setup() {
    user:ssh_config
}


#The ForwardAgent configuration allows proxied ssh agent authentication
#So the capistrano scripts can run git+ssh commands on the app server
#and the end user's authentication will be proxied from the end user's
#desktop to the app server through to the git SCM host
user:ssh_config() {
    KEYS=~/.ssh/authorized_keys
    [ -d ~/.ssh ] || mkdir ~/.ssh
    touch "${KEYS}"
    #This is plyons's public SSH key
    if ! grep "^ssh-rsa AAAAB3NzaC1yc2EAAAABI" "${KEYS}" > /dev/null 2>&1; then
        cat <<EOF | tr -d '\n' >> "${KEYS}"
ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEArdBAo5yfb43w5/N3nxQvpDH6tCIvwvsJu/FrvRFiM8
+s/lGP0XxihzHYOJH/IdEz+WnjnKMBCWT/we3ZbWMFQ32yMzXAj2B+noaranIOLJ7C52uZrWoS2OOO
qWtwuj4jZLZ9v7cLvxC9v69b8dqyBOJG3YlIzqFQeYT7p4I1XWDRfwhsuX738zhvBYSx4w3tkZDmEp
sSl0+xNVjugBjNP81ynP3nUkeH+Ap2IUrJK5RnGpLXg+EX1DpPypXvn67SpHvz0+DgQuKwL+AYQdFS
86p21tuSDJ0yKz8CX+5nrJjjt2NUYgs0SwGU387UzqGFH5711C2rc9gkD6cvGbX0mQ
== zoot MacBook pro
EOF
    #Need a trailing newline
    echo >> "${KEYS}"
    fi
    touch ~/.ssh/config
    if ! grep "^Host git.peterlyons.com" ~/.ssh/config > /dev/null 2>&1; then
        cat <<EOF>> ~/.ssh/config
Host git.peterlyons.com
  ForwardAgent yes
EOF
    fi
}


########## Database (mysql) section ##########
db:prod_to_stage() {
    #If in there future there are more than 1 production host, just use the
    #first one in the list
    HOST=$(echo "${PRODUCTION_HOSTS}" | cut -d " " -f 1)
    for DB in persblog problog
    do
        FILE="/var/tmp/${DB}.bak.sql.bz2"
        #This does the production backup
        echo "Enter production password for user ${DB} and DB ${DB} when prompted"
        ssh -q -t "${HOST}" mysqldump --host localhost \
            --user "${DB}" --allow-keywords --add-drop-table --password \
            --add-drop-database --dump-date "${DB}" \| bzip2 -c \
            \> "${FILE}"
        #Copy the backup to the local computer
        scp -q "${HOST}:${FILE}" /var/tmp
        #Restore the backup locally
        echo "Enter staging password (twice) for user ${DB} and DB ${DB} when" \
            " prompted"
        bzcat "${FILE}" | mysql --host localhost --user "${DB}" --password "${DB}"
        #This updates the site URL, which must be relative for staging
        echo "update wp_options set option_value = '/${DB}' where option_name" \
            " in ('siteurl', 'home');" | mysql -u "${DB}" -p "${DB}"
        echo "Backup, transfer, restore, and tweak complete for ${DB}"
    done

}

########## Web (nginx) Section ##########
_web() {
    sudo /etc/init.d/nginx "${1}"
}

web:restart() {
     _web restart
}

web:reload() {
     _web reload
}

web:stop() {
    _web stop
}

web:start() {
    _web start
}

########## App (Node.js) Section ##########

#Helper functions
cdpd() {
    cd "${PROJECT_DIR}"
}

list_templates() {
    cd "${CODE_PATH}"
    #We skip layout because it's just the layout and photos because
    #it's a dynamic page
    ls app/templates/*.{jade,md} | xargs -n 1 basename | sed -e s/\.jade// \
        -e /layout/d \
        -e /photos/d \
        -e /feed/d \
        -e /admin_galleries/d \
        -e s/\.md//
}


app:initial_setup() {
    app:clone
    app:prereqs
}

app:clone() {
    PARENT="$(dirname ${PROJECT_DIR})"
    [ -d "${PARENT}" ] || mkdir -p "${PARENT}"
    cd "${PARENT}"
    git clone "${REPO_URL}"
    cd "${PROJECT_DIR}"
    git checkout "${BRANCH}"
    cd
}

#@todo node has binary distros now. Use the install_node function
task:prereqs() {
    set -e
    cdpd
    [ -d var/tmp ] || mkdir -p var/tmp
    cd var/tmp
    echo "Installing node.js version ${NODE_VERSION}"
    #For older 0.4.x node versions
    #curl --silent --remote-name \
    #    "http://nodejs.org/dist/node-v${NODE_VERSION}.tar.gz"
    #For newer 0.6.x versions
    curl --silent --remote-name \
        "http://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}.tar.gz"
    tar xzf node-v${NODE_VERSION}.tar.gz
    cd node-v${NODE_VERSION}
    ./configure  --prefix=../../../node && make install
    cd ..
    rm -rf node-*
    cdpd
    npm install
}

# task:deploy() {
#     cdpd
#     echo "Deploying branch ${1-${BRANCH}}"
#     git fetch origin --tags
#     git checkout --track -b "${1-${BRANCH}}" || git checkout "${1-${BRANCH}}"
#     git pull origin "${1-${BRANCH}}"
#     git submodule init
#     git submodule update
#     export PATH=$(pwd)/node/bin:$PATH
#     ./node/bin/npm install
#     sudo initctl reload-configuration
#     if sudo status node_peterlyons; then
#         sudo stop node_peterlyons; sudo start node_peterlyons;
#     else
#         sudo start node_peterlyons
#     fi
#     sudo service nginx reload
# }

check_fail() {
    if [ $1 -ne 0 ]; then
      echo "BOO"
      exit $1
    fi
}

task:test() {
  cd "${CODE_PATH}"
  local EXIT_CODE=0
  mocha test/unit/*.coffee || EXIT_CODE=$?
  if [ ${EXIT_CODE} -ne 0 ]; then
    exit $EXIT_CODE
  fi
  mocha test/application/*.coffee || EXIT_CODE=$?
  check_fail $EXIT_CODE
  #rm test/application/*.js
  #./node_modules/.bin/coffee -c bin
  #EXIT_CODE=0
  #BUGBUG#phantomjs ./bin/phantom_tests.js || EXIT_CODE=$?
  #rm ./bin/phantom_tests.js
  check_fail $EXIT_CODE
  echo "YAY"
}

task:start() {
  cd "${CODE_PATH}"
  coffee app/server.coffee
}

task:devstart() {
  cd "${CODE_PATH}"
  nodemon --debug=9001 app/server.coffee
}

task:debug() {
  cd "${CODE_PATH}"
  echo http://localhost:9002/debug?port=9001
  ./node_modules/.bin/coffee --nodejs --debug=9001 app/server.coffee
}

task:inspector() {
  cd "${CODE_PATH}"
  echo http://localhost:9002/debug?port=9001
  ./node_modules/.bin/node-inspector --web-port=9002
}

task:static() {
  echo "Generating HTML for static templated pages from ${DEVURL}..."
  for URI in $(list_templates) persblog/feed problog/feed
  do
      local URL="${DEVURL}/${URI}"
      echo -n "${URI}, "
      local EXIT_CODE=0
      curl --silent "${URL}" --output \
          "${PUBLIC}/${URI}.html" || EXIT_CODE=$?
      if [ ${EXIT_CODE} -ne 0 ]; then
          echo "FAILED to retrieve ${URL}"
          exit ${EXIT_CODE}
      fi
  done
  mv "${PUBLIC}/problog/feed.html" "${PUBLIC}/problog/feed.xml"
  mv "${PUBLIC}/persblog/feed.html" "${PUBLIC}/persblog/feed.xml"
  cd "${CODE_PATH}"
  cd app/posts
  for JSON in $(find . -type f -name \*.json)
  do
      local URI="${JSON%.*}"
      local URI=$(echo "${URI}" |cut -d . -f2-)
      echo "Saving ${URI} to ${PUBLIC}${URI}.html"
      local DIR=$(dirname "${URI}")
      local DIR="${PUBLIC}${DIR}"
      [ -e "${DIR}" ] || mkdir -p "${DIR}"
      local URL="${DEVURL}${URI}"
      local EXIT_CODE=0
      curl --silent "${URL}" --output \
          "${PUBLIC}${URI}.html" || EXIT_CODE=$?
      if [ ${EXIT_CODE} -ne 0 ]; then
          echo "FAILED to retrieve ${URL}"
          exit ${EXIT_CODE}
      fi
  done
}

task:release() {
  echo "Performing a production peterlyons.com release"
  eval $(ssh-agent -s) && ssh-add
  git checkout develop
  git pull origin develop
  task:test
  cd "${CODE_PATH}"
  echo "Current version is $(./bin/jsonpath.coffee version)"
  echo -n "New version: "
  read NEW_VERSION
  git checkout -b "release-${NEW_VERSION}" develop
  ./bin/version.coffee "${NEW_VERSION}"
  git commit -a -m "Bumped version number to ${NEW_VERSION}"
  echo "ABOUT TO MERGE INTO MASTER. CTRL-C now to abort. ENTER to proceed."
  read DONTCARE
  git checkout master
  git merge --no-ff "release-${NEW_VERSION}"
  echo "Now type notes for the new tag"
  git tag -a "v${NEW_VERSION}"
  git checkout develop
  git merge --no-ff "release-${NEW_VERSION}"
  git branch -d "release-${NEW_VERSION}"
  git push origin develop
  git checkout master
  git push origin master
  git push origin master --tags
  git checkout develop #Not good form to leave master checked out
  echo "Ready to go. Type     ./bin/tasks.sh production deploy     to push to production"
}

task:validate() {
    echo "Validating HTML: "
    local ERRORS=0
    local TMP=photos_tmp
    BASE="${DEVURL}"
    EXT=""
    if [ "${1}" == "production" ]; then
        BASE="${PRODURL}"
        EXT=".html"
        echo "Validating the PRODUCTION site"
    fi
    for URI in $(list_templates) app/photos admin/galleries problog/feed persblog/feed problog/2009/03/announcing-petes-points persblog/2007/10/petes-travel-adventure-2007-begins-friday-october-5th
    do
        printf '  %-25s' "${URI}: "
        local TMP_HTML="/tmp/tmp_html.$$.html"
        local FETCH_EC=0
        curl --silent "${BASE}/${URI}${EXT}" --output "${TMP_HTML}" || \
            FETCH_EC=$?
        if [ ${FETCH_EC} -eq 7 ]; then
            echo "SERVER IS NOT RUNNING. ABORTING."
            exit ${FETCH_EC}
        fi
        if [ ${FETCH_EC} -ne 0 ]; then
            echo "FAILED (${FETCH_EC}"
            ERRORS=$((ERRORS + 1))
            continue
        fi
        local VALID_EC=0
        curl --silent "http://validator.w3.org/check" --form \
            "fragment=<${TMP_HTML}" | \
            egrep "was successfully checked as" > /dev/null || VALID_EC=$?
        if [ ${VALID_EC} -ne 0 ]; then
            echo "INVALID"
            ERRORS=$((ERRORS + 1))
        else
            echo "valid"
        fi
        rm "${TMP_HTML}"
    done
    if [ ${ERRORS} -ne 0 ]; then
        echo "ERROR: ${ERRORS} documents are invalid" 1>&2
        exit 5
    else
        echo "SUCCESS: All documents successfully validated"
    fi
}

task:watch() {
  cd "${CODE_PATH}"
  stylus -w -o public app/assets/css/screen.styl
}

deploy_repo() {
  local URL="${1}"
  local DIR=$(echo "${URL}" | sed 's/.*\/\(.*\)\.git/\1/')
  shift
  local PROJECT_PATH="projects/peter_lyons_web_site"
  for HOST in $@
  do
    echo "running script on ${HOST} ${URL}"
    ssh "${HOST}" <<EOF
      install --directory "${PROJECT_PATH}"
      cd "${PROJECT_PATH}"
      if [ -d "${DIR}" ]; then
        cd "${DIR}"
        git pull origin master
      else
        git clone "${URL}"
      fi
EOF
  done

}

deploy_data() {
  echo deploying data to $@
  deploy_repo ssh://git.peterlyons.com/home/plyons/projects/peter_lyons_web_site/data.git "${@}"
}

deploy_static() {
  echo deploying static to $@
  deploy_repo ssh://git.peterlyons.com/home/plyons/projects/peter_lyons_web_site/static.git "${@}"

}

deploy_code() {
  local DIST_PATH="${1}"
  local DIST_FILE=$(basename "${DIST_PATH}")
  local PREFIX=$(echo ${DIST_FILE} | sed 's/\.tar\.bz2//')
  shift
  local PROJECT_PATH="projects/peter_lyons_web_site"
  echo deploying code "${DIST_PATH}" to $@
  for HOST in $@
  do
    scp "${DIST_PATH}" "${HOST}":/tmp
    ssh "${HOST}" <<EOF
      install --directory "${PROJECT_PATH}"
      tar --extract --bzip2 --directory "${PROJECT_PATH}" --file "/tmp/${DIST_FILE}"
      cd "${PROJECT_PATH}/${PREFIX}"
EOF
    ssh -t "${HOST}" sudo "${PROJECT_PATH}/${PREFIX}/bin/post_extract.sh"
  done
}

task:deploy() {
  local PAYLOAD="${1}"
  shift
  local DESTINATION="${1}"
  case "${DESTINATION}" in
    production)
        local HOSTS="${PRODUCTION_HOSTS}"
    ;;
    staging)
        local HOSTS="${STAGING_HOSTS}"
    ;;
  esac
  case "${PAYLOAD}" in
    data)
      deploy_data ${HOSTS}
    ;;
    static)
      deploy_static ${HOSTS}
    ;;
    *.tar.*)
      deploy_code "${PAYLOAD}" ${HOSTS}
    ;;
  esac
}

install_node() {
  local VERSION=${1-0.8.18}
  local PREFIX=${2-node}
  #local PLATFORM=$(uname | tr A-Z a-z)
  #Since we only deploy to linux for staging & production, but build on a mac
  #hard code this to linux & x64
  local PLATFORM=linux
  local ARCH=x64
  # case $(uname -p) in
  #     i686)
  #         ARCH=x86
  #     ;;
  # esac
  mkdir -p "${PREFIX}"
  curl --silent \
    "http://nodejs.org/dist/v${VERSION}/node-v${VERSION}-${PLATFORM}-${ARCH}.tar.gz" \
    | tar xzf - --strip-components=1 -C "${PREFIX}"
}

dirs() {
  for DIR in $@
  do
    if [ -e "${DIR}" ] && [ ! -d "${DIR}" ]; then
      echo "ERROR: path ${DIR} exists but is not a directory" 1>&2
      return 5
    fi
    mkdir -p "${DIR}"
  done
}

task:dist() {
  cd "${CODE_PATH}"
  local GIT_REF="${1-master}"
  local BUILD_DIR="build"
  local DIST_DIR="dist"
  local PREFIX="${SITE}-${GIT_REF}"
  dirs "${BUILD_DIR}" "${DIST_DIR}"
  git archive --format=tar --prefix="${PREFIX}/" "${GIT_REF}" | \
    #extract that archive into a temporary build directory
    "${TAR}" --directory "${BUILD_DIR}" --extract
  #install node
  NODE_VERSION=$(./bin/jsonpath.coffee engines.node)
  install_node "${NODE_VERSION}" "${BUILD_DIR}/${PREFIX}/node"
  #Note we use npm from the build platform (OS X) here instead of
  #the one for the run platform as they are incompatible
  (cd "${BUILD_DIR}/${PREFIX}" && npm install --silent --production)
  "${TAR}" --directory "${BUILD_DIR}" --create --bzip2 --file "${DIST_DIR}/${PREFIX}.tar.bz2" .
}

task:clean() {
  cd "${CODE_PATH}"
  rm -rf build dist
}

task:html_to_md() {
    local HTML="${1}"
    local MD=$(echo "${1}" | sed -e 's/\.html$/.md/')
    local JSON=$(echo "${1}" | sed -e 's/\.html$/.json/')
    git mv "${HTML}" "${MD}"
    perl -pi -e 's/"html"/"md"/' "${JSON}"
}

case "${1}" in
    staging)
        HOSTS="${STAGING_HOSTS}"
    ;;
    production)
        HOSTS="${PRODUCTION_HOSTS}"
    ;;
esac
case "${1}" in
    staging|production)
        ENV_NAME="${1}"
        shift
        OP="${1}"
        shift
    ;;
    *)
        OP="${1}"
        shift
    ;;
esac

#figure out sudo
if egrep "^${OP}\(\).*#TASK: sudo" "${TASK_SCRIPT}" > /dev/null; then
    SUDO=sudo
fi

if [ -z "${HOSTS}" ]; then
    #local mode
    case "${OP}" in
        db:*|os:*|test:*|user:*|web:*|prereqs|deploy_*|clean|test|release|dist|debug|devstart|inspector|start|static|watch|deploy|validate|html_to_md)
            #Op looks valid-ish
            if ! expr "${OP}" : '.*:' > /dev/null; then
                OP="task:${OP}"
            fi
        ;;
        "")
            egrep '^task:' "${0}" | cut -d : -f 2 | cut -d '(' -f 1
        ;;
        *)
            echo "ERROR: unknown task ${OP}" 1>&2
            exit 1
        ;;
    esac
    eval "${OP}" "${@}"
else
    #remote mode
    for HOST in ${HOSTS}
    do
        echo "Running task ${OP} on ${HOST} as ${SUDO-$USER}"
        scp "${TASK_SCRIPT}" "${HOST}:/tmp"
        ssh -q -t "${HOST}" "${SUDO}" bash  \
            "/tmp/$(basename ${TASK_SCRIPT})" "${OP}" "${@}"
    done
fi
