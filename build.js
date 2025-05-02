// This script is used for the build process on various hosting platforms
const { execSync } = require('child_process');

try {
  // Run build command with cross-platform environment variable setting
  console.log('Building client and server...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('Build completed successfully');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}