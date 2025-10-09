export const environment = {
  production: true,
  // API URL will be set via Docker environment variable
  // Default to backend service name in Docker network
  apiUrl: process.env['API_URL'] || 'http://ecommerce-backend:5000',
};
