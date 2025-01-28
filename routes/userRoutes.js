const express = require('express');
const { body } = require('express-validator');
const { ensureAuthenticated, ensureAdmin, ensureDoctor } = require('../middlewares/authMiddleware');
const UserController = require('../controllers/userController');
const upload = require('../config/multer'); // Multer config from before
const router = express.Router();

module.exports = (pool) => {
    const userController = new UserController(pool);
  router.get('/user/:id', ensureAuthenticated, userController.getUser.bind(userController));
  router.put('/profile/update', ensureAuthenticated, upload.single('profile_photo'),
      [
          body('name').notEmpty().trim(),
          body('role').notEmpty().trim()
      ]
      , userController.updateProfile.bind(userController));
    router.delete('/profile/delete', ensureAuthenticated, userController.deleteProfile.bind(userController));
    return router;
};