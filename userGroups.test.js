const app = require('./app');
const request = require('supertest');
const dummiesDB = require('./dummies');
const utilities = require('./utilities');
const dummyStud = dummiesDB.dummyStud;
const dummyTeacher = dummiesDB.dummyTeacher;
let dummyUserGroup = {
    id: 6,
    creator: dummyTeacher,
    name: 'SEII Dummy Class',
    users: [dummyStud]
};

let validUGId = dummyUserGroup.id;
const validId = dummyStud.id;
const invalidUGId = '999999999999999999999999';
const pureStringUGId = 'aaaaaaaaaaaaaaaaaaaaaa';

beforeAll(() => {
    //dummiesDB.popDB();
});

afterAll(() => {
    //dummiesDB.cleanDB();
    utilities.connection.end();
});

test('app module should be defined', () => {
    expect.assertions(1);
    expect(app).toBeDefined();
});

test('POST /userGroups; should return 201 + userGroup obj', async () => {
    expect.assertions(2);
    let response = await request(app).post('/userGroups').set('Authorization', 'Bearer ' + validId).send({user:dummyTeacher, userGroup:dummyUserGroup});
    expect(response.statusCode).toBe(201);
    expect(response.body).toBeDefined();
    dummyUserGroup.id = response.body.id;
    dummyUserGroup.creator = response.body.creator;
    validUGId = dummyUserGroup.id;
});
/*
test('POST /userGroups; with error as group, should return 400', async () => {
    expect.assertions(2);
    let response = await request(app).post('/userGroups').set('Authorization', 'Bearer ' + validId).send({user:dummyTeacher, userGroup:null});
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});
*/
test('POST /userGroups; with error as group, should return 400', async () => {
    expect.assertions(2);
    let response = await request(app).post('/userGroups').set('Authorization', 'Bearer ' + validId).send({user:dummyTeacher, userGroup:{name:'ciao'}});
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});

test('GET / should return 200', async () => {
    expect.assertions(1);
    let response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
});

test('GET /usersGroups/validUGId?access_token=validId; should return 200 + userGroup obj', async () => {
    expect.assertions(2);
    let response = await request(app).get('/userGroups/' + validUGId + '?access_token=' + validId);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('GET /usersGroups/invalidGUId?access_token=validId; should return 404 + userGroup obj', async () => {
    expect.assertions(2);
    let response = await request(app).get('/userGroups/' + invalidUGId + '?access_token=' + validId);
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({});
});

test('GET /usersGroups/pureStringUGId?access_token=validId; should return 400 + userGroup obj', async () => {
    expect.assertions(2);
    let response = await request(app).get('/userGroups/' + pureStringUGId + '?access_token=' + validId);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});

test('GET /usersGroups/pureStringUGId?access_token=validId&sortStudBy=enroll; with valid sort option should return 200 + userGroup obj', async () => {
    expect.assertions(2);
    let response = await request(app).get('/userGroups/' + validUGId + '?access_token=' + validId + '&sortStudBy=enroll');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('GET /usersGroups/pureStringUGId?access_token=validId&sortStudBy=alpha; with valid sort option should return 200 + userGroup obj', async () => {
    expect.assertions(2);
    let response = await request(app).get('/userGroups/' + validUGId + '?access_token=' + validId + '&sortStudBy=alpha');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('GET /usersGroups/pureStringUGId?access_token=validId&sortStudBy=alphaenroll; with invalid sort option should return 200 + userGroup obj', async () => {
    expect.assertions(2);
    let response = await request(app).get('/userGroups/' + validUGId + '?access_token=' + validId + '&sortStudBy=alphaenroll');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('GET /usersGroups?access_token=validId; should return 200 + userGroup obj', async () => {
    expect.assertions(2);
    let response = await request(app).get('/userGroups?access_token=' + validId);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('GET /usersGroups?access_token=validId&sortStudBy=enroll; with valid sort option should return 200 + userGroup obj', async () => {
    expect.assertions(2);
    let response = await request(app).get('/userGroups?access_token=' + validId + '&sortStudBy=enroll');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('GET /usersGroups?access_token=validId&sortStudBy=alpha; with valid sort option should return 200 + userGroup obj', async () => {
    expect.assertions(2);
    let response = await request(app).get('/userGroups?access_token=' + validId + '&sortStudBy=alpha');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('GET /usersGroups?access_token=validId&sortStudBy=alphaenroll; with invalid sort option should return 200 + userGroup obj', async () => {
    expect.assertions(2);
    let response = await request(app).get('/userGroups?access_token=' + validId + '&sortStudBy=alphaenroll');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('PUT /userGroups/validUGId; should return 200 + userGroup obj', async () => {
    expect.assertions(2);
    let response = await request(app).put('/userGroups/' + validUGId).set('Authorization', 'Bearer ' + validId).send({user:dummyTeacher, userGroup:dummyUserGroup});
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('PUT /userGroups/validUGId; with user without privileges, should return 403', async () => {
    expect.assertions(2);
    let response = await request(app).put('/userGroups/' + validUGId).set('Authorization', 'Bearer ' + validId).send({user:dummyStud, userGroup:dummyUserGroup});
    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({});
});

test('PUT /userGroups/invalidUGId; should return 404', async () => {
    expect.assertions(2);
    let response = await request(app).put('/userGroups/' + invalidUGId).set('Authorization', 'Bearer ' + validId).send({user:dummyTeacher, userGroup:dummyUserGroup});
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({});
});

test('PUT /userGroups/pureStringUGId; should return 404', async () => {
    expect.assertions(2);
    let response = await request(app).put('/userGroups/' + pureStringUGId).set('Authorization', 'Bearer ' + validId).send({user:dummyTeacher, userGroup:dummyUserGroup});
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({});
});

test('DELETE /userGroups/validUGId; should return 200 + userGroup obj', async () => {
    expect.assertions(2);
    let response = await request(app).delete('/userGroups/' + validUGId).set('Authorization', 'Bearer ' + validId).send({user:dummyTeacher, userGroup:dummyUserGroup});
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('DELETE /userGroups/invalidUGId; should return 404 + userGroup obj', async () => {
    expect.assertions(2);
    let response = await request(app).delete('/userGroups/' + invalidUGId).set('Authorization', 'Bearer ' + validId).send({user:dummyTeacher, userGroup:dummyUserGroup});
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({});
});

test('DELETE /userGroups/pureStringUGId; should return 404 + userGroup obj', async () => {
    expect.assertions(2);
    let response = await request(app).delete('/userGroups/' + pureStringUGId).set('Authorization', 'Bearer ' + validId).send({user:dummyTeacher, userGroup:dummyUserGroup});
    expect(response.statusCode).toBe(404);
    expect(response.body).toBeDefined();
});
