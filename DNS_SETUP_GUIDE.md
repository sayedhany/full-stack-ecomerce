# DNS Configuration Guide for egypt-fisher.com

## Recommended Solution: Point Domain to Your Server

### Step 1: Update DNS Records in Hostinger

1. **Log in to Hostinger Control Panel**
2. **Go to: Domains → Manage → DNS / Name Servers**
3. **Add/Update these DNS records:**

```
Type    Name    Content             TTL
A       @       72.61.18.171        3600
A       www     72.61.18.171        3600
```

**Explanation:**

- `@` points the root domain (egypt-fisher.com) to your server
- `www` points www.egypt-fisher.com to your server
- TTL 3600 = 1 hour (time for DNS to propagate)

### Step 2: Update Your Server Configuration

Since your Angular app runs on port 4000, you need to:

#### Option A: Use Nginx as Reverse Proxy (Recommended)

**Install Nginx on your server:**

```bash
sudo apt update
sudo apt install nginx -y
```

**Create Nginx configuration:**

```nginx
# /etc/nginx/sites-available/egypt-fisher

server {
    listen 80;
    listen [::]:80;

    server_name egypt-fisher.com www.egypt-fisher.com;

    # Redirect HTTP to HTTPS (after SSL setup)
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable the site:**

```bash
sudo ln -s /etc/nginx/sites-available/egypt-fisher /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Option B: Change Angular Port to 80

**Update your Angular configuration:**

- Edit `package.json` to run on port 80
- Requires root/sudo access

### Step 3: Setup SSL Certificate (HTTPS)

**Using Let's Encrypt (Free SSL):**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d egypt-fisher.com -d www.egypt-fisher.com

# Test auto-renewal
sudo certbot renew --dry-run
```

**Nginx will be automatically updated with HTTPS configuration.**

### Step 4: Update Your Application URLs

Update these files with your actual domain:

1. `frontend/public/sitemap.xml`
2. `frontend/public/robots.txt`
3. `frontend/src/environments/environment.prod.ts`

---

## Alternative: Cloudflare Proxy (If Hostinger Doesn't Support Reverse Proxy)

### Step 1: Add Domain to Cloudflare

1. **Sign up at cloudflare.com**
2. **Add site: egypt-fisher.com**
3. **Change nameservers at Hostinger to Cloudflare's nameservers**

### Step 2: Configure Cloudflare DNS

```
Type    Name    Content             Proxy Status
A       @       72.61.18.171        Proxied (orange cloud)
A       www     72.61.18.171        Proxied (orange cloud)
CNAME   api     egypt-fisher.com    Proxied (orange cloud)
```

### Step 3: Cloudflare Page Rules

Create a page rule:

- URL: `egypt-fisher.com/*`
- Setting: Forwarding URL (301)
- Destination: `http://72.61.18.171:4000/$1`

**Benefits:**

- Free SSL certificate
- DDoS protection
- CDN for faster loading
- Analytics

---

## Quick Start (If You Just Want It Working Now)

### Simplest Solution: Use Port 80 Directly

1. **Stop your current Angular server**

2. **Update package.json:**

```json
"scripts": {
  "start": "ng serve --host 0.0.0.0 --port 80"
}
```

3. **Run with sudo (required for port 80):**

```bash
sudo npm start
```

4. **Update DNS at Hostinger:**

```
A    @      72.61.18.171
A    www    72.61.18.171
```

5. **Wait 5-30 minutes for DNS propagation**

6. **Visit:** http://egypt-fisher.com/en

---

## Troubleshooting

### DNS Not Propagating

```bash
# Check if DNS has propagated
nslookup egypt-fisher.com
dig egypt-fisher.com

# Flush local DNS cache (Windows)
ipconfig /flushdns

# Flush local DNS cache (Mac)
sudo dscacheutil -flushcache
```

### Port Issues

```bash
# Check what's using port 80
sudo lsof -i :80
sudo netstat -tulpn | grep :80

# Kill process using port 80
sudo kill -9 <PID>
```

### Firewall Issues

```bash
# Allow port 80 and 443
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

---

## Recommended Final Setup

```
Internet
    ↓
egypt-fisher.com (DNS: 72.61.18.171)
    ↓
Cloudflare (Optional but recommended)
    ↓ Port 80/443
Your Server (72.61.18.171)
    ↓
Nginx (Reverse Proxy)
    ↓ Port 4000
Angular App (Frontend)
    ↓ API calls
Backend (Port 5000)
```

This gives you:
✅ Domain stays as egypt-fisher.com
✅ No visible redirect
✅ HTTPS support
✅ Better security
✅ Professional setup
