#!/bin/bash

# 🚀 Quick Start Script for Full-Stack E-commerce
# This script helps you deploy your application quickly

set -e  # Exit on error

echo "=================================="
echo "🚀 E-commerce Deployment Helper"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed!${NC}"
    echo "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not available!${NC}"
    echo "Please update Docker Desktop to the latest version"
    exit 1
fi

echo -e "${GREEN}✅ Docker is installed${NC}"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found!${NC}"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANT: Please edit .env file and set your JWT_SECRET!${NC}"
    echo ""
    echo "Generate a secure JWT secret with:"
    echo "  openssl rand -base64 32"
    echo ""
    read -p "Press Enter to continue after updating .env..."
else
    echo -e "${GREEN}✅ .env file exists${NC}"
fi

echo ""
echo "Select deployment mode:"
echo "1) 🏠 Local Development (all services)"
echo "2) 🌐 Production (all services)"
echo "3) 🛑 Stop all services"
echo "4) 🔄 Rebuild and restart"
echo "5) 📊 View logs"
echo "6) 🧹 Clean everything (remove all data)"
echo ""
read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo ""
        echo -e "${BLUE}Starting development environment...${NC}"
        docker compose up -d
        echo ""
        echo -e "${GREEN}✅ Services started!${NC}"
        echo ""
        echo "Access your application:"
        echo "  Frontend: http://localhost (Nginx) or http://localhost:4000 (Direct)"
        echo "  Backend:  http://localhost:5000/api"
        echo "  Swagger:  http://localhost:5000/api-docs"
        echo "  MongoDB:  localhost:27017"
        echo ""
        echo "View logs with: docker compose logs -f"
        ;;
    2)
        echo ""
        echo -e "${BLUE}Starting production environment...${NC}"
        NODE_ENV=production docker compose up -d
        echo ""
        echo -e "${GREEN}✅ Services started in production mode!${NC}"
        echo ""
        echo "Access your application:"
        echo "  Main URL: http://localhost"
        echo "  API:      http://localhost:5000/api"
        echo ""
        ;;
    3)
        echo ""
        echo -e "${BLUE}Stopping all services...${NC}"
        docker compose down
        echo -e "${GREEN}✅ All services stopped${NC}"
        ;;
    4)
        echo ""
        echo -e "${BLUE}Rebuilding and restarting services...${NC}"
        docker compose up -d --build
        echo -e "${GREEN}✅ Services rebuilt and restarted!${NC}"
        ;;
    5)
        echo ""
        echo -e "${BLUE}Viewing logs (Press Ctrl+C to exit)...${NC}"
        docker compose logs -f
        ;;
    6)
        echo ""
        echo -e "${RED}⚠️  WARNING: This will delete all data including database and uploads!${NC}"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            echo -e "${BLUE}Cleaning everything...${NC}"
            docker compose down -v
            docker system prune -f
            echo -e "${GREEN}✅ Everything cleaned!${NC}"
        else
            echo "Cancelled"
        fi
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}Done! 🎉${NC}"
