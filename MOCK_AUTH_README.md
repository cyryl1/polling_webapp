# Mock Authentication System

## Overview

This project includes a mock authentication system for development and testing purposes. The system uses browser local storage to persist user data and authentication state.

## Default Credentials

A default admin user is created automatically:

- **Email**: admin@example.com
- **Password**: password123

## Features

1. **User Registration**: Create new user accounts
2. **User Authentication**: Sign in with email and password
3. **Session Persistence**: Stay logged in between page refreshes
4. **Protected Routes**: Restrict access to authenticated users
5. **Admin Panel**: Manage mock users for testing

## How to Use

### Sign Up

1. Navigate to `/auth/sign-up`
2. Fill in the registration form with name, email, and password
3. Submit the form to create a new account and be automatically logged in

### Sign In

1. Navigate to `/auth/sign-in`
2. Enter your email and password
3. Click "Sign In" to authenticate

### Sign Out

1. Click the "Sign Out" button in the navigation bar when logged in

### Admin Panel

An admin panel is available at `/admin` for managing mock users:

1. View all registered users
2. Add new test users
3. Reset users to default state
4. Debug authentication state

## Implementation Details

### Local Storage Keys

- `polling_app_mock_users`: Stores the array of registered users
- `polling_app_current_user`: Stores the currently logged-in user

### Files

- `lib/auth-context.tsx`: Main authentication context provider
- `lib/mock-auth-utils.ts`: Utility functions for managing mock users
- `components/auth/protected-route.tsx`: Component for protecting routes
- `app/admin/page.tsx`: Admin panel for managing mock users

## Security Note

This is a mock authentication system intended for development and testing only. It stores passwords in plain text in the browser's local storage, which is not secure for production use.

For a production application, implement proper authentication with:

1. Secure password hashing
2. Server-side authentication
3. JWT or session-based auth
4. HTTPS
5. CSRF protection