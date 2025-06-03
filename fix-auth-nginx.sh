#!/bin/bash

echo "Fixing nginx authentication errors"
echo "================================="

# Create enhanced nginx configuration for authentication handling
sudo tee /etc/nginx/nginx.conf > /dev/null << 'EOF'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 4096;
    client_max_body_size 100M;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Increase buffer sizes for large headers/cookies
    proxy_buffer_size   128k;
    proxy_buffers   4 256k;
    proxy_busy_buffers_size   256k;
    large_client_header_buffers 4 32k;

    server {
        listen 80 default_server;
        listen [::]:80 default_server;
        server_name _;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;

        # Handle all routes through Node.js backend
        location / {
            proxy_pass http://127.0.0.1:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # Authentication-specific headers
            proxy_set_header Cookie $http_cookie;
            proxy_set_header Authorization $http_authorization;
            
            # Increase timeouts for authentication processing
            proxy_connect_timeout       600s;
            proxy_send_timeout          600s;
            proxy_read_timeout          600s;
            
            # Don't cache authentication responses
            proxy_cache_bypass $http_upgrade;
            proxy_no_cache 1;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }

        # API routes with enhanced error handling
        location /api {
            proxy_pass http://127.0.0.1:5000;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header Cookie $http_cookie;
            proxy_set_header Authorization $http_authorization;
            
            # Handle authentication errors
            proxy_intercept_errors on;
            error_page 401 = @auth_error;
            error_page 403 = @auth_error;
            
            proxy_connect_timeout 30s;
            proxy_send_timeout 30s;
            proxy_read_timeout 30s;
        }

        # Authentication error handler
        location @auth_error {
            add_header Content-Type application/json always;
            return 401 '{"error": "Authentication required", "redirect": "/login"}';
        }

        # WebSocket support for real-time features
        location /ws {
            proxy_pass http://127.0.0.1:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header Cookie $http_cookie;
        }

        # Health check endpoint
        location /health {
            proxy_pass http://127.0.0.1:5000/health;
            access_log off;
        }

        # Custom error pages
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   /usr/share/nginx/html;
        }
        
        # Handle 404 errors by passing to backend
        error_page 404 = @backend_404;
        location @backend_404 {
            proxy_pass http://127.0.0.1:5000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
EOF

# Test and restart nginx
echo "Testing nginx configuration..."
if sudo nginx -t; then
    echo "Configuration valid. Restarting nginx..."
    sudo systemctl restart nginx
    
    echo "Checking if backend is running..."
    if ! pm2 list | grep -q "funnytalez-backend-prod.*online"; then
        echo "Backend not running. Starting..."
        cd /var/www/funnytalez 2>/dev/null || cd /var/www/store_funnytalez
        pm2 restart funnytalez-backend-prod || NODE_ENV=production pm2 start production-start.js --name funnytalez-backend-prod
    fi
    
    echo "Setup complete!"
    echo ""
    echo "Testing connectivity:"
    curl -I http://localhost:5000 2>/dev/null | head -1 || echo "Backend connection test failed"
    
    echo ""
    echo "If you still see nginx errors:"
    echo "1. Check backend logs: pm2 logs funnytalez-backend-prod"
    echo "2. Check nginx logs: sudo tail -f /var/log/nginx/error.log"
    echo "3. Test API directly: curl http://localhost:5000/api/auth/check"
    
else
    echo "Configuration test failed!"
    exit 1
fi