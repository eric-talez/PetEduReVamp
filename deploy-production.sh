#!/bin/bash

echo "🚀 Production Deployment Script"
echo "================================"

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 2. Build TypeScript for server
echo "🔧 Building server for production..."
npx tsc --project tsconfig.server.json

# 3. Copy necessary files
echo "📋 Copying configuration files..."
cp package.json dist/
cp -r shared dist/

# 4. Create logs directory
mkdir -p logs

# 5. Stop existing PM2 processes
echo "🛑 Stopping existing processes..."
pm2 delete all || true

# 6. Start production server
echo "🚀 Starting production server..."
NODE_ENV=production pm2 start dist/server/index.js --name funnytalez-backend-prod --instances max

# 7. Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

# 8. Show status
echo "📊 Process status:"
pm2 status

echo "✅ Deployment completed!"
echo ""
echo "Useful commands:"
echo "  pm2 logs funnytalez-backend-prod  # View logs"
echo "  pm2 restart funnytalez-backend-prod  # Restart app"
echo "  pm2 stop funnytalez-backend-prod  # Stop app"