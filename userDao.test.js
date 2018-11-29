const userDao = require('./userDao');

let new_user = {id: '110228', name: 'Johnny', surname: 'Guadagnini'};

let bornTemp = {
    year: 1997,
    month: 10,
    day: 17,
    hour: 0,
    minute: 0,
    second: 0
};
let enrolledTemp = {
    year: 2016,
    month: 9,
    day: 5,
    hour: 20,
    minute: 20,
    second: 20
};

const invalidId = '999999999999999999999999';
const pureStringId = 'aaaaaaaaaaaaaaaaaaaaaa';

test('userDao module should be defined', () => {
    expect(userDao).toBeDefined();
});

test('check createUser()', () => {
    expect.assertions(1);
    return userDao.getUser({}, new_user.id).then(valueG => {
        if (valueG != null) {
            return userDao.deleteUser(valueG).then(valueD => {
                return userDao.createUser(new_user).then(valueC => {
                    expect(valueC).toEqual(new_user);
                });
            });
        } else {
            return userDao.createUser(new_user).then(valueC => {
                expect(valueC).toEqual(new_user);
            });
        }
    });
});

test('check createUser() with empty user', () => {
    expect.assertions(1);
    return userDao.createUser(null).then(valueC => {
        expect(valueC).toEqual(null);
    });
});

test('check getAllUsers() with enrolledBefore and enrolledAfter', () => {
    expect.assertions(1);
    return userDao.getAllUsers({}, '1900', '2018').then(value => {
        expect(value).toBeDefined();
    });
});

test('check getAllUsers() with enrolledAfter', () => {
    expect.assertions(1);
    return userDao.getAllUsers({}, null, '2018').then(value => {
        expect(value).toBeDefined();
    });
});

test('check getAllUsers() with enrolledBefore', () => {
    expect.assertions(1);
    return userDao.getAllUsers({}, '1900', null).then(value => {
        expect(value).toBeDefined();
    });
});

test('check getAllUsers()', () => {
    expect.assertions(1);
    return userDao.getAllUsers({}, null, null).then(value => {
        expect(value).toBeDefined();
    });
});

test('check getUser() by id with pure numeric id (after incomplete insertion)', () => {
    expect.assertions(1);
    return userDao.getUser({}, new_user.id).then(value => {
        expect(value).not.toEqual(new_user); //born, enrolled, email are not present in new_user, while are undefined in value
    });
});

test('check getUser() by id with numeric id, unknown user', () => {
    expect.assertions(1);
    return (userDao.getUser({}, invalidId)).then(value => {
        expect(value).toEqual(null);
    });
});

test('check getUser() by id with pure string as id', () => {
    expect.assertions(1);
    return (userDao.getUser({}, pureStringId)).then(value => {
        expect(value).toEqual(null);
    });
});

test('check updateUser()', () => {
    expect.assertions(1);
    let upd_user = {
        id: new_user.id,
        name: 'Giovanna',
        surname: 'Dissegna',
        email: 'giovanna.dissegna@gmail.com',
        enrolled: enrolledTemp,
        born: bornTemp
    };
    return (userDao.updateUser(upd_user)).then(value => {
        expect(value).toEqual(upd_user);
    });
});

test('check updateUser() with an empty field after an update with all fields', () => {
    expect.assertions(1);
    let upd_user = {
        id: new_user.id,
        name: 'Giovannina',
        surname: 'BOFFO',
        email: 'giovanna.dissBOFFO@gmail.com',
        born: bornTemp
    };
    return (userDao.updateUser(upd_user)).then(value => {
        expect(value).not.toEqual(upd_user);
    });
});

test('check updateUser() with empty user', () => {
    expect.assertions(1);
    return (userDao.updateUser(null)).then(value => {
        expect(value).toEqual(null);
    });
});


test('check deleteUser()', () => {
    expect.assertions(1);
    let del_user = {
        id: new_user.id,
        name: 'Giovannina',
        surname: 'BOFFO',
        email: 'giovanna.dissBOFFO@gmail.com',
        enrolled: enrolledTemp,
        born: bornTemp
    };
    return (userDao.deleteUser(del_user)).then(value => {
        expect(value).toEqual(del_user);
    });
});

test('check deleteUser() with not exist id', () => {
    expect.assertions(1);
    return (userDao.deleteUser(invalidId)).then(value => {
        expect(value).toEqual(null);
    });
});

test('check deleteUser() with pure string as id', () => {
    expect.assertions(1);
    return (userDao.deleteUser(pureStringId)).then(value => {
        expect(value).toEqual(null);
    });
});
