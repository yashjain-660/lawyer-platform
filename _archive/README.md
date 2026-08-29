# LegalHub Platform - Complete Full-Stack Implementation

A comprehensive, production-ready lawyer platform connecting clients with legal professionals for consultations, document management, and payments.

## 🎯 Project Overview

**LegalHub** is a full-stack SaaS platform built with:
- **Frontend:** React 18 + Vite + Tailwind CSS + i18next (Hindi + English)
- **Backend:** Node.js + Express.js + Prisma ORM
- **Database:** PostgreSQL 15 + Redis caching
- **Payments:** Razorpay + Stripe integration
- **Admin Panel:** React-based CRUD interface
- **Deployment:** Docker Compose + Nginx + GitHub Actions

## 📋 Features

### Client Portal
- ✅ User authentication (JWT + bcrypt)
- ✅ Lawyer discovery & filtering
- ✅ Consultation booking system
- ✅ Document upload & management
- ✅ Payment integration (Razorpay, Stripe)
- ✅ Consultation history & tracking
- ✅ Review & ratings system

### Lawyer Portal
- ✅ Profile management
- ✅ Credentials & verification
- ✅ Availability scheduling
- ✅ Consultation management
- ✅ Income tracking
- ✅ Client reviews & ratings

### Admin Panel
- ✅ Dashboard with analytics
- ✅ User management (clients, lawyers, admins)
- ✅ Lawyer verification & credentials
- ✅ Content management (blog, FAQs, testimonials)
- ✅ Payment & transaction tracking
- ✅ Support ticket management
- ✅ Lead management
- ✅ Email template editor

### Public Website
- ✅ Hero section with CTA
- ✅ Lawyer directory
- ✅ Blog with articles
- ✅ FAQs section
- ✅ Testimonials showcase
- ✅ Contact form & lead capture
- ✅ Responsive mobile-first design
- ✅ Dark mode support

## 🗄️ Database Schema (19 Tables)

1. **User** - Authentication & profiles
2. **ClientProfile** - Client-specific data
3. **LawyerProfile** - Lawyer credentials & specializations
4. **Service** - Legal services catalog
5. **Consultation** - Booking & management
6. **ConsultationService** - Service-consultation mapping
7. **Payment** - Transaction records
8. **Invoice** - Invoice generation
9. **Document** - Client documents
10. **ConsultationDocument** - Document-consultation mapping
11. **LawyerDocument** - Credentials & certificates
12. **Credential** - Professional credentials
13. **Availability** - Lawyer availability schedule
14. **Review** - Client reviews & ratings
15. **BlogPost** - Content management
16. **FAQ** - Frequently asked questions
17. **Testimonial** - Social proof
18. **ContentGallery** - Image gallery
19. **EmailTemplate** - Email management
20. **Lead** - Lead tracking
21. **SupportTicket** - Customer support

## 🏗️ Architecture

### Monorepo Structure
```
lawyer-platform/
├── backend/              # Express.js API
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # Auth, logging, errors
│   │   ├── config/       # Redis, database
│   │   └── utils/        # Helpers
│   ├── prisma/
│   │   ├── schema.prisma # Database schema
│   │   └── init.sql      # Initialization
│   └── package.json
├── frontend/             # React SPA
│   ├── src/
│   │   ├── components/   # Reusable UI
│   │   ├── pages/        # Route pages
│   │   ├── redux/        # State management
│   │   ├── i18n.ts       # Internationalization
│   │   └── main.tsx
│   ├── public/
│   └── package.json
├── admin/                # Admin Panel
│   ├── src/
│   │   ├── AdminDashboard.tsx
│   │   └── components/
│   └── package.json
├── docker-compose.yml    # Container orchestration
├── nginx.conf            # Reverse proxy config
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 15 (optional, included in Docker)
- Redis (optional, included in Docker)

### Local Development (Without Docker)

1. **Clone & Install**
```bash
git clone https://github.com/backup7/lawyer-platform.git
cd lawyer-platform
npm install          # Root monorepo
npm run install-all  # Install all packages
```

2. **Setup Database**
```bash
cp .env.example .env
# Edit .env with your configuration
cd backend
npm run db:migrate   # Run migrations
npm run db:seed      # Seed sample data
cd ..
```

3. **Start Services**
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Admin
cd admin && npm run dev
```

Access:
- Frontend: http://localhost:3000
- Admin: http://localhost:3001
- API: http://localhost:5000/api

### Docker Deployment

1. **Setup Environment**
```bash
cp .env.example .env
# Edit .env with production values
```

2. **Build & Start**
```bash
docker-compose build
docker-compose up -d
```

3. **Initialize Database**
```bash
docker-compose exec backend npm run db:migrate
docker-compose exec backend npm run db:seed
```

Access:
- Frontend: http://localhost
- Admin: http://localhost/admin
- API: http://localhost/api

### Development Commands

```bash
# Build
npm run build:all          # Build all packages
npm run build:backend      # Build backend only

# Development
npm run dev:backend        # Dev backend with hot-reload
npm run dev:frontend       # Dev frontend with Vite
npm run dev:admin          # Dev admin panel

# Database
npm run db:setup           # Initial setup
npm run db:migrate         # Run migrations
npm run db:seed            # Seed data
npm run db:reset           # Reset database (caution!)

# Testing & Quality
npm run test               # Run tests
npm run lint               # Lint code
npm run format             # Format code

# Docker
npm run docker:build       # Build images
npm run docker:up          # Start services
npm run docker:down        # Stop services
npm run docker:logs        # View logs
```

## 🔐 Security Features

- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Password Hashing** - bcrypt with salt rounds
- ✅ **CORS Protection** - Configurable allowed origins
- ✅ **CSRF Protection** - Token-based CSRF defense
- ✅ **Rate Limiting** - Redis-backed rate limiting
- ✅ **Security Headers** - Helmet.js middleware
- ✅ **HTTPS/TLS** - Ready for SSL configuration
- ✅ **Environment Secrets** - .env-based configuration
- ✅ **Input Validation** - Zod schema validation
- ✅ **SQL Injection Protection** - Prisma parameterized queries
- ✅ **XSS Protection** - Content Security Policy headers

## 📡 API Endpoints (30+)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

### Lawyers
- `GET /api/lawyers` - List all lawyers
- `GET /api/lawyers/:id` - Get lawyer details
- `POST /api/lawyers/profile` - Create lawyer profile
- `PUT /api/lawyers/:id` - Update lawyer profile
- `GET /api/lawyers/:id/availability` - Get availability
- `POST /api/lawyers/:id/credentials` - Upload credentials

### Consultations
- `POST /api/consultations` - Book consultation
- `GET /api/consultations` - List consultations
- `GET /api/consultations/:id` - Get consultation details
- `PUT /api/consultations/:id` - Update consultation
- `DELETE /api/consultations/:id` - Cancel consultation

### Payments
- `POST /api/payments` - Create payment
- `GET /api/payments/:id` - Get payment details
- `POST /api/payments/:id/webhook` - Payment webhook
- `GET /api/invoices` - List invoices

### Documents
- `POST /api/documents` - Upload document
- `GET /api/documents` - List documents
- `DELETE /api/documents/:id` - Delete document

### Blog & Content
- `GET /api/blog` - List blog posts
- `GET /api/blog/:slug` - Get post details
- `GET /api/faqs` - List FAQs
- `GET /api/testimonials` - List testimonials

### Leads & Support
- `POST /api/leads` - Create lead
- `POST /api/support` - Create support ticket
- `GET /api/support/:id` - Get ticket details

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - List users
- `POST /api/admin/lawyers/verify` - Verify lawyer
- `GET /api/admin/payments` - Payment reports

## 🌐 Internationalization (i18n)

Multilingual support for **English** and **Hindi**:

```typescript
// Switch language
i18n.changeLanguage('en');  // English
i18n.changeLanguage('hi');  // Hindi

// Use translations
const { t } = useTranslation();
<h1>{t('home.title')}</h1>
```

## 🎨 UI/UX Features

- **Responsive Design** - Mobile-first, works on all devices
- **Dark Mode** - Built-in dark/light theme toggle
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI Components** - Pre-built accessible components
- **Animations** - Smooth transitions & fade-in effects
- **WCAG AA** - Accessibility compliance

## 💳 Payment Integration

### Razorpay
```env
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
```

### Stripe
```env
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
```

## 📧 Email Service

### SendGrid Configuration
```env
SENDGRID_API_KEY=SG.xxxxx
SENDER_EMAIL=noreply@legalhub.com
```

**Email Templates:**
- Welcome email
- Consultation booking confirmation
- Payment receipt
- Invoice
- Password reset
- Support ticket updates

## 📦 Deployment

### Docker Compose (Recommended)

```bash
# Build & start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### Environment Configuration

Copy `.env.example` to `.env` and update:

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_very_secret_key_change_this

# Payments
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
STRIPE_SECRET_KEY=your_key

# Email
SENDGRID_API_KEY=your_api_key
```

### AWS S3 Storage

Configure for document uploads:

```env
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_REGION=us-east-1
S3_BUCKET_NAME=lawyer-platform-files
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📊 Monitoring & Logging

- **Pino Logger** - Structured JSON logging
- **Redis** - Cache layer monitoring
- **PostgreSQL** - Query performance tracking
- **Health Checks** - `/health` endpoint
- **Error Handling** - Comprehensive error logging

## 🔄 CI/CD

GitHub Actions pipeline included for:
- Code linting
- Type checking
- Running tests
- Building Docker images
- Deploying to production

## 📄 License

MIT License - See LICENSE file

## 👥 Support

For issues and questions:
- GitHub Issues: https://github.com/backup7/lawyer-platform/issues
- Email: support@legalhub.com

## 🙏 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

**LegalHub Support**
- Email: info@legalhub.com
- Phone: +1 (555) 123-4567
- Website: https://www.legalhub.com

---

**Built with ❤️ by the LegalHub Team**

*Last Updated: 2024*
