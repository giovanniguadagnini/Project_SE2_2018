const app = require('./app');
const request = require('supertest');
const dummiesDB = require('./dummies');
const utilities = require('./utilities');
const dummyStud = dummiesDB.dummyStud;

const validUGId = dummyUserGroup.id;
const validId = dummyStud.id;
const invalidId = '999999999999999999999999';
const pureStringId = 'aaaaaaaaaaaaaaaaaaaaaa';

beforeAll(() => {
    dummiesDB.popDB();
});

afterAll(() => {
    dummiesDB.cleanDB();
    utilities.closeConnection();
});

test('app module should be defined', () => {
    expect.assertions(1);
    expect(app).toBeDefined();
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
