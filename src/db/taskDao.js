const utilities = require('../utilities');
const connection = utilities.connection; // DataBase connection

// Get all the tasks with all the information without filtering
function getTasks(loggedUser) {
    return new Promise(resolve => {
        let retval = []; // Array that will return all the tasks
        // Query to receive all the tasks saved in the database
        connection.query('SELECT * FROM ' +
            '(SELECT * FROM task) AS TEMP LEFT OUTER JOIN task_possibility TP ' +
            'ON TEMP.id = TP.id_task AND TEMP.id_exam IN ' +
            '(SELECT id_exam FROM teacher_exam WHERE id_teacher = ? ' +
            'UNION ' +
            'SELECT E.id FROM exam E, user_group UG, user_group_members UGP ' +
            'WHERE E.id_group = UG.id AND UG.id = UGP.id_group AND UGP.id_user = ?) ' +
            'order by TEMP.id, TP.q_possibility, TEMP.id_exam;', [loggedUser.id, loggedUser.id], function (error, results, fields) {
                if (error) { // In case of error it blocks and returns a null
                    throw error;
                    resolve(null);
                }
                if (results.length > 0) { // If there is at least a task in the database
                    for (let i = 0; i < results.length; i++) { // Iterate for all the tasks
                        let task = {
                            'id': '' + results[i].id,
                            'exam': '' + results[i].id_exam,
                            'owner': '' + results[i].id_owner,
                            'task_type': '' + results[i].task_type,
                            'question': {
                                'text': '' + results[i].q_text,
                                'possibilities': [],
                                'base_upload_url': '' + results[i].q_url
                            },
                            'points': '' + results[i].points
                        }
                        // Query to receive all the possibilities for a given question
                        //see if the submission is a multiple/single choice type, so push its possibility in question
                        if (results[i].task_type == 'single_c' || results[i].task_type == 'multiple_c') {
                            let x;
                            for (x = i; x < results.length && results[i].id == results[x].id; x++) {
                                if (results[x].q_possibility != null) {
                                    task.question.possibilities.push(results[x].q_possibility);
                                }
                            }
                            i = x - 1;
                        }
                        // Save the object task in the array retval that will be returned
                        retval.push(task);
                    }
                    resolve(retval); // Return all the tasks
                } else {
                    resolve(null);
                }
            });
    });
}
// Create a task given as parameter
function createTask(loggedUser, task) {
    return new Promise(resolve => {
        // If the task is complete and respect the documentation's schema
        if (task != null && task.owner == loggedUser.id &&
            task.id != null && task.exam != null && task.owner != null && task.task_type != null && task.question != null &&
            task.question.text != null && task.question.base_upload_url != null && task.question.possibilities != null &&
            task.points != null) {
            // Insert the task in the database
            connection.query('INSERT INTO task (id_exam, id_owner, task_type, q_text, q_url, points) VALUES (?,?,?,?,?,?)',
                [task.exam, task.owner.id, task.task_type, task.question.text, task.question.base_upload_url, task.points],
                function (error, results, fields) {
                    if (error) { // In case of error it blocks and returns a null
                        throw error;
                        resolve(null);
                    }
                }
            );
            // Insert every possibility for the question of the task in the database
            for (let i = 0; i < task.question.possibilities.length; i++) {
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
function getTaskById(loggedUser, id) {
    return new Promise(resolve => {
        getTasks(loggedUser).then(tasks => {
            // Insert every possibility for the question of the task in the database
            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].id == id)
                    resolve(tasks[i]);
            }
            resolve(null);
        });
    });
}
/*getTaskById({id:11}, 302).then(task=>{
    console.log(task);
});*/
// Update the task given as parameter
function updateTaskById(loggedUser, task) {
    return new Promise(resolve => {
        checkTaskPrivilege(loggedUser, task.id).then(check => {
            if (check && task != null && task.id != null) {
                connection.query('UPDATE task SET id_exam = ?, id_owner = ?, task_type = ?, q_text = ?, q_url = ?, points = ? WHERE id = ?', [task.exam, task.owner, task.task_type, task.question.text, task.question.base_upload_url, task.points, task.id], function (error, results, fields) {
                    if (error) { // In case of error it blocks and returns a null
                        throw error;
                        resolve(null);
                    }
                    if (results.affectedRows > 0) { // If the query has effect, then there is the task and the possibilities need to be updated as well
                        //Remove all the previous possibilities
                        connection.query('DELETE FROM task_possibility WHERE id_task = ?', [task.id], function (pos_error, pos_results, pos_fields) {
                            if (pos_error) { // In case of error it blocks and returns a null
                                throw pos_error;
                                resolve(null);
                            }
                            if (pos_results.affectedRows >= 0) { // If the query has effect, then there is the task and the possibilities need to be updated as well
                                // Insert every possibility for the question of the task in the database
                                let promises_possibility = [];
                                for (let i = 0; i < task.question.possibilities.length; i++) {//load all the comment_peer for every submission
                                    promises_possibility.push(addPossibility(task.question.possibilities[i], task.id, i));
                                }
                                Promise.all(promises_possibility).then(b => {
                                    // Return the updated task after its update
                                    getTaskById(loggedUser, task.id).then(updatedTask => {
                                        resolve(updatedTask);
                                    });
                                });
                            } else { // If the query has no effect, then return null
                                resolve(null);
                            }
                        });
                    } else { // If the query has no effect, then return null
                        resolve(null);
                    }
                });
            }
            else resolve(null);
        });
    });
}
/*updateTaskById({id:11}, { 'id': 302,'exam': '154', 'owner': '11', 'task_type': 'multiple_c', 'question': { 'text': 'What\'s the meaning of life ?', 'possibilities': ["0", "1"], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' }).then(task=>{
    console.log(task);
});*/
// Delete the task given as parameter
function deleteTaskById(loggedUser, id) {
    return new Promise(resolve => {
        if (id != null) {
            let retval;
            getTaskById(loggedUser, id).then(task => {
                retval = task;
                if (isATask(retval))
                    connection.query('DELETE FROM task WHERE id = ?', [retval.id], function (error, results, fields) {
                        if (error) { // In case of error it blocks and returns a null
                            throw error;
                            resolve(null);
                        }
                        if (results.affectedRows > 0) { // If the query has effect, then there is the task has been eliminated
                            resolve(retval);
                        } else { // If the query has no effect, then return null
                            resolve(null);
                        }
                    });
            });

        }
        else resolve(null);
    });
}
/*deleteTaskById({ id: 11 }, 303).then(task => {
    console.log(task);
})*/


// Controls if the loggedUser has the privileges to modify the Task
function checkTaskPrivilege(loggedUser, id) {
    return new Promise(resolve => {
        connection.query('SELECT T.id FROM teacher_exam TE, task T WHERE TE.id_teacher = ? AND T.id_exam = TE.id_exam And T.id = ?', [loggedUser.id, id], function (error, results, fields) {
            if (error) { // In case of error it blocks and returns a null
                throw error;
                resolve(null);
            }
            if (results.length > 0) { // If the query has effect
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

// add Possibility when update a task
function addPossibility(possibility, id, i) {
    return new Promise(resolve => {
        connection.query('INSERT INTO task_possibility VALUES (?,?,?)', [id, i, possibility], function (pos_error, pos_results, pos_fields) {
            if (pos_error) { // In case of error it blocks and returns a null
                throw pos_error;
                resolve(null);
            }
            resolve(null);//return null
        });
    });
}

// Get all the tasks with all the information without filtering
function getTasksbyExam(loggedUser, id_exam) {
    return new Promise(resolve => {
        let retval = [];
        let gotTasks = getTasks(loggedUser);
        gotTasks.then(tasks => {
            if (tasks != null) {
                for (let i = 0; i < tasks.length; i++) {
                    if (tasks[i].exam == id_exam)
                        retval.push(tasks[i]);

                }
            }
            resolve(retval);
        });
    });
}
/*getTasksbyExam(11, 193).then(tasks => {
    console.log(tasks);
});*/

module.exports = { getTasks, createTask, getTaskById, updateTaskById, deleteTaskById, getTasksbyExam };
