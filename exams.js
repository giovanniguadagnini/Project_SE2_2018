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

function getAllExams(req, res) { //Get all managable exams
  let exams = examDao.getAllExams(req.user.id);
  if(exams != null) {
      res.status(200).send(exams);
  } else {
      res.status(400).send("Bad request");
  }
};

function getExam(req, res) { //Get an exam by id
  let id_exam = req.params.id;
  if(id_exam == parseInt(id_exam, 10)) {//Se l'id è un intero
    let exam = examDao.getExam(req.user.id,id_exam);
    if (exam != null) {
        res.status(200).send(exam);
    } else {
        res.status(400).send("Bad Request");
    }
  }else{
      res.status(400).send("Invalid ID");
  }
};

function updateExam(req, res) {
  let id_exam = req.params.id;
  if(id_exam == parseInt(id_exam, 10)) {
    var exam = {
      name : req.body.name,
      teachers : req.body.teachers,
      students : req.body.students,
      deadline : req.body.deadline,
      reviewable : req.body.reviewable,
      num_shuffle : req.body.num_shuffle
    };
    exam = examDao.createExam(req.user.id,exam);//trying to update the exam
    if (exam != null) {
        res.status(201).json(exam);
    } else {
        res.status(400).send("Bad Request");
    }
  }else{
      res.status(400).send("Invalid ID");
  }
};

function deleteExam(req, res) {
  let id_exam = req.params.id;
  if(id_exam == parseInt(id_exam, 10)) {
      exam = examDao.deleteExam(req.user.id,id);
      if (exam != null) {
          res.status(200).send(exam);
      } else {
          res.status(404).send("Exam not found");
      }
  }else{
      res.status(400).send("Invalid ID");
  }

};

module.exports = {createExam,getExam,getAllExams,updateExam,deleteExam};
