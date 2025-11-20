# Pure Fusion - Quick Start Guide

## Prerequisites
- Node.js 18+ and npm
- Git

## Installation Steps

### 1. Install Backend Dependencies
```powershell
cd backend
npm install
```

### 2. Install Frontend Dependencies
```powershell
cd ../frontend
npm install
```

### 3. Setup Database
```powershell
cd ../backend
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

### 4. Start All Services

Open 3 separate PowerShell terminals:

#### Terminal 1: Fusion Mock Server
```powershell
cd backend
npm run dev:mock
```

#### Terminal 2: Backend API
```powershell
cd backend
npm run dev
```

#### Terminal 3: Frontend
```powershell
cd frontend
npm run dev
```

## Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs
- **Fusion Mock API**: http://localhost:3001

## Default Login Credentials

```
Email: admin@purefusion.com
Password: admin123
```

or

```
Email: user@purefusion.com
Password: user123
```

## Testing

Run backend tests:
```powershell
cd backend
npm test
```

## Troubleshooting

### Port Already in Use
If you get a port conflict error, you can change the ports in:
- Backend: `backend/.env` (PORT=3000)
- Fusion Mock: `backend/.env` (FUSION_MOCK_PORT=3001)
- Frontend: `frontend/vite.config.ts` (port: 5173)

### Database Issues
If you encounter database issues, delete the database file and re-run migrations:
```powershell
cd backend
Remove-Item -Path prisma/dev.db -ErrorAction SilentlyContinue
npx prisma migrate deploy
npx prisma db seed
```

### Module Not Found
Make sure you've installed all dependencies:
```powershell
cd backend
npm install

cd ../frontend
npm install
```

## Next Steps

1. Login with the default credentials
2. Create a new volume
3. Watch it transition from "creating" to "ready" status
4. Explore the API documentation at http://localhost:3000/api-docs
5. Import the Postman collection from `docs/postman-collection.json`

Enjoy using Pure Fusion! 🚀
