const app = require('./app');
const request = require('supertest');
const dummies = require('./dummies');
const utilities = require('./utilities');

// NOTE in TESTING access_token == validId
// In an actual case the access_toke is automatically generated by google oauth

beforeAll(() => {
    dummies.popDB();
});

afterAll(() => {
    dummies.cleanDB();
    utilities.connection.end();
});

test('task module should be defined', () => {
    expect.assertions(1);
    expect(app).toBeDefined();
});

test('GET / should return 200', async () => {
    expect.assertions(1);
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
});

test('GET /tasks without parameter; should return 200 + all tasks in the system', async () => {
    expect.assertions(2);
    const response = await request(app).get('/tasks?access_token=' + dummies.dummyStud.id);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('POST /tasks without parameter; should return 400', async () => {
    expect.assertions(2);
    const response = await request(app).post('/tasks?access_token=' + dummies.dummyStud.id);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});
test('POST /task with all the parameters; should return 200 + created task', async () => {
    expect.assertions(2);
    const response = await request(app).post('/tasks?access_token=' + dummies.dummyStud.id).send({ 'id': '7', 'exam': '136', 'owner': '11', 'task_type': 'open', 'question': { 'text': 'What\'s the meaning of life ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ 'id': '7', 'exam': '136', 'owner': '11', 'task_type': 'open', 'question': { 'text': 'What\'s the meaning of life ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' });
});
test('POST /tasks with all the parameters except one; should return 400', async () => {
    expect.assertions(2);
    const response = await request(app).post('/tasks?access_token=' + dummies.dummyStud.id).send({ 'id': '7', 'exam': '136', 'owner': '11', 'task_type': 'open', 'question': { 'text': 'What\'s the meaning of life ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' } });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});

test('GET /tasks/7; should return 200 + task obj', async () => {
    expect.assertions(2);
    const response = await request(app).get('/tasks/7?access_token=' + dummies.dummyStud.id);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ 'id': '7', 'exam': '136', 'owner': '11', 'task_type': 'open', 'question': { 'text': 'What\'s the meaning of life ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' });
});
test('GET /tasks/a with string as id in the uri; should return 400', async () => {
    expect.assertions(2);
    const response = await request(app).get('/tasks/a?access_token=' + dummies.dummyStud.id);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});
test('GET /tasks/9 with 9 unknown task as id in the uri; should return 400', async () => {
    expect.assertions(2);
    const response = await request(app).get('/tasks/9?access_token=' + dummies.dummyStud.id);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});
test('GET /tasks/a with string as id in the uri; should return 400', async () => {
    expect.assertions(2);
    const response = await request(app).get('/tasks/a?access_token=' + dummies.dummyStud.id);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});
test('GET /tasks/a with string as id in the uri; should return 400', async () => {
    expect.assertions(2);
    const response = await request(app).get('/tasks/a?access_token=' + dummies.dummyStud.id);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});

test('PUT /tasks/7; should return 200 + tasks obj', async () => {
    expect.assertions(2);
    const response = await request(app).put('/tasks/7?access_token=' + dummies.dummyStud.id).send({ 'id': '7', 'exam': '136', 'owner': '11', 'task_type': 'open', 'question': { 'text': 'What do you get if you perform 1 * 1 ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ 'id': '7', 'exam': '136', 'owner': '11', 'task_type': 'open', 'question': { 'text': 'What do you get if you perform 1 * 1 ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' });
});
test('PUT /tasks/9 with 9 unknown task as id in the uri; should return 400', async () => {
    expect.assertions(2);
    const response = await request(app).put('/tasks/9?access_token=' + dummies.dummyStud.id).send({ 'id': '4', 'exam': '136', 'owner': '11', 'task_type': 'open', 'question': { 'text': 'What do you get if you perform 1 * 1 ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});
test('PUT /tasks/4 with invalid owner id; should return 400', async () => {
    expect.assertions(2);
    const response = await request(app).put('/tasks/1?access_token=' + dummies.dummyStud.id).send({ 'id': '4', 'exam': '136', 'owner': 'a', 'task_type': 'open', 'question': { 'text': 'What do you get if you perform 1 * 1 ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});
test('PUT /tasks/9 with 9 unknown task as id in the uri with invalid owner id; should return 400', async () => {
    expect.assertions(2);
    const response = await request(app).put('/tasks/9?access_token=' + dummies.dummyStud.id).send({ 'id': '4', 'exam': '136', 'owner': 'a', 'task_type': 'open', 'question': { 'text': 'What do you get if you perform 1 * 1 ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});
test('PUT /tasks/a with string as id in the uri; should return 400', async () => {
    expect.assertions(2);
    const response = await request(app).put('/tasks/a?access_token=' + dummies.dummyStud.id).send({ 'id': '4', 'exam': '136', 'owner': '11', 'task_type': 'open', 'question': { 'text': 'What do you get if you perform 1 * 1 ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});
test('PUT /tasks/9 with 9 unknown task as id and without parameters; should return 400', async () => {
    expect.assertions(2);
    const response = await request(app).put('/tasks/9?access_token=' + dummies.dummyStud.id);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});
test('PUT /tasks/a with string as id in the uri and without parameter; should return 400', async () => {
    expect.assertions(2);
    const response = await request(app).put('/tasks/a?access_token=' + dummies.dummyStud.id);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});

test('DELETE /tasks/7; should return 200 + tasks obj', async () => {
    expect.assertions(2);
    const response = await request(app).put('/tasks/7?access_token=' + dummies.dummyStud.id);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ 'id': '7', 'exam': '136', 'owner': '11', 'task_type': 'open', 'question': { 'text': 'What do you get if you perform 1 * 1 ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' });
});
test('DELETE /tasks/9 with 9 unknown task as id in the uri; should return 400', async () => {
    expect.assertions(2);
    const response = await request(app).put('/tasks/9?access_token=' + dummies.dummyStud.id);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});
test('DELETE /tasks/a with string as id in the uri; should return 400', async () => {
    expect.assertions(2);
    const response = await request(app).put('/tasks/a?access_token=' + dummies.dummyStud.id);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});