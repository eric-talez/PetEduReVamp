#!/bin/bash

echo "Diagnosing and Fixing 404 Error"
echo "==============================="

# Check if backend is running
echo "1. Checking if Node.js backend is running..."
if pm2 list | grep -q "funnytalez-backend-prod"; then
    echo "✅ Backend process found in PM2"
    pm2 show funnytalez-backend-prod
else
    echo "❌ Backend not running in PM2. Starting now..."
    cd /var/www/funnytalez || cd /var/www/store_funnytalez
    NODE_ENV=production pm2 start production-start.js --name funnytalez-backend-prod
fi

# Check if port 5000 is listening
echo ""
echo "2. Checking if port 5000 is listening..."
if netstat -tlnp | grep -q ":5000"; then
    echo "✅ Port 5000 is listening"
    netstat -tlnp | grep ":5000"
else
    echo "❌ Port 5000 is not listening"
fi

# Check nginx status
echo ""
echo "3. Checking nginx status..."
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx is running"
else
    echo "❌ Nginx is not running. Starting..."
    sudo systemctl start nginx
fi

# Check nginx configuration
echo ""
echo "4. Checking nginx configuration..."
sudo nginx -t

# Check current nginx config
echo ""
echo "5. Current nginx configuration:"
echo "File: /etc/nginx/nginx.conf"
if grep -q "proxy_pass.*5000" /etc/nginx/nginx.conf; then
    echo "✅ Found proxy configuration to port 5000"
else
    echo "❌ No proxy configuration found. Setting up..."
    ./setup-nginx.sh
fi

# Test connectivity
echo ""
echo "6. Testing local connectivity..."
curl -I http://localhost:5000 2>/dev/null | head -1 || echo "❌ Cannot connect to localhost:5000"

# Show process information
echo ""
echo "7. Current processes:"
ps aux | grep -E "(node|nginx)" | grep -v grep

echo ""
echo "8. PM2 process list:"
pm2 list

echo ""
echo "Diagnosis complete. To fix the 404 error:"
echo "1. Run: ./setup-nginx.sh"
echo "2. Ensure backend is running: pm2 restart funnytalez-backend-prod"
echo "3. Check logs: pm2 logs funnytalez-backend-prod"