const request = require('supertest');
const app = require('../src/app')

const dummies = require('./dummies');

const invalidId = '999999999999999999999999';
const pureStringId = 'aaaaaaaaaaaaaaaaaaaaaa';
const NpCompleteExamId = 65;
const validTeacherId = 11;//Associato a NpCompleteExam

beforeAll(() => {
    jest.setTimeout(15000);
    return dummies.popDB();
});

afterAll(() => {
    return dummies.cleanDB().then(() => dummies.connection.end());
});

describe('GENERIC exam test cases', async () => {
    test('exam module should be defined', () => {
        expect(app).toBeDefined();
    });
});

describe('GET exam test cases', async () => {
    test('GET /exams/?access_token=validId(Owner) ; should return 200 + all managable exam', async () => {
        expect.assertions(2);
        const response = await request(app).get('/exams/?access_token=' + dummies.dummyExam.owner.id);
        expect(response.statusCode).toBe(201);
        expect(response.body).toBeDefined();//[TODO]Da controllare struttura dell'exam ritornato
    });
    test('GET /exams/?access_token=validId(Teacher) ; should return 200 + all managable exam', async () => {
        expect.assertions(2);
        const response = await request(app).get('/exams/?access_token=' + dummies.dummyExam.teachers[0].id);
        expect(response.statusCode).toBe(201);
        expect(response.body).toBeDefined();//[TODO]Da controllare struttura dell'exam ritornato
    });
    test('GET /exams/?access_token=validId(Student that not have exams) ; should return 200 + no exams', async () => {
        expect.assertions(2);
        const response = await request(app).get('/exams/?access_token=' + dummies.dummyStud.id);
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual([]);
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

    test('GET /exams/validId?access_token=validId ; should return 200 + exam', async () => {
        expect.assertions(2);
        const response = await request(app).get('/exams/' + dummies.dummyExam.id + '?access_token=' + dummies.dummyExam.owner.id);
        expect(response.statusCode).toBe(201);
        expect(response.body).toBeDefined();//[TODO]Da controllare struttura dell'exam ritornato
    });
    test('GET /exams/invalidId?access_token=validId ; should return 400 + exam', async () => {
        expect.assertions(2);
        const response = await request(app).get('/exams/' + invalidId + '?access_token=' + dummies.dummyExam.owner.id);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({});
    });
    test('GET /exams/purestringid?access_token=validId with string as id in the uri; should return 400', async () => {
        expect.assertions(2);
        let response = await request(app).get('/exams/' + pureStringId + '?access_token=' + validTeacherId);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({});
    });
    test('GET /exams/validId without access_token; should return 401', async () => {
        expect.assertions(2);
        let response = await request(app).get('/exams/' + dummies.dummyExam.id);
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({});
    });
    test('GET /exams/validId?access_token=invalidId ; should return 401', async () => {
        expect.assertions(2);
        let response = await request(app).get('/exams/' + dummies.dummyExam.id + '?access_token=' + 34543213565);
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({});
    });
});

describe('POST exam test cases', async () => {
    test('POST /exams with all the parameters; should return 200 + created exam', async () => {
        expect.assertions(2);
        const response = await request(app).post('/exams').set('Authorization', 'Bearer ' + dummies.dummyTeacher2.id).send(dummies.dummyExamToInsert);
        expect(response.statusCode).toBe(201);
        expect(response.body).toBeDefined();//[TODO]Da controllare struttura dell'exam ritornato
    });
    test('POST /exams without parameter; should return 400', async () => {
        expect.assertions(2);
        const response = await request(app).post('/exams').set('Authorization', 'Bearer ' + dummies.dummyTeacher2.id).send({});
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({});
    });
    test('POST /exams with an invalid access_token; should return 401', async () => {
        const response = await request(app).post('/exams').set('Authorization', 'Bearer ' + 424412354).send({});
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({});
    });
    test('POST /exams with a pureStringId access_token; should return 401', async () => {
        const response = await request(app).post('/exams').set('Authorization', 'Bearer ' + pureStringId).send({});
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({});
    });
    test('POST /exams with no access token; should return 401', async () => {
        expect.assertions(2);
        const response = await request(app).post('/exams').send({
            name: 'dummyGuadagnini',
            teachers: [{//Oggetti di prova presi dal db
                id: 11,
                name: 'Jimmy',
                surname: 'Teacher',
                email: 'dummy@dummy.com',
                born: { year: 1967, month: 11, day: 3, hour: 0, minute: 0 },
                enrolled: { year: 2011, month: 8, day: 31, hour: 12, minute: 30 },
                submission: []
            }],
            students: {//Oggetto di prova preso dal db
                id: 61,
                creator: 11,
                name: 'SEII Dummy Class',
                users: []
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
        const response = await request(app).post('/exams').set('Authorization', 'Bearer ' + dummies.dummyTeacher2.id).send({
            name: 'dummyGuadagnini',
            teachers: [{//Oggetti di prova presi dal db
                id: 11,
                name: 'Jimmy',
                surname: 'Teacher',
                email: 'dummy@dummy.com',
                born: { year: 1967, month: 11, day: 3, hour: 0, minute: 0 },
                enrolled: { year: 2011, month: 8, day: 31, hour: 12, minute: 30 },
                submission: []
            }],
            students: {//Oggetto di prova preso dal db
                id: 61,
                creator: 11,
                name: 'SEII Dummy Class',
                users: []
            },
            deadline: 2012,
            reviewable: true,
        });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({});
    });
    test('POST /exams with reviewable not boolean should return 400', async () => {
        expect.assertions(2);
        const response = await request(app).post('/exams').set('Authorization', 'Bearer ' + dummies.dummyTeacher2.id).send({
            name: 'dummyGuadagnini',
            teachers: [{//Oggetti di prova presi dal db
                id: 11,
                name: 'Jimmy',
                surname: 'Teacher',
                email: 'dummy@dummy.com',
                born: { year: 1967, month: 11, day: 3, hour: 0, minute: 0 },
                enrolled: { year: 2011, month: 8, day: 31, hour: 12, minute: 30 },
                submission: []
            }],
            students: {//Oggetto di prova preso dal db
                id: 61,
                creator: 11,
                name: 'SEII Dummy Class',
                users: []
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
        const response = await request(app).post('/exams').set('Authorization', 'Bearer ' + dummies.dummyTeacher2.id).send({
            name: 'dummyGuadagnini',
            teachers: [{//Oggetti di prova presi dal db
                id: 11,
                name: 'Jimmy',
                surname: 'Teacher',
                email: 'dummy@dummy.com',
                born: { year: 1967, month: 11, day: 3, hour: 0, minute: 0 },
                enrolled: { year: 2011, month: 8, day: 31, hour: 12, minute: 30 },
                submission: []
            }],
            students: {//Oggetto di prova preso dal db
                id: 20000,
                creator: 11,
                name: 'SEII Dummy Class',
                users: []
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
});

describe('PUT exam test cases', async () => {
    test('PUT /exams/validId and valid access token should return 200 + exam obj', async () => {
        expect.assertions(2);
        let examUpdated = dummies.dummyExam;
        examUpdated.name = "P==Np? False";
        let response = await request(app).put('/exams/' + dummies.dummyExam.id).set('Authorization', 'Bearer ' + dummies.dummyExam.owner.id).send(examUpdated);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
    });
    test('PUT /exams/validId with wrong access token; should return 401 + obj {}', async () => {
        expect.assertions(2);
        let examUpdated = dummies.dummyExam;
        examUpdated.name = "P==Np? False";
        let response = await request(app).put('/exams/' + dummies.dummyExam.id).set('Authorization', 'Bearer ' + 3514213).send(examUpdated);
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({});
    });
    test('PUT /exams/validId with right access_token but wrong data in body; should return 400', async () => {//[TODO]
        expect.assertions(2);
        let response = await request(app).put('/exams/' + dummies.dummyExam.id).set('Authorization', 'Bearer ' + dummies.dummyExam.owner.id).send({
            id: 134132,
            name: 'John',
            surname: null
        });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({});
    });
    test('PUT /exams/invalidId with right access_token and no body; should return 400', async () => {//[TODO]
        expect.assertions(2);
        let response = await request(app).put('/exams/' + 253413214).set('Authorization', 'Bearer ' + dummies.dummyExam.owner.id).send({});
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({});
    });
});

describe('DELETE exam test cases', async () => {
    test('DELETE /exams/validId; should return 200 + exams obj', async () => {//[TODO]
        expect.assertions(2);
        let response = await request(app).delete('/exams/' + dummies.dummyExam.id).set('Authorization', 'Bearer ' + dummies.dummyExam.owner.id).send(dummies.dummyExam);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
    });
    test('DELETE /exams/invalidId in the uri + invalidAccessToken; should return 401 + {}', async () => {//[TODO]
        expect.assertions(2);
        let response = await request(app).delete('/exams/' + invalidId).set('Authorization', 'Bearer ' + 36452423546).send(dummies.dummyExam);
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({});
    });
    test('DELETE /exams/invalidId in the uri + validAccessToken; should return 400 + {}', async () => {//[TODO]
        expect.assertions(2);
        let response = await request(app).delete('/exams/' + 645645342).set('Authorization', 'Bearer ' + dummies.dummyExam.owner.id).send();
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({});
    });
    test('DELETE /exams/validIdButNotOwner in the uri + validAccessToken; should return 400 + {}', async () => {//[TODO]
        expect.assertions(2);
        let response = await request(app).delete('/exams/' + dummies.dummyExam.id).set('Authorization', 'Bearer ' + dummies.dummyExam.teachers[0].id).send();
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({});
    });
});