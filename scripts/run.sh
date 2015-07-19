#!/bin/sh
mkdir -p dist
node src/server dist/bundle.js &
./node_modules/.bin/watchify example/*.js -o dist/bundle.js &
./node_modules/.bin/http-server example &
open http://localhost:8080
wait
