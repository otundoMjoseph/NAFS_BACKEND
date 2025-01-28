const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/User');


class AuthController {
    constructor(pool) {
        this.userModel = new User(pool);
    }

    async register(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const result = await this.userModel.create(name, email, hashedPassword, role);
            if (result.affectedRows > 0) {
                res.status(201).json({ success: true, message: 'User registered successfully' });
            } else {
                res.status(500).send({ success: false, message: 'Error registering user' });
            }
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                res.status(400).json({ success: false, error: 'Email already registered' });
            } else {
                console.error("Error during registration:", error);
                res.status(500).send({ success: false, error: 'Error registering user' });
            }
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
           const user = await this.userModel.findByEmail(email);
           if (!user) {
                return res.status(401).json({ success: false, error: 'Invalid email or password' });
            }

            const match = await bcrypt.compare(password, user.password);

            if (match) {
                req.session.user = { id: user.id, role: user.role, name: user.name };
                res.status(200).json({ success: true, message: `Login successful, welcome ${user.role}` });
            } else {
                res.status(401).json({ success: false, error: 'Invalid email or password' });
            }
        } catch (error) {
            console.error("Error during login:", error);
            res.status(500).json({ success: false, error: 'Error during login' });
        }
    }
    async logout(req, res) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ success: false, error: 'Logout Failed' });
        }
        res.status(200).json({ success: true, message: 'Logged out' });
      });
    }
}

module.exports = AuthController;