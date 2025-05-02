# Simplified Vercel Deployment Troubleshooting Guide

If you're experiencing 404 NOT_FOUND errors or other issues with your Vercel deployment, follow this simplified troubleshooting approach.

## Simple Fix for 404 Error (bom1::n5sv8-XXXXXXX)

We've created a simplified approach that's more compatible with Vercel's serverless architecture:

### 1. Simplified vercel.json

We've simplified the `vercel.json` file to use Vercel's basic configuration:

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ]
}
```

### 2. Created Simple Vercel Serverless Functions

We've added several simple API files that are compatible with Vercel:

```javascript
// api/index.js - Simple status endpoint
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'ok',
    message: 'Skillbag Book Club API is running',
    time: new Date().toISOString()
  });
}

// api/health.js - Health check endpoint
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'healthy',
    environment: process.env.NODE_ENV || 'development',
    time: new Date().toISOString()
  });
}

// api/db-test.js - Database connectivity test
import { pool } from '../db/index.js';

export default async function handler(req, res) {
  try {
    const result = await pool.query('SELECT NOW() as time');
    
    res.status(200).json({
      status: 'success',
      message: 'Database connection successful',
      serverTime: result.rows[0].time
    });
  } catch (error) {
    console.error('Database connection error:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
}
```

## Environment Variables

Make sure these essential environment variables are set in your Vercel project settings:

- `DATABASE_URL`: Your PostgreSQL connection string
- `SESSION_SECRET`: A secure random string for session encryption
- `NODE_ENV`: Set to "production"

To add environment variables:
1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables"
4. Add each variable with its name and value

#### Check Build Logs

1. Go to your Vercel project dashboard
2. Click on "Deployments"
3. Click on your latest deployment
4. Click on "Build Logs"

Look for any errors or warnings during the build process. Common issues include:
- Failed dependencies
- Failed database connections
- Build script errors

#### Check Function Logs

1. Go to your Vercel project dashboard
2. Click on "Deployments"
3. Click on your latest deployment
4. Click on "Functions"
5. Select a function and check its logs

These logs will show any runtime errors that might be causing the 404.

### 2. Database Connection Issues

If your application builds but has trouble connecting to the database:

1. Make sure your `DATABASE_URL` is correctly formatted:
   ```
   postgresql://username:password@hostname:port/database
   ```

2. Ensure your database is accessible from Vercel's servers (many cloud database providers need to have IP restrictions removed)

3. Check if your database provider is compatible with serverless functions (Neon and PlanetScale work well)

### 3. Session Configuration Issues

If users can't stay logged in or sessions aren't working:

1. Make sure `SESSION_SECRET` is set
2. Check server/auth.ts to ensure sessions are properly configured
3. Validate that the session store is working with your database

### 4. Static Asset Issues

If your app loads but is missing styles or images:

1. Make sure your build process is correctly generating and including static assets
2. Check that the output directory is correctly configured in vercel.json

## Advanced Troubleshooting Steps

### Redeploy with Updated Configuration

After making changes to vercel.json or other configuration files:

1. Commit and push your changes to your repository
2. Create a new deployment in Vercel:
   - Go to your project dashboard
   - Click "Deployments"
   - Click "Redeploy" on your latest deployment or connect a new commit

### Force Clean Deployment

If you're still having issues, try a clean deployment:

1. In your Vercel project settings, go to the "General" tab
2. Scroll down to "Build & Development Settings"
3. Ensure the Framework Preset is set to "Other"
4. Trigger a new deployment with the "Redeploy" button

### Check Project Output

If you're still experiencing issues, try running the build locally to see if it works:

```bash
npm run build
NODE_ENV=production node dist/index.js
```

This will help determine if the issue is with your code or with the Vercel deployment.

## Getting More Help

If none of these solutions work:

1. Check the [Vercel documentation](https://vercel.com/docs)
2. Search the [Vercel Community](https://github.com/vercel/vercel/discussions)
3. Contact [Vercel Support](https://vercel.com/help)