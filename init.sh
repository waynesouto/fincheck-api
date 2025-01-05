#!/bin/sh
# turn on bash's job control
set -m

# Start the primary process
node --expose_gc --experimental-worker --experimental-modules dist/src/servers/index.js