var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7267085',
    password: 'IlVZ5TF9HT',
    database: 'sql7267085'
});

function createExam(id_user,exam){

  //console.log('1');
  var promise = new Promise(function(resolve, reject) {

    //Controllo sul tipo e sul passaggio o meno dei parametri
    //[TODO controllo struttura di teachers e students]
    if (id_user!=null && exam != null && exam.name!=null && exam.teachers!=null && exam.students!=null && exam.deadline!=null && exam.reviewable!=null && exam.num_shuffle!=null
    && typeof exam.reviewable == typeof true && id_user == parseInt(id_user, 10) && exam.deadline == parseInt(exam.deadline, 10) && exam.num_shuffle == parseInt(exam.num_shuffle, 10)){
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
}

function getAllExams(id_user,sortStudBy, minStudByMark,maxStudByMark,taskType){
  return new Promise(resolve => {
    if(id_user!=null&&sortStudBy!=null&&Number.isInteger(minStudByMark)&&Number.isInteger(maxStudByMark)&&(taskType instanceof String || typeof taskType === "string")){
      var teachers = [];
      var students = [];
      var tasks = [];
      var submission = [];
      //Query per ottenere tutti gli esami creati da questo utente
      connection.query('SELECT * FROM exam WHERE id_owner = ?', [id_user], function (error, results, fields) {
        if (error) {
            throw error;
            resolve(null);
        }

        if (results.length > 0) {
          results.forEach(function(exam) {
            //Query per ottenere tutti i teacher di questo esame
            connection.query('SELECT user.id,user.name,user.surname,user.email,user.born,user.enrolled FROM user_exam INNER JOIN user ON user_exam.id_user=user.id WHERE id_exam = ? AND teacher = true', [exam.id], function (error, results, fields) {
                    if (error){
                        throw error;
                    }
                    if (results.length > 0) {
                      results.forEach(function(tacher) {

                      });
                    }else{

                    }
                }
            );
            //Query per ottenere tutti gli students di questo esame
            connection.query('SELECT user.id,user.name,user.surname,user.email,user.born,user.enrolled FROM user_exam INNER JOIN user ON user_exam.id_user=user.id WHERE id_exam = ? AND teacher = false', [exam.id], function (error, results, fields) {
                    if (error){
                        throw error;
                    }
                    if (results.length > 0) {
                      results.forEach(function(student) {

                      });
                    }else{

                    }
                }
            );
            //Query per otterene submission assegnate a questo esame
            connection.query('SELECT * FROM submission WHERE id_exam = ?', [exam.id], function (error, results, fields) {
              if (error) {
                  throw error;
                  resolve(null);
              }

              if (results.length > 0) {

              }else{

              }
            });
            //Query per ottenere task associati a questo esame
            connection.query('SELECT * FROM task WHERE id_exam = ?', [exam.id], function (error, results, fields) {
              if (error) {
                  throw error;
                  resolve(null);
              }

              if (results.length > 0) {

              }else{

              }
            });
          });
        }else{
          resolve(null);
        }
      });
    }
  });
}

function getExam(id_user,id_exam,sortStudBy, minStudByMark,maxStudByMark,taskType){

}

function updateExam(exam){

}

function deleteExam(id){

}

module.exports = {createExam,getAllExams,getExam,updateExam,deleteExam};
