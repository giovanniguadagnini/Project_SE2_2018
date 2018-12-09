const taskDao = require('../src/db/taskDao');

test('taskDao module should be defined', () => {
    expect(taskDao).toBeDefined();
});
/*
test('check createTask()', () => {
    taskDao.createTask({ 'id': '4', 'owner': '11', 'task_type': 'open', 'question': { 'text': 'What\'s the meaning of life ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' })
        .then(task => {
            expect(task).toBeDefined();
        })
});
test('check createTask() with an empty field', () => {
    expect(taskDao.createTask({ 'id': '4', 'owner': '11', 'task_type': 'open', 'question': { 'text': 'What\'s the meaning of life ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' } }))
        .toEqual(null);
});
test('check createTask() with empty task', () => {
    expect(taskDao.createTask(null)).toEqual(null);
});
test('check createTask()', () => {
    expect(taskDao.createTask({ 'id': '4', 'owner': '11', 'task_type': 'open', 'question': { 'text': 'What\'s the meaning of life ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' }))
        .toEqual({ 'id': '4', 'owner': '11', 'task_type': 'open', 'question': { 'text': 'What\'s the meaning of life ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' });
});
*/
test('check getTasks()', () => {
    taskDao.getTasks(12).then(tasks => {
        expect(tasks).toBeDefined();
    });
});
/*
test('check getTask() by id with numeric id', () => {
    expect(taskDao.getTask(1)).toBeDefined();
});
test('check getTask() by id with numeric id, unknown task', () => {
    expect(taskDao.getTask(9)).toEqual(null);
});
test('check getTask() by id with string as id', () => {
    expect(taskDao.getTask("a")).toEqual(null);
});
test('check getTask() by id with numeric id', () => {
    expect(taskDao.getTask(1))
        .toEqual({ 'id': '1', 'owner': '11', 'task_type': 'open', 'question': { 'text': 'What do you get if you perform 1 + 1 ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' });
});

test('check updateTask()', () => {
    expect(taskDao.updateTask({ 'id': '1', 'owner': '11', 'task_type': 'open', 'question': { 'text': 'What do you get if you perform 1 * 1 ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' }))
        .toEqual({ 'id': '1', 'owner': '11', 'task_type': 'open', 'question': { 'text': 'What do you get if you perform 1 * 1 ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' });
});
test('check updateTask() with an empty field', () => {
    expect(taskDao.updateTask({ 'id': '1', 'owner': '11', 'task_type': 'open', 'question': { 'text': 'What do you get if you perform 1 * 1 ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' } }))
        .toEqual(null);
});
test('check updateTask()', () => {
    expect(taskDao.updateTask({ 'id': '1', 'owner': '11', 'task_type': 'open', 'question': { 'text': 'What do you get if you perform 1 * 1 ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' }))
        .toEqual({ 'id': '1', 'owner': '11', 'task_type': 'open', 'question': { 'text': 'What do you get if you perform 1 * 1 ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' });
});
test('check updateTask() with empty task', () => {
    expect(taskDao.updateTask(null)).toEqual(null);
});

test('check deleteTask()', () => {
    expect(taskDao.deleteTask('1'))
        .toEqual({ 'id': '1', 'owner': '11', 'task_type': 'open', 'question': { 'text': 'What do you get if you perform 1 + 1 ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' });
});
test('check deleteTask() with not existing id', () => {
    expect(taskDao.deleteTask(9)).toEqual(null);
});
test('check deleteTask() with string as id', () => {
    expect(taskDao.deleteTask(a)).toEqual(null);
});*/
