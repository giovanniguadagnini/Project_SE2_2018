const userDao = require('./userDao');

test('userDao module should be defined', () => {
  expect(userDao).toBeDefined();
});

test('check getAllUser() with enrolledBefore and enrolledAfter', () => {
  expect(userDao.getAllUsers('17/10/2018', '18/07/2018')).toBeDefined()
});

test('check getAllUsers() with enrolledAfter', () => {
  expect(userDao.getAllUsers(-1, '18/07/2018')).toBeDefined()
});

test('check getAllUsers() with enrolledBefore', () => {
  expect(userDao.getAllUsers('17/10/2018', -1)).toBeDefined()
});

test('check getAllUsers()', () => {
  expect(userDao.getAllUsers(-1,-1)).toBeDefined();
});
test('check createUser()', () => {
  expect(userDao.createUser({'id':'110228221053954638301', 'name': 'Giovanni', 'surname' : 'Guadagnini'})).toEqual({'id':'110228221053954638301', 'name': 'Giovanni', 'surname' : 'Guadagnini'});
});

test('check createUser() with an empty field', () => {
  expect(userDao.createUser({'name': 'Giovanni', 'password' : 'aaaa', 'email' : 'giovanni.guadagnini@gmail.com', 'born' : '877046400000'})).toEqual(null);
});

test('check createUser() with empty user', () => {
  expect(userDao.createUser(null)).toEqual(null);
});

test('check getUser() by id with numeric id', () => {
  expect(userDao.getUser(110228221053954638301)).toEqual({'name': 'Giovanni', 'surname' : 'Guadagnini'});
});

test('check getUser() by id with numeric id, unknown user', () => {
  expect(userDao.getUser(999999999999999999999)).toEqual(null);
});

test('check getUser() by id with string as id', () => {
  expect(userDao.getUser("aassadsaaaaaaaaaaaa")).toEqual(null);
});

test('check updateUser()', () => {
  expect(userDao.updateUser({'id':'110228221053954638301', 'name': 'Giovanni',  'surname' : 'Guadagnini', 'email' : 'giovanni.guadagnini@gmail.com', 'born' : '877046400000'})).toEqual({'id':'110228221053954638301', 'name': 'Giovanni',  'surname' : 'Guadagnini', 'email' : 'giovanni.guadagnini@gmail.com', 'born' : '877046400000'});
});

test('check updateUser() with an empty field', () => {
  expect(userDao.updateUser({'id':'110228221053954638301', 'name': 'Giovanni', 'email' : 'giovanni.guadagnini@gmail.com', 'born' : '877046400000'})).toEqual(null);
});

test('check updateUser() with empty user', () => {
  expect(userDao.updateUser(null)).toEqual(null);
});
