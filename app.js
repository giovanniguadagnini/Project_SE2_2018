const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const passport = require('passport');

const {auth, protect} = require('./google-auth');

const API_BASE_URL = '/api/v1';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

auth(app);

// health check (public endpoint)
app.get('/', (req, res) => {
    res.json({msg: 'Hello world!'});
});

// private endpoint
app.get(`${API_BASE_URL}/me`, protect(), (req, res) => {
    res.json({...req.user});
});

//USER MODULE
const userModule = require('./user');

app.get('/users', protect(), userModule.getUsers);

app.get('/users/:id', protect(), userModule.getUserById);
app.put('/users/:id', protect(), userModule.updateUser);
app.delete('/users/:id', protect(), userModule.deleteUser);

module.exports = app;
