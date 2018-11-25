var dummyStud = {
    id: 12,
    name: 'John',
    surname: 'Doe',
    password: 'hashed',
    email: 'email@email.com',
    born: {
        year: 1997,
        month: 9,
        day: 2,
        hour: 0,
        minute: 0,
        second: 0
    },
    enrolment: {
        year: 2016,
        month: 9,
        day: 8,
        hour: 19,
        minute: 16,
        second: 25
    },
    exam_eval:[
        {
            id_exam: 1,
            mark: 30
        },
        {
            id_exam: 2,
            mark: 26
        },
        {
            id_exam: 3,
            mark: 29
        }
    ],
    submissions:[]
};

var dummyTeacher = {
    id: 11,
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
    enrolment: {
        year: 2011,
        month: 8,
        day: 31,
        hour: 12,
        minute: 30,
        second: 0
    },
    exam_eval:[
    ],
    submissions:[]
};

var dummyUserGroup = {
    id: 0,
    creator: dummyTeacher,
    name: 'SEII Dummy Class',
    users: [dummyStud]
};

var dummyTask1 = {
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

var dummyTask2 = {
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

var dummyTask3 = {
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

var dummySubmission1 = {
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

var dummySubmission2 = {
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
    comment_peer: [
        "I'd go for NaN, but NaN is not a Number & still typeof NaN => number... JS wtf??"
    ],
    comment: "My name is Bob and I've hacked the professor so I'll put you the best reward even if your answers suck",
    points: 1,
    earned_points: 1
};

var dummySubmission3 = {
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
    comment_peer: [
        "Best solution ever... I would not have been able to do better regarding to this particular topic"
    ],
    comment: "Hate saying this... but tomorrow I'll resign myself",
    points: 3,
    earned_points: 3
};

var dummyExam = {
    id: 1,
    name: "NP complete problems",
    owner: dummyTeacher,
    teachers: [dummyTeacher],
    students: [dummyUserGroup],
    tasks: [dummyTask1, dummyTask2, dummyTask3],
    submissions: [dummySubmission1, dummySubmission2, dummySubmission3],
    deadline: 7200,
    reviewable: true,
    num_shuffle: 3
};

function popDB(){

}

module.exports = {
    dummyStud,
    dummyTeacher,
    dummySubmission,
    dummyUserGroup,
    dummyTask1,
    dummyTask2,
    dummyTask3,
    dummySubmission1,
    dummySubmission2,
    dummySubmission3,
    dummyExam,
    popDB
};