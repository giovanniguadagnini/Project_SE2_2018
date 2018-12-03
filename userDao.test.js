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

let gNewUser = {
    id: '110228',
    name: {
        familyName : 'Guadagnini',
        givenName : 'Johnny'
    }
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

test('check findOrCreate() with null user data', () => {
    expect.assertions(1);
    return userDao.findOrCreate(null).then(valueC => {
        expect(valueC).toBe(null);
    });
});

test('check findOrCreate() with data.id undefined', () => {
    expect.assertions(1);
    return userDao.findOrCreate({notId: 'notId'}).then(valueC => {
        expect(valueC).toEqual({notId: 'notId'});
    });
});

test('check findOrCreate() with data.name undefined', () => {
    expect.assertions(1);
    return userDao.findOrCreate({id: 'notId', notName: 'notName'}).then(valueC => {
        expect(valueC).toEqual({id: 'notId', notName: 'notName'});
    });
});

test('check findOrCreate() with valid user data', () => {
    expect.assertions(3);
    return userDao.findOrCreate(gNewUser).then(valueC => {
        expect(valueC.id).toEqual(gNewUser.id);
        expect(valueC.name).toEqual(gNewUser.name.givenName);
        expect(valueC.surname).toEqual(gNewUser.name.familyName);
    });
});

test('check deleteUser() after 1st findOrCreate', () => {
    expect.assertions(1);
    return (userDao.deleteUser(newUser, newUser.id)).then(value => {
        expect(value).not.toEqual(newUser);
    });
});

test('check createUser() after deletion', () => {
    expect.assertions(1);
    return userDao.getUser(newUser, newUser.id).then(valueG => {
        if (valueG == null) {
            return userDao.createUser(newUser).then(valueC => {
                expect(valueC).toEqual(newUser);
            });
        }
    });
});

test('check findOrCreate() with valid user data', () => {
    expect.assertions(3);
    return userDao.findOrCreate(gNewUser).then(valueC => {
        expect(valueC.id).toEqual(gNewUser.id);
        expect(valueC.name).toEqual(gNewUser.name.givenName);
        expect(valueC.surname).toEqual(gNewUser.name.familyName);
    });
});

test('check createUser() with user already existing in db', () => {
    expect.assertions(2);
    return userDao.getUser(newUser, newUser.id).then(valueG => {
        if (valueG != null) {
            return userDao.deleteUser(valueG, valueG.id).then(valueD => {
                expect(valueD).not.toEqual(null);
                return userDao.createUser(newUser).then(valueC => {
                    expect(valueC).toEqual(newUser);
                });
            });
        }
    });
});

test('check getUser() by id with pure numeric id (after incomplete insertion)', () => {
    expect.assertions(1);
    return userDao.getUser(newUser, newUser.id).then(value => {
        expect(value).not.toEqual(newUser); //email are not present in newUser, while are undefined in value
    });
});

test('check updateUser()', () => {
    expect.assertions(1);
    newUser.name = 'Giovannina';
    newUser.email = 'johnny.boffino@trocket.com';
    return (userDao.updateUser(newUser)).then(value => {
        newUser = value;
        expect(value).toEqual(newUser);
    });
});

test('check findOrCreate() with just inserted user', () => {
    expect.assertions(1);
    return userDao.findOrCreate(newUser).then(valueC => {
        expect(valueC).toEqual(newUser);
    });
});

test('check getUser() by id with just inserted user', () => {
    expect.assertions(1);
    return (userDao.getUser(newUser, newUser.id)).then(value => {
        expect(value).toEqual(newUser);
    });
});

test('check createUser() with empty user', () => {
    expect.assertions(1);
    return userDao.createUser(null).then(valueC => {
        expect(valueC).toEqual(null);
    });
});

test('check getAllUsers() with enrolledBefore, enrolledAfter and alphabetical sorting', () => {
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

test('check getAllUsers() with enrolledBefore, enrolledAfter and enrollment sorting', () => {
    expect.assertions(1);
    return userDao.getAllUsers(newUser, '1900', '2018', 'enrol').then(value => {
        expect(value).toBeDefined();
    });
});

test('check getAllUsers() with enrolledAfter', () => {
    expect.assertions(1);
    return userDao.getAllUsers(newUser, null, '2018', 'alpha').then(value => {
        expect(value).toEqual([]);
    });
});

test('check getAllUsers() with enrolledBefore', () => {
    expect.assertions(1);
    return userDao.getAllUsers(newUser, '1900', null, 'alpha').then(value => {
        expect(value).toEqual([]);
    });
});

test('check getAllUsers() with all null values', () => {
    expect.assertions(1);
    return userDao.getAllUsers(newUser, null, null, null).then(value => {
        expect(value).toEqual([]);
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

test('check updateUser() with an invalidId null field', () => {
    expect.assertions(1);
    let newUserCopy = jsonCopy(newUser);
    newUserCopy.id = pureStringId;
    return (userDao.updateUser(newUserCopy)).then(value => {
        expect(value).toEqual(null);
    });
});

test('check updateUser() with a born null field', () => {
    expect.assertions(1);
    newUser.born = null;
    return (userDao.updateUser(newUser)).then(value => {
        expect(value).toEqual(newUser);
    });
});

test('check updateUser() with a born null & valid enrolled data', () => {
    expect.assertions(1);
    newUser.enrolled = enrolledTemp;
    newUser.born = null;
    return (userDao.updateUser(newUser)).then(value => {
        expect(value).toEqual(newUser);
    });
});

test('check updateUser() with a born null & enrolled null', () => {
    expect.assertions(1);
    newUser.enrolled = null;
    newUser.born = null;
    return (userDao.updateUser(newUser)).then(value => {
        expect(value).toEqual(newUser);
    });
});

test('check getUser() by id with just inserted user after updates', () => {
    expect.assertions(1);
    return (userDao.getUser(newUser, newUser.id)).then(value => {
        expect(value).toEqual(newUser);
    });
});

test('check updateUser() with empty user', () => {
    expect.assertions(1);
    return (userDao.updateUser(null)).then(value => {
        expect(value).toEqual(null);
    });
});

test('check deleteUser() after all', () => {
    expect.assertions(1);
    return (userDao.deleteUser(newUser, newUser.id)).then(value => {
        expect(value).toEqual(newUser);
    });
});

test('check getUser() by id with just deleted user', () => {
    expect.assertions(1);
    return (userDao.getUser(newUser, newUser.id)).then(value => {
        expect(value).toEqual(null);
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
    return (userDao.deleteUser({id:invalidId}, null)).then(value => {
        expect(value).toEqual(null);
    });
});

function jsonCopy(src) {
    return JSON.parse(JSON.stringify(src));
}