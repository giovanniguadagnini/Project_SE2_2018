function getAllUsers(enrolledBefore, enrolledAfter){
    if((enrolledBefore == 0) && (enrolledAfter == 0)){//special case for empty db
        return null;
    }
    if((enrolledBefore != -1) && (enrolledAfter != -1)){
        if(compareDatetime(enrolledAfter, enrolledBefore))
            return [{'name': 'Gio1',  'surname' : 'Guadagnini','password' : 'aaaa',  'email' : 'giovanni.guadagnini@gmail.com', 'born' : '17/10/1997'}];
    }
    if((enrolledBefore == -1) && (enrolledAfter != -1)){
        return [{'name': 'Gio2',  'surname' : 'Guadagnini','password' : 'aaaa',  'email' : 'giovanni.guadagnini@gmail.com', 'born' : '17/10/1997'}];
    }
    if((enrolledBefore != -1) && (enrolledAfter == -1)){
        return [{'name': 'Gio3',  'surname' : 'Guadagnini','password' : 'aaaa',  'email' : 'giovanni.guadagnini@gmail.com', 'born' : '17/10/1997'}];
    }
    if((enrolledBefore == -1) && (enrolledAfter == -1)){
        return [{'name': 'Gio4',  'surname' : 'Guadagnini','password' : 'aaaa',  'email' : 'giovanni.guadagnini@gmail.com', 'born' : '17/10/1997'}];
    }
}

function createUser(user){
    if(user != null){
        if(user.name != null && user.surname != null && user.password != null && user.email != null && user.born != null)
            return user;
        else return null;
    }
    else return null;
}

function getUser(id){
    if(Number.isInteger(id)){
        if(id == 1)
            return {'name': 'Giovanni',  'surname' : 'Guadagnini','password' : 'aaaa',  'email' : 'giovanni.guadagnini@gmail.com', 'born' : '17/10/1997'};
        else return null;
    }
    else return null;
}

function updateUser(user){
    if(user != null){
        if(user.name != null && user.surname != null && user.password != null && user.email != null && user.born != null)
            return user;
        else return null;
    }
    else return null;
}

function compareDatetime(date1, date2){
    return true;
}
module.exports = {getAllUsers, createUser, getUser, updateUser};
