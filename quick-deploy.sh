#!/bin/bash

# Quick Deployment Script for egypt-fisher.com
# Run this on your server (72.61.18.171) as root or with sudo

set -e

echo "================================"
echo "Egypt Fisher Quick Setup"
echo "================================"

# 1. Install Nginx
echo "Installing Nginx..."
sudo apt update
sudo apt install nginx -y

# 2. Copy Nginx configuration
echo "Configuring Nginx..."
sudo cp nginx-egypt-fisher.conf /etc/nginx/sites-available/egypt-fisher
sudo ln -sf /etc/nginx/sites-available/egypt-fisher /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 3. Test and restart Nginx
echo "Testing Nginx configuration..."
sudo nginx -t
sudo systemctl restart nginx

# 4. Configure firewall
echo "Configuring firewall..."
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

# 5. Install PM2 (if not installed)
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    sudo npm install -g pm2
fi

# 6. Start applications
echo "Starting applications with PM2..."
cd backend
pm2 start npm --name "egypt-fisher-backend" -- start
cd ../frontend
pm2 start npm --name "egypt-fisher-frontend" -- start

# Save PM2 configuration
pm2 save
pm2 startup systemd

echo ""
echo "================================"
echo "Setup Complete!"
echo "================================"
echo ""
echo "Your site should be accessible at: http://egypt-fisher.com"
echo ""
echo "To install SSL certificate, run:"
echo "  sudo apt install certbot python3-certbot-nginx -y"
echo "  sudo certbot --nginx -d egypt-fisher.com -d www.egypt-fisher.com"
echo ""
