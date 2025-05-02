# Skillbag Book Club

A professional and creative book club platform for young readers (8-16) featuring free access to book reviews, reading logs, and a digital library.

## Features

- Digital library of books for young readers
- Reading progress tracking
- Book reviews and ratings
- User authentication
- Responsive design for all devices

## Tech Stack

- **Frontend**: React, TailwindCSS, shadcn UI components
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with session-based auth

## Deployment Guide

This application is configured for free deployment on various platforms. Follow the steps below to deploy it without any fees.

### Prerequisites

- A free PostgreSQL database (Neon.tech, Supabase, Railway, etc.)
- A free hosting service (Vercel, Netlify, Render, etc.)

### Deployment Steps

1. **Set up your database**
   - Create a free PostgreSQL database
   - Copy your database connection string

2. **Clone this repository**
   - `git clone <repository-url>`
   - `cd skillbag-book-club`

3. **Configure environment variables**
   - Copy `.env.sample` to `.env` (for local development)
   - Set the `DATABASE_URL` to your database connection string
   - Generate a random string for `SESSION_SECRET`

4. **Deploy to your preferred platform**

   **Vercel:**
   - Connect your GitHub repository to Vercel
   - Set the environment variables in the Vercel dashboard
   - Vercel will automatically detect the configuration from `vercel.json`

   **Netlify:**
   - Connect your GitHub repository to Netlify
   - Add environment variables in the Netlify dashboard
   - Set the build command to `npm run build`
   - Set the publish directory to `dist`

   **Render:**
   - Connect your GitHub repository to Render
   - Set the build command to `npm run build`
   - Set the start command to `npm start`
   - Add environment variables

## Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with your database connection and secrets

3. Push the database schema:
   ```
   npm run db:push
   ```

4. Seed the database:
   ```
   npm run db:seed
   ```

5. Start the development server:
   ```
   npm run dev
   ```

## License

MIT