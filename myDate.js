function convertMonth(month){
    let ret = 0;
    switch(month) {
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
        default :
            break;
    }
    return ret;
}

module.exports = {convertMonth};