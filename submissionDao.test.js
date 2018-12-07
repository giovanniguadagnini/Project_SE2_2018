const submissionDao = require('./submissionDao');
const dummiesDB = require('./dummies');
const utilities = require('./utilities');

beforeAll(() => {
    return dummiesDB.popDB();
});

afterAll(() => {
    return dummiesDB.cleanDB().then(() => dummiesDB.connection.end();
});

test('submissionDao module should be defined', () => {
    expect(submissionDao).toBeDefined();
});
/*
test('check getAllSubmissions() with user as student', () => {

});

test('check getAllSubmissions() with user as teacher', () => {

});

test('check getAllSubmissions() with user as null ', () => {

});

test('check getSubmission() with user as null', () => {

});

test('check getSubmission() with user as student', () => {

});

test('check getSubmission() with user as teacher', () => {

});

test('check updateSubmission() with null as user', () => {

});

test('check updateSubmission() with user as a student', () => {

});

test('check updateSubmission() with user as a student and exam is already end', () => {

});

test('check updateSubmission() with user as a student and without permissions', () => {

});

test('check updateSubmission() with user as a teacher', () => {

});

test('check updateSubmission() with user as a teacher and while the exam is not yet completed', () => {

});

test('check updateSubmission() with user as a teacher and without permissions', () => {

});

*/
