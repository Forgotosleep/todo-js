require('dotenv').config();
require('express-async-errors');
const express = require('express');
const morgan = require('morgan');
const { db, migration } = require('./db');
const { seed } = require('./seeder');
const app = express();

const port = process.env.PORT || 3030;
const host = process.env.HOST || 'localhost';

// Table Creation & Seeding
// migration();  // Optional
// Seed tables
// seed();  // Optional

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// TODO: Uncomment baris kode dibawah ini
app.get('/hello', (req, res) => {
    res.json({ message: 'Hello world' });
});

// ACTIVITY GROUPS
const ActivityGroupController = require('./controllers/activityGroupsController')
app.get('/activity-groups', ActivityGroupController.getAll)
app.get('/activity-groups/:id', ActivityGroupController.getOne)

app.post('/activity-groups', ActivityGroupController.create)

app.patch('/activity-groups/:id', ActivityGroupController.update)

app.delete('/activity-groups/:id', ActivityGroupController.delete)

// TODO
const TodoController = require('./controllers/todosController')
app.get('/todo-items', TodoController.getAll)

app.get('/todo-items/:id', TodoController.getOne)

app.post('/todo-items', TodoController.create)

app.patch('/todo-items/:id', TodoController.update)

app.delete('/todo-items/:id', TodoController.delete)


// 404 endpoint middleware
app.all('*', (req, res) => {
    res.status(404).json({ message: `${req.originalUrl} not found!` });
});

// error handler
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message || 'An error occurred.',
    });
});

app.listen(port);
console.log(`Server run on http://${host}:${port}/`);
