const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const routes = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

require('dotenv').config();

const app = express();

if (process.env.NODE_ENV !== 'production') {
  if (typeof process.env.DB_HOST === 'undefined') {
    process.env.DB_HOST = 'mongodb://localhost:27017/bitfilmsdb';
  }
  if (typeof process.env.JWT_SECRET === 'undefined') {
    process.env.JWT_SECRET = 'movies_123';
  }
}

mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
});
const corsOptions = {
  origin: '',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? ('Ошибка сервера') : err.message;
  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT);