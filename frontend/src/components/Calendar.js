import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import AppointmentForm from './AppointmentForm';
import './CalendarComponent.css';

const CalendarComponent = () => {
    const [appointments, setAppointments] = useState([]);
    const [date, setDate] = useState(new Date());
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/api/appointments')
            .then(response => {
                setAppointments(response.data);
            });
    }, []);

    const onChange = date => {
        setDate(date);
        setSelectedAppointment(null);  // Open form with selected date
    };

    const handleEdit = (appointment) => {
        setSelectedAppointment({
            ...appointment,
            date: new Date(new Date(appointment.date).getTime() + 24 * 60 * 60 * 1000)
        });
    };

    const handleDelete = (appointmentId) => {
        axios.delete(`http://localhost:5000/api/appointments/${appointmentId}`)
            .then(() => {
                setAppointments(appointments.filter(app => app.id !== appointmentId));
                setMessage('Appointment deleted successfully');
            })
            .catch(error => {
                setMessage(error.response.data.error);
            });
    };

    const handleFormSubmit = (appointment) => {
        if (selectedAppointment) {
            axios.put(`http://localhost:5000/api/appointments/${selectedAppointment.id}`, appointment)
                .then(response => {
                    setAppointments(appointments.map(app => app.id === response.data.id ? response.data : app));
                    setMessage('Appointment updated successfully');
                    setSelectedAppointment(null);
                })
                .catch(error => {
                    setMessage(error.response.data.error);
                });
        } else {
            axios.post('http://localhost:5000/api/appointments', appointment)
                .then(response => {
                    setAppointments([...appointments, response.data]);
                    setMessage('Appointment created successfully');
                })
                .catch(error => {
                    setMessage(error.response.data.error);
                });
        }
    };

    const getAppointmentStatus = (date) => {
        const currentDate = new Date();
        const appointmentDate = new Date(date);
        if (appointmentDate < currentDate) {
            return 'expired';
        } else if (appointmentDate.toDateString() === currentDate.toDateString()) {
            return 'running';
        } else {
            return 'upcoming';
        }
    };

    return (
        <><div className="calendar-component">
            {message && <div className="alert">{message}</div>}
            <div className="calendar-container">
                <Calendar 
                    onChange={onChange} 
                    value={date} 
                    tileContent={({ date, view }) => view === 'month' && (
                        appointments.filter(app => new Date(app.date).toDateString() === date.toDateString()).length ? (
                            <p>{appointments.filter(app => new Date(app.date).toDateString() === date.toDateString()).length} Appointments</p>
                        ) : null
                    )}
                />
            </div>
            <div>
                <AppointmentForm 
                    selectedAppointment={selectedAppointment}
                    onSubmit={handleFormSubmit}
                    onClose={() => setSelectedAppointment(null)}
                    selectedDate={date}  // Pass selected date to form
                />
            </div>
        </div>
        <div className="appointment-list">
            <h2>Appointments for {date.toDateString()}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Patient Name</th>
                        <th>Time</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.filter(app => new Date(app.date).toDateString() === date.toDateString())
                        .map(app => (
                            <tr key={app.id} className={getAppointmentStatus(app.date)}>
                                <td>{app.patientName}</td>
                                <td>{app.time} - {app.endTime}</td>
                                <td>{app.description}</td>
                                <td>
                                    <button onClick={() => handleEdit(app)}>Edit</button>
                                    <button onClick={() => handleDelete(app.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
        </>
    );
};

export default CalendarComponent;