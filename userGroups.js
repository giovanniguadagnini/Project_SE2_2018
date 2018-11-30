const app = require('./app');
const userGroupsDao = require('./userGroupsDao')

app.route('/userGroups')
  //get all userGroups sorted by one of two methods
  .get(function(req, res) {
      var sortingMethod = req.query.sortUsrBy;
      //if the sorting method is not specified or not recognized, switch to the default one
      if(sortingMethod==null || (sortingMethod != 'enrol' || sortingMethod != 'alpha'))
          sortingMethod='enrol';
      var userGroups = userGroupsDao.getAllUserGroups(sortingMethod);
      if(userGroups != null)
          res.status(200).json(JSON.stringify(userGroups));
      else
          res.status(404).send('No userGroup found');
  })

  //create a new userGroup
  .post(function(req, res){
      var userGroup = {
          id : req.body.id,
          creator : req.body.creator,
          name : req.body.name,
          users : req.body.users
      };
      userGroup = userGroupsDao.createUserGroup(userGroup);
      if(userGroup != null)
          res.status(200).json(userGroup);
      else
          res.status(405).send('Invalid input');
  });

app.route('/userGroups/:id')
  //get the userGroup with id {id}, can choose how the users get ordered
  .get(function(req,res){
      var id = req.id;
      if(Number.isInteger(id) == true) {
          var sortingMethod = req.query.sortStudBy;
          if(sortingMethod==null || (sortingMethod != 'enrol' || sortingMethod != 'alpha'))
              sortingMethod='enrol';
          var userGroup = userGroupsDao.getUserGroup(id, sortingMethod);
          if(userGroup!=null)
              res.status(200).json(userGroup);
          else
              res.status(404).send('userGroup not found' );
      } else {
          res.status(400).send('Invalid ID supplied');
      }
  })

  //update the userGroup with id {id}
  .put(function(req,res){
      var id = req.id;
      if(Number.isInteger(id) == true) {
          var userGroup = {
              id : req.body.id,
              creator : req.body.creator,
              name : req.body.name,
              users : req.body.users
          };
          userGroup = userGroupsDao.updateUserGroup(userGroup);
          if(userGroup!=null)
              res.status(200).json(userGroup);
          else
              res.status(404).send('userGroup not found');
      } else {
          res.status(400).send('Invalid ID supplied');
      }
  })

  //delete the userGroup with id {id}
  .delete(function(req,res){
      var id = req.id;
      if(Number.isInteger(id) == true){
          userGroup = userGroupsDao.deleteUserGroup(id);
          if(userGroup!=null)
              res.status(200).json(userGroup);
          else
              res.status(404).send('userGroup not found');
      } else {
          res.status(400).send('Invalid ID supplied');
      }
  });
