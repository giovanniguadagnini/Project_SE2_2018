const userDao = require('./db/userDao');

/*function which handle GET /users */
function getUsers(req, res) {
    //enrolled before (<=) a specific year
    let enrolledBefore = req.query.enrolledBefore;
    if (enrolledBefore == null) {
        enrolledBefore = new Date().getUTCFullYear();//default is current year
    }

    //enrolled after (>=) a specific year
    let enrolledAfter = req.query.enrolledAfter;
    if (enrolledAfter == null) {
        enrolledAfter = 1900; //default is year 1900
    }

    //
    let sortUsrBy = req.query.sortUsrBy;
    if (sortUsrBy == null || (sortUsrBy != 'alpha' && sortUsrBy != 'enrol')) {
        sortUsrBy = 'alpha'; //default is 'alpha'
    }

    userDao.getAllUsers(req.user, enrolledAfter, enrolledBefore, sortUsrBy).then(users => {
        if (users != null) {
            res.status(200).json(users);
        } else {
            res.status(500).send('Internal Server Error');//something went wrong
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

    // in put I check that the user is update its own account
    // (update /users/:id can only be called on profile we're logged with)
    if (id == user.id && req.user.id == id) {
        //user = userDao.updateUserSyn(user);//trying to update the user
        userDao.updateUser(user).then(user => {
            if (user != null) {
                res.status(200).json(user);
            } else {
                res.status(400).send('Bad request');
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
    let user = { id: req.body.id };

    // in delete I check that the user is deleting its own account
    // (delete /users/:id can only be called on profile we're logged with)
    if (id == user.id && req.user.id == id) {
        //user = userDao.deleteUserSyn(user);//trying to update the user
        userDao.deleteUser(req.user, user.id).then(user => {
            if (user != null) {
                res.status(200).json(user);
            } else {
                res.status(400).send('Bad Request');
            }
        });
    } else if (id == user.id) {
        res.status(400).send('Bad request');
    } else {
        res.status(403).send('Forbidden');
    }
}

module.exports = { getUsers, getUserById, updateUser, deleteUser };
