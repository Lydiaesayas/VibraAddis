#!/bin/bash

# VibraAddis Backend Deployment Script
# This script handles the deployment of the backend to production

echo "🚀 Starting VibraAddis Backend Deployment..."

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
    echo "✅ Environment variables loaded"
else
    echo "❌ Error: .env.production file not found"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Run database migrations if needed
echo "🗄️ Running database setup..."
node seed.js

# Build the application (if using TypeScript)
# npm run build

# Start the application
echo "🎯 Starting application..."
if [ "$NODE_ENV" = "production" ]; then
    # Use PM2 for production process management
    if command -v pm2 &> /dev/null; then
        pm2 stop vibraaddis-backend 2>/dev/null || true
        pm2 start server.js --name vibraaddis-backend
        pm2 save
        echo "✅ Application started with PM2"
    else
        echo "⚠️  PM2 not found, starting with node directly"
        node server.js
    fi
else
    node server.js
fi

echo "✨ Deployment completed successfully!"
