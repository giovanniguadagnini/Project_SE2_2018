//DUMMY OBJECTS FILE TO POPULATE AND UN-POPULATE DB
//USED FOR TESTING
//SUGGEST YOU TO CREATE USER AND ID < 100, SO IT'LL BE MUCH EASIER TO CLEAN IT UP AT THE END

let mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7267085',
    password: 'IlVZ5TF9HT',
    database: 'sql7267085'
});

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

let dummyTeacher = {
    id: '11',
    name: 'Jimmy',
    surname: 'Teacher',
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
    id: 0,
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
        possibilities: [
            {value: "0"},
            {value: "1"},
            {value: "2"},
            {value: "Infinite"}
        ],
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
    answer: "25 I think",
    id_user: 12,
    id_exam: 1,
    completed: true,
    comment_peer: [
        "You did a great job dude",
        "You better go study philosophy",
        "Hi! My name's Peter"
    ],
    comment: "Almost... that's a shame: you were so close to the solution!",
    points: 2,
    earned_points: 0
};

let dummySubmission2 = {
    id: 2,
    task_type: "single_c",
    question: {
        text: "What do you get if you perform 1 + 1 ?\nSelect the right answer",
        possibilities: [
            {value: "0"},
            {value: "1"},
            {value: "2"},
            {value: "Infinite"}
        ],
        base_upload_url: "http://uploadhere.com/dummy/v1/"
    },
    answer: "0",
    id_user: 12,
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
    id_user: 12,
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
    teachers: [dummyTeacher],
    students: dummyUserGroup,
    tasks: [dummyTask1, dummyTask2, dummyTask3],
    submissions: [dummySubmission1, dummySubmission2, dummySubmission3],
    deadline: 7200,
    reviewable: true,
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
                    connection.end();
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
                    connection.end();
                    throw error;
                }
                resolve(null);
            }
        );
    });
}

function inserUserGroup() {
    return new Promise( resolve => {
        connection.query('INSERT INTO user_group (creator, name) VALUES (?,?)',
            [dummyUserGroup.creator.id, dummyUserGroup.name],
            function (error, results, fields) {
                if (error) {
                    connection.end();
                    throw error;
                }
                dummyUserGroup.id = results.insertId;
                resolve(null);
            }
        );
    });

}

function inserUserGroupMembers() {
    return new Promise( resolve => {
        connection.query('INSERT INTO user_group_members (id_user, id_group) VALUES (?,?)',
            [dummyStud.id, dummyUserGroup.id],
            function (error, results, fields) {
                if (error) {
                    connection.end();
                    throw error;
                }
            }
        );
    });

}

function insertExams() {
    return new Promise( resolve => {
        connection.query('INSERT INTO exam (owner, name, deadline, reviewable, num_shuffle) VALUES (?,?,?,?,?)',
            [dummyExam.owner.id, dummyExam.name, dummyExam.deadline, dummyExam.reviewable, dummyExam.num_shuffle],
            function (error, results, fields) {
                if (error) {
                    connection.end();
                    throw error;
                }
                dummyExam.id = results.insertId;
                resolve(null);
            }
        );
    });


}

function insertUserExam() {
    connection.query('INSERT INTO user_exam (id_exam, id_user, teacher) VALUES (?,?,?)',
        [dummyExam.id, dummyExam.teachers[0].id, true],
        function (error, results, fields) {
            if (error) {
                connection.end();
                throw error;
            }
        }
    );

    connection.query('INSERT INTO user_exam (id_exam, id_user, teacher) VALUES (?,?,?)',
        [dummyExam.id, dummyExam.students.users[0].id, false],
        function (error, results, fields) {
            if (error) {
                connection.end();
                throw error;
            }
        }
    );
}

function insertTasks(){
    return new Promise( resolve => {
        task1().then( resolve1 => {
            task2().then( resolve2 => {
                task3().then( resolve3 => {
                    resolve(null);
                });
            });
        });
    });
}

function task1(){
    return new Promise(resolve => {
        connection.query('INSERT INTO task (id_exam, owner, task_type, q_text, q_url, points) VALUES (?,?,?,?,?,?)',
            [dummyExam.id, dummyTask1.owner.id, dummyTask1.task_type, dummyTask1.question.text, dummyTask1.question.base_upload_url, dummyTask1.points],
            function (error, results, fields) {
                if (error){
                    connection.end();
                    throw error;
                }
                dummyTask1.id = results.insertId;
                resolve(null);
            }
        );
    });
}

function task2(){
    return new Promise(resolve => {
        connection.query('INSERT INTO task (id_exam, owner, task_type, q_text, q_url, points) VALUES (?,?,?,?,?,?)',
            [dummyExam.id, dummyTask2.owner.id, dummyTask2.task_type, dummyTask2.question.text, dummyTask2.question.base_upload_url, dummyTask2.points],
            function (error, results, fields) {
                if (error){
                    connection.end();
                    throw error;
                }
                dummyTask2.id = results.insertId;
                resolve(null);
            }
        );
    });
}

function task3(){
    return new Promise(resolve => {
        connection.query('INSERT INTO task (id, id_exam, owner, task_type, q_text, q_url, points) VALUES (?,?,?,?,?,?,?)',
            [dummyTask3.id, dummyExam.id, dummyTask3.owner.id, dummyTask3.task_type, dummyTask3.question.text, dummyTask3.question.base_upload_url, dummyTask3.points],
            function (error, results, fields) {
                if (error){
                    connection.end();
                    throw error;
                }
                dummyTask3.id = results.insertId;
                resolve(null);
            }
        );
    });
}

function insertTaskPoss(){
    connection.query('INSERT INTO task_possibility (id_task, id_poss, q_possibility) VALUES (?,?,?)',
        [dummyTask2.id, 0, dummyTask2.question.possibilities[0].value],
        function (error, results, fields) {
            if (error){
                connection.end();
                throw error;
            }
        }
    );

    connection.query('INSERT INTO task_possibility (id_task, id_poss, q_possibility) VALUES (?,?,?)',
        [dummyTask2.id, 1, dummyTask2.question.possibilities[1].value],
        function (error, results, fields) {
            if (error){
                connection.end();
                throw error;
            }
        }
    );

    connection.query('INSERT INTO task_possibility (id_task, id_poss, q_possibility) VALUES (?,?,?)',
        [dummyTask2.id, 2, dummyTask2.question.possibilities[2].value],
        function (error, results, fields) {
            if (error){
                connection.end();
                throw error;
            }
        }
    );

    connection.query('INSERT INTO task_possibility (id_task, id_poss, q_possibility) VALUES (?,?,?)',
        [dummyTask2.id, 3, dummyTask2.question.possibilities[3].value],
        function (error, results, fields) {
            if (error){
                connection.end();
                throw error;
            }
        }
    );
}

function insertSubmissions(){
    return new Promise( resolve => {
        connection.query('INSERT INTO submission (id_task, id_user, id_exam, answer, completed, comment, earned_points) VALUES (?,?,?,?,?,?,?)',
            [dummyTask1.id, dummySubmission1.id_user, dummyExam.id, dummySubmission1.answer, dummySubmission1.completed, dummySubmission1.comment, dummySubmission1.earned_points],
            function (error, results, fields) {
                if (error){
                    connection.end();
                    throw error;
                }
                dummySubmission1.id = results.insertId;

                resolve(null);
            }
        );

        connection.query('INSERT INTO submission (id_task, id_user, id_exam, answer, completed, comment, earned_points) VALUES (?,?,?,?,?,?,?)',
            [dummyTask2.id, dummySubmission2.id_user, dummyExam.id, dummySubmission2.answer, dummySubmission2.completed, dummySubmission2.comment, dummySubmission2.earned_points],
            function (error, results, fields) {
                if (error){
                    connection.end();
                    throw error;
                }
                dummySubmission2.id = results.insertId;
            }
        );

        connection.query('INSERT INTO submission (id_task, id_user, id_exam, answer, completed, comment, earned_points) VALUES (?,?,?,?,?,?,?)',
            [dummyTask3.id, dummySubmission3.id_user, dummyExam.id, dummySubmission3.answer, dummySubmission3.completed, dummySubmission3.comment, dummySubmission3.earned_points],
            function (error, results, fields) {
                if (error){
                    connection.end();
                    throw error;
                }
                dummySubmission3.id = results.insertId;
            }
        );
    });
}

function insertPeerComments(){
    connection.query('INSERT INTO comment_peer (id_submission, id_comment, comment) VALUES (?,?,?)',
        [dummySubmission1.id, 0, dummySubmission1.comment_peer[0]],
        function (error, results, fields) {
            if (error){
                connection.end();
                throw error;
            }
        }
    );

    connection.query('INSERT INTO comment_peer (id_submission, id_comment, comment) VALUES (?,?,?)',
        [dummySubmission1.id, 1, dummySubmission1.comment_peer[1]],
        function (error, results, fields) {
            if (error){
                connection.end();
                throw error;
            }
        }
    );

    connection.query('INSERT INTO comment_peer (id_submission, id_comment, comment) VALUES (?,?,?)',
        [dummySubmission1.id, 2, dummySubmission1.comment_peer[2]],
        function (error, results, fields) {
            if (error){
                connection.end();
                throw error;
            }
        }
    );
}

function popDB() {
    insertUser().then(() => {
        inserUserGroup().then(() => {
            inserUserGroupMembers();
        });

        insertExams().then( () =>{
           insertUserExam();
           task1().then( () => {
               task2().then( () => {
                   task3().then( () => {
                       insertTaskPoss();
                       insertSubmissions().then( () => {
                           insertPeerComments();
                       });
                   });
               });
            });
        });


    });
}


//popDB();
//cleanDB();

function cleanDB() {
    connection.query('DELETE FROM user WHERE id > 0 AND id < 100',
        function (error, results, fields) {
            if (error) {
                connection.end();
                throw error;
            }
        }
    );

    connection.end();

}

module.exports = {
    dummyStud,
    dummyTeacher,
    dummyUserGroup,
    dummyTask1,
    dummyTask2,
    dummyTask3,
    dummySubmission1,
    dummySubmission2,
    dummySubmission3,
    dummyExam,
    popDB,
    cleanDB
};
