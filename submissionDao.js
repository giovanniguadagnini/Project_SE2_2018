const utilities = require('./utilities');
const connection = utilities.connection;



/*  Fetching all the submissions that the loggedUser has the right to see,
    so they have to be either its own submissions or the submissions that have been part
    of an exam he/she was teacher of
* */
function getAllSubmissions(loggedUser) {
    return new Promise(resolve => {
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
    return submission;
}

module.exports = {getAllSubmissions, getSubmission, updateSubmission};