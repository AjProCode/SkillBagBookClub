# Deploying Skillbag Book Club on Vercel

This guide walks you through deploying your Skillbag Book Club application on Vercel, with a comprehensive approach to fix the build errors.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (you can sign up with GitHub, GitLab, or email)
2. Your PostgreSQL database (we recommend Neon database for this project)
3. Git repository with your code

## Important Files for Vercel Deployment

We've created several files to ensure your application builds and deploys properly on Vercel:

1. **vercel.json** - Enhanced configuration for Vercel with proper build commands
2. **vercel-build.sh** - Custom build script to handle Vite and ESBuild
3. **api/vercel-api.js** - Serverless function entry point for the API
4. **api/index.js** - Simple API status endpoint for testing
5. **api/health.js** - Health check endpoint
6. **api/db-test.js** - Database connectivity test endpoint

## Deployment Steps

### 1. Push Your Code to a Git Repository

First, ensure all your code, including the Vercel-specific files, is pushed to GitHub, GitLab, or Bitbucket:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

### 2. Connect Vercel to Your Repository

1. Log in to your Vercel account
2. Click "Add New..." and select "Project"
3. Connect to your Git provider
4. Select your Skillbag Book Club repository
5. Click "Import"

### 3. Configure Project Settings

On the project configuration page:

1. **Project Name**: Keep the default or choose a custom name
2. **Framework Preset**: Select "Vite" (our vercel.json file will handle the rest)
3. **Root Directory**: Leave as default (top-level directory)

### 4. Environment Variables (Critical)

Add these required environment variables:

| Name | Value | Description |
|------|-------|-------------|
| `DATABASE_URL` | `postgresql://user:password@hostname:port/database` | Your PostgreSQL connection string |
| `SESSION_SECRET` | `your_random_secure_string` | A long random string for session security |
| `NODE_ENV` | `production` | Production environment flag |

For `SESSION_SECRET`, generate a random string (at least 32 characters).

### 5. Deploy

Click "Deploy" and wait for the build process to complete.

## Verifying Your Deployment

1. After deployment completes, click "Visit" to see your live site
2. Test these key functionalities:
   - User registration
   - User login
   - Viewing books and reading progress
   - Subscription management

## Troubleshooting 404 Errors

If you encounter a 404 NOT_FOUND error with an ID like `bom1::n5sv8-1746192916070-3ae8d2b58061`:

1. Check that you've included the `api/index.js` file and the correct `vercel.json` configuration
2. Verify all environment variables are properly set
3. Check your database connection by viewing the Vercel function logs
4. See the detailed VERCEL_TROUBLESHOOTING.md file for more solutions

## Database Deployment Notes

1. Make sure your PostgreSQL database is accessible from Vercel's servers
2. For Neon Database, allow connections from all IP addresses
3. You might need to run these commands to set up your database schema:
   ```bash
   DATABASE_URL=your_production_url npm run db:push
   DATABASE_URL=your_production_url npm run db:seed
   ```

## Getting Help

If you encounter issues not covered in the troubleshooting guide:

1. Check the [Vercel documentation](https://vercel.com/docs)
2. View your function logs for specific error messages
3. Contact [Vercel Support](https://vercel.com/help) for deployment-specific issues

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