const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Conflict409 = require('../errors/Conflict409');
const BadRequest400 = require('../errors/BadRequest400');
const InternalServerError500 = require('../errors/InternalServerError500');
const NotFound404 = require('../errors/NotFound404');

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
      })
        .then((user) => {
          res.status(200).send({
            email: user.email,
            name: user.name,
          });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new Conflict409('Введен существующий емайл'));
            return;
          }
          if (err.name === 'ValidationError') {
            next(new BadRequest400('Неправильный запрос'));
            return;
          }
          next(new InternalServerError500('На сервере произошла ошибка'));
        });
    })
    .catch(next);
};

module.exports.patchUserId = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send(user);
        return;
      }
      next(new NotFound404('Объект не найден'));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest400('Неправильный запрос'));
        return;
      }
      if (err.code === 11000) {
        next(new Conflict409('Введен существующий емайл'));
        return;
      }
      next(new InternalServerError500('На сервере произошла ошибка'));
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(next);
};
