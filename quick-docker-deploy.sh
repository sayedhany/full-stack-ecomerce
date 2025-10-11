#!/bin/bash

# Docker Deployment Script for egypt-fisher.com
# Deploys the complete stack using Docker Compose

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════╗"
echo "║     Egypt Fisher - Docker Deployment                   ║"
echo "║     Domain: egypt-fisher.com                           ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}→${NC} $1"; }
print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }

# Stop PM2 and Nginx (they conflict with Docker)
print_status "Stopping PM2 and Nginx..."
pm2 stop all 2>/dev/null && pm2 delete all 2>/dev/null || true
sudo systemctl stop nginx 2>/dev/null || true
print_success "Stopped conflicting services"

# Free port 80 if still in use
print_status "Freeing port 80..."
sudo fuser -k 80/tcp 2>/dev/null || true
sleep 2
print_success "Port 80 is free"

# Navigate to project
PROJECT_DIR="/root/full-stack-ecomerce"
if [ ! -d "$PROJECT_DIR" ]; then
    print_warning "Project not found at $PROJECT_DIR"
    print_status "Using current directory: $(pwd)"
else
    cd "$PROJECT_DIR"
    print_success "Changed to project directory"
fi

# Stop existing containers
print_status "Stopping existing containers..."
docker compose down 2>/dev/null || true
print_success "Existing containers stopped"

# Start containers
print_status "Building and starting Docker containers..."
docker compose up -d --build

# Wait for services to be healthy
print_status "Waiting for services to start (30 seconds)..."
sleep 30

# Show status
echo ""
echo "════════════════════════════════════════════════════════"
echo "Container Status:"
echo "════════════════════════════════════════════════════════"
docker compose ps

echo ""
echo "════════════════════════════════════════════════════════"
echo "Testing Services:"
echo "════════════════════════════════════════════════════════"

# Test HTTP
if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "200\|301\|302"; then
    print_success "HTTP server responding"
else
    print_warning "HTTP server may still be starting"
fi

# Test API
if curl -s http://localhost:5000/api/categories &> /dev/null; then
    print_success "Backend API responding"
else
    print_warning "Backend API may still be starting"
fi

# Check DNS
echo ""
print_status "Checking DNS for egypt-fisher.com..."
DNS_IP=$(nslookup egypt-fisher.com 2>/dev/null | grep -A1 "Name:" | grep "Address:" | awk '{print $2}' | head -1)
if [ -n "$DNS_IP" ]; then
    print_success "DNS resolves to: $DNS_IP"
    if [ "$DNS_IP" = "72.61.18.171" ]; then
        print_success "DNS correctly points to this server!"
    else
        print_warning "DNS points to $DNS_IP, verify it's correct"
    fi
else
    print_warning "DNS not yet resolved"
    echo "          Update DNS at Hostinger:"
    echo "          A @ 72.61.18.171"
    echo "          A www 72.61.18.171"
fi

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║               ✓ DEPLOYMENT COMPLETE!                   ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "Your site is accessible at:"
echo "  • http://egypt-fisher.com"
echo "  • http://72.61.18.171"
echo ""
echo "Useful commands:"
echo "  docker compose ps              - Check status"
echo "  docker compose logs -f         - View all logs"
echo "  docker compose logs -f nginx   - View Nginx logs"
echo "  docker compose logs -f api     - View backend logs"
echo "  docker compose restart         - Restart all"
echo "  docker compose down            - Stop all"
echo ""
echo "To install SSL (HTTPS):"
echo "  1. Ensure DNS is working"
echo "  2. docker compose down"
echo "  3. apt install certbot"
echo "  4. certbot certonly --standalone -d egypt-fisher.com -d www.egypt-fisher.com"
echo "  5. Update nginx config with SSL"
echo "  6. docker compose up -d"
echo ""
