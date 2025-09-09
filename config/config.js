// Application configuration
const config = {
  development: {
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/crud_database',
    jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key',
    jwtExpire: '7d',
    environment: 'development'
  },
  production: {
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: '1d',
    environment: 'production'
  },
  test: {
    port: process.env.PORT || 5001,
    mongoURI: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/crud_database_test',
    jwtSecret: process.env.JWT_SECRET || 'test_secret_key',
    jwtExpire: '1h',
    environment: 'test'
  }
};

const currentConfig = config[process.env.NODE_ENV || 'development'];

module.exports = currentConfig;
