const userDao = require('./userDao');

test('userDao module should be defined', () => {
  expect(userDao).toBeDefined();
});

test('check getAllUser() with enrolledBefore and enrolledAfter', () => {
  expect(userDao.getAllUsers('17/10/2018', '18/07/2018')).toEqual([{'name': 'Gio1',  'surname' : 'Guadagnini','password' : 'aaaa',  'email' : 'giovanni.guadagnini@gmail.com', 'born' : '17/10/1997'}]);
});

test('check getAllUsers() with enrolledAfter', () => {
  expect(userDao.getAllUsers(-1, '18/07/2018')).toEqual([{'name': 'Gio2',  'surname' : 'Guadagnini','password' : 'aaaa',  'email' : 'giovanni.guadagnini@gmail.com', 'born' : '17/10/1997'}]);
});

test('check getAllUsers() with enrolledBefore', () => {
  expect(userDao.getAllUsers('17/10/2018', -1)).toEqual([{'name': 'Gio3',  'surname' : 'Guadagnini','password' : 'aaaa',  'email' : 'giovanni.guadagnini@gmail.com', 'born' : '17/10/1997'}]);
});

test('check getAllUsers()', () => {
  expect(userDao.getAllUsers(-1,-1)).toEqual([{'name': 'Gio4',  'surname' : 'Guadagnini','password' : 'aaaa',  'email' : 'giovanni.guadagnini@gmail.com', 'born' : '17/10/1997'}]);
});
test('check createUser()', () => {
  expect(userDao.createUser({'name': 'Giovanni', 'surname' : 'Guadagnini', 'password' : 'aaaa', 'email' : 'giovanni.guadagnini@gmail.com', 'born' : '17/10/1997'})).toEqual({'name': 'Giovanni',  'surname' : 'Guadagnini','password' : 'aaaa',  'email' : 'giovanni.guadagnini@gmail.com', 'born' : '17/10/1997'});
});

test('check createUser() with an empty field', () => {
  expect(userDao.createUser({'name': 'Giovanni', 'password' : 'aaaa', 'email' : 'giovanni.guadagnini@gmail.com', 'born' : '17/10/1997'})).toEqual(null);
});

test('check createUser() with empty user', () => {
  expect(userDao.createUser(null)).toEqual(null);
});

test('check getUser() by id with numeric id', () => {
  expect(userDao.getUser(1)).toEqual({'name': 'Giovanni', 'surname' : 'Guadagnini', 'password' : 'aaaa', 'email' : 'giovanni.guadagnini@gmail.com', 'born' : '17/10/1997'});
});

test('check getUser() by id with numeric id, unknown user', () => {
  expect(userDao.getUser(99999)).toEqual(null);
});

test('check getUser() by id with string as id', () => {
  expect(userDao.getUser("aassadsa")).toEqual(null);
});

test('check updateUser()', () => {
  expect(userDao.updateUser({'name': 'Giovanni',  'surname' : 'Guadagnini','password' : 'aaaa', 'email' : 'giovanni.guadagnini@gmail.com', 'born' : '17/10/1997'})).toEqual({'name': 'Giovanni',  'surname' : 'Guadagnini','password' : 'aaaa',  'email' : 'giovanni.guadagnini@gmail.com', 'born' : '17/10/1997'});
});

test('check updateUser() with an empty field', () => {
  expect(userDao.updateUser({'name': 'Giovanni', 'password' : 'aaaa', 'email' : 'giovanni.guadagnini@gmail.com', 'born' : '17/10/1997'})).toEqual(null);
});

test('check updateUser() with empty user', () => {
  expect(userDao.updateUser(null)).toEqual(null);
});
