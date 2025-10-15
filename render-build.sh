#!/bin/bash
# Move into client
cd client || exit

# Install all dependencies (dev included, just in case)
npm install --legacy-peer-deps

# Build frontend
npm run build
