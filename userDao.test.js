const userDao = require('./userDao');

test('userDao module should be defined', () => {
  expect(userDao).toBeDefined();
});

test('check createUser()', () => {
  expect(userDao.createUser({'id':'110228221053954638301', 'name': 'Giovanni', 'surname' : 'Guadagnini'})).toBeDefined();
});

test('check createUser() with an empty field', () => {
  expect(userDao.createUser({'id':'110228221053954638301', 'name': 'Giovanni'})).toEqual(null);
});

test('check createUser() with empty user', () => {
  expect(userDao.createUser(null)).toEqual(null);
});

test('check getAllUser() with enrolledBefore and enrolledAfter', () => {
  expect(userDao.getAllUsers({}, '1900', '2018')).toBeDefined(); //26/11/2018 -->1543190400000, 28/11/2018 --> 1543363200000
});

test('check getAllUsers() with enrolledAfter', () => {
  expect(userDao.getAllUsers({}, null, '2018')).toBeDefined();
});

test('check getAllUsers() with enrolledBefore', () => {
  expect(userDao.getAllUsers({}, '1900', null)).toBeDefined();
});

test('check getAllUsers()', () => {
  expect(userDao.getAllUsers({}, null, null)).toBeDefined();
});

test('check getUser() by id with numeric id', () => {
  expect(userDao.getUser(110228221053954638301)).toBeDefined();
});

test('check getUser() by id with numeric id, unknown user', () => {
  expect(userDao.getUser(999999999999999999999)).toEqual(null);
});

test('check getUser() by id with string as id', () => {
  expect(userDao.getUser("aaaaaaaaaaaaaaaaaaa")).toEqual(null);
});

test('check updateUser()', () => {
  expect(userDao.updateUser({'id':'110228221053954638301', 'name': 'Giovanni',  'surname' : 'Guadagnini', 'email' : 'giovanni.guadagnini@gmail.com', 'enrolled': '2018' , 'born' : '1997'})).toEqual({'id':'110228221053954638301', 'name': 'Giovanni',  'surname' : 'Guadagnini', 'email' : 'giovanni.guadagnini@gmail.com', 'enrolled': '2018' , 'born' : '1997'});
});

test('check updateUser() with an empty field', () => {
  expect(userDao.updateUser({'id':'110228221053954638301', 'name': 'Giovanni', 'email' : 'giovanni.guadagnini@gmail.com', 'born' : '877046400000'})).toEqual(null);
});

test('check updateUser() with empty user', () => {
  expect(userDao.updateUser(null)).toEqual(null);
});

test('check deleteUser()', () => {
  expect(userDao.deleteUser('110228221053954638301')).toEqual({'id':'110228221053954638301', 'name': 'Giovanni',  'surname' : 'Guadagnini', 'email' : 'giovanni.guadagnini@gmail.com', 'enrolled': '877046400000' , 'born' : '877046400000'});
});

test('check deleteUser() with not exist id', () => {
  expect(userDao.deleteUser(999999999999999999999)).toEqual(null);
});

test('check deleteUser() with string as id', () => {
  expect(userDao.deleteUser(aaaaaaaaaaaaaaaaaaa)).toEqual(null);
});
