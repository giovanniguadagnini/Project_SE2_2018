const createExam = require('./createExam');

const dummyStud = require('./constdummyStud');
const dummyTeacher = require('./dummyTeacher');
const dummyUserGroup = require('./dummyUserGroup');
const dummyTask1 = require('./dummyTask1');
const dummyTask2 = require('./dummyTask2');
const dummyTask3 = require('./dummyTask3');
const dummySubmission1 = require('./dummySubmission1');
const dummySubmission2 = require('./dummySubmission2');
const dummySubmission3 = require('./dummySubmission3');
const dummyExam = require('./dummyExam');
const popDB = require('./popDB');
const cleanDB = require('./cleanDB');

const exam={
  name :'Esame di prova',
  teachers :[dummyTeacher],
  students : dummyUserGroup,
  tasks : [dummyTask1,dummyTask2],
  deadline :3600,
  reviewable : true,
  num_shuffle :2
};

test('Add an exam with exist teachers,students(userGroup),tasks and num_shuffle<=tasks.size()', () => {
  const popDB = require('./popDB');
  expect(createExam(id_user,{
    name :'Esame di prova',
    teachers :[dummyTeacher],
    students : dummyUserGroup,
    deadline :3600,
    reviewable : true,
    num_shuffle :2
  })).toBe({
    id : ,
    name :'Esame di prova',
    owner : id_user,
    teachers :[dummyTeacher],
    students : dummyUserGroup,
    tasks : [],
    submissions: [],
    deadline :3600,
    reviewable : true,
    num_shuffle :2
  });
  const cleanDB = require('./cleanDB');
});

test('No id passed', () => {
  const popDB = require('./popDB');
  expect(createExam(exam)).toBe(null);
  const cleanDB = require('./cleanDB');
});

test('Invalid JSON object exam', () => {
  const popDB = require('./popDB');
  expect(createExam(id_user,{name:'Esame'})).toBe(null);
  const cleanDB = require('./cleanDB');
});
