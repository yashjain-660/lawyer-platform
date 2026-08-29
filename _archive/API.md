# LegalHub Platform - API Documentation

## Overview

Complete REST API for the LegalHub platform. All endpoints require authentication (JWT token) except for public endpoints.

## Authentication

Include the JWT token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" https://api.legalhub.com/api/endpoint
```

## Response Format

All responses are JSON:

```json
{
  "data": {},
  "status": 200,
  "message": "Success",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Error Responses

```json
{
  "error": "Error message",
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/endpoint"
}
```

---

## Authentication Endpoints

### Register User
```
POST /api/auth/register
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "firstName": "John",
  "lastName": "Doe",
  "userType": "CLIENT"
}
```

**Response:** `201 Created`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "clm1a1b2c3d4e5f6",
    "email": "user@example.com",
    "userType": "CLIENT"
  }
}
```

### Login
```
POST /api/auth/login
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "clm1a1b2c3d4e5f6",
    "email": "user@example.com",
    "userType": "CLIENT"
  }
}
```

---

## User Endpoints

### Get Profile
```
GET /api/users/profile
```
**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "id": "clm1a1b2c3d4e5f6",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "userType": "CLIENT",
  "createdAt": "2024-01-10T00:00:00Z"
}
```

### Update Profile
```
PUT /api/users/profile
```
**Auth Required:** Yes

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890",
  "avatar": "https://..."
}
```

**Response:** `200 OK`

---

## Lawyer Endpoints

### List All Lawyers
```
GET /api/lawyers?page=1&limit=10&specialization=criminal
```
**Auth Required:** No

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)
- `specialization` (optional): Filter by specialization

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "lawyer123",
      "bio": "Expert criminal lawyer with 10 years experience",
      "specializations": ["Criminal", "Civil"],
      "hourlyRate": 100,
      "averageRating": 4.8,
      "totalReviews": 45,
      "isVerified": true,
      "user": {
        "firstName": "Jane",
        "lastName": "Smith"
      }
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 10
}
```

### Get Lawyer Details
```
GET /api/lawyers/:id
```
**Auth Required:** No

**Response:** `200 OK`
```json
{
  "id": "lawyer123",
  "bio": "Expert criminal lawyer",
  "specializations": ["Criminal", "Civil"],
  "hourlyRate": 100,
  "experience": 10,
  "averageRating": 4.8,
  "totalCases": 250,
  "credentials": [...],
  "availability": [
    {
      "dayOfWeek": 1,
      "startTime": "09:00",
      "endTime": "17:00"
    }
  ],
  "reviews": [...]
}
```

### Create Lawyer Profile
```
POST /api/lawyers/profile
```
**Auth Required:** Yes (Lawyer user type)

**Request:**
```json
{
  "specializations": ["Criminal", "Civil"],
  "experience": 10,
  "bio": "Expert lawyer with extensive experience",
  "hourlyRate": 100
}
```

**Response:** `201 Created`

---

## Consultation Endpoints

### Book Consultation
```
POST /api/consultations
```
**Auth Required:** Yes

**Request:**
```json
{
  "lawyerId": "lawyer123",
  "title": "Contract Review",
  "description": "Need help reviewing business contract",
  "scheduledDate": "2024-02-01T14:00:00Z",
  "duration": 60,
  "mode": "VIDEO",
  "services": ["service123"]
}
```

**Response:** `201 Created`
```json
{
  "id": "consultation123",
  "clientId": "user123",
  "lawyerId": "lawyer123",
  "status": "SCHEDULED",
  "title": "Contract Review",
  "scheduledDate": "2024-02-01T14:00:00Z",
  "duration": 60,
  "mode": "VIDEO",
  "amount": 100
}
```

### List My Consultations
```
GET /api/consultations
```
**Auth Required:** Yes

**Response:** `200 OK`
```json
[
  {
    "id": "consultation123",
    "title": "Contract Review",
    "status": "SCHEDULED",
    "scheduledDate": "2024-02-01T14:00:00Z",
    "lawyer": {
      "firstName": "Jane",
      "lastName": "Smith"
    }
  }
]
```

### Get Consultation Details
```
GET /api/consultations/:id
```
**Auth Required:** Yes

**Response:** `200 OK`

### Cancel Consultation
```
DELETE /api/consultations/:id
```
**Auth Required:** Yes

**Response:** `200 OK`

---

## Payment Endpoints

### Create Payment
```
POST /api/payments
```
**Auth Required:** Yes

**Request:**
```json
{
  "amount": 100,
  "consultationId": "consultation123",
  "paymentMethod": "RAZORPAY"
}
```

**Response:** `201 Created`
```json
{
  "id": "payment123",
  "amount": 100,
  "status": "PENDING",
  "paymentMethod": "RAZORPAY",
  "razorpayOrderId": "order_123abc"
}
```

### Get Payment Details
```
GET /api/payments/:id
```
**Auth Required:** Yes

**Response:** `200 OK`

### Payment Webhook
```
POST /api/payments/:id/webhook
```

Handles payment confirmations from Razorpay/Stripe.

---

## Document Endpoints

### Upload Document
```
POST /api/documents
```
**Auth Required:** Yes

**Request:** (multipart/form-data)
```
name: "contract.pdf"
type: "CONTRACT"
file: <binary>
```

**Response:** `201 Created`
```json
{
  "id": "doc123",
  "name": "contract.pdf",
  "type": "CONTRACT",
  "fileUrl": "https://...",
  "fileSize": 102400,
  "uploadedAt": "2024-01-15T10:30:00Z"
}
```

### List My Documents
```
GET /api/documents
```
**Auth Required:** Yes

**Response:** `200 OK`

### Delete Document
```
DELETE /api/documents/:id
```
**Auth Required:** Yes

**Response:** `204 No Content`

---

## Blog Endpoints

### List Blog Posts
```
GET /api/blog?page=1&category=legal-tips
```

**Query Parameters:**
- `page` (optional): Page number
- `category` (optional): Filter by category

**Response:** `200 OK`
```json
[
  {
    "id": "post123",
    "title": "Understanding Contract Law",
    "slug": "understanding-contract-law",
    "excerpt": "A guide to contract law basics...",
    "author": "Jane Smith",
    "category": "legal-tips",
    "publishedAt": "2024-01-10T00:00:00Z"
  }
]
```

### Get Blog Post
```
GET /api/blog/:slug
```

**Response:** `200 OK`
```json
{
  "id": "post123",
  "title": "Understanding Contract Law",
  "slug": "understanding-contract-law",
  "content": "Full HTML content...",
  "author": "Jane Smith",
  "faqs": [...]
}
```

---

## FAQ Endpoints

### List FAQs
```
GET /api/faqs?category=consultation
```

**Query Parameters:**
- `category` (optional): Filter by category

**Response:** `200 OK`
```json
[
  {
    "id": "faq123",
    "question": "How do I book a consultation?",
    "answer": "You can book through our platform...",
    "category": "consultation"
  }
]
```

---

## Testimonial Endpoints

### List Testimonials
```
GET /api/testimonials
```

**Response:** `200 OK`
```json
[
  {
    "id": "testimonial123",
    "clientName": "John Doe",
    "text": "Excellent service!",
    "rating": 5,
    "clientImage": "https://..."
  }
]
```

---

## Lead Endpoints

### Create Lead
```
POST /api/leads
```

**Request:**
```json
{
  "email": "prospect@example.com",
  "firstName": "John",
  "lastName": "Prospect",
  "phone": "+1234567890",
  "caseType": "PERSONAL_INJURY",
  "message": "Looking for legal assistance",
  "source": "WEBSITE"
}
```

**Response:** `201 Created`

---

## Support Ticket Endpoints

### Create Support Ticket
```
POST /api/support
```
**Auth Required:** Yes

**Request:**
```json
{
  "subject": "Issue with payment",
  "message": "Payment failed but amount was deducted",
  "priority": "HIGH"
}
```

**Response:** `201 Created`

---

## Admin Endpoints

### Dashboard Statistics
```
GET /api/admin/dashboard
```
**Auth Required:** Yes (Admin only)

**Response:** `200 OK`
```json
{
  "totalUsers": 1250,
  "totalLawyers": 150,
  "totalConsultations": 3400,
  "totalRevenue": 125000
}
```

### List All Users
```
GET /api/admin/users?page=1&role=CLIENT
```
**Auth Required:** Yes (Admin only)

### List All Lawyers
```
GET /api/admin/lawyers?verification=PENDING
```
**Auth Required:** Yes (Admin only)

### Verify Lawyer
```
POST /api/admin/lawyers/:id/verify
```
**Auth Required:** Yes (Admin only)

**Request:**
```json
{
  "status": "VERIFIED"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Server Error |

---

## Rate Limiting

API is rate-limited to prevent abuse:
- **General endpoints:** 30 requests per minute
- **API endpoints:** 10 requests per second
- **Authentication:** 5 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1639500000
```

---

## Best Practices

1. **Always validate input** on the client side
2. **Handle errors gracefully** with appropriate status codes
3. **Use pagination** for list endpoints
4. **Cache responses** when appropriate
5. **Refresh tokens** before expiration
6. **Use HTTPS** in production
7. **Store tokens securely** (HttpOnly cookies recommended)

---

**API Version:** 1.0.0  
**Last Updated:** 2024-01-15
