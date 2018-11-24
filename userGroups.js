app.route('/userGroups')
  .get(function(req, res) {
      var sortingMethod = req.query.sortUsrBy;
      //if the sorting method is not specified or not recognized, switch to the default one
      if(sortingMethod==null || (sortingMethod != "enrol" || sortingMethod != "alpha"))
          sortingMethod="enrol";
      var userGroups = getAllUserGroups(sortingMethod);
      if(userGroups != null)
          res.status(200).send(JSON.stringify(userGroups));
      else
          res.status(404).send("No userGroup found");
  })
  .post(function(req, res){

  });
