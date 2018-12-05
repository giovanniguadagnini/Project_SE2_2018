const userGroupsDao = require('./userGroupsDao');

let test_user1 = {id: '110228', name: 'Johnny', surname: 'Guadagnini'};


test('userGroupsDao module should be defined', () => {
  expect(userGroupsDao).toBeDefined();
});

test('check createUserGroup()', () => {
  expect.assertions(1);
  return userGroupsDao.createUserGroup({'creator': '410248271089954338289', 'name' : 'Gruppo di prova', 'users' : new_user}).then( valueC => {
      expect(valueC).toBeDefined();
  });
});

test('check createUserGroup() with an empty field', () => {
  expect.assertions(1);
  return userGroupsDao.createUserGroup({'name':'Gruppo incompleto di prova'}).then( valueC => {
      expect(valueC).toEqual(null);
  });
});

test('check createUserGroup() with empty userGroup', () => {
  expect.assertions(1);
  return userGroupsDao.createUserGroup(null).then( valueC => {
      expect(valueC).toEqual(null);
  });
});

test('check getAllUserGroups() with "enrolled" sorting method', () => {
  expect.assertions(1);
  return (userGroupsDao.getAllUserGroups('enrolled')).then(value => {
    expect(value).toBeDefined();
  });
});

test('check getAllUserGroups() with alphabetical sorting method', () => {
  expect.assertions(1);
  return (userGroupsDao.getAllUserGroups('alpha')).then(value => {
    expect(value).toBeDefined();
  });
});

test('check getAllUserGroups() with non-existent sorting method (switch to enrolled default)', () => {
  expect.assertions(1);
  return (userGroupsDao.getAllUserGroups('random')).then(value => {
    expect(value).toBeDefined();
  });
});

test('Check getUserGroup by id with null id', () => {
    expect.assertions(1);
    return (userGroupsDao.getUserGroup()).then(value => {
        expect(value).toEqual(null);
    });
});

test('Check getUserGroup by id with non existent id', () => {
    expect.assertions(1);
    return (userGroupsDao.getUserGroup('9999999999999999999999999999999999999999999')).then(value => {
        expect(value).toEqual(null);
    });
});

test('Check getUserGroup by id with pure string as id', () => {
    expect.assertions(1);
    return (userGroupsDao.getUserGroup('aaaaaaaaaaaaaaaaaaa')).then(value => {
        expect(value).toEqual(null);
    });
});

test('Check getUserGroup() with "enrolled" sorting method', () => {
  expect.assertions(1);
  return (userGroupsDao.getUserGroup('enrolled')).then(value => {
    expect(value).toBeDefined();
  });
});

test('Check getUserGroup() with alphabetical sorting method', () => {
  expect.assertions(1);
  return (userGroupsDao.getUserGroup(id,'alpha')).then(value => {
    expect(value).toBeDefined();
  });
});

test('Check getUserGroup() with non-existent sorting method (switch to enrolled default)', () => {
  expect.assertions(1);
  return (userGroupsDao.getUserGroup(id,'random')).then(value => {
    expect(value).toBeDefined();
  });
});

test('Check deleteUserGroup with null id', () => {
    expect.assertions(1);
    return (userGroupsDao.deleteUserGroup()).then(value => {
        expect(value).toEqual(null);
    });
});

test('Check deleteUserGroup() with not existent id', () => {
    expect.assertions(1);
    return (userGroupsDao.deleteUserGroup('9999999999999999999999999999999999999999999')).then(value => {
        expect(value).toEqual(null);
    });
});

test('Check deleteUserGroup() with pure string as id', () => {
    expect.assertions(1);
    return (userGroupsDao.deleteUserGroup('aaaaaaaaaaaaaaaaaaa')).then(value => {
        expect(value).toEqual(null);
    });
});
