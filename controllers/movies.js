const Movie = require('../models/movie');
const BadRequest400 = require('../errors/BadRequest400');
const InternalServerError500 = require('../errors/InternalServerError500');
const NotFound404 = require('../errors/NotFound404');
const Forbidden403 = require('../errors/Forbidden403');

module.exports.getMovies = (req, res, next) => {
  Movie.find({
    owner: req.user._id,
  })
    .then((movies) => res.send(movies))
    .catch(() => {
      next(new InternalServerError500('На сервере произошла ошибка'));
    });
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    owner: req.user._id,
    movieId,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest400('Неправильный запрос'));
        return;
      }
      next(new InternalServerError500('На сервере произошла ошибка'));
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        next(new NotFound404('Объект не найден'));
        return;
      }
      if (movie && movie.owner.toString() === req.user._id) {
        Movie.findByIdAndDelete(movie._id.toString())
          .then((doc) => {
            res.send(doc);
          })
          .catch((err) => {
            res.send(err);
          });
        return;
      }
      next(new Forbidden403('Попытка удалить чужой фильм'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest400('Неправильный запрос'));
        return;
      }
      next(new InternalServerError500('На сервере произошла ошибка'));
    });
};
