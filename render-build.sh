#!/bin/bash
# Move into client folder
cd client || exit

# Force install everything (ignore production-only)
npm install --legacy-peer-deps

# Build frontend
npm run build
