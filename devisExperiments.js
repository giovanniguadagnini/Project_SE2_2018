const userDao = require('./userDao');

userDao.getUser({}, '123').then(value => {console.log(JSON.stringify(value.born.year));});