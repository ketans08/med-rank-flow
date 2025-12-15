# 🔐 Authentication System

## Simple Email/Password Authentication

This application uses **simple session-based authentication** - no JWT, no OAuth, just email and password.

## How It Works

1. **Login**: User enters email and password
2. **Verification**: Backend checks credentials against database
3. **Session Creation**: Backend creates a simple random token
4. **Token Storage**: Token stored in MongoDB sessions collection
5. **Frontend Storage**: Token saved in browser localStorage
6. **Request Authentication**: Token sent with each API request
7. **Session Validation**: Backend validates token from database

## Features

- ✅ Simple email/password login
- ✅ Session tokens stored in MongoDB
- ✅ Sessions expire after 24 hours
- ✅ No JWT complexity
- ✅ No OAuth providers
- ✅ Easy to understand and maintain

## Login Endpoint

```
POST /auth/login
Body: {
  "email": "admin@institute.edu",
  "password": "admin123"
}

Response: {
  "access_token": "simple-random-token",
  "token_type": "bearer",
  "user": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "admin" | "student"
  }
}
```

## Logout Endpoint

```
POST /auth/logout
Headers: Authorization: Bearer <token>

Response: {
  "message": "Logged out successfully"
}
```

## Demo Credentials

**Admin:**
- Email: `admin@institute.edu`
- Password: `admin123`

**Students:**
- Email: `student01@student.edu` to `student25@student.edu`
- Password: `student123` (same for all)

## Security

- Passwords are hashed with bcrypt
- Sessions expire after 24 hours
- Tokens are random and secure
- No sensitive data in tokens
- Simple and straightforward!

