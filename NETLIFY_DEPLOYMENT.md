# Deploying Skillbag Book Club on Netlify

This guide walks you through deploying your Skillbag Book Club application on Netlify, a powerful platform for modern web projects with serverless functions.

## Prerequisites

1. A [Netlify account](https://app.netlify.com/signup) (you can sign up with GitHub, GitLab, or email)
2. Your PostgreSQL database (we recommend Neon or Railway for easy setup)
3. Git repository with your code

## Important Files for Netlify Deployment

We've created several files to ensure your application deploys properly on Netlify:

1. **netlify.toml** - Configuration file with build settings and redirects
2. **netlify/functions/api.js** - Serverless function entry point for the API
3. **netlify/functions/health.js** - Health check endpoint
4. **netlify/functions/db-test.js** - Database connectivity test endpoint

## Deployment Steps

### 1. Push Your Code to a Git Repository

First, ensure all your code, including the Netlify configuration files, is pushed to GitHub, GitLab, or Bitbucket:

```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push
```

### 2. Connect Netlify to Your Repository

1. Log in to your Netlify account
2. Click "Add new site" and select "Import an existing project"
3. Connect to your Git provider
4. Select your Skillbag Book Club repository
5. Netlify will detect your `netlify.toml` file and pre-fill the build settings

### 3. Configure Environment Variables

Add these required environment variables:

| Name | Value | Description |
|------|-------|-------------|
| `DATABASE_URL` | `postgresql://user:password@hostname:port/database` | Your PostgreSQL connection string |
| `SESSION_SECRET` | `your_random_secure_string` | A long random string for session security |
| `NODE_ENV` | `production` | Production environment flag |

For `SESSION_SECRET`, generate a random string (at least 32 characters).

### 4. Deploy

Click "Deploy site" and wait for the build process to complete.

## Setting Up a Database

For your PostgreSQL database, we recommend:

1. **Neon.tech**: 
   - Create a free account at [neon.tech](https://neon.tech)
   - Create a new project and database
   - Copy the connection string provided
   - Add it as the `DATABASE_URL` environment variable in Netlify

2. **Railway**:
   - Create a free account at [railway.app](https://railway.app)
   - Start a new PostgreSQL project
   - Copy the connection string from the "Connect" tab
   - Add it as the `DATABASE_URL` environment variable in Netlify

## Initializing Your Database

After deployment, you need to initialize your database. You can do this using Netlify CLI:

1. Install Netlify CLI globally: `npm install -g netlify-cli`
2. Login to your Netlify account: `netlify login`
3. Link your local project: `netlify link`
4. Run database initialization commands:

```bash
netlify env:set DATABASE_URL your_database_url
netlify dev:exec "npm run db:push"
netlify dev:exec "npm run db:seed"
```

## Verifying Your Deployment

1. After deployment completes, visit your Netlify site URL
2. Test these key endpoints:
   - `/health` - Should return a 200 OK status
   - `/db-test` - Should return a successful database connection status
   - `/api/user` - Should return a 401 status when not logged in

## Functions and API Routes

All your API routes will be available under `/.netlify/functions/api/*` and are also accessible via the redirects configured in `netlify.toml` as `/api/*`.

## Custom Domains

To set up a custom domain:

1. Go to your Netlify site dashboard
2. Click "Domain settings"
3. Click "Add custom domain"
4. Follow the instructions to configure your DNS settings

## Troubleshooting

If you encounter issues:

1. **Build Failures**: Check your build logs in the Netlify dashboard
2. **Function Errors**: Go to "Functions" in your Netlify dashboard and check the logs
3. **Database Connection Issues**: Verify your `DATABASE_URL` environment variable
4. **404 Errors**: Make sure your redirects are properly configured in `netlify.toml`

## Netlify Specific Features

### Environment Variables Per Branch

You can set different environment variables for different deployment branches:

1. Go to your site in the Netlify dashboard
2. Click "Site settings" > "Environment variables"
3. Click "Add variable" and select "Scope to specific contexts"

### Split Testing

You can set up A/B testing for your site:

1. Go to your site in the Netlify dashboard
2. Click "Split testing"
3. Follow the instructions to set up your tests

## Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Netlify Community](https://community.netlify.com/)
- [Netlify Support](https://www.netlify.com/support/)

## Next Steps

After deploying your Skillbag Book Club application, consider:

1. Setting up CI/CD with automated testing
2. Configuring custom domains and SSL
3. Implementing monitoring and analytics
4. Setting up automatic database backups