const userGroupsDao = require('./userGroupsDao')
const userDao = require('./userDao');

function createUserGroup(req, res){
    userDao.getUser(req.user, req.user.id).then( g_creator => {
        let userGroup = {
            creator : g_creator,
            name : req.body.name,
            users : req.body.users
        };
        userGroupsDao.createUserGroup(userGroup).then( userGroupCreated => {
            if(userGroupCreated != null)
                res.status(201).json(userGroupCreated);
            else
                res.status(405).send('Invalid input');
        });

    });

}

function getUserGroup(req, res){
    let id = req.id;
    if(Number.isInteger(+id)) {
        let sortingMethod = req.query.sortStudBy;
        userGroupsDao.getUserGroup(req.user, id, sortingMethod).then( userGroup => {
            if(userGroup!=null)
                res.status(200).json(userGroup);
            else
                res.status(404).send('userGroup not found' );
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
    let userGroup = {
        id: req.body.id,
        creator: req.body.creator,
        name: req.body.name,
        users: req.body.users
    };

    userGroupsDao.updateUserGroup(userGroup).then(userGroup => {
        if(userGroup!=null)
            res.status(200).json(userGroup);
        else
            res.status(404).send('userGroup not found');
    });
}

function deleteUserGroup(req, res){
    let id = req.body.id;
    if(Number.isInteger(id)){
        userGroupsDao.deleteUserGroup(req.user, id).then( userGroup => {
            if(userGroup!=null)
                res.status(200).json(userGroup);
            else
                res.status(404).send('userGroup not found' );
        });
    } else
        res.status(400).send('Bad request');
}

<<<<<<< HEAD
module.exports = {createUserGroup, getAllUserGroups, getUserGroup, updateUserGroup, deleteUserGroup};
=======
module.exports = {postUserGroup, getAllUserGroups, getUserGroup, updateUserGroup, deleteUserGroup};
>>>>>>> 929d2c5ad77d6c95aaf6315d1dee9fbc81eee0ef
