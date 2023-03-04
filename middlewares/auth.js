const jwt = require('jsonwebtoken');

const Unauthorized401 = require('../errors/Unauthorized401');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized401('Неверный логин, пароль, токен(стр 8)');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Unauthorized401('Неверный логин, пароль, токен(стр17)');
  }

  req.user = payload;

  next();
};
