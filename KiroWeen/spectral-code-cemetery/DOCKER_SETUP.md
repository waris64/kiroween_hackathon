# 🐳 Docker Setup Guide - SPECTRAL Code Cemetery

## Quick Start with Docker

### Prerequisites
- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed (included with Docker Desktop)

---

## 🚀 Running with Docker Compose

### 1. **Clone the Repository**
```bash
git clone https://github.com/waris64/kiroween_hackathon.git
cd kiroween_hackathon/spectral-code-cemetery
```

### 2. **Set Up Environment Variables**
```bash
# Copy example env file
cp backend/.env.example backend/.env

# Edit backend/.env and add your API keys
# Required: GEMINI_API_KEY
```

### 3. **Build and Run**
```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

### 4. **Access the Application**
- **Frontend:** http://localhost
- **Backend API:** http://localhost:3000
- **Health Check:** http://localhost:3000/health

---

## 📦 Docker Commands

### **Start Services**
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Rebuild and start
docker-compose up --build
```

### **Stop Services**
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### **View Logs**
```bash
# View all logs
docker-compose logs

# Follow logs
docker-compose logs -f

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
```

### **Restart Services**
```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### **Check Status**
```bash
# View running containers
docker-compose ps

# View resource usage
docker stats
```

---

## 🏗️ Architecture

### **Services**

#### **Backend (Node.js)**
- **Port:** 3000
- **Container:** spectral-backend
- **Health Check:** http://localhost:3000/health
- **Volumes:**
  - `./backend/temp` - Temporary Git repositories
  - `./backend/logs` - Application logs

#### **Frontend (React + Nginx)**
- **Port:** 80
- **Container:** spectral-frontend
- **Health Check:** http://localhost/
- **Serves:** Static React build via Nginx

### **Network**
- **Name:** spectral-network
- **Type:** Bridge network
- **Purpose:** Internal communication between services

---

## 🔧 Configuration

### **docker-compose.yml**
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - ./backend/.env
    volumes:
      - ./backend/temp:/app/temp
      - ./backend/logs:/app/logs
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      backend:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### **Backend Dockerfile**
- Base: `node:18-alpine`
- Installs production dependencies only
- Exposes port 3000
- Includes health check

### **Frontend Dockerfile**
- Build stage: `node:18-alpine`
- Production stage: `nginx:alpine`
- Serves static files via Nginx
- Includes custom nginx.conf

---

## 🐛 Troubleshooting

### **Port Already in Use**

**Problem:** Port 80 or 3000 is already in use

**Solution:**
```bash
# Option 1: Stop conflicting services
# Windows
netstat -ano | findstr :80
taskkill /PID <PID> /F

# Option 2: Change ports in docker-compose.yml
ports:
  - "8080:80"  # Frontend on port 8080
  - "3001:3000"  # Backend on port 3001
```

### **Build Fails**

**Problem:** Docker build fails

**Solution:**
```bash
# Clean Docker cache
docker-compose down
docker system prune -a

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up
```

### **Backend Can't Connect to API**

**Problem:** Missing GEMINI_API_KEY

**Solution:**
```bash
# Ensure .env file exists
cp backend/.env.example backend/.env

# Add your API key
echo "GEMINI_API_KEY=your_key_here" >> backend/.env

# Restart services
docker-compose restart backend
```

### **Frontend Shows 502 Error**

**Problem:** Backend not ready

**Solution:**
```bash
# Check backend health
docker-compose logs backend

# Wait for backend to be healthy
docker-compose ps

# Restart frontend
docker-compose restart frontend
```

### **Containers Keep Restarting**

**Problem:** Health checks failing

**Solution:**
```bash
# Check logs
docker-compose logs -f

# Inspect health status
docker inspect spectral-backend | grep Health
docker inspect spectral-frontend | grep Health

# Increase health check timeout in docker-compose.yml
healthcheck:
  timeout: 30s
  start_period: 60s
```

---

## 🔍 Health Checks

### **Backend Health Check**
```bash
# Manual check
curl http://localhost:3000/health

# Expected response
{
  "status": "ok",
  "timestamp": "2024-11-29T..."
}
```

### **Frontend Health Check**
```bash
# Manual check
curl http://localhost/

# Should return HTML
```

### **Docker Health Status**
```bash
# Check container health
docker-compose ps

# Detailed health info
docker inspect spectral-backend --format='{{.State.Health.Status}}'
```

---

## 📊 Performance

### **Resource Limits**

Add to docker-compose.yml:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### **Monitoring**
```bash
# Real-time resource usage
docker stats

# Container logs
docker-compose logs -f --tail=100
```

---

## 🚀 Production Deployment

### **Environment Variables**
```bash
# Production .env
NODE_ENV=production
PORT=3000
GEMINI_API_KEY=your_production_key
LOG_LEVEL=error
```

### **SSL/HTTPS**

Add to nginx.conf:
```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    # ... rest of config
}
```

### **Scaling**
```bash
# Scale backend to 3 instances
docker-compose up --scale backend=3

# Load balancer needed for multiple instances
```

---

## 🧹 Cleanup

### **Remove Everything**
```bash
# Stop and remove containers, networks, volumes
docker-compose down -v

# Remove all Docker images
docker rmi $(docker images -q spectral-*)

# Clean system
docker system prune -a --volumes
```

### **Remove Specific Service**
```bash
# Remove backend only
docker-compose rm -s -v backend

# Rebuild backend
docker-compose up --build backend
```

---

## 📝 Development vs Production

### **Development** (Current Setup)
- Hot reload disabled in containers
- Logs visible in console
- Debug mode enabled
- Source maps included

### **Production** (Recommended Changes)
```yaml
# docker-compose.prod.yml
services:
  backend:
    environment:
      - NODE_ENV=production
      - LOG_LEVEL=error
    restart: always
    
  frontend:
    environment:
      - VITE_API_URL=https://api.yourdomain.com
    restart: always
```

---

## 🎯 Quick Reference

### **Common Commands**
```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Logs
docker-compose logs -f

# Restart
docker-compose restart

# Rebuild
docker-compose up --build

# Clean
docker-compose down -v
docker system prune -a
```

### **Useful Aliases**
```bash
# Add to ~/.bashrc or ~/.zshrc
alias dcu='docker-compose up -d'
alias dcd='docker-compose down'
alias dcl='docker-compose logs -f'
alias dcr='docker-compose restart'
alias dcp='docker-compose ps'
```

---

## 🆘 Support

**Issues?**
- Check logs: `docker-compose logs -f`
- Verify health: `docker-compose ps`
- Restart services: `docker-compose restart`
- Clean rebuild: `docker-compose down && docker-compose up --build`

**Still stuck?**
- See TROUBLESHOOTING.md
- Check GitHub Issues
- Contact support

---

**Built with 💜 using Docker for the KiroWeen Hackathon 2025** 🎃🐳
