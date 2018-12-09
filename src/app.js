const express = require('express');
const bodyParser = require('body-parser');
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
//const examsModule = require('./exams');
app.get('/users', protect(), userModule.getUsers);
app.get('/users/:id', protect(), userModule.getUserById);
app.put('/users/:id', protect(), userModule.updateUser);
app.delete('/users/:id', protect(), userModule.deleteUser);


//EXAM MODULE
//const examsModule = require('./exams');
//app.post('/exams/', protect(), examsModule.createExam);

//TASK MODULE
const taskModule = require('./task');

//USERGROUP MODULE
const userGroupModule = require('./userGroups');

app.post('/userGroups', protect(), userGroupModule.createUserGroup);
app.get('/userGroups', protect(), userGroupModule.getAllUserGroups);

app.get('/userGroups/:id', protect(), userGroupModule.getUserGroup);
app.put('/userGroups/:id', protect(), userGroupModule.updateUserGroup);
app.delete('/userGroups/:id', protect(), userGroupModule.deleteUserGroup);

app.get('/tasks', protect(), taskModule.getTasks);
app.post('/tasks', protect(), taskModule.createTask);

app.get('/tasks/:id', protect(), taskModule.getTaskById);
app.put('/tasks/:id', protect(), taskModule.updateTaskById);
app.delete('/tasks/:id', protect(), taskModule.deleteTaskById);

//SUBMISSION MODULE
const submissionModule = require('./submission');
app.get('/submissions', protect(), submissionModule.getAllSubmissions);
app.get('/submissions/:id', protect(), submissionModule.getSubmissionById);
app.put('/submissions/:id', protect(), submissionModule.updateSubmission);

module.exports = app;

app.on('exit', function (){
    utilities.closeConnection();
    console.log('Goodbye!');
});
