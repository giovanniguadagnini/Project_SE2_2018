const utilities = require('./utilities');
const connection = utilities.connection;

/*  See if the user is already in the db, if not register it
    data is supposed to be what the google identity providers supplies
*/
function findOrCreate(data) {
    return new Promise(resolve => {
        //use an invalid id just to see if the user is already in the db
        getUser({id: 'invalidId'}, data.id).then(value => {
            let userFromDB = value;
            if (userFromDB == null) { // user doesn't exist in db (registration)
                let userToDB;
                if (data.id != null && data.name != null) {
                    userToDB = {
                        id: data.id,
                        name: data.name.givenName,
                        surname: data.name.familyName
                    };
                    //create user with data got from google identity providers
                    createUser(userToDB).then(value => {
                        resolve (value);
                    });
                }else{
                    //return object with invalid id (this is not suppose to happen)
                    resolve({id: 'invalidId'});
                }

            }else{ //log-in
                //there is already a user with this id in the db (user already registered)
                resolve (userFromDB);
            }
        });
    });
}

/*Insert user in the db */
function createUser(user) {
    return new Promise(resolve => {
        //check if user contains the basic data
        if (utilities.isAUser(user)) {
            let born = null;
            if (user.born != null && utilities.isAValidDate(user.born))
                born = user.born.year + '-' + user.born.month + '-' + user.born.day + ' ' + user.born.hour + ':' + user.born.minute + ':' + user.born.second;

            let enrolled = null;
            if (user.enrolled != null && utilities.isAValidDate(user.enrolled))
                enrolled = user.enrolled.year + '-' + user.enrolled.month + '-' + user.enrolled.day + ' ' + user.enrolled.hour + ':' + user.enrolled.minute + ':' + user.enrolled.second;
            connection.query('INSERT INTO user (id, name, surname, email, born, enrolled) VALUES (?,?,?,?,?,?)',
                [user.id, user.name, user.surname, user.email, born, enrolled],
                function (error, results, fields) {
                    if (error) {
                        throw error;
                        resolve(null);
                    } else {
                        resolve(user);
                    }
                }
            );
        }
        else {
            resolve(null);
        }
    });

}

/*  This function supply all the users in the db (appropriately filtered
    based also on what the logged user can actually see)
    enrolledBefore & enrolledAfter are just year values
*/
function getAllUsers(loggedUser, enrolledAfter, enrolledBefore, sortUsrBy) {
    return new Promise(resolve => {
        let retval = []; //array of users
        let promises_users = [];
        connection.query(   'SELECT id FROM user ' +
                            'WHERE (user.enrolled >= DATE_FORMAT(\'?-01-01 00:00:00\',\'%Y-%m-%d %H:%i:%s\') '+
                            'AND '+
                            'user.enrolled <= DATE_FORMAT(\'?-01-01 00:00:00\',\'%Y-%m-%d %H:%i:%s\')) ' +
                            'OR user.enrolled IS NULL', [+enrolledAfter, +enrolledBefore], function (error, results, fields) {
            if (error) {
                throw error;
                resolve(null);
            }
            let promise_tmp;
            for (let i = 0; i < results.length; i++) { //for every user retrivied, the function getUser retrieve the user JSON, and it will insert exam data only if the logged user has the privileges to see it
                promise_tmp = getUser(loggedUser, results[i].id, false);
                promises_users.push(promise_tmp);
                promise_tmp.then( userToAdd => {
                    retval.push(userToAdd);//every time a promise is completed it means we've got the proper data of the user to add in the return array
                });
            }

            Promise.all(promises_users).then(b => {
                if(sortUsrBy == 'alpha')
                    retval.sort(utilities.compareAlfa);
                else
                    retval.sort(utilities.compareEnrol);
                resolve(retval);
            });
        });

    });
}

/*  get a user by a specific id based also on what the logged user can actually see
* */
function getUser(loggedUser, id){
    return new Promise(resolve => {
        getUser1(loggedUser, id).then( user => {
            if(user != null){
                let promises_pcomments = [];
                for(let i = 0; i < user.submissions.length; i++){//load all the comment_peer for every submission
                    promises_pcomments.push(loadCommentPeer(user.submissions[i]));
                }
                Promise.all(promises_pcomments).then(b => {
                    resolve(user);
                });
            }else {
                resolve(null);
            }
        });
    });
}

/*  Get all the important information the logged user about the user with given id
*   (profile info, submission/exams he/she was teacher of, peer reviews loaded in loadCommentPeer) */
function getUser1(loggedUser, id) {
    return new Promise(resolve => {
        connection.query('SELECT * FROM user WHERE id = ?', [id], function (error, results, fields) {//the function retrieve the user from the id
            if (error) {
                throw error;
                resolve(null);
            }

            if (results.length > 0) {// found a user with this given id
                let born = null;
                if (results[0].born != null){
                    let temp = results[0].born;
                    let t = (temp + '').split(/[- :]/);
                    born = {
                        year: +t[3],
                        month: utilities.convertMonth(t[1]),
                        day: +t[2],
                        hour: +t[4],
                        minute: +t[5],
                        second: +t[6]
                    };
                }

                let enrolled = null;

                if (results[0].enrolled != null){
                    let temp = results[0].enrolled;
                    let t = (temp + '').split(/[- :]/);
                    enrolled = {
                        year: +t[3],
                        month: utilities.convertMonth(t[1]),
                        day: +t[2],
                        hour: +t[4],
                        minute: +t[5],
                        second: +t[6]
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

                //after we've fetched the basic profile data, we fetch the submission the loggedUser could see about the user with given id
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
                            //the following variables is necessary to calc on the fly the mark of the exam based on given points/tot points that could have got
                            let id_ex;
                            if(results.length > 0)
                                id_ex = results[0].id_exam;
                            let tot_earned = 0;//points earned by the user in the exam with id_ex
                            let tot_points = 0;//totale points in the exam with id_ex

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

                                //update data to calc exam mark
                                id_ex = submission.id_exam;
                                tot_earned += submission.earned_points;
                                tot_points += submission.points;
                                if(i+1 == results.length || results[i+1].id_exam != submission.id_exam){
                                    user.exam_eval.push({id_exam: id_ex, mark: ((tot_earned/tot_points)*30)});//the function computes the evalutation of the exam
                                    tot_points = 0;
                                    tot_earned = 0;
                                }

                                //see if the submission is a multiple/single choice type, so push its possibility in question
                                if(submission.task_type == 'single_c' || submission.task_type == 'multiple_c') {
                                    let x;
                                    for (x = i; x < results.length && submission.id == results[x].id_s; x++) {
                                        if (results[x].q_possibility != null) {
                                            submission.question.possibilities.push(results[x].q_possibility);
                                        }
                                    }
                                    i = x - 1;
                                }
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

/*  See getUser & getUser1 to comprehend deeply the motivation behind thuis function
    Basically it loads all the comment peer behind a submission
    [TO DO]: need to transfer this in loadCommentPeer
* */
function loadCommentPeer(submission){
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

/*  update user data
    (could be performed just by the loggedUser on its own profile
    security checks have to be put before this function calling)
* */
function updateUser(user) {
    return new Promise(resolve => {
        if (utilities.isAUser(user)) {

            let born = null;
            if (user.born != null && utilities.isAValidDate(user.born))
                born = user.born.year + '-' + user.born.month + '-' + user.born.day + ' ' + user.born.hour + ':' + user.born.minute + ':' + user.born.second;

            let enrolled = null;
            if (user.enrolled != null && utilities.isAValidDate(user.enrolled))
                enrolled = user.enrolled.year + '-' + user.enrolled.month + '-' + user.enrolled.day + ' ' + user.enrolled.hour + ':' + user.enrolled.minute + ':' + user.enrolled.second;

            connection.query('UPDATE user SET name = ?, surname = ?, email = ?, enrolled = ?, born = ? WHERE id = ?', [user.name, user.surname, user.email, enrolled, born, user.id], function (error, results, fields) {
                if (error) {
                    throw error;
                    resolve(null);
                }
                if (results.affectedRows > 0) {
                    resolve(user);
                } else {
                    resolve(null);
                }

            });

        }
        else {
            resolve(null);
        }
    });
}

/*  delete user data
    (could be performed just by the loggedUser on its own profile
    security checks have to be put before this function calling)
* */
function deleteUser(loggedUser, userId) {
    return new Promise(resolve => {
        if (userId != null) {
            let retval;
            getUser(loggedUser, userId, false).then(user => {
                connection.query('DELETE FROM user WHERE id = ?', [userId], function (error, results, fields) {
                    if (error) {
                        throw error;
                        resolve(null);
                    }
                    if (results.affectedRows > 0) {
                        retval = user;
                    } else {
                        retval = null;
                    }
                    resolve(retval);
                });
            });
        }
        else {
            resolve(null);
        }
    });
}

/* DUMMY TEST TO USE DURING DEVELOPMENT/DEBUGGING/BUG DISCOVERING & FIXING
* */
/*getUser({id:'invalidId'}, '102214019543444378931').then( value =>{
    console.log(JSON.stringify(value));
});
*/
/*
getAllUsers({id:'12'}, 1990, 2018).then( value =>{
    console.log(JSON.stringify(value));
});
*/
module.exports = {findOrCreate, getAllUsers, createUser, getUser, updateUser, deleteUser, connection};
