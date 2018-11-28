var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7267085',
    password: 'IlVZ5TF9HT',
    database: 'sql7267085'
});


function createExam(id_user,exam){

  return new Promise(resolve => {
    var id_exam;
    if (id_user!=null && exam.name!=null && exam.teachers!=null && exam.students!=null && exam.deadline!=null && exam.reviewable!=null && exam.num_shuffle!=null) {
        connection.query('INSERT INTO exam (owner, name, deadline, reviewable, num_shuffle) VALUES (?,?,?,?,?)',
            [id_user, exam.name, exam.deadline, exam.reviewable, exam.num_shuffle],
            function (error, results, fields) {
                if (error) {
                    throw error;
                    resolve(null);
                }
                id_exam=results.insertId;
            }
        );

        exam.teachers.forEach(function(teacher) {//Inserisco i teachers
          connection.query('INSERT INTO user_exam (id_exam, id_user, teacher) VALUES (?,?,?)',
              [exam.id, teacher.id, true],
              function (error, results, fields) {
                  if (error){
                      throw error;
                  }
              }
          );
        });

        exam.students.users.forEach(function(group_member) {//Inserisco gli students
          connection.query('INSERT INTO user_exam (id_exam, id_user, teacher) VALUES (?,?,?)',
              [exam.id, group_member.id, false],
              function (error, results, fields) {
                  if (error){
                      throw error;
                  }
              }
          );
        });
        //Costruisco il JSON da ritornare
        var to_return={
          id : id_exam
          name :exam.name,
          owner : id_user,
          teachers :[exam.teachers],
          students : exam.students,
          tasks : [],
          submissions: [],
          deadline :exam.deadline,
          reviewable : exam.reviewable,
          num_shuffle :exam.num_shuffle
        };
        resolve(to_return);
    }
    else resolve(null);
  });
}

function getAllExams(id_user,sortStudBy, minStudByMark,maxStudByMark,taskType){
  return new Promise(resolve => {
    if(id_user!=null&&sortStudBy!=null&&Number.isInteger(minStudByMark)&&Number.isInteger(maxStudByMark)&&(taskType instanceof String || typeof taskType === "string")){
      var teachers = [];
      var students = [];
      var tasks = [];
      var submission = []:
      //Query per ottenere tutti gli esami creati da questo utente
      connection.query('SELECT * FROM exam WHERE owner = ?', [id_user], function (error, results, fields) {
        if (error) {
            throw error;
            return null;
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
                  return null;
              }

              if (results.length > 0) {

              }else{

              }
            });
            //Query per ottenere task associati a questo esame
            connection.query('SELECT * FROM task WHERE id_exam = ?', [exam.id], function (error, results, fields) {
              if (error) {
                  throw error;
                  return null;
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
