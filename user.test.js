const app = require('./app');
const request = require('supertest');
const fetch = require('node-fetch');
const dummyStud = require('./dummies').dummyStud;
const link = 'https://teamrocketproject-test.herokuapp.com';

test('app module should be defined', () => {
    expect(app).toBeDefined();
});

test('GET / should return 200', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
});

test('GET /users/12?access_token=12; should return 200 + users obj', async () => {
    const response = await request(app).get('/users/12?access_token=12');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('GET /users/999999999999999999999?access_token=12 with 999999999999999999999 unknown user as id in the uri; should return 403', async () => {
    const response = await request(app).get('/users/999999999999999999999?access_token=12');
    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({});
});

test('GET /users/aaaaaaaaaaaaaaaaaaaaa?access_token=12 with string as id in the uri; should return 400', async () => {
    const response = await request(app).get('/users/aa?access_token=12');
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});

test('GET /users?access_token=12 without parameter; should return 200 + all users in the system', async () => {
    const response = await request(app).get('/users?access_token=12');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('GET /users?access_token=12 with only enrolledBefore param; should return 200 + all users in the system', async () => {
    const response = await request(app).get('/users?access_token=12').query({ enrolledBefore: '2019' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('GET /users?access_token=12 with only enrolledBefore param; should return 200 + all users in the system', async () => {
    const response = await request(app).get('/users?access_token=12').query({  enrolledAfter: '1900' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('GET /users?access_token=12 with the two parameters; should return 200 + all users in the system', async () => {
    const response = await request(app).get('/users?access_token=12').query({ enrolledBefore: '1900', enrolledAfter: '2019' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('PUT /users/12; should return 200 + users obj', async () => {
    const response = await request(app).put('/users/12').set('Authorization','Bearer 12').send(dummyStud);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('PUT /users/999999999999999999999999999999999999999999 with 999999999999999999999999999999999999999999 unknown user as id in the uri; should return 403', async () => {
    const response = await request(app).put('/users/999999999999999999999999999999999999999999').set('Authorization','Bearer 12').send(dummyStud);
    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({});
});

test('PUT /users/12 with invalid data; should return 400', async () => {
    const response = await request(app).put('/users/12').set('Authorization','Bearer 12').send({id: '12', name: 'John', surname: null});
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});

test('PUT /users/999999999999999999999 with 999999999999999999999 unknown user as id in the uri with invalid data; should return 403', async () => {
    const response = await request(app).put('/users/999999999999999999999').set('Authorization','Bearer 12').send({'id':'110228221053954638301', 'name': 'Giovanni',  'surname' : 'Guadagnini', 'email' : 'giovanni.guadagnini@gmail.com', 'enrolled': '877046400000' });
    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({});
});

test('PUT /users/aaaaaaaaaaaaaaaaaaaaa with string as id in the uri; should return 403', async () => {
    const response = await request(app).put('/users/aaaaaaaaaaaaaaaaaaaaa').set('Authorization','Bearer 12').send(dummyStud);
    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({});
});

test('PUT /users/999999999999999999999999999999999999999999 with 999999999999999999999999999999999999999999 unknown user as id and withou parameter; should return 403', async () => {
    const response = await request(app).put('/users/999999999999999999999999999999999999999999').set('Authorization','Bearer 12').send(null);
    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({});
});

test('PUT /users/aaaaaaaaaaaaaaaaaaaaa with string as id in the uri and withou parameter; should return 403', async () => {
    const response = await request(app).put('/users/aaaaaaaaaaaaaaaaaaaaa').set('Authorization','Bearer 12').send(null);
    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({});
});

test('DELETE /users/12; should return 200 + users obj', async () => {
    const response = await request(app).delete('/users/12').set('Authorization','Bearer 12').send(dummyStud);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('DELETE /users/999999999999999999999999999999999999999999 with 999999999999999999999999999999999999999999 unknown user as id in the uri; should return 403', async () => {
    const response = await request(app).delete('/users/999999999999999999999999999999999999999999').set('Authorization','Bearer 12');
    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({});
});

test('DELETE /users/aaaaaaaaaaaaaaaaaaaaa with string as id in the uri; should return 403', async () => {
    const response = await request(app).delete('/users/aaaaaaaaaaaaaaaaaaaaa').set('Authorization','Bearer 12');
    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({});
});
