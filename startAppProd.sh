#!/bin/bash

export NODE_ENV=production
export PORT=5000
#sudo -E node app.js &
sudo -E forever start app.js
