const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7267085',
    password: 'IlVZ5TF9HT',
    database: 'sql7267085'
});

/*
function connectDB() {
    connection.connect();
}

function disconnectDB() {
    connection.end();
}

function reconnectDB() {
    disconnectDB();
    connectDB();
}

function checkDBConnection() {
    if (connection.state === 'disconnected') {
        connectDB();
    }
}
*/

function findOrCreate(data) {
    let userFromDB = getUser(data.id);
    console.log("findOrCreate ");
    console.log(JSON.stringify(data, null, 2));
    console.log("findOrCreate data.id" + data.id);
    if (userFromDB == null) { // user doesn't exist in db
        let userToDB;
        if(data.name != undefined) {
            userToDB = {
                id: data.id,
                name: data.name.familyName,
                surname: data.name.givenName
            };
        }else{
            userToDB = {id : data.id};
        }
        userFromDB = createUser(userToDB);
    }
    return userFromDB;

}

function createUser(user) {
    if (user != null && user.id != null && user.name != null && user.surname != null) {
        //connection.connect();
        connection.query('INSERT INTO user (id, name, surname) VALUES (?,?,?)',
            [user.id, user.name, user.surname],
            function (error, results, fields) {
                if (error) {
                    connection.end();
                    throw error;
                    return null;
                }
            }
        );
        //connection.end();
        return user;
    }
    else return null;
}

function getAllUsers(enrolledBefore, enrolledAfter) {
    var born = null;
    var enrolled = null;
    var retval = [];
    connection.connect();

    connection.query('SELECT * FROM user WHERE user.enrolled >= ? AND user.enrolled =< ?', [enrolledBefore, enrolledAfter], function (error, results, fields) {
        if (error) {
            throw error;
            return null;
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
        }

    });

    connection.end();

    return retval;
}

function getUser(id) {
    var retval;
    //connection.connect();

    connection.query('SELECT * FROM user WHERE id = ?', [id], function (error, results, fields) {
        if (error) {
            throw error;
            return null;
        }
        if (results.length > 0) {
            var born = null;
            if (results[0].born != null)
                born = results[0].born.year + '-' + results[0].born.month + '-' + results[0].born.day + ' ' + results[0].born.hour + ':' + results[0].born.minute + ':' + results[0].born.second;

            var enrolled = null;

            if (results[0].enrolment != null)
                enrolled = results[0].enrolment.year + '-' + results[0].enrolment.month + '-' + results[0].enrolment.day + ' ' + results[0].enrolment.hour + ':' + results[0].enrolment.minute + ':' + results[0].enrolment.second;

            retval = {
                'id': '' + results[0].id,
                'name': '' + results[0].name,
                'surname': '' + results[0].surname,
                'mail': '' + results[0].mail,
                'enrolled': '' + enrolled,
                'born': '' + born
            };
        } else {
            retval = null;
        }
        return retval;
    });

    //connection.end();
}

function updateUser(user) {
    if (user != null && user.id != null) {
        var retval;
        connection.connect();

        var born = null;
        if (user.born != null)
            born = user.born.year + '-' + user.born.month + '-' + user.born.day + ' ' + user.born.hour + ':' + user.born.minute + ':' + user.born.second;

        var enrolled = null;
        if (user.enrolment != null)
            enrolled = user.enrolment.year + '-' + user.enrolment.month + '-' + user.enrolment.day + ' ' + user.enrolment.hour + ':' + user.enrolment.minute + ':' + user.enrolment.second;

        connection.query('UPDATE user SET name = ?, surname = ?, email = ?, enrolled = ?, born = ? WHERE id = ?', [user.name, user.surname, user.email, enrolled, born, user.id], function (error, results, fields) {
            if (error) {
                throw error;
                return null;
            }
            if (results.affectedRows > 0) {
                retval = user;
            } else {
                retval = null;
            }
            return retval;
        });

        connection.end();
    }
    else return null;
}

function deleteUser(id) {
    if (id != null) {
        var user = userDao.getUser(id);
        if (user != null) {
            var retval;
            connection.connect();

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
                return retval;
            });

            connection.end();
        }
    }

    else return null;
}

module.exports = {findOrCreate, getAllUsers, createUser, getUser, updateUser, deleteUser};
