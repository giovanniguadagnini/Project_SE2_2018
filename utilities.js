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

//given two students a, b put before the student that alphabetically (based on surname, name) has to stay before
function compareAlfa(a, b){
    //we put null at the end of the queue

    if(a.surname == null && b.surname == null)
        return 0;
    else if(a.surname == null && b.surname != null)
        return 1;
    else if(a.surname != null && b.surname == null)
        return -1;

    let surnameA = a.surname.toUpperCase();
    let surnameB = b.surname.toUpperCase();

    if (surnameA < surnameB)
        return -1;
    else if (surnameA > surnameB)
        return 1;

    if(a.name == null && b.name == null)
        return 0;
    else if(a.name == null && b.name != null)
        return 1;
    else if(a.name != null && b.name == null)
        return -1;

    let nameA = a.name.toUpperCase();
    let nameB = b.name.toUpperCase();
    if(nameA < nameB)
        return -1;
    else if(nameA > nameB)
        return 1;
    else
        return 0;
}

//given two students a, b put before the student that based on enrolment date has to stay before
function compareEnrol(a, b){
    //we put null at the end of the queue
    if(a.enrolled == null && b.enrolled == null)
        return 0;
    else if(a.enrolled != null && b.enrolled == null)
        return -1;
    else if(a.enrolled == null && b.enrolled != null)
        return 0;

    //check year
    if(a.enrolled.year == null && b.enrolled.year == null)
        return 0;
    else if(a.enrolled.year != null && b.enrolled.year == null)
        return -1;
    else if(a.enrolled.year == null && b.enrolled.year != null)
        return 0;
    else if (a.enrolled.year < b.enrolled.year)
        return -1;
    else if (a.enrolled.year > b.enrolled.year)
        return 1;
    
    //check month
    if(a.enrolled.month == null && b.enrolled.month == null)
        return 0;
    else if(a.enrolled.month != null && b.enrolled.month == null)
        return -1;
    else if(a.enrolled.month == null && b.enrolled.month != null)
        return 0;
    else if (a.enrolled.month < b.enrolled.month)
        return -1;
    else if (a.enrolled.month > b.enrolled.month)
        return 1;
    
    //check day
    if(a.enrolled.day == null && b.enrolled.day == null)
        return 0;
    else if(a.enrolled.day != null && b.enrolled.day == null)
        return -1;
    else if(a.enrolled.day == null && b.enrolled.day != null)
        return 0;
    else if (a.enrolled.day < b.enrolled.day)
        return -1;
    else if (a.enrolled.day > b.enrolled.day)
        return 1;
    
    //check hour
    if(a.enrolled.hour == null && b.enrolled.hour == null)
        return 0;
    else if(a.enrolled.hour != null && b.enrolled.hour == null)
        return -1;
    else if(a.enrolled.hour == null && b.enrolled.hour != null)
        return 0;
    else if (a.enrolled.hour < b.enrolled.hour)
        return -1;
    else if (a.enrolled.hour > b.enrolled.hour)
        return 1;
    
    //check minute
    if(a.enrolled.minute == null && b.enrolled.minute == null)
        return 0;
    else if(a.enrolled.minute != null && b.enrolled.minute == null)
        return -1;
    else if(a.enrolled.minute == null && b.enrolled.minute != null)
        return 0;
    else if (a.enrolled.minute < b.enrolled.minute)
        return -1;
    else if (a.enrolled.minute > b.enrolled.minute)
        return 1;
    
    //check second
    if(a.enrolled.second == null && b.enrolled.second == null)
        return 0;
    else if(a.enrolled.second != null && b.enrolled.second == null)
        return -1;
    else if(a.enrolled.second == null && b.enrolled.second != null)
        return 0;
    else if (a.enrolled.second < b.enrolled.second)
        return -1;
    else if (a.enrolled.second > b.enrolled.second)
        return 1;

    return 0;
}

module.exports = {connection, isAUser, isAnArrayOfUser, isAValidDate, compareAlfa, compareEnrol};