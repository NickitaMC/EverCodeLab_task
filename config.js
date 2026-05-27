require('dotenv').config();

const config = {
    appName: 'MyAppTask',
    environment: 'Development',
    port: Number(process.env.PORT) || 3000,
    authToken: process.env.AUTH_TOKEN
};

module.exports = config;