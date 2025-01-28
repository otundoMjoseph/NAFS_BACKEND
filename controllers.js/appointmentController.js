const Appointment = require('../models/Appointment');

class AppointmentController {
    constructor(pool) {
        this.appointmentModel = new Appointment(pool);
    }
    async bookAppointment(req, res) {
        const { doctor_id, date, time } = req.body;
        const patient_id = req.session.user.id;
        try {
            const result = await this.appointmentModel.book(patient_id, doctor_id, date, time);
             if (result.affectedRows > 0) {
                 res.status(201).json({ success: true, message: 'Appointment booked successfully' });
             } else {
                 res.status(500).json({ success: false, error: 'Error booking appointment' });
             }
        } catch (error) {
             console.error("Error booking appointment:", error);
             res.status(500).json({ success: false, error: 'Error booking appointment' });
        }
    }
    async getAppointmentHistory(req, res) {
        const userId = req.session.user.id;
        try{
            const appointments = await this.appointmentModel.getHistory(userId);
            res.status(200).json({ success: true, data: appointments });
        } catch(error){
             console.error("Error fetching appointment history:", error);
             res.status(500).json({ success: false, error: 'Error fetching appointment history' });
        }
    }
}

module.exports = AppointmentController;