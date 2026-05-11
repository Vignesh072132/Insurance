# Insurance Claim Management System - Backend

Complete backend API for managing insurance policies and claims with role-based access control.

## Tech Stack
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Multer for file uploads

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Update `.env` file:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/
JWT_SECRET=supersecretkey
```

### 3. Start MongoDB
Ensure MongoDB is running on your system.

### 4. Run the Server
```bash
npm start
# or for development with auto-reload
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Policies
- `GET /api/policies` - Get all policies (Protected)
- `POST /api/policies` - Create policy (Admin/Agent only)
- `GET /api/policies/:id` - Get single policy (Protected)
- `PUT /api/policies/:id` - Update policy (Admin/Agent only)
- `DELETE /api/policies/:id` - Delete policy (Admin only)

### Claims
- `GET /api/claims` - Get all claims (Protected)
- `POST /api/claims` - Submit claim with documents (Protected)
- `GET /api/claims/:id` - Get single claim (Protected)
- `PUT /api/claims/:id/status` - Update claim status (Admin only)
- `DELETE /api/claims/:id` - Delete claim (Protected)

## User Roles
- **customer**: Can view own policies and submit claims
- **agent**: Can create/update policies
- **admin**: Full access including claim approval/rejection

## Request Examples

### Register
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Policy
```json
POST /api/policies
Headers: { "Authorization": "Bearer <token>" }
{
  "policyType": "Health",
  "coverageAmount": 100000,
  "expiryDate": "2025-12-31"
}
```

### Submit Claim
```
POST /api/claims
Headers: { "Authorization": "Bearer <token>" }
Content-Type: multipart/form-data

Fields:
- policy: <policy_id>
- description: "Claim description"
- claimAmount: 5000
- documents: [file1, file2] (max 5 files, 5MB each)
```

### Approve/Reject Claim
```json
PUT /api/claims/:id/status
Headers: { "Authorization": "Bearer <token>" }
{
  "status": "Approved",
  "rejectionReason": "Optional reason if rejected"
}
```

## Security Features
- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected routes with middleware
- File upload validation

## Error Handling
All endpoints return appropriate HTTP status codes and error messages in JSON format.

## File Upload
- Supported formats: JPEG, JPG, PNG, PDF, DOC, DOCX
- Max file size: 5MB per file
- Max files per claim: 5
- Files stored in `/uploads` directory
