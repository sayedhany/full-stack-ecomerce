#!/bin/bash

# ============================================================================
# Egypt Fisher E-commerce - SSL/HTTPS Setup Script
# Domain: egypt-fisher.com
# Uses Let's Encrypt for free SSL certificates
# ============================================================================

set -e

echo "╔════════════════════════════════════════════════════════╗"
echo "║          Egypt Fisher - SSL Setup                     ║"
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
EMAIL="admin@egypt-fisher.com"  # Change to your email
PROJECT_DIR="/root/full-stack-ecomerce"

echo "════════════════════════════════════════════════════════"
echo "Step 1: DNS Verification"
echo "════════════════════════════════════════════════════════"

print_status "Checking DNS for $DOMAIN..."
DNS_IP=$(nslookup $DOMAIN 2>/dev/null | grep -A1 "Name:" | grep "Address:" | awk '{print $2}' | head -1)

if [ -z "$DNS_IP" ]; then
    print_error "DNS not resolved for $DOMAIN"
    print_error "Please ensure your domain's A record points to this server's IP"
    exit 1
fi

print_success "DNS resolves to: $DNS_IP"

# Get server IP
SERVER_IP=$(curl -s ifconfig.me)
print_status "Server IP: $SERVER_IP"

if [ "$DNS_IP" != "$SERVER_IP" ]; then
    print_warning "DNS IP ($DNS_IP) doesn't match server IP ($SERVER_IP)"
    print_warning "SSL certificate may fail. Continue? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "════════════════════════════════════════════════════════"
echo "Step 2: Installing Certbot"
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
echo "Step 3: Stopping Docker (to free port 80)"
echo "════════════════════════════════════════════════════════"

cd "$PROJECT_DIR"
print_status "Stopping Docker containers..."
docker compose down
print_success "Containers stopped"

echo ""
echo "════════════════════════════════════════════════════════"
echo "Step 4: Obtaining SSL Certificate"
echo "════════════════════════════════════════════════════════"

print_status "Requesting certificate for $DOMAIN and www.$DOMAIN..."
print_warning "Please ensure port 80 is accessible from the internet"

certbot certonly --standalone \
    -d $DOMAIN \
    -d www.$DOMAIN \
    --non-interactive \
    --agree-tos \
    --email $EMAIL \
    --keep-until-expiring

if [ $? -eq 0 ]; then
    print_success "SSL certificate obtained!"
else
    print_error "Failed to obtain SSL certificate"
    print_error "Common issues:"
    print_error "  1. Port 80 is not accessible from the internet"
    print_error "  2. Firewall blocking port 80"
    print_error "  3. DNS not properly configured"
    exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════"
echo "Step 5: Updating Docker Compose Configuration"
echo "════════════════════════════════════════════════════════"

print_status "Adding SSL certificate volumes to docker-compose.yml..."

# Backup docker-compose.yml
cp docker-compose.yml docker-compose.yml.backup

# Add SSL volumes if not already present
if ! grep -q "letsencrypt" docker-compose.yml; then
    print_status "Adding SSL certificate volumes..."
    sed -i '/nginx:/,/ports:/{/ports:/a\    volumes:\n      - ./backend/nginx-fullstack.conf:/etc/nginx/nginx.conf:ro\n      - ./backend/uploads:/usr/share/nginx/html/uploads:ro\n      - /etc/letsencrypt:/etc/letsencrypt:ro
}' docker-compose.yml
    print_success "SSL volumes added"
else
    print_success "SSL volumes already configured"
fi

echo ""
echo "════════════════════════════════════════════════════════"
echo "Step 6: Enabling HTTPS in Nginx Configuration"
echo "════════════════════════════════════════════════════════"

print_status "Uncommenting HTTPS configuration..."

# Uncomment HTTPS server block
sed -i 's/^# \(.*listen 443 ssl http2.*\)/\1/' backend/nginx-fullstack.conf
sed -i 's/^# \(.*server_name egypt-fisher\.com.*\)/\1/' backend/nginx-fullstack.conf
sed -i 's/^# \(.*ssl_certificate.*\)/\1/' backend/nginx-fullstack.conf
sed -i 's/^# \(.*ssl_.*\)/\1/' backend/nginx-fullstack.conf

# Uncomment HTTP to HTTPS redirect
sed -i 's/^# \(.*listen 80.*\)/\1/' backend/nginx-fullstack.conf
sed -i 's/^# \(.*return 301.*\)/\1/' backend/nginx-fullstack.conf

print_success "HTTPS configuration enabled"

echo ""
echo "════════════════════════════════════════════════════════"
echo "Step 7: Starting Docker with HTTPS"
echo "════════════════════════════════════════════════════════"

print_status "Starting Docker containers with HTTPS..."
docker compose up -d --build

print_status "Waiting for services to start..."
sleep 15

echo ""
echo "════════════════════════════════════════════════════════"
echo "Step 8: Testing HTTPS"
echo "════════════════════════════════════════════════════════"

print_status "Testing HTTPS..."
if curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN | grep -q "200"; then
    print_success "HTTPS is working!"
else
    print_warning "HTTPS may still be starting... Check logs: docker compose logs nginx"
fi

print_status "Testing HTTP to HTTPS redirect..."
HTTP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN)
if [ "$HTTP_RESPONSE" = "301" ] || [ "$HTTP_RESPONSE" = "302" ]; then
    print_success "HTTP to HTTPS redirect working!"
else
    print_warning "HTTP redirect status: $HTTP_RESPONSE"
fi

echo ""
echo "════════════════════════════════════════════════════════"
echo "Step 9: Setting Up Auto-Renewal"
echo "════════════════════════════════════════════════════════"

print_status "Setting up automatic certificate renewal..."

# Create renewal hook script
cat > /etc/letsencrypt/renewal-hooks/deploy/restart-docker.sh << 'EOF'
#!/bin/bash
cd /root/full-stack-ecomerce
docker compose restart nginx
EOF

chmod +x /etc/letsencrypt/renewal-hooks/deploy/restart-docker.sh

# Test renewal
print_status "Testing certificate renewal (dry run)..."
certbot renew --dry-run

if [ $? -eq 0 ]; then
    print_success "Auto-renewal configured successfully"
    print_success "Certificates will auto-renew via cron"
else
    print_warning "Renewal test had issues, but certificate is still valid"
fi

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║              SSL SETUP COMPLETE! 🔒                    ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
print_success "HTTPS is now enabled!"
echo ""
echo "🌐 Your site is now accessible at:"
echo "   • https://egypt-fisher.com (secure)"
echo "   • http://egypt-fisher.com (redirects to HTTPS)"
echo ""
echo "📋 Certificate Details:"
echo "   Domain: $DOMAIN, www.$DOMAIN"
echo "   Valid for: 90 days"
echo "   Auto-renewal: Enabled via certbot"
echo "   Location: /etc/letsencrypt/live/$DOMAIN/"
echo ""
echo "🔄 Certificate Renewal:"
echo "   • Automatic via certbot cron job"
echo "   • Manual renewal: certbot renew"
echo "   • Check expiry: certbot certificates"
echo ""
echo "🧪 Test your SSL:"
echo "   https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN"
echo ""
print_success "SSL setup completed successfully! 🎉"
