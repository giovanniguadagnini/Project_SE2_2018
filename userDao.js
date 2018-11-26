var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7267085',
    password: 'IlVZ5TF9HT',
    database: 'sql7267085'
});

function connectDB(){
    connection.connect();
}

function disconnectDB(){
    connection.end();
}

function reconnectDB(){
    disconnectDB();
    connectDB();
}

function checkDBConnection(){
    if(connection.state === 'disconnected'){
        connectDB();
    }
}

function createUser(user){
    checkDBConnection();
    if(user != null){
        if(user.id != null && user.name != null && user.surname != null){
            connection.connect();
            var date = Date.now();
            connection.query('INSERT INTO user (id, name, surname, email, born, enrolled) VALUES (?,?,?,?,?,?)',
                [user.id, user.name, user.surname, 'mail@mail.it', '' + date, '' + date],
                function (error, results, fields) {
                    if (error){
                        connection.end();
                        throw error;
                        return null;
                    }
                }
            );
            connection.end();
            return {'id':'' + id, 'name':'' + name, 'surname': '' + surname, 'mail':'mail@mail.it', 'enrolled': '' + date, 'born': '' + date};
        }
        else return null;
    }
    else return null;
}

function getAllUsers(enrolledBefore, enrolledAfter){
    checkDBConnection();
    if((enrolledBefore != -1) && (enrolledAfter != -1)){
        if(compareDatetime(enrolledAfter, enrolledBefore)){
            var retval = [];
            connection.connect();

            connection.query('SELECT * FROM user WHERE user.enrolled >= ? AND user.enrolled =< ?', [enrolledBefore, enrolledAfter], function (error, results, fields) {
                if (error){
                    throw error;
                    return null;
                }
                if(result.lenght > 0){
                    for(var i = 0; i < results.lenght; i++){
                        retval.push({'id':'' + results[i].id, 'name':'' + results[i].name, 'surname': '' + results[i].surname, 'mail': '' + results[i].mail, 'enrolled': '' + results[i].enrolled, 'born': '' + results[i].born})
                    }
                }else{
                    retval = null;
                }
                return retval;
            });

            connection.end();
        }
    }
    else if((enrolledBefore == -1) && (enrolledAfter != -1)){
        var retval = [];
        connection.connect();

        connection.query('SELECT * FROM user WHERE user.enrolled >= ?', [enrolledAfter], function (error, results, fields) {
            if (error){
                throw error;
                return null;
            }
            if(result.lenght > 0){
                for(var i = 0; i < results.lenght; i++){
                    retval.push({'id':'' + results[i].id, 'name':'' + results[i].name, 'surname': '' + results[i].surname, 'mail': '' + results[i].mail, 'enrolled': '' + results[i].enrolled, 'born': '' + results[i].born})
                }
            }else{
                retval = null;
            }
            return retval;
        });

        connection.end();
    }
    else if((enrolledBefore != -1) && (enrolledAfter == -1)){
        var retval = [];
        connection.connect();

        connection.query('SELECT * FROM user WHERE user.enrolled <= ?', [enrolledBefore], function (error, results, fields) {
            if (error){
                throw error;
                return null;
            }
            if(result.lenght > 0){
                for(var i = 0; i < results.lenght; i++){
                    retval.push({'id':'' + results[i].id, 'name':'' + results[i].name, 'surname': '' + results[i].surname, 'mail': '' + results[i].mail, 'enrolled': '' + results[i].enrolled, 'born': '' + results[i].born})
                }
            }else{
                retval = null;
            }
            return retval;
        });

        connection.end();
    }
    else if((enrolledBefore == -1) && (enrolledAfter == -1)){
        var retval = [];
        connection.connect();

        connection.query('SELECT * FROM user', function (error, results, fields) {
            if (error){
                throw error;
                return null;
            }
            if(result.lenght > 0){
                for(var i = 0; i < results.lenght; i++){
                    retval.push({'id':'' + results[i].id, 'name':'' + results[i].name, 'surname': '' + results[i].surname, 'mail': '' + results[i].mail, 'enrolled': '' + results[i].enrolled, 'born': '' + results[i].born})
                }
            }else{
                retval = null;
            }

            return retval;
        });

        connection.end();
    }
}

function getUser(id){
    checkDBConnection();
    if(Number.isInteger(parseInt(id, 10))){
        var retval;
        connection.connect();

        connection.query('SELECT * FROM user WHERE id = ?', [id] , function (error, results, fields) {
            if (error){
                throw error;
                return null;
            }
            if(result.lenght > 0){
                retval = {'id':'' + results[0].id, 'name':'' + results[0].name, 'surname': '' + results[0].surname, 'mail': '' + results[0].mail, 'enrolled': '' + results[0].enrolled, 'born': '' + results[0].born};
            }else{
                retval = null;
            }
            return retval;
        });

        connection.end();
    }
    else return null;
}

function updateUser(user){
    checkDBConnection();
    if(user != null){
        if(user.id != null && user.name != null && user.surname != null && user.email != null && user.enrolled != null && user.born != null){
            var retval;
            connection.connect();

            connection.query('UPDATE user SET name = ?, surname = ?, email = ?, enrolled = ?, born = ? WHERE id = ?', [user.name, user.surname, user.email, user.enrolled, user.born, user.id] , function (error, results, fields) {
                if (error){
                    throw error;
                    return null;
                }
                if(results.affectedRows > 0){
                    retval = user;
                }else{
                    retval = null;
                }
                return retval;
            });

            connection.end();
        }
        else return null;
    }
    else return null;
}

function deleteUser(id){
    checkDBConnection();
    if(id != null){
        if(Number.isInteger(parseInt(id, 10))){
            var user = userDao.getUser(parseInt(id, 10));
            if(user.id != null && user.name != null && user.surname != null && user.email != null && user.enrolled != null && user.born != null){
                var retval;
                connection.connect();

                connection.query('DELETE FROM user WHERE id = ?', [user.id] , function (error, results, fields) {
                    if (error){
                        throw error;
                        return null;
                    }
                    if(results.affectedRows > 0){
                        retval = user;
                    }else{
                        retval = null;
                    }
                    return retval;
                });

                connection.end();
            }
        }
        else return null;
    }
    else return null;
}

//da implementare
function compareDatetime(date1, date2){
    return true;
}

module.exports = {getAllUsers, createUser, getUser, updateUser, deleteUser};
