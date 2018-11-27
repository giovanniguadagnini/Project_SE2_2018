// Database connection
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

// Get all the tasks with all the information without filtering
function getAllTasks() {
    return new Promise(resolve => {
        let retval = []; // Array that will return all the tasks
        // Query to receive all the tasks saved in the database
        connection.query('SELECT * FROM task', function (error, results, fields) {
            if (error) { // In case of error it blocks and returns a null
                throw error;
                resolve(null);
            }
            if (results.length > 0) { // If there is at least a task in the database
                for (var i = 0; i < results.length; i++) { // Iterate for all the tasks
                    let pos = []; // Array that will contain the possibilities for a question
                    // Query to receive all the possibilities for a given question
                    connection.query('SELECT * FROM task_possibility WHERE id_task = ?', [results[i].id], function (pos_error, pos_results, pos_fields) {
                        if (pos_error) { // In case of error it blocks and returns a null
                            throw pos_error;
                            resolve(null);
                        }
                        if (pos_results.length > 0) { // If there is at least a possibility for that question in the database
                            // Save all the possibilities in the array pos
                            for (var i = 0; i < pos_results.length; i++)
                                pos.push({ 'value': '' + pos_results[i].q_possibility });
                        }
                    });
                    // Save the object task in the array retval that will be returned
                    retval.push({
                        'id': '' + results[i].id,
                        'owner': '' + results[i].owner,
                        'task_type': '' + results[i].task_type,
                        'question': {
                            'text': '' + results[i].q_text,
                            'possibilities': '' + pos,
                            'base_upload_url': '' + results[i].q_url
                        },
                        'points': '' + results[i].points
                    })
                }
                resolve(retval); // Return all the tasks
            }
        });
        resolve(null); // Return null in case there has been an error
    });
}

// Create a task given as parameter
function createTask(task) {
    return new Promise(resolve => {
        // If the task is complete and respect the documentation's schema
        if (task != null &&
            task.id != null && task.owner != null && task.task_type != null && task.question != null &&
            task.question.text != null && task.question.base_upload_url != null && task.question.possibilities != null &&
            task.points != null) {
            // Insert the task in the database
            connection.query('INSERT INTO task (id, owner, task_type, q_text, q_url, points) VALUES (?,?,?,?,?,?)',
                [task.id, task.owner, task.task_type, task.question.text, task.question.base_upload_url, task.points],
                function (error, results, fields) {
                    if (error) { // In case of error it blocks and returns a null
                        throw error;
                        resolve(null);
                    }
                }
            );
            // Insert every possibility for the question of the task in the database
            for (var i = 0; i < task.question.possibilities.length; i++) {
                connection.query('INSERT INTO task_possibility (id_task, id_poss, q_possibility) VALUES (?,?,?)',
                    [task.id, i, task.question.possibilities[i]],
                    function (error, results, fields) {
                        if (error) { // In case of error it blocks and returns a null
                            throw error;
                            resolve(null);
                        }
                    }
                );
            }
            resolve(task); // Return the added task
        }
        else resolve(null); // Return null in case there has been an error
    });
}

// Get the task with the given id
function getTask(id) {
    return new Promise(resolve => {
        connection.query('SELECT * FROM task WHERE id = ?', [id], function (error, results, fields) {
            if (error) { // In case of error it blocks and returns a null
                throw error;
                return null;
            }
            if (results.length > 0) { //If there is the task
                let pos = []; // Array that will contain the possibilities for the question
                // Query to receive all the possibilities for the given question
                connection.query('SELECT * FROM task_possibility WHERE id_task = ?', [results[i].id], function (pos_error, pos_results, pos_fields) {
                    if (pos_error) { // In case of error it blocks and returns a null
                        throw pos_error;
                        resolve(null);
                    }
                    if (pos_results.length > 0) { // If there is at least a possibility for that question in the database
                        // Save all the possibilities in the array pos
                        for (var i = 0; i < pos_results.length; i++)
                            pos.push({ 'value': '' + pos_results[i].q_possibility });
                    }
                });
                // Return the object task requested
                resolve({
                    'id': '' + results[i].id,
                    'owner': '' + results[i].owner,
                    'task_type': '' + results[i].task_type,
                    'question': {
                        'text': '' + results[i].q_text,
                        'possibilities': '' + pos,
                        'base_upload_url': '' + results[i].q_url
                    },
                    'points': '' + results[i].points
                })
            } else resolve(null); // Return null in case there isn't that task
        });
    });
}

// Update the task given as parameter
function updateTask(user) {
    return new Promise(resolve => {
        if (task != null && task.id != null) {
            let retval;

            connection.query('UPDATE task SET owner = ?, task_type = ?, q_text = ?, q_url = ?, points = ? WHERE id = ?', [task.owner, task.task_type, task.question.text, task.question.base_upload_url, task.points], function (error, results, fields) {
                if (error) { // In case of error it blocks and returns a null
                    throw error;
                    resolve(null);
                }
                if (results.affectedRows > 0) { // If the query has effect, then there is the task and the possibilities need to be updated as well
                    //Remove all the previous possibilities
                    connection.query('DELETE * FROM task_possibility WHERE id_task = ?', [task.id], function (pos_error, pos_results, pos_fields) {
                        if (pos_error) { // In case of error it blocks and returns a null
                            throw pos_error;
                            resolve(null);
                        }
                    });
                    // Insert every possibility for the question of the task in the database
                    for (var i = 0; i < task.question.possibilities.length; i++) {
                        connection.query('UPDATE task_possibility SET q_possibility = ? WHERE id_task = ? AND id_poss', [task.question.possibilities[i], task.id, i], function (pos_error, pos_results, pos_fields) {
                            if (error) { // In case of error it blocks and returns a null
                                throw error;
                                resolve(null);
                            }
                            if (results.affectedRows <= 0) { // If the query has no effect, then return null
                                retval = null;
                                resolve(retval);
                            }
                        });
                    }
                    retval = task;
                } else { // If the query has no effect, then return null
                    retval = null;
                }
                resolve(retval); // Return the updated task after its update
            });
        }
        else resolve(null);
    });
}

// Delete the task given as parameter
function deleteTask(task) {
    return new Promise(resolve => {
        if (task != null && task.id != null) {
            let retval;

            connection.query('DELETE FROM task WHERE id = ?', [task.id], function (error, results, fields) {
                if (error) { // In case of error it blocks and returns a null
                    throw error;
                    return null;
                }
                if (results.affectedRows > 0) { // If the query has effect, then there is the task has been eliminated
                    retval = user; // Return the deleted task after its deletion
                } else { // If the query has no effect, then return null
                    retval = null;
                }
                resolve(retval);
            });
        }
        else resolve(null);
    });
}

module.exports = { getAllTasks, createTask, getTask, updateTask, deleteTask };