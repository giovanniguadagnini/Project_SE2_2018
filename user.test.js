const app = require('./user')
const request = require('supertest');

test('app module should be defined', () => {
    expect(app).toBeDefined();
});

test('GET / should return 200', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
});

test('GET /users without parameter; should return 200 + all users in the system', async () => {
    const response = await request(app).get('/users');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('GET /users with only enrolledBefore param; should return 200 + all users in the system', async () => {
    const response = await request(app).get('/users').query({ enrolledBefore: '111111' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('GET /users with only enrolledBefore param; should return 200 + all users in the system', async () => {
    const response = await request(app).get('/users').query({  enrolledAfter: '111111' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('GET /users with the two parameters; should return 200 + all users in the system', async () => {
    const response = await request(app).get('/users').query({ enrolledBefore: '111111', enrolledAfter: '111111' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('GET /users with the two special parameters to try if the db has no user; should return 404', async () => {
    const response = await request(app).get('/users').query({ enrolledBefore: '0', enrolledAfter: '0' });
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({});
});

test('POST /users without parameter; should return 405', async () => {
    const response = await request(app).post('/users');
    expect(response.statusCode).toBe(405);
    expect(response.body).toEqual({});
});

test('POST /users with all the parameters; should return 200', async () => {
    const response = await request(app).post('/users').send({'name': 'Giovanni', 'surname' : 'Guadagnini', 'password' : 'aaaa', 'email' : 'giovanni.guadagnini@gmail.com', 'born' : '17/10/1997'});
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({'name': 'Giovanni', 'surname' : 'Guadagnini', 'password' : 'aaaa', 'email' : 'giovanni.guadagnini@gmail.com', 'born' : '17/10/1997'});
});

test('POST /users with all the parameters except one; should return 405', async () => {
    const response = await request(app).post('/users').send({'name': 'Giovanni', 'password' : 'aaaa', 'email' : 'giovanni.guadagnini@gmail.com', 'born' : '17/10/1997'});
    expect(response.statusCode).toBe(405);
    expect(response.body).toEqual({});
});

test('GET /users/1; should return 200 + users obj', async () => {
    const response = await request(app).get('/users/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({'name': 'Giovanni', 'surname' : 'Guadagnini', 'password' : 'aaaa', 'email' : 'giovanni.guadagnini@gmail.com', 'born' : '17/10/1997'});
});

test('GET /users/99999 with 99999 unknown user as id in the uri; should return 404', async () => {
    const response = await request(app).get('/users/99999');
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({});
});

test('GET /users/aa with string as id in the uri; should return 400', async () => {
    const response = await request(app).get('/users/aa');
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});

test('PUT /users/1; should return 200 + users obj', async () => {
    const response = await request(app).put('/users/1').send({'name': 'Giovanni', 'surname' : 'Guadagnini', 'password' : 'aaaa', 'email' : 'giovanni.guadagnini@gmail.com', 'born' : '17/10/1997'});
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({'name': 'Giovanni', 'surname' : 'Guadagnini', 'password' : 'aaaa', 'email' : 'giovanni.guadagnini@gmail.com', 'born' : '17/10/1997'});
});

test('PUT /users/99999 with 99999 unknown user as id in the uri; should return 404', async () => {
    const response = await request(app).put('/users/99999').send({'name': 'Giovanni', 'password' : 'aaaa', 'email' : 'giovanni.guadagnini@gmail.com', 'born' : '17/10/1997'});
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({});
});

test('PUT /users/1 with invalid data; should return 404', async () => {
    const response = await request(app).put('/users/1').send({'name': 'Giovanni', 'password' : 'aaaa', 'email' : 'giovanni.guadagnini@gmail.com', 'born' : '17/10/1997'});
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({});
});

test('PUT /users/99999 with 99999 unknown user as id in the uri with invalid data; should return 404', async () => {
    const response = await request(app).put('/users/99999').send({'name': 'Giovanni', 'password' : 'aaaa', 'email' : 'giovanni.guadagnini@gmail.com', 'born' : '17/10/1997'});
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({});
});

test('PUT /users/aa with string as id in the uri; should return 400', async () => {
    const response = await request(app).put('/users/aa').send({'name': 'Giovanni', 'password' : 'aaaa', 'email' : 'giovanni.guadagnini@gmail.com', 'born' : '17/10/1997'});
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});
