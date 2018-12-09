const userDao = require('./userDao');
const userGroupsDao = require('./userGroupsDao');
//const submissionsDao = require('./submissionsDao');
const taskDao = require('./taskDao');
const submissionsDao = require('./submissionDao');

const utilities = require('./utilities');
const connection = utilities.connection;

function createExam(loggedUser, exam){
  return new Promise(resolveExt => {
    let promise = new Promise(function(resolve, reject) {
      //Controllo sul tipo e sul passaggio o meno dei parametri
      if (utilities.isExamBody(exam)){
        //Controllo se i teacher passati sono user
        let id_teachers = '';
        for(let i = 0; i < exam.teachers.length; i++){
          if(i+1 < exam.teachers.length)
            id_teachers = 'id = ' + exam.teachers[i].id + ' OR ';
          else
          id_teachers = 'id = ' + exam.teachers[i].id;
        }

        connection.query('SELECT id FROM user WHERE ', [teacher.id],function (error, results, fields) {
            if (error) {
                throw error;
                resolve(null);
            }
            if (results.length == exam.teachers.length) {
              resolve(true);
            }else {
              resolve(null);
            }
        });

      }else {
        resolve(null);
      }
    });

    promise.then(function(result) {
      if(result){//Se ha passato il controllo precedente
        //Controllo intersezione di user group con i teacher
        userGroupsDao.getUserGroup(loggedUser,exam.students.id).then( userGroup => {
          for(let user of userGroup.users){
            for(let teacher of exam.teachers)
              if(user.id == teacher.id)
                return false;
          }
          return true;
        });
      }else{
        return null;
      }
    }).then(function(result){
      if(result){
        let start_time = null;
        if (exam.start_time != null && utilities.isAValidDate(exam.start_time))
              start_time = exam.start_time.year + '-' + exam.start_time.month + '-' + exam.start_time.day + ' ' + exam.start_time.hour + ':' + exam.start_time.minute + ':' + exam.start_time.second;

        let deadline = null;
        if (exam.deadline != null && utilities.isAValidDate(exam.deadline))
              deadline = exam.deadline.year + '-' + exam.deadline.month + '-' + exam.deadline.day + ' ' + exam.deadline.hour + ':' + exam.deadline.minute + ':' + exam.deadline.second;
        //Inserisco il nuovo esame
        let id_exam;
        connection.query('INSERT INTO exam (id_group, id_owner, name, start_time, deadline, reviewable, num_shuffle) VALUES (?,?,?,?,?,?,?)',[exam.students.id,loggedUser.id, exam.name,start_time,deadline, exam.reviewable, exam.num_shuffle],function (error, results, fields) {
            if (error) {
              throw error;
              return null;
            }
            id_exam=results.insertId;
            return id_exam;
        });
      }else{//Altrimenti
        return null;
      }
    }).then(function(id_exam) {
      if(id_exam!=null){//Se ha passato l'inserimento precedente
        let insertTeachers = [];
        let insertTPromise;
        for(let teacher of exam.teachers){
          insertTPromise = new Promise(resolve => {
            connection.query('INSERT INTO teacher_exam (id_exam, id_teacher) VALUES (?,?)',[id_exam, teacher.id],function (error, results, fields) {
              if (error){
                throw error;
              }

              resolve(null);
            });
          });
          insertTeachers.push(insertTPromise);
        }

        return Promise.all(insertTeachers).then(d => {return id_exam});

      }else{//Altrimenti
          return null;
      }
    }).then(function(id_exam) {
      if(id_exam!=null){

          let insertTasks = [];
          let insertTPromise;
          let userSubmissions = [];

          for(let user of exam.students.users){
              userSubmissions.push({
                id_student: user.id,
                submissions: []
              });
          }

          let submissionTemplates = [];

          for(let task of exam.tasks){
            insertTPromise = new Promise(resolve => {
              connection.query('INSERT INTO exam_task (id_exam, id_task) VALUES (?,?)',[exam.id,task.id],function (error, results, fields) {
                if (error){
                  throw error;
                }

                let submission = {
                  id: null,
                  id_task: task.id,
                  task_type: task.task_type,
                  question: {
                      text: task.question.text,
                      possibilities: task.question.possibilities,
                      base_upload_url: task.question.base_upload_url
                  },
                  answer: null,
                  id_user: null,
                  id_exam: id_exam,
                  completed: false,
                  comment_peer: [],
                  comment: null,
                  points: task.points,
                  earned_points: null
                };

                submissionTemplates.push(submission);
                resolve(null);
              });
            });
            insertTasks.push(insertTPromise);
          }

          Promise.all(insertTasks).then(d => {
            for(let userSubm of userSubmissions){
              while(userSubm.submissions.length < exam.num_shuffle){
                let n = parseInt(+(Math.random() * submissionTemplates.length), 10);
                let found = false;
                for(let i=0; i < userSubm.submissions.length; i++){
                  if(userSubm.submissions[i].id_task == submissionTemplates[n].id_task)
                    found = true;
                }
                if(!found){
                  userSubm.submissions.push(submissionTemplates[n]);
                }
              }
            }
            /*submissionDao.insertInExam(loggedUser, userSubmissions).then( result => {
              if(result != null)
                return id_exam
              else
                return null

            });*/
          });
        return id_exam;
      }else{//Altrimenti
        return null;
      }
    }).then(function(id_exam) {
      if(id_exam!=null){
        getExam(loggedUser,id_exam).then(newExam => {resolveExt(newExam)});
      }else{
        resolveExt(null);
      }
    });
  });
}

function getAllExams(loggedUser){
  return new Promise(resolveExt => {
    let promise = new Promise(function(resolve, reject){
      //Ricavo tutti gli esami di cui sono owner
      let exams=[];
      connection.query('SELECT id FROM exam WHERE id_owner = ? ', [loggedUser.id], function (error, results, fields) {
        if (error) {
            throw error;
            resolve(null);
        }
        let ExamsP = [];
        let examPromise;
        for(let exam of results){
          examPromise = getExam(id_user,exam.id);
          ExamsP.push(examPromise);
          examPromise.then(ex => {
              exams.push(ex);
          });
        }

        resolve(Promise.all(ExamsP).then(d => {return exams}));
      });
    });

    promise.then(function(result) {
      //Ricavo tutti gli esami di cui sono teacher
      let exams=result;
      connection.query('SELECT id_exam FROM teacher_exam WHERE id_teacher = ? ', [loggedUser.id], function (error, results, fields) {
        if (error) {
            throw error;
            resolve(null);
        }
        let ExamsP = [];
        let examPromise;
        for(let exam of results){
          examPromise = getExam(id_user,exam.id_exam);
          ExamsP.push(examPromise);
          examPromise.then(ex => {
              exams.push(ex);
          });
        }

      return Promise.all(ExamsP).then(d => {return exams});
      });
    }).then(function(exams) {
      if(exams!=null){
        resolveExt(exams);
      }else{
        resolveExt(null);
      }
    });
  });
}

function getExam(loggedUser,id_exam){
  return new Promise(resolveExt => {
    let promise = new Promise(function(resolve, reject) {
      connection.query('SELECT * FROM exam WHERE id = ?', [id_exam], function (error, results, fields) {//Prelevo l'esame dal db
        if (error) {
            throw error;
            resolve(null);
        }
        if (results.length > 0) {//Esame trovato
          //console.log("Pre le 2 query");
          let user;
          let userGroup;
          let Promises=[];

          let prom1=userDao.getUser(loggedUser,results[0].id_owner).then(user1 => {
            user=user1;
          });
          Promises.push(prom1);
          let prom2=userGroupsDao.getUserGroup(loggedUser,results[0].id_group).then(userGroup1 => {
            userGroup=userGroup1;
          });
          Promises.push(prom2);
          return Promise.all(Promises).then(d => {
            let start_time1 = null;
            if (results[0].start_time != null) {
                let temp = results[0].start_time;
                let t = (temp + '').split(/[- :]/);
                start_time1 = {
                    year: +t[3],
                    month: utilities.convertMonth(t[1]),
                    day: +t[2],
                    hour: +t[4],
                    minute: +t[5],
                    second: +t[6]
                };
            }
            let deadline1 = null;
            if (results[0].deadline != null) {
                let temp = results[0].deadline;
                let t = (temp + '').split(/[- :]/);
                deadline1 = {
                    year: +t[3],
                    month: utilities.convertMonth(t[1]),
                    day: +t[2],
                    hour: +t[4],
                    minute: +t[5],
                    second: +t[6]
                };
            }
            if(user!=null && userGroup != null){
              resolve({
                id: results[0].id,
                name: results[0].name,
                owner: user,
                teachers: [],
                students: userGroup,
                tasks: [],
                submissions: [],
                start_time:start_time1,
                deadline: deadline1,
                reviewable: results[0].reviewable,
                num_shuffle: results[0].num_shuffle
              });
            }else{
              resolve(null);
            }
          });
        }else{
          resolve(null);//Esame inesistente
        }
      });
    });
    promise.then(function(exam) {
      if(exam!=null){
        console.log("Prima promise: recuperati owner e students");
        console.log(exam);
        //Recupero i teachers associati a questo exam
        let waiting= new Promise(resolve => {
          connection.query('SELECT id_teacher FROM teacher_exam WHERE id_exam = ?', [exam.id], function (error, results, fields) {
            if (error) {
                throw error;
                return null;
            }

            //Se ci sono teacher associati a questo esame allora controllo se il teacher che ha richiesto questo esame sia tra questi oppure sia l'owner
            if(loggedUser.id==exam.owner.id){//Se è l'owner
              let insertTeachers = [];
              let insertTPromise;
              for(let teacher of results){
                insertTPromise = userDao.getUser(loggedUser, teacher.id_teacher).then(user => {
                    exam.teachers.push(user);
                });
                insertTeachers.push(insertTPromise);
              }
              return Promise.all(insertTeachers).then(d => {resolve(exam)});
            }else{//Controllo che sia un teacher
              results.forEach(function(teacher) {
                if(loggedUser.id==teacher.id_teacher){//Se fa parte di uno dei teacher vado avanti
                  let insertTeachers = [];
                  let insertTPromise;
                  for(let teacher of results){
                    insertTPromise = userDao.getUser(loggedUser, teacher.id_teacher).then(user => {
                        exam.teachers.push(user);
                    });
                    insertTeachers.push(insertTPromise);
                  }
                  return Promise.all(insertTeachers).then(d => {resolve(exam)});
                }
              });
              //Se arrivo qui vuol dire che non è nemmeno tra i teacher quindi non ha accesso all'esame
              return null;
            }
          });
        });
        return Promise.all([waiting]).then(d => {console.log(exam);return exam });
      }else{//Altrimenti
        return null;
      }
    }/*).then(function(exam) {
      if(exam!=null){

        //Recupero lo user group
        let id_user_group=exam.students.id;
        let getUserGroup1 = [];
        let UserGroupPromise;
        UserGroupPromise=userGroupsDao.getUserGroup(loggedUser,id_user_group).then(userGroup => {
          exam.students=userGroup;
        });
        getUserGroup1.push(UserGroupPromise);
        return Promise.all(getUserGroup1).then(d => {return exam});
      }else{//Altrimenti
        return null;
      }
    }*/).then(function(exam) {
      if(exam!=null){
        console.log("Seconsa promise: recuperati i teachers");
        console.log(exam);
        //Recupero tasks
        let Tasks = [];
        let TasksPromise;
        TasksPromise=taskDao.getTasksByExam(loggedUser,exam.id).then(tasks => {
          exam.tasks=tasks;
        });
        Tasks.push(TasksPromise);
        return Promise.all(Tasks).then(d => {return exam});
      }else{//Altrimenti
        return null;
      }
    }).then(function(exam) {
      if(exam!=null){
        console.log("Terza promise: recuperati i tasks");
        console.log(exam);
        //Recupero submissions
        let Submissions = [];
        let SubmissionsPromise;
        SubmissionsPromise=submissionsDao.getSubmissionsByExam(loggedUser,exam).then(submissions => {
          exam.submissions=submissions;
        });
        Submissions.push(SubmissionsPromise);
        return Promise.all(Submissions).then(d => {return exam});
        //exam.submissions=[];
        return exam;
      }else{//Altrimenti
        return null;
      }
    }).then(function(exam) {
      if(exam!=null){
        console.log("Quarta promise: recuperati le submissions");
        console.log(exam);
        resolveExt(exam);
      }else{
        resolveExt(null);
      }
    });
  });
}

function updateExam(loggedUser,exam){
  return new Promise(resolveExt => {
    let promise = new Promise(function(resolve, reject) {
      if(utilities.isExam(exam)){//Controllo strutture
        //Controllo se id_user è id_owner di quell'exam e quindi l'esame può essere modificato
        connection.query('SELECT id,start_time FROM exam WHERE id_owner = ? AND id = ?', [loggedUser,exam.id], function (error, results, fields) {
          if (error) {
              throw error;
              resolve(null);
          }
          if(results.length>0){//Se ho trovato l'esame, gli id corrispondono
            var t=results[0].start_time.split(/[- :]/);
            var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
            var now = Date.now();
            if (d.getTime()<now) {//Se l'esame è già cominciato, non è possibile fare l'update
                resolve(null);
            }else{
              resolve(true);
            }
          }else{
            resolve(null);
          }
        });
      }else{
        resolve(null);
      }
    });
    promise.then(function(to_continue) {
      if(to_continue){
        userGroupsDao.getUserGroup(loggedUser,exam.students.id).then( userGroup => {
          for(let user of userGroup.users){
            for(let teacher of exam.teachers)
              if(user.id == teacher.id)
                return false;
          }
          return true;
        });
      }else{
        return null;
      }
    }).then(function(to_continue) {
      if(to_continue){
        let start_time = null;
        if (exam.start_time != null && utilities.isAValidDate(exam.start_time))
              start_time = exam.start_time.year + '-' + exam.start_time.month + '-' + exam.start_time.day + ' ' + exam.start_time.hour + ':' + exam.start_time.minute + ':' + exam.start_time.second;

        let deadline = null;
        if (exam.deadline != null && utilities.isAValidDate(exam.deadline))
              deadline = exam.deadline.year + '-' + exam.deadline.month + '-' + exam.deadline.day + ' ' + exam.deadline.hour + ':' + exam.deadline.minute + ':' + exam.deadline.second;
        //Aggiorno l'esame
        connection.query('UPDATE exam SET id_group = ?, id_owner = ?, name = ?, start_time = ?, deadline = ? ,reviewable = ?, num_shuffle = ? WHERE id = ?', [exam.students.id, exam.owner, exam.name, start_time, deadline, exam.reviewable ,exam.num_shuffle,exam.id], function (error, results, fields) {
          if (error) {
              throw error;
              return null;
          }
          return true;
        });
      }else{
        return null;
      }
    }).then(function(to_continue) {
      if(to_continue){
        //Cancello tutti i teacher associati all'esame
        connection.query('DELETE FROM teacher_exam WHERE id_exam = ?', [exam.id], function (error, results, fields) {
          if (error) {
              throw error;
              return null;
          }
          return true;
        });
      }else{
        return null;
      }
    }).then(function(to_continue) {
      if(to_continue){
        //Cancello tutti i task associati all'esame
        connection.query('DELETE FROM exam_task WHERE id_exam = ?', [exam.id], function (error, results, fields) {
          if (error) {
              throw error;
              return null;
          }
          return true;
        });
      }else{
        return null;
      }
    }).then(function(to_continue) {
      if(to_continue){
        exam.teachers.forEach(function(teacher) {
          let insertTeachers = [];
          let insertTPromise;
          for(let teacher of exam.teachers){
            insertTPromise = new Promise(resolve => {
              connection.query('INSERT INTO teacher_exam (id_exam, id_teacher) VALUES (?,?)',[exam.id, teacher.id],function (error, results, fields) {
                if (error){
                  throw error;
                }
                resolve(null);
              });
            });
            insertTeachers.push(insertTPromise);
          }

          return Promise.all(insertTeachers).then(d => {return true});
        });
      }else{
        return null;
      }
    }).then(function(to_continue) {
      submissionsDao.cleanExamSubmissions(loggedUser,exam).then(random => {return true});
    }).then(function(to_continue) {
      if(to_continue){
        let insertTasks = [];
        let insertTPromise;
        let userSubmissions = [];

        for(let user of exam.students.users){
            userSubmissions.push({
              id_student: user.id,
              submissions: []
            });
        }

        let submissionTemplates = [];

        for(let task of exam.tasks){
          insertTPromise = new Promise(resolve => {
            connection.query('INSERT INTO exam_task (id_exam, id_task) VALUES (?,?)',[exam.id,task.id],function (error, results, fields) {
              if (error){
                throw error;
              }

              let submission = {
                id: null,
                id_task: task.id,
                task_type: task.task_type,
                question: {
                    text: task.question.text,
                    possibilities: task.question.possibilities,
                    base_upload_url: task.question.base_upload_url
                },
                answer: null,
                id_user: null,
                id_exam: id_exam,
                completed: false,
                comment_peer: [],
                comment: null,
                points: task.points,
                earned_points: null
              };

              submissionTemplates.push(submission);
              resolve(null);
            });
          });
          insertTasks.push(insertTPromise);
        }

        Promise.all(insertTasks).then(d => {
          for(let userSubm of userSubmissions){
            while(userSubm.submissions.length < exam.num_shuffle){
              let n = parseInt(+(Math.random() * submissionTemplates.length), 10);
              let found = false;
              for(let i=0; i < userSubm.submissions.length; i++){
                if(userSubm.submissions[i].id_task == submissionTemplates[n].id_task)
                  found = true;
              }
              if(!found){
                userSubm.submissions.push(submissionTemplates[n]);
              }
            }
          }
          /*submissionDao.insertInExam(loggedUser, userSubmissions).then( result => {
            if(result != null)
              return id_exam
            else
              return null

          });*/
        });
        return true;
      }else{
        return null;
      }
    }).then(function(to_continue) {
      if(to_continue){
        getExam(loggedUser,exam.id).then(Exam => {resolveExt(Exam)});
      }else{
        resolveExt(null);
      }
    });
  });
}

function deleteExam(loggedUser,id_exam){
  return new Promise(resolveExt => {
    let promise = new Promise(function(resolve, reject) {
      //Controllo se l'esame esiste e se lo user che ha chiesto di cancellarlo è l'owner
      connection.query('SELECT id,start_time FROM exam WHERE id_owner = ? AND id = ?', [loggedUser,id_exam], function (error, results, fields) {
        if (error) {
            throw error;
            resolve(null);
        }
        if(results.length>0){//Se gli id corrispondono e l'esame esiste
          var t=results[0].start_time.split(/[- :]/);
          var start_date_exam = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
          var now = Date.now();
          if (start_date_exam.getTime()<now) {//Esame già cominciato, non è possibile fare la delete
              resolve(null);
          }else{
            resolve(id_exam);//Proseguo facendo la delete
          }
        }else{
          resolve(null);
        }
      });
    });
    promise.then(function(exam_id) {
      if(exam_id!=null){
        //Recupero l'esame che poi ritornerò se la DELETE andrà a buon fine
        getExam(loggedUser,exam_id).then(Exam => {return Exam});
      }else{
        return null;
      }
    }).then(function(exam) {
      if(exam!=null){
        connection.query('DELETE FROM exam WHERE id = ?', [id_exam], function (error, results, fields) {
            if (error) {
                throw error;
                return null;
            }
            if (results.affectedRows > 0) {
                return exam;
            }else{
              return null;
            }
        });
      }else{
        return null;
      }
    }).then(function(exam) {
      if(exam!=null){
        resolveExt(exam);
      }else{
        resolveExt(null);
      }
    });
  });
}

module.exports = {createExam,getAllExams,getExam,updateExam,deleteExam};
