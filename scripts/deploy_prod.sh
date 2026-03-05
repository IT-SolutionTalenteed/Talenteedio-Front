#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm use v18.18   # <-- changement ici

echo "🚀 Starting deployment..."

git fetch origin
git reset --hard origin/main
git pull origin main

npm install
npm run build

echo "Deployment completed successfully. 🎉🎉🎉"