const submissionDao = require('../src/db/submissionDao');
const dummiesDB = require('./dummies');
const utilities = require('../src/utilities');

const dummyStud = dummiesDB.dummyStud;
const dummyTeacher = dummiesDB.dummyTeacher;
const dummyUserNoProvileges = dummiesDB.dummyStud2;
const dummySubm1 = dummiesDB.dummySubmission1;
const dummySubm2 = dummiesDB.dummySubmission2;

beforeAll(() => {
    return dummiesDB.popDB();
});

afterAll(() => {
    return dummiesDB.cleanDB().then(() => dummiesDB.connection.end());
});

describe('GENERIC submissionDao test cases', async () => {
    test('submissionDao module should be defined', () => {
        expect(submissionDao).toBeDefined();
    });
});

describe('getAllSubmissions method submissionDao test cases', async () => {
    test('check getAllSubmissions() with user as student: should return array of submissions', () => {
        expect.assertions(2);
        return submissionDao.getAllSubmissions(dummyStud).then(submissions => {
            expect(submissions.length).toBe(4);
            expect(utilities.isAnArrayOfSubmission(submissions)).toBe(true);
        });
    });

    test('check getAllSubmissions() with user as teacher: should return array of submissions', () => {
        expect.assertions(2);
        return submissionDao.getAllSubmissions(dummyTeacher).then(submissions => {
            expect(submissions.length).toBe(4);
            expect(utilities.isAnArrayOfSubmission(submissions)).toBe(true);
        });
    });

    test('check getAllSubmissions() by exam with user as teacher: should return array of submissions', () => {
        expect.assertions(2);
        return submissionDao.getAllSubmissions(dummyTeacher, dummiesDB.dummyExam).then(submissions => {
            expect(submissions.length).toBe(3);
            expect(utilities.isAnArrayOfSubmission(submissions)).toBe(true);
        });
    });

    test('check getAllSubmissions() with user as null: should return null', () => {
        expect.assertions(1);
        return submissionDao.getAllSubmissions(null).then(submissions => {
            expect(submissions).toBe(null);
        });
    });

    test('check getAllSubmission() with user without any privileges: should return an empty array', () => {
        expect.assertions(1);
        return submissionDao.getAllSubmissions(dummyUserNoProvileges).then(submissions => {
            expect(submissions).toEqual([]);
        });
    });

});

describe('getSubmissionsByExam method submissionDao test cases', async () => {
    test('check getSubmissionsByExam() with user as teacher: should return array of submissions', () => {
        expect.assertions(2);
        return submissionDao.getSubmissionsByExam(dummyTeacher, dummiesDB.dummyExam).then(submissions => {
            expect(submissions.length).toBe(3);
            expect(utilities.isAnArrayOfSubmission(submissions)).toBe(true);
        });
    });

    test('check getSubmissionsByExam() with user as student: should return null', () => {
        expect.assertions(1);
        return submissionDao.getSubmissionsByExam(dummyStud, dummiesDB.dummyExam).then(submissions => {
            expect(submissions).toBe(null);
        });
    });

    test('check getSubmissionsByExam() with user as teacher & exam == null: should return null', () => {
        expect.assertions(1);
        return submissionDao.getSubmissionsByExam(dummyTeacher, null).then(submissions => {
            expect(submissions).toBe(null);
        });
    });

    test('check getSubmissionsByExam() with user as teacher & exam != null, but with no id: should return null', () => {
        expect.assertions(1);
        return submissionDao.getSubmissionsByExam(dummyTeacher, {banana: 'Very good fruit'}).then(submissions => {
            expect(submissions).toBe(null);
        });
    });
});

describe('getSubmission method submissionDao tests', async () => {
    test('check getSubmission() with user as null: should return null', () => {
        expect.assertions(1);
        return submissionDao.getSubmission(null, null).then(submissions => {
            expect(submissions).toBe(null);
        });
    });

    test('check getSubmission() with user as student: should return a valid submission', () => {
        expect.assertions(3);
        return submissionDao.getSubmission(dummyStud, dummySubm1.id).then(submission => {
            expect(utilities.isASubmission(submission)).toBe(true);
            expect(submission.id_user).toEqual(dummySubm1.id_user);
            expect(submission.id_exam).toEqual(dummySubm1.id_exam);
        });
    });

    test('check getSubmission() with user as teacher: should return a valid submission', () => {
        expect.assertions(3);
        return submissionDao.getSubmission(dummyTeacher, dummySubm1.id).then(submission => {
            expect(utilities.isASubmission(submission)).toBe(true);
            expect(submission.id_user).toEqual(dummySubm1.id_user);
            expect(submission.id_exam).toEqual(dummySubm1.id_exam);
        });
    });

    test('check getSubmission() with user without privileges: should return null', () => {
        expect.assertions(1);
        return submissionDao.getSubmission(dummyUserNoProvileges, dummySubm1.id).then(submission => {
            expect(submission).toBe(null);
        });
    });

});

describe('updateSubmission method submissionDao test cases', async () => {
    test('check updateSubmission() as teacher with null as user: should return null', () => {
        expect.assertions(1);
        dummySubm1.earned_points = 10;
        dummySubm1.comment = 'Very good!';
        return submissionDao.updateSubmission(null, dummySubm1).then(submission => {
            expect(submission).toBe(null);
        });
    });

    test('check updateSubmission() as teacher with invalid user: should be forbidden', () => {
        expect.assertions(1);
        let dummySubmFin = dummiesDB.dummySubmission1Finished;
        dummySubmFin.comment = 'Sehr gut';
        dummySubmFin.earned_points = dummySubmFin.points - 1;
        return submissionDao.updateSubmission({id:99}, dummySubmFin).then(submission => {
            expect(submission).toBe('403');
        });
    });

    test('check updateSubmission() as student with invalid user: should be a bad request', () => {
        expect.assertions(1);
        dummySubm1.answer = 'For me it\'s an apple';
        return submissionDao.updateSubmission({id:99}, dummySubm1).then(submission => {
            expect(submission).toBe('400');// he thinks it's a teacher
        });
    });

    test('check updateSubmission() with valid student that wants to submit an answer: should return a valid answered submission', () => {
        expect.assertions(6);
        dummySubm1.answer = 'I think the answer is 42';
        return submissionDao.updateSubmission(dummyStud, dummySubm1).then(submission => {
            expect(submission.id).toBe(dummySubm1.id);
            expect(submission.id_exam).toBe(dummySubm1.id_exam);
            expect(submission.id_user).toBe(dummySubm1.id_user);
            expect(submission.answer).toBe(dummySubm1.answer);
            expect(submission.earned_points).toBe(null);
            expect(submission.comment).toBe(null);
        });
    });

    test('check updateSubmission() with valid student that wants to submit an answer: should return a valid submission answered & marked as completed', () => {
        expect.assertions(7);
        dummySubm1.answer = 'Nah... it was 43: I\'m sure now';
        dummySubm1.completed = true;
        return submissionDao.updateSubmission(dummyStud, dummySubm1).then(submission => {
            expect(submission.id).toBe(dummySubm1.id);
            expect(submission.id_exam).toBe(dummySubm1.id_exam);
            expect(submission.id_user).toBe(dummySubm1.id_user);
            expect(submission.answer).toBe(dummySubm1.answer);
            expect(submission.completed == true).toBe(true);
            expect(submission.earned_points).toBe(null);
            expect(submission.comment).toBe(null);
        });
    });

    test('check updateSubmission() with valid student that wants to submit a null answer: should be read as a bad request', () => {
        expect.assertions(1);
        dummySubm1.answer = null;
        return submissionDao.updateSubmission(dummyStud, dummySubm1).then(submission => {
            expect(submission).toBe('400');
        });
    });

    test('check updateSubmission() with valid student that wants to submit an answer, but can\'t because is already finished: should be forbidden', () => {
        expect.assertions(1);
        let dummySubmFin = dummiesDB.dummySubmission1Finished;
        dummySubmFin.comment = 'Sehr gut';
        dummySubmFin.earned_points = dummySubmFin.points - 1;
        return submissionDao.updateSubmission(dummyStud, dummySubmFin).then(submission => {
            expect(submission).toBe('403');
        });
    });

    test('check updateSubmission() with valid teacher that wants to mark & evaluate: should return a valid submission marked and evaluated', () => {
        expect.assertions(6);
        let dummySubmFin = dummiesDB.dummySubmission1Finished;
        dummySubmFin.comment = 'Sehr gut';
        dummySubmFin.earned_points = dummySubmFin.points - 1;
        return submissionDao.updateSubmission(dummyTeacher, dummySubmFin).then(submission => {
            expect(submission.id).toBe(dummySubmFin.id);
            expect(submission.id_exam).toBe(dummySubmFin.id_exam);
            expect(submission.id_user).toBe(dummySubmFin.id_user);
            expect(submission.answer).toBe(dummySubmFin.answer);
            expect(submission.earned_points).toBe(dummySubmFin.earned_points);
            expect(submission.comment).toBe(dummySubmFin.comment);
        });
    });

    test('check updateSubmission() with valid teacher that wants to mark & evaluate, but can\'t because exam is not finished yet: should be forbidden', () => {
        expect.assertions(1);
        dummySubm1.comment = 'Sehr gut....hooooooola';
        dummySubm1.earned_points = dummySubm1.points - 1;
        return submissionDao.updateSubmission(dummyTeacher, dummySubm1).then(submission => {
            expect(submission).toBe('403');
        });
    });


    test('check updateSubmission() with valid teacher that wants to mark & evaluate, but can\'t because comment is not defined: should be a bad request', () => {
        expect.assertions(1);
        let dummySubmFin = dummiesDB.dummySubmission1Finished;
        dummySubmFin.comment = null;
        dummySubmFin.earned_points = dummySubmFin.points - 1;
        return submissionDao.updateSubmission(dummyTeacher, dummySubmFin).then(submission => {
            expect(submission).toBe('400');
        });
    });

    test('check updateSubmission() with valid teacher that wants to mark & evaluate, but can\'t because earned_points is not defined: should be a bad request', () => {
        expect.assertions(1);
        let dummySubmFin = dummiesDB.dummySubmission1Finished;
        dummySubmFin.comment = 'Better than watching spongebob';
        dummySubmFin.earned_points = null;
        return submissionDao.updateSubmission(dummyTeacher, dummySubmFin).then(submission => {
            expect(submission).toBe('400');
        });
    });

    test('check updateSubmission() with valid teacher that wants to mark & evaluate, but can\'t because earned_points is greater than points: should be a bad request', () => {
        expect.assertions(1);
        let dummySubmFin = dummiesDB.dummySubmission1Finished;
        dummySubmFin.comment = 'Better than watching spongebob';
        dummySubmFin.earned_points = dummySubmFin.points + 1;
        return submissionDao.updateSubmission(dummyTeacher, dummySubmFin).then(submission => {
            expect(submission).toBe('400');
        });
    });

    test('check updateSubmission() with valid teacher that wants to mark & evaluate, but can\'t because earned_points is less than 0: should be a bad request', () => {
        expect.assertions(1);
        let dummySubmFin = dummiesDB.dummySubmission1Finished;
        dummySubmFin.comment = 'Better than watching spongebob';
        dummySubmFin.earned_points = -1;
        return submissionDao.updateSubmission(dummyTeacher, dummySubmFin).then(submission => {
            expect(submission).toBe('400');
        });
    });
});

describe('cleanExamSubmission method submissionDao test cases', async () => {
    test('check cleanExamSubmissions() by exam with user as student: should not delete the submissions', () => {
        expect.assertions(2);
        return submissionDao.cleanExamSubmissions(dummyStud, dummiesDB.dummyExam).then(result => {
            expect(result).toBe(null);
            return submissionDao.getSubmissionsByExam(dummyTeacher, dummiesDB.dummyExam).then(submissions => {
                expect(submissions.length).toBe(3);
            });
        });
    });

    test('check cleanExamSubmissions() by exam with user as teacher: should delete the submissions', () => {
        expect.assertions(2);
        return submissionDao.cleanExamSubmissions(dummyTeacher, dummiesDB.dummyExam).then(result => {
            expect(result).toBe(true);
            return submissionDao.getSubmissionsByExam(dummyTeacher, dummiesDB.dummyExam).then(submissions => {
                expect(submissions.length).toBe(0);
            });
        });
    });
});

