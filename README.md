
# DocAppoint - Doctor Appointment Management System

DocAppoint is a full-stack doctor appointment booking and management web application built with Next.js, React, Express.js, and MongoDB.

The application allows patients to explore doctors, book appointments, manage their bookings, and update their profiles. Administrators can manage doctors, users, reports, and contact messages.

## Live Website

https://doc-appoint-client-three.vercel.app

## GitHub Repositories

Frontend:
https://github.com/sumaya-jahan/DocAppoint-Client/tree/docappoint-upgrade

Backend:
https://github.com/sumaya-jahan/DocAppoint-Server/tree/docappoint-upgrade

## Demo Login Credentials

### User Account

Email: testuser123@example.com  
Password: Abc123

### Admin Account

Email: sumayajahan765@gmail.com  
Password: 123456Aa

## Technologies Used

### Frontend
- Next.js 16
- React
- Tailwind CSS
- DaisyUI
- JavaScript

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Better Auth
- JWT Plugin
- Cloudinary
- Resend

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Features

### 1. Responsive User Interface

- Responsive layouts for mobile, tablet, and desktop
- Light and dark theme support
- Navigation bar with dropdown menus
- Reusable interface components
- Loading indicators and skeleton screens
- Error and success feedback

### 2. Home Page

- Hero section with appointment booking call-to-action
- Featured doctors
- Medical specialties
- Healthcare service information
- Service statistics
- Informational sections
- Footer with navigation and support links

### 3. Doctor Exploration

- Dynamic doctor listing from MongoDB
- Search doctors by name
- Filter doctors by specialty and location
- Sort doctors by available options
- Pagination
- Doctor profile images
- Doctor details pages
- Doctor profile information and related doctors

### 4. Appointment Booking

Authenticated users can:

- Book doctor appointments
- View their appointments
- Update appointment details
- Cancel or delete appointments

Appointment data is managed through backend APIs.

### 5. Authentication

- User registration
- Email and password login
- Forgot password
- Reset password via email
- Authentication session management
- Protected routes
- User and administrator role verification
- Profile password change

Authentication is handled using Better Auth.

### 6. User Dashboard

The user dashboard includes:

- Overview
- My Bookings
- My Profile
- Settings

Users can:

- Review appointment information
- Manage bookings
- Update their names
- Update profile images
- Change account passwords
- Access account settings

### 7. Admin Dashboard

The administrator dashboard includes:

- Overview
- Doctors
- Users
- Reports
- Messages
- Settings

Administrator features include:

- Doctor management (Create, Read, Update, Delete)
- Doctor search and sorting
- User management and sorting
- Pagination
- Dashboard statistics
- Charts and reports
- CSV export
- Contact message management
- Doctor form validation

### 8. Additional Pages

- About Us
- Contact Us
- Help and Support
- Privacy Policy
- Login
- Registration
- Forgot Password
- Reset Password

Contact messages are submitted through the backend and saved in the database.

## Project Structure

```text
DocAppoint-Client/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── assets/
├── next.config.mjs
├── package.json
└── README.md
```

## Installation and Setup

### Step 1: Clone the Project

```bash
git clone -b docappoint-upgrade https://github.com/sumaya-jahan/DocAppoint-Client.git
```

### Step 2: Open the Project

```bash
cd DocAppoint-Client
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Configure Environment

Create a `.env.local` file if needed for your frontend API configuration.

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Use the deployed backend URL or relative API routes for production.

### Step 5: Start Development Server

```bash
npm run dev
```

Open:

http://localhost:3000

### Step 6: Production Build

```bash
npm run build
```

## Backend Setup

Backend Repository:

https://github.com/sumaya-jahan/DocAppoint-Server/tree/docappoint-upgrade

Clone the backend:

```bash
git clone -b docappoint-upgrade https://github.com/sumaya-jahan/DocAppoint-Server.git
```

Install dependencies:

```bash
cd DocAppoint-Server
npm install
```

Configure the backend environment variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000

RESEND_API_KEY=your_resend_api_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

Start the backend:

```bash
npm run dev
```

## Backend API Features

The backend provides:

- Doctor listing and doctor details
- Doctor search, filters, sorting, and pagination
- Appointment creation, update, and deletion
- Contact form submission
- User dashboard information
- Administrator dashboard information
- Doctor management APIs
- User management APIs
- Profile image upload
- Authentication endpoints

## Security

The application includes:

- Authentication with Better Auth
- Administrator role verification
- Protected user endpoints
- Appointment ownership verification
- Input validation
- Error handling
- CORS configuration
- Authentication cookie configuration
- Environment variables for service credentials

Better Auth includes a JWT plugin in the backend configuration. Protected application routes currently use authenticated session verification.

## Deployment

### Frontend

Hosted on Vercel:

https://doc-appoint-client-three.vercel.app

### Backend

Hosted on Render:

https://docappoint-server-2.onrender.com

### Database

MongoDB Atlas

### Image Storage

Cloudinary

### Email Service

Resend

## Testing

Important workflows to verify before submission:

1. Register and log in as a user
2. Browse and search doctors
3. Filter and sort doctor listings
4. Open doctor details
5. Book and manage appointments
6. Open the user dashboard
7. Update profile information
8. Log in as an administrator
9. Create, edit, and delete doctors
10. View administrator dashboard statistics
11. Send a contact message
12. Test mobile responsiveness

## Academic Project

DocAppoint was developed as a full-stack web development assignment to demonstrate responsive frontend design, database integration, authentication, role-based dashboards, CRUD operations, and production deployment.
