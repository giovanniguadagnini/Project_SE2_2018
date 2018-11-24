const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const passport = require('passport');

const { auth, protect } = require('./google-auth');

const API_BASE_URL = '/api/v1';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

auth(app);

app.use(express.static('auth/static'));

// health check (public endpoint)
app.get('/', (req, res) => {
  res.send("Hello World");
});

// private endpoint
app.get(`${API_BASE_URL}/me`, protect(), (req, res) => {
  res.json({ ...req.user });
});

module.exports = app;
