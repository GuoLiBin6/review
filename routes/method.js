

/**
 * 获得本地时间
 * @param  
 * @return 当前时间年月日时分的字符串
 *
 **/
let getNowFormatDate = () => {
    let date = new Date();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if(month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if(strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    let currentdate = date.getFullYear()  + month  + strDate +
       + date.getHours()  + date.getMinutes() ;
    return currentdate;
}

module.exports = {
	getNowFormatDate
}
