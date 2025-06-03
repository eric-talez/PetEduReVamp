#!/bin/bash

echo "🚀 Production Deployment Script (TypeScript Direct)"
echo "=================================================="

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 2. Create logs directory
mkdir -p logs

# 3. Stop existing PM2 processes
echo "🛑 Stopping existing processes..."
pm2 delete all || true

# 4. Start production server with tsx directly
echo "🚀 Starting production server with tsx..."
NODE_ENV=production pm2 start server/index.ts --name funnytalez-backend-prod --interpreter ./node_modules/.bin/tsx --instances max

# 5. Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

# 6. Show status
echo "📊 Process status:"
pm2 status

echo "✅ Deployment completed!"
echo ""
echo "Useful commands:"
echo "  pm2 logs funnytalez-backend-prod  # View logs"
echo "  pm2 restart funnytalez-backend-prod  # Restart app"
echo "  pm2 stop funnytalez-backend-prod  # Stop app"