const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');
const routes = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleErrors = require('./middlewares/handleErrors');
const {
  PORT,
  DB_HOST,
  LIMITER_OPTIONS,
  CORS_OPTIONS,
} = require('./const');

require('dotenv').config();

const app = express();

mongoose.connect(DB_HOST, {
  useNewUrlParser: true,
});

const limiter = rateLimiter(LIMITER_OPTIONS);
app.use(helmet());
app.use(limiter);
app.use(cors(CORS_OPTIONS));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(handleErrors);

app.listen(PORT);
