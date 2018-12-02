const mysql = require('mysql');
const myDate = require('./myDate');

const connection = mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7267085',
    password: 'IlVZ5TF9HT',
    database: 'sql7267085'
});

function findOrCreate(data) { //this function search the user in the db, and if the user ins't already inserted, the function create a new user
    return new Promise(resolve => {
        getUser({}, data.id).then(value => {
            let userFromDB = value;
            if (userFromDB == null) { // user doesn't exist in db
                let userToDB;
                if (data.name != undefined) {//retrive data from google JSON
                    userToDB = {
                        id: data.id,
                        name: data.name.familyName,
                        surname: data.name.givenName
                    };
                } else {
                    userToDB = {id: data.id};
                }
                createUser(userToDB).then(value => {
                    resolve (value);//return the new user inserted into the db
                });
            }else{
                resolve (userFromDB);//return the user retrievied from the db
            }
        });
    });
}

function createUser(user) { //function that create a new user
    return new Promise(resolve => {
        if (user != null && user.id != null) {//if the JSON exists and has inside the id, the function create a new user
            connection.query('INSERT INTO user (id, name, surname) VALUES (?,?,?)',
                [user.id, user.name, user.surname],
                function (error, results, fields) {
                    if (error) {
                        throw error;
                        resolve(null);
                    } else
                        resolve(user);
                }
            );
        }
        else resolve(null);
    });

}

function getAllUsers(loggedUser, enrolledBefore, enrolledAfter) { //this function retrieve from the db all the user that has been created between the time limit
    return new Promise(resolve => {
        let retval = [];
        let promises_users = []; //get from the database all the user between the time limit inserted
        connection.query(   'SELECT id FROM user ' +
                            'WHERE (user.enrolled >= DATE_FORMAT(\'?-01-01 00:00:00\',\'%Y-%m-%d %H:%i:%s\') '+
                            'AND '+
                            'user.enrolled <= DATE_FORMAT(\'?-01-01 00:00:00\',\'%Y-%m-%d %H:%i:%s\')) ' +
                            'OR user.enrolled IS NULL', [enrolledBefore, enrolledAfter], function (error, results, fields) {
            if (error) {
                throw error;
                resolve(null);
            }
            let promise_tmp;
            for (let i = 0; i < results.length; i++) { //for every user retrivied, the function getUser retrieve the user JSON, and it will insert exam data only if the logged user has the privileges to see it
                promise_tmp = getUser(loggedUser, results[i].id);
                promises_users.push(promise_tmp);
                promise_tmp.then( userToAdd => {
                    retval.push(userToAdd);
                });
            }

            Promise.all(promises_users).then(b => {
                resolve(retval);
            });
        });

    });
}

function getUser(loggedUser, id){//the function try to retrieve the user JSON related to the id passed as parameter, and it will insert exam data only if the logged user has the privileges to see it
    return new Promise(resolve => {
        getUser1(loggedUser, id).then( user => {
            let promises_pcomments = [];
            for(let i = 0; i < user.submissions.length; i++){//load all the comment_peer for every submission
                promises_pcomments.push(loadCommentPeer(user.submissions[i]));
            }
            Promise.all(promises_pcomments).then(b => {
                resolve(user);
            });
        });
    });
}

function getUser1(loggedUser, id) {
    return new Promise(resolve => {
        connection.query('SELECT * FROM user WHERE id = ?', [id], function (error, results, fields) {//the function retrieve the user from the id
            if (error) {
                throw error;
                return null;
            }

            if (results.length > 0) {//if the db return at least a row, the function build the JSON
                let born = null;
                if (results[0].born != null){
                    let temp = results[0].born;
                    let t = (temp + '').split(/[- :]/);
                    temp = new Date(Date.UTC(t[3], myDate.convertMonth(t[1]), t[2], t[4]-1, t[5], t[6]));
                    born = {
                        year: temp.getFullYear(),
                        month: temp.getMonth(),
                        day: temp.getDay(),
                        hour: temp.getHours(),
                        minute: temp.getMinutes(),
                        second: temp.getSeconds()
                    };
                }

                let enrolled = null;

                if (results[0].enrolled != null){
                    let temp = results[0].enrolled;
                    let t = (temp + '').split(/[- :]/);
                    temp = new Date(Date.UTC(t[3], myDate.convertMonth(t[1]), t[2], t[4]-1, t[5], t[6]));
                    enrolled = {
                        year: temp.getFullYear(),
                        month: temp.getMonth(),
                        day: temp.getDay(),
                        hour: temp.getHours(),
                        minute: temp.getMinutes(),
                        second: temp.getSeconds()
                    };
                }
                let user = {
                    'id': '' + results[0].id,
                    'name': '' + results[0].name,
                    'surname': '' + results[0].surname,
                    'email': '' + results[0].email,
                    'enrolled': enrolled,
                    'born':  born,
                    'submissions': [],
                    'exam_eval': []
                };

                //the function try to retrieve the data related to the exams,
                let fetch_sub_query =   'SELECT * FROM ' +
                                            '(SELECT S.id AS id_s, S.id_exam, S.answer, S.comment, S.completed, S.earned_points, ' +
                                            'T.id AS id_t, T.id_owner, T.points, T.q_text, T.q_url, T.task_type ' +
                                            'FROM submission S, task T ' +
                                            'WHERE (S.id_user = ? AND S.id_task = T.id ' +
                                            'AND ' +
                                                 //logged user is asking for data of other users so he/she can only see data of exams he/she was teacher of
                                                '( S.id_exam IN (SELECT id_exam FROM teacher_exam WHERE id_teacher = ?) ' +
                                                    'OR ' +
                                                    '? = ? ' + // logged user is asking his/her own data
                                                ') ' +
                                            ') ' +
                                        'ORDER BY S.id_exam, id_s ASC) AS TEMP LEFT OUTER JOIN task_possibility TP ' +
                                        'ON TEMP.id_t = TP.id_task';

                connection.query(fetch_sub_query, [id,loggedUser.id,id,loggedUser.id],
                    function (error, results, fields) {
                        if (error) {
                            throw error;
                            resolve(null);
                        } else {
                            //if the db return exam data, the function will build one object per exam
                            let id_ex;
                            if(results.length > 0)
                                id_ex = results[0].id_exam;
                            let tot_earned = 0;
                            let tot_points = 0;
                            for (let i = 0; i < results.length; i++){

                                let submission = {
                                    id: results[i].id_s,
                                    task_type: results[i].task_type,
                                    question: {
                                        text: results[i].q_text,
                                        possibilities: [],
                                        base_upload_url: results[i].q_url
                                    },
                                    answer: results[i].answer,
                                    id_user: id,
                                    id_exam: results[i].id_exam,
                                    completed: results[i].completed,
                                    comment_peer: [],
                                    comment: results[i].comment,
                                    points: results[i].points,
                                    earned_points: results[i].earned_points
                                };
                                id_ex = submission.id_exam;
                                tot_earned += submission.earned_points;
                                tot_points += submission.points;
                                if(i+1 == results.length || results[i+1].id_exam != submission.id_exam){
                                    user.exam_eval.push({id_exam: id_ex, mark: ((tot_earned/tot_points)*30)});//the function computes the evalutation of the exam
                                    tot_points = 0;
                                    tot_earned = 0;
                                }
                                let x;
                                for(x = i; x < results.length && submission.id == results[x].id_s; x++){//the function load the submissio possibilities
                                    if(results[x].q_possibility != null) {
                                        submission.question.possibilities.push({value: results[x].q_possibility});
                                    }
                                }
                                i = x-1;
                                user.submissions.push(submission);
                            }
                            resolve(user);//the function return the user data
                        }
                    }
                );
            }else{
                resolve(null);
            }
        });
    });
}

function loadCommentPeer(submission){//for every submission this function load all the related comment peer
    return new Promise(resolve => {
        connection.query('SELECT comment FROM comment_peer WHERE id_submission = ?', [submission.id],
            function (error, results, fields) {
                if (error) {
                    throw error;
                    resolve(null);
                } else {
                    for(let y = 0; y < results.length; y++){
                        submission.comment_peer.push(results[y].comment);
                    }
                    resolve(null);
                }
            }
        )
    });
}

function updateUser(user) {//based on the JSON value the function update the user in the db
    return new Promise(resolve => {
        if (user != null && user.id != null) {

            let born = null;
            if (user.born != null)
                born = user.born.year + '-' + user.born.month + '-' + user.born.day + ' ' + user.born.hour + ':' + user.born.minute + ':' + user.born.second;

            let enrolled = null;
            if (user.enrolled != null)
                enrolled = user.enrolled.year + '-' + user.enrolled.month + '-' + user.enrolled.day + ' ' + user.enrolled.hour + ':' + user.enrolled.minute + ':' + user.enrolled.second;

            connection.query('UPDATE user SET name = ?, surname = ?, email = ?, enrolled = ?, born = ? WHERE id = ?', [user.name, user.surname, user.email, enrolled, born, user.id], function (error, results, fields) {
                if (error) {
                    throw error;
                    resolve(null);
                }
                if (results.affectedRows > 0) {
                    getUser(user, user.id).then(value => {
                        resolve(value);
                    });
                } else {
                    resolve(null);
                }

            });

        }
        else resolve(null);
    });
}

function deleteUser(userId) { //the function delete the user from the db
    return new Promise(resolve => {
        if (userId != null) {
            let retval;

            connection.query('DELETE FROM user WHERE id = ?', [userId], function (error, results, fields) {
                if (error) {
                    throw error;
                    return null;
                }
                if (results.affectedRows > 0) {
                    retval = user;
                } else {
                    retval = null;
                }
                resolve(retval);
            });

        }

        else resolve(null);
    });
}

/*getUser({id:'10'}, 12).then( value =>{
    console.log(JSON.stringify(value));
});*/

/*getAllUsers({id:'12'}, 1990, 2018).then( value =>{
    console.log(JSON.stringify(value));
});*/

module.exports = {findOrCreate, getAllUsers, createUser, getUser, updateUser, deleteUser};
