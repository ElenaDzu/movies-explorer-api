const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../const');

const Unauthorized401 = require('../errors/Unauthorized401');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized401('Неверный логин, пароль, токен(стр 9)');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Unauthorized401('Неверный логин, пароль, токен(стр18)');
  }

  req.user = payload;

  next();
};
