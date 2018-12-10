const userGroupsDao = require('./userGroupsDao')
const userDao = require('./userDao');
const utilities = require('./utilities');

function createUserGroup(req, res){
    if(req.body.userGroup != null && req.body.user != null){
        let userGroup = {
            creator: req.body.userGroup.creator,
            name: req.body.userGroup.name,
            users: req.body.userGroup.users
        };
        let user = {
            id: req.body.user.id,
            name: req.body.user.name,
            surname: req.body.user.surname,
            email: req.body.user.email,
            born: req.body.user.born,
            enrolled: req.body.user.enrolled
        };
        userDao.getUser(user, user.id).then( g_creator => {
            if(utilities.isAUserGroupBody(userGroup)){
                userGroupsDao.createUserGroup(userGroup).then( userGroupCreated => {
                    if(userGroupCreated != null)
                        res.status(201).json(userGroupCreated);
                    else
                        res.status(400).send('Bad request');
                });
            }else
                res.status(400).send('Bad request');
        });
    }else res.status(400).send('Bad request');
}

function getUserGroup(req, res){
    let id = req.params.id;
    if(Number.isInteger(+id)) {
        let sortingMethod = req.query.sortStudBy;
        userGroupsDao.getUserGroup(req.user, id, sortingMethod).then( userGroup => {
            if(userGroup!=null)
                res.status(200).json(userGroup);
            else
                res.status(404).send('User Group not found' );
        });

    } else {
        res.status(400).send('Invalid ID supplied');
    }
}

function getAllUserGroups(req, res){
    let sortingMethod = req.query.sortStudBy;
    userGroupsDao.getAllUserGroups(req.user, sortingMethod).then(userGroups => {
        if(userGroups != null)
            res.status(200).json(userGroups);
        else
            res.status(404).send('No userGroup found');
    });
}

function updateUserGroup(req, res){
    let id = req.params.id;
    let userGroup = {
        id: req.body.userGroup.id,
        creator: req.body.userGroup.creator,
        name: req.body.userGroup.name,
        users: req.body.userGroup.users
    };
    let user = {
        id: req.body.user.id,
        name: req.body.user.name,
        surname: req.body.user.surname,
        email: req.body.user.email,
        born: req.body.user.born,
        enrolled: req.body.user.enrolled
    };
    if(id == userGroup.id){
        userGroupsDao.updateUserGroup(user, userGroup).then(userGroup => {
            if(userGroup == '403')
                res.status(403).send('Forbidden');
            else if(userGroup!=null)
                res.status(200).json(userGroup);
            else
                res.status(404).send('userGroup not found');
        });
    } else res.status(404).send('userGroup not found');
}

function deleteUserGroup(req, res){
    let id = req.params.id;
    let userGroup = {
        id: req.body.userGroup.id,
        creator: req.body.userGroup.creator,
        name: req.body.userGroup.name,
        users: req.body.userGroup.users
    };
    let user = {
        id: req.body.user.id,
        name: req.body.user.name,
        surname: req.body.user.surname,
        email: req.body.user.email,
        born: req.body.user.born,
        enrolled: req.body.user.enrolled
    };
    if(Number.isInteger(+id)){
        if(id == userGroup.id){
            userGroupsDao.deleteUserGroup(user, userGroup.id).then( userGroup2 => {
                if(userGroup == '403')
                    res.status(403).send('Forbidden');
                else if(userGroup2!=null)
                    res.status(200).json(userGroup2);
                else
                    res.status(404).send('User Group not found' );
            });
        } else
            res.status(404).send('userGroup not found');
    }else res.status(400).send('Bad request');
}

module.exports = {createUserGroup, getAllUserGroups, getUserGroup, updateUserGroup, deleteUserGroup};
