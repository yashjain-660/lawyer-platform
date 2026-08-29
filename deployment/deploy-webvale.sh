#!/bin/bash
################################################################################
# THE WEB VALE - AUTOMATED DEPLOYMENT & MANAGEMENT SCRIPT
# Version: 1.0.0
# Generated: 2026-08-28
# Purpose: Manage production deployment, health checks, backups, and operations
################################################################################

set -euo pipefail

# ============================================================================
# CONFIGURATION
# ============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DEPLOYMENT_DIR="$SCRIPT_DIR"
LOG_DIR="$DEPLOYMENT_DIR/logs"
BACKUP_DIR="$DEPLOYMENT_DIR/backups"
LOCK_FILE="/var/run/webvale-deploy.lock"

# Docker Compose file
COMPOSE_FILE="$DEPLOYMENT_DIR/docker-compose.webvale.yml"
ENV_FILE="$DEPLOYMENT_DIR/.env.webvale"

# Containers
POSTGRES_CONTAINER="webvale-postgres-prod"
REDIS_CONTAINER="webvale-redis-prod"
BACKEND_CONTAINER="webvale-backend-prod"
FRONTEND_CONTAINER="webvale-frontend-prod"
ADMIN_CONTAINER="webvale-admin-prod"
NGINX_CONTAINER="webvale-nginx-prod"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Initialize log directory
mkdir -p "$LOG_DIR"
mkdir -p "$BACKUP_DIR"

# Check if running with sudo
check_sudo() {
    if [[ $EUID -ne 0 ]]; then
        log_error "This script must be run with sudo"
        exit 1
    fi
}

# Acquire lock
acquire_lock() {
    if [[ -f "$LOCK_FILE" ]]; then
        PID=$(cat "$LOCK_FILE")
        if kill -0 "$PID" 2>/dev/null; then
            log_error "Another deployment is already in progress (PID: $PID)"
            exit 1
        fi
    fi
    echo $$ > "$LOCK_FILE"
}

# Release lock
release_lock() {
    rm -f "$LOCK_FILE"
}

# ============================================================================
# SETUP & INITIALIZATION
# ============================================================================

setup() {
    log_info "Starting setup process..."
    
    # Check prerequisites
    log_info "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi
    
    if ! command -v curl &> /dev/null; then
        log_error "curl is not installed"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
    
    # Create necessary directories
    log_info "Creating directory structure..."
    mkdir -p "$DEPLOYMENT_DIR/logs/nginx"
    mkdir -p "$DEPLOYMENT_DIR/logs/backend"
    mkdir -p "$DEPLOYMENT_DIR/logs/frontend"
    mkdir -p "$DEPLOYMENT_DIR/logs/admin"
    mkdir -p "$DEPLOYMENT_DIR/ssl/certificates"
    mkdir -p "$DEPLOYMENT_DIR/postgres-backup"
    mkdir -p "$DEPLOYMENT_DIR/redis-backup"
    mkdir -p "$BACKUP_DIR/daily"
    mkdir -p "$BACKUP_DIR/weekly"
    mkdir -p "$BACKUP_DIR/monthly"
    
    # Set permissions
    chmod 700 "$DEPLOYMENT_DIR/ssl"
    chmod 600 "$ENV_FILE"
    
    log_success "Directory structure created"
    
    # Verify environment file
    if [[ ! -f "$ENV_FILE" ]]; then
        log_error "Environment file not found: $ENV_FILE"
        exit 1
    fi
    
    log_success "Setup completed successfully"
}

# ============================================================================
# SSL/TLS CERTIFICATE MANAGEMENT
# ============================================================================

setup_ssl() {
    log_info "Setting up SSL/TLS certificates..."
    
    SSL_DIR="$DEPLOYMENT_DIR/ssl/certificates"
    
    if [[ -f "$SSL_DIR/cert.pem" ]] && [[ -f "$SSL_DIR/key.pem" ]]; then
        log_warning "SSL certificates already exist"
        return 0
    fi
    
    log_info "Generating self-signed certificates for testing..."
    openssl req -x509 -newkey rsa:4096 -keyout "$SSL_DIR/key.pem" -out "$SSL_DIR/cert.pem" \
        -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=thewebvale.com"
    
    log_info "Generating DH parameters (this may take a few minutes)..."
    openssl dhparam -out "$DEPLOYMENT_DIR/ssl/dhparam.pem" 2048
    
    chmod 600 "$SSL_DIR/key.pem"
    chmod 644 "$SSL_DIR/cert.pem"
    
    log_success "SSL certificates generated"
    log_warning "IMPORTANT: Replace self-signed certificates with Let's Encrypt certificates in production"
}

setup_letsencrypt() {
    local domain="$1"
    
    log_info "Setting up Let's Encrypt certificates for domain: $domain"
    
    if ! command -v certbot &> /dev/null; then
        log_error "certbot is not installed. Install it with: apt-get install certbot python3-certbot-nginx"
        return 1
    fi
    
    certbot certonly --standalone \
        -d "$domain" \
        -d "*.${domain}" \
        --email admin@${domain} \
        --agree-tos \
        --non-interactive
    
    if [[ $? -eq 0 ]]; then
        log_success "Let's Encrypt certificates installed successfully"
        
        # Copy to deployment directory
        SSL_DIR="$DEPLOYMENT_DIR/ssl/certificates"
        CERT_PATH="/etc/letsencrypt/live/${domain}"
        
        cp "$CERT_PATH/fullchain.pem" "$SSL_DIR/cert.pem"
        cp "$CERT_PATH/privkey.pem" "$SSL_DIR/key.pem"
        chmod 600 "$SSL_DIR/key.pem"
        
        return 0
    else
        log_error "Failed to install Let's Encrypt certificates"
        return 1
    fi
}

# ============================================================================
# DEPLOYMENT OPERATIONS
# ============================================================================

build() {
    log_info "Building Docker images..."
    
    cd "$PROJECT_DIR"
    
    if ! docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" build; then
        log_error "Failed to build Docker images"
        exit 1
    fi
    
    log_success "Docker images built successfully"
}

start() {
    log_info "Starting services..."
    
    acquire_lock
    trap release_lock EXIT
    
    cd "$PROJECT_DIR"
    
    if ! docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d; then
        log_error "Failed to start services"
        exit 1
    fi
    
    log_info "Waiting for services to become healthy..."
    sleep 5
    
    # Wait for all services to be healthy
    local max_retries=30
    local retry_count=0
    
    while [[ $retry_count -lt $max_retries ]]; do
        local postgres_health=$(docker inspect -f "{{.State.Health.Status}}" "$POSTGRES_CONTAINER" 2>/dev/null || echo "unknown")
        local redis_health=$(docker inspect -f "{{.State.Health.Status}}" "$REDIS_CONTAINER" 2>/dev/null || echo "unknown")
        
        if [[ "$postgres_health" == "healthy" ]] && [[ "$redis_health" == "healthy" ]]; then
            log_success "All services started and healthy"
            return 0
        fi
        
        log_warning "Waiting for services to be healthy... ($((retry_count + 1))/$max_retries)"
        sleep 2
        ((retry_count++))
    done
    
    log_error "Services failed to become healthy"
    exit 1
}

stop() {
    log_info "Stopping services..."
    
    cd "$PROJECT_DIR"
    
    if docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down; then
        log_success "Services stopped successfully"
    else
        log_error "Failed to stop services"
        exit 1
    fi
}

restart() {
    log_info "Restarting services..."
    stop
    sleep 2
    start
}

# ============================================================================
# HEALTH CHECKS
# ============================================================================

health_check() {
    log_info "Performing health checks..."
    
    local failed=0
    
    # Check PostgreSQL
    log_info "Checking PostgreSQL..."
    if docker exec "$POSTGRES_CONTAINER" pg_isready -U webvale_app &>/dev/null; then
        log_success "PostgreSQL is healthy"
    else
        log_error "PostgreSQL is not responding"
        ((failed++))
    fi
    
    # Check Redis
    log_info "Checking Redis..."
    if docker exec "$REDIS_CONTAINER" redis-cli ping | grep -q "PONG"; then
        log_success "Redis is healthy"
    else
        log_error "Redis is not responding"
        ((failed++))
    fi
    
    # Check Backend API
    log_info "Checking Backend API..."
    if curl -sf http://localhost:5000/health &>/dev/null; then
        log_success "Backend API is healthy"
    else
        log_error "Backend API is not responding"
        ((failed++))
    fi
    
    # Check Frontend
    log_info "Checking Frontend..."
    if curl -sf http://localhost:3000 &>/dev/null; then
        log_success "Frontend is healthy"
    else
        log_error "Frontend is not responding"
        ((failed++))
    fi
    
    # Check Admin Panel
    log_info "Checking Admin Panel..."
    if curl -sf http://localhost:3001 &>/dev/null; then
        log_success "Admin Panel is healthy"
    else
        log_error "Admin Panel is not responding"
        ((failed++))
    fi
    
    # Check Nginx
    log_info "Checking Nginx..."
    if curl -sf http://localhost/health &>/dev/null; then
        log_success "Nginx is healthy"
    else
        log_error "Nginx is not responding"
        ((failed++))
    fi
    
    if [[ $failed -eq 0 ]]; then
        log_success "All health checks passed"
        return 0
    else
        log_error "$failed health checks failed"
        return 1
    fi
}

status() {
    log_info "Checking service status..."
    
    echo ""
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
    echo ""
    
    # Show logs summary
    log_info "Recent logs:"
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs --tail=20 2>/dev/null | tail -20
}

# ============================================================================
# BACKUP & RECOVERY
# ============================================================================

backup() {
    log_info "Starting backup process..."
    
    local backup_timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_path="$BACKUP_DIR/database_backup_${backup_timestamp}.sql.gz"
    
    log_info "Backing up PostgreSQL database..."
    
    docker exec "$POSTGRES_CONTAINER" pg_dump \
        -U webvale_app webvale_production | gzip > "$backup_path"
    
    if [[ $? -eq 0 ]]; then
        log_success "Database backup completed: $backup_path"
        
        # Backup Redis
        log_info "Backing up Redis data..."
        docker exec "$REDIS_CONTAINER" redis-cli BGSAVE
        
        # Get file size
        local size=$(du -h "$backup_path" | cut -f1)
        log_success "Backup completed successfully (Size: $size)"
        
        # Cleanup old backups (keep last 30 days)
        log_info "Cleaning up old backups..."
        find "$BACKUP_DIR" -name "database_backup_*.sql.gz" -mtime +30 -delete
        
        return 0
    else
        log_error "Database backup failed"
        return 1
    fi
}

restore_backup() {
    local backup_file="$1"
    
    if [[ ! -f "$backup_file" ]]; then
        log_error "Backup file not found: $backup_file"
        return 1
    fi
    
    log_warning "CAUTION: This will restore the database from backup: $backup_file"
    read -p "Are you sure? (yes/no): " -r
    if [[ ! $REPLY =~ ^yes$ ]]; then
        log_info "Restore cancelled"
        return 0
    fi
    
    log_info "Stopping services..."
    stop
    
    log_info "Restoring database from backup..."
    gunzip -c "$backup_file" | docker exec -i "$POSTGRES_CONTAINER" \
        psql -U webvale_app webvale_production
    
    if [[ $? -eq 0 ]]; then
        log_success "Database restored successfully"
        log_info "Starting services..."
        start
        return 0
    else
        log_error "Database restore failed"
        return 1
    fi
}

list_backups() {
    log_info "Available backups:"
    
    if [[ -z "$(ls -A "$BACKUP_DIR")" ]]; then
        log_warning "No backups found"
        return 0
    fi
    
    ls -lh "$BACKUP_DIR"/database_backup_*.sql.gz 2>/dev/null | awk '{print $9, "(" $5 ")"}'
}

# ============================================================================
# LOGS & MONITORING
# ============================================================================

show_logs() {
    local service="${1:-all}"
    local lines="${2:-50}"
    
    cd "$PROJECT_DIR"
    
    case "$service" in
        backend)
            docker-compose -f "$COMPOSE_FILE" logs -f --tail="$lines" backend
            ;;
        frontend)
            docker-compose -f "$COMPOSE_FILE" logs -f --tail="$lines" frontend
            ;;
        admin)
            docker-compose -f "$COMPOSE_FILE" logs -f --tail="$lines" admin
            ;;
        postgres)
            docker-compose -f "$COMPOSE_FILE" logs -f --tail="$lines" postgres
            ;;
        redis)
            docker-compose -f "$COMPOSE_FILE" logs -f --tail="$lines" redis
            ;;
        nginx)
            docker-compose -f "$COMPOSE_FILE" logs -f --tail="$lines" nginx
            ;;
        *)
            docker-compose -f "$COMPOSE_FILE" logs -f --tail="$lines"
            ;;
    esac
}

# ============================================================================
# MAINTENANCE
# ============================================================================

maintenance_mode() {
    local mode="$1"
    
    case "$mode" in
        enable)
            log_info "Enabling maintenance mode..."
            docker exec "$BACKEND_CONTAINER" touch /app/.maintenance
            log_success "Maintenance mode enabled"
            ;;
        disable)
            log_info "Disabling maintenance mode..."
            docker exec "$BACKEND_CONTAINER" rm -f /app/.maintenance
            log_success "Maintenance mode disabled"
            ;;
        *)
            log_error "Invalid mode. Use 'enable' or 'disable'"
            return 1
            ;;
    esac
}

# ============================================================================
# DATABASE OPERATIONS
# ============================================================================

db_migrate() {
    log_info "Running database migrations..."
    
    docker exec "$BACKEND_CONTAINER" npm run db:migrate
    
    if [[ $? -eq 0 ]]; then
        log_success "Database migrations completed"
        return 0
    else
        log_error "Database migrations failed"
        return 1
    fi
}

db_seed() {
    log_info "Seeding database..."
    
    docker exec "$BACKEND_CONTAINER" npm run db:seed
    
    if [[ $? -eq 0 ]]; then
        log_success "Database seeding completed"
        return 0
    else
        log_error "Database seeding failed"
        return 1
    fi
}

# ============================================================================
# USAGE INFORMATION
# ============================================================================

usage() {
    cat << EOF
╔════════════════════════════════════════════════════════════════════════════╗
║         THE WEB VALE - DEPLOYMENT & MANAGEMENT SCRIPT v1.0.0              ║
╚════════════════════════════════════════════════════════════════════════════╝

USAGE: $0 <command> [options]

COMMANDS:

  SETUP & INITIALIZATION:
    setup                    Initialize deployment environment
    ssl                      Generate self-signed SSL certificates
    letsencrypt <domain>     Setup Let's Encrypt certificates for domain

  DEPLOYMENT:
    build                    Build Docker images
    start                    Start all services
    stop                     Stop all services
    restart                  Restart all services

  HEALTH & MONITORING:
    health                   Perform health checks on all services
    status                   Show service status
    logs [service] [lines]   Show logs (service: backend|frontend|admin|postgres|redis|nginx|all)

  BACKUP & RECOVERY:
    backup                   Create database backup
    restore <backup_file>    Restore from backup file
    backups                  List available backups

  MAINTENANCE:
    maintenance enable       Enable maintenance mode
    maintenance disable      Disable maintenance mode

  DATABASE:
    db-migrate               Run database migrations
    db-seed                  Seed database with initial data

EXAMPLES:

  Initialize deployment:
    sudo $0 setup
    sudo $0 ssl
    sudo $0 build

  Start production deployment:
    sudo $0 start
    sudo $0 health

  View logs:
    sudo $0 logs backend 100
    sudo $0 logs nginx 50

  Create backup:
    sudo $0 backup
    sudo $0 backups

  Restore from backup:
    sudo $0 restore /path/to/backup.sql.gz

For more information, see DEPLOYMENT_MASTER.txt

EOF
}

# ============================================================================
# MAIN ENTRY POINT
# ============================================================================

main() {
    if [[ $# -eq 0 ]]; then
        usage
        exit 0
    fi
    
    local command="$1"
    shift || true
    
    case "$command" in
        setup)
            check_sudo
            setup
            ;;
        ssl)
            check_sudo
            setup_ssl
            ;;
        letsencrypt)
            check_sudo
            if [[ $# -lt 1 ]]; then
                log_error "Domain required: $0 letsencrypt <domain>"
                exit 1
            fi
            setup_letsencrypt "$1"
            ;;
        build)
            check_sudo
            build
            ;;
        start)
            check_sudo
            start
            ;;
        stop)
            check_sudo
            stop
            ;;
        restart)
            check_sudo
            restart
            ;;
        health)
            health_check
            ;;
        status)
            status
            ;;
        logs)
            show_logs "$@"
            ;;
        backup)
            check_sudo
            backup
            ;;
        restore)
            check_sudo
            if [[ $# -lt 1 ]]; then
                log_error "Backup file required: $0 restore <backup_file>"
                exit 1
            fi
            restore_backup "$1"
            ;;
        backups)
            list_backups
            ;;
        maintenance)
            check_sudo
            if [[ $# -lt 1 ]]; then
                log_error "Mode required: $0 maintenance <enable|disable>"
                exit 1
            fi
            maintenance_mode "$1"
            ;;
        db-migrate)
            check_sudo
            db_migrate
            ;;
        db-seed)
            check_sudo
            db_seed
            ;;
        help|--help|-h)
            usage
            ;;
        *)
            log_error "Unknown command: $command"
            usage
            exit 1
            ;;
    esac
}

# Execute main function
main "$@"
