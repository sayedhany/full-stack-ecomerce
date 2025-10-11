#!/bin/bash

# ============================================================================
# Egypt Fisher E-commerce - Docker Deployment Script
# Domain: egypt-fisher.com
# ============================================================================

set -e

echo "╔════════════════════════════════════════════════════════╗"
echo "║          Egypt Fisher - Docker Deployment             ║"
echo "║              egypt-fisher.com                          ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[✓]${NC} $1"; }
print_error() { echo -e "${RED}[✗]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[!]${NC} $1"; }

# Check root
if [ "$EUID" -ne 0 ]; then 
    print_error "Please run as root or with sudo"
    exit 1
fi

PROJECT_DIR="/root/full-stack-ecomerce"

echo "════════════════════════════════════════════════════════"
echo "Step 1: Stopping Conflicting Services"
echo "════════════════════════════════════════════════════════"

# Stop PM2
if command -v pm2 &> /dev/null; then
    print_status "Stopping PM2..."
    pm2 stop all 2>/dev/null || true
    pm2 delete all 2>/dev/null || true
    print_success "PM2 stopped"
fi

# Stop Nginx
if systemctl is-active --quiet nginx; then
    print_status "Stopping Nginx..."
    systemctl stop nginx
    systemctl disable nginx 2>/dev/null || true
    print_success "Nginx stopped"
fi

# Free port 80
print_status "Freeing port 80..."
fuser -k 80/tcp 2>/dev/null || true
sleep 2
print_success "Port 80 freed"

echo ""
echo "════════════════════════════════════════════════════════"
echo "Step 2: Checking Docker Installation"
echo "════════════════════════════════════════════════════════"

if ! command -v docker &> /dev/null; then
    print_error "Docker not found. Installing Docker..."
    
    # Install Docker
    apt update
    apt install -y ca-certificates curl gnupg lsb-release
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt update
    apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    systemctl start docker
    systemctl enable docker
    print_success "Docker installed"
else
    print_success "Docker already installed ($(docker --version))"
fi

echo ""
echo "════════════════════════════════════════════════════════"
echo "Step 3: Navigating to Project"
echo "════════════════════════════════════════════════════════"

if [ ! -d "$PROJECT_DIR" ]; then
    print_error "Project directory not found: $PROJECT_DIR"
    exit 1
fi

cd "$PROJECT_DIR"
print_success "In project directory: $(pwd)"

echo ""
echo "════════════════════════════════════════════════════════"
echo "Step 4: Stopping Existing Containers"
echo "════════════════════════════════════════════════════════"

print_status "Stopping containers..."
docker compose down 2>/dev/null || true
print_success "Containers stopped"

echo ""
echo "════════════════════════════════════════════════════════"
echo "Step 5: Building and Starting Containers"
echo "════════════════════════════════════════════════════════"

print_status "Building and starting services..."
docker compose up -d --build

print_status "Waiting for services to be healthy..."
sleep 15

echo ""
echo "════════════════════════════════════════════════════════"
echo "Step 6: Checking Container Status"
echo "════════════════════════════════════════════════════════"

docker compose ps

echo ""
echo "════════════════════════════════════════════════════════"
echo "Step 7: Testing Services"
echo "════════════════════════════════════════════════════════"

# Test HTTP
print_status "Testing HTTP..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "200\|301\|302"; then
    print_success "HTTP server responding"
else
    print_warning "HTTP server may still be starting..."
fi

# Test Backend API
print_status "Testing Backend API..."
if curl -s http://localhost:5000/api/categories &> /dev/null; then
    print_success "Backend API responding"
else
    print_warning "Backend API may still be starting..."
fi

echo ""
echo "════════════════════════════════════════════════════════"
echo "Step 8: DNS Check"
echo "════════════════════════════════════════════════════════"

DNS_IP=$(nslookup egypt-fisher.com 2>/dev/null | grep -A1 "Name:" | grep "Address:" | awk '{print $2}' | head -1)
if [ -n "$DNS_IP" ]; then
    print_success "DNS resolves to: $DNS_IP"
    if [ "$DNS_IP" = "72.61.18.171" ]; then
        print_success "DNS correctly pointing to server!"
    else
        print_warning "DNS points to $DNS_IP (expected: 72.61.18.171)"
    fi
else
    print_warning "DNS not yet resolved for egypt-fisher.com"
fi

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║              DEPLOYMENT COMPLETE! ✓                    ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
print_success "Docker containers are running!"
echo ""
echo "🌐 Your site is accessible at:"
echo "   • http://egypt-fisher.com"
echo "   • http://72.61.18.171"
echo ""
echo "📊 Useful Commands:"
echo "   docker compose ps              - Check status"
echo "   docker compose logs -f         - View all logs"
echo "   docker compose logs -f nginx   - View Nginx logs"
echo "   docker compose logs -f ecommerce-backend - View API logs"
echo "   docker compose logs -f ecommerce-frontend - View frontend logs"
echo "   docker compose restart         - Restart all services"
echo "   docker compose down            - Stop all services"
echo "   docker compose up -d           - Start all services"
echo ""
echo "🔒 To enable HTTPS with SSL:"
echo "   1. Ensure DNS is pointing to this server"
echo "   2. Run: ./setup-ssl.sh"
echo ""
echo "📝 Logs location:"
echo "   docker compose logs -f"
echo ""
print_success "Deployment completed successfully! 🎉"
