const userGroupsDao = require('../src/db/userGroupsDao');
const dummiesDB = require('../src/dummies');
const dummyStud = dummiesDB.dummyStud;
const dummyTeacher = dummiesDB.dummyTeacher;
let dummyUserGroup = {
    id: 6,
    creator: dummyTeacher,
    name: 'SEII Dummy Class',
    users: [dummyStud]
};

let validUGId = dummyUserGroup.id;
const validId = dummyStud.id;
const invalidUGId = '999999999999999999999999';
const pureStringUGId = 'aaaaaaaaaaaaaaaaaaaaaa';

beforeAll(() => {
    return dummiesDB.popDB();
});

afterAll(() => {
    return dummiesDB.cleanDB().then(() => dummiesDB.connection.end());
});

test('userGroupsDao module should be defined', () => {
    expect(userGroupsDao).toBeDefined();
});

test('check createUserGroup()', () => {
    expect.assertions(3);
    return userGroupsDao.createUserGroup(dummyUserGroup).then( value => {
        dummyUserGroup.id = value.id;
        expect(value.name).toEqual(dummyUserGroup.name);
        expect(value.creator.id).toEqual(dummyUserGroup.creator.id);
        expect(value.users.length).toEqual(dummyUserGroup.users.length);
    });
});

test('check createUserGroup() with an empty field', () => {
    expect.assertions(1);
    return userGroupsDao.createUserGroup({'name':'Gruppo incompleto di prova'}).then( value => {
        expect(value).toEqual(null);
    });
});

test('check createUserGroup() with empty userGroup', () => {
    expect.assertions(1);
    return userGroupsDao.createUserGroup(null).then( value => {
        expect(value).toEqual(null);
    });
});

test('check getAllUserGroups() with "enrolled" sorting method', () => {
    expect.assertions(1);
    return (userGroupsDao.getAllUserGroups(dummyStud, 'enrolled')).then(value => {
        expect(value.length).toEqual(2);
    });
});

test('check getAllUserGroups() with alphabetical sorting method', () => {
    expect.assertions(1);
    return (userGroupsDao.getAllUserGroups(dummyStud, 'alpha')).then(value => {
        expect(value.length).toEqual(2);
    });
});

test('check getAllUserGroups() with non-existent sorting method (switch to enrolled default)', () => {
    expect.assertions(1);
    return (userGroupsDao.getAllUserGroups(dummyStud, 'random')).then(value => {
        expect(value.length).toEqual(2);
    });
});

test('check getAllUserGroups() with null as loggedUser and "enrolled" sorting method', () => {
    expect.assertions(1);
    return (userGroupsDao.getAllUserGroups(null, 'enrolled')).then(value => {
        expect(value).toEqual(null);
    });
});

test('check getAllUserGroups() with alphabetical sorting method', () => {
    expect.assertions(1);
    return (userGroupsDao.getAllUserGroups(null, 'alpha')).then(value => {
        expect(value).toEqual(null);
    });
});

test('check getAllUserGroups() with non-existent sorting method (switch to enrolled default)', () => {
    expect.assertions(1);
    return (userGroupsDao.getAllUserGroups(null, 'random')).then(value => {
        expect(value).toEqual(null);
    });
});

test('check getAllUserGroups() with incomplete user as loggedUser and "enrolled" sorting method', () => {
    expect.assertions(1);
    return (userGroupsDao.getAllUserGroups({name:"test"}, 'enrolled')).then(value => {
        expect(value).toEqual(null);
    });
});

test('check getAllUserGroups() with alphabetical sorting method', () => {
    expect.assertions(1);
    return (userGroupsDao.getAllUserGroups({name:"test"}, 'alpha')).then(value => {
        expect(value).toEqual(null);
    });
});

test('check getAllUserGroups() with non-existent sorting method (switch to enrolled default)', () => {
    expect.assertions(1);
    return (userGroupsDao.getAllUserGroups({name:"test"}, 'random')).then(value => {
        expect(value).toEqual(null);
    });
});

test('check getUserGroup with existing userGroup id', () => {
    expect.assertions(3);
    return (userGroupsDao.getUserGroup(dummyStud, dummyUserGroup.id)).then(value => {
        expect(value.name).toEqual(dummyUserGroup.name);
        expect(value.creator.id).toEqual(dummyUserGroup.creator.id);
        expect(value.users.length).toEqual(dummyUserGroup.users.length);
    });
});

test('check getUserGroup by id with null id', () => {
    expect.assertions(1);
    return (userGroupsDao.getUserGroup(dummyStud, null)).then(value => {
        expect(value).toEqual(null);
    });
});

test('check getUserGroup by id with pureStringUGId', () => {
    expect.assertions(1);
    return (userGroupsDao.getUserGroup(dummyStud, pureStringUGId)).then(value => {
        expect(value).toEqual(null);
    });
});

test('check getUserGroup by id with invalidUGId', () => {
    expect.assertions(1);
    return (userGroupsDao.getUserGroup(dummyStud, invalidUGId)).then(value => {
        expect(value).toEqual(null);
    });
});

test('check getUserGroup by id with null as loggedUser and invalidUGId', () => {
    expect.assertions(1);
    return (userGroupsDao.getUserGroup(null, invalidUGId)).then(value => {
        expect(value).toEqual(null);
    });
});

test('check updateUserGroup with existing userGroup', () => {
    expect.assertions(3);
    return (userGroupsDao.updateUserGroup(dummyTeacher, dummyUserGroup)).then(value => {
        expect(value.name).toEqual(dummyUserGroup.name);
        expect(value.creator.id).toEqual(dummyUserGroup.creator.id);
        expect(value.users.length).toEqual(dummyUserGroup.users.length);
    });
});

test('check updateUserGroup adding one user to existing userGroup', () => {
    expect.assertions(3);
    let dummyUserGroupUpdate = jsonCopy(dummyUserGroup);
    dummyUserGroupUpdate.users.push(dummyTeacher);
    return (userGroupsDao.updateUserGroup(dummyTeacher, dummyUserGroupUpdate)).then(value => {
        expect(value.name).toEqual(dummyUserGroupUpdate.name);
        expect(value.creator.id).toEqual(dummyUserGroupUpdate.creator.id);
        expect(value.users.length).toEqual(dummyUserGroupUpdate.users.length);
    });
});

test('check updateUserGroup removing one user to existing userGroup', () => {
    expect.assertions(3);
    let dummyUserGroupUpdate = jsonCopy(dummyUserGroup);
    return (userGroupsDao.updateUserGroup(dummyTeacher, dummyUserGroupUpdate)).then(value => {
        expect(value.name).toEqual(dummyUserGroupUpdate.name);
        expect(value.creator.id).toEqual(dummyUserGroupUpdate.creator.id);
        expect(value.users.length).toEqual(dummyUserGroupUpdate.users.length);
    });
});

test('check updateUserGroup with valid userGroup and user without privileges', () => {
    expect.assertions(1);
    return (userGroupsDao.updateUserGroup(dummyStud, dummyUserGroup)).then(value => {
        expect(value).toEqual('403');
    });
});

test('check updateUserGroup with non-existing userGroup and user with privileges', () => {
    expect.assertions(1);
    let dummyUserGroupUpdate = jsonCopy(dummyUserGroup);
    dummyUserGroupUpdate.id=invalidUGId;
    return (userGroupsDao.updateUserGroup(dummyTeacher, dummyUserGroupUpdate)).then(value => {
        expect(value).toEqual(null);
    });
});

test('check deleteUserGroup with existing userGroup id and user without privileges', () => {
    expect.assertions(1);
    return (userGroupsDao.deleteUserGroup(dummyStud, dummyUserGroup.id)).then(value => {
        expect(value).toEqual('403');
    });
});

test('check deleteUserGroup with existing userGroup id', () => {
    expect.assertions(3);
    return (userGroupsDao.deleteUserGroup(dummyTeacher, dummyUserGroup.id)).then(value => {
        expect(value.name).toEqual(dummyUserGroup.name);
        expect(value.creator.id).toEqual(dummyUserGroup.creator.id);
        expect(value.users.length).toEqual(dummyUserGroup.users.length);
    });
});

test('check deleteUserGroup by id with null id', () => {
    expect.assertions(1);
    return (userGroupsDao.deleteUserGroup(dummyStud, null)).then(value => {
        expect(value).toEqual(null);
    });
});

test('check deleteUserGroup by id with pureStringUGId', () => {
    expect.assertions(1);
    return (userGroupsDao.deleteUserGroup(dummyStud, pureStringUGId)).then(value => {
        expect(value).toEqual(null);
    });
});

test('check deleteUserGroup by id with invalidUGId', () => {
    expect.assertions(1);
    return (userGroupsDao.deleteUserGroup(dummyStud, invalidUGId)).then(value => {
        expect(value).toEqual(null);
    });
});

test('check deleteUserGroup by id with null as user and null id', () => {
    expect.assertions(1);
    return (userGroupsDao.deleteUserGroup(null, null)).then(value => {
        expect(value).toEqual(null);
    });
});

function jsonCopy(src) {
    return JSON.parse(JSON.stringify(src));
}
