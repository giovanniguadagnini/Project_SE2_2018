const submissionDao = require('./submissionDao');
const dummiesDB = require('./dummies');
const utilities = require('./utilities');

const dummyStud = dummiesDB.dummyStud;
const dummyTeacher = dummiesDB.dummyTeacher;
const dummyTeacher2 = dummiesDB.dummyTeacher2;
const dummySubm1 = dummiesDB.dummySubmission1;
const dummySubm2 = dummiesDB.dummySubmission2;

beforeAll(() => {
    return dummiesDB.popDB();
});

afterAll(() => {
    return dummiesDB.cleanDB().then(() => dummiesDB.connection.end());
});

test('submissionDao module should be defined', () => {
    expect(submissionDao).toBeDefined();
});

test('check getAllSubmissions() with user as student', () => {
    expect.assertions(2);
    console.log(dummyStud);
    return submissionDao.getAllSubmissions(dummyStud).then(submissions => {
        console.log("CIAO: " + submissions);
        expect(submissions.length).toBe(3);
        expect(utilities.isAnArrayOfSubmission(submissions)).toBe(true);
    });
});

test('check getAllSubmissions() with user as teacher', () => {
    expect.assertions(2);
    return submissionDao.getAllSubmissions(dummyTeacher).then(submissions => {
        expect(submissions.length).toBe(3);
        expect(utilities.isAnArrayOfSubmission(submissions)).toBe(true);
    });
});

test('check getAllSubmissions() with user as null ', () => {
    expect.assertions(1);
    return submissionDao.getAllSubmissions(null).then(submissions => {
        expect(submissions).toBe(null);
    });
});

test('check getSubmission() with user as null', () => {
    expect.assertions(1);
    return submissionDao.getSubmission(null, null).then(submissions => {
        expect(submissions).toBe(null);
    });
});

test('check getSubmission() with user as student', () => {
    expect.assertions(2);
    return submissionDao.getSubmission(dummyStud, dummySubm1.id).then(submission => {
        expect(utilities.isASubmission(submission)).toBe(true);
        expect(submission).toEqual(dummySubm1);
    });
});

test('check getSubmission() with user as teacher', () => {
    expect.assertions(2);
    return submissionDao.getSubmission(dummyTeacher, dummySubm1.id).then(submission => {
        expect(utilities.isASubmission(submission)).toBe(true);
        expect(submission).toEqual(dummySubm1);
    });
});

test('check getSubmission() with user as teacher without privileges', () => {
    expect.assertions(1);
    return submissionDao.getSubmission(dummyTeacher2, dummySubm1.id).then(submission => {
        expect(submission).toBe(null);
    });
});
/*
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
