const taskDao = require('./db/taskDao');

function getTasks(req, res) { //Get all the manageable tasks
    taskDao.getTasks(req.user).then(tasks => {
        if (tasks != null) {
            res.status(200).json(tasks);
        } else {
            res.status(400).send("Bad request");
        }
    });
};

function createTask(req, res) { //Create a task
    let task = {
        id: req.body.id,
        exam: req.body.exam,
        owner: req.body.owner,
        task_type: req.body.task_type,
        question: req.body.question,
        points: req.body.points
    };
    taskDao.createTask(req.user, task).then(task => { //trying to create the task
        if (task != null) {
            res.status(200).json(task);
        } else {
            res.status(400).send("Bad Request");
        }
    });
};

function getTaskById(req, res) { //Get a task by ID
    let id = req.params.id;
    taskDao.getTaskById(req.user, id).then(task => { //trying to get the task from the system
        if (task != null) {
            res.status(200).json(task);
        } else {
            res.status(400).send("Bad Request");
        }
    });
};
function updateTaskById(req, res) { //Update an existing task
    let id = req.params.id;
    let task = {
        id: req.body.id,
        owner: req.body.owner,
        task_type: req.body.task_type,
        question: req.body.question,
        points: req.body.points
    };
    if (task.id == id) {
        taskDao.updateTaskById(req.user, task).then(task => { //trying to update the task
            if (task != null) {
                res.status(200).json(task);
            } else {
                res.status(400).send("Bad Request");
            }
        });
    } else {
        res.status(400).send("Bad Request");
    }
};
function deleteTaskById(req, res) { //Delete a task by ID
    let id = req.params.id;
    userDao.deleteTaskById(req.user, id).then(task => { //trying to delete the task
        if (task != null) {
            res.status(200).json(task);
        } else {
            res.status(400).send("Bad Request");
        }
    });
};


module.exports = { getTasks, createTask, getTaskById, updateTaskById, deleteTaskById };
