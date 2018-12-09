const examsDao = require('../src/db/examsDao');

const dummies = require('../src/dummies');

const exam={
  name :'Esame di prova',
  teachers :[dummyTeacher],
  students : dummyUserGroup,
  deadline :3600,
  reviewable : true,
  num_shuffle :2
};

dummies.popDB();

test('Add an exam with exist teachers,students(userGroup),tasks, num_shuffle<=tasks.size() and id passed', () => {
    expect.assertions(1);
    return examsDao.createExam(id_user,exam).then(valueC => {
        expect(valueC).toBeDefined();
    });
});

test('Add an exam with no id passed', () => {
    expect.assertions(1);
    return examsDao.createExam(exam).then(valueC => {
        expect(valueC).toBe(null);
    });
});

test('Add an exam with invalid JSON object exam passed', () => {
    expect.assertions(1);
    return examsDao.createExam(id_user,{name:'Esame'}).then(valueC => {
        expect(valueC).toBe(null);
    });
});

/*test('check getAllExams() with default filters', () => {
  expect(examsDao.getAllExams(id,"enrol",-1,31,1111)).toBeDefined();
});

test('check getAllUsers() with wrong type in filters parameters', () => {
  expect(examsDao.getAllExams(id,"enrol","13000","31","1111")).toBe(null);
});*/


dummies.cleanDB();
