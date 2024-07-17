const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const appointmentRoutes = require('./routes/appointments');
app.use('/api/appointments', appointmentRoutes);

const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
