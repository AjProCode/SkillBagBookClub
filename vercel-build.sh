#!/bin/bash

# Ensure NPX is available
echo "Checking NPX..."
if ! command -v npx &> /dev/null; then
  echo "NPX not found, installing..."
  npm install -g npx
fi

# Ensure Vite is properly installed
echo "Ensuring Vite is installed..."
npm list vite || npm install vite

# Run the build command
echo "Building the application..."
npx vite build 
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Build completed successfully!"