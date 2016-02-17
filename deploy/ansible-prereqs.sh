#!/bin/bash
# install ansible prereqs manually or all apt-based ansible commands will fail
# http://stackoverflow.com/questions/22753081/bootstrapping-ansible-prerequisites-with-the-script-module-python-required/22763407#22763407
# http://euphonious-intuition.com/2013/01/bootstrapping-a-cluster-with-ansible-debian-6-and-oracle-java-7/
set -e
apt-get -qq update
apt-get -qq --yes install python python-apt python-pycurl sshpass
touch /root/.ansible-prereqs-installed
