var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7267085',
    password: 'IlVZ5TF9HT',
    database: 'sql7267085'
});

const userDao = require('./userDao');

function createUserGroup(userGroup) {
    return new Promise(resolve => {
        //checking if infos are complete and if the userGroup has at least one user in it
        if (userGroup != null && userGroup.creator != null && userGroup.creator.id != null &&
            userGroup.name != null && userGroup.users != null) {
            connection.query('INSERT INTO user_group (id_creator, name) VALUES (?,?)',
                [userGroup.creator.id, userGroup.name],
                function (error, results, fields) {
                    if (error) {
                        throw error;
                        return null;
                    }
                    userGroup.id = results.insertId;
                    let members_promises = [];
                    for (let member of userGroup.users) {
                        members_promises.push(addMember(userGroup, member));
                    }
                    Promise.all(members_promises).then(b => {
                        resolve(userGroup);
                    });
                }
            );
        } else
            resolve(null);
    });
}

function addMember(userGroup, member) {
    return new Promise( resolve => {
        if (userGroup != null && userGroup.id != null && member != null && member.id != null) {
            connection.query('INSERT INTO user_group_members (id_user, id_group) VALUES (?,?)',
                [member.id, userGroup.id],
                function (error, results, fields) {
                    if (error) {
                        throw error;
                    }
                    resolve(null);
                }
            );
        }else
            resolve(null);
    });
}

function getUserGroup(loggedUser, id, sortingMethod){
    return new Promise(resolve => {
        let userGroup = {
            id: null,
            creator: null,
            name: null,
            users: []
        };
        //sortingMethod = rightParamForSort(sortingMethod);
        let fetchQuery = 'SELECT G.id_creator, G.name, GM.id_user\n' +
            'FROM user_group G, user_group_members GM, user U\n' +
            'WHERE G.id = ? AND G.id = GM.id_group AND GM.id_user=U.id\n';
        connection.query(fetchQuery, [id], function (error, results, fields) {
            if (error) {
                throw error;
                resolve (null);
            }

            if(results.length > 0){
                userGroup.id = id;
                userGroup.name = results[0].name;
                userDao.getUser(loggedUser, results[0].id_creator).then( creator => {
                    userGroup.creator = creator;
                    let promises_user = [];
                    let promise_tmp;
                    for(let i = 0; i < results.length; i++){
                        promise_tmp = userDao.getUser(loggedUser, results[i].id_user);
                        promises_user.push(promise_tmp);
                        promise_tmp.then( member => {
                            userGroup.users.push(member);
                        });
                    }
                    Promise.all(promises_user).then(b => {
                        if(sortingMethod == 'alpha')
                            userGroup.users.sort(compareAlfa);
                        else
                            userGroup.users.sort(compareEnrol);
                        resolve(userGroup);
                    });
                });
            }else
                resolve(null);

        });
    });
}

function compareAlfa(a, b){
    //we put null at the end of the queue
    if(a.surname == null && b.surname == null)
        return 0;
    else if(a.surname == null && b.surname != null)
        return 1;
    else if(a.surname != null && b.surname == null)
        return -1;

    let surnameA = a.surname.toUpperCase();
    let surnameB = b.surname.toUpperCase();

    if (surnameA < surnameB)
        return -1;
    else if (surnameA > surnameB)
        return 1;

    if(a.name == null && b.name == null)
        return 0;
    else if(a.name == null && b.name != null)
        return 1;
    else if(a.name != null && b.name == null)
        return -1;

    let nameA = a.name.toUpperCase();
    let nameB = b.name.toUpperCase();
    if(nameA < nameB)
        return -1;
    else if(nameA > nameB)
        return 1;
    else
        return 0;
}

function compareEnrol(a, b){
    //we put null at the end of the queue
    if(a.enrolled == null && b.enrolled == null)
        return 0;
    else if(a.enrolled != null && b.enrolled == null)
        return -1;
    else if(a.enrolled == null && b.enrolled != null)
        return 0;

    let yA = a.enrolled.year;
    let yB = b.enrolled.year;
    //NEED TO BE FINISHED
    return 0;
}

/*
function rightParamForSort(sortingMethod){
    if (sortingMethod == 'alpha')
        sortingMethod = 'U.surname, U.name'; //order the "surname" field
    else
        sortingMethod = 'U.enrolled';
    return sortingMethod;
}*/

let gusers = [{"id":"102214019543444378931","name":"Dal Moro","surname":"Devis","email":"null","enrolled":null,"born":null,"submissions":[],"exam_eval":[]},{"id":"110228221053954638301","name":"Giovanni","surname":"Guadagnini","email":"null","enrolled":null,"born":null,"submissions":[],"exam_eval":[]},{"id":"117840787244259010609","name":"List","surname":"BBShopping","email":"null","enrolled":null,"born":null,"submissions":[],"exam_eval":[]},{"id":"12","name":"null","surname":"null","email":"null","enrolled":null,"born":null,"submissions":[],"exam_eval":[]},{"id":"123","name":"Bubba","surname":"B","email":"null","enrolled":null,"born":{"year":1997,"month":0,"day":3,"hour":23,"minute":0,"second":15},"submissions":[],"exam_eval":[]}];
let gcreator = {"id":"102214019543444378931","name":"Dal Moro","surname":"Devis","email":"null","enrolled":null,"born":null,"submissions":[],"exam_eval":[]};

let userGroup = {
    name: 'Japanese_offered By Daniel San',
    creator: gcreator,
    users: gusers
};

/*createUserGroup(userGroup).then( value =>{
    console.log(JSON.stringify(value));
});*/

getUserGroup({id: '12'},59,'alpha').then( value =>{
    console.log(JSON.stringify(value));
});


function getAllUserGroups(sortingMethod) {
    if (sortingMethod == null)
        sortingMethod = 'enrolled'; //order the "enrolled" field
    else if (sortingMethod = 'alpha')
        sortingMethod = 'surname' //order the "surname" field
    else
        sortingMethod = 'enrolled';


    var users = []; //used to store the users of every group
    var userGroups = []; //this function will return this filled with all user groups

    connection.query('SELECT * FROM user_group ', [], function (error, results, fields) {
        if (error) {
            throw error;
            return null;
        }
        if (results.length > 0) {
            //for every user group...
            results.forEach(function (userGroup) {
                var id = userGroup.id;
                var creator = userGroup.creator;
                var name = userGroup.name;

                //...pick up its creator...
                connection.query('SELECT * FROM user WHERE id = ?', [creator], function (error, results, fields) {
                    if (error) {
                        throw error;
                        return null;
                    }
                    if (results.length = 1) {
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
                    if (results.length > 0) {
                        for (var i = 0; i < result.length; i++) {
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
                if (userGroup.id != null) {
                    retval.push({
                        'id': '' + id,
                        'creator': '' + creator,
                        'name': '' + name,
                        'users': '' + users
                    })
                }

                //resetting users for next group iteration
                users = null;
            });
        } else {
            //if there are no user groups
            return null;
        }
    });

    return userGroups;
}

module.exports = {createUserGroup, getAllUserGroups, getUserGroup};
