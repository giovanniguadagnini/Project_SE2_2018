var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7267085',
    password: 'IlVZ5TF9HT',
    database: 'sql7267085'
});


function createExam(id_user,exam){

  //Da fare i controlli iniziali
  connection.connect();

  var id_exam;
  //Inserisco il nuovo esame
  connection.query('INSERT INTO exam (owner, name, deadline, reviewable, num_shuffle) VALUES (?,?,?,?,?)',
      [id_user, exam.name, exam.deadline, exam.reviewable, exam.num_shuffle],
      function (error, results, fields) {
          if (error){
              connection.end();
              throw error;
          }
          id_exam=results.insertId;
      }
  );

  exam.teachers.forEach(function(teacher) {//Inserisco i teachers
    connection.query('INSERT INTO user_exam (id_exam, id_user, teacher) VALUES (?,?,?)',
        [exam.id, teacher.id, true],
        function (error, results, fields) {
            if (error){
                connection.end();
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
                connection.end();
                throw error;
            }
        }
    );
  }

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

  return to_return;

  connection.end();

}

function getAllExams(sortStudBy, minStudByMark,maxStudByMark,taskType){

}

function getExam(id,sortStudBy, minStudByMark,maxStudByMark,taskType){

}

function updateExam(exam){

}

function deleteExam(id){

}

module.exports = {createExam,getAllExams,getExam,updateExam,deleteExam};
