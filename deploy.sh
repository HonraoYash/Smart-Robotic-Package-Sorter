#!/bin/bash

# Build the frontend
cd smart-sorter-frontend
npm run build

# Create a temporary directory for deployment
cd ..
rm -rf temp-deploy
mkdir temp-deploy

# Copy only the dist contents to temp directory
cp -r smart-sorter-frontend/dist/* temp-deploy/

# Deploy to gh-pages
cd temp-deploy
git init
git add .
git commit -m "Deploy to GitHub Pages"
git branch -M gh-pages
git remote add origin https://github.com/HonraoYash/Smart-Robotic-Package-Sorter.git
git push -f origin gh-pages

# Cleanup
cd ..
rm -rf temp-deploy 