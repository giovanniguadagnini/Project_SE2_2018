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
const userDao = require('./userDao');

app.get('/users', protect(), (req, res) => { //Get all available users
    let enrolledBefore = req.query.enrolledBefore;
    if (enrolledBefore == null) {
        enrolledBefore = new Date().getUTCFullYear();//default is current year
    }

    let enrolledAfter = req.query.enrolledAfter;
    if (enrolledAfter == null) {
        enrolledAfter = 1900; //default is year 1900
    }

    let users = userDao.getAllUsersSyn(req.user, enrolledBefore, enrolledAfter);
    if (users != null) {
        res.status(200).json(users);
    } else {
        res.status(404).send("No user found");
    }
});

app.get('/users/:id', protect(), (req, res) => { //Get user with id
    let id = req.params.id;
    if(id == user.id) {
        let user = userDao.getUserSyn(req.user, id); //trying to get the user from the system
        if (user != null) {
            res.status(200).json(user);
        } else {
            res.status(404).send("User not found");
        }
    }else {
        res.status(400).send("Bad request");
    }
});

app.put('/users/:id', protect(), (req, res) => { //Update user
    let id = req.params.id;
    let user = {
        id: req.body.id,
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        born: req.body.born,
        enrolled: req.body.enrolled
    };

    //[TO DO] Evaluate with other members if it has more sense [put] /users
    // in put I check that the user is update its own account
    // (update /users/:id can only be called on profile we're logged with)
    if(id == user.id && req.user.id == id) {
        user = userDao.updateUserSyn(user);//trying to update the user
        if (user != null) {
            res.status(200).json(user);
        } else {
            res.status(404).send("User not found");
        }
    }else if (id == user.id){
        res.status(400).send("Bad request");
    }else{
        res.status(403).send("Forbidden");
    }
});

app.delete('/users/:id', protect(), (req, res) => { //Delete user
    let id = req.params.id;
    let user = {
        id: req.body.id,
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        born: req.body.born,
        enrolled: req.body.enrolled
    };

    //[TO DO] Evaluate with other members if it has more sense [delete] /users
    // in delete I check that the user is deleting its own account
    // (delete /users/:id can only be called on profile we're logged with)
    if(id == user.id && req.user.id == id) {
        user = userDao.deleteUserSyn(user);//trying to update the user
        if (user != null) {
            res.status(200).json(user);
        } else {
            res.status(404).send("User not found");
        }
    }else if (id == user.id){
        res.status(400).send("Bad request");
    }else{
        res.status(403).send("Forbidden");
    }
});

module.exports = app;
