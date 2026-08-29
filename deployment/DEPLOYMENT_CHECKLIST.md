# The Web Vale - Deployment Checklist

Complete this checklist before deploying to production.

## Phase 1: Pre-Deployment Planning

### Infrastructure
- [ ] Server provisioned (4+ CPU, 8GB+ RAM, 100GB+ SSD)
- [ ] OS installed (Ubuntu 20.04+ or CentOS 8+)
- [ ] Docker Engine 20.10+ installed
- [ ] Docker Compose 2.0+ installed
- [ ] Git, curl, wget installed
- [ ] SSH key-based authentication configured
- [ ] Firewall configured (allow 22, 80, 443)

### Credentials Ready
- [ ] JWT Secret (32+ chars, randomly generated)
- [ ] Session Secret (32+ chars, randomly generated)
- [ ] Database Password (24+ chars, strong)
- [ ] Redis Password (16+ chars, randomly generated)
- [ ] Admin Password (24+ chars, strong)
- [ ] SendGrid API Key obtained
- [ ] Razorpay Key ID and Secret obtained
- [ ] Stripe Secret Key and Publishable Key obtained
- [ ] AWS Access Key ID and Secret obtained
- [ ] S3 Bucket created and configured

### Domain & DNS
- [ ] Domain registered (thewebvale.com)
- [ ] Primary A record configured (*.thewebvale.com → server IP)
- [ ] SPF record added for email
- [ ] DKIM record added for email
- [ ] DMARC record added for email
- [ ] DNS propagation verified (nslookup thewebvale.com)

### SSL/TLS
- [ ] SSL certificate obtained (Let's Encrypt ready)
- [ ] Certificate path identified
- [ ] Private key secured (chmod 600)
- [ ] Certificate renewal strategy planned
- [ ] DH parameters generated (2048-bit minimum)

### Monitoring & Backup
- [ ] Backup location identified (/backups)
- [ ] Backup retention policy decided (30 days minimum)
- [ ] Log rotation configured (daily)
- [ ] Monitoring service setup (Prometheus, Datadog, etc.)
- [ ] Alert recipients configured
- [ ] Error tracking (Sentry) configured
- [ ] Uptime monitoring service setup

## Phase 2: Repository & Configuration

### Repository
- [ ] Latest code pulled: `git pull origin main`
- [ ] Deployment files verified in place
- [ ] `.env.webvale` file created
- [ ] Sensitive credentials added to `.env.webvale`
- [ ] `.env.webvale` NOT committed to git
- [ ] `.gitignore` includes `.env.webvale`

### Configuration Files
- [ ] `docker-compose.webvale.yml` reviewed
- [ ] `nginx.webvale.conf` reviewed
- [ ] `init.sql` reviewed
- [ ] `deploy-webvale.sh` permissions set (755)
- [ ] `.github/workflows/deploy.yml` configured

### Environment Variables
- [ ] `DATABASE_URL` set correctly
- [ ] `JWT_SECRET` set (NOT default value)
- [ ] `SESSION_SECRET` set (NOT default value)
- [ ] `REDIS_PASSWORD` set (NOT empty)
- [ ] `SENDGRID_API_KEY` set (production key)
- [ ] `RAZORPAY_KEY_ID` set (production key)
- [ ] `RAZORPAY_KEY_SECRET` set (production key)
- [ ] `STRIPE_SECRET_KEY` set (production key)
- [ ] `AWS_ACCESS_KEY_ID` set
- [ ] `AWS_SECRET_ACCESS_KEY` set
- [ ] `AWS_REGION` set (e.g., us-east-1)
- [ ] `S3_BUCKET_NAME` set
- [ ] `CORS_ORIGINS` configured correctly
- [ ] `LOG_LEVEL` set to 'info' (not 'debug')
- [ ] All "REPLACE_WITH_" values updated

## Phase 3: Setup & Initialization

### Initial Setup
- [ ] Run: `sudo ./deploy-webvale.sh setup`
- [ ] All directories created
- [ ] Permissions set correctly
- [ ] No errors in output

### SSL Certificate Setup
- [ ] Certificate generated or obtained
- [ ] Certificate placed in `ssl/certificates/cert.pem`
- [ ] Private key placed in `ssl/certificates/key.pem`
- [ ] DH parameters in `ssl/dhparam.pem`
- [ ] Permissions: `chmod 600` on .pem files
- [ ] Certificate validity verified (openssl x509 -noout -text)

### Docker Build
- [ ] Run: `sudo ./deploy-webvale.sh build`
- [ ] All images built successfully
- [ ] No build errors
- [ ] Images available: `docker images | grep webvale`

### Database Initialization
- [ ] PostgreSQL started: `docker-compose -f docker-compose.webvale.yml up -d postgres`
- [ ] init.sql executed automatically
- [ ] All tables created
- [ ] Initial admin user created
- [ ] Indexes created
- [ ] Views created

## Phase 4: Deployment

### Service Startup
- [ ] Run: `sudo ./deploy-webvale.sh start`
- [ ] All containers started successfully
- [ ] No startup errors
- [ ] All containers running (docker ps)

### Health Verification
- [ ] Run: `sudo ./deploy-webvale.sh health`
- [ ] PostgreSQL healthy
- [ ] Redis healthy
- [ ] Backend API healthy (http://localhost:5000/health)
- [ ] Frontend healthy (http://localhost:3000)
- [ ] Admin panel healthy (http://localhost:3001)
- [ ] Nginx healthy (http://localhost/health)

### Service Accessibility
- [ ] Frontend accessible: `curl -s http://localhost:3000`
- [ ] API accessible: `curl -s http://localhost:5000/api/health`
- [ ] Admin accessible: `curl -s http://localhost:3001`
- [ ] Nginx proxy working: `curl -s http://localhost`

## Phase 5: Security Verification

### Security Headers
- [ ] Verify HSTS header: `curl -sI http://localhost | grep Strict-Transport`
- [ ] Verify X-Frame-Options: `curl -sI http://localhost | grep X-Frame`
- [ ] Verify X-Content-Type-Options: `curl -sI http://localhost | grep X-Content-Type`
- [ ] Verify CSP header: `curl -sI http://localhost | grep Content-Security`

### SSL/TLS Verification
- [ ] SSL version 1.2+ only: `openssl s_client -connect localhost:443 -showcerts`
- [ ] No weak ciphers
- [ ] Certificate chain complete
- [ ] No certificate warnings

### Authentication
- [ ] JWT secret is strong (32+ chars)
- [ ] Session secret is strong (32+ chars)
- [ ] Admin password is strong (24+ chars)
- [ ] Database password is strong (24+ chars)
- [ ] All passwords stored securely (NOT in logs)

### Network Security
- [ ] Firewall rules configured (ufw status)
- [ ] Port 22 (SSH) restricted to admin IPs only
- [ ] Ports 80/443 open to internet
- [ ] CORS origins restricted
- [ ] Rate limiting enabled
- [ ] SQL injection prevention verified
- [ ] XSS protection verified (CSP)

## Phase 6: Functional Testing

### Application Testing
- [ ] Frontend loads without errors
- [ ] Admin panel loads without errors
- [ ] API health endpoint responds
- [ ] Can login to admin panel
- [ ] Can create an organization
- [ ] Can create a case
- [ ] Can upload a document to S3

### Database Testing
- [ ] Database connection works
- [ ] Queries execute successfully
- [ ] Indexes created (pg_stat_user_indexes)
- [ ] Connection pooling works

### Email Testing
- [ ] SendGrid API key works
- [ ] Test email can be sent
- [ ] Email received in inbox
- [ ] Email formatting correct

### Payment Gateway Testing
- [ ] Razorpay connection verified
- [ ] Stripe connection verified
- [ ] Test transaction initiated (use test keys)
- [ ] Webhook configuration tested

### File Upload Testing
- [ ] S3 credentials work
- [ ] File upload succeeds
- [ ] File stored in S3
- [ ] File download works
- [ ] File accessible via URL

## Phase 7: Backup & Recovery

### Initial Backup
- [ ] Run: `sudo ./deploy-webvale.sh backup`
- [ ] Backup file created
- [ ] Backup file verified (gunzip -t)
- [ ] Backup size reasonable (check for completeness)
- [ ] Backup stored securely

### Backup Automation
- [ ] Cron job configured: `0 2 * * * /path/to/deploy-webvale.sh backup`
- [ ] Backup retention policy configured (30 days)
- [ ] Old backups pruned automatically
- [ ] Multiple backups retained (daily, weekly)

### Recovery Testing
- [ ] Tested restore process (optional for critical deployments)
- [ ] Backup restore time documented
- [ ] Recovery procedure documented
- [ ] Test restore doesn't interfere with production

## Phase 8: Monitoring & Logging

### Log Configuration
- [ ] Logs directed to `./logs` directory
- [ ] Log rotation configured (daily)
- [ ] Log retention set (30 days)
- [ ] Log format includes timestamps
- [ ] Error logs separate from access logs

### Monitoring Setup
- [ ] Health checks configured
- [ ] Prometheus metrics enabled (optional)
- [ ] Datadog or similar monitoring enabled (optional)
- [ ] Sentry error tracking configured (optional)
- [ ] Alert recipients configured

### Log Access
- [ ] Backend logs accessible: `sudo ./deploy-webvale.sh logs backend`
- [ ] Frontend logs accessible: `sudo ./deploy-webvale.sh logs frontend`
- [ ] Nginx logs accessible: `sudo ./deploy-webvale.sh logs nginx`
- [ ] Database logs accessible: `docker logs webvale-postgres-prod`

## Phase 9: Performance Testing

### Load Testing
- [ ] API can handle expected concurrent users
- [ ] Database connection pool not exhausted
- [ ] Response times within acceptable range
- [ ] No memory leaks observed
- [ ] CPU usage reasonable

### Database Performance
- [ ] Slow query log reviewed
- [ ] Indexes verify (EXPLAIN ANALYZE)
- [ ] Connection pool size appropriate
- [ ] Query timeouts configured

### Caching
- [ ] Redis caching works
- [ ] Frontend assets cached (1 year expiry)
- [ ] API responses cached where appropriate
- [ ] Cache invalidation works

## Phase 10: Final Verification

### Production DNS
- [ ] Domain resolves to server IP: `nslookup thewebvale.com`
- [ ] Wildcard resolves: `nslookup test.thewebvale.com`
- [ ] HTTPS works: `curl -sI https://thewebvale.com`
- [ ] SSL certificate valid
- [ ] No certificate warnings

### Functional Verification
- [ ] Frontend loads from domain
- [ ] API accessible from domain
- [ ] Admin panel accessible from subdomain
- [ ] Can login and create organization
- [ ] Multi-tenant isolation works

### Documentation
- [ ] DEPLOYMENT_MASTER.txt reviewed
- [ ] DEPLOYMENT_SUMMARY.md reviewed
- [ ] DEPLOYMENT_WEBVALE.md reviewed
- [ ] Runbooks created
- [ ] Team trained on operations
- [ ] Emergency contacts documented

## Phase 11: Post-Deployment

### Handover
- [ ] Operations team trained
- [ ] Support documentation provided
- [ ] Emergency procedures documented
- [ ] Escalation procedures documented
- [ ] Access credentials securely shared

### Monitoring Activation
- [ ] All monitoring systems active
- [ ] Alerts firing correctly (test alert)
- [ ] Log aggregation working
- [ ] Performance baselines recorded

### Cleanup
- [ ] Temporary test data removed
- [ ] Debug mode disabled
- [ ] Verbose logging disabled (set to info)
- [ ] SSH access hardened
- [ ] Unnecessary services stopped

## Go/No-Go Decision

### Ready for Production?
- [ ] All critical items completed
- [ ] No blocking issues
- [ ] Team approved
- [ ] Backup verified
- [ ] Monitoring active

**Status**: ☐ GO / ☐ NO-GO

**Decision Made By**: ___________________ **Date**: _______________

**Sign-off**: _________________________________ **Title**: _______________

---

## References

- [DEPLOYMENT_MASTER.txt](DEPLOYMENT_MASTER.txt) - Complete deployment guide
- [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md) - Architecture & overview
- [DEPLOYMENT_WEBVALE.md](DEPLOYMENT_WEBVALE.md) - Detailed procedures

**Generated**: 2026-08-28
**Status**: Production Ready ✓
