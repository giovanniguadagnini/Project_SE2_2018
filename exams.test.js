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
  expect(examsDao.createExam(id_user,exam)).toBe({
    id : ,//Da controllare se è un intero
    name :'Esame di prova',
    owner : id_user,
    teachers :[dummies.dummyTeacher],
    students : dummies.dummyUserGroup,
    tasks : [],
    submissions: [],
    deadline :3600,
    reviewable : true,
    num_shuffle :2
  });
});

test('No id passed', () => {
  expect(examsDao.createExam(exam)).toBe(null);
});

test('Invalid JSON object exam', () => {
  expect(examsDao.createExam(id_user,{name:'Esame'})).toBe(null);
});

dummies.cleanDB();
