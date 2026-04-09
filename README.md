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

---

## POST `/api/captain/register`

Registers a new captain.

### Description

Creates a captain account with full name, email, password, and vehicle details.

### Request Headers

- `Content-Type: application/json`

### Request Body

```json
{
  "fullName": {
    "firstName": "Rahul",
    "lastName": "Sharma"
  },
  "email": "rahul.captain@example.com",
  "password": "password123",
  "vehicle": {
    "color": "Black",
    "plateNumber": "MH12AB1234",
    "capacity": "4",
    "vehicleType": "car"
  }
}
```

### Required Fields

- `fullName.firstName` — required, minimum 3 characters
- `fullName.lastName` — optional, if provided minimum 3 characters
- `email` — required, valid email address
- `password` — required, minimum 6 characters
- `vehicle.color` — required, minimum 3 characters
- `vehicle.plateNumber` — required, minimum 3 characters
- `vehicle.capacity` — required, minimum 1 character
- `vehicle.vehicleType` — required, one of `car`, `motorcycle`, `auto`

### Success Response

**Status Code:** `201 Created`

```json
{
  "message": "Captain registered successfully",
  "token": "JWT_TOKEN_HERE"
}
```

### Error Responses

**Status Code:** `400 Bad Request`

Validation failed:
```json
{
  "errors": []
}
```

Missing required fields:
```json
{
  "message": "Please fill in all required fields"
}
```

Captain already exists:
```json
{
  "message": "Captain with this email already exists"
}
```

**Status Code:** `500 Internal Server Error`

```json
{
  "message": "An error occurred while registering the captain"
}
```

---

## POST `/api/users/logout`

Logs out the authenticated user.

### Description

Invalidates the current JWT by adding it to a blacklist and clears the `token` cookie.

### Request Headers

- `Content-Type: application/json`
- `Authorization: Bearer <JWT_TOKEN>` (optional if `token` cookie is present)

### Authentication

- Requires a valid JWT in either:
  - `token` cookie, or
  - `Authorization` header as Bearer token

### Request Body

No request body is required.

### Success Response

**Status Code:** `200 OK`

```json
{
  "message": "User logged out successfully"
}
```

### Error Responses

**Status Code:** `401 Unauthorized`

Missing token:
```json
{
  "message": "Access denied. No token provided."
}
```

Invalid/blacklisted token:
```json
{
  "message": "Invalid token. Please log in again."
}
```

Unauthorized user:
```json
{
  "message": "Unauthorized"
}
```

**Status Code:** `500 Internal Server Error`

```json
{
  "message": "Internal server error"
}
```

### Note

In the current backend route setup, the logout path is registered as `POST /api/user/logout`.

---

## POST `/api/user/login`

Logs in an existing user.

### Description

Authenticates a user with email and password, returns a JWT token.

### Request Headers

- `Content-Type: application/json`

### Request Body

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Required Fields

- `email` — required, valid email address
- `password` — required, minimum 6 characters

### Success Response

**Status Code:** `200 OK`

```json
{
  "message": "User logged in successfully",
  "token": "JWT_TOKEN_HERE"
}
```

### Error Responses

**Status Code:** `400 Bad Request`

Validation failed:
```json
{
  "message": "Validation failed",
  "errors": []
}
```

Invalid credentials:
```json
{
  "message": "Invalid email or password"
}
```

**Status Code:** `500 Internal Server Error`

```json
{
  "message": "Internal server error"
}
```

## GET `/api/user/profile`

Returns the logged-in user's profile.

### Description
This endpoint returns the authenticated user's information.

### Request Headers
- `Content-Type: application/json`

### Authentication
- Requires a valid JWT token in the `token` cookie

### Request Body
No request body is required.

### Success Response
**Status Code:** `200 OK`

```json
{
  "message": "User profile retrieved successfully",
  "user": {
    "_id": "USER_ID",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

### Error Responses

**Status Code:** `401 Unauthorized`

```json
{
  "message": "Access denied. No token provided."
}
```

```json
{
  "message": "Unauthorized"
}
```

**Status Code:** `500 Internal Server Error`

```json
{
  "message": "Internal server error"
}
```