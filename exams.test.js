const request = require('supertest');
const app = require('./app')

const dummy = require('./dummies');
const dummyStud = require('./dummies').dummyStud;

const validId = dummyStud.id;
const invalidId = '999999999999999999999999';
const pureStringId = 'aaaaaaaaaaaaaaaaaaaaaa';
const NpCompleteExamId = 65;
const validTeacherId = 11;//Associato a NpCompleteExam

test('task module should be defined', () => {
    expect(app).toBeDefined();
});

test('GET /exams/validId?access_token=validId ; should return 200 + exam', async () => {
  expect.assertions(2);
    //[TODO]Fare query che aggiunge un esame per prendere entrambi gli id, sia dell'esame che del teacher associato all'esame
    const response = await request(app).get('/exams/'+ NpCompleteExamId+ '?access_token=' + validTeacherId);
    expect(response.statusCode).toBe(201);
    expect(response.body).toBeDefined();//[TODO]Da controllare struttura dell'exam ritornato
});

test('GET /exams/invalidId?access_token=validId ; should return 400 + exam', async () => {
  expect.assertions(2);
    //[TODO]Fare query che aggiunge un esame per prendere id dell'esame
    const response = await request(app).get('/exams/'+ invalidId + '?access_token=' + validTeacherId);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});

test('GET /exams/purestringid?access_token=validId with string as id in the uri; should return 400', async () => {
    expect.assertions(2);
    let response = await request(app).get('/exams/' + pureStringId + '?access_token=' + validTeacherId);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});

test('GET /exams?access_token=validId without parameter; should return 200 + all exams managable', async () => {
    expect.assertions(2);
    let response = await request(app).get('/exams?access_token=' + validTeacherId);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('GET /exams/validId without access_token; should return 401', async () => {
    expect.assertions(2);
    let response = await request(app).get('/exams/' + NpCompleteExamId);
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({});
});

test('GET /exams/validId?access_token=invalidId ; should return 401', async () => {
    expect.assertions(2);
    let response = await request(app).get('/exams/' + NpCompleteExamId + '?access_token=' + 34543213565);
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({});
});

test('POST /exams with all the parameters; should return 200 + created exam', async () => {
  expect.assertions(2);
    //[TODO]Query user
    //[TODO]Query user_group
    const response = await request(app).post('/exams').set('Authorization', 'Bearer ' + validId).send({
        name: 'dummyGuadagnini',
        teachers: [{//Oggetti di prova presi dal db
            id: 11,
            name: 'Jimmy',
            surname: 'Teacher',
            email: 'dummy@dummy.com',
            born: {year:1967,month:11,day:3,hour:0,minute:0},
            enrolled: {year:2011,month:8,day:31,hour:12,minute:30},
            submission:[]
        }],
        students:{//Oggetto di prova preso dal db
          id:61,
          creator:11,
          name:'SEII Dummy Class',
          users:[]
        },
        deadline: 2012,
        reviewable: true,
        num_shuffle: 10
    });
    expect(response.statusCode).toBe(201);
    expect(response.body).toBeDefined();//[TODO]Da controllare
});

test('POST /exams without parameter; should return 400', async () => {
  expect.assertions(2);
    const response = await request(app).post('/exams').set('Authorization', 'Bearer ' + validId).send({});
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});

/*test('POST /exams with an invalid access_token; should return 400', async () => {
    const response = await request(app).post('/exams').set('Authorization', 'Bearer ' + invalidId).json({
        'name': 'Guadagnini',
        'teachers': [dummy.dummyTeacher.id,dummy.dummyTeacher2.id],
        'students': dummy.dummyUserGroup.id,
        'deadline': '2012',
        'reviewable': 'true',
        'num_shuffle': '10',
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});*/

/*test('POST /exams with a pureStringId access_token; should return 400', async () => {
    const response = await request(app).post('/exams').set('Authorization', 'Bearer ' + pureStringId).json({
        'name': 'Guadagnini',
        'teachers': [dummy.dummyTeacher.id,dummy.dummyTeacher2.id],
        'students': dummy.dummyUserGroup.id,
        'deadline': '2012',
        'reviewable': 'true',
        'num_shuffle': '10',
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});*/

test('POST /exams with no access token; should return 401', async () => {
  expect.assertions(2);
  const response = await request(app).post('/exams').send({
    name: 'dummyGuadagnini',
    teachers: [{//Oggetti di prova presi dal db
        id: 11,
        name: 'Jimmy',
        surname: 'Teacher',
        email: 'dummy@dummy.com',
        born: {year:1967,month:11,day:3,hour:0,minute:0},
        enrolled: {year:2011,month:8,day:31,hour:12,minute:30},
        submission:[]
    }],
    students:{//Oggetto di prova preso dal db
      id:61,
      creator:11,
      name:'SEII Dummy Class',
      users:[]
    },
    deadline: 2012,
    reviewable: true,
    num_shuffle: 10
  });
  expect(response.statusCode).toBe(401);
  expect(response.body).toEqual({});
});

test('POST /exams with all the parameters except one; should return 400', async () => {
  expect.assertions(2);
    const response = await request(app).post('/exams').set('Authorization', 'Bearer ' + validId).send({
      name: 'dummyGuadagnini',
      teachers: [{//Oggetti di prova presi dal db
          id: 11,
          name: 'Jimmy',
          surname: 'Teacher',
          email: 'dummy@dummy.com',
          born: {year:1967,month:11,day:3,hour:0,minute:0},
          enrolled: {year:2011,month:8,day:31,hour:12,minute:30},
          submission:[]
      }],
      students:{//Oggetto di prova preso dal db
        id:61,
        creator:11,
        name:'SEII Dummy Class',
        users:[]
      },
      deadline: 2012,
      reviewable: true,
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});

test('POST /exams with reviewable not boolean should return 400', async () => {
  expect.assertions(2);
    const response = await request(app).post('/exams').set('Authorization', 'Bearer ' + validId).send({
      name: 'dummyGuadagnini',
      teachers: [{//Oggetti di prova presi dal db
          id: 11,
          name: 'Jimmy',
          surname: 'Teacher',
          email: 'dummy@dummy.com',
          born: {year:1967,month:11,day:3,hour:0,minute:0},
          enrolled: {year:2011,month:8,day:31,hour:12,minute:30},
          submission:[]
      }],
      students:{//Oggetto di prova preso dal db
        id:61,
        creator:11,
        name:'SEII Dummy Class',
        users:[]
      },
      deadline: 2012,
      reviewable: 'asfdad',
      num_shuffle: 10
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});

test('POST /exams with invalid user_group.id should return 400', async () => {
  expect.assertions(2);
    const response = await request(app).post('/exams').set('Authorization', 'Bearer ' + validId).send({
      name: 'dummyGuadagnini',
      teachers: [{//Oggetti di prova presi dal db
          id: 11,
          name: 'Jimmy',
          surname: 'Teacher',
          email: 'dummy@dummy.com',
          born: {year:1967,month:11,day:3,hour:0,minute:0},
          enrolled: {year:2011,month:8,day:31,hour:12,minute:30},
          submission:[]
      }],
      students:{//Oggetto di prova preso dal db
        id:20000,
        creator:11,
        name:'SEII Dummy Class',
        users:[]
      },
      deadline: 2012,
      reviewable: true,
      num_shuffle: 10
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});

//[TODO]
/*test('POST /exams with intersection of students and teachers should return 400', async () => {
  expect.assertions(2);
    const response = await request(app).post('/exams').set('Authorization', 'Bearer ' + validId).send({
        'name': 'Guadagnini',
        'teachers': [dummy.dummyTeacher.id,dummy.dummyStud.id],
        'students': dummy.dummyUserGroup.id,
        'deadline': 2012,
        'reviewable': true,
        'num_shuffle': 10,
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});*/

test('GET /exams/?access_token=validId ; should return 200 + all managable exam', async () => {
  expect.assertions(2);
    //[TODO]Fare query che aggiunge un esame per prendere entrambi gli id, sia dell'esame che del teacher associato all'esame
    const response = await request(app).get('/exams/?access_token=' + validTeacherId);
    expect(response.statusCode).toBe(201);
    expect(response.body).toBeDefined();//[TODO]Da controllare struttura dell'exam ritornato
});

test('GET /exams/ without access_token; should return 401', async () => {
    expect.assertions(2);
    let response = await request(app).get('/exams/');
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({});
});

test('GET /exams/?access_token=invalidId ; should return 401', async () => {
    expect.assertions(2);
    let response = await request(app).get('/exams/?access_token=' + 34543213565);
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({});
});

test('PUT /exams/validId; should return 200 + users obj', async () => {//[TODO]
    expect.assertions(2);
    let response = await request(app).put('/exams/' + validId).set('Authorization', 'Bearer ' + validId).send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('PUT /exams/validId with wrong access token; should return 401 + obj {}', async () => {//[TODO]
    expect.assertions(2);
    let response = await request(app).put('/users/' + validId).set('Authorization', 'Bearer ' + invalidId).send(dummyStud);
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({});
});

test('PUT /exams/invalidId with wrong access token; should return 401 + obj {}', async () => {//[TODO]
    expect.assertions(2);
    let response = await request(app).put('/users/' + invalidId).set('Authorization', 'Bearer ' + invalidId).send(dummyStud);
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({});
});

test('PUT /exams/validId with right access_token but wrong data in body; should return 400', async () => {//[TODO]
    expect.assertions(2);
    let response = await request(app).put('/users/' + validId).set('Authorization', 'Bearer ' + validId).send({
        id: validId,
        name: 'John',
        surname: null
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});

test('PUT /exams/invalidId with right access_token but no body; should return 400', async () => {//[TODO]
    expect.assertions(2);
    let response = await request(app).put('/users/' + invalidId).set('Authorization', 'Bearer ' + validId).send({});
    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({});
});

test('PUT /exams/invalidId with right access_token; should return 400', async () => {//[TODO]
    expect.assertions(2);
    let response = await request(app).put('/users/' + invalidId).set('Authorization', 'Bearer ' + validId).send({
        id: invalidId,
        name: 'Giovanni',
        surname: 'Guadagnini',
        email: 'giovanni.guadagnini@gmail.com',
        enrolled: '2012'
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});

test('PUT /exams/pureStringId with string as id in the uri; should return 400', async () => {//[TODO]
    expect.assertions(2);
    let response = await request(app).put('/users/' + pureStringId).set('Authorization', 'Bearer ' + validId).send(dummyStud);
    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({});
});

test('DELETE /exams/validId; should return 200 + exams obj', async () => {//[TODO]
    expect.assertions(2);
    let response = await request(app).delete('/users/' + validId).set('Authorization', 'Bearer ' + validId).send(dummyStud);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

test('DELETE /exams/invalidId in the uri + invalidAccessToken; should return 401 + {}', async () => {//[TODO]
    expect.assertions(2);
    let response = await request(app).delete('/users/' + invalidId).set('Authorization', 'Bearer ' + validId);
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({});
});

test('DELETE /exams/invalidId in the uri + validAccessToken; should return 400 + {}', async () => {//[TODO]
    expect.assertions(2);
    let response = await request(app).delete('/users/' + invalidId).set('Authorization', 'Bearer ' + validId).send({id: invalidId});
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({});
});
