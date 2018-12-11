const userDao = require('../src/db/userDao');

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

const utilities = require('../src/utilities');

const dummiesDB = require('./dummies');

beforeAll(() => {
    //return dummiesDB.popDB()
});

afterAll(() => {
    return dummiesDB.cleanDB().then(() => dummiesDB.connection.end());
});

describe('GENERIC userDao test cases', async () => {
    test('userDao module should be defined', () => {
        expect(userDao).toBeDefined();
    });
});

describe('find & creation methods userDao test cases', async () => {

    test('check findOrCreate() with null user data: should not create any user', () => {
        expect.assertions(1);
        return userDao.findOrCreate(null).then(valueC => {
            expect(valueC).toBe(null);
        });
    });

    test('check findOrCreate() with data.id undefined: should not create any user', () => {
        expect.assertions(1);
        return userDao.findOrCreate({notId: 'notId'}).then(valueC => {
            expect(valueC).toEqual(null);
        });
    });

    test('check findOrCreate() with data.name undefined: should not create any user', () => {
        expect.assertions(1);
        return userDao.findOrCreate({id: 'notId', notName: 'notName'}).then(valueC => {
            expect(valueC).toEqual(null);
        });
    });

    test('check findOrCreate() with valid user data: should create valid account', () => {
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

    test('check createUser() after deletion: should not find the created user anymore', () => {
        expect.assertions(1);
        return userDao.getUser(newUser, newUser.id).then(valueG => {
            if (valueG == null) {
                return userDao.createUser(newUser).then(valueC => {
                    expect(valueC).toEqual(newUser);
                });
            }
        });
    });

    test('check createUser() with user already existing in db after deleting it: should work', () => {
        expect.assertions(4);
        return userDao.getUser(newUser, newUser.id).then(valueG => {
            if (valueG != null) {
                return userDao.deleteUser(valueG, valueG.id).then(valueD => {
                    expect(valueD).not.toEqual(null);
                    return userDao.createUser(newUser).then(valueC => {
                        expect(valueC).toEqual(newUser);
                        return userDao.getUser(newUser, newUser.id).then(value => {
                            expect(value).not.toEqual(newUser); //email are not present in newUser, while are undefined in value
                            newUser.name = 'Giovannina';
                            newUser.email = 'johnny.boffino@trocket.com';// insert now an email & cross-check
                            return (userDao.updateUser(newUser)).then(value => {
                                newUser = value;
                                expect(value).toEqual(newUser);
                            });
                        });
                    });
                });
            }
        });
    });

    test('check findOrCreate() with just inserted user; should find it', () => {
        expect.assertions(1);
        return userDao.findOrCreate(newUser).then(valueC => {
            expect(valueC).toEqual(newUser);
        });
    });

    test('check createUser() with empty user: should return null', () => {
        expect.assertions(1);
        return userDao.createUser(null).then(valueC => {
            expect(valueC).toEqual(null);
        });
    });
});

describe('getAllUsers method userDao test cases', async () => {
    test('check getAllUsers() with enrolledBefore, enrolledAfter and alphabetical sorting by default', () => {
        expect.assertions(3);
        return userDao.getAllUsers(newUser, '1900', '2018', null).then(users => {
            expect(utilities.isAnArrayOfUser(users)).toBe(true);
            expect(users.length).toBe(1);
            let enrolled_ok = true;
            for(let user of users){
                if(user.enrolled != null && (user.enrolled.year < 1900 || user.enrolled.year > 2018))
                    enrolled_ok = false;
            }
            expect(enrolled_ok).toBe(true);
        });
    });

    test('check getAllUsers() with enrolledBefore, enrolledAfter and alphabetical sorting by default after a new insertion', () => {
        expect.assertions(3);
        return userDao.createUser(newUser2).then(usr => {
            return userDao.getAllUsers(newUser, '1900', '2018', null).then(users => {
                expect(utilities.isAnArrayOfUser(users)).toBe(true);
                expect(users.length).toBe(2);
                let enrolled_ok = true;
                for(let user of users){
                    if(user.enrolled != null && (user.enrolled.year < 1900 || user.enrolled.year > 2018))
                        enrolled_ok = false;
                }
                expect(enrolled_ok).toBe(true);
            });
        });

    });


    test('check getAllUsers() with enrolledBefore, enrolledAfter and sort option alpha', () => {
        expect.assertions(3);
        return userDao.getAllUsers(newUser, '1900', '2018', 'alpha').then(users => {
            expect(utilities.isAnArrayOfUser(users)).toBe(true);
            expect(users.length).toBe(2);
            let enrolled_ok = true;
            let alpha_ok = true;
            for(let i = 0; i < users.length && enrolled_ok && alpha_ok; i++){
                if(users[i].enrolled != null && (users[i].enrolled.year < 1900 || users[i].enrolled.year > 2018))
                    enrolled_ok = false;
                if((i+1) < users.length && ((users[i].surname > users[i+1].surname) || (users[i].surname == users[i+1].surname && users[i].name == users[i+1].name)))
                    alpha_ok = false;
            }
            expect(enrolled_ok && alpha_ok).toBe(true);
        });
    });

    test('check getAllUsers() with enrolledBefore, enrolledAfter and sort option enrol', () => {
        expect.assertions(3);
        return userDao.getAllUsers(newUser, '1900', '2018', 'enrol').then(users => {
            expect(utilities.isAnArrayOfUser(users)).toBe(true);
            expect(users.length).toBe(2);
            let enrolled_ok = true;
            let enrolled_sort_ok = true;
            for(let i = 0; i < users.length && enrolled_ok && enrolled_sort_ok; i++){
                if(users[i].enrolled != null && (users[i].enrolled.year < 1900 || users[i].enrolled.year > 2018))
                    enrolled_ok = false;
                if((i+1) < users.length && users[i].enrolled!=null && users[i+1].enrolled!=null && utilities.compareTwoDate(users[i].enrolled,users[i+1].enrolled) == 1)
                    enrolled_sort_ok = false;
            }
            expect(enrolled_ok && enrolled_sort_ok).toBe(true);
        });
    });

    test('check getAllUsers() with enrolledAfter 2018: no user has to be found', () => {
        expect.assertions(1);
        return userDao.getAllUsers(newUser, null, '2018', 'alpha').then(value => {
            expect(value).toEqual([]);
        });
    });

    test('check getAllUsers() with enrolledBefore 1900: no user has to be found', () => {
        expect.assertions(1);
        return userDao.getAllUsers(newUser, '1900', null, 'alpha').then(value => {
            expect(value).toEqual([]);
        });
    });

    test('check getAllUsers() with all null values: empty array of obj', () => {
        expect.assertions(1);
        return userDao.getAllUsers(newUser, null, null, null).then(value => {
            expect(value).toEqual([]);
        });
    });

});

describe('getUser method userDao test cases', async () => {

    test('check getUser() by id with just inserted user: user has to be found', () => {
        expect.assertions(1);
        return (userDao.getUser(newUser, newUser.id)).then(value => {
            expect(value).toEqual(newUser);
        });
    });

    test('check getUser() by id with numeric id (not valid), unknown user: no user has to be found, we wait for a null', () => {
        expect.assertions(1);
        return (userDao.getUser(newUser, invalidId)).then(value => {
            expect(value).toEqual(null);
        });
    });

    test('check getUser() by id with pure string as id: no user has to be found', () => {
        expect.assertions(1);
        return (userDao.getUser(newUser, pureStringId)).then(value => {
            expect(value).toEqual(null);
        });
    });

});

describe('updateUser method userDao test cases', async () => {
    test('check updateUser() with an invalidId null field: no action, null in response', () => {
        expect.assertions(1);
        let newUserCopy = jsonCopy(newUser);
        newUserCopy.id = pureStringId;
        return (userDao.updateUser(newUserCopy)).then(value => {
            expect(value).toEqual(null);
        });
    });

    test('check updateUser() with a born null field: user born will be erase from the db, that\'s allowed', () => {
        expect.assertions(1);
        newUser.born = null;
        return (userDao.updateUser(newUser)).then(value => {
            expect(value).toEqual(newUser);
        });
    });

    test('check updateUser() with a born null & valid enrolled data: that\'s an allowed operation and user data will be updated', () => {
        expect.assertions(1);
        newUser.enrolled = enrolledTemp;
        newUser.born = null;
        return (userDao.updateUser(newUser)).then(value => {
            expect(value).toEqual(newUser);
        });
    });

    test('check updateUser() with a born null & enrolled null: that\'s an allowed operation and user data will be updated', () => {
        expect.assertions(2);
        newUser.enrolled = null;
        newUser.born = null;
        return (userDao.updateUser(newUser)).then(value => {
            expect(value).toEqual(newUser);
            return (userDao.getUser(newUser, newUser.id)).then(value => {
                expect(value).toEqual(newUser);
            });
        });
    });

    test('check updateUser() with empty user: no applicable; will return null', () => {
        expect.assertions(1);
        return (userDao.updateUser(null)).then(value => {
            expect(value).toEqual(null);
        });
    });

});

describe('deleteUser method userDao test cases', async () => {
    test('check deleteUser() after all the operations above in this test suite: should delete newUser & return it', () => {
        expect.assertions(2);
        return (userDao.getUser(newUser, newUser.id)).then(value => {
            if(value != null){
                return (userDao.deleteUser(newUser, newUser.id)).then(user => {
                    expect(user).toEqual(newUser);
                    return (userDao.getUser(newUser, newUser.id)).then(delUser => {
                        expect(delUser).toBe(null);//check that the user has been effectively deleted
                    });
                });
            }
        });

    });

    test('check getUser() by id with just deleted user: should be impossible to do because user doesn\'t exist anymore', () => {
        expect.assertions(1);
        return (userDao.getUser(newUser, newUser.id)).then(value => {
            expect(value).toEqual(null);
        });
    });

    test('check deleteUser() with not exist id: should not be possible: return value null', () => {
        expect.assertions(1);
        return (userDao.deleteUser({id:invalidId}, invalidId)).then(value => {
            expect(value).toEqual(null);
        });
    });

    test('check deleteUser() with pure string as id: should not be possible: return value null', () => {
        expect.assertions(1);
        return (userDao.deleteUser({id:pureStringId}, pureStringId)).then(value => {
            expect(value).toEqual(null);
        });
    });

    test('check deleteUser() with null as id: should not be possible: return value null', () => {
        expect.assertions(1);
        return (userDao.deleteUser({id:invalidId}, null)).then(value => {
            expect(value).toEqual(null);
        });
    });
});

function jsonCopy(src) {
    return JSON.parse(JSON.stringify(src));
}
