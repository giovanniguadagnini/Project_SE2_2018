//DUMMY OBJECTS FILE TO POPULATE AND UN-POPULATE DB
//USED FOR TESTING
//SUGGEST YOU TO CREATE USER AND ID < 100, SO IT'LL BE MUCH EASIER TO CLEAN IT UP AT THE END
const utilities = require('../src/utilities');
const connection = utilities.connection;

let dummyStud = {
    id: '12',
    name: 'John',
    surname: 'Doe',
    email: 'email@email.com',
    born: {
        year: 1997,
        month: 9,
        day: 2,
        hour: 0,
        minute: 0,
        second: 0
    },
    enrolled: {
        year: 2016,
        month: 9,
        day: 8,
        hour: 19,
        minute: 16,
        second: 25
    },
    exam_eval: [],
    submissions: []
};

let dummyStud2 = {
    id: '13',
    name: 'Johnny',
    surname: 'Doerino',
    email: 'emailpazzesca@emailpazzesca.com',
    born: {
        year: 1998,
        month: 9,
        day: 2,
        hour: 0,
        minute: 0,
        second: 0
    },
    enrolled: {
        year: 2017,
        month: 9,
        day: 8,
        hour: 19,
        minute: 16,
        second: 25
    },
    exam_eval: [],
    submissions: []
};

let dummyTeacher = {
    id: '11',
    name: 'Jimmy',
    surname: 'Teacher',
    password: 'password',
    email: 'dummy@dummy.com',
    born: {
        year: 1967,
        month: 11,
        day: 3,
        hour: 0,
        minute: 0,
        second: 0
    },
    enrolled: {
        year: 2011,
        month: 8,
        day: 31,
        hour: 12,
        minute: 30,
        second: 0
    },
    exam_eval: [],
    submissions: []
};

let dummyTeacher2 = {
    id: '99',
    name: 'Marco',
    surname: 'Boffino',
    password: 'password2',
    email: 'dummy@dummy.com',
    born: {
        year: 1967,
        month: 11,
        day: 3,
        hour: 0,
        minute: 0,
        second: 0
    },
    enrolled: {
        year: 2011,
        month: 8,
        day: 31,
        hour: 12,
        minute: 30,
        second: 0
    },
    exam_eval: [],
    submissions: []
};

let dummyUserGroup = {
    id: 1,
    creator: dummyTeacher,
    name: 'SEII Dummy Class',
    users: [dummyStud]
};

let dummyTask1 = {
    id: 1,
    owner: dummyTeacher,
    task_type: "open",
    question: {
        text: "What do you get if you perform 1 + 1 ? ",
        possibilities: [],
        base_upload_url: "http://uploadhere.com/dummy/v1/"
    },
    points: 2
};

let dummyTask2 = {
    id: 2,
    owner: dummyTeacher,
    task_type: "single_c",
    question: {
        text: "What do you get if you perform 1 + 1 ?\nSelect the right answer",
        possibilities: ["0", "1", "2", "Infinite"],
        base_upload_url: "http://uploadhere.com/dummy/v1/"
    },
    points: 1
};

let dummyTask3 = {
    id: 3,
    owner: dummyTeacher,
    task_type: "submit",
    question: {
        text: "What do you get if you perform 1 + 1 ?\nPut the answer in a file (out.txt) that has to be uploaded",
        possibilities: [],
        base_upload_url: "http://uploadhere.com/dummy/v1/"
    },
    points: 3
};

let dummySubmission1 = {
    id: 1,
    task_type: "open",
    question: {
        text: "What do you get if you perform 1 + 1 ?",
        possibilities: [],
        base_upload_url: "http://uploadhere.com/dummy/v1/"
    },
    answer: null,
    id_user: '12',
    id_exam: 1,
    completed: false,
    comment_peer: [
        "You did a great job dude",
        "You better go study philosophy",
        "Hi! My name's Peter"
    ],
    comment: null,
    points: 2,
    earned_points: null
};

let dummySubmission1Finished = {
    id: 1,
    task_type: "open",
    question: {
        text: "What do you get if you perform 1 + 1 ?",
        possibilities: [],
        base_upload_url: "http://uploadhere.com/dummy/v1/"
    },
    answer: "25 I think",
    id_user: '12',
    id_exam: 1,
    completed: true,
    comment_peer: [
        "You did a great job dude",
        "You better go study philosophy",
        "Hi! My name's Peter"
    ],
    comment: "Almost... that's a shame: you were so close to the solution!",
    points: 2,
    earned_points: 1
};

let dummySubmission2 = {
    id: 2,
    task_type: "single_c",
    question: {
        text: "What do you get if you perform 1 + 1 ?\nSelect the right answer",
        possibilities: ["0", "1", "2", "Infinite"],
        base_upload_url: "http://uploadhere.com/dummy/v1/"
    },
    answer: "0",
    id_user: '12',
    id_exam: 1,
    completed: true,
    comment_peer: [],
    comment: "My name is Bob and I've hacked the professor so I'll put you the best reward even if your answers suck",
    points: 1,
    earned_points: 1
};

let dummySubmission3 = {
    id: 3,
    task_type: "submit",
    question: {
        text: "What do you get if you perform 1 + 1 ?\nPut the answer in a file (out.txt) that has to be uploaded",
        possibilities: [],
        base_upload_url: "http://uploadhere.com/dummy/v1/"
    },
    answer: "http://uploadhere.com/dummy/v1/solutions12_1_3",
    id_user: '12',
    id_exam: 1,
    completed: true,
    comment_peer: [],
    comment: "Hate saying this... but tomorrow I'll resign myself",
    points: 3,
    earned_points: 3
};

let dummyExam = {
    id: 1,
    name: "NP complete problems",
    owner: dummyTeacher,
    teachers: [dummyTeacher, dummyTeacher2],
    students: dummyUserGroup,
    tasks: [dummyTask1, dummyTask2, dummyTask3],
    submissions: [dummySubmission1, dummySubmission2, dummySubmission3],
    start_time: {
        year: 2018,
        month: 12,
        day: 6,
        hour: 6,
        minute: 6,
        second: 30
    },
    deadline: {
        year: 3018,
        month: 12,
        day: 6,
        hour: 6,
        minute: 6,
        second: 30
    },
    reviewable: 'true',
    num_shuffle: 3
};

let dummyExamToInsert = {
    name: "Devis' Problems",
    teachers: [dummyTeacher2],
    students: dummyUserGroup,
    tasks: [dummyTask1, dummyTask2, dummyTask3],
    start_time: {
        year: 2018,
        month: 12,
        day: 6,
        hour: 6,
        minute: 6,
        second: 30
    },
    deadline: {
        year: 3018,
        month: 12,
        day: 6,
        hour: 6,
        minute: 6,
        second: 30
    },
    reviewable: 'true',
    num_shuffle: 3
};

let dummyExamFinished = {
    id: 1,
    name: "NP complete problems",
    owner: dummyTeacher,
    teachers: [dummyTeacher],
    students: dummyUserGroup,
    tasks: [dummyTask1, dummyTask2, dummyTask3],
    submissions: [dummySubmission1, dummySubmission2, dummySubmission3],
    start_time: {
        year: 2018,
        month: 12,
        day: 7,
        hour: 18,
        minute: 0,
        second: 0
    },
    deadline: {
        year: 2018,
        month: 12,
        day: 7,
        hour: 19,
        minute: 0,
        second: 0
    },
    reviewable: 'true',
    num_shuffle: 3
};

function insertUser() {
    return new Promise(resolve => {
        let born = dummyStud.born.year + '-' + dummyStud.born.month + '-' + dummyStud.born.day + ' ' + dummyStud.born.hour + ':' + dummyStud.born.minute + ':' + dummyStud.born.second;
        let enrolled = dummyStud.enrolled.year + '-' + dummyStud.enrolled.month + '-' + dummyStud.enrolled.day + ' ' + dummyStud.enrolled.hour + ':' + dummyStud.enrolled.minute + ':' + dummyStud.enrolled.second;
        connection.query('INSERT INTO user (id, name, surname, email, born, enrolled) VALUES (?,?,?,?,?,?)',
            [dummyStud.id, dummyStud.name, dummyStud.surname, dummyStud.email, born, enrolled],
            function (error, results, fields) {
                if (error) {
                    //connection.end();
                    throw error;
                }
            }
        );

        born = dummyStud2.born.year + '-' + dummyStud2.born.month + '-' + dummyStud2.born.day + ' ' + dummyStud2.born.hour + ':' + dummyStud2.born.minute + ':' + dummyStud2.born.second;
        enrolled = dummyStud2.enrolled.year + '-' + dummyStud2.enrolled.month + '-' + dummyStud2.enrolled.day + ' ' + dummyStud2.enrolled.hour + ':' + dummyStud2.enrolled.minute + ':' + dummyStud2.enrolled.second;
        connection.query('INSERT INTO user (id, name, surname, email, born, enrolled) VALUES (?,?,?,?,?,?)',
            [dummyStud2.id, dummyStud2.name, dummyStud2.surname, dummyStud2.email, born, enrolled],
            function (error, results, fields) {
                if (error) {
                    //connection.end();
                    throw error;
                }
            }
        );

        born = dummyTeacher.born.year + '-' + dummyTeacher.born.month + '-' + dummyTeacher.born.day + ' ' + dummyTeacher.born.hour + ':' + dummyTeacher.born.minute + ':' + dummyTeacher.born.second;
        enrolled = dummyTeacher.enrolled.year + '-' + dummyTeacher.enrolled.month + '-' + dummyTeacher.enrolled.day + ' ' + dummyTeacher.enrolled.hour + ':' + dummyTeacher.enrolled.minute + ':' + dummyTeacher.enrolled.second;
        connection.query('INSERT INTO user (id, name, surname, email, born, enrolled) VALUES (?,?,?,?,?,?)',
            [dummyTeacher.id, dummyTeacher.name, dummyTeacher.surname, dummyTeacher.email, born, enrolled],
            function (error, results, fields) {
                if (error) {
                    //connection.end();
                    throw error;
                }
                resolve(null);
            }
        );

        born = dummyTeacher2.born.year + '-' + dummyTeacher2.born.month + '-' + dummyTeacher2.born.day + ' ' + dummyTeacher2.born.hour + ':' + dummyTeacher2.born.minute + ':' + dummyTeacher2.born.second;
        enrolled = dummyTeacher2.enrolled.year + '-' + dummyTeacher2.enrolled.month + '-' + dummyTeacher2.enrolled.day + ' ' + dummyTeacher2.enrolled.hour + ':' + dummyTeacher2.enrolled.minute + ':' + dummyTeacher2.enrolled.second;
        connection.query('INSERT INTO user (id, name, surname, email, born, enrolled) VALUES (?,?,?,?,?,?)',
            [dummyTeacher2.id, dummyTeacher2.name, dummyTeacher2.surname, dummyTeacher2.email, born, enrolled],
            function (error, results, fields) {
                if (error) {
                    //connection.end();
                    throw error;
                }
                resolve(null);
            }
        );
    });
}

function insertUserGroup() {
    return new Promise(resolve => {
        connection.query('INSERT INTO user_group (id_creator, name) VALUES (?,?)',
            [dummyUserGroup.creator.id, dummyUserGroup.name],
            function (error, results, fields) {
                if (error) {
                    //connection.end();
                    throw error;
                }
                dummyUserGroup.id = results.insertId;
                resolve(null);
            }
        );
    });
}

function insertUserGroupMembers() {
    return new Promise(resolve => {
        connection.query('INSERT INTO user_group_members (id_user, id_group) VALUES (?,?)',
            [dummyStud.id, dummyUserGroup.id],
            function (error, results, fields) {
                if (error) {
                    //connection.end();
                    throw error;
                }
            }
        );
    });
}

function insertExams() {
    return new Promise(resolve => {
       let promiseFirst = new Promise(resolveFirst => {
           let start_time = dummyExam.start_time.year + '-' + dummyExam.start_time.month + '-' + dummyExam.start_time.day + ' ' + dummyExam.start_time.hour + ':' + dummyExam.start_time.minute + ':' + dummyExam.start_time.second;
           let deadline = dummyExam.deadline.year + '-' + dummyExam.deadline.month + '-' + dummyExam.deadline.day + ' ' + dummyExam.deadline.hour + ':' + dummyExam.deadline.minute + ':' + dummyExam.deadline.second;

           connection.query('INSERT INTO exam (id_group, id_owner, name, start_time, deadline, reviewable, num_shuffle) VALUES (?,?,?,?,?,?,?)',
                [dummyExam.students.id, dummyExam.owner.id, dummyExam.name, start_time, deadline, dummyExam.reviewable, dummyExam.num_shuffle],
                function (error, results, fields) {
                    if (error) {
                        //connection.end();
                        throw error;
                    }
                    dummyExam.id = results.insertId;
                    resolveFirst(null);
                }
            );
        });

        promiseFirst.then(() => {
            let start_time = dummyExamFinished.start_time.year + '-' + dummyExamFinished.start_time.month + '-' + dummyExamFinished.start_time.day + ' ' + dummyExamFinished.start_time.hour + ':' + dummyExamFinished.start_time.minute + ':' + dummyExamFinished.start_time.second;
            let deadline = dummyExamFinished.deadline.year + '-' + dummyExamFinished.deadline.month + '-' + dummyExamFinished.deadline.day + ' ' + dummyExamFinished.deadline.hour + ':' + dummyExamFinished.deadline.minute + ':' + dummyExamFinished.deadline.second;
            //console.log('CIAO');
            connection.query('INSERT INTO exam (id_group, id_owner, name, start_time, deadline, reviewable, num_shuffle) VALUES (?,?,?,?,?,?,?)',
                [dummyExamFinished.students.id, dummyExamFinished.owner.id, dummyExamFinished.name, start_time, deadline, dummyExamFinished.reviewable, dummyExamFinished.num_shuffle],
                function (error, results, fields) {
                    if (error) {
                        //connection.end();
                        throw error;
                    }
                    dummyExamFinished.id = results.insertId;
                    resolve(null);
                }
            );
        });
    });

}

function insertTeacherExam() {
    connection.query('INSERT INTO teacher_exam (id_exam, id_teacher) VALUES (?,?)',
        [dummyExam.id, dummyExam.teachers[0].id],
        function (error, results, fields) {
            if (error) {
                //connection.end();
                throw error;
            }
            connection.query('INSERT INTO teacher_exam (id_exam, id_teacher) VALUES (?,?)',
                [dummyExamFinished.id, dummyExam.teachers[0].id],
                function (error, results, fields) {
                    if (error) {
                        //connection.end();
                        throw error;
                    }
                }
            );
            connection.query('INSERT INTO teacher_exam (id_exam, id_teacher) VALUES (?,?)',
                [dummyExam.id, dummyExam.teachers[1].id],
                function (error, results, fields) {
                    if (error) {
                        //connection.end();
                        throw error;
                    }
                }
            );
        }
    );
}

function task1() {
    return new Promise(resolve => {
        connection.query('INSERT INTO task (id_owner, task_type, q_text, q_url, points) VALUES (?,?,?,?,?)',
            [dummyTask1.owner.id, dummyTask1.task_type, dummyTask1.question.text, dummyTask1.question.base_upload_url, dummyTask1.points],
            function (error, results, fields) {
                if (error) {
                    //connection.end();
                    throw error;
                }
                dummyTask1.id = results.insertId;
                connection.query('INSERT INTO exam_task (id_exam, id_task) VALUES (?,?)',
                    [dummyExam.id, dummyTask1.id],
                    function (error, results, fields) {
                        if (error) {
                            //connection.end();
                            throw error;
                        }
                        connection.query('INSERT INTO exam_task (id_exam, id_task) VALUES (?,?)',
                            [dummyExamFinished.id, dummyTask1.id],
                            function (error, results, fields) {
                                if (error) {
                                    //connection.end();
                                    throw error;
                                }
                                resolve(null);
                            }
                        );
                    }
                );
            });
    });
}

function task2() {
    return new Promise(resolve => {
        connection.query('INSERT INTO task (id_owner, task_type, q_text, q_url, points) VALUES (?,?,?,?,?)',
            [dummyTask2.owner.id, dummyTask2.task_type, dummyTask2.question.text, dummyTask2.question.base_upload_url, dummyTask2.points],
            function (error, results, fields) {
                if (error) {
                    //connection.end();
                    throw error;
                }
                dummyTask2.id = results.insertId;
                connection.query('INSERT INTO exam_task (id_exam, id_task) VALUES (?,?)',
                    [dummyExam.id, dummyTask2.id],
                    function (error, results, fields) {
                        if (error) {
                            //connection.end();
                            throw error;
                        }
                        resolve(null);
                    }
                );
            }
        );
    });
}

function task3() {
    return new Promise(resolve => {
        connection.query('INSERT INTO task (id_owner, task_type, q_text, q_url, points) VALUES (?,?,?,?,?)',
            [dummyTask3.owner.id, dummyTask3.task_type, dummyTask3.question.text, dummyTask3.question.base_upload_url, dummyTask3.points],
            function (error, results, fields) {
                if (error) {
                    //connection.end();
                    throw error;
                }
                dummyTask3.id = results.insertId;
                connection.query('INSERT INTO exam_task (id_exam, id_task) VALUES (?,?)',
                    [dummyExam.id, dummyTask3.id],
                    function (error, results, fields) {
                        if (error) {
                            //connection.end();
                            throw error;
                        }
                        resolve(null);
                    }
                );
            }
        );
    });
}

function insertTaskPoss() {
    connection.query('INSERT INTO task_possibility (id_task, id_poss, q_possibility) VALUES (?,?,?)',
        [dummyTask2.id, 0, dummyTask2.question.possibilities[0]],
        function (error, results, fields) {
            if (error) {
                //connection.end();
                throw error;
            }
        }
    );

    connection.query('INSERT INTO task_possibility (id_task, id_poss, q_possibility) VALUES (?,?,?)',
        [dummyTask2.id, 1, dummyTask2.question.possibilities[1]],
        function (error, results, fields) {
            if (error) {
                //connection.end();
                throw error;
            }
        }
    );

    connection.query('INSERT INTO task_possibility (id_task, id_poss, q_possibility) VALUES (?,?,?)',
        [dummyTask2.id, 2, dummyTask2.question.possibilities[2]],
        function (error, results, fields) {
            if (error) {
                //connection.end();
                throw error;
            }
        }
    );

    connection.query('INSERT INTO task_possibility (id_task, id_poss, q_possibility) VALUES (?,?,?)',
        [dummyTask2.id, 3, dummyTask2.question.possibilities[3]],
        function (error, results, fields) {
            if (error) {
                //connection.end();
                throw error;
            }
        }
    );
}

function insertSubmissions() {
    return new Promise(resolve => {
        connection.query('INSERT INTO submission (id_task, id_user, id_exam, answer, completed, comment, earned_points) VALUES (?,?,?,?,?,?,?)',
            [dummyTask1.id, dummySubmission1.id_user, dummyExam.id, dummySubmission1.answer, dummySubmission1.completed, dummySubmission1.comment, dummySubmission1.earned_points],
            function (error, results, fields) {
                if (error) {
                    //connection.end();
                    throw error;
                }
                dummySubmission1.id = results.insertId;
                dummySubmission1.id_exam = dummyExam.id;
                connection.query('INSERT INTO submission (id_task, id_user, id_exam, answer, completed, comment, earned_points) VALUES (?,?,?,?,?,?,?)',
                    [dummyTask1.id, dummySubmission1Finished.id_user, dummyExamFinished.id, dummySubmission1Finished.answer, dummySubmission1Finished.completed, dummySubmission1Finished.comment, dummySubmission1Finished.earned_points],
                    function (error, results, fields) {
                        if (error) {
                            //connection.end();
                            throw error;
                        }
                        dummySubmission1Finished.id = results.insertId;
                        dummySubmission1Finished.id_exam = dummyExamFinished.id;
                        resolve(null);
                    }
                );
            }
        );

        connection.query('INSERT INTO submission (id_task, id_user, id_exam, answer, completed, comment, earned_points) VALUES (?,?,?,?,?,?,?)',
            [dummyTask2.id, dummySubmission2.id_user, dummyExam.id, dummySubmission2.answer, dummySubmission2.completed, dummySubmission2.comment, dummySubmission2.earned_points],
            function (error, results, fields) {
                if (error) {
                    //connection.end();
                    throw error;
                }
                dummySubmission2.id = results.insertId;
                dummySubmission2.id_exam = dummyExam.id;
            }
        );

        connection.query('INSERT INTO submission (id_task, id_user, id_exam, answer, completed, comment, earned_points) VALUES (?,?,?,?,?,?,?)',
            [dummyTask3.id, dummySubmission3.id_user, dummyExam.id, dummySubmission3.answer, dummySubmission3.completed, dummySubmission3.comment, dummySubmission3.earned_points],
            function (error, results, fields) {
                if (error) {
                    //connection.end();
                    throw error;
                }
                dummySubmission3.id = results.insertId;
                dummySubmission3.id_exam = dummyExam.id;
            }
        );
    });
}

function peerComment1() {
    return new Promise(resolve => {
        connection.query('INSERT INTO comment_peer (id_submission, id_comment, comment) VALUES (?,?,?)',
            [dummySubmission1.id, 0, dummySubmission1.comment_peer[0]],
            function (error, results, fields) {
                if (error) {
                    //connection.end();
                    throw error;
                }
                resolve(null);
            }
        );
    });
}

function peerComment2() {
    return new Promise(resolve => {
        connection.query('INSERT INTO comment_peer (id_submission, id_comment, comment) VALUES (?,?,?)',
            [dummySubmission1.id, 1, dummySubmission1.comment_peer[1]],
            function (error, results, fields) {
                if (error) {
                    //connection.end();
                    throw error;
                }
                resolve(null);
            }
        );
    });
}

function peerComment3() {
    return new Promise(resolve => {
        connection.query('INSERT INTO comment_peer (id_submission, id_comment, comment) VALUES (?,?,?)',
            [dummySubmission1.id, 2, dummySubmission1.comment_peer[2]],
            function (error, results, fields) {
                if (error) {
                    //connection.end();
                    throw error;
                }
                resolve(null);
            }
        );
    });
}

function popDB() {
    return new Promise(resolve => {
        insertUser().then(() => {

            insertUserGroup().then(() => {

                insertUserGroupMembers();
                insertExams().then(() => {

                    insertTeacherExam();
                    task1().then(() => {

                        task2().then(() => {

                            task3().then(() => {

                                insertTaskPoss();
                                insertSubmissions().then(() => {
                                    peerComment1().then(() => {
                                        peerComment2().then(() => {
                                            peerComment3().then(() => {
                                                resolve(null);
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

}

function cleanDB() {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM user WHERE id > 0',
            function (error, results, fields) {
                if (error) {
                    //throw error;
                    reject(error);
                }
                resolve(null);
            }
        );
    });

}

//cleanDB();
//popDB();

module.exports = {
    dummyStud,
    dummyStud2,
    dummyTeacher,
    dummyTeacher2,
    dummyUserGroup,
    dummyTask1,
    dummyTask2,
    dummyTask3,
    dummySubmission1,
    dummySubmission2,
    dummySubmission3,
    dummySubmission1Finished,
    dummyExam,
    dummyExamToInsert,
    popDB,
    cleanDB,
    connection
};
