# Backend API Documentation

## Base Route

`/api/user`

---

## POST `/api/user/register`

Registers a new user.

### Description

Creates a new user account with full name, email, and password.

### Request Headers

- `Content-Type: application/json`

### Request Body

```json
{
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Required Fields

- `fullName.firstName` — required, minimum 3 characters
- `fullName.lastName` — required, minimum 3 characters
- `email` — required, valid email address
- `password` — required, minimum 6 characters

### Success Response

**Status Code:** `201 Created`

```json
{
  "message": "User registered successfully",
  "token": "JWT_TOKEN_HERE"
}
```

### Error Responses

**Status Code:** `400 Bad Request`

```json
{
  "message": "Validation failed",
  "errors": []
}
```

```json
{
  "message": "User already exists"
}
```

**Status Code:** `500 Internal Server Error`

```json
{
  "message": "Internal server error"
}
```
