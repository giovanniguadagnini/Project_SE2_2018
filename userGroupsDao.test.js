const userGroupsDao = require('./userGroupsDao');

test('userGroupsDao module should be defined', () => {
  expect(userGroupsDao).toBeDefined();
});

test('check createUserGroup()', () => {
  expect(userGroupsDao.createUserGroup({'id':'150228221053978456543', 'creator': '410248271089954338289', 'name' : 'Gruppo di prova', 'users' : {'id':'110228221053954638301', 'name': 'Giovanni', 'surname' : 'Guadagnini'})).toBeDefined();
});

test('check createUserGroup() with an empty field', () => {
  expect(userGroupsDao.createUserGroup({'creator':'111118221053978451111', 'name':'Gruppo incompleto di prova'})).toEqual(null);
});

test('check createUserGroup() with empty userGroup', () => {
  expect(userGroupsDao.createUserGroup(null)).toEqual(null);
});

test('check getAllUserGroups() with "enrolled" sorting method', () => {
  expect(userGroupsDao.getAllUserGroups('enrolled')).toBeDefined();
});

test('check getAllUserGroups() with "alpha" sorting method', () => {
  expect(userGroupsDao.getAllUserGroups('alpha')).toBeDefined();
});

test('check getAllUserGroups() with non-existent sorting method (switch to enrolled default)', () => {
  expect(userGroupsDao.getAllUserGroups('random')).toBeDefined();
});
