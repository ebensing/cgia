﻿#!/bin/bash

#setup script for ubuntu - MUST BE RUN FROM SETUP DIRECTORY

#get build-essential

sudo apt-get update 
sudo apt-get install build-essential

#install git
sudo apt-get install git-core

#install node
sudo apt-get install python-software-properties
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs npm

#install mongo
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
sudo sh -c "echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' > /etc/apt/sources.list.d/10gen.list"
sudo apt-get update
sudo apt-get install mongodb-10gen
sudo service mongodb restart

#do fun setup-y stuff
sudo npm install forever -g
mongo cgia-huit db_setup.js
cd ../
sudo npm install -d