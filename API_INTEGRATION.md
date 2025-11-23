# TechyRide - Backend API Integration Guide

This document provides guidelines for integrating TechyRide with a backend API.

## Overview

TechyRide is currently built with a frontend-only implementation using AsyncStorage for data persistence. To make it production-ready, you need to integrate it with a backend API.

## Recommended Backend Stack

### Option 1: Node.js + Express + MongoDB
```
- Node.js (Express framework)
- MongoDB (Database)
- JWT (Authentication)
- Socket.io (Real-time features)
```

### Option 2: Firebase
```
- Firebase Authentication
- Cloud Firestore (Database)
- Cloud Functions (Backend logic)
- Cloud Messaging (Notifications)
```

### Option 3: Django + PostgreSQL
```
- Django (Python framework)
- PostgreSQL (Database)
- Django REST Framework (API)
- Celery (Background tasks)
```

## API Endpoints Specification

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@company.com",
  "password": "securepassword"
}

Response 201:
{
  "success": true,
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@company.com",
    "verified": false
  },
  "token": "jwt_token_here"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@company.com",
  "password": "securepassword"
}

Response 200:
{
  "success": true,
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@company.com",
    "verified": true
  },
  "token": "jwt_token_here"
}
```

#### Verify Email
```http
POST /api/auth/verify-email
Content-Type: application/json
Authorization: Bearer {token}

{
  "code": "123456"
}

Response 200:
{
  "success": true,
  "message": "Email verified successfully"
}
```

### Rides

#### Get All Rides
```http
GET /api/rides?status=active&date=2024-01-20
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "rides": [
    {
      "id": "ride_123",
      "from": "Electronic City",
      "to": "Koramangala",
      "date": "2024-01-20",
      "time": "09:00",
      "distance": 12.5,
      "farePerKm": 5,
      "availableSeats": 3,
      "totalSeats": 4,
      "driver": {
        "id": "user_123",
        "name": "John Doe",
        "rating": 4.5
      }
    }
  ]
}
```

#### Create Ride
```http
POST /api/rides
Content-Type: application/json
Authorization: Bearer {token}

{
  "from": "Electronic City",
  "fromLat": 12.8456,
  "fromLng": 77.6632,
  "to": "Koramangala",
  "toLat": 12.9352,
  "toLng": 77.6245,
  "date": "2024-01-20",
  "time": "09:00",
  "distance": 12.5,
  "farePerKm": 5,
  "totalSeats": 4
}

Response 201:
{
  "success": true,
  "ride": {
    "id": "ride_123",
    "from": "Electronic City",
    "to": "Koramangala",
    "date": "2024-01-20",
    "time": "09:00",
    "distance": 12.5,
    "farePerKm": 5,
    "availableSeats": 4,
    "status": "active"
  }
}
```

#### Book Ride
```http
POST /api/rides/:rideId/book
Content-Type: application/json
Authorization: Bearer {token}

{
  "seats": 1
}

Response 200:
{
  "success": true,
  "booking": {
    "id": "booking_123",
    "rideId": "ride_123",
    "passengerId": "user_456",
    "seats": 1,
    "fare": 62.5,
    "status": "confirmed"
  }
}
```

#### Get User's Rides
```http
GET /api/rides/my-rides?role=all
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "asDriver": [...],
  "asPassenger": [...]
}
```

### Wallet & Payments

#### Get Wallet Balance
```http
GET /api/wallet/balance
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "balance": 500,
  "currency": "INR"
}
```

#### Get Transaction History
```http
GET /api/wallet/transactions?limit=50&offset=0
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "transactions": [
    {
      "id": "txn_123",
      "type": "credit",
      "amount": 62.5,
      "description": "Ride payment received",
      "timestamp": "2024-01-20T10:30:00Z",
      "balance": 562.5
    }
  ]
}
```

#### Redeem Points
```http
POST /api/wallet/redeem
Content-Type: application/json
Authorization: Bearer {token}

{
  "amount": 500,
  "upiId": "user@upi"
}

Response 200:
{
  "success": true,
  "transaction": {
    "id": "txn_456",
    "amount": 500,
    "upiId": "user@upi",
    "status": "pending",
    "transactionId": "UPI_123456"
  }
}
```

### User Profile

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@company.com",
    "verified": true,
    "rating": 4.5,
    "totalRides": 25,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Update Profile
```http
PUT /api/users/profile
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "John Smith",
  "phone": "+919876543210"
}

Response 200:
{
  "success": true,
  "user": {
    "id": "user_123",
    "name": "John Smith",
    "phone": "+919876543210"
  }
}
```

## Integration Steps

### 1. Create API Service

Create `src/services/api.js`:

```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://api.yourdomain.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      AsyncStorage.removeItem('authToken');
      AsyncStorage.removeItem('user');
      // Navigate to login screen
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 2. Update AuthContext

```javascript
import api from '../services/api';

const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    
    await AsyncStorage.setItem('authToken', response.token);
    await AsyncStorage.setItem('user', JSON.stringify(response.user));
    
    setUser(response.user);
    return { success: true, user: response.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

### 3. Update Ride Screens

```javascript
import api from '../services/api';

const loadRides = async () => {
  try {
    const response = await api.get('/rides', {
      params: { status: 'active' }
    });
    setRides(response.rides);
  } catch (error) {
    console.error('Failed to load rides:', error);
  }
};
```

### 4. Integrate Payment Gateway

For UPI payments, integrate with:
- Razorpay
- PayU
- Cashfree
- Paytm

Example with Razorpay:

```javascript
import RazorpayCheckout from 'react-native-razorpay';

const redeemPoints = async (amount, upiId) => {
  try {
    // Create order on backend
    const order = await api.post('/wallet/create-order', { amount });
    
    // Open Razorpay checkout
    const options = {
      key: 'rzp_test_xxxxx',
      amount: amount * 100, // paise
      currency: 'INR',
      name: 'TechyRide',
      order_id: order.id,
      prefill: {
        email: user.email,
      },
    };
    
    const data = await RazorpayCheckout.open(options);
    
    // Verify payment on backend
    await api.post('/wallet/verify-payment', {
      orderId: order.id,
      paymentId: data.razorpay_payment_id,
      signature: data.razorpay_signature,
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

## Security Considerations

### 1. Authentication
- Use JWT with short expiry times
- Implement refresh tokens
- Validate email domain for company verification
- Implement rate limiting

### 2. API Security
- Use HTTPS only
- Validate all inputs on backend
- Implement CSRF protection
- Use prepared statements for database queries
- Sanitize user inputs

### 3. Payment Security
- Never store card details
- Use PCI-DSS compliant payment gateway
- Verify all payments on backend
- Implement transaction logging
- Add fraud detection

### 4. Data Privacy
- Encrypt sensitive data
- Implement data retention policies
- GDPR compliance
- User consent management

## Real-time Features

### WebSocket Integration

For real-time ride updates:

```javascript
import io from 'socket.io-client';

const socket = io(API_BASE_URL, {
  auth: {
    token: authToken,
  },
});

socket.on('ride-updated', (ride) => {
  // Update ride in state
});

socket.on('booking-confirmed', (booking) => {
  // Show notification
});
```

## Push Notifications

### Firebase Cloud Messaging

1. Install dependencies:
```bash
npm install @react-native-firebase/app @react-native-firebase/messaging
```

2. Configure FCM token:
```javascript
import messaging from '@react-native-firebase/messaging';

const getFCMToken = async () => {
  const token = await messaging().getToken();
  // Send token to backend
  await api.post('/users/fcm-token', { token });
};
```

3. Handle notifications:
```javascript
messaging().onMessage(async remoteMessage => {
  // Show in-app notification
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  // Handle background notification
});
```

## Testing

### Unit Tests
```javascript
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../screens/auth/LoginScreen';

describe('LoginScreen', () => {
  it('should login successfully', async () => {
    const { getByPlaceholder, getByText } = render(<LoginScreen />);
    
    fireEvent.changeText(getByPlaceholder('Email'), 'test@company.com');
    fireEvent.changeText(getByPlaceholder('Password'), 'password123');
    fireEvent.press(getByText('Login'));
    
    // Assert success
  });
});
```

### Integration Tests
```javascript
import api from '../services/api';

describe('API Integration', () => {
  it('should create ride successfully', async () => {
    const rideData = {
      from: 'Point A',
      to: 'Point B',
      date: '2024-01-20',
      time: '09:00',
      farePerKm: 5,
    };
    
    const response = await api.post('/rides', rideData);
    expect(response.success).toBe(true);
    expect(response.ride).toBeDefined();
  });
});
```

## Deployment

### Backend Deployment
- Use cloud platforms: AWS, Google Cloud, Azure
- Set up CI/CD pipeline
- Configure environment variables
- Set up monitoring and logging

### App Deployment
- Android: Google Play Console
- iOS: App Store Connect
- Use CodePush for OTA updates

## Monitoring

### Analytics
- Google Analytics
- Mixpanel
- Amplitude

### Error Tracking
- Sentry
- Crashlytics
- Bugsnag

### Performance Monitoring
- Firebase Performance Monitoring
- New Relic
- DataDog

## Conclusion

This guide provides a comprehensive overview of integrating TechyRide with a backend API. Follow these guidelines to create a production-ready carpooling application.
