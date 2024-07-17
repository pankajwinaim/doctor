const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all appointments
router.get('/', async (req, res) => {
    try {
        const [rows, fields] = await db.query('SELECT * FROM appointments');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new appointment
router.post('/', async (req, res) => {
    const { patientName, date, time, description } = req.body;
    const endTime = new Date(`1970-01-01T${time}`).setMinutes(new Date(`1970-01-01T${time}`).getMinutes() + 30);

    try {
        // Check for duplicate time slot
        const [existingAppointments] = await db.query(
            'SELECT * FROM appointments WHERE date = ? AND time = ?',
            [date, time]
        );

        if (existingAppointments.length > 0) {
            return res.status(400).json({ error: 'Time slot already booked' });
        }

        const [result] = await db.query(
            'INSERT INTO appointments (patientName, date, time, endTime, description) VALUES (?, ?, ?, ?, ?)',
            [patientName, date, time, endTime, description]
        );

        res.json({ id: result.insertId, patientName, date, time, endTime, description });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an appointment
router.put('/:id', async (req, res) => {
    const { patientName, date, time, description } = req.body;
    const endTime = new Date(`1970-01-01T${time}`).setMinutes(new Date(`1970-01-01T${time}`).getMinutes() + 30);

    try {
        // Check for duplicate time slot
        const [existingAppointments] = await db.query(
            'SELECT * FROM appointments WHERE date = ? AND time = ? AND id != ?',
            [date, time, req.params.id]
        );

        if (existingAppointments.length > 0) {
            return res.status(400).json({ error: 'Time slot already booked' });
        }

        await db.query(
            'UPDATE appointments SET patientName = ?, date = ?, time = ?, endTime = ?, description = ? WHERE id = ?',
            [patientName, date, time, endTime, description, req.params.id]
        );

        res.json({ id: req.params.id, patientName, date, time, endTime, description });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete an appointment
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM appointments WHERE id = ?', [req.params.id]);
        res.json({ message: 'Appointment deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;