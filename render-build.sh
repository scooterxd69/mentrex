#!/usr/bin/env bash
# render-build.sh — Custom build script for Render deployment
set -e

echo "🚀 Starting custom Render build for Mentrex..."

# Install dependencies (including dev)
npm install --include=dev

# Run Vite build for frontend
npx vite build

# Compile backend (TypeScript → JS using esbuild)
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "✅ Build complete!"
