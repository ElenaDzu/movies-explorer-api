const router = require('express').Router();

const { validatePatchUserId, validateGetUserId } = require('../middlewares/validators');

const {
  getUser,
  patchUserId,
} = require('../controllers/users');

router.get('/me',
validateGetUserId,
getUser,
);

router.patch(
  '/me',
  validatePatchUserId,
  patchUserId,
);


module.exports = router;
