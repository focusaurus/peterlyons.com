#!/bin/bash
cat <<EOF | grep -v '#' | xargs apt-get install -y
# Needed to build node.js modules
make
# Needed to build node.js modules with binary add-ons
g++
# compiling node.js modules with native extensions
build-essential
# compiling python modules with native extensions
python-dev
# git SCM
git-core
# wallah uses curl to download stuff like node
curl
# mmm, tasty zsh
zsh
# plyons is in the habit of using less instead of more
less
# for the editing of the text files
vim
EOF

# remove evil default ~/.bashrc
rm ~/.bashrc
locale-gen en_US.UTF-8
