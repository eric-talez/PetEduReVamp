#!/bin/bash

echo "Simple Production Deployment"
echo "============================"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Create logs directory
mkdir -p logs

# Stop existing processes
echo "Stopping existing processes..."
pm2 delete funnytalez-backend-prod 2>/dev/null || true

# Start with tsx directly - no compilation needed
echo "Starting production server..."
NODE_ENV=production pm2 start production-start.js --name funnytalez-backend-prod

# Save PM2 config
pm2 save

echo "Deployment complete!"
echo ""
echo "Commands:"
echo "  pm2 logs funnytalez-backend-prod"
echo "  pm2 restart funnytalez-backend-prod"
echo "  pm2 status"