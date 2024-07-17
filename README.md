# Getting Started with Create React App


first create database in mysql "doctor_calendar"

and create table : appointments

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `patientName` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `description` text DEFAULT NULL,
  `endTime` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


ALTER TABLE `appointments` ADD PRIMARY KEY (`id`);

git clone https://github.com/pankajwinaim/doctor.git

cd doctor

cd backend

run:  npm install

and npm start

and cd frontend
and npm install
npm start
