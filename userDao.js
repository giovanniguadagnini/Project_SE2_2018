const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7267085',
    password: 'IlVZ5TF9HT',
    database: 'sql7267085'
});

function findOrCreate(data) {
    getUser(data.id).then(value => {
        console.log("Finding user " + data.id);
        let userFromDB = value;
        if (userFromDB == null) { // user doesn't exist in db
            console.log("User not found! Creating a new account");
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
            userFromDB = createUserSyn(userToDB);
        }
        return userFromDB;
    });
}

function createUser(user) {
    return new Promise(resolve => {
        if (user != null && user.id != null && user.name != null && user.surname != null) {
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

function getAllUsers(enrolledBefore, enrolledAfter) {
    return new Promise(resolve => {
        let born = null;
        let enrolled = null;
        let retval = [];

        connection.query('SELECT * FROM user WHERE user.enrolled >= ? AND user.enrolled =< ?', [enrolledBefore, enrolledAfter], function (error, results, fields) {
            if (error) {
                throw error;
                resolve(null);
            }
            if (results.length > 0) {
                for (var i = 0; i < results.length; i++) {
                    if (results[i].born != null)
                        born = results[i].born.year + '-' + results[i].born.month + '-' + results[i].born.day + ' ' + results[i].born.hour + ':' + results[i].born.minute + ':' + results[i].born.second;
                    else
                        born = null;

                    if (results[i].enrolment != null)
                        enrolled = results[i].enrolment.year + '-' + results[i].enrolment.month + '-' + results[i].enrolment.day + ' ' + results[i].enrolment.hour + ':' + results[i].enrolment.minute + ':' + results[i].enrolment.second;
                    else
                        enrolled = null;

                    retval.push({
                        'id': '' + results[i].id,
                        'name': '' + results[i].name,
                        'surname': '' + results[i].surname,
                        'mail': '' + results[i].mail,
                        'enrolled': '' + enrolled,
                        'born': '' + born
                    })
                }
                resolve(retval);
            }

        });

        resolve(null);
    });
}

function getUser(id) {
    return new Promise(resolve => {
        connection.query('SELECT * FROM user WHERE id = ?', [id], function (error, results, fields) {
            if (error) {
                throw error;
                return null;
            }

            if (results.length > 0) {

                let born = null;
                if (results[0].born != null)
                    born = results[0].born.year + '-' + results[0].born.month + '-' + results[0].born.day + ' ' + results[0].born.hour + ':' + results[0].born.minute + ':' + results[0].born.second;

                let enrolled = null;

                if (results[0].enrolment != null)
                    enrolled = results[0].enrolment.year + '-' + results[0].enrolment.month + '-' + results[0].enrolment.day + ' ' + results[0].enrolment.hour + ':' + results[0].enrolment.minute + ':' + results[0].enrolment.second;

                resolve({
                    'id': '' + results[0].id,
                    'name': '' + results[0].name,
                    'surname': '' + results[0].surname,
                    'mail': '' + results[0].mail,
                    'enrolled': '' + enrolled,
                    'born': '' + born
                });
            }

        });

    });
}

function updateUser(user) {
    return new Promise(resolve => {
        if (user != null && user.id != null) {
            let retval;

            let born = null;
            if (user.born != null)
                born = user.born.year + '-' + user.born.month + '-' + user.born.day + ' ' + user.born.hour + ':' + user.born.minute + ':' + user.born.second;

            let enrolled = null;
            if (user.enrolment != null)
                enrolled = user.enrolment.year + '-' + user.enrolment.month + '-' + user.enrolment.day + ' ' + user.enrolment.hour + ':' + user.enrolment.minute + ':' + user.enrolment.second;

            connection.query('UPDATE user SET name = ?, surname = ?, email = ?, enrolled = ?, born = ? WHERE id = ?', [user.name, user.surname, user.email, enrolled, born, user.id], function (error, results, fields) {
                if (error) {
                    throw error;
                    resolve(null);
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

function deleteUser(user) {
    return new Promise(resolve => {
        if (user != null && user.id != null) {
            let retval;

            connection.query('DELETE FROM user WHERE id = ?', [user.id], function (error, results, fields) {
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

function createUserSyn(user) {
    createUser(user).then(value => {
        return value;
    });
}

function getAllUsersSyn(loggedUser, enrolledBefore, enrolledAfter) {
    // [TO DO] NEED TO IMPLEMENT LOGIC TO FILTER PROPER DATA BASED ON loggedUser
    getAllUsers(enrolledBefore, enrolledAfter).then(value => {
        return value;
    });
}

function getUserSyn(loggedUser, id) {
    // [TO DO] NEED TO IMPLEMENT LOGIC TO FILTER PROPER DATA BASED ON loggedUser
    getUser(id).then(value => {
        return value;
    });
}

function updateUserSyn(user) {
    updateUser(user).then(value => {
        return value;
    });
}

function deleteUserSyn(user) {
    deleteUser(user).then(value => {
        return value;
    });
}

module.exports = {findOrCreate, getAllUsersSyn, createUserSyn, getUserSyn, updateUserSyn, deleteUserSyn};
