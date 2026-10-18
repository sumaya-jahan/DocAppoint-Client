
# DocAppoint

DocAppoint is a full-stack doctor appointment booking and management application built with Next.js, Express.js, MongoDB, and Better Auth.

## Live Website

https://doc-appoint-client-three.vercel.app/

## GitHub Repositories

**Frontend:** https://github.com/sumaya-jahan/DocAppoint-Client

**Backend:** https://github.com/sumaya-jahan/DocAppoint-Server

## Key Features

### Authentication
- User registration and login
- Google login
- Forgot and reset password
- Demo user login
- Role-based access for users and administrators

### Doctor Management
- Dynamic doctor listings from MongoDB
- Search by doctor name
- Filter by specialty and location
- Sort by consultation fee
- Doctor details with multiple-image gallery
- Admin doctor management: add, edit and delete

### Appointment Management
- Book appointments
- View personal bookings
- Update appointments
- Delete appointments
- Protected appointment operations

### User Dashboard
- View account information
- Edit profile
- Upload profile pictures using Cloudinary
- Manage appointments

### Admin Dashboard
- Overview with live statistics
- Doctor management
- User list
- Contact messages
- Reports with charts and tables
- CSV report export
- Account settings and management links

### Additional Features
- Responsive desktop, tablet and mobile design
- Light and dark themes
- Contact form connected to MongoDB
- Loading states and error messages
- Custom 404 page

## Technology Stack

### Frontend
- Next.js 16
- React
- Tailwind CSS
- DaisyUI
- Better Auth Client
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Better Auth
- Cloudinary
- Multer

### Deployment
- Vercel: Frontend
- Render: Backend
- MongoDB Atlas: Database
- Cloudinary: Profile image storage

## Local Setup

### Frontend

```bash
npm install
npm run dev
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Open http://localhost:3000

### Backend

```bash
npm install
npm run dev
```

Configure the required server environment variables using the project's server configuration.

Never commit `.env` files, database credentials, API secrets, or authentication secrets.

## Demo Login

The Login page includes a **Fill Demo Login** button for a dedicated demo user account.

Use the demo account only for demonstration purposes. Do not use a personal or administrator account for public demo access.

## Project Status

Core authentication, doctor browsing, booking, profile management, admin dashboard, reports and deployment have been implemented and manually tested.

## Author

DocAppoint Project Team
