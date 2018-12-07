const submissionDao = require('./submissionDao');

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
    submissionDao.getSubmissionById(req.user, idSubmission).then( submission => {
        if (submission != null) {
            res.status(200).json(submission);
        } else {
            res.status(404).send('Submission not found');
        }
    });
}

function updateSubmission(){
    var idSubmission = req.params.id;
    var submission = req.submission;
    if (submission != null && submission.id == idSubmission) {
        submission = submissionDao.updateSubmission(req.body, submission);
        if (submission == '403') {//student or teacher can't update the submission
            res.status(403).send('Forbidden');
        } else if (submission != null) {
            res.status(200).json(submission);
        } else {
            res.status(404).send('Submission not found');
        }
    } else {
        res.status(400).send('Bad request');
    }
}

module.exports = {getSubmission, updateSubmission, getAllSubmissions};
