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
                        if(sortingMethod == 'enrolled')
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
    else if(a.surname == null && b.surname != null)loggedUser
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
    //check year
    if (a.enrolled.year < b.enrolled.year)
        return -1;
    else if (a.enrolled.year > b.enrolled.year)
        return 1;
    //check month
    if (a.enrolled.month < b.enrolled.month)
        return -1;
    else if (a.enrolled.month > b.enrolled.month)
        return 1;
    //check day
    if (a.enrolled.day < b.enrolled.day)
        return -1;
    else if (a.enrolled.day > b.enrolled.day)
        return 1;
    //check hour
    if (a.enrolled.hour < b.enrolled.hour)
        return -1;
    else if (a.enrolled.hour > b.enrolled.hour)
        return 1;
    //check minute
    if (a.enrolled.minute < b.enrolled.minute)
        return -1;
    else if (a.enrolled.minute > b.enrolled.minute)
        return 1;
    //check second
    if (a.enrolled.second < b.enrolled.second)
        return -1;
    else if (a.enrolled.second > b.enrolled.second)
        return 1;

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


function getAllUserGroups(loggedUser, sortingMethod) {
    if (sortingMethod == 'enrolled')
        sortingMethod = 'enrolled'
    else
        sortingMethod = 'alpha';

    let promises_userGroups;
    let userGroups = []; //this function will return this filled with all user groups

    return new Promise(resolve => {
        let fetchQuery = 'SELECT G.id_group FROM user_group';
        connection.query(fetchQuery, [], function (error, results, fields) {
            if (error) {
                throw error;
                resolve(null);
            }
            if(results.length > 0){
                let promise_tmp;
                for(let i=0; i < results.length; i++){
                    promise_tmp = getUserGroup(loggedUser, results[i], sortingMethod);
                    promises_userGroups.push(promise_tmp);
                    promise_tmp.then(userGroupToAdd => {
                        userGroups.push(userGroupToAdd);
                    });
                }

                Promise.all(promises_userGroups).then(b => {
                    resolve(userGroups);
                });
            } else {
              resolve(null);
            }
        });
    }
}

module.exports = {createUserGroup, getAllUserGroups, getUserGroup};
