const utilities = require('./utilities');
const connection = utilities.connection;

/*  Fetching all the submissions that the loggedUser has the right to see,
    so they have to be either its own submissions or the submissions that have been part
    of an exam he/she was teacher of
* */
function getAllSubmissions(loggedUser) {
    return new Promise(resolve => {
        if(loggedUser == null || loggedUser.id == null)
            resolve(null);
        let querySql = 'SELECT S.id FROM submission S';//fetch all the submissions' ids
        connection.query(querySql, [], function (error, results, fields) {
                if (error) {
                    throw error;
                    resolve(null);
                } else {
                    let retval = [];
                    let promiseSubmissions = [];
                    let promiseTemp;
                    for(let i = 0; i < results.length; i++){
                        promiseTemp = getSubmission(loggedUser, results[i].id);// put into single promises fetch by id
                        promiseSubmissions.push(promiseTemp);
                        promiseTemp.then( submission => {
                            if(submission)//if I have the right to see it, I'll have a proper submission (not null obj)
                                retval.push(submission)// & insert it into the resulting array
                        });
                    }

                    Promise.all(promiseSubmissions).then( () => resolve(retval));//after all the fetching by ids, just return the array of submissions

                }
            }
        );
    });
}

/*  Fetching submission with id idSubmission if the loggedUser has the right to see,
    so it has to be either its own submission or one of the submissions that have been part
    of an exam he/she was teacher of, otherwise it'll be null
* */
function getSubmission(loggedUser, idSubmission) {
    return new Promise(resolve => {
        if(loggedUser == null || loggedUser.id == null || idSubmission == null)
            resolve(null);
        let querySql = 'SELECT S2.id, S2.id_task, S2.id_exam, S2.id_user, S2.answer, S2.completed, S2.comment, S2.earned_points, S2.points, ' +
            'S2.q_text, S2.q_url, S2.task_type, S2.q_possibility, CP.comment AS comment_peer FROM ' +
                '(SELECT S1.id, S1.id_task, S1.id_exam, S1.id_user, S1.answer, S1.completed, S1.comment, S1.earned_points, S1.points, S1.q_text, S1.q_url, S1.task_type, TP.q_possibility ' +
                'FROM( ' +
                    'SELECT S.id, S.id_task, S.id_exam, S.id_user, S.answer, S.completed, S.comment, S.earned_points, T.points, T.q_text, T.q_url, T.task_type ' +
                    'FROM submission S, task T ' +
                    'WHERE S.id_task=T.id AND S.id = ? AND ' +
                    '((S.id_user = ? AND (CONCAT(CURDATE(), \' \', CURTIME()))>(SELECT start_time FROM exam E, submission S WHERE E.id=S.id_exam AND S.id = ?)) ' +
            '         OR ' +
                    '? IN (SELECT TE.id_teacher FROM exam E, teacher_exam TE, submission SE WHERE SE.id = ? AND SE.id_exam=E.id AND E.id=TE.id_exam)\n' +
                    ') ' +
                ') AS S1 LEFT OUTER JOIN task_possibility TP ON S1.id_task=TP.id_task) AS S2 LEFT OUTER JOIN comment_peer CP ON S2.id=CP.id_submission\n' +
            'GROUP BY S2.q_possibility, CP.comment';
        connection.query(querySql, [idSubmission, loggedUser.id, idSubmission, loggedUser.id, idSubmission],
            function (error, results, fields) {
                if (error) {
                    throw error;
                    resolve(null);
                } else {
                    let submission = null;
                    if (results.length > 0) {
                        submission = {
                            id: results[0].id,
                            task_type: results[0].task_type,
                            question: {
                                text: results[0].q_text,
                                possibilities: [],
                                base_upload_url: results[0].q_url
                            },
                            answer: results[0].answer,
                            id_user: results[0].id_user,
                            id_exam: results[0].id_exam,
                            completed: results[0].completed,
                            comment_peer: [],
                            comment: results[0].comment,
                            points: results[0].points,
                            earned_points: results[0].earned_points
                        };
                        //console.log("Inside getSubmission() " + JSON.stringify(submission));
                        // fill with possibilities
                        if(results[0].q_possibility)
                            submission.question.possibilities.push(results[0].q_possibility);
                        for(let i=1; i<results.length; i++){
                            if(submission.question.possibilities[submission.question.possibilities.length-1] != results[i].q_possibility)
                                submission.question.possibilities.push(results[i].q_possibility);
                        }

                        // fill with comment peers
                        if(results[0].comment_peer)
                            submission.comment_peer.push(results[0].comment_peer);
                        for(let i=1; i<results.length; i++){
                            if(submission.comment_peer[submission.comment_peer.length-1] != results[i].comment_peer)
                                submission.comment_peer.push(results[i].comment_peer);
                        }
                    }
                    resolve(submission);
                }
            }
        );
    });
}

/*  Update submission can be performed in two cases:
        - one of the teacher wants to put a mark and evaluation on the submission
        - loggedUser is actually sending a test exercise (so its own submission)
* */
function updateSubmission(loggedUser, submission) {
    return new Promise(resolve => {
        if(loggedUser == null || loggedUser.id == null)
            resolve(null);
        if(submission.id_user == loggedUser.id){//student who is attending the exam
            if(!utilities.isASubmissionAnswer(submission))//user hasn't sent any answer: no point to procede with the upd
                resolve('400');
            //check if the student can owerwrite its answer (still during the exam & submission is marked as not completed)
            let queryStudent = 'SELECT * ' +
                                'FROM exam E, submission SE ' +
                                'WHERE SE.id = ? AND SE.id_user = ? AND SE.id_exam=E.id AND SE.completed = false ' +
                                'AND CONCAT(CURDATE(), \' \', CURTIME()) < E.deadline ' +
                                'AND CONCAT(CURDATE(), \' \', CURTIME()) > E.start_time';
            let studentCanAnswer = new Promise( resolveStudent => {
                connection.query(queryStudent, [submission.id, loggedUser.id], function (error, results, fields) {
                    if (error) {
                        throw error;
                        resolveStudent(false);
                    } else {
                        if (results.length > 0) {
                            resolveStudent(true);
                        } else {
                            resolveStudent(false);
                        }
                    }
                });
            });

            studentCanAnswer.then(found => {
                    if(!found)//forbidden
                        resolve('403');
                    else{

                        let queryEvalUpd = 'UPDATE submission SET answer = ?, completed = ?, earned_points = NULL, comment = NULL WHERE id = ?';
                        connection.query(queryEvalUpd, [submission.answer, submission.completed, submission.id], function (error, results, fields) {
                            if (error) {
                                throw error;
                                resolve(null);
                            } else {
                                if(results.affectedRows > 0)//successfull update
                                    getSubmission(loggedUser, submission.id).then(updSubm => {
                                        resolve(updSubm)
                                    });//return the updated object
                                else
                                    resolve(null);
                            }
                        });
                    }
            });
        }else{//user is not the student is supposed to take the exam, so check if loggedUser is one of the teacher

            if(!utilities.isASubmissionEvaluated(submission))//comment & eval (earned_points) has to be set
                resolve('400');

            //see if the logged user is the teacher and if the exam is not finished give him permission to load eval & comment
            let findTeacher = new Promise( resolveTeach => {
                let queryTeacher = 'SELECT TE.id_teacher ' +
                                    'FROM exam E, teacher_exam TE, submission SE ' +
                                    'WHERE SE.id = ? AND TE.id_teacher = ? AND SE.id_exam=E.id ' +
                                    'AND E.id=TE.id_exam AND CONCAT(CURDATE(), \' \', CURTIME()) > E.deadline';
                connection.query(queryTeacher, [submission.id, loggedUser.id], function (error, results, fields) {
                    if (error) {
                        throw error;
                        resolveTeach(false);
                    } else {
                        if (results.length > 0) {
                            resolveTeach(true);
                        } else {
                            resolveTeach(false);
                        }
                    }
                });
            });

            findTeacher.then(found => {
                    if(!found)//unauthorized
                        resolve('403');
                    else{
                        //obviously now the submission has to be marked as completed (just to be sure we checked it, although at this point it should have been already done)
                        let queryEvalUpd = 'UPDATE submission SET earned_points = ?, comment = ?, completed = true WHERE id = ?';
                        connection.query(queryEvalUpd, [submission.earned_points, submission.comment, submission.id], function (error, results, fields) {
                            if (error) {
                                throw error;
                                resolve(null);
                            } else {
                                if(results.affectedRows > 0)//successfull update
                                    getSubmission(loggedUser, submission.id).then(updSubm => resolve(updSubm));//return the updated object
                                else
                                    resolve(null);
                            }
                        });
                    }
            });
        }
    });
}

/*  This functions helps the examDao module to create "empty" (unanswered, uncommented & not evaluated) submissions object
    in order to insert them in db & return them to examDao module
* */
function insertInExam(loggedUser, userSubmissions){
    return new Promise(resolve => {
        if(userSubmissions == null)
            resolve(null);

        let allStudentsSubs = [];
        let retSubmissions = [];
        for(let userSubm of userSubmissions){//for each user
            for(let subm of userSubmissions.submissions){//for each submission given to a specific user
                let submissionPromise = insertSubmission(loggedUser, subm);//insert the submission in db
                allStudentsSubs.push(submissionPromise);

                submissionPromise.then( sub => retSubmissions.push(sub));
            }
        }
        Promise.all(allStudentsSubs).then(b => {
            resolve(retSubmissions);//return all the inserted submission (for the entire exam)
        });
    });
}

/*  Function designed to break down the logic above & insert a single (not answered, not commented & not evaluated) submission in the db
* */
function insertSubmission(loggedUser, submission){
    return new Promise(resolve => {
        if(submission == null)
            resolve(null);

        let queryInsert = 'INSERT INTO submission (id_task, id_user, id_exam, completed, earned_points) VALUES (?,?,?,false,0)';
        connection.query(queryInsert, [submission.id_task, submission.id_user, submission.id_exam], function (error, results, fields) {
            if (error) {
                throw error;
                resolve(null);
            } else {
                submission.id = results.insertId;
                getSubmission(loggedUser, submission.id).then(newSubm => resolve(newSubm));//return newly inserted submission
            }
        });
    });
}

/*  This functions helps the examDao module to delete all the submissions object
    related to a specific exam
* */
function cleanExamSubmissions(loggedUser, exam){
    return new Promise(resolve => {
        if(exam == null || exam.id == null)
            resolve(null);

        let queryDelete = 'DELETE FROM submission WHERE id_exam = ?';
        connection.query(queryDelete, [exam.id], function (error, results, fields) {
            if (error) {
                throw error;
                resolve(null);
            } else {
                resolve(true);
            }
        });
    });
}

module.exports = {getAllSubmissions, getSubmission, updateSubmission, insertInExam, cleanExamSubmissions};
