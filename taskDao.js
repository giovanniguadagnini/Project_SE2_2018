var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7267085',
    password: 'IlVZ5TF9HT',
    database: 'sql7267085'
});

/*
function connectDB() {
    connection.connect();
}
function disconnectDB() {
    connection.end();
}
function reconnectDB() {
    disconnectDB();
    connectDB();
}
function checkDBConnection() {
    if (connection.state === 'disconnected') {
        connectDB();
    }
}
*/

function getAllTasks() {
    return [{}];
}

function createTask(task) {

}

function getTask(id) {
    return {};
}

function updateTask(task) {

}

function deleteTask(id) {

}

module.exports = { getAllTasks, createTask, getTask, updateTask, deleteTask };