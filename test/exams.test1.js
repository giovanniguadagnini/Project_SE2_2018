const request = require('supertest');
const app = require('../src/app')

const dummy = require('../src/dummies');
const dummyStud = require('../src/dummies').dummyStud;

const validId = dummyStud.id;
const invalidId = '999999999999999999999999';
const pureStringId = 'aaaaaaaaaaaaaaaaaaaaaa';

test('task module should be defined', () => {
    expect(app).toBeDefined();
});

test('POST /exams with all the parameters; should return 200 + created task', async () => {
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
