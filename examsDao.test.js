const examsDao = require('./examsDao');

const dummies = require('./dummies');

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
  expect(examsDao.createExam(id_user,exam)).toBeDefined;
});

test('No id passed', () => {
  expect(examsDao.createExam(exam)).toBe(null);
});

test('Invalid JSON object exam', () => {
  expect(examsDao.createExam(id_user,{name:'Esame'})).toBe(null);
});

test('check getAllExams() with default filters', () => {
  expect(examsDao.getAllExams(id,"enrol",-1,31,1111)).toBeDefined();
});

test('check getAllUsers() with wrong type in filters parameters', () => {
  expect(examsDao.getAllExams(id,"enrol","13000","31","1111")).toBe(null);
});


dummies.cleanDB();
