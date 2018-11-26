const app = require('./app');
const userDao = require('./userDao');

app.route('/users')
    .get(function(req, res) { //Get all available users
        var enrolledBefore = req.query.enrolledBefore;
        if(enrolledBefore == null){
            enrolledBefore = -1;
        }
        var enrolledAfter = req.query.enrolledAfter;
        if(enrolledAfter == null) {
            enrolledAfter = -1;
        }
        var users = userDao.getAllUsers(enrolledBefore, enrolledAfter);
        if(users != null) {
            res.status(200).send(users);
        } else {
            res.status(404).send("No user found");
        }
    })
    .post(function(req, res) { //Create user
        var user = {
            id : req.body.id,
            name: req.body.name,
            surname : req.body.surname,
        };
        user = userDao.createUser(user);//trying to create the user
        if (user != null) {
            res.status(200).send(user);
        } else {
            res.status(405).send("Invalid input");
        }
    });

app.route('/users/:id')
    .get(function(req, res) { //Get account data
        var id = parseInt(req.params.id, 10);
        if(Number.isInteger(id) == true) {
            var user = userDao.getUser(id); //trying to get the user from the system
            if (user != null) {
                res.status(200).send(user);
            } else {
                res.status(404).send("User not found");
            }
        }else{
            res.status(400).send("Invalid ID supplied");
        }
    })
    .put(function(req, res) {//Update account info
        var id = parseInt(req.params.id, 10);
        if(Number.isInteger(id) == true) {
            var user = {
                name: req.body.name,
                surname : req.body.surname,
                password : req.body.password,
                email : req.body.email,
                born : req.body.born,
                enrolled : req.body.enrolled
            };
            user = userDao.updateUser(user);//trying to update the user
            if (user != null) {
                res.status(200).send(user);
            } else {
                res.status(404).send("User not found");
            }
        }else{
            res.status(400).send("Invalid ID supplied");
        }
    })
    .delete(function(req, res) {//Update account info
        var id = parseInt(req.params.id, 10);
        if(Number.isInteger(id) == true) {
            user = userDao.deleteUser(''+id);//trying to delete the user(the function wants id as a string)
            if (retval != null) {
                res.status(200).send(user);
            } else {
                res.status(404).send("User not found");
            }
        }else{
            res.status(400).send("Invalid ID supplied");
        }
    });

module.exports = app;
