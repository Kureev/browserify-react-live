#!/bin/sh
mkdir -p dist
./node_modules/.bin/watchify example/*.js -o dist/bundle.js &
./node_modules/.bin/http-server example &
node src/server dist/bundle.js &
sleep 3
open http://localhost:8080
wait
