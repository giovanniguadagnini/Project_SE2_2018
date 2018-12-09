const utilities = require('./utilities');
let bornTemp = {
    year: 1997,
    month: 10,
    day: 17,
    hour: 0,
    minute: 0,
    second: 0
};
let enrolledTemp = {
    year: 2016,
    month: 9,
    day: 5,
    hour: 20,
    minute: 20,
    second: 20
};
let newUser = {
    id: '110228',
    name: 'Johnny',
    surname: 'Guadagnini',
    born: bornTemp,
    enrolled: enrolledTemp,
    submissions: [],
    exam_eval: []
};
let enrolledTemp2 = {
    year: 2017,
    month: 10,
    day: 6,
    hour: 21,
    minute: 21,
    second: 21
};
let newUser2 = {
    id: '110229',
    name: 'Danis',
    surname: 'Ceballos',
    born: bornTemp,
    enrolled: enrolledTemp2,
    submissions: [],
    exam_eval: []
};
let newUserGroup = {
    id: 6,
    creator: newUser,
    name: 'SEII Dummy Class',
    users: [newUser2]
};

let newTask = {
    id: '269',
    owner: newUser,
    task_type: 'open',
    question: {
        text: 'testCreateTask0',
        possibilities: [],
        base_upload_url: 'http://uploadhere.com/dummy/v1/'
    },
    points: '1'
};

test('utilities module should be defined', () => {
    expect(utilities).toBeDefined();
});

test('check isATask() with valid task', () => {
    expect(utilities.isATask(newTask)).toEqual(true);
});
test('check isATask() with valid task', () => {
    newTask.task_type = 'submit';
    expect(utilities.isATask(newTask)).toEqual(true);
});
test('check isATask() with valid task', () => {
    newTask.task_type = 'single_c';
    newTask.question.possibilities = ['0', '1'];
    expect(utilities.isATask(newTask)).toEqual(true);
});
test('check isATask() with invalid task question', () => {
    newTask.question.possibilities = [];
    expect(utilities.isATask(newTask)).toEqual(false);
});
test('check isATask() with invalid task field', () => {
    newTask.points = null;
    expect(utilities.isATask(newTask)).toEqual(false);
});
test('check isATask() with invalid task field', () => {
    newTask.points = null;
    newTask.owner = {id:111111};
    expect(utilities.isATask(newTask)).toEqual(false);
});
test('check isATask() with null task field', () => {
    expect(utilities.isATask(null)).toEqual(false);
});
test('check isATask() with null task field', () => {
    expect(utilities.isATaskBody(null)).toEqual(false);
});

test('check isAnArrayOfUser() with valid users', () => {
    expect(utilities.isAnArrayOfUser([newUser])).toEqual(true);
});

test('check isAnArrayOfUser() with invalid users', () => {
    expect(utilities.isAnArrayOfUser([{id:111111}])).toEqual(false);
});

test('check isAnArrayOfUser() with empty array', () => {
    expect(utilities.isAnArrayOfUser([])).toEqual(false);
});

test('check isAnArrayOfUser() with null array', () => {
    expect(utilities.isAnArrayOfUser(null)).toEqual(false);
});

test('check isAUserGroupBody() with valid userGroups', () => {
    expect(utilities.isAUserGroupBody(newUserGroup)).toEqual(true);
});

test('check isAUserGroupBody() with invalid userGroups', () => {
    expect(utilities.isAUserGroupBody({id:111111})).toEqual(false);
});

test('check isAUserGroupBody() with null as userGroups', () => {
    expect(utilities.isAUserGroupBody(null)).toEqual(false);
});

test('check isAnArrayOfUserGroups() with valid users', () => {
    expect(utilities.isAnArrayOfUserGroups([newUserGroup])).toEqual(true);
});

test('check isAnArrayOfUserGroups() with invalid users', () => {
    expect(utilities.isAnArrayOfUserGroups([{id:111111}])).toEqual(false);
});

test('check isAnArrayOfUserGroups() with empty array', () => {
    expect(utilities.isAnArrayOfUserGroups([])).toEqual(false);
});

test('check isAnArrayOfUserGroups() with null array', () => {
    expect(utilities.isAnArrayOfUserGroups(null)).toEqual(false);
});

test('check isAValidDate() with correct data', () => {
    expect(utilities.isAValidDate(bornTemp)).toEqual(true);
});

test('check isAValidDate() with invalid data', () => {
    let invalidBornTemp = bornTemp;
    invalidBornTemp.day = null;
    expect(utilities.isAValidDate(invalidBornTemp)).toEqual(false);
});

test('check isAValidDate() with null data', () => {
    expect(utilities.isAValidDate(null)).toEqual(false);
});

test('check convertMonth() with Jan', () => {
    expect(utilities.convertMonth('Jan')).toEqual(1);
});

test('check convertMonth() with Fev', () => {
    expect(utilities.convertMonth('Feb')).toEqual(2);
});

test('check convertMonth() with Mar', () => {
    expect(utilities.convertMonth('Mar')).toEqual(3);
});

test('check convertMonth() with Apr', () => {
    expect(utilities.convertMonth('Apr')).toEqual(4);
});

test('check convertMonth() with May', () => {
    expect(utilities.convertMonth('May')).toEqual(5);
});

test('check convertMonth() with Jun', () => {
    expect(utilities.convertMonth('Jun')).toEqual(6);
});

test('check convertMonth() with Jul', () => {
    expect(utilities.convertMonth('Jul')).toEqual(7);
});

test('check convertMonth() with Aug', () => {
    expect(utilities.convertMonth('Aug')).toEqual(8);
});

test('check convertMonth() with Sep', () => {
    expect(utilities.convertMonth('Sep')).toEqual(9);
});

test('check convertMonth() with Oct', () => {
    expect(utilities.convertMonth('Oct')).toEqual(10);
});

test('check convertMonth() with Nov', () => {
    expect(utilities.convertMonth('Nov')).toEqual(11);
});

test('check convertMonth() with Dic', () => {
    expect(utilities.convertMonth('Dic')).toEqual(12);
});

test('check convertMonth() with invalid month', () => {
    expect(utilities.convertMonth('hello')).toEqual(0);
});

test('check convertMonth() with number', () => {
    expect(utilities.convertMonth(11)).toEqual(0);
});

test('check convertMonth() with null data', () => {
    expect(utilities.convertMonth(null)).toEqual(0);
});

test('check compareAlfa() with null data', () => {
    expect(utilities.compareAlfa(null, null)).toEqual(0);
});

test('check compareAlfa() with only one null parameter(1)', () => {
    expect(utilities.compareAlfa(null, newUser2)).toEqual(0);
});

test('check compareAlfa() with only one null parameter(2)', () => {
    expect(utilities.compareAlfa(newUser, null)).toEqual(0);
});

test('check compareAlfa() with valid parameter', () => {
    expect(utilities.compareAlfa(newUser, newUser2)).toEqual(1);
});

test('check compareAlfa() with valid parameter inverted', () => {
    expect(utilities.compareAlfa(newUser2, newUser)).toEqual(-1);
});

test('check compareAlfa() with parameter with null surname', () => {
    let userA = jsonCopy(newUser);
    userA.surname = null;
    let userB = jsonCopy(newUser2);
    userB.surname = null;
    expect(utilities.compareAlfa(userA, userB)).toEqual(0);
});

test('check compareAlfa() with parameter with only one user null surname(1)', () => {
    let userA = jsonCopy(newUser);
    userA.surname = null;
    let userB = jsonCopy(newUser2);
    expect(utilities.compareAlfa(userA, userB)).toEqual(1);
});

test('check compareAlfa() with parameter with only one user null surname(2)', () => {
    let userA = jsonCopy(newUser);
    let userB = jsonCopy(newUser2);
    userB.surname = null;
    expect(utilities.compareAlfa(userA, userB)).toEqual(-1);
});

test('check compareAlfa() with parameter with equal surname(1)', () => {
    let userA = jsonCopy(newUser);
    userA.surname = 'test';
    let userB = jsonCopy(newUser2);
    userB.surname = 'test';
    expect(utilities.compareAlfa(userA, userB)).toEqual(1);
});

test('check compareAlfa() with parameter with equal surname(2)', () => {
    let userA = jsonCopy(newUser);
    userA.surname = 'test';
    let userB = jsonCopy(newUser2);
    userB.surname = 'test';
    expect(utilities.compareAlfa(userB, userA)).toEqual(-1);
});

test('check compareAlfa() with parameter with equal surname and null name', () => {
    let userA = jsonCopy(newUser);
    userA.surname = 'test';
    userA.name = null;
    let userB = jsonCopy(newUser2);
    userB.surname = 'test';
    userB.name = null;
    expect(utilities.compareAlfa(userA, userB)).toEqual(0);
});

test('check compareAlfa() with parameter with equal surname, and only one name as null (1)', () => {
    let userA = jsonCopy(newUser);
    userA.surname = 'test';
    userA.name = null;
    let userB = jsonCopy(newUser2);
    userB.surname = 'test';
    expect(utilities.compareAlfa(userA, userB)).toEqual(1);
});

test('check compareAlfa() with parameter with equal surname, and only one name as null (2)', () => {
    let userA = jsonCopy(newUser);
    userA.surname = 'test';
    let userB = jsonCopy(newUser2);
    userB.surname = 'test';
    userB.name = null;
    expect(utilities.compareAlfa(userA, userB)).toEqual(-1);
});

test('check compareAlfa() with parameter with equal surname and name', () => {
    let userA = jsonCopy(newUser);
    userA.surname = 'test';
    userA.name = 'test';
    let userB = jsonCopy(newUser2);
    userB.surname = 'test';
    userB.name = 'test';
    expect(utilities.compareAlfa(userB, userA)).toEqual(0);
});

test('check compareEnrol() with null data', () => {
    expect(utilities.compareEnrol(null, null)).toEqual(0);
});

test('check compareEnrol() with only one null parameter (1)', () => {
    let userA = jsonCopy(newUser);
    let userB = jsonCopy(newUser2);
    expect(utilities.compareEnrol(null, userB)).toEqual(0);
});

test('check compareEnrol() with only one null parameter (2)', () => {
    let userA = jsonCopy(newUser);
    let userB = jsonCopy(newUser2);
    expect(utilities.compareEnrol(userA, null)).toEqual(0);
});

test('check compareEnrol() with complete data', () => {
    let userA = jsonCopy(newUser);
    let userB = jsonCopy(newUser2);
    expect(utilities.compareEnrol(userA, userB)).toEqual(-1);
});

test('check compareEnrol() with complete data, inverted', () => {
    let userA = jsonCopy(newUser);
    let userB = jsonCopy(newUser2);
    expect(utilities.compareEnrol(userB, userA)).toEqual(1);
});

test('check compareEnrol() with enrolled as null', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled = null;
    let userB = jsonCopy(newUser2);
    userB.enrolled = null;
    expect(utilities.compareEnrol(userA, userB)).toEqual(0);
});

test('check compareEnrol() with only one enrolled as null (1)', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled = null;
    let userB = jsonCopy(newUser2);
    expect(utilities.compareEnrol(userA, userB)).toEqual(1);
});

test('check compareEnrol() with only one enrolled as null (2)', () => {
    let userA = jsonCopy(newUser);
    let userB = jsonCopy(newUser2);
    userB.enrolled = null;
    expect(utilities.compareEnrol(userA, userB)).toEqual(-1);
});

test('check compareEnrol() with year as null', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled.year = null;
    let userB = jsonCopy(newUser2);
    userB.enrolled.year = null;
    expect(utilities.compareEnrol(userA, userB)).toEqual(0);
});


test('check compareEnrol() with only one year as null (1)', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled.year = null;
    let userB = jsonCopy(newUser2);
    expect(utilities.compareEnrol(userA, userB)).toEqual(1);
});

test('check compareEnrol() with only one year as null (2)', () => {
    let userA = jsonCopy(newUser);
    let userB = jsonCopy(newUser2);
    userB.enrolled.year = null;
    expect(utilities.compareEnrol(userA, userB)).toEqual(-1);
});

test('check compareEnrol() with equal year', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled.year = 1;
    let userB = jsonCopy(newUser2);
    userB.enrolled.year = 1;
    expect(utilities.compareEnrol(userA, userB)).toEqual(-1);
});

test('check compareEnrol() with equal year, inverted', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled.year = 1;
    let userB = jsonCopy(newUser2);
    userB.enrolled.year = 1;
    expect(utilities.compareEnrol(userB, userA)).toEqual(1);
});

test('check compareEnrol() with equal year and month as null', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled.year = 1;
    userA.enrolled.month = null;
    let userB = jsonCopy(newUser2);
    userB.enrolled.year = 1;
    userB.enrolled.month = null;
    expect(utilities.compareEnrol(userA, userB)).toEqual(0);
});

test('check compareEnrol() with equal year, with one only month as null (1)', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled.year = 1;
    userA.enrolled.month = null;
    let userB = jsonCopy(newUser2);
    userB.enrolled.year = 1;
    expect(utilities.compareEnrol(userA, userB)).toEqual(1);
});

test('check compareEnrol() with equal year, with one only month as null (2)', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled.year = 1;
    let userB = jsonCopy(newUser2);
    userB.enrolled.year = 1;
    userB.enrolled.month = null;
    expect(utilities.compareEnrol(userA, userB)).toEqual(-1);
});

test('check compareEnrol() with equal year and month', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled.year = 1;
    userA.enrolled.month = 1;
    let userB = jsonCopy(newUser2);
    userB.enrolled.year = 1;
    userB.enrolled.month = 1;
    expect(utilities.compareEnrol(userA, userB)).toEqual(-1);
});

test('check compareEnrol() with equal year and month, inverted', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled.year = 1;
    userA.enrolled.month = 1;
    let userB = jsonCopy(newUser2);
    userB.enrolled.year = 1;
    userB.enrolled.month = 1;
    expect(utilities.compareEnrol(userB, userA)).toEqual(1);
});

test('check compareEnrol() with equal year, month and day as null', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled.year = 1;
    userA.enrolled.month = 1;
    userA.enrolled.day = null;
    let userB = jsonCopy(newUser2);
    userB.enrolled.year = 1;
    userB.enrolled.month = 1;
    userB.enrolled.day = null;
    expect(utilities.compareEnrol(userA, userB)).toEqual(0);
});

test('check compareEnrol() with equal year and month, with one only day as null (1)', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled.year = 1;
    userA.enrolled.month = 1;
    userA.enrolled.day = null;
    let userB = jsonCopy(newUser2);
    userB.enrolled.year = 1;
    userB.enrolled.month = 1;
    expect(utilities.compareEnrol(userA, userB)).toEqual(1);
});

test('check compareEnrol() with equal year and month, with one only day as null (2)', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled.year = 1;
    userA.enrolled.month = 1;
    let userB = jsonCopy(newUser2);
    userB.enrolled.year = 1;
    userB.enrolled.month = 1;
    userB.enrolled.day = null;
    expect(utilities.compareEnrol(userA, userB)).toEqual(-1);
});

test('check compareEnrol() with equal year, month and day', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled.year = 1;
    userA.enrolled.month = 1;
    userA.enrolled.day = 1;
    let userB = jsonCopy(newUser2);
    userB.enrolled.year = 1;
    userB.enrolled.month = 1;
    userB.enrolled.day = 1;
    expect(utilities.compareEnrol(userA, userB)).toEqual(-1);
});

test('check compareEnrol() with equal year, month and day, inverted', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled.year = 1;
    userA.enrolled.month = 1;
    userA.enrolled.day = 1;
    let userB = jsonCopy(newUser2);
    userB.enrolled.year = 1;
    userB.enrolled.month = 1;
    userB.enrolled.day = 1;
    expect(utilities.compareEnrol(userB, userA)).toEqual(1);
});

test('check compareEnrol() with equal year, month, day and hour as null', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled.year = 1;
    userA.enrolled.month = 1;
    userA.enrolled.day = 1;
    userA.enrolled.hour = null;
    let userB = jsonCopy(newUser2);
    userB.enrolled.year = 1;
    userB.enrolled.month = 1;
    userB.enrolled.day = 1;
    userB.enrolled.hour = null;
    expect(utilities.compareEnrol(userA, userB)).toEqual(0);
});

test('check compareEnrol() with equal year, month and day, with one only hour as null (1)', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled.year = 1;
    userA.enrolled.month = 1;
    userA.enrolled.day = 1;
    userA.enrolled.hour = null;
    let userB = jsonCopy(newUser2);
    userB.enrolled.year = 1;
    userB.enrolled.month = 1;
    userB.enrolled.day = 1;
    expect(utilities.compareEnrol(userA, userB)).toEqual(1);
});

test('check compareEnrol() with equal year, month and day, with one only hour as null (2)', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled.year = 1;
    userA.enrolled.month = 1;
    userA.enrolled.day = 1;
    let userB = jsonCopy(newUser2);
    userB.enrolled.year = 1;
    userB.enrolled.month = 1;
    userB.enrolled.day = 1;
    userB.enrolled.hour = null;
    expect(utilities.compareEnrol(userA, userB)).toEqual(-1);
});

test('check compareEnrol() with equal year, month, day and hour', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled.year = 1;
    userA.enrolled.month = 1;
    userA.enrolled.day = 1;
    userA.enrolled.hour = 1;
    let userB = jsonCopy(newUser2);
    userB.enrolled.year = 1;
    userB.enrolled.month = 1;
    userB.enrolled.day = 1;
    userB.enrolled.hour = 1;
    expect(utilities.compareEnrol(userA, userB)).toEqual(-1);
});

test('check compareEnrol() with equal year, month, day and hour, inverted', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled.year = 1;
    userA.enrolled.month = 1;
    userA.enrolled.day = 1;
    userA.enrolled.hour = 1;
    let userB = jsonCopy(newUser2);
    userB.enrolled.year = 1;
    userB.enrolled.month = 1;
    userB.enrolled.day = 1;
    userB.enrolled.hour = 1;
    expect(utilities.compareEnrol(userB, userA)).toEqual(1);
});

test('check compareEnrol() with equal year, month, day, hour and minute as null', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled.year = 1;
    userA.enrolled.month = 1;
    userA.enrolled.day = 1;
    userA.enrolled.hour = 1;
    userA.enrolled.minute = null;
    let userB = jsonCopy(newUser2);
    userB.enrolled.year = 1;
    userB.enrolled.month = 1;
    userB.enrolled.day = 1;
    userB.enrolled.hour = 1;
    userB.enrolled.minute = null;
    expect(utilities.compareEnrol(userA, userB)).toEqual(0);
});

test('check compareEnrol() with equal year, month, day and hour, with one only minute as null (1)', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled.year = 1;
    userA.enrolled.month = 1;
    userA.enrolled.day = 1;
    userA.enrolled.hour = 1;
    userA.enrolled.minute = null;
    let userB = jsonCopy(newUser2);
    userB.enrolled.year = 1;
    userB.enrolled.month = 1;
    userB.enrolled.day = 1;
    userB.enrolled.hour = 1;
    expect(utilities.compareEnrol(userA, userB)).toEqual(1);
});

test('check compareEnrol() with equal year, month, day and hour, with one only minute as null (2)', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled.year = 1;
    userA.enrolled.month = 1;
    userA.enrolled.day = 1;
    userA.enrolled.hour = 1;
    let userB = jsonCopy(newUser2);
    userB.enrolled.year = 1;
    userB.enrolled.month = 1;
    userB.enrolled.day = 1;
    userB.enrolled.hour = 1;
    userB.enrolled.minute = null;
    expect(utilities.compareEnrol(userA, userB)).toEqual(-1);
});

test('check compareEnrol() with equal year, month, day, hour and minute', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled.year = 1;
    userA.enrolled.month = 1;
    userA.enrolled.day = 1;
    userA.enrolled.hour = 1;
    userA.enrolled.minute = 1;
    let userB = jsonCopy(newUser2);
    userB.enrolled.year = 1;
    userB.enrolled.month = 1;
    userB.enrolled.day = 1;
    userB.enrolled.hour = 1;
    userB.enrolled.minute = 1;
    expect(utilities.compareEnrol(userA, userB)).toEqual(-1);
});

test('check compareEnrol() with equal year, month, day and hour, inverted', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled.year = 1;
    userA.enrolled.month = 1;
    userA.enrolled.day = 1;
    userA.enrolled.hour = 1;
    userA.enrolled.minute = 1;
    let userB = jsonCopy(newUser2);
    userB.enrolled.year = 1;
    userB.enrolled.month = 1;
    userB.enrolled.day = 1;
    userB.enrolled.hour = 1;
    userB.enrolled.minute = 1;
    expect(utilities.compareEnrol(userB, userA)).toEqual(1);
});

test('check compareEnrol() with equal year, month, day, hour, minute and second as null', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled.year = 1;
    userA.enrolled.month = 1;
    userA.enrolled.day = 1;
    userA.enrolled.hour = 1;
    userA.enrolled.minute = 1;
    userA.enrolled.second = null;
    let userB = jsonCopy(newUser2);
    userB.enrolled.year = 1;
    userB.enrolled.month = 1;
    userB.enrolled.day = 1;
    userB.enrolled.hour = 1;
    userB.enrolled.minute = 1;
    userB.enrolled.second = null;
    expect(utilities.compareEnrol(userA, userB)).toEqual(0);
});

test('check compareEnrol() with equal year, month, day, hour, minute and with one only second as null (1)', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled.year = 1;
    userA.enrolled.month = 1;
    userA.enrolled.day = 1;
    userA.enrolled.hour = 1;
    userA.enrolled.minute = 1;
    userA.enrolled.second = null;
    let userB = jsonCopy(newUser2);
    userB.enrolled.year = 1;
    userB.enrolled.month = 1;
    userB.enrolled.day = 1;
    userB.enrolled.hour = 1;
    userB.enrolled.minute = 1;
    expect(utilities.compareEnrol(userA, userB)).toEqual(1);
});

test('check compareEnrol() with equal year, month, day, hour, minute and with one only second as null (2)', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled.year = 1;
    userA.enrolled.month = 1;
    userA.enrolled.day = 1;
    userA.enrolled.hour = 1;
    userA.enrolled.minute = 1;
    let userB = jsonCopy(newUser2);
    userB.enrolled.year = 1;
    userB.enrolled.month = 1;
    userB.enrolled.day = 1;
    userB.enrolled.hour = 1;
    userB.enrolled.minute = 1;
    userB.enrolled.second = null;
    expect(utilities.compareEnrol(userA, userB)).toEqual(-1);
});

test('check compareEnrol() with equal year, month, day, hour, minute and second', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled.year = 1;
    userA.enrolled.month = 1;
    userA.enrolled.day = 1;
    userA.enrolled.hour = 1;
    userA.enrolled.minute = 1;
    userA.enrolled.second = 1;
    let userB = jsonCopy(newUser2);
    userB.enrolled.year = 1;
    userB.enrolled.month = 1;
    userB.enrolled.day = 1;
    userB.enrolled.hour = 1;
    userB.enrolled.minute = 1;
    userB.enrolled.second = 1;
    expect(utilities.compareEnrol(userA, userB)).toEqual(0);
});

test('check compareEnrol() with equal year, month, day, hour, minute and second ,inverted', () => {
    let userA = jsonCopy(newUser);
    userA.enrolled.year = 1;
    userA.enrolled.month = 1;
    userA.enrolled.day = 1;
    userA.enrolled.hour = 1;
    userA.enrolled.minute = 1;
    userA.enrolled.second = 1;
    let userB = jsonCopy(newUser2);
    userB.enrolled.year = 1;
    userB.enrolled.month = 1;
    userB.enrolled.day = 1;
    userB.enrolled.hour = 1;
    userB.enrolled.minute = 1;
    userB.enrolled.second = 1;
    expect(utilities.compareEnrol(userB, userA)).toEqual(0);
});

function jsonCopy(src) {
    return JSON.parse(JSON.stringify(src));
}
