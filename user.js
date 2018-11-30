const userDao = require('./userDao');

function getUsers(req, res) {
    let enrolledBefore = req.query.enrolledBefore;
    if (enrolledBefore == null) {
        enrolledBefore = new Date().getUTCFullYear();//default is current year
    }

    let enrolledAfter = req.query.enrolledAfter;
    if (enrolledAfter == null) {
        enrolledAfter = 1900; //default is year 1900
    }

    userDao.getAllUsers(req.user, enrolledBefore, enrolledAfter).then(users => {
        if (users != null) {
            res.status(200).json(users);
        } else {
            res.status(404).send('No user found');
        }
    });
}

function getUserById(req, res) { //Get user with id
    let id = req.params.id;//if the user we want to fetch the data of
    userDao.getUser(req.user, id).then(user => {// req.user contains id of the logged user
        if (user != null) {
            res.status(200).json(user);
        } else {
            res.status(404).send('User not found');
        }
    });
}

function updateUser(req, res) { //Update user
    let id = req.params.id;
    let user = {
        id: req.body.id,
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        born: req.body.born,
        enrolled: req.body.enrolled
    };

    //[TO DO] Evaluate with other members if it has more sense [put] /users
    // in put I check that the user is update its own account
    // (update /users/:id can only be called on profile we're logged with)
    if (id == user.id && req.user.id == id) {
        //user = userDao.updateUserSyn(user);//trying to update the user
        userDao.updateUser(user).then(user => {
            if (user != null) {
                res.status(200).json(user);
            } else {
                res.status(404).send('User not found');
            }
        });
    } else if (id == user.id) {
        res.status(400).send('Bad request');
    } else {
        res.status(403).send('Forbidden');
    }
}

function deleteUser(req, res) { //Delete user
    let id = req.params.id;
    let user = {
        id: req.body.id,
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        born: req.body.born,
        enrolled: req.body.enrolled
    };

    //[TO DO] Evaluate with other members if it has more sense [delete] /users
    // in delete I check that the user is deleting its own account
    // (delete /users/:id can only be called on profile we're logged with)
    if (id == user.id && req.user.id == id) {
        //user = userDao.deleteUserSyn(user);//trying to update the user
        userDao.deleteUser(user.id).then(user => {
            if (user != null) {
                res.status(200).json(user);
            } else {
                res.status(404).send('User not found');
            }
        });
    } else if (id == user.id) {
        res.status(400).send('Bad request');
    } else {
        res.status(403).send('Forbidden');
    }
}

module.exports = {getUsers, getUserById, updateUser, deleteUser};
