# Deploying Skillbag Book Club on Render.com

This guide walks you through deploying your Skillbag Book Club application on Render.com, a modern cloud platform that makes it easy to deploy and scale applications.

## Prerequisites

1. A [Render.com account](https://render.com/signup) (you can sign up with GitHub, GitLab, or email)
2. Your PostgreSQL database (you can use Render's managed PostgreSQL or an external service like Neon)
3. Git repository with your code

## Important Files for Render Deployment

We've created a configuration file to streamline your deployment:

- **render.yaml** - Blueprint file that defines all your Render resources

## Deployment Steps

### 1. Push Your Code to a Git Repository

First, ensure all your code, including the Render configuration file, is pushed to GitHub, GitLab, or Bitbucket:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push
```

### 2. Connect Render to Your Repository

1. Log in to your Render account
2. Click "Blueprint" from the dashboard
3. Connect to your Git provider
4. Select your Skillbag Book Club repository
5. Click "Apply Blueprint"

Render will automatically detect your `render.yaml` file and set up your services.

### 3. Configure Environment Variables

While most variables are defined in the `render.yaml` file, you'll need to set your `DATABASE_URL`:

1. Go to your web service in the Render dashboard
2. Click "Environment"
3. Add the `DATABASE_URL` variable with your PostgreSQL connection string

### 4. Deploy

Render will automatically deploy your application based on the settings in your `render.yaml` file.

## Setting Up a Database

If you need to set up a database on Render:

1. From the Render dashboard, click "New" and select "PostgreSQL"
2. Configure your database settings:
   - Name: `skillbag-db`
   - Database: `skillbag`
   - User: `skillbag_user`
   - Region: Choose the closest to your users
3. Click "Create Database"
4. Once created, copy the "Internal Database URL" and use it for your web service's `DATABASE_URL` environment variable

## Initializing Your Database

After deployment, you may need to initialize your database:

1. Go to your web service in the Render dashboard
2. Click "Shell"
3. Run these commands to set up your database schema and seed data:

```bash
npm run db:push
npm run db:seed
```

## Custom Domains

To set up a custom domain for your application:

1. Go to your web service in the Render dashboard
2. Click "Settings"
3. Scroll to "Custom Domains"
4. Click "Add Custom Domain"
5. Follow the instructions to configure your DNS settings

## Scaling

Render makes it easy to scale your application:

1. Go to your web service in the Render dashboard
2. Click "Settings"
3. Scroll to "Instance Type"
4. Select the appropriate instance type for your needs
5. Click "Save Changes"

Our `render.yaml` configuration already includes auto-scaling settings.

## Monitoring and Logs

Render provides built-in monitoring and logging:

1. Go to your web service in the Render dashboard
2. Click "Logs" to view application logs
3. Click "Metrics" to view performance metrics

## Troubleshooting

If you encounter issues:

1. **Build Failures**: Check your build logs in the Render dashboard
2. **Database Connection Issues**: Verify your `DATABASE_URL` environment variable
3. **Application Errors**: Check the application logs in the Render dashboard

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
- [Contact Render Support](https://render.com/contact)