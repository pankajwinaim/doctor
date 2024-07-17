const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientName: String,
    date: Date,
    time: String,
    description: String,
});

module.exports = mongoose.model('Appointment', appointmentSchema);