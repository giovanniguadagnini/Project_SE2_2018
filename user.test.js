const app = require('./app');
const request = require('supertest');

test('app module should be defined', () => {
    expect(app).toBeDefined();
});

test('GET / should return 200', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
});

/*
test('POST /users without parameter; should return 405', async () => {
    const response = await request(app).post('/users');
    expect(response.statusCode).toBe(405);
    expect(response.body).toEqual({});
});

test('POST /users with all the parameters; should return 200', async () => {
    const response = await request(app).post('/users').send({'id':'110228221053954638301', 'name': 'Giovanni',  'surname' : 'Guadagnini'});
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('POST /users with all the parameters except one; should return 405', async () => {
    const response = await request(app).post('/users').send({'id':'110228221053954638301', 'name': 'Giovanni',  'surname' : 'Guadagnini', 'email' : 'giovanni.guadagnini@gmail.com', 'enrolled': '877046400000'});
    expect(response.statusCode).toBe(405);
    expect(response.body).toEqual({});
});

test('GET /users/110228221053954638301; should return 200 + users obj', async () => {
    const response = await request(app).get('/users/110228221053954638301');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({'id':'110228221053954638301', 'name': 'Giovanni',  'surname' : 'Guadagnini', 'email' : 'giovanni.guadagnini@gmail.com', 'enrolled': '877046400000' , 'born' : '877046400000'});
});

test('GET /users/999999999999999999999 with 999999999999999999999 unknown user as id in the uri; should return 404', async () => {
    const response = await request(app).get('/users/999999999999999999999');
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({});
});

test('GET /users/aaaaaaaaaaaaaaaaaaaaa with string as id in the uri; should return 400', async () => {
    const response = await request(app).get('/users/aa');
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});

test('GET /users without parameter; should return 200 + all users in the system', async () => {
    const response = await request(app).get('/users');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('GET /users with only enrolledBefore param; should return 200 + all users in the system', async () => {
    const response = await request(app).get('/users').query({ enrolledBefore: '1543190400000' }); //26/11/2018 -->1543190400000, 28/11/2018 --> 1543190400000
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('GET /users with only enrolledBefore param; should return 200 + all users in the system', async () => {
    const response = await request(app).get('/users').query({  enrolledAfter: '1543363200000' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('GET /users with the two parameters; should return 200 + all users in the system', async () => {
    const response = await request(app).get('/users').query({ enrolledBefore: '1543190400000', enrolledAfter: '1543190400000' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('PUT /users/110228221053954638301; should return 200 + users obj', async () => {
    const response = await request(app).put('/users/110228221053954638301').send({'id':'110228221053954638301', 'name': 'Giovanni',  'surname' : 'Guadagnini', 'email' : 'giovanni.guadagnini@gmail.com', 'enrolled': '877046400000' , 'born' : '877046400000'});
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({'id':'110228221053954638301', 'name': 'Giovanni',  'surname' : 'Guadagnini', 'email' : 'giovanni.guadagnini@gmail.com', 'enrolled': '877046400000' , 'born' : '877046400000'});
});

test('PUT /users/999999999999999999999 with 999999999999999999999 unknown user as id in the uri; should return 404', async () => {
    const response = await request(app).put('/users/999999999999999999999').send({'id':'110228221053954638301', 'name': 'Giovanni',  'surname' : 'Guadagnini', 'email' : 'giovanni.guadagnini@gmail.com', 'enrolled': '877046400000' , 'born' : '877046400000'});
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({});
});

test('PUT /users/110228221053954638301 with invalid data; should return 404', async () => {
    const response = await request(app).put('/users/110228221053954638301').send({'id':'110228221053954638301', 'name': 'Giovanni',  'surname' : 'Guadagnini', 'email' : 'giovanni.guadagnini@gmail.com', 'enrolled': '877046400000' });
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({});
});

test('PUT /users/999999999999999999999 with 999999999999999999999 unknown user as id in the uri with invalid data; should return 404', async () => {
    const response = await request(app).put('/users/999999999999999999999').send({'id':'110228221053954638301', 'name': 'Giovanni',  'surname' : 'Guadagnini', 'email' : 'giovanni.guadagnini@gmail.com', 'enrolled': '877046400000' });
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({});
});

test('PUT /users/aaaaaaaaaaaaaaaaaaaaa with string as id in the uri; should return 400', async () => {
    const response = await request(app).put('/users/aaaaaaaaaaaaaaaaaaaaa').send({'name': 'Giovanni', 'password' : 'aaaa', 'email' : 'giovanni.guadagnini@gmail.com', 'born' : '17/10/1997'});
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});

test('PUT /users/999999999999999999999 with 999999999999999999999 unknown user as id and withou parameter; should return 404', async () => {
    const response = await request(app).put('/users/999999999999999999999');
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({});
});

test('PUT /users/aaaaaaaaaaaaaaaaaaaaa with string as id in the uri and withou parameter; should return 400', async () => {
    const response = await request(app).put('/users/aaaaaaaaaaaaaaaaaaaaa');
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});

test('DELETE /users/110228221053954638301; should return 200 + users obj', async () => {
    const response = await request(app).put('/users/110228221053954638301');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({'id':'110228221053954638301', 'name': 'Giovanni',  'surname' : 'Guadagnini', 'email' : 'giovanni.guadagnini@gmail.com', 'enrolled': '877046400000' , 'born' : '877046400000'});
});

test('DELETE /users/999999999999999999999 with 999999999999999999999 unknown user as id in the uri; should return 404', async () => {
    const response = await request(app).put('/users/999999999999999999999');
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({});
});

test('DELETE /users/aaaaaaaaaaaaaaaaaaaaa with string as id in the uri; should return 400', async () => {
    const response = await request(app).put('/users/aaaaaaaaaaaaaaaaaaaaa');
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});
*/
