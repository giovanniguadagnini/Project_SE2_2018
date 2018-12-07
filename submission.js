const submissionDao = require('./submissionDao');

<<<<<<< HEAD
/*function getAllSubmissions(req, res){ //Get all manageable submissions

    var id_user = -1; // THIS HAS TO BE DEFINED BY SESSION INFO

    if (id_user < 0) {// user not found => bad request
        res.status(403).send('Forbidden');
        return;
    }

    var submissions = submissionDao.getAllSubmissions(id_user);
    if (submissions != null) {
        res.status(200).json(submissions);
    } else {
        res.status(404).send('No submission found');
    }
}*/

function getSubmission(req, res){
    let idSubmission = req.params.id;

=======
function getAllSubmissions(req, res){ //Get all manageable submissions
    submissionDao.getAllSubmissions(req.user).then(submissions => {
        if (submissions != null) {
            res.status(200).json(submissions);
        } else {
            res.status(404).send('No submission found');
        }
    });
}

function getSubmission(req, res){
    let idSubmission = req.params.id;
>>>>>>> 7bc22fa22d1fad633536ef3a62d1ca128e3f22d6
    submissionDao.getSubmissionById(req.user, idSubmission).then( submission => {
        if (submission != null) {
            res.status(200).json(submission);
        } else {
            res.status(404).send('Submission not found');
        }
    });
}

<<<<<<< HEAD
/*
function updateSubmission(){
    var id = req.params.id;
    //perform logic in order to establish who he/she is
    var id_user = -1; // THIS HAS TO BE DEFINED BY SESSION INFO
    if (id_user < 0) {// user not found => bad request
        res.status(403).send('Forbidden');
        return;
    }

    var submission = req.body.subm;

    if (submission != null && submission.id == id) {
        submission = submissionDao.updateSubmission(submission);
        if (submission == 403) {
=======
function updateSubmission(){
    var idSubmission = req.params.id;
    var submission = req.submission;
    if (submission != null && submission.id == idSubmission) {
        submission = submissionDao.updateSubmission(req.body, submission);
        if (submission == '403') {//student or teacher can't update the submission
>>>>>>> 7bc22fa22d1fad633536ef3a62d1ca128e3f22d6
            res.status(403).send('Forbidden');
        } else if (submission != null) {
            res.status(200).json(submission);
        } else {
            res.status(404).send('Submission not found');
        }
<<<<<<< HEAD
        res.status(200).send(submission);
    } else {
        res.status(400).send('Bad request');
    }
}*/

module.exports = {getSubmission};
=======
    } else {
        res.status(400).send('Bad request');
    }
}

module.exports = {getSubmission, updateSubmission, getAllSubmissions};
>>>>>>> 7bc22fa22d1fad633536ef3a62d1ca128e3f22d6
