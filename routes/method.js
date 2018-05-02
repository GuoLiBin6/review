var crypto = require('crypto');

/**
 * 获得本地时间
 * @param  
 * @return 当前时间年月日时分的字符串
 *
 **/
let getNowFormatDate = () =>  {
	    let date  =  new  Date();
	    let month  =  date.getMonth()  +  1;
	    let strDate  =  date.getDate();
	let hour = date.getHours();
	let minute = date.getMinutes();
	    if (month  >=  1  &&  month  <=  9)  {
		        month  =  "0"  +  month;
	    }
	    if (strDate  >=  0  &&  strDate  <=  9)  {
		        strDate  =  "0"  +  strDate;
	    }
	if (hour >= 0 && hour <= 9) {
		hour = "0" + hour;
	}
	if (minute >= 0 && minute <= 9) {
		minute = "0" + minute;
	}
	    let currentdate  =  date.getFullYear()   +  month   +  strDate  + hour   +  minute ;
	    return  currentdate;
}

let md5s = (str) =>{
	var crypto = require('crypto');  //加载加密文件
	var md5 = crypto.createHash('md5');  
  	md5.update(str);  
	str = md5.digest('hex'); 
	return str;
}

module.exports = {
	getNowFormatDate,
	md5s
}
