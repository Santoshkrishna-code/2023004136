# Notifications App Backend

This is the custom local backend service for the campus notification evaluation system. It replaces the remote API for local testing and integrates directly with a MongoDB database as designed in the evaluation stages.

## Features
- **MongoDB Schema**: Users and Notifications collections as designed in **Stage 2**.
- **Compound Indexes**: Implements composite indexes `{ userId: 1, isRead: 1, createdAt: -1 }` as designed in **Stage 3** to optimize query performance.
- **REST API Endpoints**:
  - `POST /evaluation-service/register` - Registers users and returns mock tokens/keys.
  - `GET /evaluation-service/notifications` - Paginated and type-filtered notifications query.
  - `POST /evaluation-service/logs` - Middleware logging target.

---

## Prerequisites
- **Node.js** (v18+)
- **MongoDB** running locally on `mongodb://localhost:27017`

---

## Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Seed the Database**:
   Populates MongoDB with a default user and initial test notifications matching the evaluation dataset.
   ```bash
   npm run seed
   ```

3. **Start the Express Server**:
   Launches the server on port `5000`.
   ```bash
   npm start
   ```

---

## Endpoints

### 1. Register User (POST)
- **Endpoint**: `/evaluation-service/register`
- **Request Body**:
  ```json
  {
    "email": "santoshkrishnabandla@gmail.com",
    "name": "Santosh Krishna",
    "rollNo": "2023004136"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Registration successful",
    "token": "mock_token_for_evaluation_2023004136",
    "clientID": "client_2023004136",
    "clientSecret": "secret_2023004136"
  }
  ```

### 2. Fetch Notifications (GET)
- **Endpoint**: `/evaluation-service/notifications`
- **Query Params**:
  - `page` (default `1`)
  - `limit` (default `10`)
  - `notification_type` (`All`, `Placement`, `Result`, `Event`)
- **Response**:
  ```json
  {
    "notifications": [
      {
        "ID": "6a251fd4f69239d0e9f56980",
        "Type": "Placement",
        "Message": "CSX Corporation hiring drive announced",
        "Timestamp": "2026-04-22 17:51:18"
      }
    ]
  }
  ```

### 3. Log Middleware API (POST)
- **Endpoint**: `/evaluation-service/logs`
- **Request Body**:
  ```json
  {
    "stack": "backend",
    "level": "info",
    "package": "service",
    "message": "notification fetched"
  }
  ```
