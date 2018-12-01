const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const passport = require('passport');

const {auth, protect} = require('./google-auth');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

auth(app);

// health check (public endpoint)
app.get('/', (req, res) => {
    res.json({msg: 'Hello world!'});
});

// private endpoints

//USER MODULE
const userModule = require('./user');

//EXAM MODULE
const examsModule = require('./exams');

app.get('/users', protect(), userModule.getUsers);

app.get('/users/:id', protect(), userModule.getUserById);
app.put('/users/:id', protect(), userModule.updateUser);
app.delete('/users/:id', protect(), userModule.deleteUser);


app.post('/exams/', protect(), examsModule.createExam);

module.exports = app;
