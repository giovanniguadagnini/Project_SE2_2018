const utilities = require('../utilities');
const connection = utilities.connection; // DataBase connection
const getUser = require('./userDao.js').getUser;

// Get all the tasks with all the information that the loggedUser is permitted to see
function getTasks(loggedUser) {
    return new Promise(resolve => {
        let retval = []; //Array that will return all the tasks
        //Query to receive all the tasks' id saved in the DataBase
        connection.query('SELECT id FROM task;', function (error, results, fields) {
            if (error) { //In case of error it blocks and returns a null
                throw error;
                resolve(null);
            }
            if (results.length > 0) { //If there is at least a task in the database
                let promise_tasks = [];
                for (let i = 0; i < results.length; i++) { //Iterate for all the tasks: get the task by its id
                    let promise_tmp = getTaskById(loggedUser, results[i].id); //Create a promise for the fetch of every task
                    promise_tasks.push(promise_tmp);
                    promise_tmp.then(task => {
                        if (task != null) //If the task can be seen by the loggedUser then that task can be added to the retval array
                            retval.push(task);
                    });
                }
                Promise.all(promise_tasks).then(() => { //Wait the fetch of every task, then returns the array
                    resolve(retval);
                });
            } else resolve(retval); //Return null if there aren't tasks in the DataBase, returns null
        });
    });
}

// Create a task given on the body as a parameter
function createTask(loggedUser, task) {
    return new Promise(resolve => {
        if (utilities.isATaskBody(task)) { //Checks if the task is complete and respect the documentation's schema
            getUser(loggedUser, loggedUser.id).then(user => { //Gets the information about the user that's trying to add the task
                if (utilities.isAUser(user) && task.owner.id == loggedUser.id) { //Checks if loggedUser is a valid User
                    task.owner = user;
                    //Insert the task in the database
                    connection.query('INSERT INTO task (id_owner, task_type, q_text, q_url, points) VALUES (?,?,?,?,?)',
                        [task.owner.id, task.task_type, task.question.text, task.question.base_upload_url, task.points],
                        function (error, results, fields) {
                            if (error) { //In case of error it blocks and returns a null
                                throw error;
                                resolve(null);
                            }
                            task.id = results.insertId; //Gets the new task id given by the DataBase
                            //Insert every possibility for the question of the task in the DataBase
                            let promises_possibility = [];
                            for (let i = 0; i < task.question.possibilities.length; i++) {
                                promises_possibility.push(addPossibility(task.question.possibilities[i], task.id, i));
                            }
                            Promise.all(promises_possibility).then(b => { //Wait for the insertion of every possibility
                                //Return the updated task after it's created
                                getTaskById(loggedUser, task.id).then(newTask => {
                                    resolve(newTask); //Return the added task
                                });
                            });
                        }
                    );
                } else resolve(null); //Return null if the user is not valid or is trying to add a task with different ownership(that's not allowed)
            });
        } else resolve(null); //Return null if the task is not complete or consistent
    });
}

// Get the task with the given id
function getTaskById(loggedUser, id) {
    return new Promise(resolve => {
        //Get the specified task with the proper controls based on the role of the loggedUser to the task
        connection.query(
            'SELECT T.id, T.id_owner, T.task_type, T.q_text, T.q_url, T.points, TP.id_poss , TP.q_possibility ' +
            'FROM task as T left outer join task_possibility as TP ' +
            'on T.id = TP.id_task ' +
            'WHERE T.id = ? AND (T.id_owner = ? OR ? IN (select distinct id_teacher ' +
            'from teacher_exam as TE INNER JOIN exam_task as ET ON TE.id_exam=ET.id_exam WHERE ET.id_task = ?)) ' +
            'UNION ' +
            'SELECT T2.id, T2.id_owner, T2.task_type, T2.q_text, T2.q_url, T2.points, TP.id_poss , TP.q_possibility ' +
            'FROM ' +
            '   (SELECT T.id, T.id_owner, T.task_type, T.q_text, T.q_url, T.points FROM ' +
            '       (SELECT ET1.id_task FROM ' +
            '           (SELECT DISTINCT E.id FROM exam as E, user_group as UG, user_group_members as UGP  ' +
            '           WHERE E.id_group = UG.id AND UG.id = UGP.id_group AND UGP.id_user = ? AND CONCAT(CURDATE(), \' \', CURTIME()) > E.deadline) as EX_T ' +
            '       INNER JOIN exam_task as ET1 ON EX_T.id = ET1.id_exam) as ET2 ' +
            '   INNER JOIN task T ON ET2.id_task = T.id) AS T2 ' +
            'left outer join task_possibility as TP  on T2.id = TP.id_task WHERE T2.id = ? ;', [id, loggedUser.id, loggedUser.id, id, loggedUser.id, id], function (error, results, fields) {
                if (error) { //In case of error it blocks and returns a null
                    throw error;
                    resolve(null);
                }
                if (results.length > 0) { //If the task can be viewed by the loggedUser
                    let task = { //Create the task with the results obtained by the DataBase
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
                    //Query to receive all the possibilities for the given question, checks if the submission is a multiple/single choice type, so push its possibility in question
                    if (results[0].task_type == 'single_c' || results[0].task_type == 'multiple_c') {
                        for (let x = 0; x < results.length; x++) {
                            task.question.possibilities.push(results[x].q_possibility);
                        }
                    }
                    getUser(loggedUser, results[0].id_owner).then(user => { //Get the user information from the id obtained by the DataBase
                        task.owner = user;
                        resolve(task); //Return all the tasks at the end of the for
                    });
                } else resolve(null); //Return null if the task is not found
            });
    });
}

// Update the task given as parameter
function updateTaskById(loggedUser, task) {
    return new Promise(resolve => {
        if (utilities.isATask(task)) { //Checks if the task given as parameter is complete and respect the documentation's schema
            checkTaskPrivilege(loggedUser, task.id).then(check => { //Returns true if loggedUser has the privilege to edit the Task
                if (check) { //Checks the loggedUser privileges on the given task
                    connection.query('UPDATE task SET task_type = ?, q_text = ?, q_url = ?, points = ? WHERE id = ?', [task.task_type, task.question.text, task.question.base_upload_url, task.points, task.id], function (error, results, fields) {
                        if (error) { //In case of error it blocks and returns a null
                            throw error;
                            resolve(null);
                        }
                        if (results.affectedRows > 0) { //If the query has effect, then there's the task, and the possibilities need to be updated as well
                            //Remove all the previous possibilities
                            connection.query('DELETE FROM task_possibility WHERE id_task = ?', [task.id], function (pos_error, pos_results, pos_fields) {
                                if (pos_error) { //In case of error it blocks and returns a null
                                    throw pos_error;
                                    resolve(null);
                                }
                                //Insert every possibility for the question of the task in the database
                                let promises_possibility = [];
                                for (let i = 0; i < task.question.possibilities.length; i++) { //load all the comment_peer for every submission
                                    promises_possibility.push(addPossibility(task.question.possibilities[i], task.id, i));
                                }
                                Promise.all(promises_possibility).then(b => { //Wait for the insertion of every new possibility
                                    getTaskById(loggedUser, task.id).then(updatedTask => { //Return the updated task after its update
                                        resolve(updatedTask);
                                    });
                                });
                            });
                        } else resolve(null); //Return null if the query to update task has no effect
                    });
                } else resolve(null); //Return null if the user has no privilege to update the task
            });
        } else resolve(null); //Return null if the passed task is not complete or consistent
    });
}

// Delete the task given as parameter
function deleteTaskById(loggedUser, task) {
    return new Promise(resolve => {
        if (utilities.isATask(task)) { //Checks if the task given as parameter is complete and respect the documentation's schema
            checkTaskPrivilege(loggedUser, task.id).then(check => {  //Returns true if loggedUser has the privilege to delete the Task
                if (check) { //Checks the loggedUser privileges on the given task
                    getTaskById(loggedUser, task.id).then(delTask => { //Gets the task saved in the DataBase before deleting it
                        connection.query('DELETE FROM task WHERE id = ?', [delTask.id], function (error, results, fields) { //Delete the task
                            if (error) { //In case of error it blocks and returns a null
                                throw error;
                                resolve(null);
                            }
                            if (results.affectedRows > 0) { //If the query has effect, then there is the task has been deletes
                                resolve(delTask);
                            } else resolve(null); //Return null if the query has no effect
                        });
                    });
                } else resolve(null); //Return null if the user has no privilege to delete the task
            });
        } else resolve(null); //Return null if the passed task is not complete or consistent
    });
}

// Controls if the loggedUser has the privileges to modify the Task, i.e. if the loggedUser is effectively the owner of that task
function checkTaskPrivilege(loggedUser, id) {
    return new Promise(resolve => {
        connection.query('SELECT id FROM task WHERE id_owner = ? AND id = ?;', [loggedUser.id, id], function (error, results, fields) {
            if (error) { //In case of error it blocks and returns a null
                throw error;
                resolve(null);
            }
            if (results.length > 0)  //Return true if the query returns the task
                resolve(true);
            else resolve(false); //Return false if the loggedUser is not the owner of that task
        });
    });
}

// Add Possibility when update a task
function addPossibility(possibility, id, i) {
    return new Promise(resolve => {
        connection.query('INSERT INTO task_possibility (id_task, id_poss, q_possibility) VALUES (?,?,?)', [id, i, possibility], function (pos_error, pos_results, pos_fields) {
            if (pos_error) { //In case of error it blocks and returns a null
                throw pos_error;
                resolve(null);
            }
            resolve(null); //Return null after the insertion of the task_possibility
        });
    });
}

// Get all the tasks of an Exam
function getTasksByExam(loggedUser, id_exam) {
    return new Promise(resolve => {
        let retval = [];
        connection.query('SELECT id_task FROM exam_task WHERE id_exam = ?', [id_exam], function (error, results, fields) { //Selects all the tasks of the given exam
            if (error) { //In case of error it blocks and returns a null
                throw error;
                resolve(null);
            }
            if (results.length > 0) {  //If the query has effect, then the exam has some tasks
                let promise_tasks = [];
                for (let i = 0; i < results.length; i++) { // Iterate for all the id_tasks obtained
                    let promise_tmp = getTaskById(loggedUser, results[i].id_task); //Get all the tasks if permitted
                    promise_tasks.push(promise_tmp);
                    promise_tmp.then(task => {
                        if (utilities.isATask(task)) //Checks if the task obtained is valid and then adds it to the retval array
                            retval.push(task);
                    });
                }
                Promise.all(promise_tasks).then(() => { //Wait for the fetching of all the tasks of the exam
                    resolve(retval);
                });
            } else resolve(retval); //Return an empty array if the exam has no tasks
        });
    });
}

module.exports = { getTasks, createTask, getTaskById, updateTaskById, deleteTaskById, getTasksByExam };
