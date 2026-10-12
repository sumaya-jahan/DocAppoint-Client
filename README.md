# DocAppoint

DocAppoint is a doctor appointment management web application built with Next.js, Better Auth, Express.js, and MongoDB.

## Live Website

https://doc-appoint-client-three.vercel.app/

## Client Repository

https://github.com/sumaya-jahan/DocAppoint-Client

## Server Repository

https://github.com/sumaya-jahan/DocAppoint-Server

## Key Features

- Secure authentication using Better Auth
- Email and password registration and login
- Google social login
- Browse all doctors dynamically
- Search doctors by doctor name
- View detailed doctor information
- Book doctor appointments securely
- Private user dashboard
- Update and delete appointments
- Update user profile name and photo
- Protected routes with login redirect
- Responsive design for mobile, tablet, and desktop
- Loading states and custom 404 page
- JWT plugin integration with Better Auth
- Environment-based API configuration

## Technologies Used

### Frontend

- Next.js
- React
- Tailwind CSS
- DaisyUI
- Better Auth
- React Hot Toast

### Backend

- Node.js
- Express.js
- MongoDB
- Better Auth
- Better Auth MongoDB Adapter

## Environment Variable

Create a `.env.local` file in the client project:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000