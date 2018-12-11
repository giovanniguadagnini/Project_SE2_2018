const app = require('../src/app');
const request = require('supertest');
const dummies = require('./dummies');
const utilities = require('../src/utilities');

// NOTE in TESTING access_token == validId
// In an actual case the access_toke is automatically generated by google oauth

const invalidId = '999999999999999999999999';

let newTask = {
    id: '2',
    owner: dummies.dummyTeacher,
    task_type: 'single_c',
    question: {
        text: 'testCreateTask',
        possibilities: ['0', '1'],
        base_upload_url: 'http://uploadhere.com/dummy/v1/'
    },
    points: '1'
};

// NOTE in TESTING access_token == validId
// In an actual case the access_toke is automatically generated by google oauth
beforeAll(() => {
    return dummies.popDB();
});

afterAll(() => {
    return dummies.cleanDB().then(() => dummies.connection.end());
});


describe('GENERIC task test cases', async () => {
    test('app module should be defined', () => {
        expect.assertions(1);
        expect(app).toBeDefined();
    });
});

describe('POST task test cases', async () => {
    test('POST /tasks without parameter; should return 400', async () => {
        expect.assertions(2);
        let response = await request(app).post('/tasks').set('Authorization', 'Bearer ' + dummies.dummyStud.id);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({});
    });
    test('POST /task with user invalidId ; should return 200', async () => {
        expect.assertions(2);
        let response = await request(app).post('/tasks').set('Authorization', 'Bearer ' + dummies.dummyTeacher.id).send(newTask);
        newTask.id = response.body.id;
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(newTask);
    });
    test('POST /tasks with all the parameters except one(points); should return 400', async () => {
        expect.assertions(2);
        let response = await request(app).post('/tasks').set('Authorization', 'Bearer ' + dummies.dummyStud.id).send({ 'id': '1', 'owner': dummies.dummyStud, 'task_type': 'open', 'question': { 'text': 'What\'s the meaning of life ?', 'possibilities': [], 'base_upload_url': 'http://uploadhere.com/dummy/v1/' } });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({});
    });
    test('POST /tasks with user invalidId; should return 401', async () => {
        expect.assertions(2);
        let response = await request(app).post('/tasks').set('Authorization', 'Bearer ' + invalidId).send(newTask);
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({});
    });
    test('POST /task with wrong question; should return 400', async () => {
        expect.assertions(2);
        newTask.task_type = 'open';
        let response = await request(app).post('/tasks').set('Authorization', 'Bearer ' + dummies.dummyStud2.id).send(newTask);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({});
    });
    test('POST /task with all the parameters; should return 200 + created task', async () => {
        expect.assertions(2);
        newTask.task_type = 'multiple_c';
        newTask.owner = dummies.dummyStud2;
        let response = await request(app).post('/tasks').set('Authorization', 'Bearer ' + dummies.dummyStud2.id).send(newTask);
        newTask.id = response.body.id;
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(newTask);
    });
});

describe('GET task test cases', async () => {
    test('GET / should return 200', async () => {
        expect.assertions(1);
        let response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });

    test('GET /tasks without parameter; should return 200 + all tasks in the system', async () => {
        expect.assertions(2);
        let response = await request(app).get('/tasks?access_token=' + dummies.dummyStud2.id);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([newTask]);
    });
    test('GET /tasks without token; should return 401', async () => {
        expect.assertions(2);
        let response = await request(app).get('/tasks');
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({});
    });
    test('GET /tasks with invalidId; should return 401 + no tasks', async () => {
        expect.assertions(2);
        let response = await request(app).get('/tasks?access_token=' + invalidId);
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({});
    });

    test('GET /tasks/:newTask.id; should return 200 + task obj', async () => {
        expect.assertions(2);
        let response = await request(app).get('/tasks/' + newTask.id + '?access_token=' + dummies.dummyStud2.id);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(newTask);
    });
    test('GET /tasks/:invalidId; should return 400', async () => {
        expect.assertions(2);
        let response = await request(app).get('/tasks/' + invalidId + '?access_token=' + dummies.dummyStud.id);
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({});
    });
    test('GET /tasks/:newTask.id with user invalidId; should return 401', async () => {
        expect.assertions(2);
        let response = await request(app).get('/tasks/' + newTask.id + '?access_token=' + invalidId);
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({});
    });
});

describe('PUT task test cases', async () => {
    test('PUT /tasks/:newTask.id with wrong id; should return 400', async () => {
        expect.assertions(2);
        let tmp = newTask.id;
        newTask.id = '3';
        let response = await request(app).put('/tasks/' + newTask.id).set('Authorization', 'Bearer ' + dummies.dummyStud2.id).send(newTask);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({});
        newTask.id = tmp;
    });
    test('PUT /tasks/:newTask.id with wrong question; should return 400 + tasks obj', async () => {
        expect.assertions(2);
        newTask.task_type = 'open';
        let response = await request(app).put('/tasks/' + newTask.id).set('Authorization', 'Bearer ' + dummies.dummyStud2.id).send(newTask);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({});
    });
    test('PUT /tasks/:newTask.id; should return 200 + tasks obj', async () => {
        expect.assertions(2);
        newTask.task_type = 'single_c';
        let response = await request(app).put('/tasks/' + newTask.id).set('Authorization', 'Bearer ' + dummies.dummyStud2.id).send(newTask);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(newTask);
    });
    test('PUT /tasks/:invalidId; should return 400', async () => {
        expect.assertions(2);
        let response = await request(app).put('/tasks/' + invalidId).set('Authorization', 'Bearer ' + dummies.dummyStud2.id).send(newTask);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({});
    });
    test('PUT /tasks/:newTask.id without parameters; should return 404', async () => {
        expect.assertions(2);
        let response = await request(app).put('/tasks' + newTask.id).set('Authorization', 'Bearer ' + dummies.dummyStud2.id);
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({});
    });
    test('PUT /tasks/:newTask.id with user invalidId; should return 401', async () => {
        expect.assertions(2);
        let response = await request(app).put('/tasks/' + newTask.id).set('Authorization', 'Bearer ' + invalidId).send(newTask);
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({});
    });
});

describe('DELETE task test cases', async () => {
    test('DELETE /tasks/:newTask.id with wrong id; should return 400', async () => {
        expect.assertions(2);
        let tmp = newTask.id;
        newTask.id = '3';
        let response = await request(app).delete('/tasks/' + newTask.id).set('Authorization', 'Bearer ' + dummies.dummyStud2.id).send(newTask);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({});
        newTask.id = tmp;
    });
    test('DELETE /tasks/:newTask.id with wrong question; should return 400 + tasks obj', async () => {
        expect.assertions(2);
        newTask.task_type = 'open';
        let response = await request(app).delete('/tasks/' + newTask.id).set('Authorization', 'Bearer ' + dummies.dummyStud2.id).send(newTask);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({});
    });
    test('DELETE /tasks/:invalidId; should return 400', async () => {
        expect.assertions(2);
        let response = await request(app).delete('/tasks/' + invalidId).set('Authorization', 'Bearer ' + dummies.dummyStud2.id).send(newTask);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({});
    });
    test('DELETE /tasks/:newTask.id without parameters; should return 404', async () => {
        expect.assertions(2);
        let response = await request(app).delete('/tasks' + newTask.id).set('Authorization', 'Bearer ' + dummies.dummyStud2.id);
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({});
    });
    test('DELETE /tasks/:newTask.id with user invalidId; should return 401', async () => {
        expect.assertions(2);
        let response = await request(app).delete('/tasks/' + newTask.id).set('Authorization', 'Bearer ' + invalidId).send(newTask);
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({});
    });
    test('DELETE /tasks/:newTask.id; should return 200 + tasks obj', async () => {
        expect.assertions(2);
        newTask.task_type = 'single_c';
        let response = await request(app).delete('/tasks/' + newTask.id).set('Authorization', 'Bearer ' + dummies.dummyStud2.id).send(newTask);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(newTask);
    });
});