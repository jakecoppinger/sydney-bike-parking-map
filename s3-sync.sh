#!/usr/bin/env bash
set -e

# Sync files from build/
aws s3 sync build s3://sydneybikeparkingmap.com/ --delete

echo "Done"
