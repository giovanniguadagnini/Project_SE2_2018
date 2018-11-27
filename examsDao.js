var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7267085',
    password: 'IlVZ5TF9HT',
    database: 'sql7267085'
});


function createExam(id_user,exam){
  connection.query('INSERT INTO exam (id, owner, name, deadline, reviewable, num_shuffle) VALUES (?,?,?,?,?,?)',
      [, id_user, exam.name, exam.deadline, exam.reviewable, exam.num_shuffle],
      function (error, results, fields) {
          if (error){
              connection.end();
              throw error;
          }
      }
  );

  exam.teachers.forEach(function(element) {//Inserisco i teachers
    connection.query('INSERT INTO user_exam (id_exam, id_user, teacher) VALUES (?,?,?)',
        [exam.id, element.id, true],
        function (error, results, fields) {
            if (error){
                connection.end();
                throw error;
            }
        }
    );
  });

  //Query per ricavare da user_group_members tutti i membri del gruppo passato per poi aggiungerli a user_exam come students

  connection.query('INSERT INTO user_exam (id_exam, id_user, teacher) VALUES (?,?,?)',//Inserisco gli students
      [exam.id, , false],
      function (error, results, fields) {
          if (error){
              connection.end();
              throw error;
          }
      }
  );
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
