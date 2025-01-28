const { validationResult } = require('express-validator');
const User = require('../models/User');

class UserController {
    constructor(pool) {
        this.userModel = new User(pool);
    }
  async getUser(req, res) {
    const userId = req.params.id;
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      console.error("Error fetching user details:", error);
      res.status(500).json({
        success: false,
        error: 'Error fetching user details',
      });
    }
  }
  async updateProfile(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const { name, role } = req.body;
        const userId = req.session.user.id;
        const profilePhotoPath = req.file ? `/uploads/${req.file.filename}` : null;
        try {
            const result = await this.userModel.update(name, role, profilePhotoPath, userId);

            if (result.affectedRows > 0) {
                res.status(200).json({ success: true, message: 'Profile updated successfully' });
            } else {
                res.status(404).json({ success: false, message: 'User not found or no changes made' });
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            res.status(500).json({ success: false, error: 'Error updating profile' });
        }
    }

    async deleteProfile(req, res) {
        const userId = req.session.user.id;
        try {
          const result = await this.userModel.delete(userId);
            if (result.affectedRows > 0) {
                req.session.destroy();
                res.status(200).json({ success: true, message: 'Profile deleted successfully' });
            } else {
                res.status(404).json({ success: false, message: 'User not found' });
            }
        } catch (error) {
            console.error("Error deleting profile:", error);
            res.status(500).json({ success: false, message: 'Error deleting profile' });
        }
    }
}

module.exports = UserController;