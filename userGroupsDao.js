const utilities = require('./utilities');
const connection = utilities.connection;
const userDao = require('./userDao');

function createUserGroup(userGroup) {
    return new Promise(resolve => {
        //checking if infos are complete and if the userGroup has at least one user in it
        if (userGroup != null && userGroup.creator != null && userGroup.creator.id != null &&
            userGroup.name != null) {
            connection.query('INSERT INTO user_group (id_creator, name) VALUES (?,?)',
                [userGroup.creator.id, userGroup.name],
                function (error, results, fields) {
                    if (error) {
                        throw error;
                        resolve(null);
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

function emptyUserGroup(id){
    return new Promise(resolve => {
        if(id != null){
            connection.query('DELETE FROM user_group_members WHERE id_group = ?', [id], function (error, results, fields) {
                if (error) {
                    throw error;
                }
                resolve(null);
            });
        } else
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
        //sortingMethod = rightParamForSort(sSELECT *ortingMethod);
        let fetchQuery = 'SELECT G.id_creator, G.name, GM.id_user ' +
            'FROM user_group G, user_group_members GM ' +
            'WHERE G.id = ? AND G.id = GM.id_group';
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
                            userGroup.users.sort(utilities.compareEnroll);
                        else
                            userGroup.users.sort(utilities.compareAlfa);
                        resolve(userGroup);
                    });
                });
            }else
                resolve(null);
        });
    });
}

function getAllUserGroups(loggedUser, sortingMethod) {
    if (sortingMethod != 'enrolled')
        sortingMethod = 'alpha';

    let promises_userGroups = [];
    let userGroups = []; //this function will return this filled with all user groups

    return new Promise(resolve => {
        let fetchQuery = 'SELECT G.id FROM user_group G';
        connection.query(fetchQuery, [], function (error, results, fields) {
            if (error) {
                throw error;
                resolve(null);
            }
            if(results.length > 0){
                let promise_tmp;
                for(let i=0; i < results.length; i++){
                    promise_tmp = getUserGroup(loggedUser, results[i].id, sortingMethod);
                    promises_userGroups.push(promise_tmp);
                    promise_tmp.then(userGroupToAdd => {
                        //console.log("New user Group added idUG = " + userGroupToAdd.id);
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
    });
}

/* Delete a userGroup. Can be performed only by the userGroup creator
 *  In this regard, security checks have to be added before the function calling
 */
function deleteUserGroup(loggedUser, id) {
    return new Promise(resolve => {
        if (id != null && Number.isInteger(+id) && loggedUser != null && loggedUser.id != null) {
            let deleteQuery = 'DELETE ' +
                              'FROM user_group ' +
                              'WHERE id = ?';
            let retval;

            getUserGroup(loggedUser, id).then(userGroup => {
                if(loggedUser.id == userGroup.creator.id){
                    connection.query(deleteQuery, [id], function (error, results, fields) {
                        if (error) {
                            throw error;
                            return null;
                        }
                        if (results.affectedRows > 0) {
                            retval = userGroup;
                        } else {
                            retval = null;
                        }
                        resolve(retval);
                    });
                } else
                    resolve('403');
            });
        }
        else
            resolve(null);
    });
}

function updateUserGroup(loggedUser, userGroup){
    return new Promise(resolve => {
        getUserGroup(loggedUser, userGroup.id).then(userGroup_tmp => {
            if(userGroup_tmp.creator.id==loggedUser.id){
                if(utilities.isAUserGroup(userGroup)){
                  connection.query('UPDATE user_group SET id_creator = ?, name = ? WHERE id = ?', [userGroup.creator.id, userGroup.name, userGroup.id], function (error, results, fields) {
                      if (error) {
                          throw error;
                          resolve(null);
                      }
                      if (results.affectedRows > 0) {
                          let emptyUserGroup_promise;
                          emptyUserGroup_promise = emptyUserGroup(userGroup.id);
                          Promise.resolve(emptyUserGroup_promise).then(a=>{
                              let members_promises = [];
                              for (let member of userGroup.users) {
                                  members_promises.push(addMember(userGroup, member));
                              }
                              Promise.all(members_promises).then(b => {
                                  resolve(userGroup);
                              });
                          });
                      } else {
                          resolve(null);
                      }
                  });
                }
            } else
                resolve('403');
        });
    });
}

/*
 |##################|
 |#USED FOR TESTING#|
 |##################|
*/
/*
let gusers = [
{"id":"102214019543444378931","name":"DalMoro","surname":"Devis","email":"null","enrolled":null,"born":null,"submissions":[],"exam_eval":[]},
{"id":"110228221053954638301","name":"Giovanni","surname":"Guadagnini","email":"null","enrolled":null,"born":null,"submissions":[],"exam_eval":[]},
{"id":"117840787244259010609","name":"List","surname":"BBShopping","email":"null","enrolled":null,"born":null,"submissions":[],"exam_eval":[]},
{"id":"12","name":"null","surname":"null","email":"null","enrolled":null,"born":null,"submissions":[],"exam_eval":[]},
{"id":"123","name":"Bubba","surname":"B","email":"null","enrolled":null,"born":{"year":1997,"month":0,"day":3,"hour":23,"minute":0,"second":15},"submissions":[],"exam_eval":[]}];
*/
/*
let gusers = [{"id":"99","name":"Marco","surname":"Boffino","email":"dummy@dummy.com","enrolled":{"year":2011,"month":8,"day":31,"hour":12,"minute":30,"second":0},"born":{"year":1967,"month":11,"day":3,"hour":0,"minute":0,"second":0},"submissions":[],"exam_eval":[]},{"id":"12","name":"John","surname":"Doe","email":"email@email.com","enrolled":{"year":2016,"month":9,"day":8,"hour":19,"minute":16,"second":25},"born":{"year":1997,"month":9,"day":2,"hour":0,"minute":0,"second":0},"submissions":[{"id":360,"task_type":"open","question":{"text":"What do you get if you perform 1 + 1 ? ","possibilities":[],"base_upload_url":"http://uploadhere.com/dummy/v1/"},"answer":"25 I think","id_user":"12","id_exam":143,"completed":1,"comment_peer":["You did a great job dude","You better go study philosophy","Hi! My name's Peter"],"comment":"Almost... that's a shame: you were so close to the solution!","points":2,"earned_points":0},{"id":361,"task_type":"single_c","question":{"text":"What do you get if you perform 1 + 1 ?\nSelect the right answer","possibilities":["0","1","2","Infinite"],"base_upload_url":"http://uploadhere.com/dummy/v1/"},"answer":"0","id_user":"12","id_exam":143,"completed":1,"comment_peer":[],"comment":"My name is Bob and I've hacked the professor so I'll put you the best reward even if your answers suck","points":1,"earned_points":1},{"id":362,"task_type":"submit","question":{"text":"What do you get if you perform 1 + 1 ?\nPut the answer in a file (out.txt) that has to be uploaded","possibilities":[],"base_upload_url":"http://uploadhere.com/dummy/v1/"},"answer":"http://uploadhere.com/dummy/v1/solutions12_1_3","id_user":"12","id_exam":143,"completed":1,"comment_peer":[],"comment":"Hate saying this... but tomorrow I'll resign myself","points":3,"earned_points":3}],"exam_eval":[{"id_exam":143,"mark":20}]},{"id":"117840787244259010609","name":"BBShopping","surname":"List","email":"null","enrolled":null,"born":null,"submissions":[],"exam_eval":[]},{"id":"11","name":"Jimmy","surname":"Teacher","email":"dummy@dummy.com","enrolled":{"year":2011,"month":8,"day":31,"hour":12,"minute":30,"second":0},"born":{"year":1967,"month":11,"day":3,"hour":0,"minute":0,"second":0},"submissions":[],"exam_eval":[]}];

let gcreator = {"id":"99","name":"Marco","surname":"Boffino","email":"dummy@dummy.com","enrolled":{"year":2011,"month":8,"day":31,"hour":12,"minute":30,"second":0},"born":{"year":1967,"month":11,"day":3,"hour":0,"minute":0,"second":0},"submissions":[],"exam_eval":[]};

let userGroup = {
    name: 'I mangiacarne3',
    creator: gcreator,
    users: gusers
};
    getUserGroup({id: 'invalidId'}, 179, 'alpha').then(group => {
        console.log(JSON.stringify(group) + "\n\n\n\n");
        deleteUserGroup(group.creator, group.id).then( updgroup => {
            console.log(JSON.stringify(updgroup));
        });
    });
*/

module.exports = {createUserGroup, getAllUserGroups, getUserGroup, updateUserGroup, deleteUserGroup};
