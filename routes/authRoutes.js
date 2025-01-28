const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/authController');
const router = express.Router();

module.exports = (pool) => {
    const authController = new AuthController(pool);

    router.post(
      '/register',
      [
          body('name').notEmpty().trim(),
          body('email').isEmail().normalizeEmail(),
          body('password').isLength({ min: 6 }),
          body('role').notEmpty().trim(),
      ],
      authController.register.bind(authController)
  );
    router.post('/login', authController.login.bind(authController));
    router.post('/logout', authController.logout.bind(authController));

    return router;
};