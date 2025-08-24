#!/bin/bash
set -euo pipefail

if sudo -l &>/dev/null; then
  echo "restarting site server..."
else
  echo "need sudo perms to use docker commands"
  exit 1
fi

echo "stopping server for rebuild"
sudo docker compose down
echo "rebuilding site"
sudo docker compose build
echo "starting server up to serve site"
sudo docker compose up -d
