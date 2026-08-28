# LegalHub Platform - Deployment Guide

## Quick Start Deployment

### Local Development with Docker

```bash
# 1. Clone the repository
git clone https://github.com/backup7/lawyer-platform.git
cd lawyer-platform

# 2. Copy environment template
cp .env.example .env

# 3. Edit .env with your configuration
nano .env

# 4. Build Docker images
docker-compose build

# 5. Start services
docker-compose up -d

# 6. Initialize database
docker-compose exec backend npm run db:migrate
docker-compose exec backend npm run db:seed

# 7. Access the application
# Frontend: http://localhost
# Admin: http://localhost/admin
# API: http://localhost/api/health
```

### Production Deployment

#### Prerequisites
- Linux server (Ubuntu 20.04+ recommended)
- Docker and Docker Compose
- PostgreSQL 15 (managed or self-hosted)
- Redis (managed or self-hosted)
- SSL/TLS certificate
- Domain name

#### Step 1: Server Setup

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create application directory
sudo mkdir -p /app/lawyer-platform
sudo chown $USER:$USER /app/lawyer-platform
cd /app/lawyer-platform
```

#### Step 2: Clone Repository

```bash
git clone https://github.com/backup7/lawyer-platform.git .
```

#### Step 3: Configure Environment

```bash
cp .env.example .env

# Edit with production values
nano .env

# Key settings to update:
# - DATABASE_URL (PostgreSQL connection)
# - REDIS_HOST/PORT (Redis connection)
# - JWT_SECRET (Generate random: openssl rand -base64 32)
# - SENDGRID_API_KEY
# - RAZORPAY_KEY_ID/SECRET
# - STRIPE_SECRET_KEY
# - AWS credentials for S3
# - CORS_ORIGINS
```

#### Step 4: Generate SSL Certificate

```bash
# Using Let's Encrypt with Certbot
sudo apt-get install certbot python3-certbot-nginx -y

# Generate certificate
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# Update nginx.conf with certificate paths
# ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
# ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
```

#### Step 5: Start Services

```bash
# Build images
docker-compose build

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Initialize database
docker-compose exec backend npm run db:migrate
docker-compose exec backend npm run db:seed
```

#### Step 6: Configure Nginx

```bash
# Copy SSL certificates to ssl directory
mkdir -p ssl
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/key.pem
sudo chown $USER:$USER ssl/*
sudo chmod 644 ssl/*
```

#### Step 7: Update DNS Records

Point your domain to the server's IP address:
```
A    your-domain.com     → YOUR_SERVER_IP
CNAME www.your-domain.com → your-domain.com
```

#### Step 8: Setup Automatic Backups

```bash
# Create backup script
sudo mkdir -p /backups/lawyer-platform
cat > /home/$USER/backup-database.sh << 'EOF'
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T postgres pg_dump -U lawyer lawyer_platform | gzip > /backups/lawyer-platform/backup_$TIMESTAMP.sql.gz
# Keep last 7 days of backups
find /backups/lawyer-platform -name "backup_*.sql.gz" -mtime +7 -delete
EOF

chmod +x /home/$USER/backup-database.sh

# Schedule daily backups (crontab -e)
0 2 * * * /home/$USER/backup-database.sh
```

#### Step 9: Setup Monitoring

```bash
# Monitor logs
docker-compose logs -f backend

# Check disk usage
docker system df

# Monitor services
docker stats

# Health check
curl http://localhost/api/health
```

#### Step 10: Maintenance & Updates

```bash
# Pull latest code
git pull origin main

# Rebuild images
docker-compose build

# Update services (with zero downtime)
docker-compose up -d --no-deps --build backend
docker-compose up -d --no-deps --build frontend
docker-compose up -d --no-deps --build admin

# Run migrations if needed
docker-compose exec backend npm run db:migrate

# View service logs
docker-compose logs backend
```

## Monitoring & Debugging

### Health Checks

```bash
# API health
curl http://localhost/api/health

# Database connection
docker-compose exec postgres psql -U lawyer -d lawyer_platform -c "SELECT 1"

# Redis connection
docker-compose exec redis redis-cli ping

# Check service status
docker-compose ps
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Last N lines
docker-compose logs --tail 100 backend

# Filter by time
docker-compose logs --since 2024-01-15 backend
```

### Database Maintenance

```bash
# Access database
docker-compose exec postgres psql -U lawyer -d lawyer_platform

# Common commands
\dt              # List tables
\dv              # List views
\di              # List indexes
SELECT * FROM pg_stat_user_tables;  # Table stats
```

### Redis Cache

```bash
# Check cache
docker-compose exec redis redis-cli

# Common commands
KEYS *           # List all keys
GET key_name     # Get value
FLUSHDB          # Clear all cache
INFO             # Redis stats
```

## Troubleshooting

### Services Won't Start

```bash
# Check logs
docker-compose logs backend

# Common issues:
# - PORT already in use: Change port in docker-compose.yml
# - Database connection failed: Check DATABASE_URL in .env
# - Out of disk space: docker system prune
```

### Database Connection Error

```bash
# Test connection
docker-compose exec postgres psql -U lawyer -d lawyer_platform -c "SELECT 1"

# Reset database
docker-compose down
docker volume rm lawyer-platform_postgres_data
docker-compose up -d
docker-compose exec backend npm run db:migrate
```

### High Memory Usage

```bash
# Check service memory
docker stats

# Restart service
docker-compose restart backend

# Increase Docker memory limit in daemon.json
# { "memory": "4g" }
```

### SSL Certificate Issues

```bash
# Test SSL
curl -I https://your-domain.com

# Check certificate validity
openssl x509 -in ssl/cert.pem -text -noout

# Renew certificate (automated via cron)
sudo certbot renew --quiet
```

## Performance Optimization

### Database Optimization

```sql
-- Analyze tables for better query planning
ANALYZE;

-- Create indexes for frequently queried columns
CREATE INDEX idx_consultations_status_date 
ON "Consultation"(status, "scheduledDate");
```

### Caching Strategy

```bash
# Clear Redis cache if needed
docker-compose exec redis redis-cli FLUSHDB

# Monitor cache usage
docker-compose exec redis redis-cli INFO stats
```

### Load Testing

```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Load test API
ab -n 1000 -c 10 http://your-domain.com/api/health
```

## Security Hardening

### Firewall Configuration

```bash
# Allow only necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### API Rate Limiting

Already configured in nginx.conf:
- General: 30 requests per minute
- API: 10 requests per second

### JWT Secret Rotation

Generate new secret:
```bash
openssl rand -base64 32
```

Update in .env and redeploy.

## Scaling Considerations

### Horizontal Scaling

Use load balancer (AWS ELB, NGINX) to distribute traffic:
```nginx
upstream backend_cluster {
  server backend1:5000;
  server backend2:5000;
  server backend3:5000;
}
```

### Database Scaling

- Read replicas for high query volume
- Separate write/read databases
- Connection pooling with pgBouncer

### Caching Strategy

- Redis cluster for distributed cache
- CDN for static assets
- API response caching

## Disaster Recovery

### Backup Strategy

```bash
# Full backup
docker-compose exec postgres pg_dump -U lawyer lawyer_platform > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U lawyer lawyer_platform < backup.sql

# Backup frequency: Daily
# Retention: 30 days
# Storage: S3 or external drive
```

### Recovery Plan

1. Document all deployment steps
2. Test restore procedure monthly
3. Keep backups in multiple locations
4. Monitor backup success
5. Have runbook for restoration

## Support & Maintenance

- Monitor uptime: Use service like UptimeRobot
- Log aggregation: Use ELK Stack or Datadog
- Error tracking: Use Sentry
- Performance monitoring: Use New Relic
- Automated alerts: Set up via PagerDuty

---

**Need Help?** Check the README.md or contact support@legalhub.com
