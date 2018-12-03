const userDao = require('./userDao');

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

let newUser = {
    id: '110228',
    name: 'Johnny',
    surname: 'Guadagnini',
    born: bornTemp,
    enrolled: enrolledTemp,
    submissions: [],
    exam_eval: []
};

let newUser2 = {
    id: '110229',
    name: 'Danis',
    surname: 'Ceballos',
    born: bornTemp,
    enrolled: enrolledTemp,
    submissions: [],
    exam_eval: []
};

const invalidId = '999999999999999999999999';
const pureStringId = 'aaaaaaaaaaaaaaaaaaaaaa';

beforeAll(() => {

});

afterAll(() => {
    userDao.connection.end();
});

test('userDao module should be defined', () => {
    expect(userDao).toBeDefined();
});

test('check createUser()', () => {
    expect.assertions(1);
    return userDao.getUser(newUser, newUser.id).then(valueG => {
        if (valueG != null) {
            return userDao.deleteUser(valueG, valueG.id).then(valueD => {
                return userDao.createUser(newUser).then(valueC => {
                    expect(valueC).toEqual(newUser);
                });
            });
        } else {
            return userDao.createUser(newUser).then(valueC => {
                expect(valueC).toEqual(newUser);
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
    return userDao.getAllUsers(newUser, '1900', '2018', null).then(value => {
        expect(value).toBeDefined();
    });
});

test('check getAllUsers() with enrolledBefore, enrolledAfter and sort option alpha', () => {
    expect.assertions(1);
    return userDao.getAllUsers(newUser, '1900', '2018', 'alpha').then(value => {
        expect(value).toBeDefined();
    });
});

test('check getAllUsers() with enrolledBefore, enrolledAfter and sort option enrol', () => {
    expect.assertions(1);
    return userDao.getAllUsers(newUser, '1900', '2018', 'enrol').then(value => {
        expect(value).toBeDefined();
    });
});

test('check getAllUsers() with enrolledAfter', () => {
    expect.assertions(1);
    return userDao.getAllUsers(newUser, null, '2018', null).then(value => {
        expect(value).toBeDefined();
    });
});

test('check getAllUsers() with enrolledBefore', () => {
    expect.assertions(1);
    return userDao.getAllUsers(newUser, '1900', null, null).then(value => {
        expect(value).toBeDefined();
    });
});

test('check getAllUsers()', () => {
    expect.assertions(1);
    return userDao.getAllUsers(newUser, null, null, null).then(value => {
        expect(value).toBeDefined();
    });
});

test('check getUser() by id with pure numeric id (after incomplete insertion)', () => {
    expect.assertions(1);
    return userDao.getUser(newUser, newUser.id).then(value => {
        expect(value).not.toEqual(newUser); //born, enrolled, email are not present in newUser, while are undefined in value
    });
});

test('check getUser() by id with numeric id, unknown user', () => {
    expect.assertions(1);
    return (userDao.getUser(newUser, invalidId)).then(value => {
        expect(value).toEqual(null);
    });
});

test('check getUser() by id with pure string as id', () => {
    expect.assertions(1);
    return (userDao.getUser(newUser, pureStringId)).then(value => {
        expect(value).toEqual(null);
    });
});

test('check updateUser()', () => {
    expect.assertions(1);
    newUser.name = 'Giovannina';
    newUser.email = 'Dissegna';
    return (userDao.updateUser(newUser)).then(value => {
        newUser = value;
        expect(value).toEqual(newUser);
    });
});

test('check updateUser() with a null field', () => {
    expect.assertions(1);
    newUser.born = null;
    return (userDao.updateUser(newUser)).then(value => {
        expect(value).toEqual(newUser);
    });
});

test('check updateUser() with empty user', () => {
    expect.assertions(1);
    return (userDao.updateUser(null)).then(value => {
        expect(value).toEqual(null);
    });
});

test('check updateUser() with not existing user', () => {
    expect.assertions(1);
    return (userDao.updateUser(newUser2)).then(value => {
        expect(value).toEqual(null);
    });
});

test('check deleteUser()', () => {
    expect.assertions(1);
    return (userDao.deleteUser(newUser, newUser.id)).then(value => {
        expect(value).toEqual(newUser);
    });
});

test('check deleteUser() with not exist id', () => {
    expect.assertions(1);
    return (userDao.deleteUser({id:invalidId}, invalidId)).then(value => {
        expect(value).toEqual(null);
    });
});

test('check deleteUser() with pure string as id', () => {
    expect.assertions(1);
    return (userDao.deleteUser({id:pureStringId}, pureStringId)).then(value => {
        expect(value).toEqual(null);
    });
});

test('check deleteUser() with null as id', () => {
    expect.assertions(1);
    return (userDao.deleteUser(null, null)).then(value => {
        expect(value).toEqual(null);
    });
});