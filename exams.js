const examDao = require('./examsDao');

function createExam(req, res) { //Create an exam
    let id=req.user.id;
    var exam = {
      name : req.body.name,
      teachers : req.body.teachers,
      students : req.body.students,
      deadline : req.body.deadline,
      reviewable : req.body.reviewable,
      num_shuffle : req.body.num_shuffle
    };
    exam = examDao.createExam(id,exam);//trying to create the exam
    if (exam != null) {
        res.status(201).json(exam);
    } else {
        res.status(400).send("Bad Request");
    }
};
/*
app.route('/exams')
    .get(function(req, res) { //Get all managable exams
        var sortStudBy = req.query.sortStudBy;
        if(sortStudBy == null){
            sortStudBy ="enrol";
        }
        var minStudByMark = req.query.minStudByMark;
        if(minStudByMark == null) {
            minStudByMark = -1;
        }
        var maxStudByMark = req.query.maxStudByMark;
        if(maxStudByMark == null) {
            maxStudByMark = 31;
        }
        var taskType = req.query.taskType;
        if(taskType == null) {
            taskType = "1111";
        }
        var exams = examDao.getAllExams(req.user.id,sortStudBy, minStudByMark,maxStudByMark,taskType);
        if(exams != null) {
            res.status(200).send(exams);
        } else {
            res.status(400).send("Bad request");
        }
    })
    .post(function(req, res) { //Create an exam
        let id = req.params.id;
        var exam = {
          name : req.body.name,
          teachers : req.body.teachers,
          students : req.body.students,
          deadline : req.body.deadline,
          reviewable : req.body.reviewable,
          num_shuffle : req.body.num_shuffle
        };
        exam = examDao.createExam(id,exam);//trying to create the exam
        if (exam != null) {
            res.status(201).json(exam);
        } else {
            res.status(400).send("Bad Request");
        }
    });
*/

function getExam(req, res) { //Get an exam
  let id = req.params.id;
  if(id == parseInt(id, 10)) {//Se l'id è un intero
    let exam = examDao.getExam(req.user.id,id);
    if (exam != null) {
        res.status(200).send(exam);
    } else {
        res.status(400).send("Bad Request");
    }
  }else{
      res.status(400).send("Invalid ID");
  }
};
/*app.route('/exams/:id')
    .get(function(req, res) {
        var id = req.id;
        if(Number.isInteger(id) == true) {
            var sortStudBy = req.query.sortStudBy;
            if(sortStudBy == null){
                sortStudBy ="enrol";
            }
            var minStudByMark = req.query.minStudByMark;
            if(minStudByMark == null) {
                minStudByMark = -1;
            }
            var maxStudByMark = req.query.maxStudByMark;
            if(maxStudByMark == null) {
                maxStudByMark = 31;
            }
            var taskType = req.query.taskType;
            if(taskType == null) {
                taskType = 1111;
            }
            var exam = examDao.getExam(req.user.id,id,sortStudBy, minStudByMark,maxStudByMark,taskType);
            if (exam != null) {
                res.status(200).send(exam);
            } else {
                res.status(404).send("Exam not found");
            }
        }else{
            res.status(400).send("Invalid ID");
        }
    })
    .put(function(req, res) {
        var id = req.id;
        if(Number.isInteger(id) == true) {
            var exam = {
              id: req.body.id,
              name : req.body.name,
              owner : req.body.owner,
              teachers : req.body.teachers,
              students : req.body.students,
              tasks : req.body.tasks,
              submissions : req.body.submissions,
              deadline : req.body.deadline,
              reviewable : req.body.reviewable,
              num_shuffle : req.body.num_shuffle
            };
            exam = examDao.updateExam(req.user.id,exam);
            if (exam != null) {
                res.status(200).send(exam);
            } else {
                res.status(404).send("Exam not found");
            }
        }else{
            res.status(400).send("Invalid ID");
        }

    })
    .delete(function(req, res) {
        var id = req.id;
        if(Number.isInteger(id) == true) {
            exam = examDao.deleteExam(req.user.id,id);
            if (exam != null) {
                res.status(200).send(exam);
            } else {
                res.status(404).send("Exam not found");
            }
        }else{
            res.status(400).send("Invalid ID");
        }

    });;*/


module.exports = {createExam,getExam};
