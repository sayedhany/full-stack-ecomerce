#!/bin/bash

# Script to update frontend API URL for production
# Usage: ./update-api-url.sh YOUR_IP

if [ -z "$1" ]; then
    echo "Usage: ./update-api-url.sh YOUR_SERVER_IP"
    echo "Example: ./update-api-url.sh 72.61.18.171"
    exit 1
fi

SERVER_IP=$1

echo "Updating frontend API URL to: http://${SERVER_IP}:5000"

# Update environment.prod.ts
cat > frontend/src/environments/environment.prod.ts << EOF
export const environment = {
  production: true,
  apiUrl: 'http://${SERVER_IP}:5000',
};
EOF

echo "✅ Updated frontend/src/environments/environment.prod.ts"
echo ""
echo "Next steps:"
echo "1. Commit changes: git add . && git commit -m 'Update production API URL'"
echo "2. Push to GitHub: git push origin master"
echo "3. On server, run: cd ~/full-stack-ecomerce && git pull && docker compose up -d --build ecommerce-frontend"
