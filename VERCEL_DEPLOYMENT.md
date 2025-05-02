# Deploying Skillbag Book Club on Vercel

This guide will walk you through the steps to deploy this application on Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (you can sign up with GitHub, GitLab, or email)
2. Your PostgreSQL database (we're using Neon database in this project)
3. Git repository with your code (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Push Your Code to a Git Repository (if not already done)

Make sure your code is pushed to a Git repository on GitHub, GitLab, or Bitbucket.

### 2. Connect Vercel to Your Repository

1. Log in to your Vercel account
2. Click "Add New..." and select "Project"
3. Connect to your Git provider (GitHub, GitLab, or Bitbucket)
4. Select the repository containing your Skillbag Book Club code
5. Click "Import"

### 3. Configure Project Settings

On the project configuration page:

1. **Project Name**: You can keep the default or choose a custom name
2. **Framework Preset**: Select "Other" (the vercel.json file will handle configuration)
3. **Root Directory**: Leave as default (top-level directory of your repo)

### 4. Environment Variables

Add the following environment variables:

| Name | Value | Description |
|------|-------|-------------|
| `DATABASE_URL` | `postgresql://user:password@hostname:port/database` | Your PostgreSQL connection string |
| `SESSION_SECRET` | `your_random_secure_string` | A long random string for session security |
| `NODE_ENV` | `production` | Production environment flag |

For the SESSION_SECRET, generate a random string (you can use a password manager or a random string generator).

### 5. Advanced Build Settings

No changes needed here as we've already configured the build settings in the `vercel.json` file.

### 6. Deploy

Click "Deploy" and wait for the build process to complete.

## Post-Deployment Steps

### 1. Set Up Your Domain (Optional)

1. Go to your project in the Vercel dashboard
2. Click on "Domains"
3. Add a custom domain if you have one, or use the Vercel-provided domain

### 2. Database Initialization

If your database is not yet initialized:

1. Go to the "Deployments" tab in your Vercel project
2. Click on the latest deployment
3. Click on "Functions" to see your serverless functions
4. Click on "Logs" to see the server logs

### 3. Verify the Application

1. Visit your deployed application URL
2. Test user registration, login, and other key features
3. Check that database operations are working correctly

## Troubleshooting

If you encounter issues:

1. **Database Connection**: Check the DATABASE_URL environment variable is correct
2. **Build Errors**: Review build logs in the Vercel dashboard
3. **Runtime Errors**: Check function logs in the Vercel dashboard

## Updating Your Deployment

Any new commits pushed to the main branch of your connected repository will automatically trigger a new deployment.

## Accessing Environment Variables in the Frontend

Remember that only environment variables prefixed with `VITE_` will be available in the frontend code.

For example, to use your Stripe public key in the frontend, name it `VITE_STRIPE_PUBLIC_KEY`.