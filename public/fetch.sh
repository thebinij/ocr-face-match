#!/bin/bash

URL="https://github.com/justadudewhohacks/face-api.js/raw/master/weights/$1"

curl -OJL $URL

if [ $? -eq 0 ]; then
  echo "Downloaded: $1"
else
  echo "Failed to download the file"
fi