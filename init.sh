#!/bin/sh
# turn on bash's job control
set -m

npm run db:migrate

# Start the primary process
node --expose_gc --experimental-worker --experimental-modules dist/servers/index.js