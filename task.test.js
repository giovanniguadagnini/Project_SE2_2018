const request = require('supertest');
const app = require('./app')

test('task module should be defined', () => {
    expect(app).toBeDefined();
});

test('GET / should return 200', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
});

test('GET /tasks without parameter; should return 200 + all tasks in the system', async () => {
    const response = await request(app).get('/tasks');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('POST /tasks without parameter; should return 405', async () => {
    const response = await request(app).post('/tasks');
    expect(response.statusCode).toBe(405);
    expect(response.body).toEqual({});
});
test('POST /task with all the parameters; should return 200 + created task', async () => {
    const response = await request(app).post('/task').json({ 'id': '4', 'owner': '11', 'task_type': 'open', 'question': { 'text': 'What\'s the meaning of life ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});
test('POST /tasks with all the parameters except one; should return 405', async () => {
    const response = await request(app).post('/tasks').json({ 'id': '4', 'owner': '11', 'task_type': 'open', 'question': { 'text': 'What\'s the meaning of life ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' } });
    expect(response.statusCode).toBe(405);
    expect(response.body).toEqual({});
});

test('GET /tasks/1; should return 200 + task obj', async () => {
    const response = await request(app).get('/tasks/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ 'id': '1', 'owner': '11', 'task_type': 'open', 'question': { 'text': 'What do you get if you perform 1 + 1 ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' });
});
test('GET /tasks/a with string as id in the uri; should return 400', async () => {
    const response = await request(app).get('/tasks/a');
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});
test('GET /tasks/9 with 9 unknown task as id in the uri; should return 404', async () => {
    const response = await request(app).get('/tasks/9');
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({});
});
test('GET /tasks/a with string as id in the uri; should return 400', async () => {
    const response = await request(app).get('/tasks/a');
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});
test('GET /tasks/a with string as id in the uri; should return 400', async () => {
    const response = await request(app).get('/tasks/a');
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});

test('PUT /tasks/1; should return 200 + tasks obj', async () => {
    const response = await request(app).put('/tasks/1').json({ 'id': '1', 'owner': '11', 'task_type': 'open', 'question': { 'text': 'What do you get if you perform 1 * 1 ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ 'id': '1', 'owner': '11', 'task_type': 'open', 'question': { 'text': 'What do you get if you perform 1 * 1 ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' });
});
test('PUT /tasks/9 with 9 unknown task as id in the uri; should return 404', async () => {
    const response = await request(app).put('/tasks/9').json({ 'id': '1', 'owner': '11', 'task_type': 'open', 'question': { 'text': 'What do you get if you perform 1 * 1 ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' });
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({});
});
test('PUT /tasks/1 with invalid owner id; should return 404', async () => {
    const response = await request(app).put('/tasks/1').json({ 'id': '1', 'owner': 'a', 'task_type': 'open', 'question': { 'text': 'What do you get if you perform 1 * 1 ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' });
    expect(response.statusCode).toBe(405);
    expect(response.body).toEqual({});
});
test('PUT /tasks/9 with 9 unknown task as id in the uri with invalid owner id; should return 404', async () => {
    const response = await request(app).put('/tasks/9').json({ 'id': '1', 'owner': 'a', 'task_type': 'open', 'question': { 'text': 'What do you get if you perform 1 * 1 ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' });
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({});
});
test('PUT /tasks/a with string as id in the uri; should return 400', async () => {
    const response = await request(app).put('/tasks/a').json({ 'id': '1', 'owner': '11', 'task_type': 'open', 'question': { 'text': 'What do you get if you perform 1 * 1 ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});
test('PUT /tasks/9 with 9 unknown task as id and without parameters; should return 404', async () => {
    const response = await request(app).put('/tasks/9');
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({});
});
test('PUT /tasks/a with string as id in the uri and without parameter; should return 400', async () => {
    const response = await request(app).put('/tasks/a');
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});

test('DELETE /tasks/1; should return 200 + tasks obj', async () => {
    const response = await request(app).put('/tasks/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ 'id': '1', 'owner': '11', 'task_type': 'open', 'question': { 'text': 'What do you get if you perform 1 + 1 ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' }, 'points': '2' });
});
test('DELETE /tasks/9 with 9 unknown task as id in the uri; should return 404', async () => {
    const response = await request(app).put('/tasks/9');
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({});
});
test('DELETE /tasks/a with string as id in the uri; should return 400', async () => {
    const response = await request(app).put('/tasks/a');
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});