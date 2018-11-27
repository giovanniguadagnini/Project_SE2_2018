var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7267085',
    password: 'IlVZ5TF9HT',
    database: 'sql7267085'
});

function createUserGroup(userGroup) {
    //checking if infos are complete and if the userGroup has at least one user in it
    if (userGroup != null && userGroup.id != null && userGroup.creator != null && userGroup.creator.id != null && userGroup.name != null && userGroup.users != null && userGroup.users.length > 0) {
        connection.query('INSERT INTO user_group (id, creator, name) VALUES (?,?,?)',
            [userGroup.id, userGroup.creator.id, userGroup.name],
            function (error, results, fields) {
                if (error) {
                    throw error;
                    return null;
                }
            }
        );

        userGroup.users.forEach(function(user) {
            if (user != null && user.id != null) {
                connection.query('INSERT INTO user_group_members (id_user, id_group) VALUES (?,?)',
                    [user.id, userGroup.id],
                    function (error, results, fields) {
                        if (error) {
                            throw error;
                            return null;
                        }
                    }
                );
            }
        )};

        return userGroup;
    }
    else return null;
}

function getAllUserGroups(sortingMethod){
    if(sortingMethod==null)
        sortingMethod='enrolled'; //order the "enrolled" field
    else if(sortingMethod='alpha')
        sortingMethod='surname' //order the "surname" field
    else
        sortingMethod='enrolled';


    var users = []; //used to store the users of every group
    var userGroups = []; //this function will return this filled with all user groups

    connection.query('SELECT * FROM user_group ', [], function (error, results, fields) {
        if (error) {
            throw error;
            return null;
        }
        if(results.length>0){
            //for every user group...
            results.forEach(function(userGroup){
                var id = userGroup.id;
                var creator = userGroup.creator;
                var name = userGroup.name;

                //...pick up its creator...
                connection.query('SELECT * FROM user WHERE id = ?', [creator], function (error, results, fields) {
                    if (error) {
                        throw error;
                        return null;
                    }
                    if(results.length=1){
                        creator = null;
                        creator.push({
                            'id': '' + results[0].id,
                            'name': '' + results[0].name,
                            'surname': '' + results[0].surname,
                            'mail': '' + results[0].mail,
                            'enrolled': '' + results[0].enrolled,
                            'born': '' + results[0].born
                        })
                    }
                });

                //...and all its users...
                connection.query('SELECT * FROM user JOIN user_group_members WHERE id = id_user AND id_group = ? ORDER BY ?', [id, sortingMethod], function (error, results, fields) {
                    if (error) {
                        throw error;
                        return null;
                    }
                    if(results.length>0){
                        for(var i=0; i<result.length; i++){
                            users.push({
                                'id': '' + results[i].id,
                                'name': '' + results[i].name,
                                'surname': '' + results[i].surname,
                                'mail': '' + results[i].mail,
                                'enrolled': '' + results[i].enrolled,
                                'born': '' + results[i].born
                            })
                        }
                    }
                });

                //...and make a giant json
                if(userGroup.id!=null){
                    retval.push({
                        'id': '' + id,
                        'creator': '' + creator,
                        'name': '' + name,
                        'users': '' + users
                    })
                }

                //resetting users for next group iteration
                users=null;
            )};
        } else {
            //if there are no user groups
            return null;
        }
    });

    return userGroups;
}
