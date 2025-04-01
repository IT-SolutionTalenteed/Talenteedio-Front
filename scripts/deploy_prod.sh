#!/bin/bash

DIR="$(pwd)"

echo "🚀 Starting deployment..."

echo "🔄 Fetching latest changes from origin..."
git fetch origin

echo "🔙 Resetting to origin/main..."
git reset --hard origin/main

echo "⬇️️ Pulling from origin/main..."
git pull origin main

echo "📦 Installing npm dependencies..."
npm install

echo "🛠️ Building the application..."
npm run build

echo "📂 Copy all build files to root directory..."
cp -r $DIR/build/* $DIR/

echo "Deployment completed successfully. 🎉🎉🎉"
