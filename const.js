const { PORT = 3000, DB_HOST = 'mongodb://localhost:27017/bitfilmsdb', JWT_SECRET = 'movies_123' } = process.env;

const LIMITER_OPTIONS = {
  windowMs: 15 * 60 * 1000,
  max: 100,
};

const CORS_OPTIONS = {
  // origin: /elenadziuba\.nomoredomains\.work$/,
  origin: '*',
  optionsSuccessStatus: 200,
};

module.exports = {
  PORT,
  DB_HOST,
  JWT_SECRET,
  LIMITER_OPTIONS,
  CORS_OPTIONS,
};
