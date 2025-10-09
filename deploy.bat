@echo off
REM 🚀 Quick Start Script for Full-Stack E-commerce (Windows)
REM This script helps you deploy your application quickly on Windows

setlocal enabledelayedexpansion

echo ==================================
echo 🚀 E-commerce Deployment Helper
echo ==================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed!
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Check if Docker Compose is available
docker compose version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not available!
    echo Please update Docker Desktop to the latest version
    pause
    exit /b 1
)

echo ✅ Docker is installed
echo.

REM Check if .env file exists
if not exist .env (
    echo ⚠️  .env file not found!
    echo Creating .env from .env.example...
    copy .env.example .env >nul
    echo ✅ .env file created
    echo.
    echo ⚠️  IMPORTANT: Please edit .env file and set your JWT_SECRET!
    echo.
    echo Generate a secure JWT secret with Git Bash:
    echo   openssl rand -base64 32
    echo.
    pause
) else (
    echo ✅ .env file exists
)

echo.
echo Select deployment mode:
echo 1) 🏠 Local Development (all services)
echo 2) 🌐 Production (all services)
echo 3) 🛑 Stop all services
echo 4) 🔄 Rebuild and restart
echo 5) 📊 View logs
echo 6) 🧹 Clean everything (remove all data)
echo 7) 📋 Show service status
echo.
set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" (
    echo.
    echo Starting development environment...
    docker compose up -d
    echo.
    echo ✅ Services started!
    echo.
    echo Access your application:
    echo   Frontend: http://localhost (Nginx) or http://localhost:4000 (Direct)
    echo   Backend:  http://localhost:5000/api
    echo   Swagger:  http://localhost:5000/api-docs
    echo   MongoDB:  localhost:27017
    echo.
    echo View logs with: docker compose logs -f
) else if "%choice%"=="2" (
    echo.
    echo Starting production environment...
    set NODE_ENV=production
    docker compose up -d
    echo.
    echo ✅ Services started in production mode!
    echo.
    echo Access your application:
    echo   Main URL: http://localhost
    echo   API:      http://localhost:5000/api
    echo.
) else if "%choice%"=="3" (
    echo.
    echo Stopping all services...
    docker compose down
    echo ✅ All services stopped
) else if "%choice%"=="4" (
    echo.
    echo Rebuilding and restarting services...
    docker compose up -d --build
    echo ✅ Services rebuilt and restarted!
) else if "%choice%"=="5" (
    echo.
    echo Viewing logs (Press Ctrl+C to exit)...
    docker compose logs -f
) else if "%choice%"=="6" (
    echo.
    echo ⚠️  WARNING: This will delete all data including database and uploads!
    set /p confirm="Are you sure? (yes/no): "
    if "!confirm!"=="yes" (
        echo Cleaning everything...
        docker compose down -v
        docker system prune -f
        echo ✅ Everything cleaned!
    ) else (
        echo Cancelled
    )
) else if "%choice%"=="7" (
    echo.
    echo Service Status:
    docker compose ps
    echo.
) else (
    echo ❌ Invalid choice
    pause
    exit /b 1
)

echo.
echo Done! 🎉
echo.
pause
