var mysql = require('mysql');
const userDao = require('./userDao');
const userGroupsDao = require('./userGroupsDao');
const submissionsDao = require('./submissionsDao');
const taskDao = require('./taskDao');

const utilities = require('./utilities');
const connection = utilities.connection;


function createExam(id_user,exam){

  let promise = new Promise(function(resolve, reject) {

    //Controllo sul tipo e sul passaggio o meno dei parametri
    //[TODO controllo struttura di teachers e students]
    if (id_user!=null && utilities.isExam(exam) && typeof exam.reviewable == typeof true && id_user == parseInt(id_user, 10) && exam.deadline == parseInt(exam.deadline, 10) && exam.num_shuffle == parseInt(exam.num_shuffle, 10)){
      //Controllo se lo user group passato esiste ---[TODO]Manca controllo sugli user passati
      connection.query('SELECT * FROM user_group WHERE id = ? AND id_creator = ? AND name = ?', [exam.students.id,exam.students.creator,exam.students.name], function (error, results, fields) {
        if (error) {
            throw error;
            resolve(null);
        }
        if (results.length == 0) {
          resolve(null);//User_group inesistente
        }else{
          resolve(true);//Controllo passato
        }
      });
    }
    else{
      resolve(null);//Non ha passato il controllo sul tipo o sul passaggio dei parametri
    }
  });

  promise.then(function(result) {
    if(result){//Se ha passato il controllo precedente
      //Controllo se i teacher passati sono user
      exam.teachers.forEach(function(teacher) {
        connection.query('SELECT id FROM user WHERE id = ?', [teacher.id],function (error, results, fields) {
          if (error) {
              throw error;
              return null;
          }
          if (results.length == 0) {
            return null;//teacher passato non è uno user
          }
        });
      });
      //Se tutti i teacher sono users continuo
      return(true);
    }else{//Altrimenti
      return null;
    }
  }).then(function(result) {
    if(result){//Se ha passato il controllo precedente
      //[TODO]Controllo intersezione di user group con i teacher
      /*connection.query('SELECT id_user FROM user_group_members WHERE id_group = ?', [exam.students.id], function (error, results, fields) {
        if (error) {
            throw error;
            resolve(null);
        }
        if (results.length > 0) {
          results.forEach(function(student) {
            exam.teachers.forEach(function(teacher) {
              if(student.id_user==teacher.id){
                resolve(null);//Non ci possono essere teacher che sono anche student nello stesso esame
              }
            });
          });
        }
      });*/
      //Fine controlli dal DataBase
      //Inserisco il nuovo esame
      var id_exam;
      connection.query('INSERT INTO exam (id_group, id_owner, name, deadline, reviewable, num_shuffle) VALUES (?,?,?,?,?,?)',
          [exam.students.id,id_user, exam.name,exam.deadline, exam.reviewable, exam.num_shuffle],
          function (error, results, fields) {
              //console.log('Entrato');
              if (error) {
                  //console.log('Entrato in errore');
                  throw error;
                  return null;
              }
              //console.log(results.insertId);
              //console.log('EPre stamp');
              //console.log('Id exam obteined 1:'+results.insertId);
              id_exam=results.insertId;
              //console.log(id_exam);
              return id_exam;
          }
      );
    }else{//Altrimenti
      return null;
    }
  }).then(function(result) {
    if(result!=null){//Se ha passato l'inserimento precedente
      var id_exam=result;
      //Inserisco i teachers
      exam.teachers.forEach(function(teacher) {
        connection.query('INSERT INTO teacher_exam (id_exam, id_teacher) VALUES (?,?)',
            [id_exam, teacher.id],
            function (error, results, fields) {
                if (error){
                    throw error;
                    return null;
                }
            }
        );
      });
      return id_exam;
    }else{//Altrimenti
      return null;
    }

  }).then(function(result) {
    if(result!=null){//Se ha passato l'inserimento precedente
    //Recupero i teacher associati a quell'esame
    var id_exam=result;
    return getExam({id: id_exam});
    /*var teachers=[];
    connection.query('SELECT * FROM teacher_exam WHERE id_exam = ?', [id_exam], function (error, results, fields) {
      if (error) {
          throw error;
          return null;
      }
      if (results.length > 0) {
        results.forEach(function(teacher) {
          //[TODO]Costruire il JSON dello user relativo
          teachers.push(teacher.id_teacher);
        });
      }else{
        return null;//Non ha inserito nessun teacher
      }
    });

    let id_user_group;
    //Recupero lo user group associato a quell'esame
    connection.query('SELECT * FROM user_group WHERE id = ?', [exam.students.id], function (error, results, fields) {
      if (error) {
          throw error;
          return null;
      }
      if (results.length > 0) {
        //[TODO]Costruire il JSON dello user_group
        id_user_group=results[0].id
      }else{
        return null;
      }
    });

    return teachers;*/
    }else{//Altrimenti
      return null;
    }
  };
  return promise;
}

function getAllExams(id_user){
  let promise = new Promise(function(resolve, reject){
    //Aggiungo tutti gli esami di cui sono owner
    let exams=[];
    connection.query('SELECT id FROM exam WHERE id_owner = ? ', [id_user], function (error, results, fields) {
      if (error) {
          throw error;
          resolve(null);
      }
      results.forEach(function(exam) {
        exams.push(getExam(id_user,exam.id));
      });
    });
    resolve(exams);
  });

  promise.then(function(result) {
    //Aggiungo tutti gli esami di cui sono teacher
    let exams=result;
    connection.query('SELECT id_exam FROM teacher_exam WHERE id_teacher = ? ', [id_user], function (error, results, fields) {
      if (error) {
          throw error;
          resolve(null);
      }
      results.forEach(function(exam) {
        exams.push(getExam(id_user,exam.id_exam));
      });
    });
    return exams;
  });
  return promise;
}

function getExam(id_user,id_exam){
  let promise = new Promise(function(resolve, reject) {
    connection.query('SELECT * FROM exam WHERE id = ?', [id_exam], function (error, results, fields) {//Prelevo l'esame dal db
      if (error) {
          throw error;
          resolve(null);
      }
      if (results.length > 0) {//Esame trovato
        resolve({
          id: results[0].id,
          name: results[0].name,
          owner: results[0].id_owner,
          teachers: [],
          students: results[0].id_group,
          tasks: [],
          submissions: [],
          deadline: results[0].deadline,
          reviewable: results[0].reviewable,
          num_shuffle: results[0].num_shuffle
        });
      }else{
        resolve(null);//Esame inesistente
      }
    });
  });

  promise.then(function(result) {
    if(result!=null){
      let exam=result;
      //Recupero i teachers associati a questo exam
      connection.query('SELECT id_teacher FROM teacher_exam WHERE id_exam = ?', [exam.id], function (error, results, fields) {
        if (error) {
            throw error;
            resolve(null);
        }
        //Se ci sono teacher associati a questo esame allora controllo se il teacher che ha richiesto questo esame sia tra questi oppure sia l'owner
        if(id_user==exam.owner){//Se è l'owner
          results.forEach(function(teacher) {
            exam.teachers.push(userDao.getUser(id_user, teacher.id));
          });
          return exam;
        }else{//Controllo che sia un teacher
          results.forEach(function(teacher) {
            if(id_user==teacher.id){//Se fa parte di uno dei teacher vado avanti
              results.forEach(function(teach) {
                exam.teachers.push(userDao.getUser(id_user, teach.id));
              });
              return exam;
            }
          });
          //Se arrivo qui vuol dire che non è nemmeno tra i teacher quindi non ha accesso all'esame
          return null;
        }
      });
    }else{//Altrimenti
      return null;
    }
  }).then(function(result) {
    if(result!=null){
      //Recupero lo user group
      let exam=result;
      id_user_group=exam.students;
      exam.students=userGroupsDao.getUserGroup(id_user_group);
      return exam;
    }else{//Altrimenti
      return null;
    }
  }.then(function(result) {
    if(result!=null){
      //Recupero tasks
      let exam=result;
      exam.tasks=taskDao.getTaskByIdExam(id_exam);
      return exam;
    }else{//Altrimenti
      return null;
    }
  }.then(function(result) {
    if(result!=null){
      //Recupero submissions
      let exam=result;
      exam.submissions=submissionsDao.getSubmissionByIdExam(id_exam);
      return exam;
    }else{//Altrimenti
      return null;
    }
  };
  return promise;
}

function updateExam(exam){

}

function deleteExam(id){

}

module.exports = {createExam,getAllExams,getExam,updateExam,deleteExam};
