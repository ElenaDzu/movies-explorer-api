const router = require('express').Router();

const { validatePatchUserId } = require('../middlewares/validators');

const {
  getUser,
  patchUserId,
} = require('../controllers/users');

router.get('/me', getUser);

router.patch(
  '/me',
  validatePatchUserId,
  patchUserId,
);


module.exports = router;
