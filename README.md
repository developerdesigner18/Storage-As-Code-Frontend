# Pure Fusion – Storage-as-Code Self-Service Portal

A production-quality, fully functional mock implementation of a Pure Storage Fusion self-service portal with complete backend, frontend, and mock API server.

## 🏗️ Architecture Overview

```
┌─────────────┐
│   Frontend  │ (React + TypeScript + Vite)
│  (Port 5173)│
└──────┬──────┘
       │ HTTP/REST
       ↓
┌─────────────┐
│   Backend   │ (Node.js + Express + TypeScript)
│  (Port 3000)│
└──────┬──────┘
       │
       ├──→ SQLite Database (Prisma ORM)
       │
       └──→ Fusion Mock API (Port 3001)
                  │
                  └──→ In-Memory Store
```

## 🚀 Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **ORM**: Prisma with SQLite
- **Validation**: Zod
- **Authentication**: JWT
- **Logging**: Winston
- **Testing**: Jest
- **Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Styling**: Vanilla CSS with modern design

### Fusion Mock Server
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Storage**: In-memory Map
- **Features**: Simulates async operations, error scenarios

## 📁 Project Structure

```
/root
├── /backend
│   ├── /src
│   │   ├── /modules
│   │   │   ├── /auth
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.repository.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   └── auth.dto.ts
│   │   │   ├── /volumes
│   │   │   │   ├── volume.controller.ts
│   │   │   │   ├── volume.service.ts
│   │   │   │   ├── volume.repository.ts
│   │   │   │   ├── volume.routes.ts
│   │   │   │   └── volume.dto.ts
│   │   │   └── /fusionMock
│   │   │       ├── fusionMock.controller.ts
│   │   │       ├── fusionMock.service.ts
│   │   │       └── fusionMock.routes.ts
│   │   ├── /core
│   │   │   ├── /config
│   │   │   │   └── config.ts
│   │   │   ├── /database
│   │   │   │   └── prisma.client.ts
│   │   │   ├── /logger
│   │   │   │   └── logger.ts
│   │   │   └── /middleware
│   │   │       ├── auth.middleware.ts
│   │   │       ├── error.middleware.ts
│   │   │       └── logging.middleware.ts
│   │   ├── /tests
│   │   │   ├── volume.service.test.ts
│   │   │   ├── fusionMock.service.test.ts
│   │   │   └── validation.test.ts
│   │   └── app.ts
│   ├── /prisma
│   │   └── schema.prisma
│   ├── package.json
│   └── tsconfig.json
├── /frontend
│   ├── /src
│   │   ├── /components
│   │   │   ├── /common
│   │   │   │   ├── Toast.tsx
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── Table.tsx
│   │   │   │   └── ConfirmDialog.tsx
│   │   │   ├── /volumes
│   │   │   │   ├── VolumeForm.tsx
│   │   │   │   ├── VolumeList.tsx
│   │   │   │   └── VolumeTable.tsx
│   │   │   └── /layout
│   │   │       ├── Header.tsx
│   │   │       └── Layout.tsx
│   │   ├── /hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useVolumes.ts
│   │   │   └── useToast.ts
│   │   ├── /services
│   │   │   ├── api.service.ts
│   │   │   ├── auth.service.ts
│   │   │   └── volume.service.ts
│   │   ├── /pages
│   │   │   ├── LoginPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   └── CreateVolumePage.tsx
│   │   ├── /store
│   │   │   ├── authStore.ts
│   │   │   ├── volumeStore.ts
│   │   │   └── toastStore.ts
│   │   ├── /types
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── /docs
│   ├── architecture-diagram.png
│   ├── openapi.yaml
│   └── postman-collection.json
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Git

### 1. Clone and Install

```bash
# Navigate to project root
cd "c:\Users\jenis\Jenish\Testing Projects\Maulik-test-task"

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database (optional)
npx prisma db seed
```

### 3. Environment Configuration

Create `.env` file in `/backend`:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# Fusion Mock API
FUSION_MOCK_URL=http://localhost:3001
```

Create `.env` file in `/frontend`:

```env
VITE_API_URL=http://localhost:3000
```

### 4. Run the Application

You need to run three services:

#### Terminal 1: Fusion Mock Server
```bash
cd backend
npm run dev:mock
```
Server runs on `http://localhost:3001`

#### Terminal 2: Backend API
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:3000`

#### Terminal 3: Frontend
```bash
cd frontend
npm run dev
```
Application runs on `http://localhost:5173`

## 📚 API Documentation

### Swagger UI
Once the backend is running, visit:
```
http://localhost:3000/api-docs
```

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@purefusion.com",
  "password": "admin123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "admin@purefusion.com"
  }
}
```

### Volumes

#### Create Volume
```http
POST /api/volumes
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "prod-db-volume-01",
  "size_gb": 500,
  "performance_class": "gold",
  "protection_policy": "daily",
  "environment": "prod",
  "tags": [
    { "key": "team", "value": "database" },
    { "key": "cost-center", "value": "engineering" }
  ]
}

Response:
{
  "id": "uuid",
  "name": "prod-db-volume-01",
  "status": "creating",
  "placement": "array-01-shelf-03",
  "created_at": "2025-11-20T14:35:29Z",
  "created_by": "admin@purefusion.com"
}
```

#### List Volumes
```http
GET /api/volumes
Authorization: Bearer <token>

Response:
{
  "volumes": [
    {
      "id": "uuid",
      "name": "prod-db-volume-01",
      "size_gb": 500,
      "performance_class": "gold",
      "protection_policy": "daily",
      "environment": "prod",
      "status": "ready",
      "tags": [...],
      "created_by": "admin@purefusion.com",
      "created_at": "2025-11-20T14:35:29Z"
    }
  ]
}
```

#### Delete Volume
```http
DELETE /api/volumes/:id
Authorization: Bearer <token>

Response:
{
  "message": "Volume deleted successfully"
}
```

## 🧪 Testing

### Run Unit Tests
```bash
cd backend
npm test

# With coverage
npm run test:coverage
```

### Test Coverage
- Volume creation service
- Fusion Mock API error handling
- Validation logic
- Database interactions (mocked)

## 🎨 Frontend Features

### Login Page
- Email/password authentication
- Form validation
- Error handling
- JWT token storage

### Dashboard
- Volume list table with sorting
- Real-time status updates
- Delete confirmation dialog
- Create volume button

### Create Volume Page
- Multi-step form with validation
- Tag management (key/value pairs)
- Performance class selection
- Protection policy configuration
- Environment selection

### Global Toast System
- Success notifications
- Error messages
- Warning alerts
- Auto-dismiss with configurable duration

## 🔧 Fusion Mock API Behavior

The mock server simulates Pure Fusion API with realistic behaviors:

### Volume Creation
- **200 OK**: Returns volume with `creating` status
- **Async Update**: After 5 seconds, status changes to `ready`
- **400 Bad Request**: Invalid data validation
- **409 Conflict**: Duplicate volume name
- **500 Internal Error**: Random 10% failure rate

### Volume Deletion
- **200 OK**: Successful deletion
- **404 Not Found**: Volume doesn't exist

### In-Memory State
- Uses Map for fast lookups
- Auto-lifecycle updates
- Persistent during server runtime

## 📊 Logging

All operations are logged with Winston:

- **Request/Response**: HTTP traffic
- **Errors**: Application errors with stack traces
- **Lifecycle**: Volume status changes
- **Performance**: API latency metrics

Logs are written to:
- Console (development)
- `logs/combined.log` (all logs)
- `logs/error.log` (errors only)

## 🏛️ Architecture Principles

### SOLID Principles
- **Single Responsibility**: Each class has one job
- **Open/Closed**: Extensible without modification
- **Liskov Substitution**: Interfaces are substitutable
- **Interface Segregation**: Focused interfaces
- **Dependency Inversion**: Depend on abstractions

### Design Patterns
- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic separation
- **Dependency Injection**: Loose coupling
- **DTO Pattern**: Data transfer validation
- **Middleware Pattern**: Cross-cutting concerns

### Code Quality
- **Strong Typing**: Full TypeScript coverage
- **Error Handling**: Comprehensive error boundaries
- **Validation**: Zod schemas for all inputs
- **Logging**: Structured logging throughout
- **Testing**: Unit tests for critical paths

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- SQL injection prevention (Prisma)
- CORS configuration
- Rate limiting (recommended for production)

## 📦 Default Users

The database is seeded with:

```
Email: admin@purefusion.com
Password: admin123

Email: user@purefusion.com
Password: user123
```

## 🚀 Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

### Build Backend
```bash
cd backend
npm run build
```

### Environment Variables
Update `.env` files with production values:
- Strong JWT secret
- Production database URL
- CORS origins
- API URLs

### Recommended Enhancements
- PostgreSQL instead of SQLite
- Redis for session management
- Rate limiting middleware
- API versioning
- Monitoring (Prometheus/Grafana)
- Container deployment (Docker)

## 📖 Additional Documentation

- **OpenAPI Spec**: `/docs/openapi.yaml`
- **Postman Collection**: `/docs/postman-collection.json`
- **Architecture Diagram**: `/docs/architecture-diagram.png`

## 🤝 Contributing

This is a mock implementation for demonstration purposes. Follow the established patterns:

1. Use TypeScript strictly
2. Follow SOLID principles
3. Write tests for new features
4. Update documentation
5. Use conventional commits

## 📝 License

MIT License - This is a demonstration project.

## 🙏 Acknowledgments

Built following enterprise-grade development practices with:
- Clean Architecture
- Domain-Driven Design
- Test-Driven Development
- SOLID Principles

---

**Built with ❤️ for Pure Storage Fusion**
