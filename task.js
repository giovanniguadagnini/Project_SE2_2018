const app = require('./app');
const taskDao = require('./taskDao');

app.route('/tasks')
    .get(function(req, res) { //Get all the manageable tasks
        var tasks = taskDao.getAllTasks();
        if(tasks != null) {
            res.status(200).send(tasks);
        } else {
            res.status(400).send("Bad request");
        }
    })
    .post(function(req, res) { //Create task
        var task = {
          owner: req.body.owner,
          task_type : req.body.task_type,
          question : req.body.question,
          points : req.body.points
        };
        task = taskDao.createTask(task);//trying to create the task
        if (task != null) {
            res.status(200).send(task);
        } else {
            res.status(405).send("Invalid input");
        }
    });

app.route('/tasks/:id')
    .get(function(req, res) { //Get a task by ID
        var id = req.id;
        if(Number.isInteger(id) == true) {
            var task = taskDao.getTask(id); //trying to get the task from the system
            if (task != null) {
                res.status(200).send(task);
            } else {
                res.status(404).send("Task not found");
            }
        }else{
            res.status(400).send("Invalid ID");
        }
    })
    .put(function(req, res) {//Update an existing task
        var id = req.id;
        if(Number.isInteger(id) == true) {
            var task = {
                owner: req.body.owner,
                task_type : req.body.task_type,
                question : req.body.question,
                points : req.body.points
              };
              task = taskDao.updateTask(task);//trying to update the task
              if (task != null) {
                  res.status(200).send(task);
              } else {
                res.status(404).send("Task not found");
            }
        }else{
            res.status(400).send("Invalid ID");
        }
    })
    .delete(function(req, res) { //delete a task by ID
        var id = req.id;
        if(Number.isInteger(id) == true) {
            task = userDao.deleteTask(id);
            if (exam != null) {
                res.status(200).send(task);
            } else {
                res.status(404).send("Task not found");
            }
        }else{
            res.status(400).send("Invalid ID");
        }
    });
