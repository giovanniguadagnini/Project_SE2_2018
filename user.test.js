const app = require('./app');
const request = require('supertest');
//const fetch = require('node-fetch');
const dummyStud = require('./dummies').dummyStud;
//const link = 'https://teamrocketproject-test.herokuapp.com';

const validId = dummyStud.id;
const invalidId = '999999999999999999999999';
const pureStringId = 'aaaaaaaaaaaaaaaaaaaaaa';

test('app module should be defined', () => {
    expect(app).toBeDefined();
});

test('GET / should return 200', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
});

test('GET /users/validId?access_token=validId; should return 200 + users obj', async () => {
    const response = await request(app).get('/users/' + validId + '?access_token=' + validId);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('GET /users/invalidId?access_token=validId should return 403', async () => {
    const response = await request(app).get('/users/' + invalidId + '?access_token=' + validId);
    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({});
});

test('GET /users/purestringid?access_token=validId with string as id in the uri; should return 400', async () => {
    const response = await request(app).get('/users/' + pureStringId + '?access_token=' + validId);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});

test('GET /users?access_token=validId without parameter; should return 200 + all users in the system', async () => {
    const response = await request(app).get('/users?access_token=' + validId);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('GET /users?access_token=validId with only enrolledBefore param; should return 200 + all users in the system', async () => {
    const response = await request(app).get('/users?access_token=' + validId).query({enrolledBefore: '2019'});
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('GET /users?access_token=validId with only enrolledBefore param; should return 200 + all users in the system', async () => {
    const response = await request(app).get('/users?access_token=' + validId).query({enrolledAfter: '1900'});
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('GET /users?access_token=validId with the two parameters; should return 200 + all users in the system', async () => {
    const response = await request(app).get('/users?access_token=' + validId).query({
        enrolledBefore: '1900',
        enrolledAfter: '2019'
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('PUT /users/validId; should return 200 + users obj', async () => {
    const response = await request(app).put('/users/' + validId).set('Authorization', 'Bearer ' + validId).send(dummyStud);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('PUT /users/invalidId; should return 403', async () => {
    const response = await request(app).put('/users/' + invalidId).set('Authorization', 'Bearer ' + validId).send(dummyStud);
    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({});
});

test('PUT /users/validId with invalid data in body; should return 400', async () => {
    const response = await request(app).put('/users/' + validId).set('Authorization', 'Bearer ' + validId).send({
        id: validId,
        name: 'John',
        surname: null
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});

test('PUT /users/invalidId with right access_token; should return 403', async () => {
    const response = await request(app).put('/users/' + invalidId).set('Authorization', 'Bearer ' + validId).send({
        'name': 'Giovanni',
        'surname': 'Guadagnini',
        'email': 'giovanni.guadagnini@gmail.com',
        'enrolled': '2012'
    });
    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({});
});

test('PUT /users/pureStringId with string as id in the uri; should return 403', async () => {
    const response = await request(app).put('/users/' + pureStringId).set('Authorization', 'Bearer ' + validId).send(dummyStud);
    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({});
});

test('PUT /users/invalidId without parameter; should return 403', async () => {
    const response = await request(app).put('/users/' + invalidId).set('Authorization', 'Bearer ' + validId).send(null);
    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({});
});


test('PUT /users/pureStringId with string as id in the uri and without parameter; should return 403', async () => {
    const response = await request(app).put('/users/' + pureStringId).set('Authorization', 'Bearer ' + validId).send(null);
    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({});
});

test('DELETE /users/validId; should return 200 + users obj', async () => {
    const response = await request(app).delete('/users/' + validId).set('Authorization', 'Bearer ' + validId).send(dummyStud);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('DELETE /users/invalidId in the uri; should return 403', async () => {
    const response = await request(app).delete('/users/' + invalidId).set('Authorization', 'Bearer ' + validId);
    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({});
});

test('DELETE /users/pureStringId with string as id in the uri; should return 403', async () => {
    const response = await request(app).delete('/users/' + pureStringId).set('Authorization', 'Bearer ' + validId);
    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({});
});
