const utilities = require('./utilities');
const connection = utilities.connection; // DataBase connection
const getUser = require('./userDao.js').getUser;

// Get all the tasks with all the information without filtering
function getTasks(loggedUser) {
    return new Promise(resolve => {
        let retval = []; // Array that will return all the tasks
        // Query to receive all the tasks saved in the database
        connection.query('SELECT id FROM task;', function (error, results, fields) {
            if (error) { // In case of error it blocks and returns a null
                throw error;
                resolve(null);
            }
            if (results.length > 0) { // If there is at least a task in the database
                let promise_tasks = [];
                for (let i = 0; i < results.length; i++) { // Iterate for all the tasks
                    let promise_tmp = getTaskById(loggedUser, results[i].id);
                    promise_tasks.push(promise_tmp);
                    promise_tmp.then(task => {
                        if (task != null)
                            retval.push(task);
                    });
                }

                Promise.all(promise_tasks).then(() => {
                    resolve(retval);
                });
            }
            else
                resolve(null);
        });
    });
}
/*getTasks({ id: 12 }).then(tasks => {
    console.log(tasks);
});*/
// Create a task given as parameter
function createTask(loggedUser, task) {
    return new Promise(resolve => {
        getUser(loggedUser, loggedUser.id).then(user => {
            task.owner = user;
            // If the task is complete and respect the documentation's schema
            if (utilities.isATaskBody(task)) {
                
                // Insert the task in the database
                connection.query('INSERT INTO task (id_owner, task_type, q_text, q_url, points) VALUES (?,?,?,?,?)',
                    [task.owner.id, task.task_type, task.question.text, task.question.base_upload_url, task.points],
                    function (error, results, fields) {
                        console.log("CIAO");
                        if (error) { // In case of error it blocks and returns a null
                            throw error;
                            resolve(null);
                        }
                        task.id = results.insertId;

                        if (utilities.isATask(task)) {
                            // Insert every possibility for the question of the task in the database
                            let promises_possibility = [];
                            for (let i = 0; i < task.question.possibilities.length; i++) {//load all the comment_peer for every submission
                                promises_possibility.push(addPossibility(task.question.possibilities[i], task.id, i));
                            }
                            Promise.all(promises_possibility).then(b => {
                                // Return the updated task after it's created
                                getTaskById(loggedUser, task.id).then(newTask => {
                                    if (utilities.isATask(newTask))
                                        resolve(newTask); // Return the added task
                                    else
                                        resolve(null);
                                });
                            });
                        }
                    }
                );

            }
            else resolve(null); // Return null in case there has been an error
        });

    });
}
createTask({ id: 11 }, { task_type: "open", question: { text: "testCreateTask0", possibilities: ['0', '1'], base_upload_url: "http://uploadhere.com/dummy/v1/" }, points: 1 }).then(task => {
    console.log(task);
});

// Get the task with the given id
function getTaskById(loggedUser, id) {
    return new Promise(resolve => {
        connection.query(
            'SELECT T.id, T.id_owner, T.task_type, T.q_text, T.q_url, T.points, TP.id_poss , TP.q_possibility ' +
            'FROM task as T left outer join task_possibility as TP ' +
            'on T.id = TP.id_task ' +
            'WHERE T.id = ? AND (T.id_owner = ? OR ? IN (select distinct id_teacher ' +
            'from teacher_exam as TE INNER JOIN exam_task as ET ON TE.id_exam=ET.id_exam)) ' +
            'UNION ' +
            'SELECT T2.id, T2.id_owner, T2.task_type, T2.q_text, T2.q_url, T2.points, TP.id_poss , TP.q_possibility ' +
            'FROM ' +
            '   (SELECT T.id, T.id_owner, T.task_type, T.q_text, T.q_url, T.points FROM ' +
            '       (SELECT ET1.id_task FROM ' +
            '           (SELECT DISTINCT E.id FROM exam as E, user_group as UG, user_group_members as UGP  ' +
            '           WHERE E.id_group = UG.id AND UG.id = UGP.id_group AND UGP.id_user = ? AND CONCAT(CURDATE(), \' \', CURTIME()) > E.deadline) as EX_T ' +
            '       INNER JOIN exam_task as ET1 ON EX_T.id = ET1.id_exam) as ET2 ' +
            '   INNER JOIN task T ON ET2.id_task = T.id) AS T2 ' +
            'left outer join task_possibility as TP  on T2.id = TP.id_task WHERE T2.id = ? ;', [id, loggedUser.id, loggedUser.id, loggedUser.id, id], function (error, results, fields) {
                if (error) { // In case of error it blocks and returns a null
                    throw error;
                    resolve(null);
                }
                if (results.length > 0) {
                    let task = {
                        'id': '' + results[0].id,
                        'owner': '' + {},
                        'task_type': '' + results[0].task_type,
                        'question': {
                            'text': '' + results[0].q_text,
                            'possibilities': [],
                            'base_upload_url': '' + results[0].q_url
                        },
                        'points': '' + results[0].points
                    }
                    // Query to receive all the possibilities for a given question
                    //see if the submission is a multiple/single choice type, so push its possibility in question
                    if (results[0].task_type == 'single_c' || results[0].task_type == 'multiple_c') {
                        for (let x = 0; x < results.length; x++) {
                            if (results[x].q_possibility != null)
                                task.question.possibilities.push(results[x].q_possibility);
                        }
                    }
                    getUser(loggedUser, results[0].id_owner).then(user => {
                        task.owner = user;
                        resolve(task); // Return all the tasks at the end of the for
                    });
                } else {
                    //task not found
                    resolve(null);
                }
            });
    });
}
/*getTaskById({ id: 11 }, 108).then(task => {
    console.log(task);
});*/
// Update the task given as parameter
function updateTaskById(loggedUser, task) {
    return new Promise(resolve => {
        checkTaskPrivilege(loggedUser, task.id).then(check => {
            if (check && utilities.isATask(task)) {
                //console.log(task);
                connection.query('UPDATE task SET task_type = ?, q_text = ?, q_url = ?, points = ? WHERE id = ?', [task.task_type, task.question.text, task.question.base_upload_url, task.points, task.id], function (error, results, fields) {
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
/*getTaskById({ id: 11 }, 106).then(task => {
    task.task_type = 'submit';
    updateTaskById({ id: 11 }, task).then(upTask => {
        console.log(upTask);
    });

});*/
// Delete the task given as parameter
function deleteTaskById(loggedUser, task) {
    return new Promise(resolve => {
        checkTaskPrivilege(loggedUser, task.id).then(check => {
            if (check && utilities.isATask(task)) {
                getTaskById(loggedUser, task.id).then(delTask => {
                    connection.query('DELETE FROM task WHERE id = ?', [delTask.id], function (error, results, fields) {
                        if (error) { // In case of error it blocks and returns a null
                            throw error;
                            resolve(null);
                        }
                        if (results.affectedRows > 0) { // If the query has effect, then there is the task has been eliminated
                            resolve(delTask);
                        } else { // If the query has no effect, then return null
                            resolve(null);
                        }
                    });
                });
            }
            else resolve(null);
        });
    });
}
/*getTaskById({ id: 11 }, 114).then(task => {
    console.log('delete ' + JSON.stringify(task));
    deleteTaskById({ id: 11 }, task).then(delTask => {
        console.log(delTask);
    });
})*/


// Controls if the loggedUser has the privileges to modify the Task
function checkTaskPrivilege(loggedUser, id) {
            return new Promise(resolve => {
                connection.query('SELECT id FROM task WHERE id_owner = ? AND id = ?;', [loggedUser.id, id], function (error, results, fields) {
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
                connection.query('INSERT INTO task_possibility (id_task, id_poss, q_possibility) VALUES (?,?,?)', [id, i, possibility], function (pos_error, pos_results, pos_fields) {
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