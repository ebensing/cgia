#!/bin/bash

export NODE_ENV=production
export PORT=80
#sudo -E node app.js &
sudo -E forever start app.js
