// backend/test-env.js
require('dotenv').config();

console.log('Testing environment variables:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***hidden***' : 'undefined');
console.log('PORT:', process.env.PORT);