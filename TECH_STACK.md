# Tech Stack Specifications – Lawyer Business Platform

**Detailed Technology & Dependency Documentation**

---

## Frontend Technology Stack

### Core Framework & Tooling

#### React 18
- **Version:** 18.2.0+
- **Purpose:** Component-based UI framework
- **Why:** Industry standard, excellent ecosystem, performance optimizations
- **Key Features:** Strict mode, concurrent features, automatic batching

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0"
}
```

#### Vite
- **Version:** 5.0.0+
- **Purpose:** Modern build tool & dev server
- **Why:** Lightning-fast (< 500ms cold start), native ES modules, optimized production builds
- **Configuration:** `vite.config.ts` with React plugin

```json
{
  "vite": "^5.0.0",
  "@vitejs/plugin-react": "^4.0.0"
}
```

#### TypeScript
- **Version:** 5.3.0+
- **Purpose:** Type-safe JavaScript
- **Why:** Catch errors early, better IDE support, self-documenting code
- **Config:** `tsconfig.json` with strict mode enabled

```json
{
  "typescript": "^5.3.0"
}
```

---

### State Management & Data Fetching

#### TanStack Query (React Query)
- **Version:** 5.0.0+
- **Purpose:** Server state management
- **Why:** Automatic caching, background refetching, synchronization
- **Use Cases:** API data fetching, consultation listings, lawyer profiles

```json
{
  "@tanstack/react-query": "^5.0.0"
}
```

**Cache Strategy:**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
    }
  }
});
```

#### Zustand
- **Version:** 4.4.0+
- **Purpose:** Lightweight client state management
- **Why:** Minimal boilerplate, excellent TypeScript support, small bundle size
- **Use Cases:** Auth state, UI state (sidebar open/close), user preferences

```json
{
  "zustand": "^4.4.0"
}
```

**Example Store:**
```typescript
create<AuthStore>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token })
}));
```

---

### Styling

#### Tailwind CSS
- **Version:** 3.3.0+
- **Purpose:** Utility-first CSS framework
- **Why:** Consistent design tokens, rapid development, small production build
- **Configuration:** `tailwind.config.js` with custom Stripe-inspired theme

```json
{
  "tailwindcss": "^3.3.0",
  "autoprefixer": "^10.4.0",
  "postcss": "^8.4.0"
}
```

**Custom Theme (Stripe-inspired):**
```javascript
{
  theme: {
    colors: {
      'navy': '#061b31',
      'purple': '#533afd',
      'slate': '#64748d',
      'green': '#15be53'
    },
    fontFamily: {
      'sans': ['Source Sans 3', 'system-ui'],
      'mono': ['Source Code Pro', 'monospace']
    }
  }
}
```

#### Shadcn/ui
- **Version:** Latest
- **Purpose:** Premium React components
- **Why:** Built on Radix UI (accessible), unstyled (customizable), comprehensive
- **Used Components:** Button, Input, Dialog, Select, Tabs, Card, Toast

```json
{
  "shadcn-ui": "latest"
}
```

---

### Forms & Validation

#### React Hook Form
- **Version:** 7.47.0+
- **Purpose:** Performant form handling
- **Why:** Minimal re-renders, excellent validation integration, small bundle
- **Features:** Controlled/uncontrolled, async validation, field arrays

```json
{
  "react-hook-form": "^7.47.0"
}
```

#### Zod
- **Version:** 3.22.0+
- **Purpose:** Schema validation
- **Why:** TypeScript-first, runtime validation, detailed error messages
- **Integration:** With React Hook Form for client-side validation

```json
{
  "zod": "^3.22.0"
}
```

**Example Schema:**
```typescript
const bookingSchema = z.object({
  lawyerId: z.string().uuid(),
  serviceId: z.string().uuid(),
  scheduledAt: z.date().min(new Date()),
  mode: z.enum(['in_person', 'video_call', 'phone_call', 'email'])
});
```

---

### Internationalization (i18n)

#### i18next
- **Version:** 23.7.0+
- **Purpose:** Multilingual support (Hindi + English)
- **Why:** Mature, industry standard, flexible configuration

```json
{
  "i18next": "^23.7.0",
  "react-i18next": "^13.4.0",
  "i18next-browser-languagedetector": "^7.1.0",
  "i18next-http-backend": "^2.4.0"
}
```

**Supported Languages:**
```javascript
{
  resources: {
    en: { translation: { /* English translations */ } },
    hi: { translation: { /* Hindi translations */ } }
  }
}
```

---

### Networking & API

#### Axios
- **Version:** 1.6.0+
- **Purpose:** HTTP client with interceptors
- **Why:** Promise-based, request/response interceptors, built-in timeout handling

```json
{
  "axios": "^1.6.0"
}
```

**API Configuration:**
```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

#### Socket.IO (Client)
- **Version:** 4.7.0+
- **Purpose:** Real-time communication
- **Why:** Bidirectional communication, automatic reconnection, event-based

```json
{
  "socket.io-client": "^4.7.0"
}
```

**Real-Time Features:**
- Consultation status updates
- New booking notifications
- Live message delivery

---

### Utilities

#### date-fns
- **Version:** 2.30.0+
- **Purpose:** Date manipulation & formatting
- **Why:** Lightweight, tree-shakeable, timezone support

```json
{
  "date-fns": "^2.30.0"
}
```

#### Recharts
- **Version:** 2.10.0+
- **Purpose:** React charts & dashboards
- **Why:** Responsive, accessible, composable

```json
{
  "recharts": "^2.10.0"
}
```

**Chart Types Used:**
- LineChart – Revenue trends
- BarChart – Consultations by service
- PieChart – Lead source distribution

#### Framer Motion
- **Version:** 10.16.0+
- **Purpose:** Smooth animations
- **Why:** Declarative API, GPU-optimized, layout animations

```json
{
  "framer-motion": "^10.16.0"
}
```

**Animation Examples:**
- Page transitions (fade-in, slide-up)
- Hover effects (scale, shadow)
- Loading animations (spinner)

#### React Hot Toast
- **Version:** 2.4.1+
- **Purpose:** Toast notifications
- **Why:** Headless, customizable, no styles included

```json
{
  "react-hot-toast": "^2.4.1"
}
```

---

### Testing

#### Vitest
- **Version:** 1.0.0+
- **Purpose:** Unit test runner
- **Why:** Vite-native, fast, Jest-compatible API

```json
{
  "vitest": "^1.0.0",
  "@testing-library/react": "^14.1.0",
  "@testing-library/user-event": "^14.5.0"
}
```

#### Cypress
- **Version:** 13.6.0+
- **Purpose:** E2E testing
- **Why:** Interactive test runner, time travel debugging, real browser

```json
{
  "cypress": "^13.6.0"
}
```

---

### Code Quality

#### ESLint
- **Version:** 8.54.0+
- **Purpose:** Code quality & style
- **Why:** Prevent bugs, enforce best practices

```json
{
  "eslint": "^8.54.0",
  "eslint-config-react-app": "^7.0.0"
}
```

#### Prettier
- **Version:** 3.1.0+
- **Purpose:** Code formatting
- **Why:** Zero-config, consistent style

```json
{
  "prettier": "^3.1.0"
}
```

---

## Backend Technology Stack

### Runtime & Framework

#### Node.js
- **Version:** 20 LTS
- **Why:** Latest stable LTS, excellent performance, large ecosystem
- **Install:** Use nvm (Node Version Manager) for version management

```bash
nvm install 20
nvm use 20
```

#### Express.js
- **Version:** 4.18.0+
- **Purpose:** Web framework
- **Why:** Minimal, unopinionated, excellent middleware ecosystem

```json
{
  "express": "^4.18.0"
}
```

#### TypeScript
- **Version:** 5.3.0+
- **Purpose:** Type-safe backend development
- **Compilation Target:** ES2020

```json
{
  "typescript": "^5.3.0",
  "ts-node": "^10.9.0"
}
```

---

### Database & ORM

#### PostgreSQL
- **Version:** 15+
- **Purpose:** Primary relational database
- **Why:** JSONB support for multilingual content, ACID compliance, JSON operators
- **Connection:** Via Prisma ORM with connection pooling

#### Prisma
- **Version:** 5.7.0+
- **Purpose:** ORM & query builder
- **Why:** Type-safe, auto-generated client, schema migrations

```json
{
  "@prisma/client": "^5.7.0",
  "prisma": "^5.7.0"
}
```

**Prisma Schema Example:**
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  role      Role     @default(CLIENT)
  profile   UserProfile?
  
  @@index([role])
}

model UserProfile {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id])
  firstName String
  lastName  String
}
```

#### Redis
- **Version:** 7.0+
- **Purpose:** Caching & session store
- **Why:** In-memory performance, pub/sub, data structures
- **Managed:** Redis Cloud or AWS ElastiCache

```json
{
  "redis": "^4.6.0",
  "ioredis": "^5.3.0"
}
```

---

### Authentication & Security

#### JWT
- **Package:** `jsonwebtoken`
- **Version:** 9.1.0+
- **Purpose:** Stateless authentication
- **Algorithm:** HS256 (HMAC SHA-256)

```json
{
  "jsonwebtoken": "^9.1.0"
}
```

**Token Payload:**
```typescript
{
  sub: "user-id",
  email: "user@example.com",
  role: "client" | "lawyer" | "admin",
  iat: number,
  exp: number,
  jti: string (unique token ID)
}
```

#### bcrypt
- **Version:** 5.1.0+
- **Purpose:** Password hashing
- **Why:** Industry standard, salt-based hashing, resistance to timing attacks

```json
{
  "bcryptjs": "^2.4.3"
}
```

#### crypto (Node.js built-in)
- **Purpose:** AES-256 encryption for sensitive data
- **Algorithm:** AES-256-GCM
- **Key Management:** AWS KMS or HashiCorp Vault

```typescript
import crypto from 'crypto';

const encryptSensitiveData = (plaintext: string, key: string) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key), iv);
  let encrypted = cipher.update(plaintext, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}:${cipher.getAuthTag().toString('hex')}`;
};
```

---

### HTTP & Middleware

#### Helmet
- **Version:** 7.1.0+
- **Purpose:** HTTP security headers
- **Why:** Protect against common web vulnerabilities

```json
{
  "helmet": "^7.1.0"
}
```

**Headers Set:**
- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security: max-age=31536000

#### CORS
- **Package:** `cors`
- **Version:** 2.8.5+
- **Purpose:** Cross-origin resource sharing

```json
{
  "cors": "^2.8.5"
}
```

#### Express Validator
- **Version:** 7.0.0+
- **Purpose:** Input validation & sanitization
- **Why:** Express middleware, comprehensive validation rules

```json
{
  "express-validator": "^7.0.0"
}
```

#### Express Rate Limit
- **Version:** 7.1.0+
- **Purpose:** API rate limiting
- **Why:** Prevent brute force, DDoS protection

```json
{
  "express-rate-limit": "^7.1.0"
}
```

---

### File Storage

#### AWS SDK (S3)
- **Version:** 3.400+
- **Purpose:** Document storage in S3
- **Why:** Serverless, scalable, integrated with AWS ecosystem

```json
{
  "@aws-sdk/client-s3": "^3.400.0",
  "@aws-sdk/s3-request-presigner": "^3.400.0"
}
```

**S3 Configuration:**
```typescript
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
});

// Generate presigned URLs for document access
const presignedUrl = await getSignedUrl(s3, new GetObjectCommand({
  Bucket: 'lawyer-platform',
  Key: `documents/${consultationId}/${fileName}`
}), { expiresIn: 3600 }); // 1 hour
```

#### Multer
- **Version:** 1.4.5+
- **Purpose:** File upload middleware
- **Why:** Handle multipart/form-data, file validation

```json
{
  "multer": "^1.4.5"
}
```

---

### Payment Integration

#### Razorpay SDK
- **Version:** 2.8.0+
- **Purpose:** Indian payment gateway
- **Why:** Market leader in India, excellent API, multiple payment methods

```json
{
  "razorpay": "^2.8.0"
}
```

**Integration Flow:**
1. Create order on backend
2. Pass order ID to frontend
3. Initiate checkout on client
4. Verify signature on backend
5. Update payment status

#### Stripe SDK
- **Version:** 13.0.0+
- **Purpose:** International payment processing
- **Why:** Global coverage, excellent developer experience

```json
{
  "stripe": "^13.0.0"
}
```

---

### Email & Notifications

#### SendGrid
- **Version:** 7.7.0+
- **Purpose:** Transactional email
- **Why:** Reliable delivery, templates, easy integration

```json
{
  "@sendgrid/mail": "^7.7.0"
}
```

**Email Types:**
- Welcome email
- Consultation confirmation
- Invoice delivery
- Password reset
- Admin notifications

#### Twilio (Optional)
- **Version:** 4.0.0+
- **Purpose:** SMS notifications (future phase)

```json
{
  "twilio": "^4.0.0"
}
```

#### Socket.IO (Server)
- **Version:** 4.7.0+
- **Purpose:** Real-time server-sent events

```json
{
  "socket.io": "^4.7.0"
}
```

---

### Monitoring & Logging

#### Winston
- **Version:** 3.11.0+
- **Purpose:** Structured logging
- **Why:** Multiple transports, log levels, JSON formatting

```json
{
  "winston": "^3.11.0"
}
```

**Log Levels:**
- error: Application errors
- warn: Warnings
- info: General information
- debug: Debugging info
- silly: Detailed debugging

#### Morgan
- **Version:** 1.10.0+
- **Purpose:** HTTP request logging
- **Why:** Integrated with Winston, standardized format

```json
{
  "morgan": "^1.10.0"
}
```

#### Sentry
- **Version:** 7.80.0+
- **Purpose:** Error tracking & monitoring
- **Why:** Real-time alerts, error grouping, performance metrics

```json
{
  "@sentry/node": "^7.80.0",
  "@sentry/integrations": "^7.80.0"
}
```

---

### Testing

#### Jest
- **Version:** 29.7.0+
- **Purpose:** Test runner (backend)
- **Why:** Industry standard, comprehensive, built-in mocking

```json
{
  "jest": "^29.7.0",
  "ts-jest": "^29.1.0",
  "@types/jest": "^29.5.0"
}
```

#### Supertest
- **Version:** 6.3.0+
- **Purpose:** HTTP assertion library for API testing
- **Why:** Makes API testing clean and readable

```json
{
  "supertest": "^6.3.0"
}
```

---

### Utilities

#### dotenv
- **Version:** 16.3.0+
- **Purpose:** Load environment variables
- **Why:** Secure secrets management in development

```json
{
  "dotenv": "^16.3.0"
}
```

#### class-validator
- **Version:** 0.14.0+
- **Purpose:** DTO validation using decorators
- **Why:** Clean, declarative validation

```json
{
  "class-validator": "^0.14.0",
  "class-transformer": "^0.5.0"
}
```

---

## DevOps & Deployment Stack

### Containerization

#### Docker
- **Engine Version:** 20+
- **Compose Version:** 2.0+
- **Purpose:** Containerize application

**Dockerfile (Backend):**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

**Dockerfile (Frontend):**
```dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Infrastructure (AWS)

#### EC2
- **Instance Type:** t3.medium (2 vCPU, 4GB RAM)
- **OS:** Ubuntu 22.04 LTS
- **Count:** 2+ for high availability

#### RDS
- **Engine:** PostgreSQL 15
- **Instance:** db.t3.micro (development), db.t3.small (production)
- **Storage:** 100GB with auto-scaling
- **Backup:** Daily snapshots, 30-day retention

#### ElastiCache
- **Engine:** Redis 7.0
- **Node Type:** cache.t3.micro
- **Automatic Failover:** Enabled
- **Encryption:** In-transit + at-rest

#### S3
- **Purpose:** Document storage
- **Versioning:** Enabled
- **Encryption:** AES-256
- **Lifecycle:** Archive to Glacier after 90 days

#### CloudFront
- **Purpose:** CDN for static assets & document delivery
- **Caching:** 1 year for versioned assets
- **Compression:** Gzip & Brotli

### CI/CD

#### GitHub Actions
```yaml
name: Deploy
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test
      - run: npm run build
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - run: docker build -t app:latest .
      - run: docker push ${{ secrets.REGISTRY }}/app:latest
```

---

## Summary Table

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | React | 18.2+ | UI framework |
| | Vite | 5.0+ | Build tool |
| | TypeScript | 5.3+ | Type safety |
| | Tailwind CSS | 3.3+ | Styling |
| | i18next | 23.7+ | Multilingual |
| | TanStack Query | 5.0+ | Data fetching |
| | Zustand | 4.4+ | State management |
| **Backend** | Node.js | 20 LTS | Runtime |
| | Express | 4.18+ | Framework |
| | TypeScript | 5.3+ | Type safety |
| | Prisma | 5.7+ | ORM |
| | PostgreSQL | 15+ | Database |
| | Redis | 7.0+ | Cache |
| | JWT | 9.1+ | Auth |
| **DevOps** | Docker | 20+ | Containerization |
| | AWS | Latest | Infrastructure |
| | GitHub Actions | Latest | CI/CD |

---

**All dependencies are production-tested and regularly updated for security patches.**
