const mysql = require('mysql');
const myDate = require('./myDate');

const connection = mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7267085',
    password: 'IlVZ5TF9HT',
    database: 'sql7267085'
});

function findOrCreate(data) {
    return new Promise(resolve => {
        getUser({}, data.id).then(value => {
            let userFromDB = value;
            if (userFromDB == null) { // user doesn't exist in db
                let userToDB;
                if (data.name != undefined) {
                    userToDB = {
                        id: data.id,
                        name: data.name.familyName,
                        surname: data.name.givenName
                    };
                } else {
                    userToDB = {id: data.id};
                }
                createUser(userToDB).then(value => {
                    resolve (value);
                });
            }else{
                resolve (userFromDB);
            }
        });
    });
}

function createUser(user) {
    return new Promise(resolve => {
        if (user != null && user.id != null) {
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

function getAllUsers(loggedUser, enrolledBefore, enrolledAfter) {
    return new Promise(resolve => {
        let retval = [];

        connection.query('SELECT * FROM user WHERE (user.enrolled >= ? AND user.enrolled <= ?) OR user.enrolled IS NULL', [enrolledBefore, enrolledAfter], function (error, results, fields) {
            if (error) {
                throw error;
                resolve(null);
            }
            if (results.length > 0) {
                for (var i = 0; i < results.length; i++) {
                    let born = null;
                    if (results[i].born != null){
                        let temp = results[i].born;
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

                    if (results[i].enrolled != null){
                        let temp = results[i].enrolled;
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

                    retval.push({
                        'id': '' + results[i].id,
                        'name': '' + results[i].name,
                        'surname': '' + results[i].surname,
                        'mail': '' + results[i].mail,
                        'enrolled': enrolled,
                        'born': born
                    })
                }
                resolve(retval);
            }else
                resolve (null);

        });

    });
}

function getUser(loggedUser, id){
    return new Promise(resolve => {
        getUser1(loggedUser, id).then( user => {
            var vettPromise = [];
            for(let i = 0; i < user.submissions.length; i++){
                vettPromise[i] = new Promise(a => {
                    loadCommentPeer(user.submissions[i]);
                });
            }
            Promise.all(vettPromise).then(b => {
                resolve(user);
            });
            /*OLD
            loadCommentPeer(user, 0).then( user2 => {
                resolve(user2);
            });
            */
        });
    });
}

function getUser1(loggedUser, id) {
    return new Promise(resolve => {
        connection.query('SELECT * FROM user WHERE id = ?', [id], function (error, results, fields) {
            if (error) {
                throw error;
                return null;
            }

            if (results.length > 0) {
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
                    'mail': '' + results[0].mail,
                    'enrolled': enrolled,
                    'born':  born,
                    'submissions': [],
                    'exam_eval': []
                };
                connection.query('SELECT * FROM ' +
                    '(SELECT S.id AS id_s, S.id_exam, S.answer, S.comment, S.completed, S.earned_points, ' +
                    'T.id AS id_t, T.id_owner, T.points, T.q_text, T.q_url, T.task_type ' +
                    'FROM user U, submission S, task T ' +
                    'WHERE S.id_user = ? AND S.id_task = T.id ' +
                    'ORDER BY S.id_exam, id_s ASC) AS TEMP LEFT OUTER JOIN task_possibility TP ' +
                    'ON TEMP.id_t = TP.id_task;', [id],
                    function (error, results, fields) {
                        if (error) {
                            throw error;
                            resolve(null);
                        } else {
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
                                }
                                for(let x = i; x < results.length && submission.id == results[x].id_s; x++){
                                    submission.possibilities.push({value: results[x].q_possibility});
                                }
                                i = x;
                                user.submissions.push(submission);
                            }
                            resolve(user);
                        }
                    }
                );
            }else{
                resolve(null);
            }
        });
    });
}

function loadCommentPeer(submission){
    return new Promise(resolve => {
        connection.query('SELECT comment FROM comment_peer WHERE id_submission = ?', [submission.id],
            function (error, results, fields) {
                if (error) {
                    throw error;
                } else {
                    for(let y = 0; y < results.length; y++){
                        submission.comment_peer.push(results[y].comment);
                    }
                    loadCommentPeer(user, index+1);
                }
            }
        )
    });
}

/*
function loadCommentPeer(user, index){
    return new Promise(resolve => {
        if(index == user.submissions.length){
            resolve(user);
        }else{
            connection.query('SELECT comment FROM comment_peer WHERE id_submission = ?', [user.submission.id],
                function (error, results, fields) {
                    if (error) {
                        throw error;
                    } else {
                        for(let y = 0; y < results.length; y++){
                            user.submission.comment_peer.push(results[y].comment);
                        }
                        loadCommentPeer(user, index+1);
                    }
                }
            );
        }
    });
}
*/
function updateUser(user) {
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

function deleteUser(userId) {
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
getUser({id:'123'}, 123).then( value =>{
    console.log(JSON.stringify(value));
});
module.exports = {findOrCreate, getAllUsers, createUser, getUser, updateUser, deleteUser};
