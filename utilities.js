//db connection
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7267085',
    password: 'IlVZ5TF9HT',
    database: 'sql7267085'
});

//return true if user is a valid user
function isAUser(user){
    return (user.id != null && user.name != null && user.surname != null);
}

//return true if users is a valid array of user
function isAnArrayOfUser(users) {
    for(let user of users){
        if(!isAUser(user))
            return false;
    }
    return true;
}

//return true if date is a valid date acceptable in our app
function isAValidDate(date){
    return (date.year != null && date.month != null && date.day != null &&
            date.hour != null && date.minute != null && date.second != null);
}

module.exports = {connection, isAUser, isAnArrayOfUser, isAValidDate};