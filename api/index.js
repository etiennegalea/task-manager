const mongoose = require('mongoose');
const express = require('express');
const app = express();
const tasksRouter = require('./routes/tasks');
const config = require('../config');
const errorHandler = require('./middleware/errorHandler');


app.use(express.json());
app.use(errorHandler);

// set mongodb connection
mongoose.connect(config.mongoURI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB', err));

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Task Manager API!');
});

// Use the tasks router
app.use('/api/tasks', tasksRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
