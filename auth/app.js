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

// health check (public endpoint)
app.get('/', (req, res) => {
  res.send("<html>
            <head>
              <meta name=\"google-site-verification\" content=\"73U9uBeE_GJ1jsrT8nltR24d7rioFL2uwJFmWSN2F5Y\" />
              <title>EsAPI: SEII - Project</title>
            </head>
            <body>
            page contents
            </body>
            </html>");
});

// private endpoint
app.get(`${API_BASE_URL}/me`, protect(), (req, res) => {
  res.json({ ...req.user });
});

module.exports = app;
