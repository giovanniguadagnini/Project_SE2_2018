const app = require('./app');
const userDao = require('./userDao');
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
        var exams = userDao.getAllExams(req.user.id,sortStudBy, minStudByMark,maxStudByMark,taskType);
        if(exams != null) {
            res.status(200).send(exams);
        } else {
            res.status(400).send("Bad request");
        }
    })
    .post(function(req, res) { //Create an exam
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
        exam = userDao.createExam(req.user.id,exam);//trying to create the exam
        if (exam != null) {
            res.status(200).send(exam);
        } else {
            res.status(405).send("Invalid input");
        }
    });

app.route('/exams/:id')
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
            var exam = userDao.getExam(req.user.id,id,sortStudBy, minStudByMark,maxStudByMark,taskType);
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
            exam = userDao.updateExam(req.user.id,exam);
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
            exam = userDao.deleteExam(req.user.id,id);
            if (exam != null) {
                res.status(200).send(exam);
            } else {
                res.status(404).send("Exam not found");
            }
        }else{
            res.status(400).send("Invalid ID");
        }

    });;
