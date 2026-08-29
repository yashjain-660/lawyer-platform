# The Web Vale - Detailed Deployment Procedures

This guide provides step-by-step procedures for deploying The Web Vale to production.

## Table of Contents

1. [Pre-Deployment Setup](#pre-deployment-setup)
2. [Infrastructure Preparation](#infrastructure-preparation)
3. [Configuration Management](#configuration-management)
4. [SSL/TLS Setup](#ssltls-setup)
5. [Docker Deployment](#docker-deployment)
6. [Service Verification](#service-verification)
7. [Post-Deployment Tasks](#post-deployment-tasks)
8. [Maintenance Procedures](#maintenance-procedures)
9. [Troubleshooting](#troubleshooting)

## Pre-Deployment Setup

### 1.1 Access Server

```bash
# SSH into production server
ssh -i ~/.ssh/deploy_key ops@production.thewebvale.com

# Verify OS
uname -a
lsb_release -a

# Check system resources
free -h        # Memory
df -h          # Disk
nproc          # CPU cores
```

**Expected Output**:
- OS: Ubuntu 20.04 LTS or later
- Memory: 8GB+
- Disk: 100GB+
- CPU: 4+ cores

### 1.2 Install System Dependencies

```bash
# Update package lists
sudo apt-get update
sudo apt-get upgrade -y

# Install essential packages
sudo apt-get install -y \
    curl \
    wget \
    git \
    htop \
    net-tools \
    jq \
    unzip \
    openssl

# Verify installations
docker --version
docker-compose --version
```

### 1.3 Clone Repository

```bash
# Navigate to home directory
cd /home/opc

# Clone repository (if not already done)
git clone https://github.com/yourusername/lawyer-platform.git
cd lawyer-platform

# Pull latest code
git pull origin main

# Navigate to deployment directory
cd deployment

# List files to verify
ls -la

# Expected files:
# - .env.webvale
# - docker-compose.webvale.yml
# - nginx.webvale.conf
# - init.sql
# - deploy-webvale.sh
# - DEPLOYMENT_*.md
```

## Infrastructure Preparation

### 2.1 Firewall Configuration

```bash
# Check UFW status
sudo ufw status

# Enable UFW if not already enabled
sudo ufw enable

# Allow SSH (CRITICAL - do this first!)
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Check final status
sudo ufw status

# Expected output:
# 22/tcp    ALLOW      Anywhere
# 80/tcp    ALLOW      Anywhere
# 443/tcp   ALLOW      Anywhere
```

**⚠️ CRITICAL**: Always allow SSH before enabling firewall, or you'll be locked out.

### 2.2 DNS Configuration

```bash
# Test DNS resolution
dig thewebvale.com +short
dig *.thewebvale.com +short
nslookup thewebvale.com

# Expected output:
# A records pointing to server IP
# (e.g., 203.0.113.42)

# Test DNS propagation (may take 24-48 hours)
timeout 300 bash -c 'until nslookup thewebvale.com | grep -q "203.0.113.42"; do echo "Waiting for DNS..."; sleep 10; done'
```

### 2.3 SSL/TLS Preparation

```bash
# Create SSL directory structure
mkdir -p ssl/certificates
chmod 700 ssl

# Test Let's Encrypt connectivity
curl -s https://acme-v02.api.letsencrypt.org/directory | jq '.meta.termsOfService'

# Expected output:
# "https://letsencrypt.org/documents/LE-SA-v1.2.1-November-15-2017.pdf"
```

## Configuration Management

### 3.1 Environment Variables

```bash
# Create .env.webvale if not exists
nano .env.webvale

# Critical variables to set:
```

**Required Credentials** (fill in with real values):

```bash
# Database
DB_PASSWORD=<Generate: openssl rand -base64 32>
REDIS_PASSWORD=<Generate: openssl rand -base64 24>

# Security
JWT_SECRET=<Generate: openssl rand -base64 48>
SESSION_SECRET=<Generate: openssl rand -base64 48>
ENCRYPTION_KEY=<Generate: openssl rand -hex 32>
ADMIN_PASSWORD=<Generate: openssl rand -base64 32>

# API Keys (from respective services)
SENDGRID_API_KEY=SG.XXXXX...
RAZORPAY_KEY_ID=rzp_live_XXXXX...
RAZORPAY_KEY_SECRET=XXXXX...
STRIPE_SECRET_KEY=sk_live_XXXXX...
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=XXXXX...

# Configuration
CORS_ORIGINS=https://advocate-legal.thewebvale.com,https://admin.advocate-legal.thewebvale.com
S3_BUCKET_NAME=webvale-production-files
AWS_REGION=us-east-1
ADMIN_EMAIL=admin@thewebvale.com
```

### 3.2 Verify Configuration

```bash
# Check environment file
cat .env.webvale | grep -v "^#" | sort

# Verify no "REPLACE_WITH_" values remain
grep "REPLACE_WITH_" .env.webvale && echo "ERROR: Incomplete configuration" || echo "✓ Configuration complete"

# Verify sensitive files are not world-readable
ls -l .env.webvale
chmod 600 .env.webvale

# Verify .gitignore includes .env.webvale
cat ../.gitignore | grep ".env.webvale"
```

## SSL/TLS Setup

### 4.1 Option A: Let's Encrypt (Recommended)

```bash
# Install certbot
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# Request certificate (DNS must be configured first)
sudo certbot certonly --standalone \
    -d thewebvale.com \
    -d "*.thewebvale.com" \
    --email admin@thewebvale.com \
    --agree-tos \
    --non-interactive \
    --preferred-challenges dns

# Copy certificates to deployment directory
SSL_DIR="$PWD/ssl/certificates"
CERT_PATH="/etc/letsencrypt/live/thewebvale.com"

sudo cp "$CERT_PATH/fullchain.pem" "$SSL_DIR/cert.pem"
sudo cp "$CERT_PATH/privkey.pem" "$SSL_DIR/key.pem"

# Fix permissions
sudo chown $USER:$USER "$SSL_DIR"/*.pem
chmod 600 "$SSL_DIR"/*.pem
chmod 644 "$SSL_DIR/cert.pem"

# Verify certificates
openssl x509 -in "$SSL_DIR/cert.pem" -noout -text | head -20
```

### 4.2 Option B: Self-Signed (Testing Only)

```bash
# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 \
    -keyout ssl/certificates/key.pem \
    -out ssl/certificates/cert.pem \
    -days 365 -nodes \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=thewebvale.com"

# Fix permissions
chmod 600 ssl/certificates/key.pem
chmod 644 ssl/certificates/cert.pem
```

### 4.3 Generate DH Parameters

```bash
# Generate Diffie-Hellman parameters (2048-bit)
# This takes 2-5 minutes
openssl dhparam -out ssl/dhparam.pem 2048

# Verify
ls -la ssl/dhparam.pem

# Expected: ~424 bytes
```

### 4.4 Certificate Renewal (Let's Encrypt)

```bash
# Add to crontab for automatic renewal
# Certbot automatically renews 30 days before expiration
sudo crontab -e

# Add this line:
0 0 * * * certbot renew --quiet --post-hook "docker-compose -f /home/opc/lawyer-platform/deployment/docker-compose.webvale.yml restart nginx"
```

## Docker Deployment

### 5.1 Run Setup Script

```bash
# Run setup to create directories and verify prerequisites
sudo ./deploy-webvale.sh setup

# Expected output:
# ✓ Prerequisites check passed
# ✓ Directory structure created
# ✓ Setup completed successfully

# Verify directories created
ls -la | grep -E "logs|backups|ssl"
find . -type d -name "logs" -o -type d -name "backups"
```

### 5.2 Build Docker Images

```bash
# Build all images (takes 10-20 minutes)
sudo ./deploy-webvale.sh build

# Monitor build progress
docker images | grep webvale

# Expected images after build:
# webvale/backend:latest
# webvale/frontend:latest
# webvale/admin:latest
```

### 5.3 Start Database Services

```bash
# Start just database services first
docker-compose -f docker-compose.webvale.yml \
    --env-file .env.webvale \
    up -d postgres redis

# Wait for services to be healthy
sleep 10

# Check status
docker-compose -f docker-compose.webvale.yml \
    --env-file .env.webvale \
    ps

# Expected:
# webvale-postgres-prod   Up (healthy)
# webvale-redis-prod      Up (healthy)
```

### 5.4 Verify Database Initialization

```bash
# Check database was created
docker exec webvale-postgres-prod \
    psql -U webvale_app -d webvale_production -c "\dt"

# Expected: List of tables (users, cases, documents, etc.)

# Verify initial admin user
docker exec webvale-postgres-prod \
    psql -U webvale_app -d webvale_production \
    -c "SELECT id, email, role FROM users LIMIT 1;"

# Expected: Initial admin user created
```

### 5.5 Start All Services

```bash
# Start all services
sudo ./deploy-webvale.sh start

# This starts:
# - PostgreSQL (already running)
# - Redis (already running)
# - Backend API
# - Frontend
# - Admin Panel
# - Nginx

# Wait for all services to be healthy
sleep 10

# Check status
sudo ./deploy-webvale.sh status

# Expected:
# webvale-postgres-prod       Up
# webvale-redis-prod          Up
# webvale-backend-prod        Up
# webvale-frontend-prod       Up
# webvale-admin-prod          Up
# webvale-nginx-prod          Up
```

## Service Verification

### 6.1 Health Checks

```bash
# Run comprehensive health checks
sudo ./deploy-webvale.sh health

# Expected output:
# [SUCCESS] PostgreSQL is healthy
# [SUCCESS] Redis is healthy
# [SUCCESS] Backend API is healthy
# [SUCCESS] Frontend is healthy
# [SUCCESS] Admin Panel is healthy
# [SUCCESS] Nginx is healthy
# [SUCCESS] All health checks passed
```

### 6.2 Service-Specific Verification

```bash
# Backend API
curl -s http://localhost:5000/health | jq .
# Expected: {"status":"ok","timestamp":"...","uptime":...}

# Frontend
curl -s http://localhost:3000 | grep -o "<title>.*</title>"
# Expected: <title>The Web Vale - Legal Services Platform</title>

# Admin Panel
curl -s http://localhost:3001 | grep -o "<title>.*</title>"
# Expected: <title>Web Vale Admin</title>

# Nginx Reverse Proxy
curl -sI http://localhost/health
# Expected: HTTP/1.1 200 OK
```

### 6.3 Verify SSL/TLS

```bash
# Test SSL connection
openssl s_client -connect localhost:443 -showcerts < /dev/null | head -20

# Expected:
# - Certificate chain shown
# - TLSv1.2 or TLSv1.3
# - No errors

# Verify security headers
curl -sI https://localhost/health 2>/dev/null | grep -i "strict-transport\|x-frame\|content-security"

# Expected headers:
# Strict-Transport-Security: max-age=31536000
# X-Frame-Options: SAMEORIGIN
# Content-Security-Policy: ...
```

### 6.4 Database Connection Test

```bash
# Test database connectivity from backend
docker exec webvale-backend-prod \
    npx ts-node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL)"

# Expected: Connection string printed

# Test actual database query
docker exec webvale-postgres-prod \
    psql -U webvale_app -d webvale_production \
    -c "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema='public';"

# Expected: table_count should be > 10
```

## Post-Deployment Tasks

### 7.1 Create Initial Backup

```bash
# Create first backup
sudo ./deploy-webvale.sh backup

# Verify backup created
sudo ./deploy-webvale.sh backups

# Expected:
# /home/opc/lawyer-platform/deployment/backups/database_backup_20260828_HHMMSS.sql.gz (Size)

# Test backup integrity
backup_file=$(ls -t backups/database_backup_*.sql.gz | head -1)
gunzip -t "$backup_file" && echo "✓ Backup is valid" || echo "✗ Backup is corrupted"
```

### 7.2 Setup Backup Automation

```bash
# Edit crontab
sudo crontab -e

# Add daily backup at 2 AM:
0 2 * * * cd /home/opc/lawyer-platform/deployment && sudo ./deploy-webvale.sh backup >> /var/log/webvale-backup.log 2>&1

# Verify cron job added
sudo crontab -l | grep webvale
```

### 7.3 Verify Domain Access

```bash
# Wait for DNS to propagate (may take 24-48 hours)

# Test domain resolution
dig thewebvale.com +short
dig api.thewebvale.com +short

# Test HTTPS access
curl -sI https://thewebvale.com | head -5
curl -sI https://api.thewebvale.com/api/health | head -5

# Expected:
# HTTP/2 200
# SSL certificate valid
# No warnings
```

### 7.4 Admin Panel Login

```bash
# Get admin password from .env.webvale
grep ADMIN_PASSWORD .env.webvale

# In browser:
# 1. Navigate to https://admin.thewebvale.com
# 2. Login with:
#    - Email: admin@thewebvale.com
#    - Password: [from above]
# 3. Verify dashboard loads without errors

# Test creating an organization:
# 1. Click "New Organization"
# 2. Fill in details
# 3. Create organization
# 4. Verify subdomain accessible
```

## Maintenance Procedures

### 8.1 View Logs

```bash
# View all logs
sudo ./deploy-webvale.sh logs

# View specific service logs
sudo ./deploy-webvale.sh logs backend 100
sudo ./deploy-webvale.sh logs nginx 50
sudo ./deploy-webvale.sh logs postgres 50

# Follow logs in real-time
sudo ./deploy-webvale.sh logs backend -f

# Filter logs by pattern
docker logs webvale-backend-prod | grep ERROR
docker logs webvale-nginx-prod | grep 5xx
```

### 8.2 Monitor Resources

```bash
# Real-time resource monitoring
docker stats

# Check disk usage
df -h

# Check memory usage
free -h

# Check process status
ps aux | grep docker

# Show container details
docker inspect webvale-backend-prod | jq '.State'
```

### 8.3 Database Maintenance

```bash
# Vacuum database (reclaim space)
docker exec webvale-postgres-prod \
    psql -U webvale_app -d webvale_production -c "VACUUM ANALYZE;"

# Check database size
docker exec webvale-postgres-prod \
    psql -U webvale_app -d webvale_production \
    -c "SELECT pg_size_pretty(pg_database_size('webvale_production'));"

# List all indexes
docker exec webvale-postgres-prod \
    psql -U webvale_app -d webvale_production \
    -c "\di"
```

### 8.4 Restart Services

```bash
# Restart single service
docker-compose -f docker-compose.webvale.yml \
    --env-file .env.webvale \
    restart backend

# Restart all services
sudo ./deploy-webvale.sh restart

# Graceful restart (maintenance mode)
sudo ./deploy-webvale.sh maintenance enable
# Do maintenance...
sudo ./deploy-webvale.sh maintenance disable
```

## Troubleshooting

### 9.1 Service Won't Start

```bash
# Check logs
sudo ./deploy-webvale.sh logs

# Common issues:
# 1. Port already in use
netstat -tlnp | grep LISTEN

# 2. Insufficient disk space
df -h

# 3. Insufficient memory
free -h

# 4. Missing environment variables
cat .env.webvale | grep -E "^[A-Z]" | head -20

# 5. Corrupted containers
docker-compose -f docker-compose.webvale.yml down
docker volume prune
# Redeploy
```

### 9.2 Database Connection Error

```bash
# Verify PostgreSQL is running
docker ps | grep postgres

# Check database logs
docker logs webvale-postgres-prod | tail -50

# Test connection manually
docker exec webvale-postgres-prod \
    psql -U webvale_app -d webvale_production -c "SELECT 1;"

# If connection fails:
# 1. Verify .env.webvale has correct DB_PASSWORD
# 2. Check database exists: psql -l
# 3. Check user permissions: psql -U postgres -l
```

### 9.3 Out of Disk Space

```bash
# Find large files
du -sh /* | sort -h | tail -20

# Clean up old logs
find ./logs -name "*.log" -mtime +30 -delete

# Prune old backups (CAREFULLY!)
find ./backups -mtime +30 -delete

# Prune unused Docker images
docker image prune -a

# Prune unused volumes
docker volume prune

# Reclaim space
docker system prune -a
```

---

## Related Documentation

- [DEPLOYMENT_MASTER.txt](DEPLOYMENT_MASTER.txt) - Complete checklist
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Pre-deployment verification
- [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md) - Architecture overview

**Generated**: 2026-08-28
**Status**: Production Ready ✓
