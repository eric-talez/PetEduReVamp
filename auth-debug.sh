#!/bin/bash

echo "Authentication Error Diagnosis"
echo "============================="

# Check nginx error logs for auth-related issues
echo "1. Recent nginx errors:"
sudo tail -20 /var/log/nginx/error.log | grep -E "(auth|session|cookie|permission)" || echo "No authentication errors in nginx logs"

# Check backend logs for authentication issues
echo ""
echo "2. Backend authentication logs:"
pm2 logs funnytalez-backend-prod --lines 20 | grep -E "(auth|login|session|permission|role)" || echo "No authentication logs found"

# Test authentication endpoints
echo ""
echo "3. Testing authentication endpoints:"
echo "Health check:"
curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health || echo "Health check failed"

echo ""
echo "Auth check:"
curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/auth/check || echo "Auth check failed"

# Check if session store is working
echo ""
echo "4. Session configuration check:"
ps aux | grep node | grep -v grep | head -5

# Check database connectivity for session storage
echo ""
echo "5. Database connection test:"
if pm2 logs funnytalez-backend-prod --lines 50 | grep -q "데이터베이스 연결"; then
    echo "Database connection logs found"
else
    echo "No database connection logs"
fi

echo ""
echo "Quick fixes to try:"
echo "1. sudo ./fix-auth-nginx.sh"
echo "2. pm2 restart funnytalez-backend-prod"
echo "3. Clear browser cookies and try again"