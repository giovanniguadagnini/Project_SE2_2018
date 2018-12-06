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
                });
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
        if(loggedUser != null && loggedUser.id != null){
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
        }else resolve(null);
    });
}

function getAllUserGroups(loggedUser, sortingMethod) {
    return new Promise(resolve => {
        if(loggedUser != null && loggedUser.id != null){
            if (sortingMethod != 'enrolled')
                sortingMethod = 'alpha';

            let promises_userGroups = [];
            let userGroups = []; //this function will return this filled with all user groups
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

        }else resolve(null);
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
                if(userGroup != null){
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
                }else resolve(null);
            });
        }
        else
            resolve(null);
    });
}

function updateUserGroup(loggedUser, userGroup){
    return new Promise(resolve => {
        getUserGroup(loggedUser, userGroup.id).then(userGroup_tmp => {
            if(userGroup_tmp != null){
                if(userGroup_tmp.creator.id == loggedUser.id){
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
            }else resolve(null);
        });
    });
}

module.exports = {createUserGroup, getAllUserGroups, getUserGroup, updateUserGroup, deleteUserGroup};
