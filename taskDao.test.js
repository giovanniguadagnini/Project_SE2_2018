const taskDao = require('./taskDao');
const dummies = require('./dummies');

const invalidId = '999999999999999999999999';
const pureStringId = 'aaaaaaaaaaaaaaaaaaaaaa';

let newTask = {
    id: '1',
    owner: dummies.dummyStud,
    task_type: 'single_c',
    question: {
        text: 'testCreateTask0',
        possibilities: ['0', '1'],
        base_upload_url: 'http://uploadhere.com/dummy/v1/'
    },
    points: '1'
};

beforeAll(() => {
    return dummies.popDB();
});

afterAll(() => {
    return dummies.cleanDB().then(() => dummies.connection.end());
});

test('taskDao module should be defined', () => {
    expect(taskDao).toBeDefined();
});

test('check createTask()', () => {
    expect.assertions(1);
    return taskDao.createTask({ id: dummies.dummyStud.id }, newTask).then(task => {
        newTask.id = task.id;
        expect(task).toEqual(newTask);
    });
});
test('check createTask() with invalidId', () => {
    expect.assertions(1);
    return taskDao.createTask({ id: invalidId }, newTask).then(task => {
        expect(task).toEqual(null);
    });
});
test('check createTask() with an empty field(points)', () => {
    expect.assertions(1);
    return taskDao.createTask({ id: dummies.dummyStud.id }, { 'id': '1', 'owner': dummies.dummyStud, 'task_type': 'open', 'question': { 'text': 'What\'s the meaning of life ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' } }).then(task => {
        expect(task).toEqual(null);
    });
});
test('check createTask() with empty task', () => {
    expect.assertions(1);
    return taskDao.createTask({ id: dummies.dummyStud.id }, null).then(task => {
        expect(task).toEqual(null);
    });
});
test('check createTask() with an invalid question', () => {
    expect.assertions(1);
    return taskDao.createTask({ id: dummies.dummyStud.id }, { 'id': '4', 'owner': dummies.dummyStud, 'task_type': 'single_c', 'question': { 'text': 'What\'s the meaning of life ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' }).then(task => {
        expect(task).toEqual(null);
    });
});
test('check createTask() with an invalid question', () => {
    expect.assertions(1);
    return taskDao.createTask({ id: dummies.dummyStud.id }, { 'id': '4', 'owner': dummies.dummyStud, 'task_type': 'open', 'question': { 'text': 'What\'s the meaning of life ?', 'possibilities': ['0', '1'], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' }).then(task => {
        expect(task).toEqual(null);
    });
});
test('check createTask() with an owner different than loggedUser', () => {
    expect.assertions(1);
    return taskDao.createTask({ id: dummies.dummyTeacher.id }, newTask).then(task => {
        expect(task).toEqual(null);
    });
});

test('check getTasks()', () => {
    expect.assertions(1);
    return taskDao.getTasks({ id: dummies.dummyTeacher.id }).then(tasks => {
        expect(tasks).toBeDefined();
    });
});
test('check getTasks() with null id', () => {
    expect.assertions(1);
    return taskDao.getTasks({ id: null }).then(tasks => {
        expect(tasks).toBeDefined();
    });
});
test('check getTasks() with invalidId', () => {
    expect.assertions(1);
    return taskDao.getTasks({ id: invalidId }).then(tasks => {
        expect(tasks).toEqual([]);
    });
});

test('check getTasksById()', () => {
    expect.assertions(1);
    return taskDao.getTaskById({ id: dummies.dummyStud.id }, newTask.id).then(task => {
        expect(task).toEqual(newTask);
    });
});
test('check getTasksById() without permissions', () => {
    expect.assertions(1);
    return taskDao.getTaskById({ id: dummies.dummyTeacher.id }, newTask.id).then(task => {
        expect(task).toEqual(null);
    });
});
test('check getTasksById() with user invalidId', () => {
    expect.assertions(1);
    return taskDao.getTaskById({ id: invalidId }, newTask.id).then(task => {
        expect(task).toEqual(null);
    });
});
test('check getTasksById() with task invalidId', () => {
    expect.assertions(1);
    return taskDao.getTaskById({ id: invalidId }, { id: dummies.dummyStud.id }, { 'id': invalidId, 'owner': dummies.dummyStud, 'task_type': 'single_c', 'question': { 'text': 'What\'s the meaning of life ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' }).then(task => {
        expect(task).toEqual(null);
    });
});

test('check updateTaskById() with same task', () => {
    expect.assertions(1);
    return taskDao.updateTaskById({ id: dummies.dummyStud.id }, newTask).then(task => {
        expect(task).toEqual(newTask);
    });
});
test('check updateTaskById() with different question', () => {
    expect.assertions(1);
    newTask.task_type = 'open';
    newTask.question.possibilities = [];
    return taskDao.updateTaskById({ id: dummies.dummyStud.id }, newTask).then(task => {
        expect(task).toEqual(newTask);
    });
});
test('check updateTaskById() without permissions', () => {
    expect.assertions(1);
    return taskDao.updateTaskById({ id: dummies.dummyTeacher.id }, newTask).then(task => {
        expect(task).toEqual(null);
    });
});
test('check updateTaskById() with user invalidId', () => {
    expect.assertions(1);
    return taskDao.updateTaskById({ id: invalidId }, newTask).then(task => {
        expect(task).toEqual(null);
    });
});
test('check updateTaskById() with invalid question', () => {
    expect.assertions(1);
    return taskDao.updateTaskById({ id: dummies.dummyStud.id }, { 'id': '4', 'owner': dummies.dummyStud, 'task_type': 'single_c', 'question': { 'text': 'What\'s the meaning of life ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' }).then(task => {
        expect(task).toEqual(null);
    });
});
test('check updateTaskById() with invalid question', () => {
    expect.assertions(1);
    return taskDao.updateTaskById({ id: dummies.dummyStud.id }, { 'id': '4', 'owner': dummies.dummyStud, 'task_type': 'open', 'question': { 'text': 'What\'s the meaning of life ?', 'possibilities': ['0', '1'], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' }).then(task => {
        expect(task).toEqual(null);
    });
});
test('check updateTaskById() with empty field(points)', () => {
    expect.assertions(1);
    return taskDao.updateTaskById({ id: dummies.dummyStud.id }, { 'id': '1', 'owner': dummies.dummyStud, 'task_type': 'open', 'question': { 'text': 'What\'s the meaning of life ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' } }).then(task => {
        expect(task).toEqual(null);
    });
});
test('check updateTaskById() with null task', () => {
    expect.assertions(1);
    return taskDao.updateTaskById({ id: dummies.dummyStud.id }, null).then(task => {
        expect(task).toEqual(null);
    });
});

test('check deleteTaskById() with null task', () => {
    expect.assertions(1);
    return taskDao.deleteTaskById({ id: dummies.dummyStud.id }, null).then(task => {
        expect(task).toEqual(null);
    });
});
test('check deleteTaskById() with task invalidId', () => {
    expect.assertions(1);
    return taskDao.deleteTaskById({ id: dummies.dummyStud.id }, { 'id': invalidId, 'owner': dummies.dummyStud, 'task_type': 'single_c', 'question': { 'text': 'What\'s the meaning of life ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' }).then(task => {
        expect(task).toEqual(null);
    });
});
test('check deleteTaskById() without permissions', () => {
    expect.assertions(1);
    return taskDao.deleteTaskById({ id: dummies.dummyTeacher.id }, newTask).then(task => {
        expect(task).toEqual(null);
    });
});
test('check deleteTaskById() with user invalidId', () => {
    expect.assertions(1);
    return taskDao.deleteTaskById({ id: invalidId }, newTask).then(task => {
        expect(task).toEqual(null);
    });
});
test('check deleteTaskById() ', () => {
    expect.assertions(1);
    return taskDao.deleteTaskById({ id: dummies.dummyStud.id }, newTask).then(task => {
        expect(task).toEqual(newTask);
    });
});

test('check getTasksByExam()', () => {
    expect.assertions(1);
    return taskDao.getTasksByExam({ id: dummies.dummyTeacher.id }, dummies.dummyExam.id).then(tasks => {
        expect(tasks).toBeDefined();
    });
});
test('check getTasksByExam() with exam invalidId', () => {
    expect.assertions(1);
    return taskDao.getTasksByExam({ id: dummies.dummyTeacher.id }, invalidId).then(tasks => {
        expect(tasks).toEqual([]);
    });
});
test('check getTasksByExam() with user invalidId', () => {
    expect.assertions(1);
    return taskDao.getTasksByExam({ id: invalidId }, dummies.dummyExam.id).then(tasks => {
        expect(tasks).toEqual([]);
    });
});