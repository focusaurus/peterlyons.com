#!/bin/sh
#install ansible prereqs manually or all apt-based ansible commands will fail
# http://euphonious-intuition.com/2013/01/bootstrapping-a-cluster-with-ansible-debian-6-and-oracle-java-7/
apt-get update
apt-get install --yes python python-apt python-pycurl
