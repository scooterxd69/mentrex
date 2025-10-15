#!/bin/bash
# Move into client folder
cd client || exit

# Install dependencies (including dev dependencies)
npm install --legacy-peer-deps

# Build frontend
npm run build
