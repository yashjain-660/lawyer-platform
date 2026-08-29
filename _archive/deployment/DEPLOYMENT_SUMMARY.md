# The Web Vale - Deployment Summary & Architecture

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Internet (HTTPS)                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                    ┌────▼───────┐
                    │   Nginx     │
                    │  SSL/TLS    │
                    │ Reverse     │
                    │  Proxy      │
                    │(Port 443)   │
                    └────┬────┬────────┬──────────┘
         ┌──────────────┼────┼────────┼────────┐
         │              │    │        │        │
    ┌────▼─┐      ┌─────▼──┐│  ┌────▼──┐  ┌──▼──┐
    │Front-│      │Backend ││  │Admin  │  │Static
    │end   │      │API     ││  │Panel  │  │Files
    │:3000 │      │:5000   ││  │:3001  │  │
    └──────┘      └──┬──┬──┘│  └───────┘  └─────┘
                     │  │   └──────┬──────────┘
         ┌───────────┘  │          │
         │      ┌───────┼──────────┘
         │      │       │
    ┌────▼──────▼─┐ ┌───▼────────┐
    │ PostgreSQL  │ │   Redis    │
    │ Database    │ │   Cache    │
    │ :5432       │ │   :6379    │
    └─────────────┘ └────────────┘
```

### Service Components

| Service | Port | Runtime | Purpose | Persistence |
|---------|------|---------|---------|-------------|
| **Nginx** | 80/443 | Alpine | Reverse proxy, SSL/TLS, rate limiting | Configuration |
| **Backend API** | 5000 | Node.js/Express | REST API, business logic | None (stateless) |
| **Frontend** | 3000 | React (SPA) | User interface | Browser cache |
| **Admin Panel** | 3001 | React (SPA) | Administrative interface | Browser cache |
| **PostgreSQL** | 5432 | Alpine | Primary database | Volume: postgres_data |
| **Redis** | 6379 | Alpine | Cache, sessions | Volume: redis_data |

## Technology Stack

### Backend
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **ORM**: Prisma
- **Auth**: JWT + Sessions
- **File Storage**: AWS S3
- **Email**: SendGrid
- **Payments**: Razorpay, Stripe

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State**: Redux/Context
- **HTTP Client**: axios

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Reverse Proxy**: Nginx
- **SSL/TLS**: Let's Encrypt
- **Monitoring**: Built-in health checks

## Deployment Specifications

### Resource Requirements

**Minimum Hardware**
- CPU: 4 cores
- RAM: 8 GB
- Disk: 100 GB SSD
- Network: 100 Mbps

**Recommended Hardware**
- CPU: 8 cores
- RAM: 16 GB
- Disk: 200 GB SSD
- Network: 1 Gbps

### Network Ports

| Port | Service | Direction | Purpose |
|------|---------|-----------|---------|
| 22 | SSH | Inbound | Remote administration |
| 80 | HTTP | Inbound | Redirect to HTTPS |
| 443 | HTTPS | Inbound | Web traffic (encrypted) |
| 5432 | PostgreSQL | Localhost only | Database |
| 6379 | Redis | Localhost only | Cache |
| 3000 | Frontend | Localhost only | Frontend app |
| 3001 | Admin | Localhost only | Admin panel |
| 5000 | Backend | Localhost only | API backend |

### Storage

```
/home/opc/lawyer-platform/deployment/
├── .env.webvale (7 KB) - Environment variables
├── docker-compose.webvale.yml (6.5 KB) - Service configuration
├── nginx.webvale.conf (18 KB) - Web server configuration
├── init.sql (19 KB) - Database schema
├── deploy-webvale.sh (19 KB) - Deployment script
├── ssl/
│   └── certificates/
│       ├── cert.pem - TLS certificate
│       ├── key.pem - Private key
│       └── dhparam.pem - DH parameters
├── logs/
│   ├── nginx/ - Web server logs
│   ├── backend/ - API logs
│   ├── frontend/ - Frontend logs
│   └── admin/ - Admin panel logs
├── backups/
│   ├── daily/ - Daily database backups
│   ├── weekly/ - Weekly backups
│   └── monthly/ - Monthly backups
├── postgres-backup/ - PostgreSQL internal backups
└── redis-backup/ - Redis RDB snapshots
```

### Volumes

| Volume | Mount Point | Size | Purpose |
|--------|------------|------|---------|
| postgres_data | /var/lib/postgresql/data | ~50 GB | Database storage |
| redis_data | /data | ~5 GB | Cache storage |
| nginx_cache | /var/cache/nginx | ~10 GB | HTTP cache |

## Security Architecture

### SSL/TLS Configuration
- **Protocol**: TLS 1.2 and 1.3 only
- **Ciphers**: ECDHE-based (Forward secrecy)
- **Certificate**: Let's Encrypt (auto-renewal)
- **HSTS**: 1 year with preload
- **OCSP Stapling**: Enabled

### Security Headers
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### Rate Limiting

| Endpoint | Limit | Burst | Purpose |
|----------|-------|-------|---------|
| General | 30 req/s | 50 | Per-IP rate limiting |
| API | 10 req/s | 20 | API endpoint protection |
| Auth | 5 req/min | 5 | Login brute-force protection |
| Upload | 2 req/min | 3 | File upload limits |

### Authentication & Authorization
- **Method**: JWT tokens + Session cookies
- **Token Expiry**: 7 days (refresh: 30 days)
- **Session Timeout**: 30 minutes
- **Password Policy**: Minimum 12 characters, strong entropy
- **MFA**: TOTP-based (optional)

### Data Protection
- **Encryption**: AES-256 for sensitive data
- **Database**: Row-level security available
- **Files**: Private S3 buckets with signed URLs
- **Backups**: Encrypted and stored separately
- **Audit Logging**: All changes tracked

## Monitoring & Observability

### Health Checks
- **Frontend**: HTTP GET / (3000)
- **API**: HTTP GET /health (5000)
- **Admin**: HTTP GET / (3001)
- **Database**: psql connection test
- **Cache**: PING command
- **Proxy**: HTTP GET /health (80)

### Logging Strategy

**Log Levels**:
- **DEBUG**: Verbose information (disabled in production)
- **INFO**: General informational messages (default)
- **WARN**: Warning messages
- **ERROR**: Error conditions
- **FATAL**: Fatal errors (immediate attention)

**Log Retention**: 30 days (configurable)

**Log Format**: JSON (structured logging)

### Metrics
- Request latency (p50, p95, p99)
- Error rate (5xx, 4xx)
- Throughput (requests/second)
- Cache hit ratio
- Database connection pool usage
- Memory usage per container
- CPU usage per container
- Disk usage trends

## Backup Strategy

### Backup Schedule
- **Frequency**: Daily at 2:00 AM
- **Retention**: 30 days
- **Redundancy**: Multiple copies maintained

### What's Backed Up
- ✓ PostgreSQL database (full)
- ✓ Redis data (RDB snapshots)
- ✓ Configuration files (.env.webvale)
- ✓ SSL certificates
- ~ User uploaded files (via S3 sync)

### Recovery Procedure
1. Stop services: `sudo ./deploy-webvale.sh stop`
2. Restore database: `sudo ./deploy-webvale.sh restore [backup_file]`
3. Verify data integrity
4. Restart services: `sudo ./deploy-webvale.sh start`
5. Run health checks

**Estimated Recovery Time**: 10-15 minutes

## Performance Characteristics

### Expected Throughput
- **API Requests**: 1,000+ req/s per server
- **Concurrent Users**: 5,000+ simultaneous
- **Database Connections**: 30 concurrent
- **Cache Hit Ratio**: 80%+

### Response Times
- **API Endpoints**: < 200ms (p95)
- **Frontend Pages**: < 2s (first load)
- **Static Assets**: < 100ms (cached)

### Resource Usage
- **Backend**: 200-400 MB RAM
- **Frontend**: 100-150 MB RAM
- **Admin**: 100-150 MB RAM
- **PostgreSQL**: 500 MB - 2 GB RAM (depends on data)
- **Redis**: 200-500 MB RAM
- **Nginx**: 50-100 MB RAM

## Deployment Workflow

### Pre-Deployment
1. Run tests on main branch
2. Review code changes
3. Verify backups exist
4. Prepare rollback plan

### Deployment Steps
1. Pull latest code
2. Build Docker images
3. Stop old services
4. Start new services
5. Run health checks
6. Verify functionality

### Post-Deployment
1. Monitor error rates
2. Check performance metrics
3. Verify user access
4. Update documentation
5. Notify team

**Estimated Deployment Time**: 10-15 minutes

## Scaling Considerations

### Vertical Scaling
- Increase server CPU and RAM
- Increase database connection pool
- Adjust container resource limits

### Horizontal Scaling (Future)
- Multiple backend instances behind load balancer
- Separate database server
- Separate Redis cluster
- Distributed session storage
- CDN for static assets

## Disaster Recovery

### RTO (Recovery Time Objective): 30 minutes
### RPO (Recovery Point Objective): 24 hours

### Disaster Scenarios

**Database Corruption**
1. Restore from latest clean backup
2. Run database integrity checks
3. Verify data consistency
4. Resume operations

**Server Failure**
1. Provision new server
2. Pull code from git
3. Deploy services
4. Restore from backup
5. Update DNS/load balancer

**Data Loss**
1. Restore from encrypted backup
2. Verify backup integrity
3. Restore to test environment first
4. Cutover to restored data

## Operational Runbooks

### Daily Operations
- [ ] Monitor health checks
- [ ] Review error logs
- [ ] Check disk usage
- [ ] Verify backup completion

### Weekly Operations
- [ ] Review performance metrics
- [ ] Test backup restoration
- [ ] Update OS packages
- [ ] Check SSL certificate expiration

### Monthly Operations
- [ ] Disaster recovery drill
- [ ] Security audit
- [ ] Capacity planning
- [ ] Performance tuning

## Support & Escalation

**Level 1**: DevOps Team
- Health checks
- Log analysis
- Service restarts
- Backup management

**Level 2**: Backend Engineers
- Database issues
- API troubleshooting
- Performance optimization
- Security issues

**Level 3**: Infrastructure Team
- Server provisioning
- Network configuration
- SSL certificate renewal
- Capacity planning

**Escalation**: ops-team@thewebvale.com

---

## Related Documentation

- [DEPLOYMENT_MASTER.txt](DEPLOYMENT_MASTER.txt) - Complete setup guide
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Pre-deployment checklist
- [DEPLOYMENT_WEBVALE.md](DEPLOYMENT_WEBVALE.md) - Detailed procedures
- [DEPLOYMENT_READY.txt](DEPLOYMENT_READY.txt) - Quick start guide

**Generated**: 2026-08-28
**Status**: Production Ready ✓
**Version**: 1.0.0
