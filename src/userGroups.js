const userGroupsDao = require('./db/userGroupsDao')
const userDao = require('./db/userDao');
const utilities = require('./utilities');

//this function lets the user create a new user group
function createUserGroup(req, res) {
    if (req.body.userGroup != null && req.body.user != null) {
        //get the user group to create from the request
        let userGroup = {
            creator: req.body.userGroup.creator,
            name: req.body.userGroup.name,
            users: req.body.userGroup.users
        };

        //get the user from the request
        let user = {
            id: req.body.user.id,
            name: req.body.user.name,
            surname: req.body.user.surname,
            email: req.body.user.email,
            born: req.body.user.born,
            enrolled: req.body.user.enrolled
        };
        //check if the user exists
        userDao.getUser(user, user.id).then(g_creator => {
            //check if the user group is a proper user group
            if (utilities.isAUserGroupBody(userGroup)) {
                //create the user group
                userGroupsDao.createUserGroup(userGroup).then(userGroupCreated => {
                    if (userGroupCreated != null)
                        res.status(201).json(userGroupCreated);
                    else
                        res.status(400).send('Bad request');
                });
            } else
                res.status(400).send('Bad request');
        });
    } else res.status(400).send('Bad request');
}

//this function gets a specific user group
function getUserGroup(req, res) {
    //gets the user group's id to request
    let id = req.params.id;
    if (Number.isInteger(+id)) {
        //gets the sorting method to sort the student of the user group with
        let sortingMethod = req.query.sortStudBy;
        //requests the user group
        userGroupsDao.getUserGroup(req.user, id, sortingMethod).then(userGroup => {
            if (userGroup != null)
                res.status(200).json(userGroup);
            else
                res.status(404).send('User Group not found');
        });

    } else {
        res.status(400).send('Invalid ID supplied');
    }
}

//same a getUserGroup, but iterated for everyone
function getAllUserGroups(req, res) {
    let sortingMethod = req.query.sortStudBy;
    userGroupsDao.getAllUserGroups(req.user, sortingMethod).then(userGroups => {
        if (userGroups != null)
            res.status(200).json(userGroups);
        else
            res.status(404).send('No userGroup found');
    });
}

//this function changes a user group informations
function updateUserGroup(req, res) {
    //the id of the user group to update
    let id = req.params.id;
    //the updated user group informations
    let userGroup = {
        id: req.body.userGroup.id,
        creator: req.body.userGroup.creator,
        name: req.body.userGroup.name,
        users: req.body.userGroup.users
    };
    //if the ids are the same, updates the user group
    if (req.user.id == userGroup.creator.id) {
        if (id == userGroup.id) {
            userGroupsDao.updateUserGroup(req.user, userGroup).then(userGroup => {
                if (userGroup == '403')
                    res.status(403).send('Forbidden');
                else if (userGroup != null)
                    res.status(200).json(userGroup);
                else
                    res.status(404).send('userGroup not found');
            });
        } else res.status(404).send('userGroup not found');
    } else res.status(403).send('Forbidden');
}

//this function deletes a user group from the db
function deleteUserGroup(req, res) {
    //the id of the user group to delete
    let id = req.params.id;

    if (Number.isInteger(+id)) {
        userGroupsDao.deleteUserGroup(req.user, id).then(userGroup2 => {
            if (userGroup2 == '403')
                res.status(403).send('Forbidden');
            else if (userGroup2 != null)
                res.status(200).json(userGroup2);
            else
                res.status(404).send('User Group not found');
        });
    } else res.status(400).send('Bad request');
}

module.exports = { createUserGroup, getAllUserGroups, getUserGroup, updateUserGroup, deleteUserGroup };
