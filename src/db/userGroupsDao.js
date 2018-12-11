const utilities = require('../utilities');
const connection = utilities.connection;
const userDao = require('./userDao');

function createUserGroup(userGroup) {
    return new Promise(resolve => {
        //checking if infos are complete and if the userGroup has at least one user in it
        if (userGroup != null && userGroup.creator != null && userGroup.creator.id != null &&
            userGroup.name != null) {
            //send the query to the db
            connection.query('INSERT INTO user_group (id_creator, name) VALUES (?,?)',
                [userGroup.creator.id, userGroup.name],
                function (error, results, fields) {
                    if (error) {
                        throw error;
                        resolve(null);
                    } //get the id of the new group
                    userGroup.id = results.insertId;
                    let members_promises = [];
                    //for every member, add it to the group
                    for (let member of userGroup.users) {
                        members_promises.push(addMember(userGroup, member));
                    }
                    Promise.all(members_promises).then(b => {
                        resolve(userGroup);
                    });
                });
        } else
            resolve(null); //if something goes wrong with the checks, return null
    });
}

//add a member to a user group
function addMember(userGroup, member) {
    return new Promise(resolve => {
        //integrity checks
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
        } else
            resolve(null);
    });
}

//deletes all the members from a user group
function emptyUserGroup(id) { //id of the user group to empty
    return new Promise(resolve => {
        if (id != null) {
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

function getUserGroup(loggedUser, id, sortingMethod) {
    return new Promise(resolve => {
        if (loggedUser != null && loggedUser.id != null) {
            let userGroup = { //instanciate the user group
                id: null,
                creator: null,
                name: null,
                users: []
            };
            let fetchQuery = 'SELECT G.id_creator, G.name, GM.id_user ' +
                'FROM user_group G, user_group_members GM ' +
                'WHERE G.id = ? AND G.id = GM.id_group';
            connection.query(fetchQuery, [id], function (error, results, fields) {
                if (error) {
                    throw error;
                    resolve(null);
                }
                //if I get a user group
                if (results.length > 0) {
                    userGroup.id = id; //insert the id in the user group
                    userGroup.name = results[0].name; //insert the name in the user group
                    //get the creator details
                    userDao.getUser(loggedUser, results[0].id_creator).then(creator => {
                        userGroup.creator = creator; //insert the creator in the user group
                        let promises_user = [];
                        let promise_tmp;
                        for (let i = 0; i < results.length; i++) {
                            //insert every user in the user group
                            promise_tmp = userDao.getUser(loggedUser, results[i].id_user);
                            promises_user.push(promise_tmp);
                            promise_tmp.then(member => {
                                userGroup.users.push(member);
                            });
                        }
                        Promise.all(promises_user).then(b => {
                            if (sortingMethod == 'enrolled') //if enrolled is the sorting method
                                userGroup.users.sort(utilities.compareEnroll); //sort on enroll
                            else //otherwise use an alfabetic sorting method
                                userGroup.users.sort(utilities.compareAlfa);
                            resolve(userGroup); //return the completed user group
                        });
                    });
                } else
                    resolve(null);
            });
        } else resolve(null);
    });
}

function getAllUserGroups(loggedUser, sortingMethod) {
    return new Promise(resolve => {
        if (loggedUser != null && loggedUser.id != null) {
            if (sortingMethod != 'enrolled')
                sortingMethod = 'alpha';

            let promises_userGroups = [];
            let userGroups = []; //this function will return this filled with all user groups
            let fetchQuery = 'SELECT G.id FROM user_group G';
            //get all user groups' ids
            connection.query(fetchQuery, [], function (error, results, fields) {
                if (error) {
                    throw error;
                    resolve(null);
                }
                if (results.length > 0) {
                    let promise_tmp;
                    //for every id, get the user group
                    for (let i = 0; i < results.length; i++) {
                        promise_tmp = getUserGroup(loggedUser, results[i].id, sortingMethod);
                        promises_userGroups.push(promise_tmp);
                        promise_tmp.then(userGroupToAdd => {
                            userGroups.push(userGroupToAdd);
                        });
                    }

                    Promise.all(promises_userGroups).then(b => {
                        resolve(userGroups); //return the array of user groups
                    });
                } else {
                    resolve(null);
                }
            });

        } else resolve(null);
    });
}

function deleteUserGroup(loggedUser, id) {
    return new Promise(resolve => {
        if (id != null && Number.isInteger(+id) && loggedUser != null && loggedUser.id != null) {
            //prepare the query
            let deleteQuery = 'DELETE ' +
                'FROM user_group ' +
                'WHERE id = ?';
            let retval;
            //get the user group to delete
            getUserGroup(loggedUser, id).then(userGroup => {
                if (userGroup != null) {
                    //control if the user has the right to delete it
                    if (loggedUser.id == userGroup.creator.id) {
                        connection.query(deleteQuery, [id], function (error, results, fields) {
                            if (error) {
                                throw error;
                                return null;
                            }
                            //if the user group gets deleted
                            if (results.affectedRows > 0) {
                                retval = userGroup;
                            } else {
                                retval = null;
                            }
                            resolve(retval);
                        });
                    } else //forbidden if the user isn't the group creator
                        resolve('403');
                } else resolve(null);
            });
        }
        else
            resolve(null);
    });
}

function updateUserGroup(loggedUser, userGroup) {
    return new Promise(resolve => {
        //get the user group infos
        getUserGroup(loggedUser, userGroup.id).then(userGroup_tmp => {
            //if the user group exists...
            if (userGroup_tmp != null) {
                //...and the user has the permission to update it...
                if (userGroup_tmp.creator.id == loggedUser.id) {
                    //...and the updated user group is a proper user group...
                    if (utilities.isAUserGroup(userGroup)) {
                        //...update the user group informations
                        connection.query('UPDATE user_group SET id_creator = ?, name = ? WHERE id = ?', [userGroup.creator.id, userGroup.name, userGroup.id], function (error, results, fields) {
                            if (error) {
                                throw error;
                                resolve(null);
                            }
                            //now for the users in the user group
                            if (results.affectedRows > 0) {
                                let emptyUserGroup_promise;
                                //empty the old users...
                                emptyUserGroup_promise = emptyUserGroup(userGroup.id);
                                Promise.resolve(emptyUserGroup_promise).then(a => {
                                    let members_promises = [];
                                    //...and insert the new ones
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
            } else resolve(null);
        });
    });
}

module.exports = { createUserGroup, getAllUserGroups, getUserGroup, updateUserGroup, deleteUserGroup };
