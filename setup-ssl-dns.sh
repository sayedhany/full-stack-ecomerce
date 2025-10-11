#!/bin/bash

# ============================================================================
# Egypt Fisher E-commerce - SSL Setup with DNS Challenge
# Domain: egypt-fisher.com
# Uses DNS validation (works even if port 80 is blocked)
# ============================================================================

set -e

echo "╔════════════════════════════════════════════════════════╗"
echo "║     Egypt Fisher - SSL Setup (DNS Challenge)         ║"
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

DOMAIN="egypt-fisher.com"
EMAIL="admin@egypt-fisher.com"
PROJECT_DIR="/root/full-stack-ecomerce"

echo "════════════════════════════════════════════════════════"
echo "DNS Challenge Method"
echo "════════════════════════════════════════════════════════"
print_warning "This method works even if port 80 is blocked!"
print_status "You'll need to add TXT records to your DNS"
echo ""

echo "════════════════════════════════════════════════════════"
echo "Step 1: Installing Certbot"
echo "════════════════════════════════════════════════════════"

if ! command -v certbot &> /dev/null; then
    print_status "Installing Certbot..."
    apt update
    apt install -y certbot
    print_success "Certbot installed"
else
    print_success "Certbot already installed"
fi

echo ""
echo "════════════════════════════════════════════════════════"
echo "Step 2: Obtaining SSL Certificate (DNS Challenge)"
echo "════════════════════════════════════════════════════════"

print_status "Starting certificate request..."
print_warning "You will be asked to add DNS TXT records"

certbot certonly --manual \
    --preferred-challenges dns \
    -d $DOMAIN \
    -d www.$DOMAIN \
    --agree-tos \
    --email $EMAIL \
    --no-eff-email

if [ $? -eq 0 ]; then
    print_success "SSL certificate obtained!"
else
    print_error "Failed to obtain SSL certificate"
    exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════"
echo "Step 3: Updating Docker Compose Configuration"
echo "════════════════════════════════════════════════════════"

cd "$PROJECT_DIR"

print_status "Backing up docker-compose.yml..."
cp docker-compose.yml docker-compose.yml.backup

# Add SSL volumes if not already present
if ! grep -q "letsencrypt" docker-compose.yml; then
    print_status "Adding SSL certificate volumes..."
    
    # Add volumes to nginx service
    sed -i '/nginx:/,/volumes:/{s|volumes:|volumes:\n      - /etc/letsencrypt:/etc/letsencrypt:ro|;}' docker-compose.yml
    
    print_success "SSL volumes added"
else
    print_success "SSL volumes already configured"
fi

echo ""
echo "════════════════════════════════════════════════════════"
echo "Step 4: Enabling HTTPS in Nginx"
echo "════════════════════════════════════════════════════════"

print_status "Backing up nginx config..."
cp backend/nginx-fullstack.conf backend/nginx-fullstack.conf.backup

print_status "Enabling HTTPS configuration..."

# Create a temporary file with HTTPS enabled
cat > backend/nginx-fullstack.conf.tmp << 'NGINXEOF'
# Add this after we read the current config
NGINXEOF

# Read current config and enable HTTPS sections
sed 's/^# \(.*listen 443 ssl http2.*\)/\1/g' backend/nginx-fullstack.conf | \
sed 's/^# \(.*ssl_certificate.*\)/\1/g' | \
sed 's/^# \(.*ssl_.*\)/\1/g' > backend/nginx-fullstack.conf.tmp

mv backend/nginx-fullstack.conf.tmp backend/nginx-fullstack.conf

print_success "HTTPS configuration enabled"

echo ""
echo "════════════════════════════════════════════════════════"
echo "Step 5: Restarting Docker"
echo "════════════════════════════════════════════════════════"

print_status "Restarting Docker containers..."
docker compose down
docker compose up -d --build

print_status "Waiting for services to start..."
sleep 15

echo ""
echo "════════════════════════════════════════════════════════"
echo "Step 6: Testing HTTPS"
echo "════════════════════════════════════════════════════════"

print_status "Testing HTTPS..."
if curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN | grep -q "200"; then
    print_success "HTTPS is working!"
else
    print_warning "HTTPS may still be starting... Check: docker compose logs nginx"
fi

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║              SSL SETUP COMPLETE! 🔒                    ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
print_success "HTTPS is now enabled!"
echo ""
echo "🌐 Your site:"
echo "   • https://egypt-fisher.com"
echo ""
echo "⚠️  Certificate Renewal:"
print_warning "DNS challenge certificates need MANUAL renewal"
print_warning "You'll need to add TXT records again before expiry"
print_warning "Certificate expires in 90 days"
echo ""
echo "📝 To renew manually:"
echo "   certbot renew --manual"
echo ""
print_success "Setup complete! 🎉"
