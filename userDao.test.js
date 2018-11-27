const userDao = require('./userDao');

var bornTemp = {
    year: 1997,
    month: 10,
    day: 17,
    hour: 0,
    minute: 0,
    second: 0
};
var enrolledTemp = {
    year: 2016,
    month: 9,
    day: 5,
    hour: 20,
    minute: 20,
    second: 20
};

test('userDao module should be defined', () => {
  expect(userDao).toBeDefined();
});

test('check createUser()', () => {
  if(userDao.getUser({},'110228') != null)
    userDao.deleteUser({id: '110228'});
  expect(userDao.createUser({id:'110228', name: 'Johnny', surname : 'Guadagnini'})).toBeDefined();
});

test('check createUser() with empty user', () => {
  expect(userDao.createUser(null)).toEqual(null);
});

test('check getAllUser() with enrolledBefore and enrolledAfter', () => {
  expect(userDao.getAllUsers({}, '1900', '2018')).toBeDefined();
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
  expect(userDao.getUser('110228')).toBeDefined();
});

test('check getUser() by id with numeric id, unknown user', () => {
  expect(userDao.getUser('9999999999999999999999999999999999999999999999999999999999999')).toEqual(null);
});

test('check getUser() by id with pure string as id', () => {
  expect(userDao.getUser('aaaaaaaaaaaaaaaaaaa')).toEqual(null);
});

test('check updateUser()', () => {
  let upd_user = {id:'110228', name: Giovanna,  surname : 'Dissegna', email : 'giovanna.dissegna@gmail.com', enrolled: enrolledTemp , born : bornTemp};
  expect(userDao.updateUser(upd_user)).toEqual(upd_user);
});

test('check updateUser() with an empty field after an update with all fields', () => {
    let upd_user = {id:'110228', name: 'Giovannina',  surname : 'BOFFO', email : 'giovanna.dissBOFFO@gmail.com', born : bornTemp};
    expect(userDao.updateUser(upd_user)).not.toEqual(upd_user);
});

test('check updateUser() with empty user', () => {
  expect(userDao.updateUser(null)).toEqual(null);
});

test('check deleteUser()', () => {
    let del_user = {id:'110228', name: 'Giovannina',  surname : 'BOFFO', email : 'giovanna.dissBOFFO@gmail.com', enrolled: enrolledTemp , born : bornTemp};
    expect(userDao.deleteUser(del_user)).toEqual(del_user);
});

test('check deleteUser() with not exist id', () => {
  expect(userDao.deleteUser('9999999999999999999999999999999999999999999')).toEqual(null);
});

test('check deleteUser() with pure string as id', () => {
  expect(userDao.deleteUser('aaaaaaaaaaaaaaaaaaa')).toEqual(null);
});
