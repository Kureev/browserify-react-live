#!/bin/sh
node src/server dist/bundle.js &
watchify example/*.js -o dist/bundle.js &
http-server example &
open http://localhost:8080
wait
