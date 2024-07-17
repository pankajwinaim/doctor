import React, { useState, useEffect } from 'react';

const AppointmentForm = ({ selectedAppointment, onSubmit, onClose, selectedDate }) => {
    const [patientName, setPatientName] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (selectedAppointment) {
            setPatientName(selectedAppointment.patientName);
            const appointmentDate = new Date(selectedAppointment.date);
            setDate(appointmentDate.getDate() + 1);
            // setDate(selectedAppointment.date);
            setTime(selectedAppointment.time);
            setDescription(selectedAppointment.description);
        } else {
            const appointmentDate = new Date(selectedDate);
            appointmentDate.setDate(appointmentDate.getDate() + 1);
            setDate(appointmentDate.toISOString().split('T')[0]);
        }
    }, [selectedAppointment, selectedDate]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const appointment = {
            patientName,
            date,
            time,
            description
        };

        onSubmit(appointment);

        if (!selectedAppointment) {
            setPatientName('');
            setDate('');
            setTime('');
            setDescription('');
        }
    };

    return (
        <div className="appointment-form">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Patient Name:</label>
                    <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Date:</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Time:</label>
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} step="1800" required />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <button type="submit">{selectedAppointment ? 'Update' : 'Create'} Appointment</button>
                {selectedAppointment && <button type="button" onClick={onClose}>Cancel</button>}
            </form>
            <p>Note: Appointments are booked in 30-minute slots.</p>
        </div>
    );
};

export default AppointmentForm;