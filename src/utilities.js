//db connection
const mysql = require('mysql');
let connection;
if (process.env.NODE_ENV !== 'test') {
    connection = mysql.createConnection({
        host: 'sql7.freesqldatabase.com',
        user: 'sql7268259',
        password: 'VvFmxJMKk3',
        database: 'sql7268259'
    });
} else {
    connection = mysql.createConnection({
        host: 'sql7.freesqldatabase.com',
        user: 'sql7268710',
        password: '43qyYp5ajn',
        database: 'sql7268710'
    });
}

//return true if task is a valid task
function isATask(task) {
    return task != null && task.id != null && task.id != 'null' && isAUser(task.owner) && isATaskBody(task);
}

//return true if task has a valid body
function isATaskBody(task) {
    if (task != null && task.task_type != null && task.question != null && task.question.text != null && task.points != null) {
        if ((task.task_type == 'single_c' || task.task_type == 'multiple_c'))
            return (task.question.possibilities.length > 0);
        else if ((task.task_type == 'submit'))
            return (task.question.base_upload_url != null && task.question.possibilities.length == 0);
        else
        if ((task.task_type == 'open'))
            return (task.question.possibilities.length == 0);
    } else
        return false;
}

function isATask(task) {
    return task != null && task.id != null && task.id != 'null' && isAUser(task.owner) && isATaskBody(task);
}

function isExamBody(exam){
    return (exam != null && exam.name!=null && isAnArrayOfUser(exam.teachers) && isAUserGroup(exam.students) && exam.start_time!=null && exam.deadline!=null && exam.reviewable!=null && exam.num_shuffle!=null && (compareTwoDate(exam.deadline,exam.start_time)==1) );
}

function compareTwoDate(date1,date2){
  if(!isAValidDate(date1) && !isAValidDate(date2)){
    return 0;
  }else if(!isAValidDate(date2)){
    return 1;
  }if(!isAValidDate(date1)){
    return 2;
  }else if(date1.year>date2.year){
    return 1;
  }else if(date2.year>date1.year){
    return 2;
  }else if(date1.month>date2.month){
    return 1;
  }else if(date2.month>date1.month){
    return 2;
  }else if(date1.day>date2.day){
    return 1;
  }else if(date2.day>date1.day){
    return 2;
  }else if(date1.hour>date2.hour){
    return 1;
  }else if(date2.hour>date1.hour){
    return 2;
  }else if(date1.minute>date2.minute){
    return 1;
  }else if(date2.minute>date1.minute){
    return 2;
  }else if(date1.second>date2.second){
    return 1;
  }else if(date2.second>date1.second){
    return 2;
  }else{
    return 0;
  }
}

function isExam(exam){
    return (exam.id!=null && isExamBody(exam));
}
//return true if user is a valid user
function isAUser(user) {
    return (user != null && user.id != null && user.name != null && user.surname != null);
}

//return true if users is a valid array of user
function isAnArrayOfUser(users) {
    if (users == null || users.length == 0) {
        return false;
    } else {
        for (let user of users) {
            if (!isAUser(user))
                return false;
        }
        return true;
    }
}

//return true if userGroup is a valid userGroup body
function isAUserGroupBody(userGroup) {
    return (userGroup != null && isAUser(userGroup.creator) && userGroup.name != null && isAnArrayOfUser(userGroup.users));
}

//return true if userGroup is a valid userGroup
function isAUserGroup(userGroup) {
    return (userGroup != null && userGroup.id != null && isAUser(userGroup.creator) && userGroup.name != null && isAnArrayOfUser(userGroup.users));
}

//return true if userGroups is a valid array of userGroups
function isAnArrayOfUserGroups(userGroups) {
    if (userGroups == null || userGroups.length == 0) {
        return false;
    } else {
        for (let userGroup of userGroups) {
            if (!isAUserGroup(userGroup))
                return false;
        }
        return true;
    }
}

function isAQuestion(question){
    return (question != null && question.text != null && question.possibilities != null && question.base_upload_url != null);
}

function isASubmission(subm){
    return (subm != null && subm.id != null && (subm.task_type == 'open' || subm.task_type == 'single_c' || subm.task_type == 'multiple_c' || subm.task_type == 'submit')
        && isAQuestion(subm.question) && subm.id_user != null && subm.id_exam != null && subm.completed != null && subm.points != null && subm.points > 0);
}

function isASubmissionAnswer(subm){
    return (isASubmission(subm) && subm.answer != null);
}

function isASubmissionEvaluated(subm){
    return (isASubmission(subm) && subm.earned_points != null && subm.earned_points >=0 && subm.comment != null && subm.earned_points <= subm.points);
}

function isAnArrayOfSubmission(submissions){
    if(submissions == null || submissions.length == 0){
        return false;
    }else {
        for(let subm of submissions){
            if (!isASubmission(subm))
                return false;
        }
        return true;
    }
}

//return true if date is a valid date acceptable in our app
function isAValidDate(date) {
    if (date == null) {
        return false;
    } else return (date.year != null && date.month != null && date.day != null &&
        date.hour != null && date.minute != null && date.second != null);
}

//given two students a, b put before the student that alphabetically (based on surname, name) has to stay before
function compareAlfa(a, b) {
    //we put null at the end of the queue
    if (a == null || b == null) {
        return 0;
    } else {
        if (a.surname == null && b.surname == null)
            return 0;
        else if (a.surname == null && b.surname != null)
            return 1;
        else if (a.surname != null && b.surname == null)
            return -1;

        let surnameA = a.surname.toUpperCase();
        let surnameB = b.surname.toUpperCase();

        if (surnameA < surnameB)
            return -1;
        else if (surnameA > surnameB)
            return 1;

        if (a.name == null && b.name == null)
            return 0;
        else if (a.name == null && b.name != null)
            return 1;
        else if (a.name != null && b.name == null)
            return -1;

        let nameA = a.name.toUpperCase();
        let nameB = b.name.toUpperCase();
        if (nameA < nameB)
            return -1;
        else if (nameA > nameB)
            return 1;
        else
            return 0;
    }
}

//given two students a, b put before the student that based on enrolment date has to stay before
function compareEnrol(a, b) {
    if (a == null || b == null) {
        return 0;
    } else {
        //we put null at the end of the queue
        if (a.enrolled == null && b.enrolled == null)
            return 0;
        else if (a.enrolled != null && b.enrolled == null)
            return -1;
        else if (a.enrolled == null && b.enrolled != null)
            return 1;

        //check year
        if (a.enrolled.year == null && b.enrolled.year == null)
            return 0;
        else if (a.enrolled.year != null && b.enrolled.year == null)
            return -1;
        else if (a.enrolled.year == null && b.enrolled.year != null)
            return 1;
        else if (a.enrolled.year < b.enrolled.year)
            return -1;
        else if (a.enrolled.year > b.enrolled.year)
            return 1;

        //check month
        if (a.enrolled.month == null && b.enrolled.month == null)
            return 0;
        else if (a.enrolled.month != null && b.enrolled.month == null)
            return -1;
        else if (a.enrolled.month == null && b.enrolled.month != null)
            return 1;
        else if (a.enrolled.month < b.enrolled.month)
            return -1;
        else if (a.enrolled.month > b.enrolled.month)
            return 1;

        //check day
        if (a.enrolled.day == null && b.enrolled.day == null)
            return 0;
        else if (a.enrolled.day != null && b.enrolled.day == null)
            return -1;
        else if (a.enrolled.day == null && b.enrolled.day != null)
            return 1;
        else if (a.enrolled.day < b.enrolled.day)
            return -1;
        else if (a.enrolled.day > b.enrolled.day)
            return 1;

        //check hour
        if (a.enrolled.hour == null && b.enrolled.hour == null)
            return 0;
        else if (a.enrolled.hour != null && b.enrolled.hour == null)
            return -1;
        else if (a.enrolled.hour == null && b.enrolled.hour != null)
            return 1;
        else if (a.enrolled.hour < b.enrolled.hour)
            return -1;
        else if (a.enrolled.hour > b.enrolled.hour)
            return 1;

        //check minute
        if (a.enrolled.minute == null && b.enrolled.minute == null)
            return 0;
        else if (a.enrolled.minute != null && b.enrolled.minute == null)
            return -1;
        else if (a.enrolled.minute == null && b.enrolled.minute != null)
            return 1;
        else if (a.enrolled.minute < b.enrolled.minute)
            return -1;
        else if (a.enrolled.minute > b.enrolled.minute)
            return 1;

        //check second
        if (a.enrolled.second == null && b.enrolled.second == null)
            return 0;
        else if (a.enrolled.second != null && b.enrolled.second == null)
            return -1;
        else if (a.enrolled.second == null && b.enrolled.second != null)
            return 1;
        else if (a.enrolled.second < b.enrolled.second)
            return -1;
        else if (a.enrolled.second > b.enrolled.second)
            return 1;

        return 0;
    }
}

function convertMonth(month) {
    let ret = 0;
    switch (month) {
        case 'Jan':
            ret = 1;
            break;
        case 'Feb':
            ret = 2;
            break;
        case 'Mar':
            ret = 3;
            break;
        case 'Apr':
            ret = 4;
            break;
        case 'May':
            ret = 5;
            break;
        case 'Jun':
            ret = 6;
            break;
        case 'Jul':
            ret = 7;
            break;
        case 'Aug':
            ret = 8;
            break;
        case 'Sep':
            ret = 9;
            break;
        case 'Oct':
            ret = 10;
            break;
        case 'Nov':
            ret = 11;
            break;
        case 'Dic':
            ret = 12;
            break;
        default:
            break;
    }
    return ret;
}

module.exports = {connection, isATask, isATaskBody, isAUser, isAnArrayOfUser, isAValidDate, compareAlfa, compareEnrol, convertMonth, isAUserGroupBody, isAUserGroup, isAnArrayOfUserGroups, isASubmission, isAnArrayOfSubmission, isASubmissionAnswer, isASubmissionEvaluated, compareTwoDate,isExam, isExamBody};
