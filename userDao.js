const mysql = require('mysql');
const myDate = require('./myDate');

const connection = mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7267085',
    password: 'IlVZ5TF9HT',
    database: 'sql7267085'
});

function findOrCreate(data) {
    return new Promise(resolve => {
        getUser({}, data.id).then(value => {
            let userFromDB = value;
            if (userFromDB == null) { // user doesn't exist in db
                let userToDB;
                if (data.name != undefined) {
                    userToDB = {
                        id: data.id,
                        name: data.name.familyName,
                        surname: data.name.givenName
                    };
                } else {
                    userToDB = {id: data.id};
                }
                createUser(userToDB).then(value => {
                    resolve (value);
                });
            }else{
                resolve (userFromDB);
            }
        });
    });
}

function createUser(user) {
    return new Promise(resolve => {
        if (user != null && user.id != null) {
            connection.query('INSERT INTO user (id, name, surname) VALUES (?,?,?)',
                [user.id, user.name, user.surname],
                function (error, results, fields) {
                    if (error) {
                        throw error;
                        resolve(null);
                    } else
                        resolve(user);
                }
            );

        }
        else resolve(null);
    });

}

function getAllUsers(loggedUser, enrolledBefore, enrolledAfter) {
    return new Promise(resolve => {
        let retval = [];

        connection.query('SELECT * FROM user WHERE (user.enrolled >= ? AND user.enrolled <= ?) OR user.enrolled IS NULL', [enrolledBefore, enrolledAfter], function (error, results, fields) {
            if (error) {
                throw error;
                resolve(null);
            }
            if (results.length > 0) {
                for (var i = 0; i < results.length; i++) {
                    let born = null;
                    if (results[i].born != null){
                        let temp = results[i].born;
                        let t = (temp + '').split(/[- :]/);
                        temp = new Date(Date.UTC(t[3], myDate.convertMonth(t[1]), t[2], t[4]-1, t[5], t[6]));
                        born = {
                            year: temp.getFullYear(),
                            month: temp.getMonth(),
                            day: temp.getDay(),
                            hour: temp.getHours(),
                            minute: temp.getMinutes(),
                            second: temp.getSeconds()
                        };
                    }

                    let enrolled = null;

                    if (results[i].enrolled != null){
                        let temp = results[i].enrolled;
                        let t = (temp + '').split(/[- :]/);
                        temp = new Date(Date.UTC(t[3], myDate.convertMonth(t[1]), t[2], t[4]-1, t[5], t[6]));
                        enrolled = {
                            year: temp.getFullYear(),
                            month: temp.getMonth(),
                            day: temp.getDay(),
                            hour: temp.getHours(),
                            minute: temp.getMinutes(),
                            second: temp.getSeconds()
                        };
                    }

                    retval.push({
                        'id': '' + results[i].id,
                        'name': '' + results[i].name,
                        'surname': '' + results[i].surname,
                        'mail': '' + results[i].mail,
                        'enrolled': enrolled,
                        'born': born
                    })
                }
                resolve(retval);
            }else
                resolve (null);

        });

    });
}

function getUser(loggedUser, id) {
    return new Promise(resolve => {
        connection.query('SELECT * FROM user WHERE id = ?', [id], function (error, results, fields) {
            if (error) {
                throw error;
                return null;
            }

            if (results.length > 0) {

                let born = null;
                if (results[0].born != null){
                    let temp = results[0].born;
                    let t = (temp + '').split(/[- :]/);
                    temp = new Date(Date.UTC(t[3], myDate.convertMonth(t[1]), t[2], t[4]-1, t[5], t[6]));
                    born = {
                        year: temp.getFullYear(),
                        month: temp.getMonth(),
                        day: temp.getDay(),
                        hour: temp.getHours(),
                        minute: temp.getMinutes(),
                        second: temp.getSeconds()
                    };
                }

                let enrolled = null;

                if (results[0].enrolled != null){
                    let temp = results[0].enrolled;
                    let t = (temp + '').split(/[- :]/);
                    temp = new Date(Date.UTC(t[3], myDate.convertMonth(t[1]), t[2], t[4]-1, t[5], t[6]));
                    enrolled = {
                        year: temp.getFullYear(),
                        month: temp.getMonth(),
                        day: temp.getDay(),
                        hour: temp.getHours(),
                        minute: temp.getMinutes(),
                        second: temp.getSeconds()
                    };
                }
                resolve({
                    'id': '' + results[0].id,
                    'name': '' + results[0].name,
                    'surname': '' + results[0].surname,
                    'mail': '' + results[0].mail,
                    'enrolled': enrolled,
                    'born':  born
                });
            }else
                resolve(null);

        });

    });
}

function updateUser(user) {
    return new Promise(resolve => {
        if (user != null && user.id != null) {

            let born = null;
            if (user.born != null)
                born = user.born.year + '-' + user.born.month + '-' + user.born.day + ' ' + user.born.hour + ':' + user.born.minute + ':' + user.born.second;

            let enrolled = null;
            if (user.enrolled != null)
                enrolled = user.enrolled.year + '-' + user.enrolled.month + '-' + user.enrolled.day + ' ' + user.enrolled.hour + ':' + user.enrolled.minute + ':' + user.enrolled.second;

            connection.query('UPDATE user SET name = ?, surname = ?, email = ?, enrolled = ?, born = ? WHERE id = ?', [user.name, user.surname, user.email, enrolled, born, user.id], function (error, results, fields) {
                if (error) {
                    throw error;
                    resolve(null);
                }
                if (results.affectedRows > 0) {
                    getUser(user, user.id).then(value => {
                        resolve(value);
                    });
                } else {
                    resolve(null);
                }

            });

        }
        else resolve(null);
    });
}

function deleteUser(userId) {
    return new Promise(resolve => {
        if (userId != null) {
            let retval;

            connection.query('DELETE FROM user WHERE id = ?', [userId], function (error, results, fields) {
                if (error) {
                    throw error;
                    return null;
                }
                if (results.affectedRows > 0) {
                    retval = user;
                } else {
                    retval = null;
                }
                resolve(retval);
            });

        }

        else resolve(null);
    });
}

<<<<<<< HEAD
module.exports = {findOrCreate, getAllUsers, createUser, getUser, updateUser, deleteUser};
=======
function deleteExam(id){

}

module.exports = {getAllUsers, createUser, getUser, updateUser,createExam,getAllExams,getExam,updateExam,deleteExam};
>>>>>>> added deleteExam function in userDao.js
