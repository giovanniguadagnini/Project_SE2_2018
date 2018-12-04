const submissionDao = require('./submissionDao');

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

    submissionDao.getSubmissionById(req.user, idSubmission).then( submission => {
        if (submission != null) {
            res.status(200).json(submission);
        } else {
            res.status(404).send('Submission not found');
        }
    });
}

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
            res.status(403).send('Forbidden');
        } else if (submission != null) {
            res.status(200).json(submission);
        } else {
            res.status(404).send('Submission not found');
        }
        res.status(200).send(submission);
    } else {
        res.status(400).send('Bad request');
    }
}*/

module.exports = {getSubmission};
