# Express Register API Documentation

## Table of Contents

1. [Introduction](#1-introduction)
2. [Base URL](#2-base-url)
3. [Endpoints](#3-endpoints)
   - [3.1 User Register](#31-user-register)
   - [3.2 User Login](#32-user-login)
   - [3.3 Change Password](#33-change-password)
   - [3.4 Get Logged-in User](#34-get-logged-in-user)
   - [3.5 Send Password Reset Link](#35-send-password-reset-link)
   - [3.6 Reset Password](#36-reset-password)
   - [3.7 Admin Dashboard](#37-admin-dashboard)
4. [Setup Instructions](#4-setup-instructions)
5. [Testing with Postman](#5-testing-with-postman)
6. [Conclusion](#6-conclusion)

## 1. Introduction

Welcome to the API documentation for the Express Register application. This documentation provides information about the available RESTful APIs.

## 2. Base URL

All API requests should be made to the following base URL:

```
http://localhost:8000/api
```

## 3. Endpoints

### 3.1 User Register

- **Endpoint**: `/user/register`
- **Method**: `POST`
- **Request Body**:

  ```json
  {
    "name": "Vivek",
    "email": "vivek@example.com",
    "password": "12345",
    "password_confirmation": "12345",
    "tc": "true"
  }
  ```

- **Response**:

  ```json
  {
    "message": "User registered successfully"
  }
  ```

### 3.2 User Login

- **Endpoint**: `/user/login`
- **Method**: `POST`
- **Request Body**:

  ```json
  {
    "email": "vivek@example.com",
    "password": "12345"
  }
  ```

- **Response**:

  ```json
  {
    "token": "your_jwt_token"
  }
  ```

### 3.3 Change Password

- **Endpoint**: `/user/changepassword`
- **Method**: `POST`
- **Authentication**: Bearer Token

- **Request Body**:

  ```json
  {
    "password": "123456",
    "password_confirmation": "123456"
  }
  ```

### 3.4 Get Logged-in User

- **Endpoint**: `/user/loggeduser`
- **Method**: `GET`
- **Authentication**: Bearer Token

### 3.5 Send Password Reset Link

- **Endpoint**: `/user/send-reset-password-email`
- **Method**: `POST`
- **Request Body**:

  ```json
  {
    "email": "vivek@example.com"
  }
  ```

### 3.6 Reset Password

- **Endpoint**: `/user/reset-password/:userId/:token`
- **Method**: `POST`
- **Request Body**:

  ```json
  {
    "password": "vivek",
    "password_confirmation": "vivek"
  }
  ```

### 3.7 Admin Dashboard

- **Endpoint**: `/user/adminDashboard`
- **Method**: `GET`

## 4. Setup Instructions

Follow these instructions to set up and run the Express Register application:

1. Clone the repository:
   ```bash
   git clone https://github.com/your/repository.git
   ```

2. Navigate to the project directory:
   ```bash
   cd your-project-directory
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   npm start
   ```
5. Start Test Case
  ```bash
   npm test
  ```

## 5. Testing with Postman

1. Open Postman.
2. Import the provided Postman collection.
3. Update the environment variables with your API base URL (`http://localhost:8000`).
4. Test each endpoint by sending requests.

## Note
I have added a sample env file and removed the .env file from gitignore. Please rename the .env.sample to .env and add your own credentials.
And also add your own email and password in the .env file for sending email.
  

