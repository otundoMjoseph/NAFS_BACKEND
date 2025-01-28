class Appointment {
    constructor(pool) {
        this.pool = pool;
    }

    async book(patientId, doctorId, date, time) {
        const [result] = await this.pool.query(
            'INSERT INTO appointments (patient_id, doctor_id, date, time) VALUES (?, ?, ?, ?)',
            [patientId, doctorId, date, time]
        );
        return result;
    }

    async getHistory(patientId) {
        const [rows] = await this.pool.query(
            'SELECT * FROM appointments WHERE patient_id = ?',
            [patientId]
        );
        return rows;
    }
}

module.exports = Appointment;