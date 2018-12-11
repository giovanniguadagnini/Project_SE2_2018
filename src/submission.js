const submissionDao = require('./db/submissionDao');

function getAllSubmissions(req, res) { //Get all manageable submissions
    submissionDao.getAllSubmissions(req.user).then(submissions => {
        if (submissions != null) {
            res.status(200).json(submissions);
        } else {
            res.status(500).send('Internal Server Error');
        }
    });
}

function getSubmissionById(req, res) {
    let idSubmission = req.params.id;
    submissionDao.getSubmission(req.user, idSubmission).then(submission => {
        if (submission != null) {
            res.status(200).json(submission);
        } else {
            res.status(404).send('Submission not found');
        }
    });
}

function updateSubmission(req, res) {
    let submission = {
        id: req.body.id,
        id_user: req.body.id_user,
        id_exam: req.body.id_exam,
        task_type: req.body.task_type,
        question: req.body.question,
        answer: req.body.answer,
        completed: req.body.completed,
        points: req.body.points,
        earned_points: req.body.earned_points,
        comment: req.body.comment,
        comment_peer: req.body.comment_peer
    };

    if (submission.id != req.params.id)
        res.status(400).send('Bad request');
    else {
        submissionDao.updateSubmission(req.user, submission).then(updSubmission => {
            if (updSubmission == '400') {
                res.status(400).send('Bad request');
            } else if (updSubmission == '403') {
                res.status(403).send('Forbidden');
            } else if (updSubmission != null) {
                res.status(200).json(updSubmission);
            } else {
                res.status(404).send('Submission not found');
            }
        });
    }
}

module.exports = { getSubmissionById, updateSubmission, getAllSubmissions };
