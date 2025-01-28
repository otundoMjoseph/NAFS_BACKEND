const express = require('express');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const AppointmentController = require('../controllers/appointmentController');
const router = express.Router();

module.exports = (pool) => {
    const appointmentController = new AppointmentController(pool);
    router.post('/book', ensureAuthenticated, appointmentController.bookAppointment.bind(appointmentController));
    router.get('/history', ensureAuthenticated, appointmentController.getAppointmentHistory.bind(appointmentController));
    return router;
}