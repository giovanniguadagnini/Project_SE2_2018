let mysql = require('mysql');

let connection = mysql.createConnection({
  host: 'sql7.freesqldatabase.com',
  user: 'sql7267085',
  password: 'IlVZ5TF9HT',
  database: 'sql7267085'
});

function createExam(id_user, exam) {
  let promise = new Promise(resolve => {
    //Controllo sul passaggio o meno dei parametri
    if (id_user != null && exam != null && exam.name != null && exam.teachers != null && exam.students != null && exam.deadline != null && exam.reviewable != null && exam.num_shuffle != null) {
      //Controllo se lo user_group passato esiste
      connection.query('SELECT * FROM user_group WHERE id = ?', [exam.students], function (error, results, fields) {
        if (error) {
          throw error;
          resolve(null);
        }
        if (results.length == 0) {
          resolve(null);//User_group inesistente
        }
      });
      //Controllo intersezione di user group con i teacher
      connection.query('SELECT id_user FROM user_group_members WHERE id_group = ?', [exam.students], function (error, results, fields) {
        if (error) {
          throw error;
          resolve(null);
        }
        if (results.length > 0) {
          results.forEach(function (student) {
            exam.teachers.forEach(function (teacher) {
              if (student.id_user == teacher) {
                resolve(null);//Non ci possono essere teacher che sono anche student nello stesso esame
              }
            });
          });
        }
      });
      //Controllo se gli id dei teacher passati esistono in user
      connection.query('SELECT id FROM user', function (error, results, fields) {
        if (error) {
          throw error;
          resolve(null);
        }
        if (results.length > 0) {
          let id_users = [];
          results.forEach(function (user) {
            id_users.push(user.id);
          });
          exam.teachers.forEach(function (teacher) {
            if (!id_users.includes(teacher)) {
              resolve(null);//Non ci possono essere teacher che non sono user nel DataBase
            }
          });
        }
      });
      //Fine controlli dal DataBase

      //Inserisco il nuovo esame e relativi teacher
      let id_exam;
      console.log(exam);
      connection.query('INSERT INTO exam (id_group, id_owner, name, deadline, reviewable, num_shuffle) VALUES (?,?,?,?,?,?)',
        [exam.students, id_user, exam.name, exam.deadline, exam.reviewable, exam.num_shuffle],
        function (error, results, fields) {
          if (error) {
            throw error;
            resolve(null);
          }
          id_exam = results.insertId;
        }
      );
      if (id_exam != null) {
        exam.teachers.forEach(function (teacher) {
          connection.query('INSERT INTO teacher_exam (id_exam, id_teacher) VALUES (?,?)',
            [id_exam, teacher],
            function (error, results, fields) {
              if (error) {
                throw error;
                resolve(null);
              }
            }
          );
        });
        if (!exam.teachers.includes(id_user)) {
          connection.query('INSERT INTO teacher_exam (id_exam, id_teacher) VALUES (?,?)',
            [id_exam, id_user],
            function (error, results, fields) {
              if (error) {
                throw error;
                resolve(null);
              }
            });
        }
      } else
        resolve(null);

      //Recupero i teacher associati a quell'esame
      let teachers = [];
      connection.query('SELECT * FROM teacher_exam WHERE id_exam = ?', [id_exam], function (error, results, fields) {
        if (error) {
          throw error;
          resolve(null);
        }
        if (results.length > 0) {
          results.forEach(function (teacher) {
            teachers.push(teacher.id_teacher);
          });
        } else {
          resolve(null);//Non ha inserito nessun teacher
        }
      });


      //Recupero lo user group associato a quell'esame
      let id_user_group;
      connection.query('SELECT * FROM user_group WHERE id = ?', [exam.students], function (error, results, fields) {
        if (error) {
          throw error;
          resolve(null);
        }
        if (results.length > 0) {
          id_user_group = results[0].id
        } else {
          resolve(null);
        }
      });
      //Recupero l'esame inserito e lo ritorno
      connection.query('SELECT * FROM exam WHERE id_exam = ?', [id_exam], function (error, results, fields) {
        if (error) {
          throw error;
          resolve(null);
        }
        if (results.length > 0) {
          resolve({
            id: results[0].id,
            name: results[0].id,
            owner: results[0].id_owner,
            teachers: teachers,
            students: id_user_group,
            tasks: [],
            submissions: [],
            deadline: results[0].deadline,
            reviewable: results[0].reviewable,
            num_shuffle: results[0].num_shuffle
          });
        } else {
          resolve(null);//Non ha inserito niente
        }
      });
    }
    else resolve(null);//Non ha passato il controllo sul tipo o sul passaggio dei parametri
  });
  promise.then(result => { return result; });
}

function getAllExams(id_user, sortStudBy, minStudByMark, maxStudByMark, taskType) {
  return new Promise(resolve => {
    if (id_user != null && sortStudBy != null && Number.isInteger(minStudByMark) && Number.isInteger(maxStudByMark) && (taskType instanceof String || typeof taskType === "string")) {
      let teachers = [];
      let students = [];
      let tasks = [];
      let submission = [];
      //Query per ottenere tutti gli esami creati da questo utente
      connection.query('SELECT * FROM exam WHERE id_owner = ?', [id_user], function (error, results, fields) {
        if (error) {
          throw error;
          resolve(null);
        }

        if (results.length > 0) {
          results.forEach(function (exam) {
            //Query per ottenere tutti i teacher di questo esame
            connection.query('SELECT user.id,user.name,user.surname,user.email,user.born,user.enrolled FROM user_exam INNER JOIN user ON user_exam.id_user=user.id WHERE id_exam = ? AND teacher = true', [exam.id], function (error, results, fields) {
              if (error) {
                throw error;
              }
              if (results.length > 0) {
                results.forEach(function (tacher) {

                });
              } else {

              }
            }
            );
            //Query per ottenere tutti gli students di questo esame
            connection.query('SELECT user.id,user.name,user.surname,user.email,user.born,user.enrolled FROM user_exam INNER JOIN user ON user_exam.id_user=user.id WHERE id_exam = ? AND teacher = false', [exam.id], function (error, results, fields) {
              if (error) {
                throw error;
              }
              if (results.length > 0) {
                results.forEach(function (student) {

                });
              } else {

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

              } else {

              }
            });
            //Query per ottenere task associati a questo esame
            connection.query('SELECT * FROM task WHERE id_exam = ?', [exam.id], function (error, results, fields) {
              if (error) {
                throw error;
                resolve(null);
              }

              if (results.length > 0) {

              } else {

              }
            });
          });
        } else {
          resolve(null);
        }
      });
    }
  });
}

function getExam(id_user, id_exam, sortStudBy, minStudByMark, maxStudByMark, taskType) {

}

function updateExam(exam) {

}

function deleteExam(id) {

}

module.exports = { createExam, getAllExams, getExam, updateExam, deleteExam };